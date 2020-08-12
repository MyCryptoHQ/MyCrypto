import React, { useRef, useState, useEffect } from 'react';

import { path, prop } from '@vendor';
import { isVoid } from '@utils';
import { getCurrentDBConfig } from '@database';

const DBName = prop('main', getCurrentDBConfig());
const getHostName = path(['location', 'hostname']);
const getOrigin = path(['contentWindow', 'location', 'origin']);
const getLS = path(['contentWindow', 'localStorage', DBName]);

const getIFrameSrc = (hostname) => {
  switch (hostname) {
    case 'mycrypto.com':
      return 'beta.mycrypto.com';
    case 'mycryptobuilds.com':
      return 'https://landing.mycryptobuilds.com';
    default:
      return 'https://localhost:8000';
  }
};

const MigrateLS = ({ isEmpty }: { isEmpty: boolean }) => {
  const [LS, setLS] = useState();
  const ref = useRef<HTMLIFrameElement>(null);
  const src = getIFrameSrc(getHostName(window));

  useEffect(() => {
    const frame = ref.current;
    if (
      !frame || // Make sure ref exists.
      getOrigin(frame) !== src //|| // And that we are referencing the right frame
      // !getLS(frame)
      // !isEmpty // and that the user has only the default LS
    ) {
      return;
    }
    console.log(getLS(frame));

    setLS(getLS(frame));
  }, [ref]);

  const handleLoad = () => {
    console.debug('IFrame loaded');
  };

  const goToImport = () => {
    console.log('LS', LS);
  };

  return (
    <>
      <iframe src={src} ref={ref} style={{ display: 'none' }} onLoad={() => handleLoad()} />
      <div>
        You may have notice that the url changed to app.mycrypto.com We found your previous storage
        from beta.mycrypto.com. Would you like to import your settings?
        <button disabled={isVoid(LS)} onClick={goToImport}>
          Yes
        </button>
        <button>No</button>
      </div>
    </>
  );
};

export default MigrateLS;
