import { useQuery } from "@tanstack/react-query";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { PathMatch, Route, Routes, useLocation, useMatch } from "react-router";
import { GetStats } from "../api/GetStats";
import { dice, frostbite3 } from "../api/static";
import "../locales/config";
import { getLanguage } from "../locales/config";
import * as styles from "./Servers.module.scss";
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
  } = useQuery({
    queryKey: ["servers" + gameId + serverName + match.params.platform],
    queryFn: () =>
      GetStats.server({
        game: gameId,
        getter: match.params.type,
        serverName: serverName,
        lang: getLanguage(),
        platform: match.params.platform,
        with_ownername: false,
      }),
    retry: 1,
  });
  const params = GetStats.constructParamStr({
    search: match.params.sname,
    game: gameId,
    platform: match.params.platform,
  });
  if (loading) {
    return (
      <a
        className={styles.Server}
        style={backgroundStyle}
        href={`https://gametools.network/servers${params}`}
        target="_blank"
        rel="noreferrer"
      >
        <span className={styles.Circle} />
        <b style={textStyle}>{t("loading")}</b>
        <b className={styles.ServerPlayers} style={textStyle}>
          0/0
        </b>
      </a>
    );
  }

  if (error || stats === undefined) {
    return (
      <a
        className={styles.Server}
        style={backgroundStyle}
        href={`https://gametools.network/servers${params}`}
        target="_blank"
        rel="noreferrer"
      >
        <span className={styles.Circle} />
        <p className={styles.ServerBody} style={textStyle}>
          <b>{t("server.notFound")}</b>
        </p>
        <b className={styles.ServerPlayers} style={textStyle}>
          {t("notApplicable")}
        </b>
      </a>
    );
  }
  let queue: number = undefined;
  queue = stats?.inQueue;
  let queueString = "";
  if (queue !== undefined && queue !== 0) {
    queueString = `[${queue}]`;
  }
  let mode = "";
  if (stats?.mode !== undefined) {
    mode = `${stats?.mode}: `;
  }
  return (
    <a
      className={styles.Server}
      href={`https://gametools.network/servers/${gameId}/name/${encodeURIComponent(
        match.params.sname,
      )}/${match.params.platform}`}
      target="_blank"
      style={backgroundStyle}
      rel="noreferrer"
    >
      <div
        className={styles.ServerImage}
        style={{
          backgroundImage: `url("${stats?.currentMapImage || stats?.mapImage}")`,
        }}
      >
        <div className={styles.Blur}>
          <h1 className={styles.ServerText}>{stats?.smallmode}</h1>
        </div>
      </div>
      <p className={styles.ServerBody} style={textStyle}>
        <b>{stats?.prefix}</b>
        {mode}
        {stats?.currentMap || stats?.map}
      </p>
      <b className={styles.ServerPlayers} style={textStyle}>
        {stats?.playerAmount}/{stats?.maxPlayerAmount}
        {stats?.maxPlayers} {queueString}
      </b>
    </a>
  );
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
  } = useQuery({
    queryKey: ["servers" + gameId + serverName + match.params.platform],
    queryFn: () =>
      GetStats.server({
        game: gameId,
        getter: match.params.type,
        serverName: serverName,
        lang: getLanguage(),
        platform: match.params.platform,
        with_ownername: false,
      }),
    retry: 1,
  });
  if (loading) {
    return (
      <DetailedDefaults
        match={match}
        zoom={zoomQuery ?? 100}
        gameId={gameId}
        text={t("loading")}
      />
    );
  }

  if (error || stats === undefined) {
    return (
      <DetailedDefaults
        match={match}
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
          backgroundImage: `url("${stats?.currentMapImage || stats?.mapImage}")`,
        }}
      />
      <div style={{ display: "grid" }}>
        <h4 className={styles.BigServerBody}>{stats?.prefix}</h4>
        <div className={styles.Column} style={{ marginTop: "0.7rem" }}>
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("server.players")}</h4>
            <p className={styles.Description}>
              {stats?.playerAmount}/{stats?.maxPlayerAmount}
              {stats?.maxPlayers}
            </p>
          </div>
          {gameId !== "bf2042" && dice.includes(gameId) && (
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("server.queue")}</h4>
              <p className={styles.Description}>{stats?.inQueue}/10</p>
            </div>
          )}
          {frostbite3.includes(gameId) && (
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("server.favorites")}</h4>
              <p className={styles.Description}>{stats?.favorites}</p>
            </div>
          )}
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("server.map")}</h4>
            <p className={styles.Description}>
              {stats?.currentMap || stats?.map}
            </p>
          </div>
          {["bf1", "battlebit"].includes(gameId) && (
            <div className={styles.Row}>
              <h4 className={styles.Title}>{t("server.mode")}</h4>
              <p className={styles.Description}>{stats?.mode}</p>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

function DetailedDefaults({
  match,
  gameId,
  text,
  zoom,
}: Readonly<{
  match: PathMatch<"gameid" | "type" | "sname" | "platform">;
  zoom: number | string;
  gameId: string;
  text: string;
}>): React.ReactElement {
  const { t } = useTranslation();
  const params = GetStats.constructParamStr({
    search: match.params.sname,
    game: gameId,
    platform: match.params.platform,
  });
  return (
    <a
      className={styles.BigServer}
      href={`https://gametools.network/servers${params}`}
      target="_blank"
      style={calculateZoomStyle(zoom)}
      rel="noreferrer"
    >
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
    </a>
  );
}

export function SmallServerBox(): React.ReactElement {
  const { t } = useTranslation();
  const match = useMatch("/servers/small/:gameid/:type/:sname/:platform");
  const gameId = match.params.gameid;
  const serverName = unescape(match.params.sname).replaceAll('"', '\\"');
  const query = new URLSearchParams(useLocation().search);
  const zoomQuery = query.get("zoom");

  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery({
    queryKey: ["servers" + gameId + serverName + match.params.platform],
    queryFn: () =>
      GetStats.server({
        game: gameId,
        getter: match.params.type,
        serverName: serverName,
        lang: getLanguage(),
        platform: match.params.platform,
        with_ownername: false,
      }),
    retry: 1,
  });
  if (loading) {
    return (
      <SmallDefaults match={match} zoom={zoomQuery ?? 100} gameId={gameId} />
    );
  }

  if (error || stats === undefined) {
    return (
      <SmallDefaults match={match} zoom={zoomQuery ?? 100} gameId={gameId} />
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
          backgroundImage: `url("${stats?.currentMapImage || stats?.mapImage}")`,
        }}
      >
        <div className={styles.blur}>
          {stats?.favorites && (
            <p className={styles.serverFavorites}>&#9733; {stats?.favorites}</p>
          )}
        </div>
      </div>
      <div style={{ display: "grid" }}>
        <div className={styles.Row}>
          <h4 className={styles.Title}>{t("server.players")}</h4>
          <p className={styles.Description}>
            {stats?.playerAmount}/{stats?.maxPlayerAmount}
            {stats?.maxPlayers}
          </p>
        </div>
        {gameId !== "bf2042" && dice.includes(gameId) && (
          <div className={styles.Row}>
            <h4 className={styles.Title}>{t("server.queue")}</h4>
            <p className={styles.Description}>{stats?.inQueue}/10</p>
          </div>
        )}
      </div>
    </a>
  );
}

function SmallDefaults({
  match,
  gameId,
  zoom,
}: Readonly<{
  match: PathMatch<"gameid" | "type" | "sname" | "platform">;
  zoom: number | string;
  gameId: string;
}>): React.ReactElement {
  const { t } = useTranslation();
  const params = GetStats.constructParamStr({
    search: match.params.sname,
    game: gameId,
    platform: match.params.platform,
  });
  return (
    <a
      className={styles.BigServer}
      href={`https://gametools.network/servers${params}`}
      target="_blank"
      style={calculateZoomStyle(zoom)}
      rel="noreferrer"
    >
      <div className={styles.BigServerImage} />
      <div style={{ display: "grid" }}>
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
      </div>
    </a>
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
      <Route
        path="/small/:gameid/:type/:sname/:platform"
        element={<SmallServerBox />}
      />
    </Routes>
  );
}
