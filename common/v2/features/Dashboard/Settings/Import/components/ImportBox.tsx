import React from 'react';
import styled from 'styled-components';
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

const ErrorMessage = styled.span`
  color: #ef4747;
`;

interface ImportProps {
  importCache(importedCache: any): void;
  onNext(): void;
}

export default class ImportBox extends React.Component<ImportProps> {
  public state = { badImport: false };
  public submit = (importedCache: string) => {
    const importSuccess = this.props.importCache(importedCache);
    if (Boolean(importSuccess) === false) {
      this.setState({ badImport: true });
    }
    if (Boolean(importSuccess) === true) {
      this.props.onNext();
    }
  };

  public render() {
    const { badImport } = this.state;
    return (
      <ImportBoxContainer onDrop={this.handleFileSelection}>
        {badImport ? (
          <ErrorMessage>{translate('SETTINGS_IMPORT_INVALID')}</ErrorMessage>
        ) : (
          translate('SETTINGS_IMPORT_COPY')
        )}
        <br />
        <br />
        <FilePicker htmlFor="upload">
          {translate('SETTINGS_IMPORT_BUTTON')}
          <FilePickerInput id="upload" type="file" onChange={this.handleFileSelection} />
        </FilePicker>{' '}
        {translate('SETTINGS_IMPORT_PASTE')}
        <br />
      </ImportBoxContainer>
    );
  }

  // private checkPastedCache = (e: any) => {
  //   if (isValidCache(this.props.localStorage, e.target.value)) {
  //     this.setState({ isValid: true });
  //   } else {
  //     this.setState({ badImport: true });
  //   }
  // };

  private handleFileSelection = (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.result) {
        // this.setState({ isValid: true, importedCache: fileReader.result });
        this.submit(fileReader.result as string);
      }
    };
    if (e.target.files) {
      if (e.target.files[0]) {
        const target = e.target;
        const inputFile = target.files[0];
        fileReader.readAsText(inputFile, 'utf-8');
      }
    }
    if (e.dataTransfer) {
      if (e.dataTransfer.items) {
        if (e.dataTransfer.items[0].kind === 'file') {
          const draggedFile = e.dataTransfer.items[0].getAsFile();
          fileReader.readAsText(draggedFile, 'utf-8');
        }
      }
    }
  };
}
