import React, { useState, useEffect } from 'react';
import InputField from './InputField';
import Typography from './Typography';
import styled from 'styled-components';

import checkmark from 'assets/images/checkmark_outline.svg';
import editIcon from 'common/assets/images/icn-edit.svg';

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

const EditIcon = styled.img`
  margin-left: 3px;
`;

interface Props {
  value: string;
  className?: string;
  bold?: boolean;
  saveValue(value: string): void;
}

export default function EditableText({ saveValue, value, className, bold }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  return (
    <Wrapper className={className}>
      {editMode ? (
        <InputField
          value={editValue}
          onChange={e => setEditValue(e.currentTarget.value)}
          height={'2rem'}
          marginBottom={'0'}
          customIcon={() => (
            <img
              src={checkmark}
              onClick={() => {
                saveValue(editValue);
                setEditMode(false);
              }}
            />
          )}
        />
      ) : (
        <>
          <Typography bold={bold}>{value}</Typography>
          <EditIcon
            onClick={() => {
              setEditMode(true);
            }}
            src={editIcon}
          />
        </>
      )}
    </Wrapper>
  );
}
