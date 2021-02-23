import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import editIcon from '@assets/images/icn-edit.svg';
import { COLORS, SPACING } from '@theme';
import { isVoid } from '@utils';

import Box from './Box';
import { Text } from './NewTypography';

const EditIcon = styled.img`
  display: inline-flex;
  align-self: flex-start;
  cursor: pointer;
  margin: ${SPACING.XS};
  opacity: 1;
  height: 0.9em;
  &:hover {
    transition: 200ms ease all;
    transform: scale(1.02);
    opacity: 0.7;
  }
`;

const SInputField = styled.input`
  border-radius: 6px;
  border: 2px solid ${COLORS.GREY_ATHENS};
  font-weight: 400;
  width: auto;
  padding: ${SPACING.XS};
`;

const SText = styled(Text)<React.ComponentProps<typeof Text>>`
  /* Create space for hover border to avoid screen jump */
  border-bottom: 1px transparent solid;
  &:hover {
    border-bottom: 1px ${COLORS.BLUE_GREY} dashed;
    cursor: pointer;
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
}: Props & React.ComponentProps<typeof Box>) {
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

  const edit = (e: React.MouseEvent) => {
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
    <Box variant="rowAlign" height="100%" {...props}>
      {editMode ? (
        <SInputField
          placeholder={placeholder}
          autoFocus={true}
          value={editValue}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          onChange={(e) => setEditValue(e.currentTarget.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          <SText
            forwardedAs="span"
            isDiscrete={!hasValue}
            onClick={edit}
            $truncate={truncate}
            $value={value}
          >
            {hasValue ? value : placeholder}
          </SText>
          <EditIcon onClick={edit} src={editIcon} />
        </>
      )}
    </Box>
  );
}

export default EditableText;
