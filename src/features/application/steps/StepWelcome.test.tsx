import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StepWelcome } from './StepWelcome';

describe('StepWelcome', () => {
  it('renders welcome title', () => {
    render(<StepWelcome onStart={vi.fn()} />);
    
    expect(screen.getByText('Banco de Talentos – Estágio GigaCandanga')).toBeInTheDocument();
  });

  it('renders welcome subtitle', () => {
    render(<StepWelcome onStart={vi.fn()} />);
    
    expect(screen.getByText(/Em busca de uma oportunidade/)).toBeInTheDocument();
  });

  it('renders start button', () => {
    render(<StepWelcome onStart={vi.fn()} />);
    
    expect(screen.getByRole('button', { name: 'Começar' })).toBeInTheDocument();
  });

  it('calls onStart when button is clicked', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    
    render(<StepWelcome onStart={onStart} />);
    
    await user.click(screen.getByRole('button', { name: 'Começar' }));
    
    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
