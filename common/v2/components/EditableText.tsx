import React, { useState, useEffect } from 'react';
import Typography from './Typography';
import styled from 'styled-components';

import editIcon from 'common/assets/images/icn-edit.svg';
import { COLORS } from 'v2/theme';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

const EditIcon = styled.img`
  margin-left: 3px;
`;

const SInputField = styled.input`
  border: 1px solid ${COLORS.ATHENS_GREY};
  border-radius: 6px;
  padding: 6px 6px;
  font-weight: 400;
`;

const STypography = styled(Typography)`
  &:hover {
    cursor: pointer;
    border-bottom: 1px ${COLORS.CLOUDY_BLUE} dashed;
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

  const edit = () => {
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
          onChange={e => setEditValue(e.currentTarget.value)}
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
