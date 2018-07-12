import React from 'react';
import { Spinner } from 'components/ui';
import './SecondaryButton.scss';

interface Props {
  className?: string;
  disabled?: boolean;
  text?: string;
  loading?: boolean;
  onClick(): void;
}

export default class SecondaryButton extends React.Component<Props> {
  public render() {
    const { text, disabled, className, loading, onClick } = this.props;
    return (
      <button className={className + ' SecondaryButton'} disabled={disabled} onClick={onClick}>
        {loading ? <Spinner light={true} /> : text}
      </button>
    );
  }
}
