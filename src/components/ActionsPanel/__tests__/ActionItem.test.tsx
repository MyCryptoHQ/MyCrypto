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

import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { ACTION_STATE, ActionTemplate, ExtendedUserAction } from '@types';

import { ActionItem } from '../components/ActionItem';
import { actionTemplates } from '../constants';

function getComponent(props: { actionTemplate: ActionTemplate; onActionClick(): void }) {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <ProvidersWrapper>
        <DataContext.Provider
          value={
            ({
              userActions: [] as ExtendedUserAction[]
            } as unknown) as IDataContext
          }
        >
          <StoreContext.Provider
            value={
              ({
                userActions: [] as ExtendedUserAction[]
              } as any) as any
            }
          >
            <ActionItem {...props} />
          </StoreContext.Provider>
        </DataContext.Provider>
      </ProvidersWrapper>
    </MemoryRouter>
  );
}

const onActionClick = jest.fn();

const defaultProps = { actionTemplate: actionTemplates[0], onActionClick };

describe('ActionsItem', () => {
  const mockDispatch = mockUseDispatch();
  test('display action item', async () => {
    getComponent(defaultProps);

    expect(screen.getByText(new RegExp(defaultProps.actionTemplate.heading, 'i'))).toBeDefined();
  });

  test('call createUserAction', async () => {
    getComponent(defaultProps);

    expect(mockDispatch).toHaveBeenCalledWith(
      actionWithPayload({
        name: defaultProps.actionTemplate.name,
        state: ACTION_STATE.NEW,
        uuid: expect.any(String)
      })
    );
  });

  test('actionItem click triggers onActionClick', async () => {
    getComponent(defaultProps);

    const actionItem = screen.getByText(new RegExp(defaultProps.actionTemplate.heading, 'i'))
      .parentElement!.parentElement!;

    fireEvent.click(actionItem);

    expect(onActionClick).toHaveBeenCalledWith(actionTemplates[0]);
  });
});
