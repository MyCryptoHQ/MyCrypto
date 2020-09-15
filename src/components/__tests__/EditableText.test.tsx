import React from 'react';

import { fireEvent, simpleRender } from 'test-utils';

import EditableText, { Props } from '../EditableText';

const defaultProps: Props = {
  value: 'Editable',
  className: '',
  bold: false,
  truncate: false,
  saveValue: jest.fn()
};

function getComponent(props: Props) {
  return simpleRender(<EditableText {...props} />);
}

describe('EditableText', () => {
  test('it enters edit mode when clicked and can be cancelled with escape', async () => {
    const { getByText, container } = getComponent(defaultProps);
    const text = getByText('Editable');
    fireEvent.click(text);
    const input = container.querySelector('input') as HTMLElement;
    expect(input).toBeDefined();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(getByText('Editable')).toBeDefined();
  });

  test('it enters edit mode when clicked and input can be saved with enter', async () => {
    const { getByText, container } = getComponent(defaultProps);
    const text = getByText('Editable');
    fireEvent.click(text);
    const input = container.querySelector('input') as HTMLElement;
    expect(input).toBeDefined();
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(defaultProps.saveValue).toHaveBeenCalledWith('test');
    expect(getByText('Editable')).toBeDefined();
  });

  test('it enters edit mode when clicked and exits when focus lost', async () => {
    const { getByText, container } = getComponent(defaultProps);
    const text = getByText('Editable');
    fireEvent.click(text);
    const input = container.querySelector('input') as HTMLElement;
    expect(input).toBeDefined();
    fireEvent.blur(input);
    expect(getByText('Editable')).toBeDefined();
  });
});
