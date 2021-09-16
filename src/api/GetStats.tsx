import JsonClient from "./Json";

export class ApiProvider extends JsonClient {
  constructor() {
    super();
  }

  async stats({ game, type, getter, userName, lang, platform = "pc" }) {
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

  async server({
    game,
    getter,
    serverName,
    lang,
    region = "all",
    platform = "pc",
  }) {
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
