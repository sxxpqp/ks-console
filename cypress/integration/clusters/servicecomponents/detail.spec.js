describe('The StorageClass Detail Page', function() {
  beforeEach('login', function() {
    cy.login('admin')
  })

  it('successfully loads', function() {
    cy.visit(`/components/kubesphere-system/ks-apiserver`)
    cy.get('[data-test="detail-title"]').contains('ks-apiserver')
    cy.get('.kubed-icon-pod')
      .its('length')
      .should('be.gt', 0)
  })
})
