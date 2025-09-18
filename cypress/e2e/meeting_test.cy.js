// cypress/e2e/meetings.spec.js

import MeetingsPage from '../pageObjects/MeetingsPage';

describe('Meetings Functionality', () => {
  const page = new MeetingsPage();
  const today = '2025-09-01';
  const tomorrow = '2025-09-02';
  const pastDate = '2025-08-01';

  before(() => {
    // Load fixture and login once before all tests
    cy.fixture('test_data.json').then((user) => {
      cy.login(user.username, user.password);
    });
  });

  beforeEach(() => {
    // Just set up page and intercepts - session persists login
    page.visit(); // Uses sidebar navigation
    cy.intercept('POST', '/api/meetings').as('createMeeting');
    cy.intercept('DELETE', '/api/meetings/*').as('deleteMeeting');
  });

  // Core Scenarios
  it('schedules a valid meeting', () => {
    page.scheduleMeeting({
      title: 'Team Sync',
      startDate: today,
      startTime: '10:00',
      endTime: '11:00',
      guests: ['guest@example.com'],
      description: 'Discuss project updates',
    });
    cy.wait('@createMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting scheduled successfully').should('be.visible');
    page.getMeetingListItem('Team Sync').should('be.visible');
  });

  it('schedules a meeting without guests', () => {
    page.scheduleMeeting({
      title: 'Solo Meeting',
      startDate: today,
      startTime: '12:00',
      endTime: '13:00',
    });
    cy.wait('@createMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting scheduled successfully').should('be.visible');
  });

  it('schedules a recurring meeting', () => {
    page.scheduleMeeting({
      title: 'Weekly Sync',
      startDate: today,
      startTime: '14:00',
      endTime: '15:00',
      recurrence: 'weekly',
    });
    cy.wait('@createMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting scheduled successfully').should('be.visible');
  });

  // Edge Cases
  it('fails on empty title', () => {
    page.scheduleMeeting({
      title: '',
      startDate: today,
      startTime: '10:00',
      endTime: '11:00',
    });
    page.getErrorMessage().should('contain', 'Title is required');
  });

  it('fails on invalid time range', () => {
    page.scheduleMeeting({
      title: 'Invalid Time',
      startDate: today,
      startTime: '11:00',
      endTime: '10:00',
    });
    page.getErrorMessage().should('contain', 'End time must be after start');
  });

  it('fails on past date', () => {
    page.scheduleMeeting({
      title: 'Past Meeting',
      startDate: pastDate,
      startTime: '10:00',
      endTime: '11:00',
    });
    page.getErrorMessage().should('contain', 'Cannot schedule in the past');
  });

  it('fails on invalid guest email', () => {
    page.scheduleMeeting({
      title: 'Invalid Guest',
      startDate: today,
      startTime: '10:00',
      endTime: '11:00',
      guests: ['invalid'],
    });
    page.getErrorMessage().should('contain', 'Invalid email');
  });

  it('handles maximum guests (assuming limit of 100)', () => {
    const guests = Array.from({ length: 100 }, (_, i) => `guest${i}@example.com`);
    page.scheduleMeeting({
      title: 'Large Meeting',
      startDate: today,
      startTime: '10:00',
      endTime: '11:00',
      guests,
    });
    cy.wait('@createMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting scheduled successfully').should('be.visible');
  });

  it('fails on exceeding maximum guests', () => {
    const guests = Array.from({ length: 101 }, (_, i) => `guest${i}@example.com`);
    page.scheduleMeeting({
      title: 'Too Many Guests',
      startDate: today,
      startTime: '10:00',
      endTime: '11:00',
      guests,
    });
    page.getErrorMessage().should('contain', 'Maximum guests exceeded');
  });

  it('handles maximum title length (assuming 255 chars)', () => {
    const longTitle = 'A'.repeat(255);
    page.scheduleMeeting({
      title: longTitle,
      startDate: today,
      startTime: '10:00',
      endTime: '11:00',
    });
    cy.wait('@createMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting scheduled successfully').should('be.visible');
  });

  it('fails on title exceeding maximum length', () => {
    const longTitle = 'A'.repeat(256);
    page.scheduleMeeting({
      title: longTitle,
      startDate: today,
      startTime: '10:00',
      endTime: '11:00',
    });
    page.getErrorMessage().should('contain', 'Title too long');
  });

  it('handles special characters in title', () => {
    page.scheduleMeeting({
      title: 'Meeting @#$%^&*()',
      startDate: today,
      startTime: '10:00',
      endTime: '11:00',
    });
    cy.wait('@createMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting scheduled successfully').should('be.visible');
  });

  it('fails on overlapping meeting', () => {
    page.scheduleMeeting({
      title: 'First Meeting',
      startDate: today,
      startTime: '10:00',
      endTime: '11:00',
    });
    cy.wait('@createMeeting');
    page.scheduleMeeting({
      title: 'Overlap Meeting',
      startDate: today,
      startTime: '10:30',
      endTime: '11:30',
    });
    page.getErrorMessage().should('contain', 'Meeting time conflicts');
  });

  it('cancels meeting form without saving', () => {
    page.getScheduleButton().click();
    page.getTitleInput().type('Test Meeting');
    page.cancelMeetingForm();
    cy.contains('Test Meeting').should('not.exist');
  });

  it('deletes a scheduled meeting', () => {
    page.scheduleMeeting({
      title: 'Meeting to Delete',
      startDate: today,
      startTime: '10:00',
      endTime: '11:00',
    });
    cy.wait('@createMeeting');
    page.deleteMeeting('Meeting to Delete');
    cy.wait('@deleteMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting to Delete').should('not.exist');
  });

  it('handles multi-day meeting', () => {
    page.scheduleMeeting({
      title: 'Multi-day Meeting',
      startDate: today,
      startTime: '10:00',
      endDate: tomorrow,
      endTime: '10:00',
    });
    cy.wait('@createMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting scheduled successfully').should('be.visible');
  });

  it('fails on invalid time format', () => {
    page.scheduleMeeting({
      title: 'Invalid Time',
      startDate: today,
      startTime: '25:00',
      endTime: '11:00',
    });
    page.getErrorMessage().should('contain', 'Invalid time format');
  });

  // Additional Input Validation Tests for Typed Inputs
  it('fails on invalid date format', () => {
    page.scheduleMeeting({
      title: 'Invalid Date',
      startDate: '2025/13/01', // Invalid month
      startTime: '10:00',
      endTime: '11:00',
    });
    page.getErrorMessage().should('contain', 'Invalid date format');
  });

  it('fails on invalid date format - wrong separator', () => {
    page.scheduleMeeting({
      title: 'Wrong Date Format',
      startDate: '2025.09.01', // Wrong separator
      startTime: '10:00',
      endTime: '11:00',
    });
    page.getErrorMessage().should('contain', 'Invalid date format');
  });

  it('fails on invalid time format - missing colon', () => {
    page.scheduleMeeting({
      title: 'Invalid Time Format',
      startDate: today,
      startTime: '1000', // Missing colon
      endTime: '11:00',
    });
    page.getErrorMessage().should('contain', 'Invalid time format');
  });

  it('fails on invalid time format - invalid minutes', () => {
    page.scheduleMeeting({
      title: 'Invalid Minutes',
      startDate: today,
      startTime: '10:70', // Invalid minutes
      endTime: '11:00',
    });
    page.getErrorMessage().should('contain', 'Invalid time format');
  });

  it('fails on non-existent date', () => {
    page.scheduleMeeting({
      title: 'Non-existent Date',
      startDate: '2025-02-30', // February 30th doesn't exist
      startTime: '10:00',
      endTime: '11:00',
    });
    page.getErrorMessage().should('contain', 'Invalid date');
  });

  it('handles leap year date correctly', () => {
    page.scheduleMeeting({
      title: 'Leap Year Meeting',
      startDate: '2024-02-29', // Valid leap year date
      startTime: '10:00',
      endTime: '11:00',
    });
    cy.wait('@createMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting scheduled successfully').should('be.visible');
  });

  it('fails on leap year date in non-leap year', () => {
    page.scheduleMeeting({
      title: 'Invalid Leap Year',
      startDate: '2023-02-29', // 2023 is not a leap year
      startTime: '10:00',
      endTime: '11:00',
    });
    page.getErrorMessage().should('contain', 'Invalid date');
  });

  it('handles different time formats (12-hour with AM/PM)', () => {
    page.scheduleMeeting({
      title: '12-hour Format',
      startDate: today,
      startTime: '2:00 PM',
      endTime: '3:00 PM',
    });
    cy.wait('@createMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting scheduled successfully').should('be.visible');
  });

  it('handles midnight times', () => {
    page.scheduleMeeting({
      title: 'Midnight Meeting',
      startDate: today,
      startTime: '00:00',
      endTime: '01:00',
    });
    cy.wait('@createMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting scheduled successfully').should('be.visible');
  });

  it('handles end-of-day times', () => {
    page.scheduleMeeting({
      title: 'Late Meeting',
      startDate: today,
      startTime: '23:00',
      endTime: '23:59',
    });
    cy.wait('@createMeeting').its('response.statusCode').should('eq', 200);
    cy.contains('Meeting scheduled successfully').should('be.visible');
  });

  it('fails on empty date field', () => {
    page.scheduleMeeting({
      title: 'No Date',
      startDate: '',
      startTime: '10:00',
      endTime: '11:00',
    });
    page.getErrorMessage().should('contain', 'Date is required');
  });

  it('fails on empty time fields', () => {
    page.scheduleMeeting({
      title: 'No Time',
      startDate: today,
      startTime: '',
      endTime: '',
    });
    page.getErrorMessage().should('contain', 'Time is required');
  });

  it('handles partial time input gracefully', () => {
    page.scheduleMeeting({
      title: 'Partial Time',
      startDate: today,
      startTime: '10', // Just hour, no minutes
      endTime: '11:00',
    });
    // Should either auto-complete to '10:00' or show validation error
    // Depending on your app's behavior
  });
});