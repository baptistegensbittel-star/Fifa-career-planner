export interface ClubData {
  club: string;
  league: string;
  players: { n: string; p: string }[];
}

export interface FlatPlayer {
  name: string;
  position: string;
  club: string;
}

let clubsCache: Promise<ClubData[]> | null = null;

export function loadClubs(): Promise<ClubData[]> {
  if (!clubsCache) {
    clubsCache = fetch(`${import.meta.env.BASE_URL}data/clubs.json`).then((res) => {
      if (!res.ok) throw new Error('failed to load clubs.json');
      return res.json() as Promise<ClubData[]>;
    });
  }
  return clubsCache;
}

let indexCache: Promise<FlatPlayer[]> | null = null;

export function loadPlayerIndex(): Promise<FlatPlayer[]> {
  if (!indexCache) {
    indexCache = loadClubs().then((clubs) =>
      clubs.flatMap((c) => c.players.map((p) => ({ name: p.n, position: p.p, club: c.club }))),
    );
  }
  return indexCache;
}
