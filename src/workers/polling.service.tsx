import PollingWorker from 'worker-loader!./polling.worker.tsx';

import { IPollingWorkerAction, PollingAction } from './polling.worker';

interface IPollingService {
  start(): void;
  stop(): void;
  close(): void;
}

/*
    Usage:
    const worker = new PollingService(
      'https://proxy.mycryptoapi.com/cc?fsym=ETH&tsyms=USD',
      5000,
      data => this.setState({ rates: data }),
      err => console.debug('[RatesProvider]', err)
    );

    ...//
    componentDidMount() {
      worker.start();
    }
    componentWillUnmount() {
      worker.stop();
      worker.close();
    }
*/

// Facade to interact with Polling Worker. For the moment it supports
// a single action type. So it really should be a singleton.
// TBD when we decide if we want multiple polling systems.
class PollingService implements IPollingService {
  private worker: Worker;
  private interval: number;
  private url: string;
  private canTerminate = false;
  private successHandler: (data: TObject) => void;

  constructor(
    url: string,
    interval: number = 60000, // set a high default value ie. 60s.
    successHandler: (data: TObject) => void,
    errorHandler?: (err: any) => void
  ) {
    this.interval = interval;
    this.url = url;
    this.worker = new PollingWorker();
    this.worker.onerror = errorHandler ? (err) => errorHandler(err) : null;
    this.successHandler = successHandler;
    this.worker.onmessage = (message: MessageEvent) => {
      const { data } = message;
      // make sure it is set for each msg
      this.canTerminate = !!data.canTerminate;

      // we also use 'onmessage' to confirm the polling has stopped.
      // to avoid any confusion we only call successHandler if polling is still active.
      if (!this.canTerminate) {
        this.successHandler(message.data);
      }
    };
  }

  public start() {
    const msg: IPollingWorkerAction = {
      action: PollingAction.START,
      url: this.url,
      interval: this.interval
    };
    this.worker.postMessage(msg);
  }

  public stop() {
    const msg: IPollingWorkerAction = { action: PollingAction.STOP };
    this.worker.postMessage(msg);
  }

  public close() {
    // The worker uses setInterval so we avoid memory leaks by using a STOP message
    // to clearInterval before terminating the worker.
    if (this.canTerminate) {
      throw new Error('[Polling Service]: Please call stop() before close()');
    }
    this.worker.terminate();
  }

  public setSuccessHandler = (successHandler: (data: TObject) => void) => {
    this.successHandler = successHandler;
  };
}

export default PollingService;
