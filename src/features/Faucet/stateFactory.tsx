import { FaucetService } from '@services/ApiService/Faucet';
import { StoreAccount } from '@types';
import { TUseStateReducerFactory } from '@utils';

import { FaucetState, ITxFaucetResult } from './types';

const FaucetFactory: TUseStateReducerFactory<FaucetState> = ({ state, setState }) => {
  const reset = () => {
    setState(() => ({
      step: 0,
      loading: false
    }));
  };

  const setSolution = (solution: string) => {
    setState((prevState: FaucetState) => ({
      ...prevState,
      solution
    }));
  };

  const requestFunds = (recipientAddress: StoreAccount) => {
    const network = recipientAddress.network.name.toLowerCase();
    const address = recipientAddress.address;
    FaucetService.requestChallenge(network, address)
      .then((result) => {
        if (!result.success) {
          throw new Error(result.message);
        } else {
          setState((prevState: FaucetState) => ({
            ...prevState,
            challenge: result.result,
            step: 1
          }));
        }
      })
      .catch((e) => {
        setState((prevState: FaucetState) => ({
          ...prevState,
          error: e.message
        }));
      });
  };

  const finalizeRequestFunds = (solutionInput: string) => {
    if (state.challenge) {
      const challengeID = state.challenge.id;
      setState((prevState: FaucetState) => ({
        ...prevState,
        loading: true
      }));
      FaucetService.solveChallenge(challengeID, solutionInput)
        .then((result) => {
          if (!result.success) {
            throw new Error(result.message);
          } else {
            setState((prevState: FaucetState) => ({
              ...prevState,
              loading: false,
              txResult: result.result as ITxFaucetResult,
              step: 2
            }));
          }
        })
        .catch((e) => {
          if (e.message === 'INVALID_SOLUTION') {
            FaucetService.regenerateChallenge(challengeID)
              .then((result) => {
                if (!result.success) {
                  throw new Error(result.message);
                } else {
                  setState((prevState: FaucetState) => ({
                    ...prevState,
                    solution: '',
                    challenge: result.result,
                    error: e.message,
                    loading: false
                  }));
                }
              })
              .catch((err) => {
                setState((prevState: FaucetState) => ({
                  ...prevState,
                  error: err.message
                }));
              });
          } else {
            setState((prevState: FaucetState) => ({
              ...prevState,
              loading: false,
              error: e.message
            }));
          }
        });
    }
  };

  return {
    reset,
    setSolution,
    requestFunds,
    finalizeRequestFunds,
    faucetState: state
  };
};

export default FaucetFactory;
