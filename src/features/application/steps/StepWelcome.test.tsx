import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StepWelcome } from './StepWelcome';
import { AuthProvider } from '../../../lib/authContext';

const renderStepWelcome = (props = {}) => {
  const defaultProps = {
    onStart: vi.fn(),
    onOpenAuth: vi.fn(),
    ...props,
  };
  return render(
    <AuthProvider>
      <StepWelcome {...defaultProps} />
    </AuthProvider>
  );
};

describe('StepWelcome', () => {
  it('renders welcome title', () => {
    renderStepWelcome();
    
    expect(screen.getByText('Programa de Estágio')).toBeInTheDocument();
    expect(screen.getAllByText('GigaCandanga').length).toBeGreaterThan(0);
  });

  it('renders welcome subtitle', () => {
    renderStepWelcome();
    
    expect(screen.getByText(/Pronto para aprender na prática/)).toBeInTheDocument();
  });

  it('renders login button when not authenticated', async () => {
    renderStepWelcome();
    
    // Wait for auth loading to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Entrar / Cadastrar' })).toBeInTheDocument();
    });
  });

  it('calls onOpenAuth when login button is clicked', async () => {
    const user = userEvent.setup();
    const onOpenAuth = vi.fn();
    
    renderStepWelcome({ onOpenAuth });
    
    // Wait for auth loading to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Entrar / Cadastrar' })).toBeInTheDocument();
    });
    
    await user.click(screen.getByRole('button', { name: 'Entrar / Cadastrar' }));
    
    expect(onOpenAuth).toHaveBeenCalledTimes(1);
  });

  it('shows loading message for opportunities', () => {
    renderStepWelcome();
    
    expect(screen.getByText('Carregando oportunidades...')).toBeInTheDocument();
  });

  it('shows message when no opportunities available', async () => {
    renderStepWelcome();
    
    // Wait for loading to finish (mock returns empty array)
    await waitFor(() => {
      expect(screen.getByText(/Nenhuma oportunidade aberta no momento/)).toBeInTheDocument();
    });
  });
});
