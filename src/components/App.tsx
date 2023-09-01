import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../assets/scss/App.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "../locales/config";

const Stats = React.lazy(() => import("./Stats"));
const Servers = React.lazy(() => import("./Servers"));
const OldGames = React.lazy(() => import("./Amg"));
const Streamer = React.lazy(() => import("./Streamer"));

const queryClient = new QueryClient();

export default function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <I18nextProvider i18n={i18n}>
          <Routes>
            <Route path="/servers/*" element={<Servers />} />
            <Route path="/oldgames/*" element={<OldGames />} />
            <Route
              path="/stats/:plat/:type/:eaid/:gameid/:lang/:zoom"
              element={<Stats />}
            />
            <Route path="/*" element={<Streamer />} />
          </Routes>
        </I18nextProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}
