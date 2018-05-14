import { Releases, Platforms, Name } from './types';
import { VERSION } from 'config';
import semver from 'semver';

const DELIMINATION_CHAR = '_';

export function validPlatform(str: string): str is Platforms {
  const platformArr = Object.values(Platforms);
  return platformArr.includes(str);
}

export function validName(str: string): str is Name {
  const name: Name = 'MyCrypto';
  return str.startsWith(name);
}

export function parseAssetName(assetName: string) {
  const electronAssetRaw = assetName.split(DELIMINATION_CHAR);
  // check for array length
  if (!electronAssetRaw || electronAssetRaw.length < 3) {
    return null;
  }

  const [rawPlatform, verNum, rawName] = electronAssetRaw;
  console.log([rawPlatform, verNum, rawName]);
  if (validPlatform(rawPlatform) && verNum && validName(rawName)) {
    const platform = rawPlatform;
    const versionNumber = verNum;
    const name = rawName;

    return {
      platform,
      versionNumber,
      name
    };
  }

  return null;
}

async function getGithubReleases(): Promise<Releases[]> {
  const apiUrl = 'https://api.github.com/repos/MyCryptoHQ/MyCrypto/releases';
  const res = await fetch(apiUrl, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'content-type': 'application/json; charset=utf-8'
    }
  });

  const json = await res.json();
  return json;
}

export async function getLatestElectronRelease() {
  const releases = await getGithubReleases();
  const currentVersion = VERSION;
  for (const { assets } of releases) {
    for (const { name } of assets) {
      const assetObj = parseAssetName(name);
      if (!assetObj) {
        continue;
      }
      const { versionNumber: nextVersion } = assetObj;
      if (semver.lt(currentVersion, nextVersion)) {
        return nextVersion;
      }
    }
  }
  return null;
}
