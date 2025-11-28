import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders, userEvent } from '../../../test/testUtils';
import { StepDadosPessoais } from './StepDadosPessoais';

describe('StepDadosPessoais', () => {
  it('renders all required fields', () => {
    renderWithProviders(<StepDadosPessoais />);
    
    expect(screen.getByText('Nome completo')).toBeInTheDocument();
    expect(screen.getByText('Data de nascimento')).toBeInTheDocument();
    expect(screen.getByText('E-mail para contato')).toBeInTheDocument();
    expect(screen.getByText('Telefone (WhatsApp)')).toBeInTheDocument();
    expect(screen.getByText('Cidade onde você reside')).toBeInTheDocument();
  });

  it('renders step title', () => {
    renderWithProviders(<StepDadosPessoais />);
    
    expect(screen.getByText('Dados Pessoais')).toBeInTheDocument();
  });

  it('accepts input in all fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepDadosPessoais />);
    
    const nomeInput = screen.getByPlaceholderText('Seu nome completo');
    await user.type(nomeInput, 'João da Silva');
    expect(nomeInput).toHaveValue('João da Silva');

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    await user.type(emailInput, 'joao@email.com');
    expect(emailInput).toHaveValue('joao@email.com');

    const whatsappInput = screen.getByPlaceholderText('(61) 99999-9999');
    await user.type(whatsappInput, '61999999999');
    expect(whatsappInput).toHaveValue('61999999999');

    const cidadeInput = screen.getByPlaceholderText('Ex: Brasília - DF');
    await user.type(cidadeInput, 'Brasília - DF');
    expect(cidadeInput).toHaveValue('Brasília - DF');
  });
});
