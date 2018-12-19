describe('Using Buy and Exchange', () => {
  it('should show both of the swap options', () => {
    cy.skipOnboarding();
    cy.getOur('swap-link').click();
    cy.getOur('shapeshift-option').should('be.visible');
    cy.getOur('zeroex-option').should('be.visible');
  });

  it('should correctly navigate to ShapeShift', () => {
    cy.getOur('swap-link').click();
    cy.getOur('shapeshift-option').click();
    cy.location().should(location => {
      expect(location.pathname).to.eq('/swap/shapeshift');
    });
  });

  it('should correctly navigate to 0x Instant', () => {
    cy.getOur('swap-link').click();
    cy.getOur('zeroex-option').click();
    cy.location().should(location => {
      expect(location.pathname).to.eq('/swap/0x');
    });
  });
});
