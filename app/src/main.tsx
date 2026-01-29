import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('🚀 main.tsx: Starting app initialization');

const rootElement = document.getElementById('root');
console.log('🎯 main.tsx: Root element found:', rootElement);

if (rootElement) {
  console.log('✅ main.tsx: Creating React root');
  const root = createRoot(rootElement);
  console.log('✅ main.tsx: Rendering App component');
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log('✅ main.tsx: Render called successfully');
} else {
  console.error('❌ main.tsx: Root element not found!');
}
