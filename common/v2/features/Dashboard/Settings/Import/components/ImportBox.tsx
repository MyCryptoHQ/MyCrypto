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
  localCache: string;
  importCache(importedCache: any): void;
  onNext(): void;
}

function isValidCache(oldCache: string, newCache: string) {
  const oldKeys = Object.keys(JSON.parse(oldCache)).sort();
  const newKeys = Object.keys(JSON.parse(newCache)).sort();
  return JSON.stringify(oldKeys) === JSON.stringify(newKeys);
}

export default class ImportBox extends React.Component<ImportProps> {
  public state = { isValid: false, importedCache: '', badImport: false };
  public submit = () => {
    this.props.importCache(this.state.importedCache);
    this.props.onNext();
  };

  public render() {
    const { isValid, badImport } = this.state;
    return (
      <ImportBoxContainer>
        <FilePicker htmlFor="upload">
          {translate('SETTINGS_IMPORT_BUTTON')}
          <FilePickerInput id="upload" type="file" onChange={this.handleFileSelection} />
        </FilePicker>{' '}
        {translate('SETTINGS_IMPORT_PASTE')}
        <Textarea onChange={this.checkPastedCache} />
        <br />
        {isValid && <button onClick={this.submit}>{translate('SETTINGS_IMPORT_CONFIRM')}</button>}
        {badImport && <p>Your imported cache is invalid.</p>}
      </ImportBoxContainer>
    );
  }

  private checkPastedCache = (e: any) => {
    if (isValidCache(this.props.localCache, e.target.value)) {
      this.setState({ isValid: true });
    } else {
      this.setState({ badImport: true });
    }
  };

  private handleFileSelection = (e: any) => {
    const fileReader = new FileReader();
    const target = e.target;
    const inputFile = target.files[0];

    fileReader.onload = () => {
      if (fileReader.result && isValidCache(this.props.localCache, fileReader.result as string)) {
        this.setState({ isValid: true, importedCache: fileReader.result });
      }
    };
    if (isValidFile(inputFile)) {
      fileReader.readAsText(inputFile, 'utf-8');
    }
  };
}
