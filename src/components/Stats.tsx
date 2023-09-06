import * as React from "react";
import "../locales/config";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { GetStats } from "../api/GetStats";
import { useQuery } from "react-query";
import { getLanguage } from "../locales/config";
import { useWindowWidth } from "@react-hook/window-size";
import {
  differentWidth,
  gameStats,
  platformImage,
  shortName,
} from "../api/static";
import { Description, Main, Row, Title } from "./Materials";
import { PathMatch, useMatch } from "react-router-dom";

interface IGameImage {
  background: string;
}

const Background = styled.div<IGameImage>`
  background-position: left;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url("${(props) => props.background}");
  height: 100%;
  width: 100%;
  transform: translate(0, -196px);
`;

const Blur = styled.div`
  width: 100%;
  height: 196px;
  transform: translate(0, 196px);
  background: linear-gradient(180deg, rgba(21, 24, 41, 0) 0%, #151829 100%);
`;

const Body = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 196px;

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

export default function Stats(): React.ReactElement {
  const match = useMatch("/stats/:plat/:type/:eaid/:gameid/:lang/:zoom");
  const { t, i18n } = useTranslation();

  React.useState(() => {
    i18n.changeLanguage(match.params.lang);
  });

  const game = match.params.gameid;
  const gameid = shortName[game];
  const width = useWindowWidth();
  const {
    isLoading: loading,
    isError: error,
    data: stats,
  } = useQuery("stats" + game + match.params.eaid, () =>
    GetStats.stats({
      game: game,
      type: "stats",
      getter: match.params.type,
      userName: match.params.eaid,
      lang: getLanguage(),
      platform: match.params.plat,
    }),
  );
  if (!loading && !error) {
    if ("errors" in stats) {
      return (
        <DefaultStats
          width={width}
          match={match}
          gameid={gameid}
          game={game}
          text={t("stats.notFound")}
        />
      );
    }
    return (
      <Main
        zoom={match.params.zoom}
        href={`https://gametools.network/stats/${match.params.plat}/${
          match.params.type
        }/${encodeURIComponent(match.params.eaid)}`}
        target="_blank"
      >
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
                {["bfh", "bf2042"].includes(game) ? (
                  <Bar style={{ left: differentWidth?.[game] }} />
                ) : (
                  <Bar />
                )}
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
          {game !== "bf2042" ? (
            <>
              <RankImg
                src={
                  stats.rankImg !== undefined
                    ? stats.rankImg
                    : `https://cdn.gametools.network/${game}/${stats.rank}.png`
                }
              />
              <Rank>
                {t("stats.rank")} {stats.rank}
              </Rank>
            </>
          ) : (
            <></>
          )}
          {width <= 700 && match.params.zoom === "100" ? (
            <></>
          ) : (
            <>
              <GameImg
                src={`https://cdn.gametools.network/games/${game}.png`}
              />
              <Platform
                src={`https://cdn.gametools.network/platforms/${
                  platformImage[match.params.plat]
                }.png`}
              />
            </>
          )}
          <Column>
            {gameStats?.[game] !== undefined ? (
              <>
                {Object.entries(gameStats?.[game]).map(
                  ([key, value], index) => {
                    return (
                      <Row key={index}>
                        <Title>{t(`stats.${key}`)}</Title>
                        <Description>
                          {value
                            .split(".")
                            .reduce(
                              (
                                o: { [x: string]: number },
                                i: string | number,
                              ) => o[i],
                              stats,
                            )}
                        </Description>
                      </Row>
                    );
                  },
                )}
              </>
            ) : (
              <></>
            )}
          </Column>
        </Body>
      </Main>
    );
  } else {
    return (
      <DefaultStats
        width={width}
        match={match}
        gameid={gameid}
        game={game}
        text={t("loading")}
      />
    );
  }
}

function DefaultStats({
  width,
  match,
  gameid,
  game,
  text,
}: {
  width: number;
  match: PathMatch<"type" | "lang" | "plat" | "eaid" | "gameid" | "zoom">;
  gameid: string;
  game: string;
  text: string;
}) {
  const { t, i18n } = useTranslation();

  React.useState(() => {
    i18n.changeLanguage(match.params.lang);
  });
  return (
    <Main
      zoom={match.params.zoom}
      href={`https://gametools.network/stats/${match.params.plat}/${
        match.params.type
      }/${encodeURIComponent(match.params.eaid)}`}
      target="_blank"
    >
      <Background
        background={`https://cdn.gametools.network/backgrounds/${game}/1.jpg`}
      >
        <Blur>
          <BarText style={{ left: "30px" }}>BATTLEFIELD {gameid} STATS</BarText>
          {width <= 700 && match.params.zoom === "100" ? (
            <></>
          ) : (
            <>
              {["bfh", "bf2042"].includes(game) ? (
                <Bar style={{ left: differentWidth?.[game] }} />
              ) : (
                <Bar />
              )}
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
        <Img src="https://eaassets-a.akamaihd.net/battlelog/defaultavatars/default-avatar-36.png" />
        <PlayerName>{text}</PlayerName>
        {game !== "bf2042" ? <Rank>{t("stats.rank")} 0</Rank> : <></>}
        {width <= 700 && match.params.zoom === "100" ? (
          <></>
        ) : (
          <>
            <GameImg src={`https://cdn.gametools.network/games/${game}.png`} />
            <Platform
              src={`https://cdn.gametools.network/platforms/${
                platformImage[match.params.plat]
              }.png`}
            />
          </>
        )}
        <Column>
          {gameStats?.[game] !== undefined ? (
            <>
              {Object.entries(gameStats?.[game]).map(([key], index) => {
                return (
                  <Row key={index}>
                    <Title>{t(`stats.${key}`)}</Title>
                    <Description>0</Description>
                  </Row>
                );
              })}
            </>
          ) : (
            <></>
          )}
        </Column>
      </Body>
    </Main>
  );
}
