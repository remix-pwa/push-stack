export type GetLoadContextType = {
  fetchFromServer: () => Promise<Response>;
  setConnectivityStatus: (status: string) => Promise<void>;
  getConnectivityStatus: () => Promise<string>;
  event: FetchEvent;
}