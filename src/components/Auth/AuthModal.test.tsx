import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthModal } from './AuthModal';
import { AuthProvider } from '../../lib/authContext';

const renderAuthModal = (props = {}) => {
  return render(
    <AuthProvider>
      <AuthModal isOpen={true} onClose={vi.fn()} {...props} />
    </AuthProvider>
  );
};

describe('AuthModal', () => {
  it('renders nothing when closed', () => {
    render(
      <AuthProvider>
        <AuthModal isOpen={false} onClose={vi.fn()} />
      </AuthProvider>
    );
    
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument();
  });

  it('renders login form by default', () => {
    renderAuthModal();
    
    expect(screen.getByRole('heading', { name: 'Entrar' })).toBeInTheDocument();
    expect(screen.getByText('E-mail')).toBeInTheDocument();
    expect(screen.getByText('Senha')).toBeInTheDocument();
  });

  it('switches to register mode', async () => {
    const user = userEvent.setup();
    renderAuthModal();
    
    await user.click(screen.getByText('Cadastre-se'));
    
    expect(screen.getByRole('heading', { name: 'Criar Conta' })).toBeInTheDocument();
    expect(screen.getByText('Confirmar Senha')).toBeInTheDocument();
  });

  it('switches back to login mode', async () => {
    const user = userEvent.setup();
    renderAuthModal();
    
    await user.click(screen.getByText('Cadastre-se'));
    await user.click(screen.getByText('Entrar', { selector: 'button[type="button"]' }));
    
    expect(screen.queryByText('Confirmar Senha')).not.toBeInTheDocument();
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderAuthModal();
    
    await user.click(screen.getByText('Cadastre-se'));
    
    await user.type(screen.getByPlaceholderText('seu@email.com'), 'test@email.com');
    
    const passwordInputs = screen.getAllByPlaceholderText('••••••••');
    await user.type(passwordInputs[0], 'password123');
    await user.type(passwordInputs[1], 'differentpassword');
    
    await user.click(screen.getByRole('button', { name: 'Criar Conta' }));
    
    expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument();
  });

  it('shows error for short password', async () => {
    const user = userEvent.setup();
    renderAuthModal();
    
    await user.type(screen.getByPlaceholderText('seu@email.com'), 'test@email.com');
    await user.type(screen.getByPlaceholderText('••••••••'), '123');
    
    await user.click(screen.getByRole('button', { name: 'Entrar' }));
    
    expect(screen.getByText('A senha deve ter pelo menos 6 caracteres')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    
    render(
      <AuthProvider>
        <AuthModal isOpen={true} onClose={onClose} />
      </AuthProvider>
    );
    
    // Click the X button
    const closeButton = screen.getByRole('button', { name: '' });
    await user.click(closeButton);
    
    expect(onClose).toHaveBeenCalled();
  });
});
