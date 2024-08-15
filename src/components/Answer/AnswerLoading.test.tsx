import React from 'react';
import { render } from '@testing-library/react';
import { AnswerLoading } from './AnswerLoading'; // Adjust the import path as necessary

describe('AnswerLoading', () => {
    it('should render correctly', () => {
        const { getByText, container } = render(<AnswerLoading />);

        // Check if the text "Generating answer" is rendered
        expect(getByText('Generating answer')).toBeInTheDocument();

        // Check if the AnswerIcon component is rendered
        expect(container.querySelector('svg')).toBeInTheDocument();

        // Check if the loading dots span is rendered
        expect(container.querySelector('.loadingdots')).toBeInTheDocument();
    });

    it('should apply animation styles', () => {
        const { container } = render(<AnswerLoading />);

        // Check if the animated div has the correct styles
        const animatedDiv = container.querySelector('div');
        expect(animatedDiv).toHaveStyle('opacity: 0');
    });
});