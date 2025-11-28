import { useFormContext } from 'react-hook-form';
import { TextInput, SectionHeader } from '../../../components/FormFields';
import type { ApplicationFormData } from '../types';

export function StepDadosPessoais() {
  const { register, formState: { errors } } = useFormContext<ApplicationFormData>();

  return (
    <div>
      <SectionHeader 
        icon="👤" 
        title="Dados Pessoais" 
        subtitle="Informações básicas sobre você"
      />
      
      <TextInput
        label="Nome completo"
        {...register('full_name')}
        error={errors.full_name?.message}
        required
        placeholder="Seu nome completo"
      />

      <TextInput
        label="Data de nascimento"
        type="date"
        {...register('birth_date')}
        error={errors.birth_date?.message}
        required
      />

      <TextInput
        label="E-mail para contato"
        type="email"
        {...register('email')}
        error={errors.email?.message}
        required
        placeholder="seu@email.com"
      />

      <TextInput
        label="Telefone (WhatsApp)"
        type="tel"
        {...register('whatsapp')}
        error={errors.whatsapp?.message}
        required
        placeholder="(61) 99999-9999"
      />

      <TextInput
        label="Cidade onde você reside"
        {...register('city')}
        error={errors.city?.message}
        required
        placeholder="Ex: Brasília - DF"
      />
    </div>
  );
}
