# Security Policy

## Supported versions

| Version | Support |
| --- | --- |
| 1.x | Security fixes and compatibility maintenance |
| 0.x | Unsupported |

The AngularJS adapter receives Gardener-side security fixes, but AngularJS itself is end-of-life. Teams using it must assess framework-level risk and maintain a migration plan.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Use the repository host's private security-advisory feature to contact the maintainers. If that feature is unavailable, contact a maintainer privately and ask for a secure reporting channel without including exploit details in the first message.

Include the affected package and version, impact, reproduction steps or proof of concept, known mitigations, and whether the issue is already public. Maintainers aim to acknowledge a complete report within three business days, provide an initial assessment within seven business days, and coordinate disclosure after a fix is available. These are response targets, not a warranty.

Good-faith research that avoids privacy violations, data destruction, service disruption, and access beyond what is necessary to demonstrate the issue is welcome. Please allow reasonable time for remediation before disclosure.

## Security boundaries

Gardener renders and coordinates user-interface behavior. It does not replace server-side authentication, authorization, validation, sanitization, rate limiting, audit logging, or content security policy. Tauri/Electron bridges must expose narrowly scoped commands and must never pass raw Node.js or native objects into untrusted page code.

