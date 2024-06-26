import * as React from "react";
import "../locales/config";
import { useTranslation } from "react-i18next";
import { GetBfListStats, PlayerInfoReturn } from "../api/BfList";
import { GetStats } from "../api/GetStats";
import { useQuery } from "react-query";
import { getLanguage } from "../locales/config";
import { bflistGames } from "../api/static";
import {
  MainStats,
  seederPlayer,
  seederPlayersReturn,
} from "../api/ReturnTypes";
import { Routes, useMatch, Route } from "react-router-dom";
import * as styles from "./Streamer.module.scss";
import { calculateZoomStyle } from "./functions/calculateZoom";

function statsSelector(
  guid: string,
  username: string,
): Promise<PlayerInfoReturn | seederPlayersReturn> {
  if (bflistGames.includes(guid)) {
    return GetBfListStats.stats({
      game: guid,
      userName: username,
    });
  }

  return GetStats.seederPlayerList({
    game: "bf1",
    id: guid,
  });
}

export function GameStreamStat(): React.ReactElement {
  const match = useMatch("/ingamestream/:id/:player/:lang/:zoom");
  const { t, i18n } = useTranslation();

  React.useState(() => {
    i18n.changeLanguage(match.params.lang);
  });

  const guid = match.params.id;

  // Promise<PlayerInfoReturn> | Promise<seederPlayersReturn>
  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery<
    seederPlayersReturn | PlayerInfoReturn,
    unknown,
    seederPlayersReturn | PlayerInfoReturn,
    string
  >(
    "seederPlayerList" + guid + match.params.player,
    () => statsSelector(guid, match.params.player),
    {
      retry: 2,
      staleTime: 1000 * 3, // seconds
      cacheTime: 1000 * 3, // seconds
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchOnReconnect: "always",
      refetchInterval: 1000 * 3, // seconds
      refetchIntervalInBackground: true,
    },
  );

  if (!loading && !error) {
    // if seederid not found
    if (stats == undefined || "errors" in stats) {
      return (
        <span className="Main" style={calculateZoomStyle(match.params.zoom)}>
          <div className={styles.StreamColumn}>
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("stats.main")}</h4>
              <p className={styles.Description}>{t("streamer.noserver")}</p>
            </div>
          </div>
        </span>
      );
    }

    let currentPlayer = undefined;
    if (!bflistGames.includes(guid)) {
      // bf1
      const players = stats.teams[0].players.concat(stats.teams[1].players);
      players.forEach((player: seederPlayer) => {
        const playerName = player.name.replace(/(?=\[)(.*?)(?<=\])/gm, "");
        if (
          player.player_id.toString() == match.params.player ||
          player.name == match.params.player ||
          playerName == match.params.player
        ) {
          currentPlayer = player;
        }
      });
    } else {
      // older
      currentPlayer = stats;
    }
    if (currentPlayer != undefined) {
      return (
        <span className="Main" style={calculateZoomStyle(match.params.zoom)}>
          <div className={styles.StreamColumn}>
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("stats.score")}</h4>
              <p className={styles.Description}>{currentPlayer.score}</p>
            </div>
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("stats.kills")}</h4>
              <p className={styles.Description}>{currentPlayer.kills}</p>
            </div>
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("stats.deaths")}</h4>
              <p className={styles.Description}>{currentPlayer.deaths}</p>
            </div>
          </div>
        </span>
      );
    } else {
      // player not in server
      return (
        <span className="Main" style={calculateZoomStyle(match.params.zoom)}>
          <div className={styles.StreamColumn}>
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("stats.main")}</h4>
              <p className={styles.Description}>{t("streamer.noplayer")}</p>
            </div>
          </div>
        </span>
      );
    }
  } else {
    // loading
    return (
      <span className="Main" style={calculateZoomStyle(match.params.zoom)}>
        <div className={styles.StreamColumn}>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.main")}</h4>
            <p className={styles.Description}>{t("loading")}</p>
          </div>
        </div>
      </span>
    );
  }
}

export function GameStreamScore(): React.ReactElement {
  const match = useMatch("/streamscore/:id/:lang/:zoom");
  const { t, i18n } = useTranslation();

  React.useState(() => {
    i18n.changeLanguage(match.params.lang);
  });

  const guid = match.params.id;
  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery<seederPlayersReturn, unknown, seederPlayersReturn, string>(
    "seederPlayerList" + guid,
    () =>
      GetStats.seederPlayerList({
        game: "bf1",
        id: guid,
      }),
    {
      retry: 2,
      staleTime: 1000 * 3, // seconds
      cacheTime: 1000 * 3, // seconds
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchOnReconnect: "always",
      refetchInterval: 1000 * 3, // seconds
      refetchIntervalInBackground: true,
    },
  );
  if (!loading && !error) {
    // if seederid not found
    if (stats == undefined || "errors" in stats) {
      return (
        <span className="Main" style={calculateZoomStyle(match.params.zoom)}>
          <div className={styles.StreamColumn}>
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("stats.main")}</h4>
              <p className={styles.Description}>{t("streamer.noserver")}</p>
            </div>
          </div>
        </span>
      );
    }

    const teams = [
      { score: 0, kills: 0, deaths: 0, vehicles: 0, alive: 0 },
      { score: 0, kills: 0, deaths: 0, vehicles: 0, alive: 0 },
    ];

    stats.teams.forEach((team, index) => {
      team.players.forEach((player) => {
        if (player.vehicle != null) {
          teams[index].vehicles += 1;
        }
        if (player.vehicle != null || player.weapons.length > 0) {
          teams[index].alive += 1;
        }
        teams[index].kills += player.kills;
        teams[index].deaths += player.deaths;
        teams[index].score += player.score;
      });
    });

    const kdTeamOne = teams[0].kills / teams[0].deaths || 0.0;
    const kdTeamTwo = teams[1].kills / teams[1].deaths || 0.0;

    return (
      <span className="Main" style={calculateZoomStyle(match.params.zoom)}>
        <div className={styles.StreamColumn}>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.alive")}</h4>
            <p className={styles.Description}>{teams[0].alive}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.vehicles")}</h4>
            <p className={styles.Description}>{teams[0].vehicles}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.score")}</h4>
            <p className={styles.Description}>{teams[0].score}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.killDeath")}</h4>
            <p className={styles.Description}>
              {(kdTeamOne === Infinity ? teams[0].kills : kdTeamOne).toFixed(2)}
            </p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{stats.teams[0].name}</h4>
          </div>
          <div className={styles.Row}>
            <p className={styles.Description}>VS</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{stats.teams[1].name}</h4>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.killDeath")}</h4>
            <p className={styles.Description}>
              {(kdTeamTwo === Infinity ? teams[1].kills : kdTeamTwo).toFixed(2)}
            </p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.score")}</h4>
            <p className={styles.Description}>{teams[1].score}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.vehicles")}</h4>
            <p className={styles.Description}>{teams[1].vehicles}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.alive")}</h4>
            <p className={styles.Description}>{teams[1].alive}</p>
          </div>
        </div>
      </span>
    );
  } else {
    // loading
    return (
      <span className="Main" style={calculateZoomStyle(match.params.zoom)}>
        <div className={styles.StreamColumn}>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.main")}</h4>
            <p className={styles.Description}>{t("loading")}</p>
          </div>
        </div>
      </span>
    );
  }
}

export function SteamStat(): React.ReactElement {
  const match = useMatch("/stream/:plat/:type/:eaid/:gameid/:lang/:zoom");
  const { t, i18n } = useTranslation();

  React.useState(() => {
    i18n.changeLanguage(match.params.lang);
  });

  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery<MainStats, unknown, MainStats, string>(
    "stats" + match.params.gameid + match.params.eaid,
    () =>
      GetStats.stats({
        game: match.params.gameid,
        type: "stats",
        getter: match.params.type,
        userName: match.params.eaid,
        lang: getLanguage(),
      }),
    {
      retry: 2,
      staleTime: 1000 * 30, // 30 seconds
      cacheTime: 1000 * 30, //30 seconds
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchOnReconnect: "always",
      refetchInterval: 1000 * 30, //30 seconds
      refetchIntervalInBackground: true,
    },
  );
  if (!loading && !error) {
    if (stats == undefined) {
      return <div>resultNotFound</div>;
    }
    return (
      <span className="Main" style={calculateZoomStyle(match.params.zoom)}>
        <div className={styles.StreamColumn}>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.killsPerMinute")}</h4>
            <p className={styles.Description}>{stats.killsPerMinute}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.killsPerMinute")}</h4>
            <p className={styles.Description}>{stats.scorePerMinute}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.skill")}</h4>
            <p className={styles.Description}>{stats.skill}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.killDeath")}</h4>
            <p className={styles.Description}>{stats.killDeath}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.longestHeadShot")}</h4>
            <p className={styles.Description}>{stats.longestHeadShot}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.winPercent")}</h4>
            <p className={styles.Description}>{stats.winPercent}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.headshotPercent")}</h4>
            <p className={styles.Description}>{stats.headshots}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.accuracy")}</h4>
            <p className={styles.Description}>{stats.accuracy}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.bestClass")}</h4>
            <p className={styles.Description}>{stats.bestClass}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.highestKillStreak")}</h4>
            <p className={styles.Description}>{stats.highestKillStreak}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.revives")}</h4>
            <p className={styles.Description}>{stats.revives}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.infantryKillDeath")}</h4>
            <p className={styles.Description}>{stats.infantryKillDeath}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>
              {t("stats.infantryKillsPerMinute")}
            </h4>
            <p className={styles.Description}>{stats.infantryKillsPerMinute}</p>
          </div>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("stats.timePlayed")}</h4>
            <p className={styles.Description}>{stats.timePlayed}</p>
          </div>
        </div>
      </span>
    );
  } else {
    return <div></div>;
  }
}

export default function Routing(): React.ReactElement {
  return (
    <Routes>
      <Route
        path="/stream/:plat/:type/:eaid/:gameid/:lang/:zoom"
        element={<SteamStat />}
      />
      <Route
        path="/ingamestream/:id/:player/:lang/:zoom"
        element={<GameStreamStat />}
      />
      <Route
        path="/streamscore/:id/:lang/:zoom"
        element={<GameStreamScore />}
      />
    </Routes>
  );
}
