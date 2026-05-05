'use client';

import { useState } from 'react';
import { AlertCircle, ArrowRight, Building2, Loader2, Mail, UserRound } from 'lucide-react';

type FormState = {
  status: 'idle' | 'loading' | 'error';
  message: string;
};

const initialState: FormState = {
  status: 'idle',
  message: ''
};

type CheckoutResponse = {
  ok: boolean;
  checkoutUrl?: string;
  message?: string;
};

export function QuietPilotPurchaseForm() {
  const [state, setState] = useState<FormState>(initialState);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: 'loading', message: '' });

    const formData = new FormData(event.currentTarget);
    const payload = {
      organizationName: String(formData.get('organizationName') ?? ''),
      organizationSlug: String(formData.get('organizationSlug') ?? ''),
      ownerFullName: String(formData.get('ownerFullName') ?? ''),
      ownerEmail: String(formData.get('ownerEmail') ?? ''),
      timezone: String(formData.get('timezone') ?? 'America/Chicago'),
      currency: 'USD',
      starterPackId: 'catering'
    };

    try {
      const response = await fetch('/api/quietpilot/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as CheckoutResponse;

      if (!response.ok || !result.ok || !result.checkoutUrl) {
        setState({
          status: 'error',
          message: result.message ?? 'Unable to start checkout right now.'
        });
        return;
      }

      window.location.assign(result.checkoutUrl);
    } catch {
      setState({
        status: 'error',
        message: 'Network issue detected. Please try again.'
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Organization
          <span className="relative block">
            <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              required
              name="organizationName"
              className="w-full rounded-md border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              placeholder="Acme Field Services"
            />
          </span>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Workspace slug
          <input
            name="organizationSlug"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
            placeholder="acme-field-services"
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          Owner name
          <span className="relative block">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              required
              name="ownerFullName"
              className="w-full rounded-md border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              placeholder="Jordan Rivera"
            />
          </span>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          Owner email
          <span className="relative block">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              required
              type="email"
              name="ownerEmail"
              className="w-full rounded-md border border-slate-300 bg-white py-3 pl-10 pr-3 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
              placeholder="jordan@company.com"
            />
          </span>
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-slate-700">
        Timezone
        <input
          required
          name="timezone"
          defaultValue="America/Chicago"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-3 text-sm text-slate-950 outline-none transition focus:border-cyan-600 focus:ring-2 focus:ring-cyan-100"
        />
      </label>

      <button
        type="submit"
        disabled={state.status === 'loading'}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state.status === 'loading' ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        )}
        {state.status === 'loading' ? 'Starting checkout' : 'Continue to payment'}
      </button>

      {state.status === 'error' ? (
        <p className="flex items-center gap-2 text-sm text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
