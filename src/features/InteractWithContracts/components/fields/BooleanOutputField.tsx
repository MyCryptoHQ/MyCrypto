import styled from 'styled-components';

import checkmark from '@assets/images/checkmark_outline.svg';
import cross from '@assets/images/cross_outline.svg';
import { Typography } from '@components';

import FieldLabel from './FieldLabel';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 65px;
`;

const LabelWrapper = styled(Typography)`
  margin-left: 4px;
  opacity: 0.9;
`;

interface IconProps {
  isTrue: boolean;
}

const Icon = styled.img<IconProps>`
  filter: ${(props) =>
    props.isTrue
      ? 'invert(0.5) sepia(1) saturate(4) hue-rotate(70deg)'
      : 'invert(0.5) sepia(1) saturate(3) hue-rotate(315deg)'};
`;

interface Props {
  fieldName: string;
  fieldType: string;
  fieldValue: string | boolean;
}

export default function BooleanOutputField(props: Props) {
  const { fieldName, fieldType, fieldValue } = props;

  const isTrue = fieldValue === 'true' || fieldValue === true;
  return (
    <>
      <FieldLabel fieldName={fieldName} fieldType={fieldType} isOutput={true} />
      <Wrapper>
        <Icon src={isTrue ? checkmark : cross} isTrue={isTrue} />
        <LabelWrapper>{isTrue ? 'TRUE' : 'FALSE'}</LabelWrapper>
      </Wrapper>
    </>
  );
}
