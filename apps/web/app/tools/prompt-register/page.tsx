import type { Metadata } from 'next';
import Link from 'next/link';
import { PromptRegister } from '@/components/prompt-register';

export const metadata: Metadata = {
  title: 'AI Production Prompt Register',
  description: 'A searchable MBMApps utility with 100 workflows for turning references, screenshots, documents, and data into interfaces, code, and design records.',
  alternates: { canonical: '/tools/prompt-register' }
};

export default function PromptRegisterPage() {
  return (
    <>
      <div className="sr-only"><Link href="/tools">Back to MBMApps tools</Link></div>
      <PromptRegister />
    </>
  );
}
