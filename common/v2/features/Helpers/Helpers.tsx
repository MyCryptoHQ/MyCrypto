import React, { FunctionComponent, useState } from 'react';
import { Heading, Input } from '@mycrypto/ui';
import { ExtendedContentPanel } from 'v2/components';
import Collapse from 'rc-collapse';
import styled from 'styled-components';
import { utils } from 'ethers';

import './Helpers.scss';

const { Panel } = Collapse;

const HeadingWrapper = styled.div`
  font-size: 30px;
`;

const UnitInput = styled.div`
  width: 80%;
  display: inline-block;
`;

const UnitTitle = styled.div`
  width: 20%;
  display: inline;
`;

export const Helpers: FunctionComponent = () => {
  const [weiAmount, setWeiAmount] = useState('1000000000000000000');
  const [keccakInput, setKeccakInput] = useState('hello');
  const [decimalInput, setDecimalInput] = useState('10');
  const [hexadecimalInput, setHexadecimalInput] = useState('0x0a');
  const [namehashInput, setNamehashInput] = useState('mycryptoid.eth');

  const wei = utils.bigNumberify(weiAmount);

  return (
    <ExtendedContentPanel
      heading={
        <HeadingWrapper>
          <Heading>Helpers</Heading>
        </HeadingWrapper>
      }
      width="850px"
    >
      <p>
        This page contains various utilities which may be helpful to developers in the Ethereum
        ecosystem.
      </p>
      <Collapse>
        <Panel header="Ethereum Units">
          <UnitInput>
            <Input
              value={utils.formatUnits(wei, 0).replace('.0', '')}
              onChange={e => setWeiAmount(e.target.value)}
            />
          </UnitInput>{' '}
          <UnitTitle>wei</UnitTitle>
          <UnitInput>
            <Input
              value={utils.formatUnits(wei, 3)}
              onChange={e => setWeiAmount(utils.parseUnits(e.target.value, 3).toString())}
            />
          </UnitInput>{' '}
          <UnitTitle>kwei</UnitTitle>
          <UnitInput>
            <Input
              value={utils.formatUnits(wei, 6)}
              onChange={e => setWeiAmount(utils.parseUnits(e.target.value, 6).toString())}
            />
          </UnitInput>{' '}
          <UnitTitle>mwei</UnitTitle>
          <UnitInput>
            <Input
              value={utils.formatUnits(wei, 9)}
              onChange={e => setWeiAmount(utils.parseUnits(e.target.value, 9).toString())}
            />
          </UnitInput>{' '}
          <UnitTitle>gwei</UnitTitle>
          <UnitInput>
            <Input
              value={utils.formatUnits(wei, 12)}
              onChange={e => setWeiAmount(utils.parseUnits(e.target.value, 12).toString())}
            />
          </UnitInput>{' '}
          <UnitTitle>szabo</UnitTitle>
          <UnitInput>
            <Input
              value={utils.formatUnits(wei, 15)}
              onChange={e => setWeiAmount(utils.parseUnits(e.target.value, 15).toString())}
            />
          </UnitInput>{' '}
          <UnitTitle>finney</UnitTitle>
          <UnitInput>
            <Input
              value={utils.formatUnits(wei, 18)}
              onChange={e => setWeiAmount(utils.parseUnits(e.target.value, 18).toString())}
            />
          </UnitInput>{' '}
          <UnitTitle>ether</UnitTitle>
          <UnitInput>
            <Input
              value={utils.formatUnits(wei, 21)}
              onChange={e => setWeiAmount(utils.parseUnits(e.target.value, 21).toString())}
            />
          </UnitInput>{' '}
          <UnitTitle>kether</UnitTitle>
          <UnitInput>
            <Input
              value={utils.formatUnits(wei, 24)}
              onChange={e => setWeiAmount(utils.parseUnits(e.target.value, 24).toString())}
            />
          </UnitInput>{' '}
          <UnitTitle>mether</UnitTitle>
          <UnitInput>
            <Input
              value={utils.formatUnits(wei, 27)}
              onChange={e => setWeiAmount(utils.parseUnits(e.target.value, 27).toString())}
            />
          </UnitInput>{' '}
          <UnitTitle>gether</UnitTitle>
          <UnitInput>
            <Input
              value={utils.formatUnits(wei, 30)}
              onChange={e => setWeiAmount(utils.parseUnits(e.target.value, 30).toString())}
            />
          </UnitInput>{' '}
          <UnitTitle>tether</UnitTitle>
        </Panel>
        <Panel header="Keccak-256">
          <b>Input</b>
          <Input value={keccakInput} onChange={e => setKeccakInput(e.target.value)} />
          <br />
          <b>Output</b>
          <Input
            value={utils.keccak256(utils.toUtf8Bytes(keccakInput))}
            disabled={true}
            style={{ backgroundColor: '#ececec' }}
          />
        </Panel>
        <Panel header="Decimal/Hexadecimal">
          <b>Decimal</b>
          <Input
            value={decimalInput.toString()}
            onChange={e => {
              setDecimalInput(e.target.value);
              setHexadecimalInput(utils.bigNumberify(e.target.value).toHexString());
            }}
          />
          <br />
          <b>Hexadecimal</b>
          <Input
            value={hexadecimalInput}
            onChange={e => {
              setHexadecimalInput(e.target.value);
              setDecimalInput(utils.bigNumberify(e.target.value).toString());
            }}
          />
        </Panel>
        <Panel header="ENS Namehash">
          <b>Input</b>
          <Input value={namehashInput} onChange={e => setNamehashInput(e.target.value)} />
          <br />
          <b>Output</b>
          <Input
            value={utils.namehash(namehashInput)}
            disabled={true}
            style={{ backgroundColor: '#ececec' }}
          />
        </Panel>
      </Collapse>
    </ExtendedContentPanel>
  );
};
