import React from 'react';
import './PreFooter.scss';
import translate from 'translations';

interface Props {
  openModal(): void;
}

const PreFooter: React.SFC<Props> = ({ openModal }) => {
  return (
    <section className="pre-footer">
      <div className="container">
        <p>
          {translate('PREFOOTER_WARNING')}{' '}
          <a onClick={openModal}>{translate('PREFOOTER_SECURITY_WARNING')}</a>
        </p>
      </div>
    </section>
  );
};

export default PreFooter;
