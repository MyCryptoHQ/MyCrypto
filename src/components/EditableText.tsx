import React, { useState, useEffect } from 'react';
import { Typography } from '@components';
import styled from 'styled-components';

import editIcon from '@assets/images/icn-edit.svg';
import { COLORS, SPACING } from '@theme';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

const EditIcon = styled.img`
  display: inline-flex;
  align-self: flex-start;
  cursor: pointer;
  margin: ${SPACING.XS} ${SPACING.SM};
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

const STypography = styled(Typography)`
  border-color: transparent;
  line-height: 1.4;
  &:hover {
    border-bottom: 1px ${COLORS.BLUE_GREY} dashed;
    cursor: pointer;
  }
`;

export interface Props {
  value: string;
  className?: string;
  bold?: boolean;
  truncate?: boolean;
  saveValue(value: string): void;
}

function EditableText({ saveValue, value, className, bold, truncate }: Props) {
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
    saveValue(editValue);
    setEditMode(false);
  };

  return (
    <Wrapper className={className}>
      {editMode ? (
        <SInputField
          autoFocus={true}
          value={editValue}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          onChange={(e) => setEditValue(e.currentTarget.value)}
          onBlur={save}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <>
          <STypography bold={bold} truncate={truncate} inheritFontWeight={true} onClick={edit}>
            {value}
          </STypography>
          <EditIcon onClick={edit} src={editIcon} />
        </>
      )}
    </Wrapper>
  );
}

export default EditableText;
