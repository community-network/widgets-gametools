import JsonClient from "./Json";
import {
  DetailedServerInfo,
  MainStats,
  seederPlayersReturn,
} from "./ReturnTypes";
import { battlebitApi } from "./battlebitApi";
import { MarneApi } from "./marneApi";

interface SeederPlayerlist {
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
  with_ownername?: boolean;
}

export interface Bf1PlayerReturn {
  userId: number;
  avatar: string;
  userName: string;
  id: number;
}

export class ApiProvider extends JsonClient {
  async stats({
    game,
    type,
    getter,
    userName,
    lang,
    platform = "pc",
  }: PlayerInfo): Promise<MainStats> {
    if (game.includes("marne")) {
      let playerId, playerInfo;
      if (getter !== "playerid") {
        const result = await this.bf1PlayerSearch({
          name: encodeURIComponent(userName),
        });
        playerInfo = result;
        playerId = result.id;
      } else {
        const result = await this.bf1PlayerSearch({
          playerId: userName,
        });
        playerInfo = result;
        playerId = userName;
      }
      return await MarneApi.stats({
        game: game,
        playerId: playerId,
        playerInfo: playerInfo,
      });
    }
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
  }: SeederPlayerlist): Promise<seederPlayersReturn> {
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
    with_ownername = true,
  }: ServerInfo): Promise<DetailedServerInfo> {
    if (serverName == "undefined") {
      return undefined;
    }
    const gameStuff = game.split(".");
    if (platform == "all") {
      platform = "pc";
    }
    const defaultParams = {
      lang: lang,
      region: region,
      platform: platform,
      service: gameStuff[1],
      return_ownername: with_ownername.toString(),
    };
    if (game == "battlebit") {
      return await battlebitApi.serverList({
        searchTerm: serverName,
        region,
      });
    }
    if (game.includes("marne")) {
      return await MarneApi.serverList({
        game: game,
        searchTerm: serverName,
        regions: [region],
      });
    }
    if ((getter == "gameid" || getter == "serverid") && ["bf2042", "bf6"].includes(game)) {
      return await this.getJsonMethod(`/${gameStuff[0]}/detailedserver/`, {
        serverid: serverName,
        ...defaultParams,
      });
    } else if (getter == "gameid") {
      return await this.getJsonMethod(`/${gameStuff[0]}/detailedserver/`, {
        gameid: serverName,
        ...defaultParams,
      });
    } else if (getter == "serverip") {
      const result = await this.getJsonMethod(`/${gameStuff[0]}/servers`, {
        name: encodeURIComponent(serverName),
        type: "ip",
        service: gameStuff[1],
        platform: platform,
      });
      return result.servers[0];
    }
    return await this.getJsonMethod(`/${gameStuff[0]}/detailedserver/`, {
      name: encodeURIComponent(serverName),
      ...defaultParams,
    });
  }

  async bf1PlayerSearch({
    name,
    playerId,
  }: {
    name?: string;
    playerId?: string;
  }): Promise<Bf1PlayerReturn> {
    if (playerId) {
      return await this.getJsonMethod(`/bf1/player/`, {
        playerid: playerId,
      });
    }
    return await this.getJsonMethod(`/bf1/player/`, {
      name: name,
    });
  }
}

export const GetStats = new ApiProvider();
