import React, { useState } from 'react';
import { Button, Dropdown } from 'v2/components';
import { IDeFiStepComponentProps } from '../types';
import { ZAPS_CONFIG, IZapConfig } from '../config';
import ZapOption, { ZapSummary } from './ZapOption';

interface Props extends IDeFiStepComponentProps {
  handleZapSelection(zapSelected: IZapConfig): void;
}

const ZapSelection = ({ onComplete, handleZapSelection }: Props) => {
  const [zapSelected, setZapSelected] = useState(undefined as undefined | IZapConfig);

  const handleSubmit = () => {
    if (!zapSelected) return;
    handleZapSelection(zapSelected);
    onComplete();
  };

  const zapList = ZAPS_CONFIG;
  return (
    <>
      mehhh
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
    </>
  );
};

export default ZapSelection;
