import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Example } from './Example'; // Adjust the import path as necessary

describe('Example Component', () => {
    const defaultProps = {
        index: 1,
        text: 'Example Text',
        value: 'exampleValue',
        textFooter: 'Example Footer',
        icon: 'exampleIcon',
        color: 'blue',
        onClick: jest.fn(),
    };

    test('renders without crashing', () => {
        render(<Example {...defaultProps} />);
    });

    test('renders Card component', () => {
        render(<Example {...defaultProps} />);
        const cardElement = screen.getByText('Example Footer'); // Assuming Card is rendered as an article
        expect(cardElement).toBeInTheDocument();
    });

    test('renders CardHeader component', () => {
        render(<Example {...defaultProps} />);
        const cardHeaderElement = screen.getByText(/Example Text/i); // Replace with actual header text
        expect(cardHeaderElement).toBeInTheDocument();
    });

    test('renders CardMedia component', () => {
        render(<Example {...defaultProps} />);
        const cardMediaElement = screen.getByTestId('card-media-svg');
        expect(cardMediaElement).toBeInTheDocument();
    });

    test('renders CardContent component', () => {
        render(<Example {...defaultProps} />);
        const cardContentElement = screen.getByText(/Example Footer/i); // Replace with actual content text
        expect(cardContentElement).toBeInTheDocument();
    });

    test('renders CardActions component', () => {
        render(<Example {...defaultProps} />);
        const cardActionsElement = screen.getByRole('button', { name: /add to favorites/i }); // Use aria-label to target the specific button
        expect(cardActionsElement).toBeInTheDocument();
    });

    test('calls onClick with correct value', () => {
        render(<Example {...defaultProps} />);
        const buttonElement = screen.getByRole('button', { name: /add to favorites/i }); // Use aria-label to target the specific button
        fireEvent.click(buttonElement);
        expect(defaultProps.onClick).toHaveBeenCalledWith('exampleValue');
    });
});