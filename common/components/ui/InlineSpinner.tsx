import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Spinner } from 'components/ui';
import './InlineSpinner.scss';

interface Props {
  active: boolean;
  text?: string;
}

export const InlineSpinner: React.SFC<Props> = ({ active, text }) => (
  <CSSTransition in={active} timeout={300} classNames="InlineSpinner--fade">
    {/* TODO: when react-transition-group v2.3 releases, use '-done' classes instead of conditional 'active' class https://github.com/reactjs/react-transition-group/issues/274 */}
    <div className="InlineSpinner small">
      {text}
      <Spinner />
    </div>
  </CSSTransition>
);
