import * as React from "react";
import "../locales/config";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { GetStats } from "../api/GetStats";
import { useQuery } from "react-query";
import { getLanguage } from "../locales/config";
import { RouteComponentProps } from "react-router-dom";

interface Region {
  region: string;
}

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
  width: 48px;
  height: 48px;
  background-image: url("${(props) => props.background}");
  border-radius: 38px;
  margin-right: 1rem;
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

const Server = styled.div`
  background: #f2f2f2;
  border-radius: 80px;
  border-width: 10px 20px;
  border-style: solid;
  border-color: #f2f2f2;
  padding: 0.3rem 0 0.3rem 0;
  display: flex;
  align-items: center;
`;

const BServer = styled.div`
  background: #f2f2f2;
  border-radius: 80px;
  border-width: 10px 20px;
  border-style: solid;
  border-color: #f2f2f2;
  padding: 0.3rem 0 0.3rem 0;
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

{
  /* <img align="center" src="https://widgets-gametools.pages.dev/servers/bf1/name/%5BBoB%5D%231%20EU%20Popular%20CQ%20Maps!%20join%20us%3Adiscord.gg%2FBoB/pc" alt="GatitoUwU's Github Stats" style="max-width: 100%;"></img> */
}

type TParams = {
  gameid: string;
  type: string;
  sname: string;
  platform: string;
};

export function WhiteServerBox({
  match,
}: RouteComponentProps<TParams>): React.ReactElement {
  const gameId = match.params.gameid;
  const serverName = decodeURIComponent(match.params.sname);

  const { isLoading: loading, isError: error, data: stats } = useQuery(
    "servers" + gameId + serverName + match.params.platform,
    () =>
      GetStats.server({
        game: gameId,
        getter: match.params.type,
        serverName: serverName,
        lang: getLanguage(),
        platform: match.params.platform,
      }),
  );
  if (!loading && !error) {
    if (stats == undefined) {
      return <div>resultNotFound</div>;
    }
    let queue: number = undefined;
    queue = stats.inQueue;
    let queueString = "";
    if (queue !== undefined && queue !== 0) {
      queueString = `[${queue}]`;
    }
    return (
      <Server>
        <ServerImage background={stats.currentMapImage}>
          <Blur>
            <ServerText>{stats.smallmode}</ServerText>
          </Blur>
        </ServerImage>
        <b>{stats.prefix}</b>
        <b style={{ marginLeft: "auto", paddingLeft: "1rem" }}>
          {stats.playerAmount}/{stats.maxPlayerAmount} {queueString}
        </b>
      </Server>
    );
  } else {
    return (
      <Server>
        <Circle />
        <b>Loading...</b>
        <b style={{ marginLeft: "auto", paddingLeft: "1rem" }}>0/0</b>
      </Server>
    );
  }
}

export function BlackServerBox({
  match,
}: RouteComponentProps<TParams>): React.ReactElement {
  const gameId = match.params.gameid;
  const serverName = decodeURIComponent(match.params.sname);

  const { isLoading: loading, isError: error, data: stats } = useQuery(
    "servers" + gameId + serverName + match.params.platform,
    () =>
      GetStats.server({
        game: gameId,
        getter: match.params.type,
        serverName: serverName,
        lang: getLanguage(),
        platform: match.params.platform,
      }),
  );
  if (!loading && !error) {
    if (stats == undefined) {
      return <div>resultNotFound</div>;
    }
    let queue: number = undefined;
    queue = stats.inQueue;
    let queueString = "";
    if (queue !== undefined && queue !== 0) {
      queueString = `[${queue}]`;
    }
    return (
      <BServer style={{ background: "#202020", borderColor: "#202020" }}>
        <ServerImage background={stats.currentMapImage}>
          <Blur>
            <ServerText>{stats.smallmode}</ServerText>
          </Blur>
        </ServerImage>
        <b style={{ color: "white" }}>{stats.prefix}</b>
        <b style={{ marginLeft: "auto", paddingLeft: "1rem", color: "white" }}>
          {stats.playerAmount}/{stats.maxPlayerAmount} {queueString}
        </b>
      </BServer>
    );
  } else {
    return (
      <Server>
        <Circle />
        <b>Loading...</b>
        <b style={{ marginLeft: "auto", paddingLeft: "1rem" }}>0/0</b>
      </Server>
    );
  }
}
