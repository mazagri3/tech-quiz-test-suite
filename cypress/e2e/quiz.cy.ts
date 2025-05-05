describe('Quiz Application', () => {
  beforeEach(() => {
    // Start the application
    cy.visit('/')
  })

  it('should display the start button on initial load', () => {
    cy.get('button').should('contain', 'Start Quiz')
  })

  it('should start the quiz and display the first question', () => {
    cy.get('button').click()
    cy.get('h2').should('be.visible')
    cy.get('.alert-secondary').should('have.length.at.least', 1)
  })

  it('should progress through questions when answering', () => {
    cy.get('button').click()
    
    // Answer first question
    cy.get('.btn-primary').first().click()
    
    // Verify we moved to next question
    cy.get('h2').should('not.contain', 'What is React?')
  })

  it('should show final score after completing all questions', () => {
    cy.get('button').click()
    
    // Answer all questions
    cy.get('.btn-primary').first().click()
    cy.get('.btn-primary').first().click()
    
    // Check final score display
    cy.get('.alert-success').should('be.visible')
    cy.get('button').should('contain', 'Take New Quiz')
  })

  it('should allow starting a new quiz after completion', () => {
    cy.get('button').click()
    
    // Complete the quiz
    cy.get('.btn-primary').first().click()
    cy.get('.btn-primary').first().click()
    
    // Start new quiz
    cy.get('button').contains('Take New Quiz').click()
    cy.get('h2').should('be.visible')
  })

  it('should handle loading state while fetching questions', () => {
    cy.intercept('GET', '/api/questions', {
      delay: 1000,
      fixture: 'questions.json'
    }).as('getQuestionsDelayed')
    
    cy.get('button').click()
    cy.get('.spinner-border').should('be.visible')
    cy.wait('@getQuestionsDelayed')
    cy.get('h2').should('be.visible')
  })
}) 