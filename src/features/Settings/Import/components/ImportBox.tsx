import { Component } from 'react';

import styled from 'styled-components';

import { InlineMessage } from '@components';
import translate from '@translations';

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
  box-shadow: ${(props) => (props.dragging ? '0px 0px 0px 2px #1eb8e7;' : 'none')};
`;

interface ImportProps {
  importState(importedCache: string): void;
  importSuccess: boolean;
  importFailure: boolean;
  onNext(): void;
}

export default class ImportBox extends Component<ImportProps> {
  public state = { dragging: false };

  public async componentDidUpdate() {
    const { importSuccess, onNext } = this.props;
    if (importSuccess) {
      onNext();
    }
  }

  public submit = (toImport: string) => {
    const { importState } = this.props;
    importState(toImport);
  };

  public render() {
    const { dragging } = this.state;
    const { importFailure } = this.props;
    return (
      <ImportBoxContainer
        onDrop={this.handleFileSelection}
        onDragOver={() => this.setState({ dragging: true })}
        onDragLeave={() => this.setState({ dragging: false })}
        dragging={dragging}
      >
        {importFailure ? (
          <InlineMessage>{translate('SETTINGS_IMPORT_INVALID')}</InlineMessage>
        ) : (
          translate('SETTINGS_IMPORT_COPY')
        )}
        <br />
        <br />
        <FilePicker htmlFor="upload">
          {translate('SETTINGS_IMPORT_BUTTON')}
          <FilePickerInput
            data-testid="upload-input"
            id="upload"
            type="file"
            onChange={this.handleFileSelection}
          />
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
