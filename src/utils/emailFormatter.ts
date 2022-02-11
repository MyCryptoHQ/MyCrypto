import { SUPPORT_EMAIL } from '@config';

function formatEmail(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function formatEmailMarkdown(email: string, subject: string, body: string): string {
  return `[${email}](${formatEmail(email, subject, body)})`;
}

export function formatSupportEmail(subject: string, body: string = ''): string {
  return formatEmail(SUPPORT_EMAIL, subject, body);
}

export function formatErrorEmail(subject: string, stackTrace?: string): string {
  return formatEmail(SUPPORT_EMAIL, subject, `Stack Trace: \n ${stackTrace}`);
}

export function formatErrorEmailMarkdown(subject: string, stackTrace: string): string {
  return formatEmailMarkdown(SUPPORT_EMAIL, subject, `Stack Trace: \n ${stackTrace}`);
}
