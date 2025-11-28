import { render, type RenderOptions } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { AuthProvider } from '../lib/authContext';
import type { ApplicationFormData } from '../features/application/types';
import type { ReactElement, ReactNode } from 'react';

const defaultFormValues: ApplicationFormData = {
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
};

interface FormWrapperProps {
  children: ReactNode;
  defaultValues?: Partial<ApplicationFormData>;
}

function FormWrapper({ children, defaultValues = {} }: FormWrapperProps) {
  const methods = useForm<ApplicationFormData>({
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

interface AllProvidersProps {
  children: ReactNode;
  formDefaultValues?: Partial<ApplicationFormData>;
}

function AllProviders({ children, formDefaultValues }: AllProvidersProps) {
  return (
    <AuthProvider>
      <FormWrapper defaultValues={formDefaultValues}>{children}</FormWrapper>
    </AuthProvider>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  formDefaultValues?: Partial<ApplicationFormData>;
}

export function renderWithProviders(
  ui: ReactElement,
  { formDefaultValues, ...options }: CustomRenderOptions = {}
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders formDefaultValues={formDefaultValues}>{children}</AllProviders>
    ),
    ...options,
  });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
