import { Route, Routes } from 'react-router-dom';
import { App } from './App';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="*" element={<main className="p-6"><h1 className="font-display text-4xl">That page doesn't exist.</h1></main>} />
    </Routes>
  );
}
