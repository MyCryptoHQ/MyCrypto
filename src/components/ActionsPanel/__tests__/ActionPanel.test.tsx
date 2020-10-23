import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { fireEvent, screen, simpleRender } from 'test-utils';

import { fAssets } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { translateRaw } from '@translations';
import { ExtendedUserAction } from '@types';

import { ActionPanel } from '../ActionPanel';

function getComponent() {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <DataContext.Provider
        value={
          ({
            userActions: [
              { name: 'update_label', state: 'new' } as ExtendedUserAction
            ] as ExtendedUserAction[],
            assets: fAssets,
            createActions: jest.fn().mockReturnValue({
              create: jest.fn()
            })
          } as any) as IDataContext
        }
      >
        <StoreContext.Provider
          value={
            ({
              userAssets: [],
              accounts: [],
              uniClaims: [],
              assets: () => [fAssets[1]],
              ensOwnershipRecords: [],
              userActions: [{ name: 'update_label', state: 'new' }],
              createUserAction: jest.fn()
            } as any) as any
          }
        >
          <ActionPanel />
        </StoreContext.Provider>
      </DataContext.Provider>
    </MemoryRouter>
  );
}

describe('ActionsPanel Component', () => {
  test('Display a list of action by default', async () => {
    getComponent();

    expect(screen.getByText(new RegExp(translateRaw('ACTION_PANEL_HEADING'), 'i'))).toBeDefined();
    expect(
      screen.getByText(new RegExp(translateRaw('UPDATE_LABEL_ACTION_HEADING'), 'i'))
    ).toBeDefined();
  });

  test('Show Action details on click', () => {
    getComponent();

    const actionItem = screen.getByText(translateRaw('UPDATE_LABEL_ACTION_HEADING')).parentElement!;

    fireEvent.click(actionItem);

    expect(screen.getByText(translateRaw('UPDATE_LABEL_ACTION_BUTTON'))).toBeDefined();
  });
});
