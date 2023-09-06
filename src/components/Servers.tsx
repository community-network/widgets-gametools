import * as React from "react";
import "../locales/config";
import styled from "styled-components";
import { GetStats } from "../api/GetStats";
import { useQuery } from "react-query";
import { getLanguage } from "../locales/config";
import { Route, Routes, useMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { dice } from "../api/static";

interface IServerImage {
  background: string;
}

const Circle = styled.span`
  width: 48px;
  height: 48px;
  margin-right: 1rem;
  background-color: rgba(0, 0, 0, 0.288);
  border-radius: 38px;
`;

const ServerImage = styled.div<IServerImage>`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-width: 48px;
  width: 48px;
  height: 48px;
  background-image: url("${(props) => props.background}");
  border-radius: 38px;
  margin-right: 0.55rem;
`;

const Blur = styled.div`
  height: 100%;
  margin-top: -0.8rem;
  border-radius: 38px;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.288) 100%
  );
`;

const Server = styled.a`
  color: black;
  text-decoration: none;
  background: #f2f2f2;
  border-radius: 28px;
  border-width: 5px 8px;
  border-style: solid;
  border-color: #f2f2f2;
  padding: 0.1rem 1.2rem 0.1rem 0;
  display: flex;
  align-items: center;
`;

const ServerText = styled.h1`
  color: white;
  font-size: 1.2rem;
  text-align: center;
  padding-top: 1.5rem;
  line-height: 0;
`;

const ServerBody = styled.p`
  margin: 0px;
  white-space: nowrap;
  overflow: hidden;
`;

const ServerPlayers = styled.b`
  margin-left: auto;
  padding-left: 1rem;
  white-space: nowrap;
`;

{
  /* <img align="center" src="https://widgets-gametools.pages.dev/servers/bf1/name/%5BBoB%5D%231%20EU%20Popular%20CQ%20Maps!%20join%20us%3Adiscord.gg%2FBoB/pc" alt="GatitoUwU's Github Stats" style="max-width: 100%;"></img> */
}

export function WhiteServerBox(): React.ReactElement {
  const { t } = useTranslation();
  const match = useMatch("/servers/white/:gameid/:type/:sname/:platform");
  const gameId = match.params.gameid;
  const serverName = unescape(match.params.sname).replaceAll('"', '\\"');

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
        <Server>
          <Circle />
          <ServerBody>
            <b>{t("server.notFound")}</b>
          </ServerBody>
          <ServerPlayers>{t("notApplicable")}</ServerPlayers>
        </Server>
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
      <Server
        href={`https://gametools.network/servers/${gameId}/name/${encodeURI(
          match.params.sname,
        )}/${match.params.platform}`}
        target="_blank"
      >
        <ServerImage background={stats.currentMapImage || stats.mapImage}>
          <Blur>
            <ServerText>{stats.smallmode}</ServerText>
          </Blur>
        </ServerImage>
        <ServerBody>
          <b>{stats.prefix}</b>
          {mode}
          {stats.currentMap || stats.map}
        </ServerBody>
        <ServerPlayers>
          {stats.playerAmount}/{stats.maxPlayerAmount}
          {stats.maxPlayers} {queueString}
        </ServerPlayers>
      </Server>
    );
  } else {
    return (
      <Server>
        <Circle />
        <b>{t("loading")}</b>
        <ServerPlayers>0/0</ServerPlayers>
      </Server>
    );
  }
}

export function BlackServerBox(): React.ReactElement {
  const { t } = useTranslation();
  const match = useMatch("/servers/black/:gameid/:type/:sname/:platform");
  const gameId = match.params.gameid;
  const serverName = unescape(match.params.sname).replaceAll('"', '\\"');

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
        <Server style={{ background: "#141d26", borderColor: "#141d26" }}>
          <Circle />
          <ServerBody style={{ color: "white" }}>
            <b>{t("server.notFound")}</b>
          </ServerBody>
          <ServerPlayers style={{ color: "white" }}>
            {t("notApplicable")}
          </ServerPlayers>
        </Server>
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
      <Server
        href={`https://gametools.network/servers/${gameId}/name/${encodeURIComponent(
          match.params.sname,
        )}/${match.params.platform}`}
        target="_blank"
        style={{ background: "#141d26", borderColor: "#141d26" }}
      >
        <ServerImage background={stats.currentMapImage || stats.mapImage}>
          <Blur>
            <ServerText>{stats.smallmode}</ServerText>
          </Blur>
        </ServerImage>
        <ServerBody style={{ color: "white" }}>
          <b>{stats.prefix}</b>
          {mode}
          {stats.currentMap || stats.map}
        </ServerBody>
        <ServerPlayers style={{ color: "white" }}>
          {stats.playerAmount}/{stats.maxPlayerAmount}
          {stats.maxPlayers} {queueString}
        </ServerPlayers>
      </Server>
    );
  } else {
    return (
      <Server style={{ background: "#141d26", borderColor: "#141d26" }}>
        <Circle />
        <b style={{ color: "white" }}>{t("loading")}</b>
        <ServerPlayers style={{ color: "white" }}>0/0</ServerPlayers>
      </Server>
    );
  }
}

const BigServer = styled.a`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: flex-start;
  overflow: hidden;
`;

const BigServerImage = styled.div<IServerImage>`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 150px;
  min-width: 150px;
  height: 90px;
  background-image: url("${(props) => props.background}");
  margin-right: 0.7rem;
`;

const BigServerBody = styled.h4`
  margin: 0;
  margin-top: 0.6rem;
  color: white;
  white-space: nowrap;
  overflow: hidden;
`;

const Column = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  margin: 0 auto;
  margin-top: 1rem;
`;

const Row = styled.div`
  flex: 1;
  margin-right: 0.5rem;
`;

const Title = styled.h4`
  margin: 0;
  color: white;
`;

const Description = styled.p`
  margin: 0;
  color: gray;
  white-space: nowrap;
`;

export function DetailedServerBox(): React.ReactElement {
  const { t } = useTranslation();
  const match = useMatch("/servers/detailed/:gameid/:type/:sname/:platform");
  const gameId = match.params.gameid;
  const serverName = unescape(match.params.sname).replaceAll('"', '\\"');

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
      return <DetailedDefaults gameId={gameId} text={t("server.notFound")} />;
    }
    return (
      <BigServer
        href={`https://gametools.network/servers/${gameId}/name/${encodeURIComponent(
          match.params.sname,
        )}/${match.params.platform}`}
        target="_blank"
      >
        <BigServerImage background={stats.currentMapImage || stats.mapImage} />
        <div>
          <BigServerBody>{stats.prefix}</BigServerBody>
          <Column>
            <Row>
              <Title>{t("server.players")}</Title>
              <Description>
                {stats.playerAmount}/{stats.maxPlayerAmount}
                {stats.maxPlayers}
              </Description>
            </Row>
            {gameId !== "bf2042" && dice.includes(gameId) ? (
              <>
                <Row>
                  <Title>{t("server.queue")}</Title>
                  <Description>{stats.inQueue}/10</Description>
                </Row>
                <Row>
                  <Title>{t("server.favorites")}</Title>
                  <Description>{stats.favorites}</Description>
                </Row>
              </>
            ) : (
              <></>
            )}
            <Row>
              <Title>{t("server.map")}</Title>
              <Description>{stats.currentMap || stats.map}</Description>
            </Row>
            {["bf1", "battlebit"].includes(gameId) ? (
              <Row>
                <Title>{t("server.mode")}</Title>
                <Description>{stats.mode}</Description>
              </Row>
            ) : (
              <></>
            )}
          </Column>
        </div>
      </BigServer>
    );
  } else {
    return <DetailedDefaults gameId={gameId} text={t("loading")} />;
  }
}

function DetailedDefaults({
  gameId,
  text,
}: {
  gameId: string;
  text: string;
}): React.ReactElement {
  const { t } = useTranslation();
  return (
    <BigServer>
      <BigServerImage background="" />
      <div>
        <BigServerBody>{text}</BigServerBody>
        <Column>
          <Row>
            <Title>{t("server.players")}</Title>
            <Description>0/0</Description>
          </Row>
          {gameId !== "bf2042" && dice.includes(gameId) ? (
            <>
              <Row>
                <Title>{t("server.queue")}</Title>
                <Description>0/10</Description>
              </Row>
              <Row>
                <Title>{t("server.favorites")}</Title>
                <Description>0</Description>
              </Row>
            </>
          ) : (
            <></>
          )}
          <Row>
            <Title>{t("server.map")}</Title>
            <Description>{t("notApplicable")}</Description>
          </Row>
          {gameId == "bf1" ? (
            <Row>
              <Title>{t("server.mode")}</Title>
              <Description>{t("notApplicable")}</Description>
            </Row>
          ) : (
            <></>
          )}
        </Column>
      </div>
    </BigServer>
  );
}

export default function Routing(): React.ReactElement {
  return (
    <Routes>
      <Route
        path="/white/:gameid/:type/:sname/:platform"
        element={<WhiteServerBox />}
      />
      <Route
        path="/black/:gameid/:type/:sname/:platform"
        element={<BlackServerBox />}
      />
      <Route
        path="/detailed/:gameid/:type/:sname/:platform"
        element={<DetailedServerBox />}
      />
    </Routes>
  );
}
