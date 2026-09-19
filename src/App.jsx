import { lazy, Suspense } from 'react';
import { useDeviceMode } from './hooks/useDeviceMode';

// Dono designs alag chunk mein load hote hain — phone pe sirf MobileApp ka
// JS download hota hai (desktop ka nahi), isliye first load kaafi halka hai.
const DesktopApp = lazy(() => import('./DesktopApp'));
const MobileApp = lazy(() => import('./MobileApp'));

// Screen ke ratio ke hisaab se decide karta hai konsa design render karna
// hai — 16:9-type (wide) screens pe DesktopApp, 9:16-type (tall) screens
// pe MobileApp. Resize/rotate pe bhi live switch hota hai.
function App() {
  const mode = useDeviceMode();
  return (
    <Suspense fallback={null}>
      {mode === 'mobile' ? <MobileApp /> : <DesktopApp />}
    </Suspense>
  );
}

export default App;