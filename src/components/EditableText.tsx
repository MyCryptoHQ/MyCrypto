import { ComponentProps, MouseEvent, useEffect, useState } from 'react';

import styled from 'styled-components';

import { COLORS, SPACING } from '@theme';
import { isVoid } from '@utils';

import Box from './Box';
import Icon from './Icon';
import { Text } from './NewTypography';

const SInputField = styled.input`
  border-radius: 6px;
  border: 2px solid ${COLORS.GREY_ATHENS};
  font-weight: 400;
  width: auto;
  padding: ${SPACING.XS};
`;

const SText = styled(Text)<ComponentProps<typeof Text>>`
  /* Create space for hover border to avoid screen jump */
  border-bottom: 1px transparent solid;
`;

const SIcon = styled(Icon)`
  margin: ${SPACING.XS};
`;

const SBox = styled(Box)`
  cursor: pointer;
  &:hover {
    ${SText} {
      border-bottom: 1px ${COLORS.BLUE_GREY} dashed;
    }
    ${SIcon} {
      transition: 200ms ease all;
      transform: scale(1.02);
      opacity: 0.7;
    }
  }
`;

export interface Props {
  value: string;
  placeholder?: string;
  truncate?: boolean;
  onChange(value: string): void;
}

function EditableText({
  onChange,
  value,
  truncate,
  placeholder,
  ...props
}: Props & ComponentProps<typeof Box>) {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  const handleKeyDown = ({ key }: { key: string }) => {
    if (key === 'Escape') {
      cancel();
    } else if (key === 'Enter') {
      save();
    }
  };

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const edit = (e: MouseEvent) => {
    e.stopPropagation();
    setEditMode(true);
  };

  const cancel = () => {
    setEditMode(false);
    setEditValue(value);
  };

  const save = () => {
    onChange(editValue);
    setEditMode(false);
  };

  const hasValue = !isVoid(value);

  return (
    <SBox variant="rowAlign" height="100%" {...props}>
      {editMode ? (
        <SInputField
          placeholder={placeholder}
          autoFocus={true}
          value={editValue}
          onClick={(e: MouseEvent) => e.stopPropagation()}
          onChange={(e) => setEditValue(e.currentTarget.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          <SText forwardedAs="span" isDiscrete={!hasValue} onClick={edit}>
            {hasValue ? value : placeholder}
          </SText>
          <SIcon type="edit" onClick={edit} height="0.8rem" color="discrete" />
        </>
      )}
    </SBox>
  );
}

export default EditableText;
