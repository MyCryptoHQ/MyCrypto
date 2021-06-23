import { actionWithPayload, fireEvent, mockUseDispatch, screen, simpleRender } from 'test-utils';

import { ACTION_STATE, ActionTemplate } from '@types';

import { ActionItem } from '../components/ActionItem';
import { actionTemplates } from '../constants';

function getComponent(props: { actionTemplate: ActionTemplate; onActionClick(): void }) {
  return simpleRender(<ActionItem {...props} />);
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
