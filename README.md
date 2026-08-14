# experiencing-ux

Site for [Experiencing UX](https://experiencingux.org), a grassroots UX &
product community group in Des Moines / Central Iowa.

Currently a landing page for people to stay up to date with what's
happening in the community.

## Stack

- [Astro](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/)
- Deployed as a Cloudflare Worker

## Project structure

```
src/
  components/   Astro components
  layouts/      BaseLayout.astro — shared page shell
  pages/        routes, including the API route behind the signup form
  styles/       global Tailwind styles
public/         static assets
```

## Local development

Requires Node >= 22.12.

```sh
npm install
npm run dev
```

Some data on the homepage comes from an external service, and the signup
form writes to one too. Local dev needs a `.dev.vars` file (gitignored) with
the relevant credentials — ask a maintainer for these rather than requesting
access to any specific service by name.

## Notes on how the homepage is built

The homepage is prerendered at build/deploy time rather than fetching data on
every visitor's page load — this was a deliberate choice to avoid rate limits
on the external data source, since the content it pulls in rarely changes.

**Practical implication:** updating that data at the source does not update
the live site by itself — a maintainer needs to trigger a rebuild/redeploy
for the change to go live.

## Deployment

Deploys are managed through Cloudflare, connected to this repo. There's no
CI config in this repo. Ask a maintainer for deploy access.

To build and preview locally:

```sh
npm run build
npm run preview
```
