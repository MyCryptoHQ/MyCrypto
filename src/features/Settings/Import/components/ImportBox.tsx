import React, { useContext, useEffect, useState } from 'react';

import styled from 'styled-components';

import { InlineMessage } from '@components';
import { ScreenLockContext } from '@features/ScreenLock';
import { importState, useDispatch, useSelector } from '@store';
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
  onNext(): void;
}

const ImportBox: React.FC<ImportProps> = ({ onNext }) => {
  const [dragging, setDragging] = useState(false);
  const dispatch = useDispatch();
  const importError = useSelector((s) => s.importError);
  const importSuccess = useSelector((s) => s.importSuccess);
  const { resetEncrypted } = useContext(ScreenLockContext);

  useEffect(() => {
    if (importSuccess) {
      resetEncrypted();
      onNext();
    }
  }, [importSuccess]);

  const handleFileSelection = (e: any) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      if (fileReader.result) {
        dispatch(importState(fileReader.result.toString()));
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

  return (
    <ImportBoxContainer
      onDrop={handleFileSelection}
      onDragEnter={() => setDragging(true)}
      onDragLeave={() => setDragging(false)}
      dragging={dragging}
    >
      {importError ? (
        <InlineMessage>{translate('SETTINGS_IMPORT_INVALID')}</InlineMessage>
      ) : (
        translate('SETTINGS_IMPORT_COPY')
      )}
      <br />
      <br />
      <FilePicker htmlFor="upload">
        {translate('SETTINGS_IMPORT_BUTTON')}
        <FilePickerInput id="upload" type="file" onChange={handleFileSelection} />
      </FilePicker>{' '}
      {translate('SETTINGS_IMPORT_PASTE')}
      <br />
    </ImportBoxContainer>
  );
};

export default ImportBox;
