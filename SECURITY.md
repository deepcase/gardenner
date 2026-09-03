# Security Policy

## Supported versions

| Version | Support |
| --- | --- |
| 2.x | Security fixes and compatibility maintenance |
| 1.x | Critical security fixes through 2027-03-31 |
| 0.x | Unsupported |

The AngularJS adapter is a legacy migration bridge. It receives Gardenerim-side security fixes through the 2.x line, but AngularJS itself is end-of-life and has known unresolved upstream advisories. Do not start new applications with it. Existing users should apply a strict content security policy, avoid compiling untrusted templates, and migrate to Vue, React, Blazor, or the framework-neutral runtime.

Release CI runs dependency review, CodeQL, npm and NuGet vulnerability checks, package-signature verification, secret scanning, and CycloneDX SBOM generation. The AngularJS audit has one explicit exception: unresolved vulnerabilities reported directly against the end-of-life `angular` package. Any additional affected package or any newly available fix fails CI.

## Reporting a vulnerability

Do not open a public issue for a suspected vulnerability. Use the repository host's private security-advisory feature to contact the maintainers. If that feature is unavailable, contact a maintainer privately and ask for a secure reporting channel without including exploit details in the first message.

Include the affected package and version, impact, reproduction steps or proof of concept, known mitigations, and whether the issue is already public. Maintainers aim to acknowledge a complete report within three business days, provide an initial assessment within seven business days, and coordinate disclosure after a fix is available. These are response targets, not a warranty.

Good-faith research that avoids privacy violations, data destruction, service disruption, and access beyond what is necessary to demonstrate the issue is welcome. Please allow reasonable time for remediation before disclosure.

## Security boundaries

Gardenerim renders and coordinates user-interface behavior. It does not replace server-side authentication, authorization, validation, sanitization, rate limiting, audit logging, or content security policy. Tauri/Electron bridges must expose narrowly scoped commands and must never pass raw Node.js or native objects into untrusted page code.
