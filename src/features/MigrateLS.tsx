import React, { useState, useMemo, useEffect } from 'react';

import { IFrame } from '@components';
import { path, prop } from '@vendor';
import { isVoid } from '@utils';
import { getCurrentDBConfig } from '@database';
import { TURL, LocalStorage } from '@types';

const DBName = prop('main', getCurrentDBConfig());
const getHostName: (obj: Window) => string | undefined = path(['location', 'hostname']);
const getOrigin: (obj: any) => string | undefined = path(['contentWindow', 'location', 'origin']);
const getLS: (obj: any) => LocalStorage | undefined = path([
  'contentWindow',
  'localStorage',
  DBName
]);

const getIFrameSrc = (hostname: string) => {
  switch (hostname) {
    case 'mycrypto.com':
      return 'beta.mycrypto.com' as TURL;
    case 'mycryptobuilds.com':
      return 'https://landing.mycryptobuilds.com' as TURL;
    default:
      return 'https://localhost:8000' as TURL;
  }
};

const MigrateLS = ({
  isEmpty = true,
  importStorage
}: {
  isEmpty: boolean;
  importStorage(ls: LocalStorage): boolean;
}) => {
  const [iframeRef, setIframeRef] = useState<HTMLIFrameElement>();
  const [prevStorage, setPrevStorage] = useState<LocalStorage>();
  const [error, setError] = useState(false);
  const src = useMemo(() => getIFrameSrc(getHostName(window)!), []);

  useEffect(() => {
    console.debug('PrevStorage', prevStorage);
  }, [prevStorage]);

  const handleLoad = (frame: HTMLIFrameElement) => {
    const storage = getLS(frame);
    if (getOrigin(frame) !== src) {
      throw new Error(`[MYC] Iframe from unauthorized source ${getOrigin(frame)}`);
    } else if (!storage) {
      console.debug(`No LS found with key ${DBName}`);
    } else {
      setIframeRef(frame);
      setPrevStorage(storage);
    }
  };

  const handleImport = () => {
    if (prevStorage && importStorage(prevStorage)) {
      deletePrevStorage();
    } else {
      setError(true);
    }
  };

  const handleCancel = () => {
    deletePrevStorage();
  };

  const deletePrevStorage = () => {
    if (!iframeRef) return;
    iframeRef.contentWindow?.localStorage.removeItem(DBName);
  };

  return (
    <>
      {isEmpty && (
        <>
          <IFrame src={src} onLoad={handleLoad} hidden={true} />
          <div>
            You may have notice that the url changed to app.mycrypto.com We found your previous
            storage from beta.mycrypto.com. Would you like to import your settings?
            <button disabled={isVoid(prevStorage)} onClick={handleImport}>
              Yes
            </button>
            <button onClick={handleCancel}>No</button>
            {error && <div>Error occured</div>}
          </div>
        </>
      )}
    </>
  );
};

export default MigrateLS;
