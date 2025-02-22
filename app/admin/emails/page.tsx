'use client';

import { useState } from 'react';
import { TherapyEmailType } from '@/functions/src/types/emails';

const TEST_PASSWORD = 'TEST180YYY';

export default function AdminEmailsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [status, setStatus] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === TEST_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      setStatus('Invalid password');
    }
  };

  const handleSendEmail = async (emailType: TherapyEmailType) => {
    try {
      setStatus(`Sending ${emailType}...`);
      const response = await fetch('/api/admin/send-test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailType,
          recipientEmail,
          password: TEST_PASSWORD
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(`Email ${emailType} sent successfully!`);
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const emailButtons = [
    { type: TherapyEmailType.RESERVATION, label: 'Reservation Confirmation' },
    { type: TherapyEmailType.BEFORE_COUPLE_1, label: 'After Schedule' },
    { type: TherapyEmailType.AFTER_COUPLE_1, label: 'After First Couple' },
    { type: TherapyEmailType.BEFORE_INDIV_1, label: 'Before Individual 1' },
    { type: TherapyEmailType.AFTER_INDIV_1, label: 'After Individual 1' },
    { type: TherapyEmailType.BEFORE_INDIV_2, label: 'Before Individual 2' },
    { type: TherapyEmailType.AFTER_INDIV_2, label: 'After Individual 2' },
    { type: TherapyEmailType.BEFORE_INDIV_3, label: 'Before Individual 3' },
    { type: TherapyEmailType.BEFORE_COUPLE_2, label: 'Before Couple 2' },
    { type: TherapyEmailType.AFTER_COUPLE_2, label: 'After Couple 2' }];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-8 text-center">Admin Email Testing</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
            {status && (
              <p className="text-red-500 text-center mt-2">{status}</p>
            )}
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-8 text-center">Email Testing Dashboard</h2>

        <div className="mb-6">
          <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Recipient Email
          </label>
          <input
            type="email"
            id="recipientEmail"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 mb-4"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emailButtons.map(({ type, label }) => (
            <button
              key={type}
              onClick={() => handleSendEmail(type)}
              disabled={!recipientEmail}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-300"
            >
              {label}
            </button>
          ))}
        </div>

        {status && (
          <div className={`mt-6 p-4 rounded-md ${status.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
}
