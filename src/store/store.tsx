import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import type { ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  AppState,
  Career,
  DepthCategory,
  Player,
  PositionCode,
} from '../types/domain';

const STORAGE_KEY = 'fifa-career-planner:v1';

type Action =
  | { type: 'HYDRATE'; state: AppState }
  | { type: 'ADD_CAREER'; career: Career }
  | { type: 'UPDATE_CAREER'; id: string; patch: Partial<Career> }
  | { type: 'DELETE_CAREER'; id: string }
  | { type: 'SET_ACTIVE_CAREER'; id: string | null }
  | { type: 'ADD_PLAYER'; player: Player }
  | { type: 'UPDATE_PLAYER'; id: string; patch: Partial<Player> }
  | { type: 'DELETE_PLAYER'; id: string }
  | {
      type: 'REORDER_DEPTH';
      careerId: string;
      positionCode: PositionCode;
      depthCategory: DepthCategory;
      orderedIds: string[];
    }
  | { type: 'IMPORT_STATE'; state: AppState };

const initialState: AppState = {
  careers: [],
  players: [],
  activeCareerId: null,
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.careers || !parsed.players) return initialState;
    return parsed;
  } catch {
    return initialState;
  }
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
    case 'IMPORT_STATE':
      return action.state;
    case 'ADD_CAREER':
      return {
        ...state,
        careers: [...state.careers, action.career],
        activeCareerId: action.career.id,
      };
    case 'UPDATE_CAREER':
      return {
        ...state,
        careers: state.careers.map((c) =>
          c.id === action.id ? { ...c, ...action.patch, updatedAt: Date.now() } : c,
        ),
      };
    case 'DELETE_CAREER': {
      const careers = state.careers.filter((c) => c.id !== action.id);
      const players = state.players.filter((p) => p.careerId !== action.id);
      const activeCareerId =
        state.activeCareerId === action.id
          ? (careers[0]?.id ?? null)
          : state.activeCareerId;
      return { ...state, careers, players, activeCareerId };
    }
    case 'SET_ACTIVE_CAREER':
      return { ...state, activeCareerId: action.id };
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.player] };
    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, ...action.patch, updatedAt: Date.now() } : p,
        ),
      };
    case 'DELETE_PLAYER':
      return { ...state, players: state.players.filter((p) => p.id !== action.id) };
    case 'REORDER_DEPTH': {
      const orderMap = new Map(action.orderedIds.map((id, idx) => [id, idx]));
      return {
        ...state,
        players: state.players.map((p) => {
          if (
            p.careerId === action.careerId &&
            p.positionCode === action.positionCode &&
            p.depthCategory === action.depthCategory &&
            orderMap.has(p.id)
          ) {
            return { ...p, depthOrder: orderMap.get(p.id)!, updatedAt: Date.now() };
          }
          return p;
        }),
      };
    }
    default:
      return state;
  }
}

interface StoreApi {
  state: AppState;
  activeCareer: Career | null;
  careerPlayers: Player[];
  addCareer: (input: Pick<Career, 'name' | 'club' | 'season' | 'formation'>) => string;
  updateCareer: (id: string, patch: Partial<Career>) => void;
  deleteCareer: (id: string) => void;
  setActiveCareer: (id: string | null) => void;
  addPlayer: (input: Partial<Player> & { name: string; positionCode: PositionCode }) => string;
  updatePlayer: (id: string, patch: Partial<Player>) => void;
  deletePlayer: (id: string) => void;
  reorderDepth: (
    positionCode: PositionCode,
    depthCategory: DepthCategory,
    orderedIds: string[],
  ) => void;
  exportState: () => string;
  importState: (json: string) => boolean;
  resetAll: () => void;
}

const StoreContext = createContext<StoreApi | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeCareer = useMemo(
    () => state.careers.find((c) => c.id === state.activeCareerId) ?? null,
    [state.careers, state.activeCareerId],
  );

  const careerPlayers = useMemo(
    () =>
      activeCareer
        ? state.players.filter((p) => p.careerId === activeCareer.id)
        : [],
    [state.players, activeCareer],
  );

  const addCareer = useCallback<StoreApi['addCareer']>((input) => {
    const id = uuidv4();
    const now = Date.now();
    dispatch({
      type: 'ADD_CAREER',
      career: { id, createdAt: now, updatedAt: now, ...input },
    });
    return id;
  }, []);

  const updateCareer = useCallback<StoreApi['updateCareer']>((id, patch) => {
    dispatch({ type: 'UPDATE_CAREER', id, patch });
  }, []);

  const deleteCareer = useCallback<StoreApi['deleteCareer']>((id) => {
    dispatch({ type: 'DELETE_CAREER', id });
  }, []);

  const setActiveCareer = useCallback<StoreApi['setActiveCareer']>((id) => {
    dispatch({ type: 'SET_ACTIVE_CAREER', id });
  }, []);

  const addPlayer = useCallback<StoreApi['addPlayer']>(
    (input) => {
      const id = uuidv4();
      const now = Date.now();
      if (!activeCareer) return id;
      const player: Player = {
        id,
        careerId: activeCareer.id,
        name: input.name,
        positionCode: input.positionCode,
        status: input.status ?? 'squad',
        depthCategory: input.depthCategory ?? 'titulaire',
        depthOrder: input.depthOrder ?? 999,
        tier: input.tier ?? null,
        rating: input.rating ?? null,
        age: input.age ?? null,
        potential: input.potential ?? null,
        value: input.value ?? '',
        contractEnd: input.contractEnd ?? '',
        sofifaUrl: input.sofifaUrl ?? '',
        destinationClub: input.destinationClub ?? '',
        notes: input.notes ?? '',
        createdAt: now,
        updatedAt: now,
      };
      dispatch({ type: 'ADD_PLAYER', player });
      return id;
    },
    [activeCareer],
  );

  const updatePlayer = useCallback<StoreApi['updatePlayer']>((id, patch) => {
    dispatch({ type: 'UPDATE_PLAYER', id, patch });
  }, []);

  const deletePlayer = useCallback<StoreApi['deletePlayer']>((id) => {
    dispatch({ type: 'DELETE_PLAYER', id });
  }, []);

  const reorderDepth = useCallback<StoreApi['reorderDepth']>(
    (positionCode, depthCategory, orderedIds) => {
      if (!activeCareer) return;
      dispatch({
        type: 'REORDER_DEPTH',
        careerId: activeCareer.id,
        positionCode,
        depthCategory,
        orderedIds,
      });
    },
    [activeCareer],
  );

  const exportState = useCallback(() => JSON.stringify(state, null, 2), [state]);

  const importState = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as AppState;
      if (!Array.isArray(parsed.careers) || !Array.isArray(parsed.players)) {
        return false;
      }
      dispatch({ type: 'IMPORT_STATE', state: parsed });
      return true;
    } catch {
      return false;
    }
  }, []);

  const resetAll = useCallback(() => {
    dispatch({ type: 'IMPORT_STATE', state: initialState });
  }, []);

  const value: StoreApi = {
    state,
    activeCareer,
    careerPlayers,
    addCareer,
    updateCareer,
    deleteCareer,
    setActiveCareer,
    addPlayer,
    updatePlayer,
    deletePlayer,
    reorderDepth,
    exportState,
    importState,
    resetAll,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreApi {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
