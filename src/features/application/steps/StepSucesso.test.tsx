import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StepSucesso } from './StepSucesso';

describe('StepSucesso', () => {
  it('renders success title', () => {
    render(<StepSucesso onReset={vi.fn()} />);
    
    expect(screen.getByText('Inscrição enviada com sucesso!')).toBeInTheDocument();
  });

  it('renders success message', () => {
    render(<StepSucesso onReset={vi.fn()} />);
    
    expect(screen.getByText(/Obrigado por se candidatar/)).toBeInTheDocument();
  });

  it('renders reset button', () => {
    render(<StepSucesso onReset={vi.fn()} />);
    
    expect(screen.getByRole('button', { name: 'Voltar ao início' })).toBeInTheDocument();
  });

  it('calls onReset when button is clicked', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    
    render(<StepSucesso onReset={onReset} />);
    
    await user.click(screen.getByRole('button', { name: 'Voltar ao início' }));
    
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('renders success icon', () => {
    render(<StepSucesso onReset={vi.fn()} />);
    
    // Check for the green checkmark icon container
    const iconContainer = document.querySelector('.bg-green-100');
    expect(iconContainer).toBeInTheDocument();
  });
});
