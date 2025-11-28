import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextInput } from './TextInput';

describe('TextInput', () => {
  it('renders with label', () => {
    render(<TextInput label="Nome completo" />);
    expect(screen.getByText('Nome completo')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<TextInput label="E-mail" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    render(<TextInput label="Telefone" error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<TextInput label="Cidade" />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Brasília');
    
    expect(input).toHaveValue('Brasília');
  });

  it('applies error styling when error is present', () => {
    render(<TextInput label="Test" error="Error" />);
    const input = screen.getByRole('textbox');
    expect(input.className).toContain('border-red-500');
  });
});
