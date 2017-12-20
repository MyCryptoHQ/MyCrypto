import React from 'react';
import OnboardSlide from './OnboardSlide';

const NotABankContent = () => {
  return;
};

const NotABankSlide = () => {
  const content = (
    <ul>
      <li>
        {/* translate="ONBOARD_bank_content__1" */}
        When you open an account with a bank or exchange, they create an account for you in their
        system.
      </li>
      <li>
        {/* translate="ONBOARD_bank_content__2" */}
        They keep track of your personal information, account passwords, balances, transactions and
        ultimately your money.
      </li>
      <li>
        {/* translate="ONBOARD_bank_content__3" */}
        They charge fees to manage your account and provide services, like refunding transactions
        when your card gets stolen.
      </li>
      <li>
        {/* translate="ONBOARD_bank_content__4" */}
        You can write a check or charge your debit card to send money, go online to check your
        balance, reset your password, and get a new debit card if you lose it.
      </li>
      <li>
        {/* translate="ONBOARD_bank_content__5" */}
        You have an account *with the bank* and they decide how much money you can send, where you
        can send it, and how long to hold on a suspicious deposit. All for a fee.
      </li>
    </ul>
  );

  return (
    <OnboardSlide
      /* translate="ONBOARD_bank_title" */
      header="MyEtherWallet is not a Bank"
      content={content}
    />
  );
};

export default NotABankSlide;
