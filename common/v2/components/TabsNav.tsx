import React, { Children, Component, ReactNode } from 'react';

import styled from 'styled-components';
import { Typography } from '@mycrypto/ui';

interface Props {
  children: ReactNode;
}

const TabsContainer = styled.ul`
  display: flex;
  text-align: center;
  margin: 0;
  background-color: #163150;
`;

const Tab = styled.li`
  list-style: none;
  flex: 1;
  padding-top: 1.3125em;
  padding-bottom: 1.5em;
  p {
    margin: 0;
    /* stylelint-disable max-nesting-depth */
    a {
      color: white;
      letter-spacing: 1.1px; /* stylelint-disable-line unit-whitelist */
      padding-bottom: 0.15625em;

      :hover,
      :focus {
        color: white;
        border-bottom: ${props => '.125em solid' + props.theme.primary};
      }
    }
  }
`;

export default class TabsNav extends Component<Props, {}> {
  public render() {
    const { children } = this.props;

    return (
      <TabsContainer {...this.props}>
        {Children.map(children, child => (
          <Tab>
            <Typography>{child}</Typography>
          </Tab>
        ))}
      </TabsContainer>
    );
  }
}
