'use client';

import { useState } from 'react';
import { currentConsentPolicyVersion, type ContactResponse, type ContactSubmission } from '@mbm/contracts';
import { siteConfig } from '@/lib/site';

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

type FieldDef =
  | { kind: 'text' | 'email'; name: string; label: string; required?: boolean; placeholder?: string }
  | { kind: 'number'; name: string; label: string; required?: boolean; placeholder?: string; min?: number }
  | { kind: 'select'; name: string; label: string; required?: boolean; options: Array<{ value: string; label: string }> }
  | { kind: 'textarea'; name: string; label: string; required?: boolean; placeholder?: string; minLength?: number };

type StepDef = {
  id: string;
  prompt: string;
  fields: FieldDef[];
};

const STEPS: StepDef[] = [
  {
    id: 'identity',
    prompt: "Let's start with the basics. Who am I speaking with?",
    fields: [
      { kind: 'text', name: 'name', label: 'Name', required: true, placeholder: 'Avery Morgan' },
      { kind: 'email', name: 'email', label: 'Work email', required: true, placeholder: 'avery@company.com' }
    ]
  },
  {
    id: 'company',
    prompt: 'Tell me about the company.',
    fields: [
      { kind: 'text', name: 'company', label: 'Company', required: true, placeholder: 'Northline Foods' },
      { kind: 'text', name: 'industry', label: 'Industry', required: true, placeholder: 'Events, catering, field services...' },
      { kind: 'select', name: 'serviceCategory', label: 'Service category', required: true, options: serviceCategoryOptions }
    ]
  },
  {
    id: 'shape',
    prompt: "What's the shape of the operation?",
    fields: [
      { kind: 'select', name: 'companySize', label: 'Company size', required: true, options: companySizeOptions },
      { kind: 'number', name: 'locationCount', label: 'Locations', required: true, min: 1 },
      { kind: 'number', name: 'teamSize', label: 'Team size', placeholder: '24', min: 0 }
    ]
  },
  {
    id: 'commercial',
    prompt: "Let's talk budget and timing.",
    fields: [
      { kind: 'select', name: 'budget', label: 'Budget range', required: true, options: budgetOptions },
      { kind: 'select', name: 'timeline', label: 'Timeline', required: true, options: timelineOptions },
      { kind: 'select', name: 'decisionRole', label: 'Decision role', required: true, options: decisionRoleOptions }
    ]
  },
  {
    id: 'context',
    prompt: "What's already in motion?",
    fields: [
      { kind: 'number', name: 'monthlyQuoteVolume', label: 'Monthly quote volume', placeholder: '60', min: 0 },
      { kind: 'text', name: 'currentCrmOrOpsSystem', label: 'Current CRM / ops system', placeholder: 'HubSpot, Salesforce, spreadsheets...' },
      { kind: 'text', name: 'currentTools', label: 'Current tools', placeholder: 'Comma-separated tools' }
    ]
  },
  {
    id: 'friction',
    prompt: "Where's the friction?",
    fields: [
      { kind: 'select', name: 'operationalMaturity', label: 'Operating maturity', required: true, options: maturityOptions },
      { kind: 'select', name: 'primaryBusinessPain', label: 'Primary pain', required: true, options: painOptions },
      { kind: 'select', name: 'topConstraint', label: 'Top constraint', required: true, options: constraintOptions }
    ]
  },
  {
    id: 'brief',
    prompt: 'Last thing — what does success look like?',
    fields: [
      {
        kind: 'textarea',
        name: 'message',
        label: 'Project goals',
        required: true,
        minLength: 20,
        placeholder: 'Share outcomes you need: conversion lift, quoting speed, automation, reliability, etc.'
      }
    ]
  }
];

type FormState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
};

const initialState: FormState = {
  status: 'idle',
  message: ''
};

function optionalNumber(value: string | undefined) {
  const normalized = (value ?? '').trim();
  return normalized.length > 0 ? Number(normalized) : undefined;
}

function splitTools(value: string | undefined) {
  return (value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 12);
}

function summarizeValue(field: FieldDef, raw: string) {
  if (!raw.trim()) {
    return null;
  }
  if (field.kind === 'select') {
    return field.options.find((option) => option.value === raw)?.label ?? raw;
  }
  return raw;
}

function summarizeStep(stepDef: StepDef, values: Record<string, string>) {
  return stepDef.fields
    .map((field) => summarizeValue(field, values[field.name] ?? ''))
    .filter(Boolean)
    .join(' · ');
}

function isStepValid(stepDef: StepDef, values: Record<string, string>) {
  return stepDef.fields.every((field) => {
    if (!field.required) {
      return true;
    }
    const raw = (values[field.name] ?? '').trim();
    if (field.kind === 'textarea') {
      return raw.length >= (field.minLength ?? 1);
    }
    return raw.length > 0;
  });
}

export function ContactForm() {
  const [values, setValues] = useState<Record<string, string>>({ locationCount: '1' });
  const [consent, setConsent] = useState({ dataProcessingAccepted: false, marketingOptIn: false });
  const [step, setStep] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [state, setState] = useState<FormState>(initialState);
  const stepDef = (STEPS[step] ?? STEPS[0])!;
  const isLastStep = step === STEPS.length - 1;
  const canAdvance = isStepValid(stepDef, values);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function handleNext() {
    if (!canAdvance) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function handleBack(target?: number) {
    setAttempted(false);
    setStep((current) => target ?? Math.max(current - 1, 0));
  }

  function handleFormKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    if (event.key !== 'Enter') {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.tagName === 'TEXTAREA' || isLastStep) {
      return;
    }
    event.preventDefault();
    handleNext();
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isLastStep) {
      handleNext();
      return;
    }

    if (!canAdvance || !consent.dataProcessingAccepted) {
      setAttempted(true);
      return;
    }

    setState({ status: 'loading', message: 'Submitting your request...' });

    const payload = {
      name: values.name ?? '',
      email: values.email ?? '',
      company: values.company ?? '',
      website: values.website ?? '',
      message: values.message ?? '',
      budget: values.budget ?? '',
      timeline: values.timeline ?? '',
      decisionRole: values.decisionRole ?? '',
      industry: values.industry ?? '',
      companySize: values.companySize ?? '',
      locationCount: Number(values.locationCount || 1),
      teamSize: optionalNumber(values.teamSize),
      monthlyQuoteVolume: optionalNumber(values.monthlyQuoteVolume),
      serviceCategory: values.serviceCategory ?? '',
      currentTools: splitTools(values.currentTools),
      currentCrmOrOpsSystem: values.currentCrmOrOpsSystem ?? '',
      operationalMaturity: values.operationalMaturity ?? '',
      primaryBusinessPain: values.primaryBusinessPain ?? '',
      topConstraint: values.topConstraint ?? '',
      consent: {
        dataProcessingAccepted: consent.dataProcessingAccepted,
        marketingOptIn: consent.marketingOptIn,
        acceptedAt: new Date().toISOString(),
        policyVersion: currentConsentPolicyVersion
      },
      source: 'mbmapps-contact-form'
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json()) as Partial<ContactResponse> & { message?: string };

      if (!response.ok || !result.ok || result.state !== 'persisted') {
        setState({
          status: 'error',
          message: result.message ?? `Unable to save right now. Please email ${siteConfig.email}.`
        });
        return;
      }

      setValues({ locationCount: '1' });
      setConsent({ dataProcessingAccepted: false, marketingOptIn: false });
      setStep(0);
      setAttempted(false);
      setState({
        status: 'success',
        message: 'Thanks. Your request is saved. Use the scheduling link below to pick a discovery call slot.'
      });
    } catch {
      setState({
        status: 'error',
        message: `Network issue detected. Please try again or email ${siteConfig.email}.`
      });
    }
  }

  function renderField(field: FieldDef) {
    const value = values[field.name] ?? '';
    const showError = attempted && field.required && !value.trim();
    const fieldClassName = `northstar-input${showError ? ' border-rose-400/60' : ''}`;

    if (field.kind === 'select') {
      return (
        <label key={field.name} className="space-y-2 text-sm text-white/90">
          {field.label}
          <select name={field.name} value={value} onChange={handleChange} className={fieldClassName}>
            <option value="" disabled>
              Select {field.label.toLowerCase()}
            </option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      );
    }

    if (field.kind === 'textarea') {
      return (
        <label key={field.name} className="space-y-2 text-sm text-white/90 md:col-span-2">
          {field.label}
          <textarea
            name={field.name}
            rows={5}
            value={value}
            onChange={handleChange}
            className={fieldClassName}
            placeholder={field.placeholder}
          />
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-mist">
              <span>Brief quality signal</span>
              <span>{value.length} chars</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-electric via-signal to-ember transition-all"
                style={{ width: `${Math.min((value.length / 140) * 100, 100)}%` }}
              />
            </div>
          </div>
        </label>
      );
    }

    return (
      <label key={field.name} className="space-y-2 text-sm text-white/90">
        {field.label}
        <input
          type={field.kind === 'number' ? 'number' : field.kind}
          name={field.name}
          value={value}
          onChange={handleChange}
          min={field.kind === 'number' ? field.min : undefined}
          placeholder={field.placeholder}
          className={fieldClassName}
        />
      </label>
    );
  }

  return (
    <form onSubmit={onSubmit} onKeyDown={handleFormKeyDown} className="northstar-card terminal-intake__form space-y-6 p-6 md:p-8">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <p className="northstar-kicker">Project intake</p>
        <span className="instrument-chip instrument-chip--ember instrument-chip--live">
          <span className="instrument-chip__dot" aria-hidden="true" />
          Step {step + 1} / {STEPS.length}
        </span>
      </div>

      <input name="website" autoComplete="off" tabIndex={-1} value={values.website ?? ''} onChange={handleChange} className="hidden" aria-hidden="true" />

      {STEPS.slice(0, step).map((pastStep, index) => {
        const summary = summarizeStep(pastStep, values);
        if (!summary) {
          return null;
        }
        return (
          <div key={pastStep.id} className="space-y-2">
            <p className="text-sm text-white/40">{pastStep.prompt}</p>
            <button
              type="button"
              onClick={() => handleBack(index)}
              className="northstar-input flex w-full items-center justify-between gap-3 text-left text-sm text-white/85 transition hover:border-indigo-300/40"
            >
              <span>{summary}</span>
              <span className="shrink-0 text-xs text-indigo-300/70">Edit</span>
            </button>
          </div>
        );
      })}

      <div key={stepDef.id} className="animate-rise space-y-5">
        <p className="text-base leading-6 text-white/90">{stepDef.prompt}</p>
        <div className="grid gap-5 md:grid-cols-2">{stepDef.fields.map((field) => renderField(field))}</div>
        {attempted && !canAdvance ? <p className="text-xs text-rose-300">Fill in the highlighted fields to continue.</p> : null}

        {isLastStep ? (
          <>
            <div className="space-y-3 text-xs leading-5 text-white/70">
              <label className="flex gap-3">
                <input
                  type="checkbox"
                  checked={consent.dataProcessingAccepted}
                  onChange={(event) => setConsent((prev) => ({ ...prev, dataProcessingAccepted: event.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-black/45"
                />
                <span>MBMApps may process this information to qualify fit and respond with relevant next steps.</span>
              </label>
              <label className="flex gap-3">
                <input
                  type="checkbox"
                  checked={consent.marketingOptIn}
                  onChange={(event) => setConsent((prev) => ({ ...prev, marketingOptIn: event.target.checked }))}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-black/45"
                />
                <span>Send occasional product and operations insights.</span>
              </label>
              {attempted && !consent.dataProcessingAccepted ? <p className="text-rose-300">Consent is required to submit.</p> : null}
            </div>

            <button
              type="submit"
              disabled={state.status === 'loading'}
              className="storefront-action storefront-action--primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
            >
              {state.status === 'loading' ? 'Submitting...' : 'Send'}
            </button>
          </>
        ) : (
          <div className="flex items-center justify-between gap-3 pt-1">
            {step > 0 ? (
              <button type="button" onClick={() => handleBack()} className="text-sm text-white/48 transition hover:text-white/80">
                Back
              </button>
            ) : (
              <span />
            )}
            <button type="button" onClick={handleNext} className="storefront-action storefront-action--primary">
              Continue
            </button>
          </div>
        )}
      </div>

      {state.status !== 'idle' ? <p className={state.status === 'error' ? 'text-sm text-rose-300' : 'text-sm text-signal'}>{state.message}</p> : null}
    </form>
  );
}
