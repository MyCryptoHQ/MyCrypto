import { WalletLib } from 'shared/enclave/types';
// TODO: Trezor not working right now, come back later
// TODO: Type trezor lib
// import { DeviceList } from 'trezor.js-node';
// const deviceList = new DeviceList({ debug: true });

const Trezor: WalletLib = {
  async getChainCode() {
    throw new Error('Not yet implemented');
    // const device = await deviceList.acquireFirstDevice(true);
    // console.log(device);
    // device.run((session: any) => {
    //   return session.signMessage([1,2], "message", "bitcoin");
    // });
    //
    // return { chainCode: 'test', publicKey: 'test' };
  },

  async signTransaction() {
    throw new Error('Not yet implemented');
  }
};

export default Trezor;
