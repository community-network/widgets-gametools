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
  wonGames: number;
  lostGames: number;
  killsRealPlayers: number;
  deathsFinished: number;
  placementLastPlayedGame: number;
}

export interface SessionReturn {
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

export interface StatsReturn {
  killsRealPlayers: number;
  deathsFinished: number;
  wonGames: number;
  lostGames: number;
}

export class ApiProvider extends JsonClient {
  async profile({
    id
  }: { id: number | undefined | string }) {
    if (id === undefined) {
      return undefined;
    }

    const r = await fetch(`https://tracker.redseccentral.com/api/profiles/${id}`);
    const result: ProfileReturn = await r.json();
    return result;
  }

  async lastSession({
    id
  }: { id: string | undefined }) {
    if (id === undefined) {
      return undefined;
    }

    const r = await fetch(`https://tracker.redseccentral.com/api/sessions?playerId=${id}&page=1&pageSize=1&ordering=NewestFirst`);
    const result: SessionReturn[] = await r.json();
    return result?.find(d => d) || undefined;
  }

  async sessions({
    id,
    amount
  }: { id: string | undefined, amount: number | undefined }) {
    if (id === undefined) {
      return undefined;
    }

    const r = await fetch(`https://tracker.redseccentral.com/api/sessions?playerId=${id}&page=1&pageSize=${amount}&ordering=NewestFirst`);
    const result: SessionReturn[] = await r.json();
    return result;
  }

  async stats({
    id
  }: { id: string | undefined }) {
    if (id === undefined) {
      return undefined;
    }

    const r = await fetch(`https://tracker.redseccentral.com/api/stats?playerId=${id}&gameMode=GraniteSquad0&season=Season4&gameType=Competitive`);
    const result: StatsReturn = await r.json();
    return result;
  }
}

export const GetBfRanked = new ApiProvider();