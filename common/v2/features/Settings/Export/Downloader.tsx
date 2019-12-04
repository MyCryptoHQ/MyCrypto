import React, { useState } from 'react';

import { Button, Link } from 'v2/components';
import { makeBlob } from 'v2/utils';
import translate from 'v2/translations';

interface DownloaderProps {
  getStorage(): void;
}

const Downloader = (props: DownloaderProps) => {
  const [blob, setBlob] = useState('');
  const [name, setName] = useState('');

  const handleDownload = () => {
    const cache = String(props.getStorage());
    const settingsBlob = makeBlob('text/json;charset=UTF-8', cache);
    setBlob(settingsBlob);
    setName('MyCryptoSettings.json');
  };

  return (
    <Link fullWidth={true} href={blob} download={name} onClick={handleDownload}>
      <Button fullWidth={true}>{translate('SETTINGS_EXPORT_DOWNLOAD')}</Button>
    </Link>
  );
};

export default Downloader;
