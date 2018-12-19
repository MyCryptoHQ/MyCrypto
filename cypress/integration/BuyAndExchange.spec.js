describe('Buy and Exchange landing page', () => {
  it('should show both of the swap options', () => {
    cy.skipOnboarding();
    cy.goToSwap();
    cy.getOur('shapeshift-option').should('be.visible');
    cy.getOur('zeroex-option').should('be.visible');
  });

  it('should correctly navigate to ShapeShift', () => {
    cy.goToSwap();
    cy.getOur('shapeshift-option').click();
    cy.location().should(location => {
      expect(location.pathname).to.eq('/swap/shapeshift');
    });
  });

  it('should correctly navigate to 0x Instant', () => {
    cy.goToSwap();
    cy.getOur('zeroex-option').click();
    cy.location().should(location => {
      expect(location.pathname).to.eq('/swap/0x');
    });
  });
});

describe('ShapeShift', () => {
  beforeEach(() => {
    cy.goToSwap();
    cy.getOur('shapeshift-option').click();
  });

  it('renders the authorization screen when no cache entry exists', () =>
    cy.getOur('shapeshift-authorize-button').should('be.visible'));

  it('replaces the Authorize button with Reset once the authorization window has opened', () => {
    cy.getOur('shapeshift-authorize-button').click();
    cy.getOur('shapeshift-authorize-button').should('not.be.visible');
    cy.getOur('shapeshift-reset-button').should('be.visible');
  });

  it('restarts the process when the Reset button is clicked', () => {
    cy.getOur('shapeshift-authorize-button').click();
    cy.getOur('shapeshift-reset-button').click();
    cy.getOur('shapeshift-authorize-button').should('be.visible');
    cy.getOur('shapeshift-reset-button').should('not.be.visible');
  });

  it('loads directly into the usable widget when the cache contains cached data', () => {
    // This click represents the user having cached data.
    cy.getOur('shapeshift-authorize-override-button').click();
    cy.getOur('shapeshift-widget').should('be.visible');
  });
});

describe('0x Instant', () => {
  beforeEach(() => {
    cy.goToSwap();
    cy.getOur('zeroex-option').click();
  });

  it('should render the widget', () => cy.get('.zeroExInstantMainContainer').should('be.visible'));
});
