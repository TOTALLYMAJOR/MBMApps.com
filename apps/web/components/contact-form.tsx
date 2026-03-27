'use client';

import { useState } from 'react';
import type { ContactSubmission } from '@mbm/contracts';

const budgetOptions: Array<{ value: ContactSubmission['budget']; label: string }> = [
  { value: 'under-10k', label: 'Under $10K' },
  { value: '10k-25k', label: '$10K - $25K' },
  { value: '25k-75k', label: '$25K - $75K' },
  { value: '75k-plus', label: '$75K+' }
];

const timelineOptions: Array<{ value: ContactSubmission['timeline']; label: string }> = [
  { value: 'immediate', label: 'Immediate (0-2 weeks)' },
  { value: '30-days', label: 'Within 30 days' },
  { value: 'quarter', label: 'This quarter' },
  { value: 'exploring', label: 'Exploring options' }
];

type FormState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

const initialState: FormState = {
  status: 'idle',
  message: ''
};

export function ContactForm() {
  const [state, setState] = useState<FormState>(initialState);
  const [startedAt] = useState(Date.now());
  const [messageLength, setMessageLength] = useState(0);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState({ status: 'loading', message: 'Submitting your request...' });

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get('name') ?? ''),
      email: String(formData.get('email') ?? ''),
      company: String(formData.get('company') ?? ''),
      website: String(formData.get('website') ?? ''),
      message: String(formData.get('message') ?? ''),
      budget: String(formData.get('budget') ?? ''),
      timeline: String(formData.get('timeline') ?? ''),
      source: 'mbmapps-contact-form',
      startedAt
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setState({
          status: 'error',
          message: result.message ?? 'Unable to submit right now. Please email sales@mbmapps.com.'
        });
        return;
      }

      event.currentTarget.reset();
      setState({
        status: 'success',
        message: 'Thanks. Your request is in. Use the scheduling link below to pick a discovery call slot.'
      });
    } catch {
      setState({
        status: 'error',
        message: 'Network issue detected. Please try again or email sales@mbmapps.com.'
      });
    }
  }

  return (
    <form onSubmit={onSubmit} className="surface-panel space-y-5 p-6 md:p-7">
      <div className="surface-card p-4">
        <p className="kicker text-white/70">Intake Readiness</p>
        <div className="mt-3 grid gap-2 text-xs text-white/80 md:grid-cols-3">
          {['Scope clarity', 'Budget alignment', 'Timeline commitment'].map((item) => (
            <p key={item} className="surface-card px-2 py-1.5">
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-white/90">
          Name
          <input
            required
            name="name"
            className="w-full rounded-xl border border-white/15 bg-black/45 px-3 py-2 text-sm outline-none transition focus:border-electric"
            placeholder="Avery Morgan"
          />
        </label>
        <label className="space-y-2 text-sm text-white/90">
          Work email
          <input
            required
            type="email"
            name="email"
            className="w-full rounded-xl border border-white/15 bg-black/45 px-3 py-2 text-sm outline-none transition focus:border-electric"
            placeholder="avery@company.com"
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-white/90">
          Company
          <input
            required
            name="company"
            className="w-full rounded-xl border border-white/15 bg-black/45 px-3 py-2 text-sm outline-none transition focus:border-electric"
            placeholder="Northline Foods"
          />
        </label>
        <label className="space-y-2 text-sm text-white/90">
          Budget range
          <select
            required
            name="budget"
            className="w-full rounded-xl border border-white/15 bg-black/45 px-3 py-2 text-sm outline-none transition focus:border-electric"
            defaultValue=""
          >
            <option value="" disabled>
              Select budget
            </option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2 text-sm text-white/90">
        Timeline
        <select
          required
          name="timeline"
          className="w-full rounded-xl border border-white/15 bg-black/45 px-3 py-2 text-sm outline-none transition focus:border-electric"
          defaultValue=""
        >
          <option value="" disabled>
            Select timeline
          </option>
          {timelineOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="space-y-2 text-sm text-white/90">
        Project goals
        <textarea
          required
          minLength={20}
          name="message"
          rows={5}
          onChange={(event) => setMessageLength(event.target.value.length)}
          className="w-full rounded-xl border border-white/15 bg-black/45 px-3 py-2 text-sm outline-none transition focus:border-electric"
          placeholder="Share outcomes you need: conversion lift, quoting speed, automation, reliability, etc."
        />
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-mist">
            <span>Brief quality signal</span>
            <span>{messageLength} chars</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-electric via-signal to-warning transition-all"
              style={{ width: `${Math.min((messageLength / 140) * 100, 100)}%` }}
            />
          </div>
        </div>
      </label>

      <input
        name="website"
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
        aria-hidden="true"
      />

      <button
        type="submit"
        disabled={state.status === 'loading'}
        className="w-full rounded-xl border border-electric/70 bg-electric/20 px-4 py-3 font-semibold text-white transition hover:bg-electric/35 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state.status === 'loading' ? 'Submitting...' : 'Request Discovery Call'}
      </button>

      {state.status !== 'idle' ? (
        <p className={state.status === 'error' ? 'text-sm text-rose-300' : 'text-sm text-signal'}>{state.message}</p>
      ) : null}
    </form>
  );
}
