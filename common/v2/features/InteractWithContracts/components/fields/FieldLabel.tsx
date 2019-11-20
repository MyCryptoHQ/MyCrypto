import React from 'react';
import styled from 'styled-components';
import { COLORS } from 'v2/theme';
import { Typography } from 'v2/components';

const { GREY } = COLORS;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
`;

const LabelWraper = styled(Typography)`
  margin-left: 6px;
  opacity: 0.9;
  color: ${GREY};
`;

interface Props {
  fieldName: string;
  fieldType: string;
  isOutput?: boolean;
}

export default function FieldLabel(props: Props) {
  const { fieldName, fieldType, isOutput } = props;
  return (
    <Wrapper>
      <b>
        {isOutput && '↳ '}
        {fieldName}
      </b>
      <LabelWraper>{fieldType}</LabelWraper>
    </Wrapper>
  );
}
