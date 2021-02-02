import React from 'react';

import { COLORS } from '@theme';
import translate from '@translations';
import { makeBlob, useScreenSize } from '@utils';

import { default as Button } from './Button';
import { default as Link } from './Link';

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

  const { isMobile } = useScreenSize();

  return (
    <Link
      data-testid="export-json-link"
      fullWidth={true}
      href={blob}
      download={fileName}
      onClick={handleDownload}
      {...(isMobile ? { rel: 'noopener noreferrer', target: '_system' } : {})}
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
