import { FunctionComponent, useRef, useState } from 'react';

import { parse as parseTransaction } from '@ethersproject/transactions';
import { toBuffer } from 'ethereumjs-util';
import styled from 'styled-components';

import { Box, Spinner } from '@components';
import { useScanner } from '@features/BroadcastTransaction/components/useScanner';
import { verifyTransaction } from '@helpers';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';

const VideoWrapper = styled.div`
  width: 100%;
  position: relative;

  svg {
    stroke: #a086f7 !important;
  }
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Error = styled.span`
  min-height: 22px;
  color: ${COLORS.ERROR_RED};
`;

interface ScannerProps {
  onScan(signedTransaction: string): void;
}

export const Scanner: FunctionComponent<ScannerProps> = ({ onScan }) => {
  const [decodeError, setDecodeError] = useState('');

  const handleDecode = ({ data }: { data: string }) => {
    setDecodeError('');

    try {
      const buffer = toBuffer(data);
      const transaction = parseTransaction(buffer);

      if (verifyTransaction(transaction)) {
        onScan(data);
      }
    } catch (error) {
      setDecodeError(translateRaw('INVALID_SIGNED_TRANSACTION_QR'));
    }
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const { isLoading, error } = useScanner(videoRef, handleDecode);

  return (
    <Box
      pb="15px"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      data-testid="scanner"
    >
      <VideoWrapper>
        <Video ref={videoRef} />
        {isLoading && (
          <SpinnerWrapper>
            <Spinner size={3} color="brand" />
          </SpinnerWrapper>
        )}
      </VideoWrapper>
      {(error || decodeError) && <Error>{error || decodeError}</Error>}
    </Box>
  );
};
