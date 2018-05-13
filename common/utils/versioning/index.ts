import { Releases, Platforms, Name } from './types';
import { VERSION } from 'config';
import { isNewerVersion } from '../helpers';

export function validPlatform(str: string): str is Platforms {
  const platformArr = Object.values(Platforms);
  return platformArr.includes(str);
}

export function validName(str: string): str is Name {
  const nameArr = Object.values(Name);
  return nameArr.includes(str);
}

export function parseAssetName(assetName: string) {
  const electronAssetRaw = assetName.split('.');
  // check for array length
  if (!electronAssetRaw || electronAssetRaw.length < 4) {
    return null;
  }

  const [rawPlatform, verNum, rawName] = electronAssetRaw;
  if (validPlatform(rawPlatform) && verNum && validName(rawName)) {
    const platform = rawPlatform;
    // convert hyphens to dots
    // converts only the first two hyphens to dots
    // so strings like 1-0-0-RC2 -> 1.0.0-RC2
    // TODO: make this less fragile
    const versionNumber = verNum.replace('-', '.').replace('-', '.');
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
  console.log(`Releases: ${JSON.stringify(releases, null, 1)}`);
  const currentVersion = VERSION;
  for (const { assets } of releases) {
    console.log(`Current assets ${JSON.stringify(assets, null, 1)}`);
    for (const { name } of assets) {
      console.log(`Current name: ${name}`);
      const assetObj = parseAssetName(name);
      if (!assetObj) {
        continue;
      }
      const { versionNumber: nextVersion } = assetObj;
      console.log(`Current Version ${currentVersion}, Next Version ${nextVersion}`);
      if (isNewerVersion(currentVersion, nextVersion)) {
        console.log(`${nextVersion} is newer, returning with newer version`);
        return nextVersion;
      }
    }
  }
  console.log(`${VERSION} is the latest version, returning with nothing`);
  return null;
}
