import JsonClient from "./JsonOldGames";
import { OldGames } from "./ReturnTypes";

export class ApiProvider extends JsonClient {
  constructor() {
    super();
  }

  async server({
    group,
    number,
  }: {
    group: string;
    number: string;
  }): Promise<OldGames> {
    return await this.getJsonMethod(`/${group}/${number}/`, {});
  }
}

export const GetStatsOldGames = new ApiProvider();
