export interface PanelProps {
  totalSteps: number;
  currentStep: number;
  onBack(): void;
  onNext(): void;
}
