import styled from 'styled-components';

import { useNotifications } from '@features/NotificationsPanel';
import { NotificationTemplates } from '@types';

const ToolWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;
  width: 100%;
  margin-bottom: 1em;
`;

const ToolsNotifications = () => {
  const { displayNotification } = useNotifications();
  const handleClick: typeof displayNotification = (name, props?) => {
    displayNotification(name, props);
  };

  return (
    <ToolWrapper>
      <button
        onClick={() =>
          handleClick(NotificationTemplates.walletCreated, {
            address: 'N3WAddre3ssCreated'
          })
        }
      >
        New Wallet Created
      </button>
      <button
        onClick={() =>
          handleClick(NotificationTemplates.walletAdded, {
            address: 'N3WAddr3ssAdd3d'
          })
        }
      >
        New Wallet Added
      </button>
      <button onClick={() => handleClick(NotificationTemplates.saveSettings)}>Save Settings</button>{' '}
      <button onClick={() => handleClick(NotificationTemplates.getHardwareWallet)}>
        Get Hardware Wallet
      </button>
      <button
        onClick={() =>
          handleClick(NotificationTemplates.onboardingPleaseUnderstand, {
            previousNotificationClosedDate: new Date()
          })
        }
      >
        Onboarding Please Understand
      </button>
      <button
        onClick={() =>
          handleClick(NotificationTemplates.onboardingResponsible, {
            firstDashboardVisitDate: new Date()
          })
        }
      >
        Onboarding Responsible
      </button>
    </ToolWrapper>
  );
};

export default ToolsNotifications;
