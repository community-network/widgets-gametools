import * as React from "react";
import "../locales/config";
import { GetStatsOldGames } from "../api/GetStatsOldGames";
import { useQuery } from "react-query";
import forest from "../assets/img/forest.jpg?sizes[]=150&format=webp&useResponsiveLoader=true";
import rust from "../assets/img/rust.jpg?sizes[]=150&format=webp&useResponsiveLoader=true";
import { Routes, Route } from "react-router-dom";
import styles from "./Amg.module.scss";

export function OldGameOne(): React.ReactElement {
  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery("servers" + "amg" + "1", () =>
    GetStatsOldGames.server({
      group: "amg",
      number: "1",
    }),
  );
  if (!loading && !error) {
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
          <div className={styles.Column}>
            <div className={styles.Row}>
              <h4 className={styles.Title}>Players</h4>
              <p className={styles.Description}>
                {stats.players.length}/{stats.maxplayers}
              </p>
            </div>
            <div className={styles.Row}>
              <h4 className={styles.Title}>Ping</h4>
              <p className={styles.Description}>{stats.ping}</p>
            </div>
            <div className={styles.Row}>
              <h4 className={styles.Title}>Server IP</h4>
              <p className={styles.Description}>{stats.connect}</p>
            </div>
          </div>
        </div>
      </a>
    );
  } else {
    return (
      <span className={styles.BigServer}>
        <span className={styles.Circle} />
        <b>Loading...</b>
        <b style={{ marginLeft: "auto", paddingLeft: "1rem" }}>0/0</b>
      </span>
    );
  }
}

export function OldGameTwo(): React.ReactElement {
  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery("servers" + "amg" + "2", () =>
    GetStatsOldGames.server({
      group: "amg",
      number: "2",
    }),
  );
  if (!loading && !error) {
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
          <div className={styles.Column}>
            <div className={styles.Row}>
              <h4 className={styles.Title}>Players</h4>
              <p className={styles.Description}>
                {stats.players.length}/{stats.maxplayers}
              </p>
            </div>
            <div className={styles.Row}>
              <h4 className={styles.Title}>Ping</h4>
              <p className={styles.Description}>{stats.ping}</p>
            </div>
            <div className={styles.Row}>
              <h4 className={styles.Title}>Server IP</h4>
              <p className={styles.Description}>{stats.connect}</p>
            </div>
          </div>
        </div>
      </a>
    );
  } else {
    return (
      <span className={styles.BigServer}>
        <span className={styles.Circle} />
        <b>Loading...</b>
        <b style={{ marginLeft: "auto", paddingLeft: "1rem" }}>0/0</b>
      </span>
    );
  }
}

export default function Routing(): React.ReactElement {
  return (
    <Routes>
      <Route path="/servers/detailed/amg/1" element={<OldGameOne />} />
      <Route path="/servers/detailed/amg/2" element={<OldGameTwo />} />
    </Routes>
  );
}
