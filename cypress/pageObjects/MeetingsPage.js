// cypress/support/pages/MeetingsPage.js

class MeetingsPage {
    // Navigation
    getSidebarMeetingsButton() {
      return cy.get('.lucide-video');
    }
  
    // Main Actions
    getScheduleButton() {
      return cy.get('.inline-flex');
    }
  
    // Form Inputs - Using your existing selectors with improvements
    getTitleInput() {
      return cy.get('.flex-col > :nth-child(1) > .relative > .peer');
    }
  
    getStartDateInput() {
      return cy.get('.gap-x-7 > :nth-child(1) > .min-h-\\[42px\\] > .relative > .peer');
    }
  
    // Time handling - Based on your note that time fields are dropdowns
    getStartTimeDropdown() {
      return cy.get(':nth-child(2) > .border-r-0 > .relative > .flex > select');
    }
  
    getEndTimeDropdown() {
      return cy.get(':nth-child(3) > .border-r-0 > .relative > .flex > select');
    }
  
    // Fallback for time inputs if they're text fields instead of dropdowns
    getStartTimeInput() {
      return cy.get(':nth-child(2) > .border-r-0 > .relative > .flex input');
    }
  
    getEndTimeInput() {
      return cy.get(':nth-child(3) > .border-r-0 > .relative > .flex input');
    }
  
    // Guest Management - Using existing data-test selectors
    getGuestsInput() {
      return cy.get('input[data-test="add-guest"]');
    }
  
    // Description - Using existing data-test selector
    getDescriptionTextarea() {
      return cy.get('textarea[data-test="description"]');
    }
  
    // Dropdowns - Based on your note about frequency, notification, visibility being dropdowns
    getRecurrenceDropdown() {
      return cy.get('select[data-test="recurrence"]');
    }
  
    getFrequencyDropdown() {
      return cy.get('select[data-test="frequency"]');
    }
  
    getNotificationDropdown() {
      return cy.get('select[data-test="notification"]');
    }
  
    getVisibilityDropdown() {
      return cy.get('select[data-test="visibility"]');
    }
  
    // Form Actions - Using existing data-test selectors
    getSaveButton() {
      return cy.get('button[data-test="save-meeting"]');
    }
  
    getCancelButton() {
      return cy.get('button[data-test="cancel-meeting"]');
    }
  
    // Feedback Messages - Using existing data-test selector
    getErrorMessage() {
      return cy.get('[data-test="error-message"]');
    }
  
    getSuccessMessage() {
      return cy.get('[data-test="success-message"]');
    }
  
    // Meeting List - Using existing data-test selectors
    getMeetingListItem(title) {
      return cy.get('[data-test="meeting-list"]').contains(title);
    }
  
    getDeleteMeetingButton(title) {
      return cy.get('[data-test="meeting-list"]')
        .contains(title)
        .parent()
        .find('button[data-test="delete-meeting"]');
    }
  
    // Confirmation Dialog
    getConfirmDeleteButton() {
      return cy.get('button[data-test="confirm-delete"]');
    }
  
    // Helper Methods
    visit() {
      cy.visit('');
      this.getSidebarMeetingsButton().click();
      cy.url().should('include', '/meetings');
    }
  
    // Smart time handling for both dropdowns and inputs
    setTime(timeSelector, time) {
      return timeSelector.then($el => {
        if ($el.is('select')) {
          // It's a dropdown
          cy.wrap($el).select(time);
        } else {
          // It's an input field
          cy.wrap($el).clear().type(time);
        }
      });
    }
  
    // Enhanced scheduling method with better error handling
    scheduleMeeting({
      title,
      startDate,
      startTime,
      endDate,
      endTime,
      guests = [],
      description = '',
      recurrence = 'none',
      frequency,
      notification,
      visibility
    }) {
      // Open form
      this.getScheduleButton().click();
  
      // Fill basic info with error handling
      if (title !== undefined) {
        if (title === '') {
          this.getTitleInput().clear();
        } else {
          this.getTitleInput().clear().type(title);
        }
      }
  
      if (startDate !== undefined) {
        if (startDate === '') {
          this.getStartDateInput().clear();
        } else {
          this.getStartDateInput().clear().type(startDate);
        }
      }
  
      // Handle start time - try dropdown first, fallback to input
      if (startTime !== undefined) {
        if (startTime === '') {
          // Clear the field
          this.getStartTimeDropdown().then($el => {
            if ($el.length) {
              cy.wrap($el).select('');
            } else {
              this.getStartTimeInput().clear();
            }
          });
        } else {
          // Set the time
          this.getStartTimeDropdown().then($el => {
            if ($el.length) {
              this.setTime(cy.wrap($el), startTime);
            } else {
              this.setTime(this.getStartTimeInput(), startTime);
            }
          });
        }
      }
  
      // Handle end time
      if (endTime !== undefined) {
        if (endTime === '') {
          this.getEndTimeDropdown().then($el => {
            if ($el.length) {
              cy.wrap($el).select('');
            } else {
              this.getEndTimeInput().clear();
            }
          });
        } else {
          this.getEndTimeDropdown().then($el => {
            if ($el.length) {
              this.setTime(cy.wrap($el), endTime);
            } else {
              this.setTime(this.getEndTimeInput(), endTime);
            }
          });
        }
      }
  
      // Add guests
      if (guests.length > 0) {
        guests.forEach(guest => {
          this.getGuestsInput().type(`${guest}{enter}`);
        });
      }
  
      // Fill description
      if (description) {
        this.getDescriptionTextarea().clear().type(description);
      }
  
      // Handle dropdowns if they exist
      if (recurrence && recurrence !== 'none') {
        this.getRecurrenceDropdown().select(recurrence);
      }
  
      if (frequency) {
        this.getFrequencyDropdown().select(frequency);
      }
  
      if (notification) {
        this.getNotificationDropdown().select(notification);
      }
  
      if (visibility) {
        this.getVisibilityDropdown().select(visibility);
      }
  
      // Submit form
      this.getSaveButton().click();
    }
  
    cancelMeetingForm() {
      this.getCancelButton().click();
    }
  
    deleteMeeting(title) {
      this.getDeleteMeetingButton(title).click();
      this.getConfirmDeleteButton().click();
    }
  
    // Validation helpers for your tests
    expectError(message) {
      this.getErrorMessage().should('contain', message);
    }
  
    expectSuccess(message = 'Meeting scheduled successfully') {
      this.getSuccessMessage().should('contain', message);
    }
  
    // Wait helpers
    waitForFormToLoad() {
      this.getTitleInput().should('be.visible');
      this.getSaveButton().should('be.visible');
    }
  }
  
  export default MeetingsPage;