import { useFormContext, Controller } from 'react-hook-form';
import { TextInput, TextArea, RadioGroup, FileUpload } from '../../../components/FormFields';
import type { ApplicationFormData } from '../types';
import { HOW_DID_YOU_HEAR_OPTIONS } from '../types';

export function StepInformacoesComplementares() {
  const { register, control, formState: { errors }, watch, setValue } = useFormContext<ApplicationFormData>();
  const howDidYouHear = watch('how_did_you_hear');
  const cvUrl = watch('cv_url');

  const howDidYouHearOptions = [
    ...HOW_DID_YOU_HEAR_OPTIONS.map(o => ({ value: o, label: o })),
    { value: 'Outro', label: 'Outro' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Informações Complementares
      </h2>

      <FileUpload
        label="Anexar Currículo (CV)"
        value={cvUrl}
        onChange={(url) => setValue('cv_url', url || undefined)}
      />

      <TextArea
        label="Por fim, fique à vontade para adicionar algo mais ou compartilhar informações adicionais"
        {...register('extra_info')}
        placeholder="Informações adicionais que você gostaria de compartilhar..."
      />

      <Controller
        name="how_did_you_hear"
        control={control}
        render={({ field }) => (
          <RadioGroup
            label="Como ficou sabendo da GigaCandanga ou deste banco de talentos?"
            options={howDidYouHearOptions}
            value={field.value}
            onValueChange={field.onChange}
            error={errors.how_did_you_hear?.message}
            required
          />
        )}
      />

      {howDidYouHear === 'Outro' && (
        <TextInput
          label="Especifique"
          {...register('how_did_you_hear_other')}
          placeholder="Como você nos encontrou?"
        />
      )}
    </div>
  );
}
