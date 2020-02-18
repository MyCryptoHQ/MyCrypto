import React from 'react';
import styled from 'styled-components';
import translate from 'v2/translations';
import { InlineMessage } from 'v2/components';

const FilePicker = styled.label`
  background: none;
  color: #1eb8e7;
  cursor: pointer;
`;
const FilePickerInput = styled.input`
  display: none !important;
`;

interface ImportBoxContainerProps {
  dragging: boolean;
}

const ImportBoxContainer = styled.div<ImportBoxContainerProps>`
  color: #9b9b9b;
  background: #e8eaed;
  padding: 6rem;
  border-radius: 0.375em;
  box-shadow: ${props => (props.dragging ? '0px 0px 0px 2px #1eb8e7;' : 'none')};
`;

interface ImportProps {
  importCache(importedCache: string): boolean;
  onNext(): void;
}

export default class ImportBox extends React.Component<ImportProps> {
  public state = { badImport: false, dragging: false };

  public submit = (importedCache: string) => {
    const importSuccess = this.props.importCache(importedCache);
    if (!importSuccess) {
      this.setState({ badImport: true });
    } else {
      this.props.onNext();
    }
  };

  public render() {
    const { badImport, dragging } = this.state;
    return (
      <ImportBoxContainer
        onDrop={this.handleFileSelection}
        onDragEnter={() => this.setState({ dragging: true })}
        onDragLeave={() => this.setState({ dragging: false })}
        dragging={dragging}
      >
        {badImport ? (
          <InlineMessage>{translate('SETTINGS_IMPORT_INVALID')}</InlineMessage>
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

  private handleFileSelection = (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.result) {
        this.submit(fileReader.result as string);
      }
    };
    if (e.target.files && e.target.files[0]) {
      const target = e.target;
      const inputFile = target.files[0];
      fileReader.readAsText(inputFile, 'utf-8');
    }
    if (e.dataTransfer && e.dataTransfer.items && e.dataTransfer.items[0].kind === 'file') {
      const draggedFile = e.dataTransfer.items[0].getAsFile();
      fileReader.readAsText(draggedFile, 'utf-8');
    }
  };
}
