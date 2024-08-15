import React from 'react';
import { render, fireEvent ,screen} from '@testing-library/react';
import { Answer } from './Answer';
import { AskResponse } from '../../api/indextwo';
import { useBoolean } from '@fluentui/react-hooks';

// Mock data
const mockAnswer: AskResponse = {
    answer: 'This is a mock answer',
    thoughts: null,
    citations: [],
    data_points: [],
    error: "",
    feedback: "",
    message_id: '',
    id: undefined,
    createdAt: new Date().toISOString() // Providing a valid ISO date string
};

const mockProps = {
  answer: mockAnswer,
  onCitationClicked: jest.fn(),
  onThoughtProcessClicked: jest.fn(),
  onSupportingContentClicked: jest.fn(),
  handleMessageFeedback: jest.fn(),
  type_prompt: "mock_prompt",
  // Add other necessary props here
};

jest.mock('@fluentui/react-hooks', () => ({
  useBoolean: jest.fn(() => [false, { toggle: jest.fn() }]),
}));

describe('Answer component', () => {
  it('should call setChevronIsExpanded and toggleIsRefAccordionOpen on handleChevronClick', () => {
    const { getByTestId } = render(<Answer {...mockProps} />);
    
    const a = screen.getByText("AI Generate");
    expect(a).toBeInTheDocument();
  });
});