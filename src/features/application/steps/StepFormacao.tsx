import { useFormContext, Controller } from 'react-hook-form';
import { TextInput, RadioGroup, Select } from '../../../components/FormFields';
import type { ApplicationFormData } from '../types';
import { PERIOD_OPTIONS, SHIFT_OPTIONS, MONTHS } from '../types';

export function StepFormacao() {
  const { register, control, formState: { errors } } = useFormContext<ApplicationFormData>();

  const periodOptions = PERIOD_OPTIONS.map(p => ({ value: p, label: p }));
  const shiftOptions = SHIFT_OPTIONS.map(s => ({ value: s, label: s }));

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Formação Acadêmica
      </h2>

      <TextInput
        label="Instituição de ensino"
        {...register('institution')}
        error={errors.institution?.message}
        required
        placeholder="Ex: Universidade de Brasília"
      />

      <TextInput
        label="Curso"
        {...register('course')}
        error={errors.course?.message}
        required
        placeholder="Ex: Ciência da Computação"
      />

      <Controller
        name="current_period"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Período atual / semestre"
            options={periodOptions}
            value={field.value}
            onValueChange={field.onChange}
            error={errors.current_period?.message}
            required
          />
        )}
      />

      <Controller
        name="study_shift"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Turno de estudo"
            options={shiftOptions}
            value={field.value}
            onValueChange={field.onChange}
            error={errors.study_shift?.message}
            required
          />
        )}
      />

      <div className="mt-6 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Indique o mês e o ano previstos para a formatura
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="graduation_month"
            control={control}
            render={({ field }) => (
              <Select
                label="Mês previsto"
                options={MONTHS}
                value={field.value?.toString() || ''}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
              />
            )}
          />

          <TextInput
            label="Ano previsto"
            type="number"
            {...register('graduation_year', { valueAsNumber: true })}
            placeholder="Ex: 2026"
            min={2024}
            max={2035}
          />
        </div>
      </div>
    </div>
  );
}
