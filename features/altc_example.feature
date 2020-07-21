Feature: Test out capabilities

  Background: Starting on home page
    Given I am on the example home page

  # Scenario: Load the app page
  #   Then I should see "Penzance Trains..."

  #Start adding the tests....
  # Scenario: Search for available tickets
  #   When I select "Penzance" on the from-station dropdown
  #   And I select "Redruth" on the to-station dropdown
  #   And I click the submit button on the Home page
  #   Then the results table should exist

  # Scenario: Search for available tickets without selecting arrival point
  #   When I select "Penzance" on the from-station dropdown
  #   And I click the submit button on the Home page
  #   Then the error "Error: Arrival Station Not Set" should display

  # Scenario: Search for available tickets without selecting departure point
  #   When I select "Redruth" on the to-station dropdown
  #   And I click the submit button on the Home page
  # Then the error "Error: Departure Station Not Set" should display

  Scenario: Search for available tickets for the same departure and destination
    When I select "Redruth" on the from-station dropdown
    And I select "Redruth" on the to-station dropdown
    And I click the submit button on the Home page
  Then the error "Error: Departure station cannot be the same as Arrival Station" should display
    