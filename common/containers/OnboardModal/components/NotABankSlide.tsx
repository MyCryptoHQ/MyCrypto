import React from 'react';
import OnboardSlide from './OnboardSlide';

const NotABankSlide = () => {
  const content = (
    <ul>
      <li>
        When you open an account with a bank or exchange, they create an account for you in their
        system.
      </li>
      <li>
        They keep track of your personal information, account passwords, balances, transactions and
        ultimately your money.
      </li>
      <li>
        They charge fees to manage your account and provide services, like refunding transactions
        when your card gets stolen.
      </li>
      <li>
        You can write a check or charge your debit card to send money, go online to check your
        balance, reset your password, and get a new debit card if you lose it.
      </li>
      <li>
        You have an account <strong>with the bank</strong> and they decide how much money you can
        send, where you can send it, and how long to hold on a suspicious deposit. All for a fee.
      </li>
    </ul>
  );

  return <OnboardSlide header="MyEtherWallet is not a Bank" content={content} />;
};

export default NotABankSlide;
