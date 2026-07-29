import * as React from "react";
import { Route, Routes, useMatch } from "react-router";
import { GetBfRanked } from "../api/BfRanked";
import { useQuery } from "@tanstack/react-query";
import { bf6 } from "gametools-global-mapping"
import * as styles from "./BfRanked.module.scss";
import { useTranslation } from "react-i18next";

function Default(): React.ReactElement {
  const match = useMatch(`/bf-ranked/default/:id`);
  const { t } = useTranslation();

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

  const rank = profile?.competitiveRanks?.find((d: { mode: string; }) => d.mode === "GraniteSquad0");

  return (
    <div className={styles.content}>
      <div className={styles.block}>
        <div className={styles.inner}>
          <div>
            <div className={styles.name}>
              {t("bf-ranked.default.rank")}
            </div>
            <div className={styles.message}>
              {rank?.name}
            </div>
          </div>
          <img className={styles.rankIcon} src={bf6.ranked_br_images_s4[rank?.rank] || undefined} />
        </div>
      </div>
      <div>
        <div>
          <div className={styles.description}>
            {t("bf-ranked.default.bfRotalSquad")}
          </div>
          <div className={styles.title}>
            {t("bf-ranked.default.prevRound")}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.block}>
            <div className={styles.name}>
              {t("bf-ranked.default.kills")}
            </div>
            <div className={styles.message}>
              {lastSession?.stats?.killsRealPlayers}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.name}>
              {t("bf-ranked.default.deaths")}
            </div>
            <div className={styles.message}>
              {lastSession?.stats?.deathsFinished}
            </div>
          </div>
          <div className={styles.block}>
            <div className={styles.name}>
              {t("bf-ranked.default.placement")}
            </div>
            <div className={styles.message}>
              {lastSession?.stats?.placementLastPlayedGame}
            </div>
          </div>
        </div>
      </div>
    </div>
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