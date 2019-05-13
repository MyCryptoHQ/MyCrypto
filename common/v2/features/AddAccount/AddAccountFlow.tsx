import React, { useState, useReducer } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Layout } from 'v2/features';
import { ContentPanel } from 'v2/components';
import { WalletName, FormData, FormDataAction, FormDataActionType as ActionType } from './types';
import { STORIES } from './stories';
import { WalletList } from './components';
import { formReducer, initialState } from './AddAccountForm.reducer';
import './AddAccount.scss';
import './AddAccountFlow.scss';

interface State {
  storyName: WalletName;
  step: number;
  formData: FormData;
}

const getStory = (storyName: WalletName) => {
  return STORIES.filter(selected => selected.name === storyName)[0];
}

const getStorySteps = (storyName: WalletName) => {
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
function AddAccountFlow() {
  const [storyName, setStoryName] = useState(WalletName.DEFAULT); // The Wallet Story that we are tracking.
  const [step, setStep] = useState(0); // The current Step inside the Wallet Story.
  const [formData, updateFormState] = useReducer(formReducer, initialState); // The data that we want to save at the end.

  const isDefaultView = storyName === WalletName.DEFAULT;

  const goToStart = () => {
    setStep(0);
    setStoryName(WalletName.DEFAULT);
    updateFormState({ type: ActionType.RESET_FORM });
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

  const onWalletSelection = (name: WalletName) => {
    setStoryName(name);
    // @ADD_ACCOUNT_TODO: This is equivalent to formDispatch call.
    // Maybe we can merge story and accountType to use only one?
    updateFormState({ type: ActionType.SELECT_ACCOUNT_TYPE, payload: { accountType: name } });
  };

  const renderDefault = () => (
    <ContentPanel className="">
      <TransitionGroup>
        <CSSTransition classNames="DecryptContent" timeout={500}>
          <WalletList wallets={STORIES} onSelect={onWalletSelection} />
        </CSSTransition>
      </TransitionGroup>
    </ContentPanel>
  );

  const renderStep = () => {
    const steps = getStorySteps(storyName);
    const Step = steps[step];

    return (
      <ContentPanel
        className=""
        onBack={goToPreviousStep}
        stepper={{ current: step + 1, total: steps.length }}
      >
        <TransitionGroup>
          <CSSTransition classNames="DecryptContent" timeout={500}>
            <Step
              wallet={getStory(storyName)}
              goToStart={goToStart}
              goToNextStep={goToNextStep}
              onUnlock={() => console.log('UNLOCK CALLED')}
              formData={formData}
              formDispatch={updateFormState}
            />
          </CSSTransition>
        </TransitionGroup>
      </ContentPanel>
    );
  };

  return <Layout centered={true}>{isDefaultView ? renderDefault() : renderStep()}</Layout>;
}

export default AddAccountFlow;
