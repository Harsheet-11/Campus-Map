// A tiny event bus that decouples MainApp buttons from OnboardingOverlay.
// MainApp fires triggerOnboarding().
// OnboardingOverlay listens with onOnboardingTrigger().
// They never import each other.

type Listener = () => void;

const listeners = new Set<Listener>();

export function triggerOnboarding() {
  listeners.forEach((listener) => {
    listener();
  });
}

export function onOnboardingTrigger(
  callback: Listener
) {
  listeners.add(callback);

  // React useEffect cleanup must return void
  return () => {
    listeners.delete(callback);
  };
}