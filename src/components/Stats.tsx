import * as React from "react";
import "../locales/config";
import { useTranslation } from "react-i18next";
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
import { PathMatch, useMatch } from "react-router-dom";
import styles from "./Stats.module.scss";
import { calculateZoomStyle } from "./functions/calculateZoom";

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
      <a
        className="Main"
        style={calculateZoomStyle(match.params.zoom)}
        href={`https://gametools.network/stats/${match.params.plat}/${
          match.params.type
        }/${encodeURIComponent(match.params.eaid)}`}
        target="_blank"
        rel="noreferrer"
      >
        <div
          className={styles.Background}
          style={{
            backgroundImage: `url("https://cdn.gametools.network/backgrounds/${game}/1.webp")`,
          }}
        >
          <div className={styles.Blur}>
            <p className={styles.BarText} style={{ left: "30px" }}>
              BATTLEFIELD {gameid} STATS
            </p>
            {!(width <= 700 && match.params.zoom === "100") && (
              <>
                {["bfh", "bf2042"].includes(game) ? (
                  <hr
                    className={styles.Bar}
                    style={{ left: differentWidth?.[game] }}
                  />
                ) : (
                  <hr className={styles.Bar} />
                )}
                <p
                  className={styles.BarText}
                  style={{
                    right: "30px",
                    color: "rgba(255, 255, 255, 0.81)",
                    textAlign: "right",
                  }}
                >
                  GAMETOOLS.NETWORK
                </p>
              </>
            )}
          </div>
        </div>
        <div className={styles.Body}>
          <img className={styles.Img} src={stats.avatar} />
          <div className={styles.PlayerName}>{stats.userName}</div>
          {stats.rank && (
            <>
              <img
                className={styles.RankImg}
                src={
                  stats.rankImg ??
                  `https://cdn.gametools.network/${game}/${stats.rank}.png`
                }
              />
              <div className={styles.Rank}>
                {t("stats.rank")} {stats.rank}
              </div>
            </>
          )}
          {!(width <= 700 && match.params.zoom === "100") && (
            <>
              {game === "bf1marne" ? (
                <img
                  className={styles.GameImg}
                  style={{ width: "55px" }}
                  src={`https://marne.io/images/marne_logo.png`}
                />
              ) : (
                <>
                  <img
                    className={styles.GameImg}
                    src={`https://cdn.gametools.network/games/${game}.png`}
                  />
                  <img
                    className={styles.Platform}
                    src={`https://cdn.gametools.network/platforms/${
                      platformImage[match.params.plat]
                    }.png`}
                  />
                </>
              )}
            </>
          )}
          <div className={styles.Column}>
            {gameStats?.[game] !== undefined &&
              Object.entries(gameStats?.[game]).map(([key, value], index) => {
                return (
                  <div className={styles.Row} key={index}>
                    <h4 className={styles.Title}>{t(`stats.${key}`)}</h4>
                    <p className={styles.Description}>
                      {value
                        .split(".")
                        .reduce(
                          (o: { [x: string]: number }, i: string | number) =>
                            o[i],
                          stats,
                        )}
                    </p>
                  </div>
                );
              })}
          </div>
        </div>
      </a>
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
}: Readonly<{
  width: number;
  match: PathMatch<"type" | "lang" | "plat" | "eaid" | "gameid" | "zoom">;
  gameid: string;
  game: string;
  text: string;
}>) {
  const { t, i18n } = useTranslation();

  React.useState(() => {
    i18n.changeLanguage(match.params.lang);
  });
  return (
    <a
      className="Main"
      style={calculateZoomStyle(match.params.zoom)}
      href={`https://gametools.network/stats/${match.params.plat}/${
        match.params.type
      }/${encodeURIComponent(match.params.eaid)}`}
      target="_blank"
      rel="noreferrer"
    >
      <div
        className={styles.Background}
        style={{
          backgroundImage: `url("https://cdn.gametools.network/backgrounds/${
            game === "bf1marne" ? "bf1" : game
          }/1.webp")`,
        }}
      >
        <div className={styles.Blur}>
          <p className={styles.BarText} style={{ left: "30px" }}>
            BATTLEFIELD {gameid} STATS
          </p>
          {width <= 700 && match.params.zoom === "100" ? (
            <></>
          ) : (
            <>
              {["bfh", "bf2042"].includes(game) ? (
                <hr
                  className={styles.Bar}
                  style={{ left: differentWidth?.[game] }}
                />
              ) : (
                <hr className={styles.Bar} />
              )}
              <p
                className={styles.BarText}
                style={{
                  right: "30px",
                  color: "rgba(255, 255, 255, 0.81)",
                  textAlign: "right",
                }}
              >
                GAMETOOLS.NETWORK
              </p>
            </>
          )}
        </div>
      </div>
      <div className={styles.Body}>
        <img
          className={styles.Img}
          src="https://eaassets-a.akamaihd.net/battlelog/defaultavatars/default-avatar-36.png"
        />
        <div className={styles.PlayerName}>{text}</div>
        {game !== "bf2042" ? (
          <div className={styles.Rank}>{t("stats.rank")} 0</div>
        ) : (
          <></>
        )}
        {width <= 700 && match.params.zoom === "100" ? (
          <></>
        ) : (
          <>
            <img
              className={styles.GameImg}
              src={`https://cdn.gametools.network/games/${game}.png`}
            />
            <img
              className={styles.Platform}
              src={`https://cdn.gametools.network/platforms/${
                platformImage[match.params.plat]
              }.png`}
            />
          </>
        )}
        <div className={styles.Column}>
          {gameStats?.[game] !== undefined && (
            <>
              {Object.entries(gameStats?.[game]).map(([key], index) => {
                return (
                  <div className={styles.Row} key={index}>
                    <h4 className={styles.Title}>{t(`stats.${key}`)}</h4>
                    <div className={styles.Description}>0</div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </a>
  );
}
