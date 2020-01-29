import React, { useState } from 'react';
import { Button, Dropdown, ContentPanel } from 'v2/components';
import { IZapConfig, ZAPS_CONFIG } from '../config';
import { withRouter } from 'react-router-dom';
import ZapOption, { ZapSummary } from './ZapOption';
import { ROUTE_PATHS } from 'v2/config';

const DeFiZapEducation = withRouter(({ history }) => {
  const [zapSelected, setZapSelected] = useState(undefined as undefined | IZapConfig);

  const handleSubmit = () => {
    if (!zapSelected) return;
    history.push(`${ROUTE_PATHS.DEFIZAP.path}/${zapSelected.key}`);
  };

  const zapList = Object.values(ZAPS_CONFIG);

  return (
    <ContentPanel heading={'DeFi Zap Education'}>
      This will eventually be the education panel for defizap, and the selection of zap for the rest
      of the flow.
      <div>
        <div>
          Select a Zap:
          <Dropdown
            options={zapList}
            optionComponent={ZapOption}
            placeholder="Select a Zap"
            onChange={option => setZapSelected(option)}
            value={zapSelected && zapSelected.name ? zapSelected : undefined}
            valueComponent={({ value }) => (
              <ZapSummary name={value.name} keyId={value.key} onClick={setZapSelected} />
            )}
          />
        </div>

        <Button onClick={handleSubmit}>Continue on!</Button>
      </div>
    </ContentPanel>
  );
});

export default DeFiZapEducation;
