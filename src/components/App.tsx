import * as React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../assets/scss/App.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { BlackServerBox, WhiteServerBox, DetailedServerBox } from "./Servers";
import { OldGameOne, OldGameTwo } from "./Amg";
import Stats from "./Stats";
import { GameStreamStat, GameStreamScore, SteamStat } from "./Streamer";

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path="/servers/white/:gameid/:type/:sname/:platform"
          element={<WhiteServerBox />}
        />
        <Route
          path="/servers/black/:gameid/:type/:sname/:platform"
          element={<BlackServerBox />}
        />
        <Route
          path="/servers/detailed/:gameid/:type/:sname/:platform"
          element={<DetailedServerBox />}
        />
        <Route
          path="/oldgames/servers/detailed/amg/1"
          element={<OldGameOne />}
        />
        <Route
          path="/oldgames/servers/detailed/amg/2"
          element={<OldGameTwo />}
        />
        <Route
          path="/stats/:plat/:type/:eaid/:gameid/:lang/:zoom"
          element={<Stats />}
        />
        <Route
          path="/stream/:plat/:type/:eaid/:gameid/:lang/:zoom"
          element={<SteamStat />}
        />
        <Route
          path="/ingamestream/:id/:player/:lang/:zoom"
          element={<GameStreamStat />}
        />
        <Route
          path="/streamscore/:id/:lang/:zoom"
          element={<GameStreamScore />}
        />
      </Routes>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
