import { useEffect, useRef } from 'react';

import styled from 'styled-components';

import { TURL } from '@types';

const SIFrame = styled.iframe`
  display: ${(p) => (p.hidden ? 'none' : 'default')};
`;

const IFrame = ({
  src,
  onLoad,
  reload = false,
  hidden = false
}: {
  src: TURL;
  hidden?: boolean;
  reload?: boolean;
  onLoad(ref: HTMLIFrameElement): void;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef && iframeRef.current && reload) {
      try {
        iframeRef.current.contentWindow?.location.reload();
        onLoad(iframeRef.current);
      } catch (err) {
        console.debug('[IFrame]: ', err);
      }
    }
  }, [reload]);

  const handleLoad = () => {
    if (!iframeRef.current) {
      throw new Error('[MYC] IFrame ref.current missing');
    }
    onLoad(iframeRef.current);
  };

  return (
    <SIFrame data-testid="iframe" ref={iframeRef} src={src} onLoad={handleLoad} hidden={hidden} />
  );
};

export default IFrame;
