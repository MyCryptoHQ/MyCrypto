import React, { useState, useMemo, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useReducer } from 'reinspect';
import styled from 'styled-components';

import { ROUTE_PATHS } from '@config';
import { IFrame, Downloader, Link } from '@components';
import { useUpdateEffect } from '@vendor';

import MigrateLSReducer, { defaultState, UIStates } from './reducer';
import { bindActions } from './actions';
import { getIFrameSrc, DBName } from './helpers';

const SActionContainer = styled.div`
  display: inline-block;
  margin: 0 1ch;
  & button {
    padding: 1px 6px;
  }
  & button:last-of-type {
    margin-left: 0.5ch;
  }
`;

const SBanner = styled.div`
  height: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

/**
 *  Use an IFrame to check if the old url contains a localstorage that we need to import.
 *  Validate the schema, and prompt the user to import their previous settings.
 *  If user accepts and migration succeeds:
 *    - destroy the previous storage so they aren't prompted again.
 *    - let `NO_ACCOUNTS` handle the redirect, after `Store` is hydrated.
 *  If user cancels:
 *    - prompt to confirm cancel and inform that it will download a json
 *    - destroy previous storage.
 */
const MigrateLS = ({
  isDefault: isDefaultStore = false,
  importStorage = () => false,
  isValidImport
}: {
  isDefault?: boolean;
  importStorage(ls: string): boolean;
  isValidImport(ls: string): boolean;
}) => {
  const history = useHistory();
  const [reload, setReload] = useState(false);

  // We only need to get the iFrame src url once
  const src = useMemo(() => getIFrameSrc(window), []);

  const [{ storage, iframeRef, uiState, canDestroy, canReset }, dispatch] = useReducer(
    MigrateLSReducer,
    defaultState,
    (state) => state,
    'MigrateLS'
  );

  // Connect our actions to the store
  const {
    getStorage,
    reset,
    destroySuccess,
    downloadAndDestroy,
    cancelMigration,
    migrateStorage,
    abortCancel
  } = useMemo(() => bindActions(dispatch), [dispatch]);

  useUpdateEffect(() => {
    setReload(true);
  }, [isDefaultStore]);

  useUpdateEffect(() => {
    if (!canReset) return;
    reset();
    history.push(ROUTE_PATHS.DASHBOARD.path);
  });

  useEffect(() => {
    if (canDestroy && iframeRef) {
      try {
        iframeRef.contentWindow?.localStorage.removeItem(DBName);
        destroySuccess();
      } catch (err) {
        throw new Error('[MYC-Migrate] failed to destroy previous storage');
      }
    }
  }, [canDestroy, iframeRef]);

  const handleLoad = (frame: HTMLIFrameElement) => getStorage(frame, src, isValidImport);
  const handleCancel = () => cancelMigration();
  const handleMigrate = () => {
    if (!storage) return;
    migrateStorage(storage, importStorage);
  };
  const handleConfirm = () => downloadAndDestroy();
  const handleAbort = () => abortCancel();

  const UI_STATES: Record<UIStates, JSX.Element> = {
    default: <></>,
    'migrate-prompt': (
      <SBanner>
        We found your previous settings from beta.mycrypto.com. Would you like to import them?
        <SActionContainer>
          <button onClick={handleMigrate}>
            <Link>Yes</Link>
          </button>
          <button onClick={handleCancel}>
            <Link>No</Link>
          </button>
        </SActionContainer>
      </SBanner>
    ),
    'migrate-success': <SBanner>All done!</SBanner>,
    'migrate-error': (
      <SBanner>
        The migration failed. Please contact support with your settings file
        <Downloader data={storage!}>settings.json</Downloader>
      </SBanner>
    ),
    'confirm-success': <SBanner>All done!</SBanner>,
    'confirm-cancel': (
      <SBanner>
        This will download a copy of your settings and clear the storage at beta.mycrypto.com.
        <SActionContainer>
          <Downloader data={storage!} onClick={handleConfirm}>
            <button>I understand</button>
          </Downloader>
          <button>
            <Link onClick={handleAbort}>Abort</Link>
          </button>
        </SActionContainer>
      </SBanner>
    )
  };

  return (
    <>
      <IFrame src={src} onLoad={handleLoad} hidden={true} reload={reload} />
      {isDefaultStore && UI_STATES[uiState]}
    </>
  );
};

export default MigrateLS;
