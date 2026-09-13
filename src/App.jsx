import { useDeviceMode } from './hooks/useDeviceMode';
import DesktopApp from './DesktopApp';
import MobileApp from './MobileApp';

// Screen ke ratio ke hisaab se decide karta hai konsa design render karna
// hai — 16:9-type (wide) screens pe DesktopApp, 9:16-type (tall) screens
// pe MobileApp. Resize/rotate pe bhi live switch hota hai.
function App() {
  const mode = useDeviceMode();
  return mode === 'mobile' ? <MobileApp /> : <DesktopApp />;
}

export default App;