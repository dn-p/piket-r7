import { render, screen } from '@testing-library/react';
import App from './App';

test('renders jadwal piket heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/jadwal piket kantor/i);
  expect(headingElement).toBeInTheDocument();
});
