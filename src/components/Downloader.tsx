import React from 'react';

import { Button, Link } from '@components';
import { COLORS } from '@theme';
import translate from '@translations';
import { makeBlob } from '@utils';

const Downloader: React.FC<{
  data: string | TObject;
  onClick?(): void;
  fileName: string;
  mime?: string;
}> = ({ data, fileName, mime = 'text/json', onClick, children, ...props }) => {
  const blob = makeBlob(`${mime};charset=UTF-8`, data);

  const handleDownload = () => {
    // Callback triggered after download
    if (onClick) onClick();
  };

  return (
    <Link
      data-testid="export-json-link"
      fullWidth={true}
      href={blob}
      download={fileName}
      onClick={handleDownload}
      {...props}
    >
      {children}
      {!children && (
        <Button color={COLORS.WHITE} fullwidth={true}>
          {translate('SETTINGS_EXPORT_DOWNLOAD')}
        </Button>
      )}
    </Link>
  );
};

export default Downloader;
