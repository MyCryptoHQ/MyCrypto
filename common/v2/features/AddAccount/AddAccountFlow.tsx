import React, { useState, useReducer } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { withRouter } from 'react-router-dom';

import { ROUTE_PATHS, WALLETS_CONFIG } from 'v2/config';
import { WalletId } from 'v2/types';
import { ContentPanel, WalletList } from 'v2/components';
import { FormDataActionType as ActionType } from './types';
import { STORIES } from './stories';
import { formReducer, initialState } from './AddAccountForm.reducer';
import './AddAccountFlow.scss';

export const getStory = (storyName: WalletId | undefined): any => {
  return STORIES.filter(selected => selected.name === storyName)[0];
};

export const getStorySteps = (storyName: WalletId | undefined) => {
  return getStory(storyName).steps;
};

export const getWalletInfo = (storyName: WalletId): any => {
  return WALLETS_CONFIG[storyName];
};

/*
  Flow to add an account to localStorage. The default view of the component
  displays a list of wallets (e.g. stories) that each posses their own number
  of steps.
    - AddAccountFlow handles the stepper
    - AddAccountFormProvider handles the form state and is accessed by each
    story.
*/
const AddAccountFlow = withRouter(props => {
  const [storyName, setStoryName] = useState<WalletId | undefined>(); // The Wallet Story that we are tracking.
  const [step, setStep] = useState(0); // The current Step inside the Wallet Story.
  const [formData, updateFormState] = useReducer(formReducer, initialState); // The data that we want to save at the end.

  const isDefaultView = storyName === undefined;

  const goToStart = () => {
    props.history.replace(ROUTE_PATHS.ADD_ACCOUNT.path);
    setStep(0);
    setStoryName(undefined);
    updateFormState({ type: ActionType.RESET_FORM, payload: '' });
  };

  const goToNextStep = () => {
    const nextStep = Math.min(step + 1, getStorySteps(storyName!).length - 1);
    setStep(nextStep);
  };

  const goToPreviousStep = () => {
    if (step === 0) {
      return goToStart();
    }
    setStep(step - 1);
  };

  const onUnlock = async (payload: any) => {
    // 1. Let reducer handle the differences. Infact this updateFormState could
    // be simplified by having each component call `updateFormState` themselves.
    await updateFormState({ type: ActionType.ON_UNLOCK, payload });
    // 2. continue once it's done.
    goToNextStep();
  };

  // Read the walletName parameter from the URL
  const {
    match: {
      params: { walletName: walletNameFromURL }
    }
  } = props;

  const onWalletSelection = (name: WalletId) => {
    // If wallet has been selected manually by user click, add the wallet name to the URL for consistency
    if (name) {
      props.history.replace(`${ROUTE_PATHS.ADD_ACCOUNT.path}/${name}`);
    }

    setStoryName(name);
    // @ADD_ACCOUNT_TODO: This is equivalent to formDispatch call.
    // Maybe we can merge story and accountType to use only one?
    updateFormState({ type: ActionType.SELECT_ACCOUNT_TYPE, payload: { accountType: name } });
  };

  // If there is a valid walletName parameter in the URL, redirect to that wallet
  if (walletNameFromURL) {
    if (!WalletId[walletNameFromURL.toUpperCase()]) {
      props.history.replace(ROUTE_PATHS.ADD_ACCOUNT.path);
    } else {
      if (storyName !== walletNameFromURL) {
        onWalletSelection(walletNameFromURL);
      }
    }
  }

  const renderDefault = () => {
    return (
      <ContentPanel>
        <TransitionGroup>
          <CSSTransition classNames="DecryptContent" timeout={500}>
            <WalletList wallets={STORIES} onSelect={onWalletSelection} showHeader={true} />
          </CSSTransition>
        </TransitionGroup>
      </ContentPanel>
    );
  };

  const renderStep = () => {
    const steps = getStorySteps(storyName);
    const Step = steps[step];

    return (
      <ContentPanel onBack={goToPreviousStep} stepper={{ current: step + 1, total: steps.length }}>
        <TransitionGroup>
          <CSSTransition classNames="DecryptContent" timeout={500}>
            <Step
              wallet={getWalletInfo(storyName!)}
              goToStart={goToStart}
              goToNextStep={goToNextStep}
              onUnlock={onUnlock}
              formData={formData}
              formDispatch={updateFormState}
            />
          </CSSTransition>
        </TransitionGroup>
      </ContentPanel>
    );
  };

  return <>{isDefaultView ? renderDefault() : renderStep()}</>;
});

export default AddAccountFlow;
