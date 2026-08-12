This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## SolarDev Engineering Agent

The authenticated agent workspace at `/agents/project-development` combines a strong solar/BESS system policy, project context, owner-scoped document retrieval and deterministic tools for DC/AC ratio, land-capacity screening, PV string sizing, BESS duration/container estimates and basic financial metrics.

Configure the variables documented in `.env.example`. On Vercel, AI Gateway can authenticate with OIDC; local development normally uses `AI_GATEWAY_API_KEY`. The default model is configurable through `AI_GATEWAY_MODEL`.

After pulling the agent changes, generate the Prisma client and apply the included migration in the target environment:

```bash
npx prisma generate
npx prisma migrate deploy
```

Project documents currently accept TXT, Markdown, CSV and JSON up to the configured byte limit. Set `SOLARDEV_RAG_API_URL` and `SOLARDEV_RAG_API_TOKEN` to replace the built-in lexical adapter with an external retrieval service later.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
