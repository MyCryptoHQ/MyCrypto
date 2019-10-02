import React from 'react';
import styled from 'styled-components';
import { InputField } from 'v2/components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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

interface Props {
  label: string;
  address: string;
  onAddressChanged(address: string): void;
}

export default function AddressSelector(props: Props) {
  const { label, address, onAddressChanged } = props;

  return (
    <Wrapper>
      <Label>{label}</Label>
      <InputField
        value={address}
        placeholder="Enter Your Address"
        onChange={({ target: { value } }) => onAddressChanged(value)}
      />
    </Wrapper>
  );
}
