describe('The Workspace Overview Page', function() {
  beforeEach('login', function() {
    cy.login('admin')
  })

  it('successfully loads', function() {
    cy.server()

    cy.route('GET', /\/workspaces/).as('getWorkspace')

    cy.visit('/workspaces/e2e-test/base-info')

    cy.wait('@getWorkspace')
  })
})
