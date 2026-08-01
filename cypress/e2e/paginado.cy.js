describe('Paginado', () => {
  beforeEach(() => {
    cy.session('usuario-logueado', () => {
      cy.visit('http://localhost:3000/')

      cy.get('input[name=username]').type('analiahuarca')
      cy.get('input[name=password]').type('12345678')
      cy.contains('button', 'Iniciar sesión').click()

      cy.contains('¡Listo! Iniciaste sesión correctamente').should('be.visible')

      cy.url({ timeout: 10000 }).should('include', '/reserva-de-turnos')
    })
  })

  it('Pagina', () => {
    cy.intercept('GET', '**/turnos?*').as('getTurnos')
    cy.visit('http://localhost:3000/reserva-de-turnos')
    cy.wait('@getTurnos')

    cy.get('.servicios-container .tabla-container .servicios-table').should('exist')
    cy.get('.servicios-table tbody tr').should('have.length', 15)
  })

  it('Cambia a la página 3 y muestra el servicio correcto', () => {
    cy.intercept('GET', 'http://localhost:3001/turnos*').as('getTurnos')
    cy.visit('http://localhost:3000/reserva-de-turnos')
    cy.wait('@getTurnos')

    cy.intercept('GET', '**/turnos*page=3*').as('getTurnosPagina3')
    cy.get('.paginacion button').contains(/^3$/).click()
    cy.wait('@getTurnosPagina3')

    cy.get('.servicios-table tbody tr')
      .first()
      .find('td')
      .first()
      .should('have.text', 'Electrocardiograma')
  })
})
