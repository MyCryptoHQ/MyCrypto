import React from 'react';

import { screen, simpleRender } from 'test-utils';

import { fActionTemplates } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { ExtendedUserAction } from '@types';

import { ActionsList, sortActions } from '../components/ActionsList';

type Props = React.ComponentProps<typeof ActionsList>;

function getComponent(props: Props) {
  return simpleRender(
    <DataContext.Provider
      value={
        ({
          userActions: [] as ExtendedUserAction[],
          createActions: jest.fn().mockReturnValue({
            create: jest.fn()
          })
        } as any) as IDataContext
      }
    >
      <StoreContext.Provider
        value={
          ({
            userActions: [],
            createUserAction: jest.fn()
          } as any) as any
        }
      >
        <ActionsList {...props} />
      </StoreContext.Provider>
    </DataContext.Provider>
  );
}

const defaultProps = {
  actionTemplates: fActionTemplates,
  onActionClick: jest.fn()
};

describe('ActionsList Component', () => {
  test('Render the list of actions', async () => {
    getComponent(defaultProps);

    expect(screen.getByText(new RegExp(fActionTemplates[0].heading, 'i'))).toBeDefined();
  });
});

describe('ActionList utils functions', () => {
  it('sortActions() sort actionTemplates by category', () => {
    const result = sortActions(fActionTemplates);
    const expected = [
      fActionTemplates[6],
      fActionTemplates[0],
      fActionTemplates[1],
      fActionTemplates[2],
      fActionTemplates[5],
      fActionTemplates[3],
      fActionTemplates[4]
    ];

    expect(result).toEqual(expected);
  });
});
