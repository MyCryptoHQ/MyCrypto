import React from 'react';

import { fireEvent, render } from 'test-utils';

import { Switch } from './Switch';

test('Switch', () => {
  const handleClick = jest.fn();
  const { getByLabelText } = render(<Switch onChange={handleClick} labelLeft="On" />);
  const Toggle = getByLabelText('On');
  fireEvent.click(Toggle);
  expect(handleClick).toHaveBeenCalled();
});
