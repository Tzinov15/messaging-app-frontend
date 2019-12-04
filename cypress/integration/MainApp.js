/// <reference types="Cypress" />

context("Files", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("should allow me to see a header", () => {
    // Verify the app started up, rendered a header, and rendered a random username
    cy.get("header").should("exist");
    cy.get("[data-testid=random-username]").should("not.be.empty");

    // Verify a server avatar exists (tests the backend functionality of allowing the server to be a client to be talked to)
    cy.get("[data-testid=user-avatar-SERVER]")
      .as("serverAvatar")
      .should("exist");

    // Verify Chat section does NOT show up until you've clicked on a active recipient
    cy.get("[data-testid=user-chat-section]").should("not.exist");
    cy.get("@serverAvatar").click();
    cy.get("[data-testid=user-chat-section]").should("exist");

    // Send a message, verify that the server responds (this exercises the backend socket messaging-sending logic)
    // Also verifies if the UI correctly renders the message that came back from the server
    cy.get("[data-testid=chat-input]").type("Hello there server");
    cy.get("[data-testid=chat-button-submit]").click();
    cy.get("[data-testid=message-board").should("contain", "Hi I'm the server");
  });
});
