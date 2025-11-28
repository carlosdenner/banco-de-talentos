interface StepperProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function Stepper({ currentStep, totalSteps, labels }: StepperProps) {
  return (
    <div className="mb-8">
      <div className="text-center text-sm text-gray-600 mb-4">
        Passo {currentStep} de {totalSteps}
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step indicators - hidden on mobile for cleaner UX */}
      <div className="hidden md:flex justify-between mt-4">
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`flex flex-col items-center flex-1 ${
              i < totalSteps - 1 ? 'relative' : ''
            }`}
          >
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${
                  i + 1 < currentStep
                    ? 'bg-primary text-white'
                    : i + 1 === currentStep
                    ? 'bg-primary text-white ring-4 ring-primary/20'
                    : 'bg-gray-200 text-gray-500'
                }
              `}
            >
              {i + 1 < currentStep ? (
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                i + 1
              )}
            </div>
            {labels && labels[i] && (
              <span className="text-xs text-gray-500 mt-1 text-center max-w-[80px]">
                {labels[i]}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
