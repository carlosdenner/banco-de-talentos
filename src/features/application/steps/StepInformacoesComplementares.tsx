import { useFormContext, Controller } from 'react-hook-form';
import { TextInput, TextArea, RadioGroup, FileUpload, SectionHeader } from '../../../components/FormFields';
import type { ApplicationFormData } from '../types';
import { HOW_DID_YOU_HEAR_OPTIONS } from '../types';

interface StepInformacoesComplementaresProps {
  onOpenPrivacyPolicy?: () => void;
}

export function StepInformacoesComplementares({ onOpenPrivacyPolicy }: StepInformacoesComplementaresProps) {
  const { register, control, formState: { errors }, watch, setValue } = useFormContext<ApplicationFormData>();
  const howDidYouHear = watch('how_did_you_hear');
  const cvUrl = watch('cv_url');

  const howDidYouHearOptions = [
    ...HOW_DID_YOU_HEAR_OPTIONS.map(o => ({ value: o, label: o })),
    { value: 'Outro', label: 'Outro' },
  ];

  return (
    <div>
      <SectionHeader 
        icon="📎" 
        title="Informações Complementares" 
        subtitle="Últimos detalhes e seu currículo"
      />

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

      {/* LGPD Consent */}
      <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register('lgpd_consent')}
            className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-500 dark:bg-slate-600"
          />
          <span className="text-sm text-slate-700 dark:text-slate-300">
            Li e aceito a{' '}
            <button
              type="button"
              onClick={onOpenPrivacyPolicy}
              className="text-primary dark:text-blue-400 underline hover:text-primary-dark font-medium"
            >
              Política de Privacidade
            </button>{' '}
            e autorizo o tratamento dos meus dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD).
            <span className="text-red-500 ml-1">*</span>
          </span>
        </label>
        {errors.lgpd_consent && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.lgpd_consent.message}</p>
        )}
      </div>
    </div>
  );
}
