import {
  actionWithPayload,
  fireEvent,
  mockAppState,
  mockUseDispatch,
  screen,
  simpleRender
} from 'test-utils';

import { fUserActions } from '@fixtures';
import { translateRaw } from '@translations';
import { ACTION_STATE, ActionTemplate } from '@types';

import { ActionDetails } from '../components/ActionDetails';
import { actionTemplates } from '../constants';

function getComponent(props: { actionTemplate: ActionTemplate }) {
  return simpleRender(<ActionDetails {...props} />, {
    initialState: mockAppState({ userActions: fUserActions })
  });
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
