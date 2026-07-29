import JsonClient from "./Json";

export interface CompetitiveRanks {
  mode: string;
  rank: string;
  division: string;
  name: string;
  timestampUtc: string;
}

export interface ProfileReturn {
  playerId: number;
  playerName: string;
  nucleusId: number;
  personaId: number;
  competitiveRanks: CompetitiveRanks[]
}

export interface Stats {
  killsRealPlayers: number;
  deathsFinished: number;
  placementLastPlayedGame: number;
}

export interface StatsReturn {
  id: number
  snapshotId: number
  previousSnapshotId: number
  playerId: number
  gameMode: string
  season: string
  gameType: string
  timestampUtc: string
  stats: Stats
}

export class ApiProvider extends JsonClient {
  async profile({
    id
  }: { id: number | undefined }) {
    if (id === undefined) {
      return undefined;
    }

    const r = await fetch(`https://tracker.redseccentral.com/api/profiles/${id}`);
    const result: ProfileReturn = await r.json();
    return result;
  }

  async lastSession({
    id
  }: { id: number | undefined }) {
    if (id === undefined) {
      return undefined;
    }

    const r = await fetch(`https://tracker.redseccentral.com/api/sessions?playerId=${id}&page=1&pageSize=1&ordering=NewestFirst`);
    const result: StatsReturn[] = await r.json();
    return result?.find(d => d) || undefined;
  }
}

export const GetBfRanked = new ApiProvider();