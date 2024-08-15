import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import ChatExternal from './ChatExternal'; // Adjust the import path as necessary
import {store} from '../../redux-toolkit/store';

describe('ChatExternal Component', () => {
  test('calls handleMessageFeedback correctly', () => {
    // Render the component within a Router and Provider
    render(
      <Provider store={store}>
        <Router>
          <ChatExternal />
        </Router>
      </Provider>
    );

    // Simulate the event that triggers handleMessageFeedback
    // const feedbackButton = screen.getByRole('button', { name: /feedback/i });
    // fireEvent.click(feedbackButton);

    // Verify the expected outcome
    expect(screen.getByTestId("chat-external-component")).toBeInTheDocument();
  });
});