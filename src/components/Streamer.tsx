import * as React from "react";
import "../locales/config";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { GetStats } from "../api/GetStats";
import { useQuery } from "react-query";
import { getLanguage } from "../locales/config";
import { RouteComponentProps } from "react-router-dom";
import { Main } from "./Materials";

type TParams = {
  plat: string;
  type: string;
  eaid: string;
  gameid: string;
  lang: string;
  zoom: string;
};

type SeederTParams = {
  id: string;
  player: string;
  lang: string;
  zoom: string;
};

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0rem 1.5rem;
`;

export const Title = styled.h4`
  margin: 0;
  font-family: Futura PT;
  font-style: normal;
  font-weight: 600;
  font-size: 34px;
  line-height: 44px;
  display: flex;
  align-items: center;
  
  color: #ababab;
  text-shadow: 6px 6px 6px #000000, 6px 6px 6px #000000;
`;

export const Description = styled.p`
  margin: 0;
  margin-bottom: 3rem;
  font-family: Futura PT;
  font-style: normal;
  font-weight: bold;
  font-size: 38px;
  line-height: 49px;
  display: flex;
  align-items: center;

  color: #ebebeb;
  text-shadow: 6px 6px 6px #000000, 6px 6px 6px #000000;
`;

const StreamColumn = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  width: 100%;
  margin: 0 auto;
  margin-top: 1rem;
`;

export function GameStreamStat({
  match,
}: RouteComponentProps<SeederTParams>): React.ReactElement {
  const { t, i18n } = useTranslation();

  React.useState(() => {
    i18n.changeLanguage(match.params.lang);
  });

  const guid = match.params.id;
  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery(
    "seederPlayerList" + guid,
    () =>
      GetStats.seederPlayerList({
        game: "bf1",
        id: guid,
      }),
    {
      retry: 2,
      staleTime: 1000 * 10, // 30 seconds
      cacheTime: 1000 * 10, //30 seconds
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchOnReconnect: "always",
      refetchInterval: 1000 * 10, //30 seconds
      refetchIntervalInBackground: true,
    },
  );
  if (!loading && !error) {
    // if seederid not found
    if (stats == undefined || "errors" in stats) {
      return (
        <Main zoom={match.params.zoom}>
          <StreamColumn>
            <Row>
              <Title>{t("stats.main")}</Title>
              <Description>{t("streamer.noserver")}</Description>
            </Row>
          </StreamColumn>
        </Main>
      );
    }

    const players = stats.teams[0].players.concat(stats.teams[1].players);
    let currentPlayer = undefined;
    players.forEach((player) => {
      if (player.player_id.toString() == match.params.player) {
        currentPlayer = player;
      }
    });
    if (currentPlayer != undefined) {
      return (
        <Main zoom={match.params.zoom}>
          <StreamColumn>
            <Row>
              <Title>{t("stats.score")}</Title>
              <Description>{currentPlayer.score}</Description>
            </Row>
            <Row>
              <Title>{t("stats.kills")}</Title>
              <Description>{currentPlayer.kills}</Description>
            </Row>
            <Row>
              <Title>{t("stats.deaths")}</Title>
              <Description>{currentPlayer.deaths}</Description>
            </Row>
          </StreamColumn>
        </Main>
      );
    } else {
      // player not in server
      return (
        <Main zoom={match.params.zoom}>
          <StreamColumn>
            <Row>
              <Title>{t("stats.main")}</Title>
              <Description>{t("streamer.noplayer")}</Description>
            </Row>
          </StreamColumn>
        </Main>
      );
    }
  } else {
    // loading
    return (
      <Main zoom={match.params.zoom}>
        <StreamColumn>
          <Row>
            <Title>{t("stats.main")}</Title>
            <Description>{t("loading")}</Description>
          </Row>
        </StreamColumn>
      </Main>
    );
  }
}

type SeederScoreTParams = {
  id: string;
  player: string;
  lang: string;
  zoom: string;
};

export function GameStreamScore({
  match,
}: RouteComponentProps<SeederScoreTParams>): React.ReactElement {
  const { t, i18n } = useTranslation();

  React.useState(() => {
    i18n.changeLanguage(match.params.lang);
  });

  const guid = match.params.id;
  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery(
    "seederPlayerList" + guid,
    () =>
      GetStats.seederPlayerList({
        game: "bf1",
        id: guid,
      }),
    {
      retry: 2,
      staleTime: 1000 * 10, // 30 seconds
      cacheTime: 1000 * 10, //30 seconds
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchOnReconnect: "always",
      refetchInterval: 1000 * 10, //30 seconds
      refetchIntervalInBackground: true,
    },
  );
  if (!loading && !error) {
    // if seederid not found
    if (stats == undefined || "errors" in stats) {
      return (
        <Main zoom={match.params.zoom}>
          <StreamColumn>
            <Row>
              <Title>{t("stats.main")}</Title>
              <Description>{t("streamer.noserver")}</Description>
            </Row>
          </StreamColumn>
        </Main>
      );
    }

    const teams = [
      { score: 0, kills: 0, deaths: 0 },
      { score: 0, kills: 0, deaths: 0 },
    ];

    stats.teams.forEach((team, index) => {
      team.players.forEach((player) => {
        teams[index].kills += player.kills;
        teams[index].deaths += player.deaths;
        teams[index].score += player.score;
      });
    });

    return (
      <Main zoom={match.params.zoom}>
        <StreamColumn>
          <Row>
            <Title>{t("stats.score")}</Title>
            <Description>{teams[0].score}</Description>
          </Row>
          <Row>
            <Title>{t("stats.killDeath")}</Title>
            <Description>
              {(teams[0].kills / teams[0].deaths).toFixed(2)}
            </Description>
          </Row>
          <Row>
            <Title>{stats.teams[0].name}</Title>
          </Row>
          <Row>
            <Description>VS</Description>
          </Row>
          <Row>
            <Title>{stats.teams[1].name}</Title>
          </Row>
          <Row>
            <Title>{t("stats.killDeath")}</Title>
            <Description>
              {(teams[1].kills / teams[1].deaths).toFixed(2)}
            </Description>
          </Row>
          <Row>
            <Title>{t("stats.score")}</Title>
            <Description>{teams[1].score}</Description>
          </Row>
        </StreamColumn>
      </Main>
    );
  } else {
    // loading
    return (
      <Main zoom={match.params.zoom}>
        <StreamColumn>
          <Row>
            <Title>{t("stats.main")}</Title>
            <Description>{t("loading")}</Description>
          </Row>
        </StreamColumn>
      </Main>
    );
  }
}

export function SteamStat({
  match,
}: RouteComponentProps<TParams>): React.ReactElement {
  const { t, i18n } = useTranslation();

  React.useState(() => {
    i18n.changeLanguage(match.params.lang);
  });

  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery(
    "stats" + match.params.gameid + match.params.eaid,
    () =>
      GetStats.stats({
        game: match.params.gameid,
        type: "stats",
        getter: match.params.type,
        userName: match.params.eaid,
        lang: getLanguage(),
      }),
    {
      retry: 2,
      staleTime: 1000 * 30, // 30 seconds
      cacheTime: 1000 * 30, //30 seconds
      refetchOnMount: "always",
      refetchOnWindowFocus: "always",
      refetchOnReconnect: "always",
      refetchInterval: 1000 * 30, //30 seconds
      refetchIntervalInBackground: true,
    },
  );
  if (!loading && !error) {
    if (stats == undefined) {
      return <div>resultNotFound</div>;
    }
    return (
      <Main zoom={match.params.zoom}>
        <StreamColumn>
          <Row>
            <Title>{t("stats.killsPerMinute")}</Title>
            <Description>{stats.killsPerMinute}</Description>
          </Row>
          <Row>
            <Title>{t("stats.killsPerMinute")}</Title>
            <Description>{stats.scorePerMinute}</Description>
          </Row>
          <Row>
            <Title>{t("stats.skill")}</Title>
            <Description>{stats.skill}</Description>
          </Row>
          <Row>
            <Title>{t("stats.killDeath")}</Title>
            <Description>{stats.killDeath}</Description>
          </Row>
          <Row>
            <Title>{t("stats.longestHeadShot")}</Title>
            <Description>{stats.longestHeadShot}</Description>
          </Row>
          <Row>
            <Title>{t("stats.winPercent")}</Title>
            <Description>{stats.winPercent}</Description>
          </Row>
          <Row>
            <Title>{t("stats.headshotPercent")}</Title>
            <Description>{stats.headshots}</Description>
          </Row>
          <Row>
            <Title>{t("stats.accuracy")}</Title>
            <Description>{stats.accuracy}</Description>
          </Row>
          <Row>
            <Title>{t("stats.bestClass")}</Title>
            <Description>{stats.bestClass}</Description>
          </Row>
          <Row>
            <Title>{t("stats.highestKillStreak")}</Title>
            <Description>{stats.highestKillStreak}</Description>
          </Row>
          <Row>
            <Title>{t("stats.revives")}</Title>
            <Description>{stats.revives}</Description>
          </Row>
          <Row>
            <Title>{t("stats.infantryKillDeath")}</Title>
            <Description>{stats.infantryKillDeath}</Description>
          </Row>
          <Row>
            <Title>{t("stats.infantryKillsPerMinute")}</Title>
            <Description>{stats.infantryKillsPerMinute}</Description>
          </Row>
          <Row>
            <Title>{t("stats.timePlayed")}</Title>
            <Description>{stats.timePlayed}</Description>
          </Row>
        </StreamColumn>
      </Main>
    );
  } else {
    return <div></div>;
  }
}
