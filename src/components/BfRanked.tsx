import * as React from "react";
import { Route, Routes, useLocation, useMatch } from "react-router";
import { GetBfRanked } from "../api/BfRanked";
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

const percentFormatter = new Intl.NumberFormat(undefined, {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const decimalFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatDecimal = (value: unknown): string => {
  const n = toFiniteNumber(value);
  return n === null ? "—" : decimalFormatter.format(n);
};

const toFiniteNumber = (value: unknown): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const formatPercent = (value: unknown): string => {
  const n = toFiniteNumber(value);
  return n === null ? "—" : percentFormatter.format(n);
};

const formatRatio = (value: number | null): string =>
  value === null ? "—" : formatPercent(value);

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
  const currentTitle = useRef<HTMLDivElement>(undefined);
  const firstTitle = useRef<HTMLDivElement>(undefined);
  const secondTitle = useRef<HTMLDivElement>(undefined);
  const thirdTitle = useRef<HTMLDivElement>(undefined);
  const match = useMatch(`/bf-ranked/default/:id`);
  const query = new URLSearchParams(useLocation().search);
  const currentQuery = query.get("current");
  const interval = query.get("interval") ?? 10;
  const { t } = useTranslation();
  const initalState = currentInfoEnum.stats;
  const currentRef = React.useRef<currentInfo>(initalState);
  const [current, setCurrent] = React.useState<currentInfo>(initalState);

  React.useEffect(() => {
    currentRef.current = current;
  })
  React.useEffect(() => {
    if (currentQuery === null) {
      const timer = window.setInterval(() => {
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
    isLoading: lastSessionLoading,
    isError: lastSessionError,
    data: lastSession,
  } = useQuery({
    queryKey: ["bf-ranked-session" + match?.params.id],
    queryFn: () =>
      GetBfRanked.lastSession({
        id: match?.params.id,
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
            <img className={styles.rankIcon} src={ranked_br_images_s4[rank?.rank as string] || undefined} />
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
        {(lastSessionError || statsError) ? (
          <div className={styles.block}>
            {
              lastSessionError ? (
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
              <div className={styles.message}>
                {current == currentInfoEnum.session ? (
                  lastSessionLoading ? t("loading") : lastSession?.stats?.killsRealPlayers
                ) : (
                  statsLoading ? t("loading") : formatRatio(safeRatio(
                    stats?.wonGames,
                    toNumber(stats?.wonGames) + toNumber(stats?.lostGames),
                  ))
                )}
              </div>
            </div>
            <div className={styles.block}>
              <div ref={secondTitle} className={styles.name}>
                {t("bf-ranked.default.deaths")}
              </div>
              <div className={styles.message}>
                {current == currentInfoEnum.session ? (
                  lastSessionLoading ? t("loading") : lastSession?.stats?.deathsFinished
                ) : (
                  statsLoading ? t("loading") : formatDecimal(calcKd(stats?.killsRealPlayers, stats?.deathsFinished))
                )}
              </div>
            </div>
            <div className={styles.block}>
              <div ref={thirdTitle} className={styles.name}>
                {t("bf-ranked.default.placement")}
              </div>
              <div className={styles.message}>
                {current == currentInfoEnum.session ? (
                  lastSessionLoading ? t("loading") : lastSession?.stats?.placementLastPlayedGame
                ) : (
                  statsLoading ? t("loading") : "?"
                )}
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