import * as React from "react";
import "../locales/config";
import { GetStats } from "../api/GetStats";
import { useQuery } from "react-query";
import { getLanguage } from "../locales/config";
import { Route, Routes, useLocation, useMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { dice, frostbite3 } from "../api/static";
import styles from "./Servers.module.scss";
import { calculateZoomStyle } from "./functions/calculateZoom";

export function ServerBox(
  props: Readonly<{ color: string }>,
): React.ReactElement {
  const { color } = props;
  const { t } = useTranslation();
  const match = useMatch(`/servers/${color}/:gameid/:type/:sname/:platform`);
  const gameId = match.params.gameid;
  const serverName = unescape(match.params.sname).replaceAll('"', '\\"');
  const backgroundStyle =
    color === "black" ? { background: "#141d26", borderColor: "#141d26" } : {};
  const textStyle = color == "black" ? { color: "white" } : {};

  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery("servers" + gameId + serverName + match.params.platform, () =>
    GetStats.server({
      game: gameId,
      getter: match.params.type,
      serverName: serverName,
      lang: getLanguage(),
      platform: match.params.platform,
      with_ownername: false,
    }),
  );
  console.log(stats);
  if (!loading && !error) {
    if ("errors" in stats) {
      return (
        <span className={styles.Server} style={backgroundStyle}>
          <span className={styles.Circle} />
          <p className={styles.ServerBody} style={textStyle}>
            <b>{t("server.notFound")}</b>
          </p>
          <b className={styles.ServerPlayers} style={textStyle}>
            {t("notApplicable")}
          </b>
        </span>
      );
    }
    let queue: number = undefined;
    queue = stats.inQueue;
    let queueString = "";
    if (queue !== undefined && queue !== 0) {
      queueString = `[${queue}]`;
    }
    let mode = "";
    if (stats.mode !== undefined) {
      mode = `${stats.mode}: `;
    }
    return (
      <a
        className={styles.Server}
        href={`https://gametools.network/servers/${gameId}/name/${encodeURI(
          match.params.sname,
        )}/${match.params.platform}`}
        target="_blank"
        style={backgroundStyle}
        rel="noreferrer"
      >
        <div
          className={styles.ServerImage}
          style={{
            backgroundImage: `url("${stats.currentMapImage || stats.mapImage}")`,
          }}
        >
          <div className={styles.Blur}>
            <h1 className={styles.ServerText}>{stats.smallmode}</h1>
          </div>
        </div>
        <p className={styles.ServerBody} style={textStyle}>
          <b>{stats.prefix}</b>
          {mode}
          {stats.currentMap || stats.map}
        </p>
        <b className={styles.ServerPlayers} style={textStyle}>
          {stats.playerAmount}/{stats.maxPlayerAmount}
          {stats.maxPlayers} {queueString}
        </b>
      </a>
    );
  } else {
    return (
      <span className={styles.Server} style={backgroundStyle}>
        <span className={styles.Circle} />
        <b style={textStyle}>{t("loading")}</b>
        <b className={styles.ServerPlayers} style={textStyle}>
          0/0
        </b>
      </span>
    );
  }
}

export function DetailedServerBox(): React.ReactElement {
  const { t } = useTranslation();
  const match = useMatch("/servers/detailed/:gameid/:type/:sname/:platform");
  const gameId = match.params.gameid;
  const serverName = unescape(match.params.sname).replaceAll('"', '\\"');
  const query = new URLSearchParams(useLocation().search);
  const zoomQuery = query.get("zoom");

  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery("servers" + gameId + serverName + match.params.platform, () =>
    GetStats.server({
      game: gameId,
      getter: match.params.type,
      serverName: serverName,
      lang: getLanguage(),
      platform: match.params.platform,
      with_ownername: false,
    }),
  );
  if (!loading && !error) {
    if ("errors" in stats) {
      return (
        <DetailedDefaults
          zoom={zoomQuery ?? 100}
          gameId={gameId}
          text={t("server.notFound")}
        />
      );
    }
    return (
      <a
        className={styles.BigServer}
        href={`https://gametools.network/servers/${gameId}/name/${encodeURIComponent(
          match.params.sname,
        )}/${match.params.platform}`}
        target="_blank"
        style={calculateZoomStyle(zoomQuery ?? 100)}
        rel="noreferrer"
      >
        <div
          className={styles.BigServerImage}
          style={{
            backgroundImage: `url("${stats.currentMapImage || stats.mapImage}")`,
          }}
        />
        <div style={{ display: "grid" }}>
          <h4 className={styles.BigServerBody}>{stats.prefix}</h4>
          <div className={styles.Column} style={{ marginTop: "0.7rem" }}>
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("server.players")}</h4>
              <p className={styles.Description}>
                {stats.playerAmount}/{stats.maxPlayerAmount}
                {stats.maxPlayers}
              </p>
            </div>
            {gameId !== "bf2042" && dice.includes(gameId) && (
              <div className={styles.Row}>
                <h4 className={styles.Title}>{t("server.queue")}</h4>
                <p className={styles.Description}>{stats.inQueue}/10</p>
              </div>
            )}
            {frostbite3.includes(gameId) && (
              <div className={styles.Row}>
                <h4 className={styles.Title}>{t("server.favorites")}</h4>
                <p className={styles.Description}>{stats.favorites}</p>
              </div>
            )}
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("server.map")}</h4>
              <p className={styles.Description}>
                {stats.currentMap || stats.map}
              </p>
            </div>
            {["bf1", "battlebit"].includes(gameId) && (
              <div className={styles.Row}>
                <h4 className={styles.Title}>{t("server.mode")}</h4>
                <p className={styles.Description}>{stats.mode}</p>
              </div>
            )}
          </div>
        </div>
      </a>
    );
  } else {
    return (
      <DetailedDefaults
        zoom={zoomQuery ?? 100}
        gameId={gameId}
        text={t("loading")}
      />
    );
  }
}

function DetailedDefaults({
  gameId,
  text,
  zoom,
}: Readonly<{
  zoom: number | string;
  gameId: string;
  text: string;
}>): React.ReactElement {
  const { t } = useTranslation();
  return (
    <span className={styles.BigServer} style={calculateZoomStyle(zoom)}>
      <div className={styles.BigServerImage} />
      <div style={{ display: "grid" }}>
        <h4 className={styles.BigServerBody}>{text}</h4>
        <div className={styles.Column} style={{ marginTop: "0.7rem" }}>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("server.players")}</h4>
            <p className={styles.Description}>0/0</p>
          </div>
          {gameId !== "bf2042" && dice.includes(gameId) && (
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("server.queue")}</h4>
              <p className={styles.Description}>0/10</p>
            </div>
          )}
          {frostbite3.includes(gameId) && (
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("server.favorites")}</h4>
              <p className={styles.Description}>0</p>
            </div>
          )}
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("server.map")}</h4>
            <p className={styles.Description}>{t("notApplicable")}</p>
          </div>
          {gameId == "bf1" && (
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("server.mode")}</h4>
              <p className={styles.Description}>{t("notApplicable")}</p>
            </div>
          )}
        </div>
      </div>
    </span>
  );
}

export default function Routing(): React.ReactElement {
  return (
    <Routes>
      <Route
        path="/white/:gameid/:type/:sname/:platform"
        element={<ServerBox color="white" />}
      />
      <Route
        path="/black/:gameid/:type/:sname/:platform"
        element={<ServerBox color="black" />}
      />
      <Route
        path="/detailed/:gameid/:type/:sname/:platform"
        element={<DetailedServerBox />}
      />
    </Routes>
  );
}
