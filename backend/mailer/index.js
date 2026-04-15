const nodemailer = require('nodemailer');
const he = require('he');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((err) => {
  if (err) console.error('SMTP connection failed:', err.message);
  else console.log('SMTP ready');
});

// ── FIX 1 + FIX 7: Sanitize all user input before inserting into HTML ────────
// he.encode() converts < > " ' & into HTML entities so injected HTML/JS
// is displayed as plain text instead of being parsed by the browser or
// email client. This prevents both Stored XSS and Email Template Injection.
function safe(value) {
  if (value === null || value === undefined) return '—';
  return he.encode(String(value));
}

function resolveRecipient(inquiryType) {
  if (!inquiryType) return process.env.EMAIL_INFO;
  const t = inquiryType.toLowerCase();
  if (t.includes('career')) return process.env.EMAIL_HR;
  return process.env.EMAIL_INFO;
}

// ── Send contact form email ───────────────────────────────────────────────────
async function sendContactEmail({ name, email, org, subject, inquiryType, message }, file = null) {
  const to = resolveRecipient(inquiryType);
  const attachments = [];

  if (file) {
    attachments.push({
      filename: file.originalname,
      content: file.buffer,
    });
  }

  await transporter.sendMail({
    from: `"Wingspann Website" <${process.env.SMTP_USER}>`,
    to,
    replyTo: email,
    subject: `[Contact] ${safe(subject || inquiryType || 'New enquiry')} - ${safe(name)}`,
    html: `
      <h2 style="font-family:sans-serif;color:#1a1a1a">New contact form submission</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px;font-weight:600;width:140px">Name</td><td style="padding:6px 12px">${safe(name)}</td></tr>
        <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:600">Email</td><td style="padding:6px 12px"><a href="mailto:${safe(email)}">${safe(email)}</a></td></tr>
        <tr><td style="padding:6px 12px;font-weight:600">Organisation</td><td style="padding:6px 12px">${safe(org)}</td></tr>
        <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:600">Inquiry type</td><td style="padding:6px 12px">${safe(inquiryType)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600">Subject</td><td style="padding:6px 12px">${safe(subject)}</td></tr>
        <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:600;vertical-align:top">Message</td><td style="padding:6px 12px;white-space:pre-wrap">${safe(message)}</td></tr>
      </table>
      ${file ? `<p style="font-family:sans-serif;font-size:13px;color:#666">File attached: ${safe(file.originalname)}</p>` : ''}
    `,
    attachments,
  });

  return to;
}

// ── Send career application email ─────────────────────────────────────────────
async function sendApplyEmail({ name, email, phone, position, department, coverLetter }, resumePath) {
  const attachments = [];
  if (resumePath) attachments.push({ path: resumePath });

  await transporter.sendMail({
    from: `"Wingspann Website" <${process.env.SMTP_USER}>`,
    to: process.env.EMAIL_HR,
    replyTo: email,
    subject: `[Application] ${safe(position)} — ${safe(name)}`,
    html: `
      <h2 style="font-family:sans-serif;color:#1a1a1a">New job application</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
        <tr><td style="padding:6px 12px;font-weight:600;width:140px">Name</td><td style="padding:6px 12px">${safe(name)}</td></tr>
        <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:600">Email</td><td style="padding:6px 12px"><a href="mailto:${safe(email)}">${safe(email)}</a></td></tr>
        <tr><td style="padding:6px 12px;font-weight:600">Phone</td><td style="padding:6px 12px">${safe(phone)}</td></tr>
        <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:600">Position</td><td style="padding:6px 12px">${safe(position)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:600">Department</td><td style="padding:6px 12px">${safe(department)}</td></tr>
        <tr style="background:#f5f5f5"><td style="padding:6px 12px;font-weight:600;vertical-align:top">Cover letter</td><td style="padding:6px 12px;white-space:pre-wrap">${safe(coverLetter)}</td></tr>
      </table>
      ${resumePath ? '<p style="font-family:sans-serif;font-size:13px;color:#666">Resume attached.</p>' : '<p style="font-family:sans-serif;font-size:13px;color:#666">No resume uploaded.</p>'}
    `,
    attachments,
  });
}

module.exports = { sendContactEmail, sendApplyEmail };
