import { SUPPORT_EMAIL } from 'v2/config';

function formatEmail(email: string, subject: string, body: string): string {
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function formatEmailMarkdown(email: string, subject: string, body: string): string {
  return `[${email}](${formatEmail(email, subject, body)})`;
}

export function formatErrorEmailMarkdown(subject: string, stackTrace: string): string {
  return formatEmailMarkdown(SUPPORT_EMAIL, subject, `Stack Trace: \n ${stackTrace}`);
}
