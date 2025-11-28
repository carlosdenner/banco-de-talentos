import { useFormContext, Controller } from 'react-hook-form';
import { TextArea, CheckboxGroup } from '../../../components/FormFields';
import type { ApplicationFormData } from '../types';
import { INTEREST_AREAS_OPTIONS } from '../types';

export function StepAreasInteresse() {
  const { register, control, formState: { errors }, watch, setValue } = useFormContext<ApplicationFormData>();
  const interestOther = watch('interest_other');

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Áreas de Interesse
      </h2>

      <Controller
        name="interest_areas"
        control={control}
        render={({ field }) => (
          <CheckboxGroup
            label="Área(s) de interesse"
            options={INTEREST_AREAS_OPTIONS}
            value={field.value}
            onValueChange={field.onChange}
            error={errors.interest_areas?.message}
            required
            showOther
            otherValue={interestOther}
            onOtherChange={(value) => setValue('interest_other', value)}
          />
        )}
      />

      <TextArea
        label="O que mais te motiva a estagiar na GigaCandanga?"
        {...register('motivation')}
        error={errors.motivation?.message}
        required
        placeholder="Conte-nos o que te atrai na oportunidade..."
      />

      <TextArea
        label="Quais competências ou conhecimentos você acredita que pode contribuir com a equipe?"
        {...register('contributions')}
        error={errors.contributions?.message}
        required
        placeholder="Descreva suas habilidades e como pode agregar..."
      />
    </div>
  );
}
