import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { sortBy } from 'lodash';

import { InputField, Dropdown, Button } from 'v2/components';

import FunctionDropdownOption from './FunctionDropdownOption';
import FunctionDropdownValue from './FunctionDropdownValue';
import { ABIItem, ABIItemType, ABIField } from '../types';
import { isReadOperation } from '../helpers';

const Wrapper = styled.div`
  margin-top: 16px;
`;

interface FieldWraperProps {
  isOutput?: boolean;
}

const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const FieldWrapper = styled.div<FieldWraperProps>`
  display: flex;
  flex-direction: column;
  padding-left: ${props => (props.isOutput ? '30px' : 0)};

  flex: 1;
  p {
    font-size: 16px;
  }
`;

const Label = styled.p`
  line-height: 1;
  margin-bottom: 9px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: left;
  margin-top: 9px;
`;

interface Props {
  abi: ABIItem[];
}

export default function GeneratedInteractionForm({ abi }: Props) {
  const getFunctionsFromABI = (pAbi: ABIItem[]) => {
    return sortBy(pAbi.filter(x => x.type === ABIItemType.FUNCTION), item => {
      return item.name.toLowerCase();
    });
  };

  const [functions, setFunctions] = useState(getFunctionsFromABI(abi));
  const [currentFunction, setCurrentFunction] = useState<ABIItem | undefined>(undefined);

  useEffect(() => {
    setFunctions(getFunctionsFromABI(abi));
    setCurrentFunction(undefined);
  }, [abi]);

  const handleFunctionSelected = (selectedFunction: ABIItem) => {
    setCurrentFunction(selectedFunction);
  };

  const handleInputChange = (fieldName: string, value: string) => {
    const updatedFunction = Object.assign({}, currentFunction);
    const indexToChange = updatedFunction.inputs.findIndex(x => x.name === fieldName);
    updatedFunction.inputs[indexToChange].value = value;
    setCurrentFunction(updatedFunction);
  };

  let isRead;
  let inputs: ABIField[] = [];
  let outputs: ABIField[] = [];

  if (currentFunction !== undefined) {
    isRead = isReadOperation(currentFunction);
    inputs = currentFunction.inputs;
    outputs = currentFunction.outputs;
  }

  return (
    <Wrapper>
      <hr />
      <DropdownWrapper>
        <Label>Read / Write Contract</Label>
        <Dropdown
          value={currentFunction}
          options={functions}
          onChange={handleFunctionSelected}
          optionComponent={FunctionDropdownOption}
          valueComponent={FunctionDropdownValue}
          searchable={true}
        />
      </DropdownWrapper>

      {currentFunction && (
        <>
          {inputs.length > 0 && (
            <div>
              {inputs.map((field, index) => {
                return (
                  <FieldWrapper key={`${field.name}${index}`}>
                    <InputField
                      label={`${field.name || 'Input'} (${field.type})`}
                      value={field.value}
                      onChange={({ target: { value } }) => handleInputChange(field.name, value)}
                    />
                  </FieldWrapper>
                );
              })}
            </div>
          )}

          {isRead && (
            <div>
              {outputs.map((field, index) => {
                return (
                  <FieldWrapper isOutput={true} key={`${field.name}${index}`}>
                    <InputField
                      label={`↳ ${field.name || 'Output'} (${field.type})`}
                      value={field.value}
                    />
                  </FieldWrapper>
                );
              })}
            </div>
          )}
          <ButtonWrapper>
            {isRead && inputs.length > 0 && <Button>Read</Button>}
            {!isRead && <Button>Write</Button>}
          </ButtonWrapper>
        </>
      )}
    </Wrapper>
  );
}
