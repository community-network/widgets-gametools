import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Route, Routes, useMatch } from "react-router";
import { GetStatsOldGames } from "../api/GetStatsOldGames";
import "../locales/config";
import * as styles from "./OldGames.module.scss";
import * as serverStyles from "./Servers.module.scss";
import { maps as hll_maps } from "../api/oldGameMaps/hll";

export function OldGame(): React.ReactElement {
  const match = useMatch("/oldgames/detailed/:gamename/:host/:port");
  const { gamename, host, port } = match.params;

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
        <b>Loading...</b>
        <b style={{ marginLeft: "auto", paddingLeft: "1rem" }}>0/0</b>
      </span>
    );
  }
  if (stats == undefined) {
    return <div>resultNotFound</div>;
  }

  let backgroundImage = `url(/${gamename}.jpg)`;

  if (gamename === "hll") {
    const image_name = hll_maps.find(
      (item) => item.queryName == stats.map,
    ).image;
    if (image_name !== undefined) {
      backgroundImage = `url(https://cdn.gametools.network/maps/hll/${image_name}.webp)`;
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
            <h4 className={serverStyles.Title}>Players</h4>
            <p className={serverStyles.Description}>
              {stats.players.length}/{stats.maxplayers}
            </p>
          </div>
          <div className={serverStyles.Row}>
            <h4 className={serverStyles.Title}>Ping</h4>
            <p className={serverStyles.Description}>{stats.ping}</p>
          </div>
          <div className={serverStyles.Row}>
            <h4 className={serverStyles.Title}>Server IP</h4>
            <p className={serverStyles.Description}>{stats.connect}</p>
          </div>
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
