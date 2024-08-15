import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Content from './Content'; // Adjust the import path based on your project structure

describe('Content Component Tests', () => {
  test('renders without crashing', () => {
    render(<Content />);
    expect(screen.getByText(/ป้อนคำถามที่คุณอยากทราบ หรือ เลือกตัวอย่างคำถามด้านล่าง/)).toBeInTheDocument();
  });

  test('contains the specific text', () => {
    render(<Content />);
    expect(screen.getByText(/ป้อนคำถามที่คุณอยากทราบ หรือ เลือกตัวอย่างคำถามด้านล่าง/)).toBeInTheDocument();
  });

  // Additional tests can be added here
});