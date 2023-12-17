import * as React from "react";
import "../locales/config";
import styled from "styled-components";
import { GetStatsOldGames } from "../api/GetStatsOldGames";
import { useQuery } from "react-query";
import forest from "../assets/img/forest.jpg?sizes[]=150&format=webp&useResponsiveLoader=true";
import rust from "../assets/img/rust.jpg?sizes[]=150&format=webp&useResponsiveLoader=true";
import { Routes, Route } from "react-router-dom";

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

{
  /* <img align="center" src="https://widgets-gametools.pages.dev/servers/bf1/name/%5BBoB%5D%231%20EU%20Popular%20CQ%20Maps!%20join%20us%3Adiscord.gg%2FBoB/pc" alt="GatitoUwU's Github Stats" style="max-width: 100%;"></img> */
}

const BigServer = styled.a`
  color: white;
  text-decoration: none;
  display: flex;
  align-items: flex-start;
`;

const BigServerImage = styled.div<IServerImage>`
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 150px;
  height: 90px;
  background-image: url("${(props) => props.background}");
  margin-right: 0.7rem;
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
      <BigServer href={"https://www.gs4u.net/en/s/201410.html"} target="_blank">
        <BigServerImage background={forest.src} />
        <div>
          <h4 style={{ margin: 0, marginTop: "0.6rem", color: "white" }}>
            {stats.name}
          </h4>
          <Column>
            <Row>
              <Title>Players</Title>
              <Description>
                {stats.players.length}/{stats.maxplayers}
              </Description>
            </Row>
            <Row>
              <Title>Ping</Title>
              <Description>{stats.ping}</Description>
            </Row>
            <Row>
              <Title>Server IP</Title>
              <Description>{stats.connect}</Description>
            </Row>
          </Column>
        </div>
      </BigServer>
    );
  } else {
    return (
      <BigServer>
        <Circle />
        <b>Loading...</b>
        <b style={{ marginLeft: "auto", paddingLeft: "1rem" }}>0/0</b>
      </BigServer>
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
      <BigServer
        href={"https://www.gametracker.com/server_info/51.77.77.129:27030/"}
        target="_blank"
      >
        <BigServerImage background={rust.src} />
        <div>
          <h4 style={{ margin: 0, marginTop: "0.6rem", color: "white" }}>
            {stats.name}
          </h4>
          <Column>
            <Row>
              <Title>Players</Title>
              <Description>
                {stats.players.length}/{stats.maxplayers}
              </Description>
            </Row>
            <Row>
              <Title>Ping</Title>
              <Description>{stats.ping}</Description>
            </Row>
            <Row>
              <Title>Server IP</Title>
              <Description>{stats.connect}</Description>
            </Row>
          </Column>
        </div>
      </BigServer>
    );
  } else {
    return (
      <BigServer>
        <Circle />
        <b>Loading...</b>
        <b style={{ marginLeft: "auto", paddingLeft: "1rem" }}>0/0</b>
      </BigServer>
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
