import React, { useState, useReducer } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { withRouter } from 'react-router-dom';

import { Layout } from 'v2/features';
import { ContentPanel } from 'v2/components';
import { FormDataActionType as ActionType } from './types';
import { WalletName, walletNames } from 'v2/config/data';
import { STORIES } from './stories';
import { WalletList } from './components';
import { formReducer, initialState } from './AddAccountForm.reducer';
import './AddAccount.scss';
import './AddAccountFlow.scss';

export const getStory = (storyName: WalletName): any => {
  return STORIES.filter(selected => selected.name === storyName)[0];
};

export const getStorySteps = (storyName: WalletName) => {
  return getStory(storyName).steps;
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
  const [storyName, setStoryName] = useState(walletNames.DEFAULT); // The Wallet Story that we are tracking.
  const [step, setStep] = useState(0); // The current Step inside the Wallet Story.
  const [formData, updateFormState] = useReducer(formReducer, initialState); // The data that we want to save at the end.

  const isDefaultView = storyName === walletNames.DEFAULT;

  const goToStart = () => {
    props.history.replace('/add-account');
    setStep(0);
    setStoryName(walletNames.DEFAULT);
    updateFormState({ type: ActionType.RESET_FORM, payload: '' });
  };

  const goToNextStep = () => {
    const nextStep = Math.min(step + 1, getStorySteps(storyName).length - 1);
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
  const { match: { params: { walletName: walletNameFromURL } } } = props;

  const onWalletSelection = (name: WalletName) => {
    // If wallet has been selected manually by user click, add the wallet name to the URL for consistency
    if (name) {
      props.history.replace(`/add-account/${name}`);
    }

    setStoryName(name);
    // @ADD_ACCOUNT_TODO: This is equivalent to formDispatch call.
    // Maybe we can merge story and accountType to use only one?
    updateFormState({ type: ActionType.SELECT_ACCOUNT_TYPE, payload: { accountType: name } });
  };

  // If there is a valid walletName parameter in the URL, redirect to that wallet
  if (walletNameFromURL) {
    if (!walletNames.includes(walletNameFromURL)) {
      props.history.replace('/add-account');
    } else {
      if (storyName !== walletNameFromURL) {
        onWalletSelection(walletNameFromURL);
      }
    }
  }

  const renderDefault = () => {
    return (
      <ContentPanel className="" data-testid="Main-panel">
        <div className="MainPanel">
          <TransitionGroup>
            <CSSTransition classNames="DecryptContent" timeout={500}>
              <WalletList wallets={STORIES} onSelect={onWalletSelection} />
            </CSSTransition>
          </TransitionGroup>
        </div>
      </ContentPanel>
    );
  };

  const renderStep = () => {
    const steps = getStorySteps(storyName);
    const Step = steps[step];

    return (
      <ContentPanel
        className=""
        data-testid="ContentPanelMAKEBIGGER"
        onBack={goToPreviousStep}
        stepper={{ current: step + 1, total: steps.length }}
      >
        <TransitionGroup>
          <CSSTransition classNames="DecryptContent" timeout={500}>
            <Step
              wallet={getStory(storyName)}
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

  return (
    <Layout data-testid="MainLayout" centered={true}>
      {isDefaultView ? renderDefault() : renderStep()}
    </Layout>
  );
});

export default AddAccountFlow;
