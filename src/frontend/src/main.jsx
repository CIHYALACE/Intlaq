import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { createRoot } from 'react-dom/client'
import App from './layout/App.jsx'
import { BrowserRouter  } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './utils/store/queryClient.js';

createRoot(document.getElementById('root')).render(
  <BrowserRouter >
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </BrowserRouter >,
)
