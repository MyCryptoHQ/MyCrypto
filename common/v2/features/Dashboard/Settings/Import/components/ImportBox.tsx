import React from 'react';
import styled from 'styled-components';

const FilePicker = styled.label`
  background: none;
  color: #1eb8e7;
  cursor: pointer;
`;
const FilePickerInput = styled.input`
  display: none;
`;

const ImportBoxContainer = styled.div`
  color: #9b9b9b;
  background: #e8eaed;
  padding: 8em;
  border-radius: 0.375em;
`;

export default function ImportBox(props) {
  return (
    <ImportBoxContainer>
      <FilePicker htmlFor="upload">
        Browse
        <FilePickerInput id="upload" type="file" />
      </FilePicker>{' '}
      or Drop CSV File here<button onClick={props.onNext}>Next</button>
    </ImportBoxContainer>
  );
}
