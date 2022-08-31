import { SUPPORT_EMAIL } from '@config';

import {
  formatEmailMarkdown,
  formatErrorEmail,
  formatErrorEmailMarkdown,
  formatSupportEmail
} from './emailFormatter';

const email = SUPPORT_EMAIL;
const subject = 'Error: StackTrace';
const stackTrace = `Stack Trace: \n test stack trace`;
const body = 'test body';

describe('Formats emails', () => {
  it('formats email markdown correctly', () => {
    const emailMarkdown = formatEmailMarkdown(email, subject, body);
    const result = `[${email}](mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)})`;

    expect(emailMarkdown).toEqual(result);
  });
  it('formats support email correctly', () => {
    const supportEmail = formatSupportEmail(subject, body);
    const result = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    expect(supportEmail).toEqual(result);
  });
  it('formats error email correctly', () => {
    const errorEmail = formatErrorEmail(subject, stackTrace);
    const result = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(`Stack Trace: \n ${stackTrace}`)}`;

    expect(errorEmail).toEqual(result);
  });
  it('formats error email markdown correctly', () => {
    const errorEmailMarkdown = formatErrorEmailMarkdown(subject, stackTrace);
    const result = `[${email}](mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(`Stack Trace: \n ${stackTrace}`)})`;

    expect(errorEmailMarkdown).toEqual(result);
  });
});
