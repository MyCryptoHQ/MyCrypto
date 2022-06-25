import { FunctionComponent, useState } from 'react';

import { parse as parseTransaction } from '@ethersproject/transactions';
import { toBuffer } from 'ethereumjs-util';
import { OnResultFunction, QrReader } from 'react-qr-reader';
import styled from 'styled-components';

import { Box } from '@components';
import { verifyTransaction } from '@helpers';
import { COLORS } from '@theme';
import { translateRaw } from '@translations';

const Error = styled.span`
  min-height: 22px;
  color: ${COLORS.ERROR_RED};
`;

interface ScannerProps {
  onScan(signedTransaction: string): void;
}

export const Scanner: FunctionComponent<ScannerProps> = ({ onScan }) => {
  const [error, setError] = useState('');

  const handleDecode: OnResultFunction = (data) => {
    setError('');

    if (data) {
      try {
        const text = data.getText();
        const buffer = toBuffer(text);
        const transaction = parseTransaction(buffer);

        if (verifyTransaction(transaction)) {
          onScan(text!);
        }
      } catch (error) {
        setError(translateRaw('INVALID_SIGNED_TRANSACTION_QR'));
      }
    }
  };

  return (
    <Box
      pb="15px"
      width="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      data-testid="scanner"
    >
      <QrReader
        constraints={{ facingMode: 'environment', aspectRatio: { ideal: 1 } }}
        onResult={handleDecode}
        containerStyle={{ width: '100%' }}
      />
      {error && <Error>{error}</Error>}
    </Box>
  );
};
