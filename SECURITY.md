# Security Policy

## Supported Scope

Security reports are accepted for:

- `frontend/Youtube-Web/youtube-redesign-web`
- `backend-custom/Youtube-Redesign-Backend`
- `backend-firebase` templates
- `backend-supabase` templates

## Reporting a Vulnerability

Please report vulnerabilities privately to project maintainers.
Do not open public issues for active vulnerabilities.

Include:

- Affected file/component
- Reproduction steps
- Impact assessment
- Suggested fix (if available)

## Secret Management Rules

- Never commit `.env` files.
- Never hardcode credentials in source files.
- Use `.env.example` templates with placeholder values only.

## Disclosure Process

- Acknowledge report
- Validate impact
- Ship patch
- Publish advisory notes after fix is available
