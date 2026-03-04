![GitHub package.json version](https://img.shields.io/github/package-json/v/{{ githubUsername }}/{{ pluginSlug }}?color=informational) ![GitHub last commit](https://img.shields.io/github/last-commit/{{ githubUsername }}/{{ pluginSlug }}?color=informational) ![GitHub](https://img.shields.io/github/license/{{ githubUsername }}/{{ pluginSlug }}?color=informational)

# {{ pluginName }}

<!-- Describe what your plugin does in 2-3 sentences -->
{{ pluginName }} is a Figma plugin that helps you...

<!-- Optional: Add context about why you built this plugin -->
<!-- The idea behind this plugin comes from... -->

## Features

<!-- List the main features of your plugin -->
This plugin allows you to:
- Feature 1 description
- Feature 2 description
- Feature 3 description
- Feature 4 description
- Feature 5 description

## Documentation

<!-- If you have documentation, add the link here -->
<!-- The full documentation is available at [your-docs-url.com](https://your-docs-url.com) -->

## Contribution

### Community
<!-- Optional: Add your community/feedback link -->
<!-- Ask questions, submit your ideas or requests on [your-feedback-platform](https://your-feedback-url) -->

### Issues
Have you encountered a bug? Could a feature be improved?
Go to the `Issues` section and browse the existing tickets or create a new one.

### Development
- Clone this repository (or fork it)
- Install dependencies with `npm install`
- Run `npm run start:dev` to watch in development mode
- Run `npm run start:ext` to run the external services such as the workers and the auth lobby
- Go to Figma, then `Plugins` > `Development` > `Import plugin from manifest…` and choose `manifest.json` in the repository
- Create a `Branch` and open a `Pull Request`
- _Let's do this_

### Beta test
- Go to the `Actions` section and access the build workflow
- Click `Run workflow`, then select a branch and confirm
- Wait a minute, and once finished, download the artifact (which is a ZIP file containing the plugin)
- Go to Figma, then `Plugins` > `Development` > `Import plugin from manifest…` and choose `manifest.json` in the unzipped folder
- _Enjoy!_

---

## Built with Unoff

This plugin was built using [Unoff](https://unoff.dev), a powerful framework for creating production-ready Figma plugins with enterprise-grade features.

Scaffolded with [`@unoff/cli`](https://github.com/yelbolt/unoff-cli) — `npx @unoff/cli create figma-plugin`

### Technologies & Packages

**UI & Components**
- [@unoff/ui](https://github.com/a-ng-d/unoff-ui) - Pre-built UI components designed for Figma plugins

**Authentication & Database**
- [Supabase](https://supabase.com) - Backend as a Service for authentication and database

**Licensing & Payments**
- [LemonSqueezy](https://lemonsqueezy.com) - License management and payments

**Monitoring & Analytics**
- [Sentry](https://sentry.io) - Error tracking and performance monitoring
- [Mixpanel](https://mixpanel.com) - Product analytics and user behavior tracking

**Content & Communication**
- [Notion](https://notion.so) - CMS for announcements and onboarding
- Cloudflare Workers - Proxy layer for Notion API (auth + CORS)

**Localization**
- [Tolgee](https://tolgee.io) - Translation management and i18n

**Privacy**
- Cookie consent management for Mixpanel tracking

---

<!-- Optional: Add attribution to libraries or inspirations -->
<!-- ## Attribution
- Technology/Library used thanks to [author](link)
-->

<!-- Optional: Add support/sponsor links -->
<!-- ## Support
- [Follow on LinkedIn](https://linkedin.com/...)
- [Support the author](https://ko-fi.com/...)
-->
