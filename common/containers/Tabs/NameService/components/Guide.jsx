import React from 'react';
import PropTypes from 'prop-types';
import './Guide.scss';

const steps = [
  {
    title: 'Preperation',
    notes: [
      'Decide which account you wish to own the name & ensure you have multiple backups of that account.',
      'Decide the maximum amount of ETH you are willing to pay for the name (your Bid Amount). Ensure that account has enough to cover your bid + 0.01 ETH for gas.'
    ]
  },
  {
    title: 'Start an Auction / Place a Bid',
    notes: [
      'Bidding period lasts 3 days (72 hours).',
      'You will enter the name, Actual Bid Amount, Bid Mask, which is protected by a Secret Phrase.',
      'This places your bid, but this information is kept secret until you reveal it.'
    ]
  },
  {
    title: 'Reveal your Bid',
    notes: [
      'If you do not reveal your bid, you will not be refunded.',
      'Reveal Period lasts 2 days (48 hours).',
      'You will unlock your account, enter the Bid Amount, and the Secret Phrase.',
      'In the event that two parties bid exactly the same amount, the first bid revealed will win.'
    ]
  },
  {
    title: 'Finalize the Auction',
    notes: [
      'Once the auction has ended (after 5 days / 120 hours), the winner needs to finalize the auction in order to claim their new name.',
      'The winner will be refunded the difference between their bid and the next-highest bid. If you are the only bidder, you will refunded all but 0.01 ETH.'
    ]
  }
];

export default class Guide extends React.Component {
  render() {
    return (
      <div className="Guide">
        <h3 className="Guide-title">What is the process like?</h3>
        <div className="Guide-steps">
          {steps.map((step, idx) => {
            return (
              <div className="GuideStep" key={idx}>
                <div className="GuideStep-title">
                  {idx + 1}. {step.title}
                </div>
                <ul className="GuideStep-notes">
                  {step.notes.map((note, noteIdx) =>
                    <li className="GuideStep-notes-note" key={noteIdx}>
                      {note}
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="Guide-more">
          More detailed technical information is available in the{' '}
          <a href="http://docs.ens.domains/en/latest/userguide.html#registering-a-name-with-the-auction-registrar">
            official ENS documentation
          </a>.
        </p>
      </div>
    );
  }
}
