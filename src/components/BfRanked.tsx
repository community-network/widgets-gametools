import * as React from "react";
import { Route, Routes, useLocation, useMatch } from "react-router";
import { GetBfRanked, type SessionReturn, type StatsReturn } from "../api/BfRanked";
import { useQuery } from "@tanstack/react-query";
import { bf6 } from "gametools-global-mapping"
import styles from "./BfRanked.module.scss";
import { useTranslation } from "react-i18next";
import { useRef } from 'react';
import gsap from 'gsap';
import TextPlugin from "gsap/TextPlugin";
import { useGSAP } from '@gsap/react';

const currentInfoEnum = {
  session: 0,
  stats: 1
} as const;

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(TextPlugin)

type currentInfo = (typeof currentInfoEnum)[keyof typeof currentInfoEnum];

const toNumber = (value: unknown): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
};

const calcKd = (kills: unknown, deaths: unknown): number => {
  const k = toNumber(kills);
  const d = toNumber(deaths);
  return d === 0 ? k : k / d;
};

const safeRatio = (
  numerator: unknown,
  denominator: unknown,
): number | null => {
  if (numerator === undefined || numerator === null) return null;
  const d = toNumber(denominator);
  if (d <= 0) return null;
  return toNumber(numerator) / d;
};

function Default(): React.ReactElement {
  const currentTitle = useRef<HTMLDivElement | null>(null);
  const firstTitle = useRef<HTMLDivElement | null>(null);
  const secondTitle = useRef<HTMLDivElement | null>(null);
  const thirdTitle = useRef<HTMLDivElement | null>(null);
  const firstRef = useRef<HTMLDivElement | null>(null);
  const secondRef = useRef<HTMLDivElement | null>(null);
  const thirdRef = useRef<HTMLDivElement | null>(null);
  const match = useMatch(`/bf-ranked/default/:id`);
  const query = new URLSearchParams(useLocation().search);
  const currentQuery = query.get("current");
  const interval = query.get("interval") ?? 10;
  const { t } = useTranslation();
  const initalState = currentInfoEnum.stats;
  const currentRef = React.useRef<currentInfo>(initalState);
  const statsRef = React.useRef<StatsReturn | undefined>(undefined);
  const sessionRef = React.useRef<SessionReturn[] | undefined>(undefined);
  const statsLoadingRef = React.useRef<boolean | undefined>(undefined);
  const sessionLoadingRef = React.useRef<boolean | undefined>(undefined);
  const [current, setCurrent] = React.useState<currentInfo>(initalState);
  const [first, setFirst] = React.useState<number | undefined>(0);
  const [second, setSecond] = React.useState<number | undefined>(0);
  const [third, setThird] = React.useState<number | string | undefined>(0);

  const {
    isLoading: profileLoading,
    isError: profileError,
    data: profile,
  } = useQuery({
    queryKey: ["bf-ranked-profile" + match?.params.id],
    queryFn: () =>
      GetBfRanked.profile({
        id: match?.params.id,
      }),
    retry: 1,
    refetchInterval: 1 * 60 * 1000
  });

  const {
    isLoading: sessionsLoading,
    isError: sessionsError,
    data: sessions,
  } = useQuery({
    queryKey: ["bf-ranked-session" + match?.params.id],
    queryFn: () =>
      GetBfRanked.sessions({
        id: match?.params.id, amount: 21
      }),
    retry: 1,
    refetchInterval: 1 * 60 * 1000
  });

  const {
    isLoading: statsLoading,
    isError: statsError,
    data: stats,
  } = useQuery({
    queryKey: ["bf-ranked-stats" + match?.params.id],
    queryFn: () =>
      GetBfRanked.stats({
        id: match?.params.id,
      }),
    retry: 1,
    refetchInterval: 1 * 60 * 1000
  });

  React.useEffect(() => {
    currentRef.current = current;
    statsRef.current = stats;
    sessionRef.current = sessions;
    statsLoadingRef.current = statsLoading;
    sessionLoadingRef.current = sessionsLoading;
  })

  const setState = () => {
    if (currentRef.current === 1) {
      setCurrent(0);
    } else {
      setCurrent(1);
    }

    if (currentTitle.current !== undefined) {
      gsap.to(currentTitle.current, {
        duration: 1,
        text: currentRef.current === 0 ? t("bf-ranked.default.prevRound") : t("bf-ranked.default.overview"),
        ease: "power2.out",
      });
    }
    if (firstTitle.current !== undefined) {
      gsap.to(firstTitle.current, {
        duration: 1,
        text: currentRef.current === 0 ? t("bf-ranked.default.kills") : t("bf-ranked.default.winRate"),
        ease: "power2.out",
      });
    }
    if (secondTitle.current !== undefined) {
      gsap.to(secondTitle.current, {
        duration: 1,
        text: currentRef.current === 0 ? t("bf-ranked.default.deaths") : t("bf-ranked.default.killDeath"),
        ease: "power2.out",
      });
    }
    if (thirdTitle.current !== undefined) {
      gsap.to(thirdTitle.current, {
        duration: 1,
        text: currentRef.current === 0 ? t("bf-ranked.default.placement") : t("bf-ranked.default.winStreak"),
        ease: "power2.out",
      });
    }

    const isLoading = currentRef.current == currentInfoEnum.session ? sessionLoadingRef.current : statsLoadingRef.current;

    const firstRes = currentRef.current == currentInfoEnum.session ? sessionRef.current?.[0]?.stats?.killsRealPlayers
      : (safeRatio(
        statsRef.current?.wonGames,
        toNumber(statsRef.current?.wonGames) + toNumber(statsRef.current?.lostGames),
      ) || 0) * 100;

    const firstCounter = { value: first };
    gsap.to(firstCounter, {
      value: firstRes,
      duration: 1.0,
      ease: "power2.out",
      onUpdate: function () {
        if (firstRef.current !== null) {
          if (isLoading) {
            firstRef.current.textContent = t("loading")
          } else {
            firstRef.current.textContent = `${(firstCounter.value ?? 0).toFixed(1)}${currentRef.current == currentInfoEnum.session ? "%" : ""}`;
          }
        }
      },
      onComplete: function () {
        setFirst(firstRes);
        if (firstRef.current !== null && currentRef.current == currentInfoEnum.stats && !isLoading) {
          firstRef.current.textContent = `${Math.round(firstRes ?? 0)}`;
        }
      }
    });



    const secondRes = currentRef.current == currentInfoEnum.session ? sessionRef.current?.[0]?.stats?.deathsFinished : calcKd(statsRef.current?.killsRealPlayers, statsRef.current?.deathsFinished);

    const secondCounter = { value: second };
    gsap.to(secondCounter, {
      value: secondRes,
      duration: 1.0,
      ease: "power2.out",
      onUpdate: function () {
        if (secondRef.current !== null) {
          if (isLoading) {
            secondRef.current.textContent = t("loading")
          } else {
            secondRef.current.textContent = `${(secondCounter.value ?? 0).toFixed(2)}`;
          }
        }
      },
      onComplete: function () {
        setSecond(secondRes);
        if (secondRef.current !== null && currentRef.current == currentInfoEnum.stats && !isLoading) {
          secondRef.current.textContent = `${Math.round(secondRes || 0)}`;
        }
      }
    });

    let winstreak = 0;
    if (sessionRef.current !== undefined) {
      for (const element of sessionRef.current) {
        if (element.stats?.lostGames > 0) {
          break;
        }
        winstreak += element.stats?.wonGames;
      }
    }

    const thirdRes = currentRef.current == currentInfoEnum.session ? sessionRef.current?.[0]?.stats?.placementLastPlayedGame : winstreak;

    const thirdCounter = { value: third };
    gsap.to(thirdCounter, {
      value: thirdRes,
      duration: 1.0,
      ease: "power2.out",
      onUpdate: function () {
        if (thirdRef.current !== null) {
          if (isLoading) {
            thirdRef.current.textContent = t("loading")
          } else {
            if (typeof thirdCounter.value === 'string') {
              thirdRef.current.textContent = "?";
            } else {
              thirdRef.current.textContent = `${(thirdCounter.value ?? 0).toFixed(2)}`;
            }
          }
        }
      },
      onComplete: function () {
        setThird(thirdRes);
        if (thirdRef.current !== null && !isLoading) {
          thirdRef.current.textContent = `${thirdRes}`;
        }
      }
    });
  }

  React.useEffect(() => {
    if (currentQuery === null) {
      const timer = window.setInterval(() => {
        setState();
      }, (toNumber(interval) * 1000));
      return () => {
        window.clearInterval(timer);
      };
    } else {
      if (currentQuery == "stats") {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrent(currentInfoEnum.stats);
      } else if (currentQuery == "session") {
        setCurrent(currentInfoEnum.session);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuery]);


  const rank = profile?.competitiveRanks?.find((d: { mode: string; }) => d.mode === "GraniteSquad0");
  const ranked_br_images_s4: { [key: string]: string } = bf6.ranked_br_images_s4;

  return (
    <div className={styles.content}>
      <div className={styles.block} style={{ paddingRight: profileError ? "1rem" : "0.25rem" }}>
        {profileError ? (
          <>
            <div className={styles.name}>
              {t("error")}
            </div>
            <div className={styles.errorMessage}>
              {t("bf-ranked.default.error.profileLoad")}
            </div>
          </>
        ) : (
          <div className={styles.inner}>
            <div>
              <div className={styles.name}>
                {t("bf-ranked.default.rank")}
              </div>
              <div className={styles.message}>
                {profileLoading ? t("loading") : rank?.name}
              </div>
            </div>
            {(rank?.top250Position !== undefined && rank?.top250Position > 0) ? (
              <div className={styles.rank}>
                <img className={styles.rankIcon} src="https://cdn.gametools.network/ranks/bf6/ranked_br_divisions/season4/top250.webp" />
                <div className={styles.rankNumber}>{rank?.top250Position}</div>
              </div>
            ) : (
              <img className={styles.rankIcon} src={ranked_br_images_s4[rank?.rank as string] || undefined} />
            )}
          </div>
        )}
      </div>
      <div>
        <div>
          <div className={styles.description}>
            {t("bf-ranked.default.bfRotalSquad")}
          </div>
          <div ref={currentTitle} className={styles.title}>
            {t("bf-ranked.default.prevRound")}
          </div>
        </div>
        {(sessionsError || statsError) ? (
          <div className={styles.block}>
            {
              sessionsError ? (
                <>
                  <div className={styles.name}>
                    {t("error")}
                  </div>
                  <div className={styles.errorMessage}>
                    {t("bf-ranked.default.error.lastSessionLoad")}
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.name}>
                    {t("error")}
                  </div>
                  <div className={styles.errorMessage}>
                    {t("bf-ranked.default.error.statsLoad")}
                  </div>
                </>
              )
            }
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.block}>
              <div ref={firstTitle} className={styles.name}>
                {t("bf-ranked.default.kills")}
              </div>
              <div ref={firstRef} className={styles.message}>
                {t("loading")}
              </div>
            </div>
            <div className={styles.block}>
              <div ref={secondTitle} className={styles.name}>
                {t("bf-ranked.default.deaths")}
              </div>
              <div ref={secondRef} className={styles.message}>
                {t("loading")}
              </div>
            </div>
            <div className={styles.block}>
              <div ref={thirdTitle} className={styles.name}>
                {t("bf-ranked.default.placement")}
              </div>
              <div ref={thirdRef} className={styles.message}>
                {t("loading")}
              </div>
            </div>
          </div>
        )}
      </div>
    </div >
  )
}

export default function Routing(): React.ReactElement {
  return (
    <Routes>
      <Route
        path="default/:id"
        element={<Default />}
      />
    </Routes>
  )
}