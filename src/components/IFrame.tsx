import React, { useRef } from 'react';
import styled from 'styled-components';

import { TURL } from '@types';

const SIFrame = styled.iframe`
  display: ${(p) => (p.hidden ? 'none' : 'default')};
`;

const IFrame = ({
  src,
  onLoad,
  onError,
  hidden = false
}: {
  src: TURL;
  hidden?: boolean;
  onLoad(ref: HTMLIFrameElement): void;
  onError?(): void;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleLoad = () => {
    if (!iframeRef.current) {
      throw new Error('[MYC] IFrame ref.current missing');
    }
    onLoad(iframeRef.current);
  };

  return (
    <SIFrame
      data-testid="iframe"
      ref={iframeRef}
      src={src}
      onLoad={handleLoad}
      onError={onError}
      hidden={hidden}
    />
  );
};

export default IFrame;
