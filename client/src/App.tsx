import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { API_STATUS_OK } from 'shared';

type Health = { ok: boolean; time: string };
type Phase = 'loading' | 'ok' | 'error';

export function App() {
  const [phase, setPhase] = useState<Phase>('loading');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  const check = useCallback(async () => {
    setPhase('loading');
    try {
      const base = import.meta.env.VITE_API_URL ?? '';
      const { data } = await axios.get<Health>(`${base}/api/health`, { timeout: 8000 });
      if (!data.ok || typeof data.time !== 'string') {
        setPhase('error');
        setMessage('The API responded without an ok status.');
        return;
      }
      setTime(data.time);
      setMessage('');
      setPhase('ok');
    } catch {
      setPhase('error');
      setMessage('The API did not respond. Start the server and try again.');
    }
  }, []);

  useEffect(() => {
    void check();
  }, [check]);

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
      <h1 className="font-display text-4xl">Procure Proof</h1>
      <p className="mt-3 text-soft">This page checks the API and nothing else.</p>
      {phase === 'loading' && <p className="mt-8 text-lg">Checking the API…</p>}
      {phase === 'ok' && (
        <p className="mt-8 text-lg">
          {API_STATUS_OK}
          <span className="mt-2 block text-sm text-soft">Server time {time}</span>
        </p>
      )}
      {phase === 'error' && (
        <div className="mt-8">
          <p className="text-lg" role="alert">{message}</p>
          <button
            className="mt-4 rounded-[10px] bg-brand px-4 py-3 text-sm font-medium text-white"
            type="button"
            onClick={() => void check()}
          >
            Retry
          </button>
        </div>
      )}
    </main>
  );
}
