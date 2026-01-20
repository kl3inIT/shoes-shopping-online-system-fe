import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n/i18n';
import { AppProviders } from './providers/AppProviders';

createRoot(document.getElementById('root')!).render(
  <AppProviders>
    <App />
  </AppProviders>
);
