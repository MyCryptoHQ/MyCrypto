import { AxiosInstance } from 'axios';

import { OS } from '@config';

import { default as ApiService } from '../ApiService';
import { GITHUB_RELEASES_URL } from './constants';
import { ReleaseInfo, ReleaseURLs } from './types';

let instantiated = false;
let releaseInfo: ReleaseInfo;
export default class GithubService {
  public static instance = new GithubService();

  private service: AxiosInstance = ApiService.generateInstance({
    baseURL: GITHUB_RELEASES_URL
  });

  constructor() {
    if (instantiated) {
      throw new Error(`GithubService has already been instantiated.`);
    } else {
      instantiated = true;
    }
  }

  public getReleasesInfo = async () => {
    if (releaseInfo) {
      return releaseInfo;
    }

    const ASSET_REG_EXPS = {
      [OS.MAC]: /^mac.*\.dmg$/,
      [OS.WINDOWS]: /^windows.*\.exe$/,
      [OS.LINUX32]: /^linux-i386.*\.AppImage$/,
      [OS.LINUX64]: /^linux-x86-64.*\.AppImage$/,
      [OS.STANDALONE]: /^standalone.*\.zip$/
    };

    const response = await this.service.get('');
    const { assets, tag_name: version, name } = response.data;

    const releaseUrls: ReleaseURLs = {};
    Object.entries(ASSET_REG_EXPS).forEach(([key, regex]) => {
      const asset = assets.find((a: any) => regex.test(a.name));
      if (asset) {
        releaseUrls[key] = asset.browser_download_url;
      }
    });

    releaseInfo = { version, name, releaseUrls };
    return releaseInfo;
  };
}
