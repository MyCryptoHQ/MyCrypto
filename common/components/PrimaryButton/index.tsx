import React from 'react';
import { Spinner } from 'components/ui';
import './PrimaryButton.scss';

interface Props {
  className?: string;
  disabled?: boolean;
  text?: string;
  loading?: boolean;
  loadingTxt?: string;
  onClick(): void;
}

export default class PrimaryButton extends React.Component<Props> {
  public render() {
    const { text, disabled, className, loading, loadingTxt, onClick } = this.props;
    return (
      <button
        className={`PrimaryButton ${loading ? 'loading' : ''} ${className}`}
        disabled={disabled}
        onClick={onClick}
      >
        {loading ? (
          <div className="PrimaryButton-spinner-wrapper">
            <Spinner light={true} />
            <span>{loadingTxt}</span>
          </div>
        ) : (
          text
        )}
      </button>
    );
  }
}
