import selectEvent from 'react-select-event';
import { screen, simpleRender } from 'test-utils';

import Selector from '../Selector';

const defaultProps: any = {
  options: ['John', 'Alice', 'Bob'],
  label: 'test-selector',
  optionComponent: ({ data }: { data: typeof defaultProps.options[0] }) => <div>{data}</div>,
  onSelect: jest.fn()
};

function getComponent(props: any) {
  return simpleRender(
    <form role="form">
      <label htmlFor={defaultProps.label}>{defaultProps.label}</label>
      <Selector inputId={defaultProps.label} {...props} />
    </form>
  );
}

describe('Selector', () => {
  test('it displays the provided options', async () => {
    getComponent(defaultProps);
    await selectEvent.openMenu(screen.getByLabelText(defaultProps.label));
    expect(screen.getByText(defaultProps.options[0])).toBeDefined();
  });

  test('it hides the optionDivider by default', async () => {
    getComponent(defaultProps);
    await selectEvent.openMenu(screen.getByLabelText(defaultProps.label));
    const optionWrapper = screen.getByText(defaultProps.options[0]).parentElement as Element;
    const style = window.getComputedStyle(optionWrapper);
    expect(style.borderBottom).toBe('');
  });

  test('it can include an optionDivider', async () => {
    getComponent({ ...defaultProps, optionDivider: true });
    await selectEvent.openMenu(screen.getByLabelText(defaultProps.label));
    const optionWrapper = screen.getByText(defaultProps.options[0]).parentElement as Element;
    const style = window.getComputedStyle(optionWrapper);
    expect(style.borderBottom).toBe('1px solid #e5ecf3');

    // it hides the divider for the last element in the list
    const lastOptionWrapper = screen.getByText(
      defaultProps.options[defaultProps.options.length - 1]
    ).parentElement as Element;
    const lastOptionStyle = window.getComputedStyle(lastOptionWrapper);
    expect(lastOptionStyle.borderBottom).toBe('');
  });
});
