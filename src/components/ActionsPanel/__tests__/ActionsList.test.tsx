import React from 'react';

import { screen, simpleRender } from 'test-utils';

import { fActionTemplates } from '@fixtures';
import { DataContext, IDataContext, StoreContext } from '@services/Store';
import { ACTION_CATEGORIES, ActionTemplate, ExtendedUserAction } from '@types';
import { descend, filter, prop, propEq, sort } from '@vendor';

import {
  ActionsList,
  areSamePriority,
  getFeaturedActions,
  selectActionToDisplay
} from '../components/ActionsList';

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
  it('getFeaturedActions returns top of category action for all categories', () => {
    const expected = sort(descend(prop('priority')))([
      fActionTemplates[0],
      fActionTemplates[1],
      fActionTemplates[5],
      fActionTemplates[6],
      fActionTemplates[4]
    ]);

    const result = getFeaturedActions(fActionTemplates);

    expect(result).toEqual(expected);
  });

  it('getFeaturedActions with no actions return an empty array', () => {
    const expected = [] as ActionTemplate[];

    const result = getFeaturedActions([] as ActionTemplate[]);

    expect(result).toEqual(expected);
  });

  it("areSamePriority returns false when all the actions don't have the same priority", () => {
    const result = areSamePriority([
      fActionTemplates[5],
      fActionTemplates[6],
      fActionTemplates[0],
      fActionTemplates[1],
      fActionTemplates[4]
    ]);

    expect(result).toBeFalsy();
  });

  it('areSamePriority returns true when all the actions have the same priority', () => {
    const result = areSamePriority([
      fActionTemplates[0],
      fActionTemplates[1],
      fActionTemplates[2],
      fActionTemplates[3],
      fActionTemplates[4]
    ]);

    expect(result).toBeTruthy();
  });

  it('selectActionToDisplay select the highest priority action of the list', () => {
    const expected = fActionTemplates[6];

    const result = selectActionToDisplay(
      filter(propEq('category', ACTION_CATEGORIES.SELF_LOVE), fActionTemplates)
    );

    expect(result).toEqual(expected);
  });
  it('selectActionToDisplay select the last action of the category if priorities are equal', () => {
    const expected = fActionTemplates[5];

    const result = selectActionToDisplay(
      filter(propEq('category', ACTION_CATEGORIES.SECURITY), fActionTemplates)
    );

    expect(result).toEqual(expected);
  });
});
