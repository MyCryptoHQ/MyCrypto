import { simpleRender } from 'test-utils';

import { fSignedTx } from '@fixtures';
import { translateRaw } from '@translations';

import { Scanner } from './Scanner';
import { useScanner } from './useScanner';

jest.mock('./useScanner', () => ({
  useScanner: jest.fn().mockReturnValue({
    isLoading: true,
    error: ''
  })
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Scanner', () => {
  it('shows a spinner', async () => {
    const { getByTestId } = simpleRender(<Scanner onScan={jest.fn()} />);
    expect(getByTestId('spinner')).toBeInTheDocument();
  });

  it('decodes the QR data', () => {
    const onScan = jest.fn();
    const { getByText } = simpleRender(<Scanner onScan={onScan} />);

    const mock = useScanner as jest.MockedFunction<typeof useScanner>;
    const handleDecode = mock.mock.calls[0][1];

    handleDecode({ data: 'foo' });
    expect(getByText(translateRaw('INVALID_SIGNED_TRANSACTION_QR'))).toBeInTheDocument();

    handleDecode({ data: fSignedTx });
    expect(onScan).toHaveBeenCalledWith(fSignedTx);
  });
});
