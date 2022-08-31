import styled from 'styled-components';

import { Selector } from '@components';
import { SPACING } from '@theme';

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
  paddingLeft = '0',
  onSelect
}: {
  option: { name: string };
  paddingLeft?: string;
  onSelect?(option: { name: string }): void;
}) => (
  <div
    style={{ padding: `12px 15px 12px ${paddingLeft}` }}
    onClick={() => onSelect && onSelect(option)}
  >
    {option.name}
  </div>
);

export default function BooleanSelector(props: Props) {
  const { fieldName, fieldType, fieldDisplayName, value, handleInputChange } = props;
  const options = [
    { label: 'true', name: 'true', value: true },
    { label: 'false', name: 'false', value: false }
  ];
  return (
    <Wrapper>
      <FieldLabel fieldName={fieldDisplayName} fieldType={fieldType} />
      <DropdownWrapper>
        <Selector
          value={options.find((o) => o.value === value)}
          options={options}
          onChange={(option) => handleInputChange(fieldName, option.value)}
          optionComponent={({ data, selectOption }) => (
            <ContractDropdownItem option={data} onSelect={selectOption} paddingLeft={SPACING.SM} />
          )}
          valueComponent={({ value }) => <ContractDropdownItem option={value} />}
          searchable={true}
        />
      </DropdownWrapper>
    </Wrapper>
  );
}
