declare namespace Cypress {
  interface Chainable {
    intercept(url: string, response?: any): Chainable;
  }
} 