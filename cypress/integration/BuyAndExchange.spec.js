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

describe('0x Instant', () => {
  beforeEach(() => {
    cy.goToSwap();
    cy.getOur('zeroex-option').click();
  });

  it('should render the widget', () => cy.get('.zeroExInstantMainContainer').should('be.visible'));
});
