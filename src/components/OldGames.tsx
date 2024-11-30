import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Route, Routes, useMatch } from "react-router-dom";
import { GetStatsOldGames } from "../api/GetStatsOldGames";
import "../locales/config";
import * as styles from "./OldGames.module.scss";
import * as serverStyles from "./Servers.module.scss";

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
        port: port
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
  return (
    <div
      className={styles.BigServer}>
      <div
        className={styles.BigServerImage}
        style={{ backgroundImage: `url(/${gamename}.jpg)` }}
      />
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
