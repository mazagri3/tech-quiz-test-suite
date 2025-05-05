import React from 'react'
import Quiz from '../../client/src/components/Quiz'
import questions from '../fixtures/questions.json'

describe('Quiz Component', () => {
  beforeEach(() => {
    // Mock the API call
    cy.intercept('GET', '/api/questions', questions).as('getQuestions')
  })

  it('should render the start button initially', () => {
    cy.mount(<Quiz />)
    cy.get('button').should('contain', 'Start Quiz')
  })

  it('should start the quiz when clicking the start button', () => {
    cy.mount(<Quiz />)
    cy.get('button').click()
    cy.wait('@getQuestions')
    cy.get('h2').should('contain', 'What is React?')
  })

  it('should show loading state while fetching questions', () => {
    cy.intercept('GET', '/api/questions', {
      delay: 1000,
      fixture: 'questions.json'
    }).as('getQuestionsDelayed')
    
    cy.mount(<Quiz />)
    cy.get('button').click()
    cy.get('.spinner-border').should('be.visible')
  })

  it('should update score when selecting correct answer', () => {
    cy.mount(<Quiz />)
    cy.get('button').click()
    cy.wait('@getQuestions')
    
    // Click the correct answer (first answer)
    cy.get('.btn-primary').first().click()
    
    // Move to next question
    cy.get('h2').should('contain', 'What is JSX?')
  })

  it('should show final score when quiz is completed', () => {
    cy.mount(<Quiz />)
    cy.get('button').click()
    cy.wait('@getQuestions')
    
    // Answer all questions
    cy.get('.btn-primary').first().click() // Correct answer
    cy.get('.btn-primary').first().click() // Correct answer
    
    // Check final score
    cy.get('.alert-success').should('contain', '2/2')
  })

  it('should allow starting a new quiz after completion', () => {
    cy.mount(<Quiz />)
    cy.get('button').click()
    cy.wait('@getQuestions')
    
    // Complete the quiz
    cy.get('.btn-primary').first().click()
    cy.get('.btn-primary').first().click()
    
    // Start new quiz
    cy.get('button').contains('Take New Quiz').click()
    cy.wait('@getQuestions')
    cy.get('h2').should('contain', 'What is React?')
  })
}) 