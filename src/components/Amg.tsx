import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { Route, Routes } from "react-router-dom";
import { GetStatsOldGames } from "../api/GetStatsOldGames";
import forest from "../assets/img/forest.jpg?sizes[]=150&format=webp&useResponsiveLoader=true";
import rust from "../assets/img/rust.jpg?sizes[]=150&format=webp&useResponsiveLoader=true";
import "../locales/config";
import * as styles from "./Amg.module.scss";
import * as serverStyles from "./Servers.module.scss";

export function OldGameOne(): React.ReactElement {
  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery({
    queryKey: ["servers" + "amg" + "1"],
    queryFn: () =>
      GetStatsOldGames.server({
        group: "amg",
        number: "1",
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
    <a
      className={styles.BigServer}
      href={"https://www.gs4u.net/en/s/201410.html"}
      target="_blank"
      rel="noreferrer"
    >
      <div
        className={styles.BigServerImage}
        style={{ backgroundImage: `src("${forest.src}")` }}
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
    </a>
  );
}

export function OldGameTwo(): React.ReactElement {
  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery({
    queryKey: ["servers" + "amg" + "2"],
    queryFn: () =>
      GetStatsOldGames.server({
        group: "amg",
        number: "2",
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
    <a
      className={styles.BigServer}
      href={"https://www.gametracker.com/server_info/51.77.77.129:27030/"}
      target="_blank"
      rel="noreferrer"
    >
      <div
        className={styles.BigServerImage}
        style={{ backgroundImage: `src("${rust.src}")` }}
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
    </a>
  );
}

export default function Routing(): React.ReactElement {
  return (
    <Routes>
      <Route path="/servers/detailed/amg/1" element={<OldGameOne />} />
      <Route path="/servers/detailed/amg/2" element={<OldGameTwo />} />
    </Routes>
  );
}
