import JsonClient from "./JsonBfList";

interface PlayerInfo {
  game: string;
  userName: string;
}

export interface PlayerInfoReturn {
  name: string;
  team: number;
  squad: number;
  squadLabel: string;
  kills: number;
  deaths: number;
  score: number;
  rank: number;
  rankLabel: string;
  ping: number;
  type: number;
  typeLabel: string;
}

export class ApiProvider extends JsonClient {
  constructor() {
    super();
  }

  async stats({ game, userName }: PlayerInfo): Promise<PlayerInfoReturn> {
    return await this.getJsonMethod(`/${game}/v1/players/${userName}`, {});
  }
}

export const GetBfListStats = new ApiProvider();
