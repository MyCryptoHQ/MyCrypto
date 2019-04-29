import React, { Component } from 'react';
import { Transition } from 'react-spring/renderprops';

import { Overlay } from 'v2/components';
import { Drawer } from 'v2/features';

export interface Action {
  icon: string;
  title: string;
  onClick(): void;
}

export interface Screen {
  title?: string;
  content?: any;
  actions?: Action[];
}

interface State {
  visible: boolean;
  screen: Screen | null;
  toggleVisible(): void;
  setScreen(screen: Screen): void;
}

export const DrawerContext = React.createContext({} as State);

export default class DrawerProvider extends Component {
  public state: State = {
    visible: false,
    screen: {},
    toggleVisible: () =>
      this.setState((prevState: State) => ({
        visible: !prevState.visible
      })),
    setScreen: (screen: Screen) => this.setState({ visible: true, screen })
  };

  public render() {
    const { children } = this.props;
    const { visible, screen, toggleVisible } = this.state;

    return (
      <DrawerContext.Provider value={this.state}>
        {children}
        {visible && <Overlay onClick={toggleVisible} />}
        <Transition
          items={visible}
          from={{ right: '-350px' }}
          enter={{ right: '0' }}
          leave={{ right: '-500px' }}
        >
          {show =>
            show && ((style: any) => <Drawer {...screen} onClose={toggleVisible} style={style} />)
          }
        </Transition>
      </DrawerContext.Provider>
    );
  }
}
