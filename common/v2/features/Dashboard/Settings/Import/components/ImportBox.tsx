import React from 'react';
import styled from 'styled-components';
import { Textarea } from '@mycrypto/ui';
import translate from 'translations';

const FilePicker = styled.label`
  background: none;
  color: #1eb8e7;
  cursor: pointer;
`;
const FilePickerInput = styled.input`
  display: none !important;
`;

const ImportBoxContainer = styled.div`
  color: #9b9b9b;
  background: #e8eaed;
  padding: 6rem;
  border-radius: 0.375em;
`;

function isValidFile(rawFile: File): boolean {
  const fileType = rawFile.type;
  return fileType === '' || fileType === 'application/json';
}

interface ImportProps {
  importCache(importedCache: any): void;
  onNext(): void;
}

export default class ImportBox extends React.Component<ImportProps> {
  public submit = () => {
    this.props.onNext();
  };

  public render() {
    return (
      <ImportBoxContainer>
        <FilePicker htmlFor="upload">
          {translate('SETTINGS_IMPORT_BUTTON')}
          <FilePickerInput id="upload" type="file" onChange={this.handleFileSelection} />
        </FilePicker>{' '}
        {translate('SETTINGS_IMPORT_PASTE')}
        <Textarea />
        <br />
        <button onClick={this.submit}>{translate('SETTINGS_IMPORT_CONFIRM')}</button>
      </ImportBoxContainer>
    );
  }

  private handleFileSelection = (e: any) => {
    console.log('handling file selection');
    const fileReader = new FileReader();
    const target = e.target;
    const inputFile = target.files[0];

    fileReader.onload = () => {
      if (fileReader.result) {
        this.props.importCache(fileReader.result);
      }
    };
    if (isValidFile(inputFile)) {
      fileReader.readAsText(inputFile, 'utf-8');
    }
  };
}
