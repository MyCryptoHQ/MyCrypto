import React from 'react';

import { MemoryRouter } from 'react-router-dom';
import { fireEvent, screen, simpleRender } from 'test-utils';

import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { ActionTemplate, ExtendedUserAction } from '@types';

import { ActionItem } from '../components/ActionItem';
import { actionTemplates } from '../constants';

function getComponent(props: { actionTemplate: ActionTemplate; onActionClick(): void }) {
  return simpleRender(
    <MemoryRouter initialEntries={undefined}>
      <DataContext.Provider
        value={
          ({
            userActions: [] as ExtendedUserAction[]
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
  test('display action item', async () => {
    getComponent(defaultProps);

    expect(screen.getByText(new RegExp(defaultProps.actionTemplate.heading, 'i'))).toBeDefined();
  });

  test('actionItem click triggers onActionClick', async () => {
    getComponent(defaultProps);

    const actionItem = screen.getByText(new RegExp(defaultProps.actionTemplate.heading, 'i'))
      .parentElement!.parentElement!;

    fireEvent.click(actionItem);

    expect(onActionClick).toHaveBeenCalledWith(actionTemplates[0]);
  });
});
