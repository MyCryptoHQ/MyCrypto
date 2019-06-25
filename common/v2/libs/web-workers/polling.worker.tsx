import 'idempotent-babel-polyfill';

export enum PollingAction {
  START = 'POLLING_WORKER_START',
  STOP = 'POLLING_WORKER_STOP'
}

export interface IPollingWorkerAction {
  action: PollingAction;
  canTerminate?: boolean;
  interval?: number;
  url?: string;
}

const worker: Worker = self as any; // Get a reference to self.
let poller: number; // Keep a reference to the setInterval we use for polling.

function stopPolling() {
  clearInterval(poller);
}

function startPolling(requestUrl: string, interval: number) {
  console.debug(`[Polling Worker]: Initialising polling for ${requestUrl} every ${interval}ms `);

  const getRequest = async () => {
    try {
      const data = await fetch(requestUrl).then(res => res.json());
      worker.postMessage(JSON.parse(JSON.stringify(data))); // Worker can communicate via strings.
    } catch (err) {
      console.debug('[Polling Worker]: Error during fetch', err);
    }
  };

  getRequest(); // call immediately without waiting for the first interval to expire.
  poller = (setInterval(getRequest, interval) as unknown) as number;
}

worker.onmessage = (event: MessageEvent) => {
  const { action, interval, url } = event.data;
  switch (action) {
    case PollingAction.START:
      startPolling(url, interval);
      break;
    case PollingAction.STOP:
      stopPolling();
      worker.postMessage({ canTerminate: true });
      break;
    default:
      break;
  }
};
