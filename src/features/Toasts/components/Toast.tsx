import styled from 'styled-components';

import infoIcon from '@assets/images/icn-toast-alert.svg';
import closeIcon from '@assets/images/icn-toast-close.svg';
import errorIcon from '@assets/images/icn-toast-error.svg';
import progressIcon from '@assets/images/icn-toast-progress.svg';
import successIcon from '@assets/images/icn-toast-success.svg';
import swapIcon from '@assets/images/icn-toast-swap.svg';
import Typography from '@components/Typography';
import { BREAK_POINTS, COLORS } from '@theme';
import { ToastConfig, ToastType } from '@types';

interface ToastProp extends ToastConfig {
  templateData?: any;
}

interface Props {
  toast: ToastProp;
  onClose(): void;
}

interface IconProps {
  type: ToastType;
}

const ToastWrapper = styled.div`
  display: flex;
  width: 586px;
  min-height: 77px;
  margin: 8px;
  background: #ffffff;
  /* LIGHT GREY */
  /* Toast Shadow */
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  text-align: left;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 100%;
  }
`;

const IconWrapper = styled.div<IconProps>`
  display: flex;
  width: 69px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => colors[props.type]};

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 14px;
  }
`;

const IconImage = styled.img`
  width: 30px;
  height: 30px;

  @media (max-width: ${BREAK_POINTS.SCREEN_SM}) {
    width: 0;
    height: 0;
    visibility: hidden;
  }
`;

const Text = styled.div`
  margin-top: 13px;
  margin-bottom: 12px;
  margin-left: 16px;
  flex: 1 1 auto;
`;

const Border = styled.div`
  display: flex;
  width: inherit;
  border: 2px solid #d6dce5;
  border-left: none;
  box-sizing: border-box;
`;

const CloseWrapper = styled.div`
  display: flex;
  width: 64px;
  justify-content: center;
  align-items: center;
`;

const CloseImage = styled.img`
  width: 18px;
  height: 20px;
`;

const colors = {
  SUCCESS: '#A7E07C',
  ERROR: '#DD544E',
  INFO: '#333333',
  ONGOING: '#F8D277',
  SWAP: '#A086F7'
};

const icons = {
  SUCCESS: successIcon,
  ERROR: errorIcon,
  INFO: infoIcon,
  ONGOING: progressIcon,
  SWAP: swapIcon
};

export default function Toast({ toast, onClose }: Props) {
  return (
    <ToastWrapper>
      <IconWrapper type={toast.type}>
        <IconImage src={icons[toast.type]} />
      </IconWrapper>
      <Border>
        <Text>
          <Typography as={'div'} bold={true}>
            {toast.header}
          </Typography>
          <Typography as={'div'} style={{ color: COLORS.LEMON_GRASS }}>
            {toast.message(toast.templateData)}
          </Typography>
        </Text>
        <CloseWrapper>
          <CloseImage src={closeIcon} onClick={onClose} />
        </CloseWrapper>
      </Border>
    </ToastWrapper>
  );
}
