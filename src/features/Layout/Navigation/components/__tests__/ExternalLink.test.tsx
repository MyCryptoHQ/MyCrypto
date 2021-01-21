import React from 'react';

import { fireEvent, screen, simpleRender } from 'test-utils';

import { IExternalLink, TURL } from '@types';

import { ExternalLink } from '../ExternalLink';

const defaultProps = {
  item: {
    type: 'external',
    title: 'Test',
    link: 'https://example.com' as TURL,
    icon: 'nav-home'
  } as IExternalLink,
  actual: false
};

function getComponent() {
  return simpleRender(<ExternalLink {...defaultProps} />);
}

describe('ExternalLink', () => {
  const { open } = window;

  beforeEach(() => {
    window.open = jest.fn();
  });

  afterEach(() => {
    window.open = open;
  });

  test('renders an external link', async () => {
    getComponent();
    expect(screen.getByText(new RegExp(defaultProps.item.title, 'i'))).toBeInTheDocument();
  });
  test('component opens an external link', async () => {
    getComponent();
    const button = screen.getByText(new RegExp(defaultProps.item.title, 'i')).parentElement!;
    fireEvent.click(button);
    expect(window.open).toHaveBeenCalledWith(defaultProps.item.link, '_blank', 'noreferrer');
  });
});
