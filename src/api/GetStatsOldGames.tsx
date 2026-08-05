import JsonClient from "./JsonOldGames";
import { type OldGames } from "./ReturnTypes";

export class ApiProvider extends JsonClient {
  constructor() {
    super();
  }

  async server({
    gamename,
    host,
    port,
  }: {
    gamename: string | undefined;
    host: string | undefined;
    port: string | undefined;
  }): Promise<OldGames> {
    return await this.getJsonMethod(`/game/${gamename}/${host}/${port}`, {});
  }
}

export const GetStatsOldGames = new ApiProvider();
