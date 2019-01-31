import React from 'react';
import { Button, Heading } from '@mycrypto/ui';

import { DrawerAction } from './components';
import './Drawer.scss';

// Legacy
import closeIcon from 'common/assets/images/icn-close.svg';

interface Action {
  icon: string;
  title: string;
  onClick(): void;
}

interface Props {
  style: any;
  title?: string;
  content?: any;
  actions?: Action[];
  onClose(): void;
}

export default function Drawer({ style, title, content, actions, onClose }: Props) {
  return (
    <section className="Drawer" style={style}>
      <header className="Drawer-top">
        <Heading as="h2" className="Drawer-top-heading">
          {title}
        </Heading>
        <div className="Drawer-top-controls">
          <Button basic={true} onClick={onClose}>
            <img src={closeIcon} alt="Close" />
          </Button>
        </div>
      </header>
      <div className="Drawer-content">
        <div className="Drawer-content-inside">{content}</div>
        <div className="Drawer-content-actions">
          {actions && actions.map(action => <DrawerAction key={action.title} {...action} />)}
        </div>
      </div>
    </section>
  );
}
