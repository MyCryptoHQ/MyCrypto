import React from 'react';
import { ISendState } from '../types';

interface Props {
  stateValues?: ISendState;
}

function SignTransaction({  }: Props) {
  return <div>This gets renders when signing Transaction</div>;
}

export default SignTransaction;
