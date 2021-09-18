import * as React from "react";
import "../locales/config";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { GetStats } from "../api/GetStats";
import { useQuery } from "react-query";
import { getLanguage } from "../locales/config";
import { RouteComponentProps } from "react-router-dom";
import useWindowDimension from "use-window-dimensions";
import { shortName } from "../api/static";

type TParams = {
  plat: string;
  type: string;
  eaid: string;
  gameid: string;
  zoom: string;
};

interface IGameImage {
  background: string;
}

interface IZoom {
  zoom: string;
}

const Main = styled.div<IZoom>`
  position: fixed;
  width: 100%;
  height: 100%;
  zoom: ${(props) => props.zoom}%;
`;

const Background = styled.div<IGameImage>`
  background-position: left;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("${(props) => props.background}");
  height: 100%;
  width: 100%;
  transform: translate(0, -20%);
`;

const Blur = styled.div`
  width: 100%;
  height: 30%;
  transform: translate(0, 55%);
  background: linear-gradient(180deg, rgba(21, 24, 41, 0) 0%, #151829 100%);
`;

const Body = styled.div`
  position: fixed;
  width: 100%;
  height: 74%;
  top: 26%;

  background: #151829;
`;

const BarText = styled.p`
  position: fixed;
  top: 38px;

  color: #ffffff;
  font-family: Futura PT;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 23px;
  display: flex;
  align-items: center;
  letter-spacing: 0.195em;
`;

const Bar = styled.hr`
  position: fixed;
  right: 303px;
  left: 285px;
  top: 58px;

  border: 2px solid rgba(255, 255, 255, 0.41);
`;

const Img = styled.img`
  position: fixed;
  width: 130px;
  height: 130px;
  left: 30px;
  top: 152px;

  border-radius: 100px;
`;

const PlayerName = styled.div`
  position: fixed;
  left: 182px;
  top: 193px;

  font-family: Futura PT;
  font-weight: bold;
  font-size: 38px;
  line-height: 49px;

  color: rgba(255, 255, 255, 0.92);
`;

const RankImg = styled.img`
  object-fit: cover;
  position: fixed;
  width: 48px;
  height: 32px;
  left: 182px;
  top: 250px;
`;

const Rank = styled.div`
  position: fixed;
  left: 244px;
  top: 250px;

  font-family: Futura PT;
  font-style: normal;
  font-weight: bold;
  font-size: 28px;
  line-height: 36px;

  color: rgba(255, 255, 255, 0.92);
`;

const GameImg = styled.img`
  position: fixed;
  object-fit: cover;

  width: 206px;
  height: 55px;
  right: 30px;
  top: 209px;
`;

const Platform = styled.img`
  position: fixed;
  width: 46px;
  height: 46px;
  right: 257px;
  top: 215px;
`;

const Column = styled.div`
  position: fixed;
  top: 322px;
  left: 30px;
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  margin: 0 auto;
  margin-top: 1rem;
`;

const Row = styled.div`
  /* flex: 1; */
  margin-right: 0.5rem;
`;

const Title = styled.h4`
  margin: 0;
  margin-right: 5rem;
  font-family: Futura PT;
  font-style: normal;
  font-weight: 600;
  font-size: 34px;
  line-height: 44px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.67);
`;

const Description = styled.p`
  margin: 0;
  margin-right: 5rem;
  margin-bottom: 3rem;
  font-family: Futura PT;
  font-style: normal;
  font-weight: bold;
  font-size: 38px;
  line-height: 49px;
  display: flex;
  align-items: center;

  color: rgba(255, 255, 255, 0.92);
`;

export function Stats({
  match,
}: RouteComponentProps<TParams>): React.ReactElement {
  const game = match.params.gameid;
  const gameid = shortName[game];
  const { width } = useWindowDimension();
  const { isLoading: loading, isError: error, data: stats } = useQuery(
    "stats" + game + match.params.eaid,
    () =>
      GetStats.stats({
        game: game,
        type: "stats",
        getter: match.params.type,
        userName: match.params.eaid,
        lang: getLanguage(),
      }),
  );
  if (!loading && !error) {
    if (stats == undefined) {
      return <div>resultNotFound</div>;
    }
    return (
      <Main zoom={match.params.zoom}>
        <Background
          background={`https://cdn.gametools.network/backgrounds/${game}/1.jpg`}
        >
          <Blur>
            <BarText style={{ left: "30px" }}>
              BATTLEFIELD {gameid} STATS
            </BarText>
            {width <= 700 && match.params.zoom === "100" ? (
              <></>
            ) : (
              <>
                {game === "bfh" ? <Bar style={{ left: "380px" }} /> : <Bar />}
                <BarText
                  style={{
                    right: "30px",
                    color: "rgba(255, 255, 255, 0.81)",
                    textAlign: "right",
                  }}
                >
                  GAMETOOLS.NETWORK
                </BarText>
              </>
            )}
          </Blur>
        </Background>
        <Body>
          <Img src={stats.avatar} />
          <PlayerName>{stats.userName}</PlayerName>
          <RankImg
            src={
              stats.rankImg !== undefined
                ? stats.rankImg
                : `https://cdn.gametools.network/${game}/${stats.rank}.png`
            }
          />
          <Rank>Rank {stats.rank}</Rank>
          {width <= 700 && match.params.zoom === "100" ? (
            <></>
          ) : (
            <>
              <GameImg
                src={`https://cdn.gametools.network/games/${game}.png`}
              />
              <Platform
                src={`https://cdn.gametools.network/platforms/${match.params.plat}.png`}
              />
            </>
          )}
          {game !== "bfh" ? (
            <Column>
              <Row>
                <Title>KPM</Title>
                <Description>{stats.killsPerMinute}</Description>
              </Row>
              <Row>
                <Title>SPM</Title>
                <Description>{stats.scorePerMinute}</Description>
              </Row>
              {game == "bfv" ? (
                <Row>
                  <Title>Savior kills</Title>
                  <Description>{stats.saviorKills}</Description>
                </Row>
              ) : (
                <Row>
                  <Title>Skill</Title>
                  <Description>{stats.skill}</Description>
                </Row>
              )}
              <Row>
                <Title>KD</Title>
                <Description>{stats.killDeath}</Description>
              </Row>
              <Row>
                <Title>Longest headshot</Title>
                <Description>{stats.longestHeadShot}</Description>
              </Row>
              <Row>
                <Title>Win</Title>
                <Description>{stats.winPercent}</Description>
              </Row>
              <Row>
                <Title>Headshots</Title>
                <Description>
                  {stats.headshots !== undefined
                    ? stats.headshots
                    : stats.headShots}
                </Description>
              </Row>
              <Row>
                <Title>Accuracy</Title>
                <Description>{stats.accuracy}</Description>
              </Row>
              <Row>
                <Title>Best class</Title>
                <Description>{stats.bestClass}</Description>
              </Row>
              <Row>
                <Title>Highest Killsteak</Title>
                <Description>{stats.highestKillStreak}</Description>
              </Row>
              <Row>
                <Title>Revives</Title>
                <Description>{stats.revives}</Description>
              </Row>
              {game === "bf1" || game === "bfv" ? (
                <>
                  <Row>
                    <Title>Infan K/D</Title>
                    <Description>{stats.infantryKillDeath}</Description>
                  </Row>
                  <Row>
                    <Title>Infan KPM</Title>
                    <Description>{stats.infantryKillsPerMinute}</Description>
                  </Row>
                </>
              ) : (
                <>
                  <Row>
                    <Title>Repairs</Title>
                    <Description>{stats.repairs}</Description>
                  </Row>
                  <Row>
                    <Title>Resupplies</Title>
                    <Description>{stats.resupplies}</Description>
                  </Row>
                </>
              )}
              <Row>
                <Title>Time Played</Title>
                <Description>{stats.timePlayed}</Description>
              </Row>
            </Column>
          ) : (
            // bfh
            <Column>
              <Row>
                <Title>KPM</Title>
                <Description>{stats.killsPerMinute}</Description>
              </Row>
              <Row>
                <Title>SPM</Title>
                <Description>{stats.scorePerMinute}</Description>
              </Row>
              <Row>
                <Title>Win</Title>
                <Description>{stats.winPercent}</Description>
              </Row>
              <Row>
                <Title>KD</Title>
                <Description>{stats.killDeath}</Description>
              </Row>
              <Row>
                <Title>Accuracy</Title>
                <Description>{stats.accuracy}</Description>
              </Row>
              <Row>
                <Title>Enforcer</Title>
                <Description>{stats.enforcer}</Description>
              </Row>
              <Row>
                <Title>Mechanic</Title>
                <Description>{stats.mechanic}</Description>
              </Row>
              <Row>
                <Title>Operator</Title>
                <Description>{stats.operator}</Description>
              </Row>
              <Row>
                <Title>Professional</Title>
                <Description>{stats.professional}</Description>
              </Row>
              <Row>
                <Title>Hacker</Title>
                <Description>{stats.hacker}</Description>
              </Row>
              <Row>
                <Title>Best class</Title>
                <Description>{stats.bestClass}</Description>
              </Row>
              <Row>
                <Title>Cash per min</Title>
                <Description>{stats.cashPerMinute}</Description>
              </Row>
              <Row>
                <Title>Kill assists</Title>
                <Description>{stats.killAssists}</Description>
              </Row>
              <Row>
                <Title>Time Played</Title>
                <Description>{stats.timePlayed}</Description>
              </Row>
            </Column>
          )}
        </Body>
      </Main>
    );
  } else {
    return <div></div>;
  }
}

const StreamColumn = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  margin: 0 auto;
  margin-left: 1rem;
  margin-top: 1rem;
`;

export function SteamStat({
  match,
}: RouteComponentProps<TParams>): React.ReactElement {
  const { isLoading: loading, isError: error, data: stats } = useQuery(
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
            <Title>KPM</Title>
            <Description>{stats.killsPerMinute}</Description>
          </Row>
          <Row>
            <Title>SPM</Title>
            <Description>{stats.scorePerMinute}</Description>
          </Row>
          <Row>
            <Title>Skill</Title>
            <Description>{stats.skill}</Description>
          </Row>
          <Row>
            <Title>KD</Title>
            <Description>{stats.killDeath}</Description>
          </Row>
          <Row>
            <Title>Longest headshot</Title>
            <Description>{stats.longestHeadShot}</Description>
          </Row>
          <Row>
            <Title>Win</Title>
            <Description>{stats.winPercent}</Description>
          </Row>
          <Row>
            <Title>Headshots</Title>
            <Description>{stats.headshots}</Description>
          </Row>
          <Row>
            <Title>Accuracy</Title>
            <Description>{stats.accuracy}</Description>
          </Row>
          <Row>
            <Title>Best class</Title>
            <Description>{stats.bestClass}</Description>
          </Row>
          <Row>
            <Title>Highest Killsteak</Title>
            <Description>{stats.highestKillStreak}</Description>
          </Row>
          <Row>
            <Title>Revives</Title>
            <Description>{stats.revives}</Description>
          </Row>
          <Row>
            <Title>Infan K/D</Title>
            <Description>{stats.infantryKillDeath}</Description>
          </Row>
          <Row>
            <Title>Infan KPM</Title>
            <Description>{stats.infantryKillsPerMinute}</Description>
          </Row>
          <Row>
            <Title>Time Played</Title>
            <Description>{stats.timePlayed}</Description>
          </Row>
        </StreamColumn>
      </Main>
    );
  } else {
    return <div></div>;
  }
}
