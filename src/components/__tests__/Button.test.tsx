import { fireEvent, simpleRender } from 'test-utils';

import Button, { Props } from '../Button';

const defaultProps: Props = {
  children: 'Default',
  loading: false,
  disabled: false,
  onClick: jest.fn()
};

function getComponent({ children, loading, disabled, onClick }: Props) {
  return simpleRender(
    <Button loading={loading} disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
}

describe('Button', () => {
  test('it renders the text', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText('Default')).toBeDefined();
  });

  test('it displays spinner when loading', async () => {
    const { container } = getComponent({ loading: true, ...defaultProps });
    expect(container.querySelector('svg')).toBeDefined();
  });

  test('it triggers handler on click', async () => {
    const { container } = getComponent(defaultProps);
    const component = container.querySelector('button');
    fireEvent.click(component!);
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
});
