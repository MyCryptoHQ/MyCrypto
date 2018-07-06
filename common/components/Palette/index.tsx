import React from 'react';
import TabSection from 'containers/TabSection/index';
import './index.scss';

const COLORS = [
  ['gray-base', 'gray-darker', 'gray-dark', 'gray', 'gray-light', 'gray-lighter', 'gray-lightest'],
  [
    'brand-primary-darker',
    'brand-primary-dark',
    'brand-primary',
    'brand-primary-light',
    'brand-primary-lighter'
  ],
  ['brand-info-darker', 'brand-info-dark', 'brand-info', 'brand-info-light', 'brand-info-lighter'],
  [
    'brand-success-darker',
    'brand-success-dark',
    'brand-success',
    'brand-success-light',
    'brand-success-lighter'
  ],
  [
    'brand-warning-darker',
    'brand-warning-dark',
    'brand-warning',
    'brand-warning-light',
    'brand-warning-lighter'
  ],
  [
    'brand-danger-darker',
    'brand-danger-dark',
    'brand-danger',
    'brand-danger-light',
    'brand-danger-lighter'
  ],
  ['text-color', 'text-inverted-color', 'link-color', 'link-hover-color'],
  ['control-bg', 'control-color', 'control-border']
];

const Palette: React.SFC = () => (
  <TabSection>
    <section className="Tab-content">
      <div className="Tab-content-pane Palette">
        {COLORS.map(colors => (
          <div className="Palette-group" key={colors[0]}>
            {colors.map(c => (
              <div className="Palette-group-color" key={c}>
                <div className={`Palette-group-color-blob color--${c}`} />
                <div className="Palette-group-color-name">{c}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  </TabSection>
);

export default Palette;
