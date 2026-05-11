import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the piket schedule title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Jadwal Piket Kantor/i);
  expect(titleElement).toBeInTheDocument();
});
