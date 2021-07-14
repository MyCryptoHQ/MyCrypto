import { ComponentProps } from 'react';

import { screen, simpleRender } from 'test-utils';

import { DashboardPanel } from './DashboardPanel';

const getComponent = (props: ComponentProps<typeof DashboardPanel>) =>
  simpleRender(<DashboardPanel {...props} />);

describe('DashboardPanel', () => {
  it('renders children', () => {
    const props = { children: 'DashboardPanel' };
    getComponent(props);
    expect(screen.getByText(`${props.children}`)).toBeInTheDocument();
  });
  it('renders heading', () => {
    const props = { children: 'DashboardPanel', heading: 'Panel Title' };
    getComponent(props);
    expect(screen.getByText(`${props.heading}`)).toBeInTheDocument();
  });
  it('renders heading & headingRight', () => {
    const props = {
      children: 'DashboardPanel',
      heading: 'Panel Title',
      headingRight: 'Right Title'
    };
    getComponent(props);
    expect(screen.getByText(`${props.headingRight}`)).toBeInTheDocument();
  });
});
