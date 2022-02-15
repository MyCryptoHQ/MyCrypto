import { Button, LinkApp } from '@components';
import { useUserActions } from '@services';
import { ACTION_STATE, ExtendedUserAction } from '@types';

export interface ActionButtonProps {
  userAction: ExtendedUserAction;
  content: string;
  to: string;
  shouldComplete?: boolean;
  external: boolean;
}

export const ActionButton = ({
  content,
  to,
  shouldComplete,
  external,
  userAction
}: ActionButtonProps) => {
  const { updateUserAction } = useUserActions();

  const handleClick = () => {
    updateUserAction(userAction.uuid, {
      ...userAction,
      state: shouldComplete ? ACTION_STATE.COMPLETED : ACTION_STATE.STARTED
    });
  };

  return (
    <LinkApp href={to} isExternal={external} onClick={handleClick}>
      <Button
        disabled={userAction.state !== 'default' && userAction.state === 'completed'}
        fullwidth={true}
      >
        {content}
      </Button>
    </LinkApp>
  );
};
