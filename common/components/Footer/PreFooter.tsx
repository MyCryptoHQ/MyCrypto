import React from 'react';

import translate, { translateRaw } from 'translations';
import './PreFooter.scss';

interface Props {
  openModal(): void;
}

const PreFooter: React.SFC<Props> = ({ openModal }) => {
  return (
    <section className="pre-footer">
      <div className="container">
        <p>
          {translate('PREFOOTER_WARNING')}{' '}
          <a onClick={openModal}>{translateRaw('PREFOOTER_SECURITY_WARNING')}</a>
        </p>
      </div>
    </section>
  );
};

export default PreFooter;
