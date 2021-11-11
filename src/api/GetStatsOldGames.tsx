import JsonClient from "./JsonOldGames";

export class ApiProvider extends JsonClient {
  constructor() {
    super();
  }

  async server({ group, number }) {
    return await this.getJsonMethod(`/${group}/${number}/`, {});
  }
}

export const GetStatsOldGames = new ApiProvider();
