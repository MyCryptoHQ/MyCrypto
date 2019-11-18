import React from 'react';
import styled from 'styled-components';

import { IToast, ToastType } from 'v2/types/toast';
import { Typography } from 'v2/components';
import { IS_MOBILE } from 'v2/utils';

import closeIcon from 'assets/images/close.svg';

interface Props {
  toast: IToast;
  onClose(): void;
}

interface IconProps {
  type: ToastType;
}

const ToastWrapper = styled.div`
  display: flex;
  width: 400px;

  background: #ffffff;
  /* LIGHT GREY */
  /* Toast Shadow */
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  text-align: left;
`;

const Icon = styled.div<IconProps>`
  width: 0.5em;
  background-color: ${props => colors[props.type]};
`;

const Text = styled.div`
  padding: 1em;
`;

const Border = styled.div`
  display: flex;
  width: inherit;
  border: 2px solid #d6dce5;
  border-left: none;
  box-sizing: border-box;
`;

const Close = styled.div`
  display: flex;
  width: 24px;
  vertical-align: middle;
  align-items: center;
`;

const colors = {
  SUCCESS: '#A7E07C',
  ERROR: '#DD544E',
  INFO: '#333333',
  ONGOING: '#F8D277',
  COMPLETE: '#A086F7'
};

const icons = {
  SUCCESS: '',
  ERROR: '',
  INFO: '',
  ONGOING: '',
  COMPLETE: ''
};

export default function Toast({ toast, onClose }: Props) {
  return (
    <ToastWrapper>
      <Icon type={toast.type}>{!IS_MOBILE && <img src={icons[toast.type]} />}</Icon>
      <Border>
        <Text>
          <Typography as={'div'} bold={true}>
            {toast.header}
          </Typography>
          <Typography as={'div'}>{toast.message}</Typography>
        </Text>
        <Close>
          <img src={closeIcon} onClick={onClose} />
        </Close>
      </Border>
    </ToastWrapper>
  );
}
