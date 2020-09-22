// @ts-ignore
import { EthereumGetAddressPayload, GetPublicKeyPayload, TrezorData } from 'trezor-connect';

export default {
  manifest: jest.fn(),

  async getPublicKey(params: {
    path?: string | number[];
    bundle?: (string | number[])[];
  }): Promise<TrezorData<GetPublicKeyPayload | GetPublicKeyPayload[]>> {
    let payload;

    if (params.bundle) {
      payload = [
        {
          serializedPath: `m/44'/60'/0'/0`,
          chainCode: '51f696d1838ec2986b979577cc43c1098e26fe34d9abaf319df00a7eb20e0311',
          publicKey: '021c3e866ccb8f158431f5036319dc16f0409bd385d796fbc122a22819f0ec9017'
        },
        {
          serializedPath: `m/44'/1'/0'/0`,
          chainCode: '9d73a228d784f361eed3910b1d49750b33bc8aea09180b78abb71a09a17ae689',
          publicKey: '02bc7ab0a01997363ba548279abf8302ecc50ed376fe74ba3133f1678346ce0c5d'
        }
      ];
    } else {
      payload = {
        serializedPath: `m/44'/60'/0'/0`,
        chainCode: '51f696d1838ec2986b979577cc43c1098e26fe34d9abaf319df00a7eb20e0311',
        publicKey: '021c3e866ccb8f158431f5036319dc16f0409bd385d796fbc122a22819f0ec9017'
      };
    }

    return {
      id: 0,
      payload,
      success: true
    };
  },

  async ethereumGetAddress(params: {
    path: string | number[];
  }): Promise<TrezorData<EthereumGetAddressPayload>> {
    let payload;

    if (params.path === `m/44'/60'/10'/0/0`) {
      payload = {
        address: '0x0719f46C96047A4f8A791394E338c8108E56F246',
        path: [2147483692, 2147483708, 2147483658, 0, 0],
        serializedPath: `m/44'/60'/10'/0/0`
      };
    } else {
      payload = {
        address: '0xA900c74246933B5F447C96581C5554Ac1bf36A92',
        path: [2147483692, 2147483708, 2147483663, 0, 0],
        serializedPath: `m/44'/60'/15'/0/0`
      };
    }

    return {
      id: 0,
      payload,
      success: true
    };
  }
};
