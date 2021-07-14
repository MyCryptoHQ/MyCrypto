import { ComponentProps } from 'react';

import { screen, simpleRender } from 'test-utils';

import { default as LinkApp } from './LinkApp';

type Props = ComponentProps<typeof LinkApp>;
function getComponent(props: Props) {
  return simpleRender(<LinkApp {...props} />);
}

describe('LinkApp', () => {
  it('displays link text passed as children', () => {
    const props = {
      href: '/demo',
      children: 'foo bar'
    } as Props;
    getComponent(props);
    expect(screen.getByText(`${props.children}`)).toBeInTheDocument();
  });

  it('renders anchor tag when provided an href attribute', () => {
    const props = {
      href: 'https://help.example.com',
      isExternal: true,
      children: 'Get help'
    } as Props;
    getComponent(props);
    expect(screen.getByText(`${props.children}`).closest('a')).toHaveAttribute('href', props.href);
  });

  it('renders anchor tag that can open in new tab', () => {
    const props = {
      href: 'https://help.example.com',
      isExternal: true,
      children: 'Get help'
    } as Props;
    getComponent(props);
    expect(screen.getByText(`${props.children}`).closest('a')).toHaveAttribute('target', '_blank');
  });

  it('target can be overriden', () => {
    const props = {
      href: 'https://help.example.com',
      isExternal: true,
      target: 'self',
      children: 'Get help'
    } as Props;
    getComponent(props);
    expect(screen.getByText(`${props.children}`).closest('a')).toHaveAttribute('target', 'self');
  });

  // @PRIVACY - Ensure we don't leak user info when linking.
  // @SECURITY - Avoid phishing vector with `window.opener.location
  // https://security.stackexchange.com/a/241570
  it('sets noreferrer attribute on tag', () => {
    const props = {
      href: 'https://help.example.com',
      isExternal: true,
      children: 'Get help'
    } as Props;
    getComponent(props);
    expect(screen.getByText(`${props.children}`).closest('a')).toHaveAttribute('rel', 'noreferrer');
  });

  it('the rel may not be overridden', () => {
    const props = {
      href: 'https://help.example.com',
      isExternal: true,
      children: 'Get help',
      rel: 'show me the money'
    } as Props;
    getComponent(props);
    expect(screen.getByText(`${props.children}`).closest('a')).toHaveAttribute('rel', 'noreferrer');
  });

  it('renders a react-router-dom link when provided a to attribute', () => {
    const props = {
      href: '/settings',
      children: 'Settings'
    } as Props;
    getComponent(props);
    expect(screen.getByText(`${props.children}`)).toBeInTheDocument();
    expect(screen.getByText(`${props.children}`).closest('a')).toHaveAttribute('href', props.href);
  });
});
