/**
 * View Account
 *  // Happy path
 *  1. Open the homepage.
 *  2. Navigate to the "View Address" page.
 *  3. Enter an address into the "Enter an address" field
 *  4. Click the "View Address" button
 *  5. Expect to be navigated to the "Send Transaction" page.
 */
import config from '../fixtures/config';

const VIEW_ONLY_TEST_ADDRESS = '0x1b2aE33190215D27eD60e3130590321B35EAefb0';
const VIEW_ONLY_BAD_TEST_ADDRESS = '0x1b2aE33190215D27eD60e3130590321B35EAefb1';

const openAndEnterAddress = (address = VIEW_ONLY_TEST_ADDRESS) => {
  cy.getOur('wallet-option-view-only').click();
  cy.getOur('view-only-button').should('be.disabled');

  return cy
    .getOur('view-only-input')
    .focus()
    .type(address);
};

describe('Viewing an account', () => {
  beforeEach(() => cy.visit(config.URL));

  it('successfully opens a wallet for viewing (pressing enter)', () => {
    cy.skipOnboarding();
    openAndEnterAddress().type('{enter}');
    cy.getOur('account-info').should('be.visible');
  });

  it('successfully opens a wallet for viewing (using button)', () => {
    openAndEnterAddress();
    cy.getOur('view-only-button').click();
    cy.getOur('account-info').should('be.visible');
  });

  it('remains invalid with the button disabled if the address is invalid', () => {
    openAndEnterAddress(VIEW_ONLY_BAD_TEST_ADDRESS);
    cy.getOur('view-only-button').should('be.disabled');
  });

  it('should navigate back to the home screen when the back button is pressed', () => {
    cy.skipOnboarding();
    openAndEnterAddress();
    cy.getOur('wallet-decrypt-back-button').click();
    cy.getOur('wallet-option-view-only').should('be.visible');
  });
});
