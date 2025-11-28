import { useFormContext, Controller } from 'react-hook-form';
import { TextArea, RadioGroup, SectionHeader } from '../../../components/FormFields';
import type { ApplicationFormData } from '../types';

export function StepExperienciasHabilidades() {
  const { register, control, formState: { errors } } = useFormContext<ApplicationFormData>();

  const experienceOptions = [
    { value: 'true', label: 'Sim' },
    { value: 'false', label: 'Não' },
  ];

  return (
    <div>
      <SectionHeader 
        icon="💼" 
        title="Experiências e Habilidades" 
        subtitle="Suas competências técnicas"
      />

      <TextArea
        label="Liste ferramentas, linguagens ou softwares que domina ou tem familiaridade"
        {...register('tools')}
        placeholder="Ex: Excel, Python, Photoshop, Power BI, etc."
      />

      <Controller
        name="has_experience"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Você já teve alguma experiência anterior?"
            options={experienceOptions}
            value={field.value?.toString()}
            onValueChange={(value) => field.onChange(value === 'true')}
            error={errors.has_experience?.message}
            required
          />
        )}
      />
    </div>
  );
}
