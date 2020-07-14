import React from 'react';
import styled from 'styled-components';
import { OptionProps } from 'react-select';

import { Contract } from '@types';
import { Selector } from '@components';

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

const ContractDropdownItem = ({
  option,
  onSelect
}: {
  option: Contract;
  onSelect?(option: Contract): void;
}) => (
  <div style={{ padding: '12px 15px' }} onClick={() => onSelect && onSelect(option)}>
    {option.name}
  </div>
);

const ContractDropdownOption = ({ data, selectOption }: OptionProps<Contract>) => (
  <ContractDropdownItem option={data} onSelect={selectOption} />
);

const ContractDropdownValue = ({ value }: { value: Contract }) => (
  <ContractDropdownItem option={value} />
);

export default function BooleanSelector(props: Props) {
  const { fieldName, fieldType, fieldDisplayName, value, handleInputChange } = props;
  return (
    <Wrapper>
      <FieldLabel fieldName={fieldDisplayName} fieldType={fieldType} />
      <DropdownWrapper>
        <Selector
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
