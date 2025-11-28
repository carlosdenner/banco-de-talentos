import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup } from './RadioGroup';

const options = [
  { value: 'matutino', label: 'Matutino' },
  { value: 'vespertino', label: 'Vespertino' },
  { value: 'noturno', label: 'Noturno' },
];

describe('RadioGroup', () => {
  it('renders all options', () => {
    render(<RadioGroup label="Turno" options={options} />);
    
    expect(screen.getByText('Matutino')).toBeInTheDocument();
    expect(screen.getByText('Vespertino')).toBeInTheDocument();
    expect(screen.getByText('Noturno')).toBeInTheDocument();
  });

  it('shows selected value', () => {
    render(<RadioGroup label="Turno" options={options} value="noturno" />);
    
    const noturnoRadio = screen.getByLabelText('Noturno');
    expect(noturnoRadio).toBeChecked();
  });

  it('calls onValueChange when option is selected', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    
    render(
      <RadioGroup 
        label="Turno" 
        options={options} 
        onValueChange={onValueChange}
        name="turno"
      />
    );
    
    await user.click(screen.getByLabelText('Vespertino'));
    
    expect(onValueChange).toHaveBeenCalledWith('vespertino');
  });

  it('displays error message', () => {
    render(<RadioGroup label="Turno" options={options} error="Selecione uma opção" />);
    expect(screen.getByText('Selecione uma opção')).toBeInTheDocument();
  });
});
