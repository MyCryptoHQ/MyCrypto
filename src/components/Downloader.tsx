import React from 'react';

import { LinkApp } from '@components';
import { COLORS } from '@theme';
import translate from '@translations';
import { makeBlob } from '@utils';

import { default as Button } from './Button';

export const Downloader: React.FC<{
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
    <LinkApp
      data-testid="export-json-link"
      width={'100%'}
      href={blob}
      isExternal={true}
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
    </LinkApp>
  );
};
