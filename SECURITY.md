# Security Policy

## Supported Versions

This project is a statically rendered site with no backend, no database, and no user accounts. Security fixes are applied to the `main` branch only.

## Reporting a Vulnerability

Please do not open a public issue for a security problem.

Report it through GitHub's private vulnerability reporting on the [Security tab](https://github.com/tornike14/visualizejs/security/advisories/new). That channel is private between you and the maintainer.

Include what you found, the steps to reproduce it, and the impact you think it has. You can expect an initial response within 7 days.

## Scope

The site renders trusted content that ships in the repository and runs entirely in the browser. The areas most worth attention:

- **Sandbox mode.** Several topics parse and interpret user-supplied JavaScript with Acorn to drive the visualization. Code is analyzed rather than executed, so a report showing user input escaping that boundary and reaching real execution is in scope.
- **Dependency vulnerabilities** with a demonstrated path to exploitation in this app.
- **Cross-site scripting** through any rendered content.

Out of scope: findings that only apply to a self-hosted fork's own deployment configuration, and automated scanner output with no working proof of concept.
