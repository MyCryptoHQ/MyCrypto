import React from 'react';
import { Link } from 'react-router-dom';
import translate from 'translations';
import { WalletType } from '../GenerateWallet';
import SiteImage from 'assets/images/unlock-guide/site.png';
import TabImage from 'assets/images/unlock-guide/tab.png';
import SelectKeystoreImage from 'assets/images/unlock-guide/select-keystore.png';
import ProvideKeystoreImage from 'assets/images/unlock-guide/provide-keystore.png';
import SelectMnemonicImage from 'assets/images/unlock-guide/select-mnemonic.png';
import ProvideMnemonicImage from 'assets/images/unlock-guide/provide-mnemonic.png';
import './FinalSteps.scss';

interface Props {
  walletType: WalletType;
}

const FinalSteps: React.SFC<Props> = ({ walletType }) => {
  const steps = [
    {
      name: 'Open MyEtherWallet',
      image: SiteImage
    },
    {
      name: 'Go to the account tab',
      image: TabImage
    }
  ];

  if (walletType === WalletType.Keystore) {
    steps.push({
      name: 'Select your wallet type',
      image: SelectKeystoreImage
    });
    steps.push({
      name: 'Provide file & password',
      image: ProvideKeystoreImage
    });
  } else if (walletType === WalletType.Mnemonic) {
    steps.push({
      name: 'Select your wallet type',
      image: SelectMnemonicImage
    });
    steps.push({
      name: 'Enter your phrase',
      image: ProvideMnemonicImage
    });
  }

  return (
    <div className="FinalSteps">
      <h1 className="FinalSteps-title">{translate('ADD_Label_6')}</h1>
      <p className="FinalSteps-help">
        All done, you’re now ready to access your wallet. Just follow these 4 steps whenever you
        want to access your wallet.
      </p>
      <div className="FinalSteps-steps row">
        {steps.map((step, index) => (
          <div key={step.name} className="StepBox col-lg-3 col-sm-6 col-xs-12">
            <h4 className="StepBox-title">{step.name}</h4>
            <div className="StepBox-screen">
              <img className="StepBox-screen-img" src={step.image} />
              <div className="StepBox-screen-number">{index + 1}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="FinalSteps-buttons">
        <Link to="/account" className="FinalSteps-buttons-btn btn btn-primary btn-lg">
          Go to Account
        </Link>
      </div>
    </div>
  );
};

export default FinalSteps;
