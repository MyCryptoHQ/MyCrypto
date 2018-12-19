import config from '../fixtures/config';

Cypress.Commands.add('times', (amount, fn) => Array.from({ length: amount }).forEach(() => fn()));

/** Get elements based on our prescribed selection method. */
Cypress.Commands.add('getOur', automationId =>
  cy.get(`[${config.SELECTION_ATTRIBUTE}=${automationId}]`)
);

/** Navigate through the onboarding modal. */
Cypress.Commands.add('skipOnboarding', () => {
  cy.visit(config.URL);

  cy.times(config.ONBOARDING_SLIDE_COUNT, () => {
    const button = cy.getOur('onboarding-button').then($button => {
      if ($button) {
        cy.getOur('onboarding-button').click({ multiple: true, force: true });
      }
    });
  });
});
