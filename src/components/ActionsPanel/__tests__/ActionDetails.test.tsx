import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import {
  actionWithPayload,
  fireEvent,
  mockUseDispatch,
  ProvidersWrapper,
  screen,
  simpleRender
} from 'test-utils';

import { fAssets, fUserActions } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { translateRaw } from '@translations';
import { ACTION_STATE, ActionTemplate } from '@types';

import { ActionDetails } from '../components/ActionDetails';
import { actionTemplates } from '../constants';

function getComponent(props: { actionTemplate: ActionTemplate }) {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <ProvidersWrapper>
        <DataContext.Provider
          value={
            ({
              userActions: fUserActions,
              assets: fAssets
            } as unknown) as IDataContext
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
                userActions: fUserActions,
                createUserAction: jest.fn()
              } as any) as any
            }
          >
            <ActionDetails {...props} />
          </StoreContext.Provider>
        </DataContext.Provider>
      </ProvidersWrapper>
    </MemoryRouter>
  );
}

const defaultProps = { actionTemplate: actionTemplates[0] };

describe('ActionsDetails', () => {
  test('display action template informations', async () => {
    getComponent(defaultProps);

    expect(
      screen.getByText(new RegExp(translateRaw('UPDATE_LABEL_ACTION_BODY_1'), 'i'))
    ).toBeDefined();
    expect(
      screen.getByText(new RegExp(translateRaw('UPDATE_LABEL_ACTION_BODY_2'), 'i'))
    ).toBeDefined();
    expect(
      screen.getByText(new RegExp(defaultProps.actionTemplate.button.props!.content, 'i'))
    ).toBeDefined();
  });

  test('button click triggers userAction state update', async () => {
    const mockDispatch = mockUseDispatch();

    getComponent(defaultProps);

    const button = screen.getByText(
      new RegExp(defaultProps.actionTemplate.button.props!.content, 'i')
    );

    fireEvent.click(button);

    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({ ...fUserActions[0], state: ACTION_STATE.STARTED })
    );
  });
});
