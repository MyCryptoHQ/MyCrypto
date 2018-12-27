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

  describe('Authorization process', () => {
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

  describe('Pair Screen', () => {
    it('automatically inputs a withdraw amount based on an entered deposit amount', () => {
      cy
        .getOur('pair-form-deposit-input')
        .clear()
        .type('1');
      cy.getOur('pair-form-withdraw-input').should('have.value', '0.5000000');
    });

    it('automatically inputs a deposit amount based on an entered withdraw amount', () => {
      cy
        .getOur('pair-form-withdraw-input')
        .clear()
        .type('0.5000000');
      cy.getOur('pair-form-deposit-input').should('have.value', '0.2500000');
    });
    it('verifies that continuation of swap is not possible if fields are not filled in to minimum', () => {
      cy.getOur('shapeshift-assetSelectionContinueButton').click();
      cy.getOur('shapeshift-minimumAmountWarning').should('be.visible');
    });
    it('verifies that desposit coin selection takes you to appropraite screen on click', () => {
      cy.getOur('shapeshift-depositAssetSelection').click();
      cy.getOur('shapeshift-assetForm').should('be.visible');
    });
    it('verifies that withdraw coin selection takes you to appropraite screen on click', () => {
      cy.getOur('shapeshift-withdrawAssetSelection').click();
      cy.getOur('shapeshift-assetForm').should('be.visible');
    });
    it('automatically inputs an asset name into the search deposit asset field', () => {
      cy.getOur('shapeshift-depositAssetSelection').click();
      cy.getOur('shapeshift-searchAssetField').type('ETH');
      cy.getOur('shapeshift-assetSelectionAssetOption-ETH').should('be.visible');
    });
    it('automatically inputs an asset name into the search withdraw asset field', () => {
      cy.getOur('shapeshift-withdrawAssetSelection').click();
      cy.getOur('shapeshift-searchAssetField').type('ETH');
      cy.getOur('shapeshift-assetSelectionAssetOption-ETH').should('be.visible');
    });
    it('automatically inputs invalid value into the search asset field', () => {
      cy.getOur('shapeshift-withdrawAssetSelection').click();
      cy.getOur('shapeshift-searchAssetField').type('TEST');
      cy.getOur('shapeshift-invalidAssetSeachValue').should('be.visible');
    });
    it('verifies that the correct deposit asset is selected in main pair form window', () => {
      cy.getOur('shapeshift-withdrawAssetSelection').click();
      cy.getOur('shapeshift-assetSelectionAssetOption-ETH').click();
      //checking for correct values 
    })
  });
});

describe('0x Instant', () => {
  beforeEach(() => {
    cy.goToSwap();
    cy.getOur('zeroex-option').click();
  });

  it('should render the widget', () => cy.get('.zeroExInstantMainContainer').should('be.visible'));
});
