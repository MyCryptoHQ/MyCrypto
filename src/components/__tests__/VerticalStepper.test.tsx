import { fireEvent, simpleRender } from 'test-utils';

import VerticalStepper, { Props } from '../VerticalStepper';

const defaultProps: Props = {
  currentStep: 0,
  steps: [
    {
      title: 'Title1',
      content: 'Content1',
      buttonText: 'Button1',
      onClick: jest.fn()
    },
    {
      title: 'Title2',
      content: 'Content2',
      buttonText: 'Button2',
      onClick: jest.fn()
    }
  ]
};

function getComponent({ currentStep, ...props }: Props) {
  return simpleRender(<VerticalStepper {...props} />);
}

describe('Button', () => {
  test('it renders the titles, buttons and content', async () => {
    const { getByText } = getComponent(defaultProps);
    expect(getByText('Title1')).toBeDefined();
    expect(getByText('Content1')).toBeDefined();
    expect(getByText('Button1')).toBeDefined();

    expect(getByText('Title2')).toBeDefined();
    expect(getByText('Content2')).toBeDefined();
    expect(getByText('Button2')).toBeDefined();
  });

  test('it triggers handler on click', async () => {
    const { container } = getComponent(defaultProps);
    const component = container.querySelector('button');
    fireEvent.click(component!);
    expect(defaultProps.steps[0].onClick).toHaveBeenCalledTimes(1);
  });

  test('it renders error', async () => {
    const { getByText } = getComponent({ ...defaultProps, error: true });
    expect(getByText('An error occurred.', { exact: false })).toBeDefined();
  });
});
