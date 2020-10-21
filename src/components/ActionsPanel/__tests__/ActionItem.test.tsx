import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { fireEvent, screen, simpleRender } from 'test-utils';

import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { ACTION_STATE, ActionTemplate, ExtendedUserAction } from '@types';

import { ActionItem } from '../components/ActionItem';
import { actionTemplates } from '../constants';

function getComponent(
  props: { actionTemplate: ActionTemplate; onActionClick(): void },
  createActions = jest.fn()
) {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <DataContext.Provider
        value={
          ({
            userActions: [] as ExtendedUserAction[],
            createActions
          } as any) as IDataContext
        }
      >
        <StoreContext.Provider
          value={
            ({
              userActions: [] as ExtendedUserAction[],
              createUserAction: jest.fn()
            } as any) as any
          }
        >
          <ActionItem {...props} />
        </StoreContext.Provider>
      </DataContext.Provider>
    </MemoryRouter>
  );
}

const onActionClick = jest.fn();

const defaultProps = { actionTemplate: actionTemplates[0], onActionClick };

describe('ActionsItem', () => {
  const mockCreate = jest.fn();
  const createActions = jest.fn().mockReturnValue({
    create: mockCreate
  });
  test('display action item', async () => {
    getComponent(defaultProps, createActions);

    expect(screen.getByText(new RegExp(defaultProps.actionTemplate.heading, 'i'))).toBeDefined();
  });

  test('call createUserAction', async () => {
    getComponent(defaultProps, createActions);

    expect(mockCreate).toHaveBeenCalledWith({
      name: defaultProps.actionTemplate.name,
      state: ACTION_STATE.NEW,
      uuid: expect.any(String)
    });
  });

  test('actionItem click triggers onActionClick', async () => {
    getComponent(defaultProps, createActions);

    const actionItem = screen.getByText(new RegExp(defaultProps.actionTemplate.heading, 'i'))
      .parentElement!.parentElement!;

    fireEvent.click(actionItem);

    expect(onActionClick).toHaveBeenCalledWith(actionTemplates[0]);
  });
});
