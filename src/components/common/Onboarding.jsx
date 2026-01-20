/**
 * Componente de Onboarding/Welcome
 * Vértice Gastronómico
 *
 * Guía interactiva para nuevos usuarios
 */

import React, { useState, useEffect } from 'react';

const ONBOARDING_KEY = 'vertice_onboarding_completed';

const STEPS = [
  {
    id: 'welcome',
    title: 'Bienvenido a Vértice',
    subtitle: 'Tu plataforma de consultoría gastronómica inteligente',
    description: 'Vértice combina la experiencia de 72 agentes de IA especializados para transformar la gestión de tu restaurante.',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    features: [
      { icon: '🤖', text: '72 agentes IA especializados' },
      { icon: '📊', text: 'Análisis financiero en tiempo real' },
      { icon: '🍽️', text: 'Gestión integral de restaurantes' },
      { icon: '📈', text: 'Optimización de operaciones' }
    ]
  },
  {
    id: 'navigation',
    title: 'Navegación Intuitiva',
    subtitle: 'Accede a todo con un solo clic',
    description: 'Usa el menú lateral para navegar entre módulos, o presiona ⌘K para abrir la búsqueda rápida.',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    ),
    tips: [
      { shortcut: '⌘K', description: 'Búsqueda rápida global' },
      { shortcut: '←/→', description: 'Navegar entre secciones' },
      { shortcut: 'ESC', description: 'Cerrar diálogos' }
    ]
  },
  {
    id: 'agents',
    title: 'Agentes IA',
    subtitle: 'Tu equipo de expertos virtuales',
    description: 'Cada agente está especializado en un área específica de consultoría gastronómica.',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    categories: [
      { name: 'Finanzas', count: 12, color: 'emerald' },
      { name: 'Operaciones', count: 15, color: 'blue' },
      { name: 'Marketing', count: 10, color: 'purple' },
      { name: 'RRHH', count: 8, color: 'orange' }
    ]
  },
  {
    id: 'ready',
    title: '¡Estás Listo!',
    subtitle: 'Comienza a optimizar tu negocio',
    description: 'Explora el dashboard para ver métricas clave, o selecciona un agente para obtener consultoría especializada.',
    icon: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    actions: [
      { label: 'Ver Dashboard', icon: '📊', action: 'dashboard' },
      { label: 'Explorar Agentes', icon: '🤖', action: 'ai-agents' },
      { label: 'Configurar Restaurante', icon: '⚙️', action: 'settings' }
    ]
  }
];

function StepIndicator({ currentStep, totalSteps, onStepClick }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <button
          key={index}
          onClick={() => onStepClick(index)}
          className={`
            w-2.5 h-2.5 rounded-full transition-all duration-300
            ${index === currentStep
              ? 'w-8 bg-emerald-500'
              : index < currentStep
                ? 'bg-emerald-500/50 hover:bg-emerald-500/70'
                : 'bg-gray-600 hover:bg-gray-500'
            }
          `}
          aria-label={`Ir al paso ${index + 1}`}
        />
      ))}
    </div>
  );
}

function WelcomeStep({ step }) {
  return (
    <div className="text-center">
      <div className="text-emerald-400 mb-6 flex justify-center">
        {step.icon}
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">{step.title}</h2>
      <p className="text-emerald-400 text-lg mb-4">{step.subtitle}</p>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">{step.description}</p>

      {step.features && (
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {step.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-sm text-gray-300">{feature.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NavigationStep({ step }) {
  return (
    <div className="text-center">
      <div className="text-blue-400 mb-6 flex justify-center">
        {step.icon}
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">{step.title}</h2>
      <p className="text-blue-400 text-lg mb-4">{step.subtitle}</p>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">{step.description}</p>

      {step.tips && (
        <div className="space-y-3 max-w-sm mx-auto">
          {step.tips.map((tip, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700"
            >
              <kbd className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm font-mono text-white">
                {tip.shortcut}
              </kbd>
              <span className="text-sm text-gray-300">{tip.description}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AgentsStep({ step }) {
  return (
    <div className="text-center">
      <div className="text-purple-400 mb-6 flex justify-center">
        {step.icon}
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">{step.title}</h2>
      <p className="text-purple-400 text-lg mb-4">{step.subtitle}</p>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">{step.description}</p>

      {step.categories && (
        <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
          {step.categories.map((category, index) => (
            <div
              key={index}
              className={`
                p-4 rounded-lg border transition-all duration-300
                ${category.color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/30' : ''}
                ${category.color === 'blue' ? 'bg-blue-500/10 border-blue-500/30' : ''}
                ${category.color === 'purple' ? 'bg-purple-500/10 border-purple-500/30' : ''}
                ${category.color === 'orange' ? 'bg-orange-500/10 border-orange-500/30' : ''}
              `}
            >
              <p className="font-medium text-white">{category.name}</p>
              <p className="text-2xl font-bold text-gray-300">{category.count} agentes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReadyStep({ step, onAction }) {
  return (
    <div className="text-center">
      <div className="text-emerald-400 mb-6 flex justify-center">
        {step.icon}
      </div>
      <h2 className="text-3xl font-bold text-white mb-2">{step.title}</h2>
      <p className="text-emerald-400 text-lg mb-4">{step.subtitle}</p>
      <p className="text-gray-400 mb-8 max-w-md mx-auto">{step.description}</p>

      {step.actions && (
        <div className="flex flex-wrap justify-center gap-4">
          {step.actions.map((action, index) => (
            <button
              key={index}
              onClick={() => onAction(action.action)}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 hover:border-emerald-500/50 transition-all"
            >
              <span className="text-xl">{action.icon}</span>
              <span className="text-white font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Onboarding({ onComplete, onNavigate }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsVisible(false);
    onComplete?.();
  };

  const handleComplete = (action) => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsVisible(false);
    onComplete?.();
    if (action && onNavigate) {
      onNavigate(action);
    }
  };

  const renderStep = () => {
    const step = STEPS[currentStep];
    switch (step.id) {
      case 'welcome':
        return <WelcomeStep step={step} />;
      case 'navigation':
        return <NavigationStep step={step} />;
      case 'agents':
        return <AgentsStep step={step} />;
      case 'ready':
        return <ReadyStep step={step} onAction={handleComplete} />;
      default:
        return <WelcomeStep step={step} />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-gray-900/95 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4">
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute -top-12 right-0 text-gray-400 hover:text-white text-sm transition-colors"
        >
          Omitir introducción
        </button>

        {/* Card */}
        <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 shadow-2xl">
          <StepIndicator
            currentStep={currentStep}
            totalSteps={STEPS.length}
            onStepClick={setCurrentStep}
          />

          {/* Step content with animation */}
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="animate-in fade-in slide-in-from-right-4 duration-300" key={currentStep}>
              {renderStep()}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                ${currentStep === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Anterior
            </button>

            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all"
              >
                Siguiente
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => handleComplete('dashboard')}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all"
              >
                Comenzar
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook para verificar si el onboarding fue completado
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const completed = localStorage.getItem(ONBOARDING_KEY);
    setShowOnboarding(!completed);
    setIsLoading(false);
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShowOnboarding(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem(ONBOARDING_KEY);
    setShowOnboarding(true);
  };

  return {
    showOnboarding,
    isLoading,
    completeOnboarding,
    resetOnboarding
  };
}

export default Onboarding;
