import JsonClient from "./JsonOldGames";
import { OldGames } from "./ReturnTypes";

export class ApiProvider extends JsonClient {
  constructor() {
    super();
  }

  async server({
    gamename,
    host,
    port,
  }: {
    gamename: string;
    host: string;
    port: string;
  }): Promise<OldGames> {
    return await this.getJsonMethod(`/game/${gamename}/${host}/${port}`, {});
  }
}

export const GetStatsOldGames = new ApiProvider();
