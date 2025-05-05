/// <reference types="cypress" />
/// <reference types="mocha" />
/// <reference types="cypress-xpath" />

describe('Quiz Component', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.intercept('GET', 'http://localhost:3003/api/questions', {
      fixture: 'questions.json',
      delay: 1000 // Add 1 second delay
    }).as('getQuestions');
  });

  it('should start the quiz and show the first question', () => {
    cy.log('Starting quiz test...');
    cy.get('button').contains('Start Quiz').click();
    
    // Wait for loading spinner
    cy.log('Waiting for loading spinner...');
    cy.get('.spinner-border', { timeout: 15000 }).should('be.visible');
    
    // Wait for questions to load
    cy.log('Waiting for questions to load...');
    cy.wait('@getQuestions');
    
    // Wait for spinner to disappear and question to appear
    cy.log('Waiting for spinner to disappear...');
    cy.get('.spinner-border', { timeout: 15000 }).should('not.exist');
    cy.get('h2').should('be.visible');
    cy.get('h2').should('contain', 'What is the correct way to declare a variable in JavaScript?');
  });

  it('should allow selecting an answer and show the next question', () => {
    cy.log('Starting answer selection test...');
    
    // Start the quiz
    cy.log('Starting quiz...');
    cy.get('button').contains('Start Quiz').click();
    
    // Wait for loading spinner and questions to load
    cy.log('Waiting for loading spinner and questions...');
    cy.get('.spinner-border', { timeout: 15000 }).should('be.visible');
    cy.wait('@getQuestions');
    
    // Wait for spinner to disappear and first question to appear
    cy.log('Waiting for spinner to disappear and first question...');
    cy.get('.spinner-border', { timeout: 15000 }).should('not.exist');
    cy.get('h2').should('be.visible').should('contain', 'What is the correct way to declare a variable in JavaScript?');
    
    // Select an answer using the button
    cy.log('Selecting answer...');
    cy.get('.btn-primary').first().click();
    
    // Wait for next question
    cy.log('Waiting for next question...');
    cy.get('h2').should('contain', 'Which of the following is not a JavaScript data type?');
  });

  it('should show the final score after completing the quiz', () => {
    cy.log('Starting quiz completion test...');
    cy.get('button').contains('Start Quiz').click();
    
    // Wait for loading spinner and questions to load
    cy.log('Waiting for loading spinner and questions...');
    cy.get('.spinner-border', { timeout: 15000 }).should('be.visible');
    cy.wait('@getQuestions');
    
    // Wait for spinner to disappear and first question to appear
    cy.log('Waiting for spinner to disappear and first question...');
    cy.get('.spinner-border', { timeout: 15000 }).should('not.exist');
    cy.get('h2').should('be.visible');
    
    // Answer all questions correctly
    cy.log('Answering questions...');
    // First question - "var x = 5;" is correct
    cy.get('.alert-secondary').contains('var x = 5;').parent().find('.btn-primary').click();
    // Second question - "Integer" is correct
    cy.get('.alert-secondary').contains('Integer').parent().find('.btn-primary').click();
    // Third question - "To enable strict mode..." is correct
    cy.get('.alert-secondary').contains('To enable strict mode').parent().find('.btn-primary').click();
    
    // Verify final score is shown
    cy.log('Verifying final score...');
    cy.get('h2').should('contain', 'Quiz Completed');
    cy.get('.alert-success').should('contain', 'Your score: 3/3');
  });

  it('should handle errors gracefully', () => {
    cy.log('Starting error handling test...');
    // Intercept the API call and force an error
    cy.intercept('GET', 'http://localhost:3003/api/questions', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
      delay: 2000  // Increase delay to ensure loading state is visible
    }).as('getQuestionsError');
    
    // Start the quiz
    cy.log('Starting quiz...');
    cy.get('button').contains('Start Quiz').click();
    
    // Verify loading state
    cy.log('Verifying loading state...');
    cy.get('.spinner-border', { timeout: 15000 }).should('be.visible');
    
    // Wait for error response
    cy.log('Waiting for error response...');
    cy.wait('@getQuestionsError');
    
    // Verify error state
    cy.log('Verifying error state...');
    cy.get('.alert-danger', { timeout: 15000 }).should('be.visible');
    cy.get('.alert-danger').should('contain', 'Failed to load questions');
    
    // Verify retry button is shown and works
    cy.log('Verifying retry button...');
    cy.get('button').contains('Try Again').should('be.visible').click();
    
    // Verify loading state after retry
    cy.log('Verifying loading state after retry...');
    cy.get('.spinner-border', { timeout: 15000 }).should('be.visible');
  });
}); 