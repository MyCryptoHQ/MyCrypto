import React from 'react';
import styled from 'styled-components';

import { Dropdown } from '@components';

import ContractDropdownOption from '../ContractDropdownOption';
import ContractDropdownValue from '../ContractDropdownValue';
import FieldLabel from './FieldLabel';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const DropdownWrapper = styled.div`
  margin-top: 8px;
  margin-bottom: 15px;
`;

interface Props {
  fieldName: string;
  fieldType: string;
  fieldDisplayName: string;
  value: any;
  handleInputChange(name: string, option: any): void;
}

export default function BooleanSelector(props: Props) {
  const { fieldName, fieldType, fieldDisplayName, value, handleInputChange } = props;
  return (
    <Wrapper>
      <FieldLabel fieldName={fieldDisplayName} fieldType={fieldType} />
      <DropdownWrapper>
        <Dropdown
          value={value}
          options={[
            { label: 'true', name: 'true', value: true },
            { label: 'false', name: 'false', value: false }
          ]}
          onChange={(option) => handleInputChange(fieldName, option.value)}
          optionComponent={ContractDropdownOption}
          valueComponent={ContractDropdownValue}
          searchable={true}
        />
      </DropdownWrapper>
    </Wrapper>
  );
}
