import React from 'react';
import onboardIconTwo from 'assets/images/onboarding_icon-02.svg';

interface Props {
  setOnboardStatus(slideNumber: number): void;
}

const NotABankSlide: React.SFC<Props> = ({ setOnboardStatus }) => {
  return (
    <article className="onboarding__modal">
      <h3 className="onboarding__title">
        {/* translate="ONBOARD_bank_title" */}
        MyEtherWallet is not a Bank
      </h3>
      <section className="row row--flex">
        <div className="col-xs-12 col-sm-4 onboarding__image">
          <img src={onboardIconTwo} width="100%" height="auto" />
        </div>
        <div className="col-xs-12 col-sm-8 onboarding__content">
          <ul>
            <li>
              {/* translate="ONBOARD_bank_content__1" */}
              When you open an account with a bank or exchange, they create an account for you in
              their system.
            </li>
            <li>
              {/* translate="ONBOARD_bank_content__2" */}
              They keep track of your personal information, account passwords, balances,
              transactions and ultimately your money.
            </li>
            <li>
              {/* translate="ONBOARD_bank_content__3" */}
              They charge fees to manage your account and provide services, like refunding
              transactions when your card gets stolen.
            </li>
            <li>
              {/* translate="ONBOARD_bank_content__4" */}
              You can write a check or charge your debit card to send money, go online to check your
              balance, reset your password, and get a new debit card if you lose it.
            </li>
            <li>
              {/* translate="ONBOARD_bank_content__5" */}
              You have an account *with the bank* and they decide how much money you can send, where
              you can send it, and how long to hold on a suspicious deposit. All for a fee.
            </li>
          </ul>
        </div>
      </section>
      <div className="onboarding__buttons">
        <a onClick={() => setOnboardStatus(1)} className="btn btn-default">
          <span>
            {/* translate="ONBOARD_welcome_title__alt" */}
            Introduction
          </span>
        </a>
        <a onClick={() => setOnboardStatus(3)} className="btn btn-primary">
          <span>
            {/* translate="ONBOARD_interface_title" */}
            MyEtherWallet is an Interface
          </span>
        </a>
      </div>
    </article>
  );
};

export default NotABankSlide;
