// life-calendar-app/src/components/SearchBar.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  it('renders an input and a search button', () => {
    render(<SearchBar onSearch={jest.fn()} />);
    expect(screen.getByPlaceholderText(/Search by date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Search/i })).toBeInTheDocument();
  });

  it('updates query on input change', async () => {
    render(<SearchBar onSearch={jest.fn()} />);
    const input = screen.getByPlaceholderText(/Search by date/i);
    await userEvent.type(input, 'test query');
    expect(input).toHaveValue('test query');
  });

  it('calls onSearch with the query when submitted', async () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Search by date/i);
    await userEvent.type(input, '1990');

    const button = screen.getByRole('button', { name: /Search/i });
    await userEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('1990');
  });

  it('calls onSearch when form is submitted via Enter key', async () => {
    const mockOnSearch = jest.fn();
    render(<SearchBar onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText(/Search by date/i);
    await userEvent.type(input, 'content search{enter}');

    expect(mockOnSearch).toHaveBeenCalledWith('content search');
  });
});
