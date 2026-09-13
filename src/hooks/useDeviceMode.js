import { useEffect, useState } from 'react';

// Screen ka orientation/ratio check karke decide karta hai: 'desktop'
// (16:9-type, wide/landscape) ya 'mobile' (9:16-type, tall/portrait).
// Window resize aur phone rotate — dono pe live update hota hai, isliye
// koi bhi device turant sahi layout mein switch ho jaata hai, page reload
// ki zaroorat nahi.
function getMode() {
  if (typeof window === 'undefined') return 'desktop';
  return window.innerWidth < window.innerHeight ? 'mobile' : 'desktop';
}

export function useDeviceMode() {
  const [mode, setMode] = useState(getMode);

  useEffect(() => {
    const handleChange = () => setMode(getMode());
    window.addEventListener('resize', handleChange);
    window.addEventListener('orientationchange', handleChange);
    return () => {
      window.removeEventListener('resize', handleChange);
      window.removeEventListener('orientationchange', handleChange);
    };
  }, []);

  return mode;
}
