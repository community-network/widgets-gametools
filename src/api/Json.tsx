import "regenerator-runtime";

const MODE = "prod";

const endPoints = {
  dev: "http://localhost:8787",
  prod: "https://api.gametools.network",
};

export default class JsonClient {
  constructParamStr(params: { [name: string]: string }): string {
    params = params || {};
    let paramStr = "";
    for (const s in params) {
      paramStr += s + "=" + params[s] + "&";
    }
    if (paramStr !== "") paramStr = "?" + paramStr;
    return paramStr;
  }
  constructApiUrl(method: string, params: { [name: string]: string }): string {
    const paramStr = this.constructParamStr(params);
    const apiEP = endPoints[MODE];
    return apiEP + method + paramStr;
  }
  async fetchMethod(
    method: string,
    params: { [name: string]: string },
  ): Promise<Response> {
    return fetch(this.constructApiUrl(method, params));
  }
  getJsonMethod(
    method: string,
    params: { [name: string]: string },
  ): Promise<any> {
    return this.errorHandler(this.fetchMethod(method, params));
  }
  async errorHandler(
    response: Promise<Response>,
  ): Promise<{ [name: string]: string }> {
    return response.then(
      (result) => {
        return result.json().then(
          (json) => {
            if ("error" in json) {
              throw json.error;
            }
            if ("data" in json) {
              if (json.data.length > 0) {
                if ("error" in json.data[0]) {
                  throw json.data[0].error;
                }
              }
            }
            return json;
          },
          (error) => this.spawnError(error, 600),
        );
      },
      (error) => this.spawnError(error, response),
    );
  }
  spawnError(error: unknown, code: number | Promise<Response>): void {
    throw {
      error: {
        message: error,
        code: code,
      },
    };
  }
}
