import { fireEvent, simpleRender } from 'test-utils';

import { translateRaw } from '@translations';

import SignAndVerifyMessage from './SignAndVerifyMessage';

function getComponent(pathname: string) {
  return simpleRender(<SignAndVerifyMessage />, { initialRoute: pathname });
}

describe('SignAndVerifyMessage', () => {
  it('renders', async () => {
    const { getAllByText } = getComponent('/sign-message');
    getAllByText(translateRaw('SIGN_MESSAGE'), { exact: false }).forEach((s) =>
      expect(s).toBeInTheDocument()
    );
  });

  it('verify message', async () => {
    const { getAllByText, container, getByTestId } = getComponent('/verify-message');
    getAllByText(translateRaw('VERIFY_MESSAGE'), { exact: false }).forEach((s) =>
      expect(s).toBeInTheDocument()
    );

    fireEvent.change(container.querySelector('textarea')!, {
      target: {
        value: `{
      "address": "0xf0BC3CCEd3784f5d880B847afB5a631485aA629d",
      "msg": "Hello World!",
      "sig": "0x0f9142e8795e02c831e089caef6f6fcac55031cff0f0ff113f5347009385eb9521e076a40dfba3c301777c17f69e781f61a107a3eaff378d669ce619337327c11b",
      "version": "2"
    }`
      }
    });

    fireEvent.click(container.querySelector('button')!);

    expect(getByTestId('sign-result')).toBeInTheDocument();
  });
});
