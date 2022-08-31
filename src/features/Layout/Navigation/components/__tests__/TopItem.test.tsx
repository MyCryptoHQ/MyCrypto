import { MemoryRouter } from 'react-router-dom';
import { fireEvent, screen, simpleRender } from 'test-utils';

import { TIcon } from '@components';
import { translateRaw } from '@translations';

import { TopItem } from '../TopItem';

const mockOnClick = jest.fn();

const defaultProps = {
  icon: 'nav-new' as TIcon,
  title: 'NAVIGATION_NEW',
  current: false,
  onClick: mockOnClick,
  color: 'black'
};

function getComponent() {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <TopItem {...defaultProps} />
    </MemoryRouter>
  );
}

describe('TopItem', () => {
  test('renders the TopItem', async () => {
    getComponent();
    expect(screen.getByText(new RegExp(translateRaw(defaultProps.title), 'i'))).toBeInTheDocument();
  });

  test('triggers onClick function', async () => {
    getComponent();
    const button = screen.getByText(new RegExp(translateRaw(defaultProps.title), 'i'))
      .parentElement!;

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalled();
  });
});
