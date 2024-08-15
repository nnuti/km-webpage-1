import React from 'react';
import { render } from '@testing-library/react';
import { AnswerIcon } from './AnswerIcon'; // Adjust the import path as necessary
import { Sparkle28Filled } from '@fluentui/react-icons';

describe('AnswerIcon', () => {
    it('should render Sparkle28Filled icon with correct properties', () => {
        const { container } = render(<AnswerIcon />);

        // Check if the Sparkle28Filled icon is rendered
        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();

        // Check if the icon has the correct primaryFill color
        // expect(icon).toHaveAttribute('primaryFill', 'rgba(84, 166, 233, 1)');

        // Check if the icon has the correct aria attributes
        expect(icon).toHaveAttribute('aria-hidden', 'true');
        expect(icon).toHaveAttribute('aria-label', 'Answer logo');

        // Check if the icon has the correct style
        expect(icon).toHaveStyle('width: 20px');
    });
});