import React from 'react';
import styled from 'styled-components';
import { COLORS } from 'v2/theme';
import { InputField } from 'v2/components';

const { BRIGHT_SKY_BLUE } = COLORS;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Label = styled.div`
  font-size: 18px;
  width: 100%;
  line-height: 1;
  text-align: left;
  font-weight: normal;
  margin-bottom: 9px;
  color: ${props => props.theme.text};
`;

const InputSwitch = styled(Label)`
  display: flex;
  flex-direction: row-reverse;
  align-self: flex-end;
  font-size: 13px;
  text-align: right;
  color: ${BRIGHT_SKY_BLUE};
  cursor: pointer;
`;

interface Props {
  label: string;
  address: string;
  addressManuallySelected: boolean;
  setAddressManuallySelected(isManual: boolean): void;
  onAddressChanged(address: string): void;
}

export default function AddressSelector(props: Props) {
  const {
    label,
    address,
    onAddressChanged,
    addressManuallySelected,
    setAddressManuallySelected
  } = props;

  return (
    <Wrapper>
      <LabelWrapper>
        <Label>{label}</Label>
        <InputSwitch onClick={() => setAddressManuallySelected(!addressManuallySelected)}>
          {addressManuallySelected ? 'select from MyCryptoAccounts' : 'manually enter address'}
        </InputSwitch>
      </LabelWrapper>
      {addressManuallySelected ? (
        <InputField
          value={address}
          placeholder="Enter Your Address"
          onChange={({ target: { value } }) => onAddressChanged(value)}
        />
      ) : (
        <div>Addres Selector</div>
      )}
    </Wrapper>
  );
}
