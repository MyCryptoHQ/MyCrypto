import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Spinner } from 'components/ui';
import './InlineSpinner.scss';

export const InlineSpinner: React.SFC<{
  active: boolean;
  text?: string;
}> = ({ active, text }) => (
  <CSSTransition in={active} timeout={300} classNames="inline-spinner--fade">
    {/* TODO: when react-transition-group v2.3 releases, use '-done' classes instead of conditional 'active' class https://github.com/reactjs/react-transition-group/issues/274 */}
    <div className={`Calculating-limit small ${active ? 'active' : ''}`}>
      {text}
      <Spinner />
    </div>
  </CSSTransition>
);
