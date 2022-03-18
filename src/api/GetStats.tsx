import JsonClient from "./Json";
import {
  DetailedServerInfo,
  MainStats,
  seederPlayersReturn,
} from "./ReturnTypes";

interface seederPlayerlist {
  game: string;
  gameId?: string;
  id?: string;
  name?: string;
}

interface PlayerInfo {
  game: string;
  type: string;
  getter: string;
  userName: string;
  lang: string;
  platform?: string;
}

interface ServerInfo {
  game: string;
  getter: string;
  serverName: string;
  lang: string;
  region?: string;
  platform?: string;
}

export class ApiProvider extends JsonClient {
  constructor() {
    super();
  }

  async stats({
    game,
    type,
    getter,
    userName,
    lang,
    platform = "pc",
  }: PlayerInfo): Promise<MainStats> {
    if (getter == "playerid") {
      return await this.getJsonMethod(`/${game}/${type}/`, {
        playerid: userName,
        lang: lang,
        platform: platform,
      });
    }
    return await this.getJsonMethod(`/${game}/${type}/`, {
      name: encodeURIComponent(userName),
      lang: lang,
      platform: platform,
    });
  }

  async seederPlayerList({
    game,
    gameId = undefined,
    id = undefined,
    name = undefined,
  }: seederPlayerlist): Promise<seederPlayersReturn> {
    const gameStuff = game.split(".");
    if (id !== undefined) {
      return await this.getJsonMethod(`/${gameStuff[0]}/seederplayers/`, {
        id: id,
      });
    }
    if (gameId != undefined) {
      return await this.getJsonMethod(`/${gameStuff[0]}/seederplayers/`, {
        gameId: gameId,
      });
    }
    if (name != undefined) {
      return await this.getJsonMethod(`/${gameStuff[0]}/seederplayers/`, {
        name: name,
      });
    }
  }

  async server({
    game,
    getter,
    serverName,
    lang,
    region = "all",
    platform = "pc",
  }: ServerInfo): Promise<DetailedServerInfo> {
    const gameStuff = game.split(".");
    if (platform == "all") {
      platform = "pc";
    }
    if (getter == "gameid") {
      return await this.getJsonMethod(`/${gameStuff[0]}/detailedserver/`, {
        gameid: serverName,
        lang: lang,
        region: region,
        platform: platform,
        service: gameStuff[1],
      });
    }
    return await this.getJsonMethod(`/${gameStuff[0]}/detailedserver/`, {
      name: encodeURIComponent(serverName),
      lang: lang,
      region: region,
      platform: platform,
      service: gameStuff[1],
    });
  }
}

export const GetStats = new ApiProvider();
