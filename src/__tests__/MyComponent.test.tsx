import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  test('muestra texto esperado', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hola Mundo')).toBeInTheDocument();
  });

  test('maneja evento click', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Clicked')).toBeInTheDocument();
  });
});
