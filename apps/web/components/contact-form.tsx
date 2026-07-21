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

const decisionRoleOptions: Array<{ value: ContactSubmission['decisionRole']; label: string }> = [
  { value: 'owner', label: 'Owner / founder' },
  { value: 'executive', label: 'Executive leader' },
  { value: 'operations-leader', label: 'Operations leader' },
  { value: 'revenue-leader', label: 'Revenue leader' },
  { value: 'technical-leader', label: 'Technical leader' },
  { value: 'consultant', label: 'Advisor / consultant' },
  { value: 'other', label: 'Other' }
];

const companySizeOptions: Array<{ value: ContactSubmission['companySize']; label: string }> = [
  { value: '1-10', label: '1-10' },
  { value: '11-50', label: '11-50' },
  { value: '51-200', label: '51-200' },
  { value: '201-500', label: '201-500' },
  { value: '500-plus', label: '500+' },
  { value: 'unknown', label: 'Not sure yet' }
];

const serviceCategoryOptions: Array<{ value: ContactSubmission['serviceCategory']; label: string }> = [
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'field-services', label: 'Field services' },
  { value: 'events', label: 'Events' },
  { value: 'food-services', label: 'Food services' },
  { value: 'saas', label: 'SaaS' },
  { value: 'professional-services', label: 'Professional services' },
  { value: 'other', label: 'Other' }
];

const maturityOptions: Array<{ value: ContactSubmission['operationalMaturity']; label: string }> = [
  { value: 'manual', label: 'Mostly manual' },
  { value: 'spreadsheet-led', label: 'Spreadsheet-led' },
  { value: 'tool-assisted', label: 'Tool-assisted' },
  { value: 'systematized', label: 'Systematized' },
  { value: 'optimized', label: 'Optimized' },
  { value: 'unknown', label: 'Not sure yet' }
];

const painOptions: Array<{ value: ContactSubmission['primaryBusinessPain']; label: string }> = [
  { value: 'quote-speed', label: 'Quote speed' },
  { value: 'conversion-visibility', label: 'Conversion visibility' },
  { value: 'job-readiness', label: 'Job readiness' },
  { value: 'staffing-risk', label: 'Staffing risk' },
  { value: 'payment-risk', label: 'Payment risk' },
  { value: 'inventory-control', label: 'Inventory control' },
  { value: 'platform-reliability', label: 'Platform reliability' },
  { value: 'data-fragmentation', label: 'Data fragmentation' },
  { value: 'other', label: 'Other' }
];

const constraintOptions: Array<{ value: ContactSubmission['topConstraint']; label: string }> = [
  { value: 'timeline', label: 'Timeline' },
  { value: 'team-capacity', label: 'Team capacity' },
  { value: 'data-quality', label: 'Data quality' },
  { value: 'integration-complexity', label: 'Integration complexity' },
  { value: 'change-management', label: 'Change management' },
  { value: 'budget', label: 'Budget' },
  { value: 'unclear-scope', label: 'Unclear scope' },
  { value: 'none', label: 'No major blocker' }
];

type FormState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

const initialState: FormState = {
  status: 'idle',
  message: ''
};

function optionalNumber(value: FormDataEntryValue | null) {
  const normalized = String(value ?? '').trim();
  return normalized.length > 0 ? Number(normalized) : undefined;
}

function splitTools(value: FormDataEntryValue | null) {
  return String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

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
      decisionRole: String(formData.get('decisionRole') ?? ''),
      industry: String(formData.get('industry') ?? ''),
      companySize: String(formData.get('companySize') ?? ''),
      locationCount: Number(formData.get('locationCount') ?? 1),
      teamSize: optionalNumber(formData.get('teamSize')),
      monthlyQuoteVolume: optionalNumber(formData.get('monthlyQuoteVolume')),
      serviceCategory: String(formData.get('serviceCategory') ?? ''),
      currentTools: splitTools(formData.get('currentTools')),
      currentCrmOrOpsSystem: String(formData.get('currentCrmOrOpsSystem') ?? ''),
      operationalMaturity: String(formData.get('operationalMaturity') ?? ''),
      primaryBusinessPain: String(formData.get('primaryBusinessPain') ?? ''),
      topConstraint: String(formData.get('topConstraint') ?? ''),
      consent: {
        dataProcessingAccepted: formData.get('dataProcessingAccepted') === 'on',
        marketingOptIn: formData.get('marketingOptIn') === 'on',
        acceptedAt: new Date().toISOString(),
        policyVersion: '2026-05-05'
      },
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
      setMessageLength(0);
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
    <form onSubmit={onSubmit} className="northstar-card space-y-6 p-6 md:p-8">
      <div className="border-b border-white/10 pb-5">
        <p className="northstar-kicker">Intake Readiness</p>
        <div className="mt-3 grid gap-2 text-xs text-white/80 md:grid-cols-3">
          {['Scope clarity', 'Budget alignment', 'Timeline commitment'].map((item) => (
            <p key={item} className="border-l border-indigo-300/30 py-1 pl-2 text-white/48">
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
            className="northstar-input"
            placeholder="Avery Morgan"
          />
        </label>
        <label className="space-y-2 text-sm text-white/90">
          Work email
          <input
            required
            type="email"
            name="email"
            className="northstar-input"
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
            className="northstar-input"
            placeholder="Northline Foods"
          />
        </label>
        <label className="space-y-2 text-sm text-white/90">
          Budget range
          <select
            required
            name="budget"
            className="northstar-input"
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

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm text-white/90">
          Timeline
          <select
            required
            name="timeline"
            className="northstar-input"
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
          Decision role
          <select
            required
            name="decisionRole"
            className="northstar-input"
            defaultValue=""
          >
            <option value="" disabled>
              Select role
            </option>
            {decisionRoleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-5 border-y border-white/10 py-6">
        <div>
          <p className="northstar-kicker">Champion Signals</p>
          <p className="mt-2 text-xs leading-5 text-white/65">
            These details help us benchmark fit, urgency, operating complexity, and outcome potential.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/90">
            Industry
            <input
              required
              name="industry"
              className="northstar-input"
              placeholder="Events, catering, field services..."
            />
          </label>

          <label className="space-y-2 text-sm text-white/90">
            Service category
            <select
              required
              name="serviceCategory"
              className="northstar-input"
              defaultValue=""
            >
              <option value="" disabled>
                Select category
              </option>
              {serviceCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <label className="space-y-2 text-sm text-white/90">
            Company size
            <select
              required
              name="companySize"
              className="northstar-input"
              defaultValue=""
            >
              <option value="" disabled>
                Select size
              </option>
              {companySizeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-white/90">
            Locations
            <input
              required
              min={1}
              type="number"
              name="locationCount"
              className="northstar-input"
              defaultValue={1}
            />
          </label>

          <label className="space-y-2 text-sm text-white/90">
            Team size
            <input
              min={0}
              type="number"
              name="teamSize"
              className="northstar-input"
              placeholder="24"
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="space-y-2 text-sm text-white/90">
            Monthly quote volume
            <input
              min={0}
              type="number"
              name="monthlyQuoteVolume"
              className="northstar-input"
              placeholder="60"
            />
          </label>

          <label className="space-y-2 text-sm text-white/90">
            Current CRM / ops system
            <input
              name="currentCrmOrOpsSystem"
              className="northstar-input"
              placeholder="HubSpot, Salesforce, spreadsheets..."
            />
          </label>
        </div>

        <label className="space-y-2 text-sm text-white/90">
          Current tools
          <input
            name="currentTools"
            className="northstar-input"
            placeholder="Comma-separated tools"
          />
        </label>

        <div className="grid gap-5 md:grid-cols-3">
          <label className="space-y-2 text-sm text-white/90">
            Operating maturity
            <select
              required
              name="operationalMaturity"
              className="northstar-input"
              defaultValue=""
            >
              <option value="" disabled>
                Select maturity
              </option>
              {maturityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-white/90">
            Primary pain
            <select
              required
              name="primaryBusinessPain"
              className="northstar-input"
              defaultValue=""
            >
              <option value="" disabled>
                Select pain
              </option>
              {painOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm text-white/90">
            Top constraint
            <select
              required
              name="topConstraint"
              className="northstar-input"
              defaultValue=""
            >
              <option value="" disabled>
                Select constraint
              </option>
              {constraintOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <label className="space-y-2 text-sm text-white/90">
        Project goals
        <textarea
          required
          minLength={20}
          name="message"
          rows={5}
          onChange={(event) => setMessageLength(event.target.value.length)}
          className="northstar-input"
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

      <div className="space-y-3 text-xs leading-5 text-white/70">
        <label className="flex gap-3">
          <input required type="checkbox" name="dataProcessingAccepted" className="mt-1 h-4 w-4 rounded border-white/20 bg-black/45" />
          <span>MBMApps may process this information to qualify fit and respond with relevant next steps.</span>
        </label>
        <label className="flex gap-3">
          <input type="checkbox" name="marketingOptIn" className="mt-1 h-4 w-4 rounded border-white/20 bg-black/45" />
          <span>Send occasional product and operations insights.</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={state.status === 'loading'}
        className="storefront-action storefront-action--primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
      >
        {state.status === 'loading' ? 'Submitting...' : 'Request Discovery Call'}
      </button>

      {state.status !== 'idle' ? (
        <p className={state.status === 'error' ? 'text-sm text-rose-300' : 'text-sm text-signal'}>{state.message}</p>
      ) : null}
    </form>
  );
}
