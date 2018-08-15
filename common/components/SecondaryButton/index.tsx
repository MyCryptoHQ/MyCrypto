import React from 'react';
import { Spinner } from 'components/ui';
import './SecondaryButton.scss';

interface Props {
  className?: string;
  disabled?: boolean;
  text?: string;
  loading?: boolean;
  children?: any;
  onClick(): void;
}

export default class SecondaryButton extends React.Component<Props> {
  public render() {
    const { text, disabled, className, loading, onClick, children } = this.props;
    return (
      <button className={className + ' SecondaryButton'} disabled={disabled} onClick={onClick}>
        {loading ? <Spinner light={true} /> : text}
        {/* use 'children' prop for inline icons */}
        {children}
      </button>
    );
  }
}
