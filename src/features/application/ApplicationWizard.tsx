import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { Stepper } from '../../components/Stepper';
import {
  StepWelcome,
  StepDadosPessoais,
  StepFormacao,
  StepAreasInteresse,
  StepExperienciasHabilidades,
  StepDetalhesExperiencias,
  StepInformacoesComplementares,
  StepSucesso,
} from './steps';
import {
  stepDadosPessoaisSchema,
  stepFormacaoSchema,
  stepAreasInteresseSchema,
  stepExperienciasHabilidadesSchema,
  stepDetalhesExperienciasSchema,
  stepInformacoesComplementaresSchema,
} from './validation';
import type { ApplicationFormData, ApplicationDbPayload, ApplicationRecord } from './types';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../lib/authContext';

type Step = 'welcome' | 'dados' | 'formacao' | 'areas' | 'experiencias' | 'detalhes' | 'complementares' | 'sucesso';

const STEP_ORDER: Step[] = ['welcome', 'dados', 'formacao', 'areas', 'experiencias', 'detalhes', 'complementares', 'sucesso'];

const STEP_LABELS = [
  'Início',
  'Dados',
  'Formação',
  'Áreas',
  'Experiências',
  'Detalhes',
  'Envio',
];

const defaultValues: ApplicationFormData = {
  full_name: '',
  birth_date: '',
  email: '',
  whatsapp: '',
  city: '',
  institution: '',
  course: '',
  current_period: '',
  study_shift: '',
  interest_areas: [],
  motivation: '',
  contributions: '',
  has_experience: false,
  how_did_you_hear: '',
  lgpd_consent: false,
};

function getStepSchema(step: Step, hasExperience: boolean) {
  switch (step) {
    case 'dados':
      return stepDadosPessoaisSchema;
    case 'formacao':
      return stepFormacaoSchema;
    case 'areas':
      return stepAreasInteresseSchema;
    case 'experiencias':
      return stepExperienciasHabilidadesSchema;
    case 'detalhes':
      return hasExperience ? stepDetalhesExperienciasSchema : z.object({});
    case 'complementares':
      return stepInformacoesComplementaresSchema;
    default:
      return z.object({});
  }
}

function transformToDbPayload(data: ApplicationFormData): ApplicationDbPayload {
  return {
    full_name: data.full_name,
    birth_date: data.birth_date,
    email: data.email,
    whatsapp: data.whatsapp,
    city: data.city,
    institution: data.institution,
    course: data.course,
    current_period: data.current_period,
    study_shift: data.study_shift,
    graduation_month: data.graduation_month || null,
    graduation_year: data.graduation_year || null,
    interest_areas: data.interest_areas,
    interest_other: data.interest_other || null,
    motivation: data.motivation,
    contributions: data.contributions,
    tools: data.tools || null,
    has_experience: data.has_experience,
    experience_type: data.has_experience ? (data.experience_type === 'Outro' ? data.experience_type_other : data.experience_type) || null : null,
    experience_org: data.has_experience ? data.experience_org || null : null,
    experience_period: data.has_experience ? data.experience_period || null : null,
    experience_activities: data.has_experience ? data.experience_activities || null : null,
    experience_learnings: data.has_experience ? data.experience_learnings || null : null,
    extra_info: data.extra_info || null,
    how_did_you_hear: data.how_did_you_hear === 'Outro' ? data.how_did_you_hear_other || 'Outro' : data.how_did_you_hear,
    how_did_you_hear_other: data.how_did_you_hear === 'Outro' ? data.how_did_you_hear_other || null : null,
    cv_url: data.cv_url || null,
    lgpd_consent: data.lgpd_consent,
    lgpd_consent_date: data.lgpd_consent ? new Date().toISOString() : null,
    user_id: null, // Will be set in onSubmit
    opportunity_id: null, // Will be set in onSubmit
  };
}

function recordToFormData(record: ApplicationRecord): ApplicationFormData {
  return {
    full_name: record.full_name,
    birth_date: record.birth_date,
    email: record.email,
    whatsapp: record.whatsapp,
    city: record.city,
    institution: record.institution,
    course: record.course,
    current_period: record.current_period,
    study_shift: record.study_shift,
    graduation_month: record.graduation_month || undefined,
    graduation_year: record.graduation_year || undefined,
    interest_areas: record.interest_areas,
    interest_other: record.interest_other || undefined,
    motivation: record.motivation,
    contributions: record.contributions,
    tools: record.tools || undefined,
    has_experience: record.has_experience,
    experience_type: record.experience_type || undefined,
    experience_org: record.experience_org || undefined,
    experience_period: record.experience_period || undefined,
    experience_activities: record.experience_activities || undefined,
    experience_learnings: record.experience_learnings || undefined,
    extra_info: record.extra_info || undefined,
    how_did_you_hear: record.how_did_you_hear,
    how_did_you_hear_other: record.how_did_you_hear_other || undefined,
    cv_url: record.cv_url || undefined,
    lgpd_consent: record.lgpd_consent,
  };
}

interface ApplicationWizardProps {
  onOpenAuth?: () => void;
  onOpenPrivacyPolicy?: () => void;
}

export function ApplicationWizard({ onOpenAuth, onOpenPrivacyPolicy }: ApplicationWizardProps) {
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [existingApplicationId, setExistingApplicationId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const { user, isEmailConfirmed } = useAuth();

  const methods = useForm<ApplicationFormData>({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, trigger, watch, reset, getValues } = methods;
  const hasExperience = watch('has_experience');

  // Load existing application for logged-in users
  useEffect(() => {
    async function loadExistingApplication() {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error && data) {
        setExistingApplicationId(data.id);
        setIsEditMode(true);
        reset(recordToFormData(data as ApplicationRecord));
        setCurrentStep('dados'); // Skip welcome for edit mode
      }
    }
    
    loadExistingApplication();
  }, [user, reset]);

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);
  const totalSteps = 7; // Excluding welcome and success

  const getNextStep = (current: Step): Step => {
    const idx = STEP_ORDER.indexOf(current);
    // Skip 'detalhes' step if user has no experience
    if (STEP_ORDER[idx + 1] === 'detalhes' && !hasExperience) {
      return 'complementares';
    }
    return STEP_ORDER[idx + 1] || current;
  };

  const getPrevStep = (current: Step): Step => {
    const idx = STEP_ORDER.indexOf(current);
    // Skip 'detalhes' step if user has no experience
    if (STEP_ORDER[idx - 1] === 'detalhes' && !hasExperience) {
      return 'experiencias';
    }
    return STEP_ORDER[idx - 1] || current;
  };

  const handleNext = async () => {
    const schema = getStepSchema(currentStep, hasExperience);
    const fields = Object.keys(schema.shape) as (keyof ApplicationFormData)[];
    
    // Trigger react-hook-form validation
    const isValid = await trigger(fields);
    
    // Double-check with Zod schema validation
    const currentValues = getValues();
    const stepData: Record<string, unknown> = {};
    fields.forEach(field => {
      stepData[field] = currentValues[field];
    });
    const zodResult = schema.safeParse(stepData);
    
    if (isValid && zodResult.success) {
      if (currentStep === 'complementares') {
        // Submit the form
        handleSubmit(onSubmit)();
      } else {
        setCurrentStep(getNextStep(currentStep));
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(getPrevStep(currentStep));
  };

  const onSubmit = async (data: ApplicationFormData) => {
    // Block submission if user is logged in but email not confirmed
    if (user && !isEmailConfirmed) {
      setSubmitError('Por favor, confirme seu e-mail antes de enviar a inscrição. Verifique sua caixa de entrada.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = transformToDbPayload(data);
      payload.user_id = user?.id || null;
      payload.opportunity_id = selectedOpportunityId;
      
      let error;
      
      if (isEditMode && existingApplicationId) {
        // Update existing application
        const result = await supabase
          .from('applications')
          .update(payload)
          .eq('id', existingApplicationId);
        error = result.error;
      } else {
        // Insert new application
        const result = await supabase
          .from('applications')
          .insert(payload);
        error = result.error;
      }

      if (error) {
        console.error('Supabase error:', error);
        setSubmitError('Ocorreu um erro ao enviar sua inscrição. Por favor, tente novamente.');
      } else {
        setCurrentStep('sucesso');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setSubmitError('Ocorreu um erro ao enviar sua inscrição. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
    setCurrentStep('welcome');
    setSubmitError(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <StepWelcome 
            onStart={(opportunityId) => {
              setSelectedOpportunityId(opportunityId || null);
              setCurrentStep('dados');
            }} 
            onOpenAuth={onOpenAuth || (() => {})} 
          />
        );
      case 'dados':
        return <StepDadosPessoais />;
      case 'formacao':
        return <StepFormacao />;
      case 'areas':
        return <StepAreasInteresse />;
      case 'experiencias':
        return <StepExperienciasHabilidades />;
      case 'detalhes':
        return <StepDetalhesExperiencias />;
      case 'complementares':
        return <StepInformacoesComplementares onOpenPrivacyPolicy={onOpenPrivacyPolicy} />;
      case 'sucesso':
        return <StepSucesso onReset={handleReset} />;
      default:
        return null;
    }
  };

  const showStepper = currentStep !== 'welcome' && currentStep !== 'sucesso';
  const showNavigation = currentStep !== 'welcome' && currentStep !== 'sucesso';

  // Adjust step number for display (exclude welcome)
  const displayStep = currentStepIndex;

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()}>
        {showStepper && (
          <Stepper 
            currentStep={displayStep} 
            totalSteps={totalSteps}
            labels={STEP_LABELS}
          />
        )}

        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {submitError}
          </div>
        )}

        {renderStep()}

        {showNavigation && (
          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="
                px-6 py-2 text-gray-600 font-medium rounded-lg
                hover:bg-gray-100 transition-colors
                focus:outline-none focus:ring-2 focus:ring-gray-300
              "
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="
                px-6 py-2 bg-primary text-white font-medium rounded-lg
                hover:bg-primary-dark transition-colors
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Enviando...
                </span>
              ) : currentStep === 'complementares' ? (
                isEditMode ? 'Atualizar inscrição' : 'Enviar inscrição'
              ) : (
                'Próximo'
              )}
            </button>
          </div>
        )}
      </form>
    </FormProvider>
  );
}
