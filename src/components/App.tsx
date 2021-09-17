import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { hot } from "react-hot-loader";
import "../assets/scss/App.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { BlackServerBox, WhiteServerBox, AmgServerBox } from "./Servers";

const queryClient = new QueryClient();

class App extends React.Component<Record<string, unknown>, undefined> {
  public render() {
    return (
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Switch>
            <Route
              exact
              path="/servers/white/:gameid/:type/:sname/:platform"
              component={WhiteServerBox}
            />
            <Route
              exact
              path="/servers/black/:gameid/:type/:sname/:platform"
              component={BlackServerBox}
            />
            <Route
              exact
              path="/servers/amg/:gameid/:type/:sname/:platform"
              component={AmgServerBox}
            />
          </Switch>
        </QueryClientProvider>
      </BrowserRouter>
    );
  }
}

declare let module: Record<string, unknown>;

export default hot(module)(App);
