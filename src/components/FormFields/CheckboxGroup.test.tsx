import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CheckboxGroup } from './CheckboxGroup';

const options = [
  'Tecnologia da Informação',
  'Desenvolvimento de Software',
  'Administração',
];

describe('CheckboxGroup', () => {
  it('renders all options', () => {
    render(<CheckboxGroup label="Áreas de interesse" options={options} />);
    
    options.forEach(option => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('shows selected values', () => {
    render(
      <CheckboxGroup 
        label="Áreas" 
        options={options} 
        value={['Tecnologia da Informação', 'Administração']} 
      />
    );
    
    expect(screen.getByLabelText('Tecnologia da Informação')).toBeChecked();
    expect(screen.getByLabelText('Administração')).toBeChecked();
    expect(screen.getByLabelText('Desenvolvimento de Software')).not.toBeChecked();
  });

  it('calls onValueChange when checkbox is toggled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    
    render(
      <CheckboxGroup 
        label="Áreas" 
        options={options}
        value={[]}
        onValueChange={onValueChange}
      />
    );
    
    await user.click(screen.getByLabelText('Administração'));
    
    expect(onValueChange).toHaveBeenCalledWith(['Administração']);
  });

  it('removes value when unchecked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    
    render(
      <CheckboxGroup 
        label="Áreas" 
        options={options}
        value={['Administração']}
        onValueChange={onValueChange}
      />
    );
    
    await user.click(screen.getByLabelText('Administração'));
    
    expect(onValueChange).toHaveBeenCalledWith([]);
  });

  it('shows "Outra" option with text input when showOther is true', async () => {
    const user = userEvent.setup();
    const onOtherChange = vi.fn();
    
    render(
      <CheckboxGroup 
        label="Áreas" 
        options={options}
        value={['Outra']}
        showOther
        onOtherChange={onOtherChange}
      />
    );
    
    expect(screen.getByText('Outra')).toBeInTheDocument();
    
    const otherInput = screen.getByPlaceholderText('Especifique...');
    await user.type(otherInput, 'Marketing');
    
    expect(onOtherChange).toHaveBeenCalled();
  });
});
