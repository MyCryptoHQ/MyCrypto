import React from 'react';
import { Spinner, NewTabLink } from 'components/ui';
import { Link } from 'react-router-dom';
import './PrimaryButton.scss';

interface DefaultProps {
  className?: string;
  disabled?: boolean;
  text?: string;
}

interface InternalLinkProps extends DefaultProps {
  to: string;
}

interface ExternalLinkProps extends DefaultProps {
  href: string;
}

interface ButtonProps extends DefaultProps {
  loading?: boolean;
  loadingTxt?: string;
  onClick(): void;
}

type Props = ButtonProps | InternalLinkProps | ExternalLinkProps;

const PrimaryButton = (props: Props): JSX.Element => {
  const { text, disabled, className } = props;
  const { loading, loadingTxt, onClick } = props as ButtonProps;
  const { to } = props as InternalLinkProps;
  const { href } = props as ExternalLinkProps;
  return !onClick ? (
    to ? (
      <Link to={href} className={`PrimaryButton ${className}`}>
        {text}
      </Link>
    ) : (
      <NewTabLink href={href} className={`PrimaryButton ${className}`}>
        {text}
      </NewTabLink>
    )
  ) : (
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
};

export default PrimaryButton;
