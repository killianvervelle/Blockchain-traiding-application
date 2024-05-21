describe('React Router, assets and components Tests', () => {

  it('Checking PrivateRoute Component', () => {
    cy.visit('http://localhost:3000/dashboard').then(() => {
      // Checking if the PrivateRoute component is disabled if the user does not log into Keycloak.
      cy.get('canvas#monthly_transactions').should('not.exist'); 
    });
  });

  it('Checking Successful Login and Dashboard Rendering', () => {
    cy.visit('http://localhost:3000/dashboard').then(() => {
      // Clicking on the user dropdown and login button
      cy.get('a#userDropdown').click();
      cy.get('button.text-blue-800').click();
      // Typing in credentials and logging in
      cy.origin('http://localhost:8080', () => {
        cy.get('#username').type('killian.vervelle@master.hes-so.ch');
        cy.get('#password').type('kk');
        cy.get('#kc-login').click();
      });
      // Verifying if the Dashboard page is rendered after successful login
      cy.get('button.text-blue-800').contains('killian.vervelle@master.hes-so.ch');
      cy.get('canvas#monthly_transactions').should('exist');
    });
  });

  it('Checking PageNotFound Component for Unmapped URLs', () => {
    cy.visit('http://localhost:3000/dashboard').then(() => {
      // Checking if the PageNotFound component is mounted for unmapped URLs
      cy.visit('http://localhost:3000/unmapped-url');
      cy.get('h2.text-gray-600').contains('404').should('be.visible');
    });
  });

});

