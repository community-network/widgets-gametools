import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Route, Routes, useMatch } from "react-router";
import { GetStatsOldGames } from "../api/GetStatsOldGames";
import "../locales/config";
import * as styles from "./OldGames.module.scss";
import * as serverStyles from "./Servers.module.scss";
import { maps as hll_maps } from "../api/oldGameMaps/hll";
import { useTranslation } from "react-i18next";

export function OldGame(): React.ReactElement {
  const match = useMatch("/oldgames/detailed/:gamename/:host/:port");
  const { gamename, host, port } = match.params;
  const { t } = useTranslation();

  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery({
    queryKey: ["oldServers" + gamename + host + port],
    queryFn: () =>
      GetStatsOldGames.server({
        gamename: gamename,
        host: host,
        port: port,
      }),
    retry: 1,
  });

  if (loading || error) {
    return (
      <span className={styles.BigServer}>
        <span className={serverStyles.Circle} />
        <b>{t("loading")}</b>
        <b style={{ marginLeft: "auto", paddingLeft: "1rem" }}>0/0</b>
      </span>
    );
  }
  if (stats == undefined) {
    return <div>{t("server.notFound")}</div>;
  }

  let backgroundImage = `url(/${gamename}.jpg)`;
  let mapName: string | undefined = undefined;

  if (gamename === "hll") {
    const mapInfo = hll_maps.find((item) => item.queryName == stats.map);
    if (mapInfo !== undefined) {
      backgroundImage = `url(https://cdn.gametools.network/maps/hll/${mapInfo.image}.webp)`;
      mapName = mapInfo.base;
    }
  }

  return (
    <div className={styles.BigServer}>
      <div className={styles.BigServerImage} style={{ backgroundImage }} />
      <div>
        <h4 style={{ margin: 0, marginTop: "0.6rem", color: "white" }}>
          {stats.name}
        </h4>
        <div className={serverStyles.Column}>
          <div className={serverStyles.Row}>
            <h4 className={serverStyles.Title}>{t("server.players")}</h4>
            <p className={serverStyles.Description}>
              {stats.players.length}/{stats.maxplayers}
            </p>
          </div>
          <div className={serverStyles.Row}>
            <h4 className={serverStyles.Title}>{t("server.ping")}</h4>
            <p className={serverStyles.Description}>{stats.ping}</p>
          </div>
          <div className={serverStyles.Row}>
            <h4 className={serverStyles.Title}>{t("server.serverIp")}</h4>
            <p className={serverStyles.Description}>{stats.connect}</p>
          </div>
          {mapName !== undefined && (
            <div className={serverStyles.Row}>
              <h4 className={serverStyles.Title}>{t("server.map")}</h4>
              <p className={serverStyles.Description}>{mapName}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Routing(): React.ReactElement {
  return (
    <Routes>
      <Route path="/detailed/:gamename/:host/:port" element={<OldGame />} />
    </Routes>
  );
}
