import styled from 'styled-components';

import { Typography } from '@components';
import { COLORS } from '@theme';

const { GREY } = COLORS;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 1em;
`;

const LabelWraper = styled(Typography)`
  margin-left: 6px;
  opacity: 0.9;
  color: ${GREY};
`;

interface Props {
  fieldName: string;
  fieldType?: string;
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
      {fieldType && <LabelWraper>{fieldType}</LabelWraper>}
    </Wrapper>
  );
}
