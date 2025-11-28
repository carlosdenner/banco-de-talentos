import { useFormContext, Controller } from 'react-hook-form';
import { TextInput, TextArea, RadioGroup, SectionHeader } from '../../../components/FormFields';
import type { ApplicationFormData } from '../types';
import { EXPERIENCE_TYPE_OPTIONS } from '../types';

export function StepDetalhesExperiencias() {
  const { register, control, formState: { errors }, watch } = useFormContext<ApplicationFormData>();
  const experienceType = watch('experience_type');

  const experienceTypeOptions = [
    ...EXPERIENCE_TYPE_OPTIONS.map(e => ({ value: e, label: e })),
    { value: 'Outro', label: 'Outro' },
  ];

  return (
    <div>
      <SectionHeader 
        icon="📋" 
        title="Detalhes das Experiências" 
        subtitle="Conte-nos sobre sua trajetória"
      />

      <Controller
        name="experience_type"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Tipo de experiência"
            options={experienceTypeOptions}
            value={field.value}
            onValueChange={field.onChange}
            error={errors.experience_type?.message}
            required
          />
        )}
      />

      {experienceType === 'Outro' && (
        <TextInput
          label="Especifique o tipo de experiência"
          {...register('experience_type_other')}
          placeholder="Descreva o tipo de experiência..."
        />
      )}

      <TextInput
        label="Nome da instituição / empresa / projeto"
        {...register('experience_org')}
        error={errors.experience_org?.message}
        required
        placeholder="Ex: Empresa XYZ"
      />

      <TextInput
        label="Período de atuação"
        {...register('experience_period')}
        error={errors.experience_period?.message}
        required
        placeholder="Ex: 03/2023 – 12/2023"
      />

      <TextArea
        label="Principais atividades realizadas"
        {...register('experience_activities')}
        error={errors.experience_activities?.message}
        required
        placeholder="Descreva suas principais atividades e responsabilidades..."
      />

      <TextArea
        label="O que você aprendeu ou desenvolveu nessa experiência?"
        {...register('experience_learnings')}
        error={errors.experience_learnings?.message}
        required
        placeholder="Conte o que você aprendeu e como cresceu..."
      />
    </div>
  );
}
