import Worker from 'worker-loader!./workers/searchPK.worker.ts';

export default function searchPK(basePrivateKey: string, targetAddress: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const worker = new Worker();
    worker.postMessage({ basePrivateKey, targetAddress });
    worker.onmessage = (ev: MessageEvent) => {
      const data = ev.data;

      if (data) {
        return resolve(data);
      }

      reject();
    };
  });
}
