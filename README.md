# 5등급제 내신대학찾기

Korean university and major recommendation web app for high-school students using the 2022 revised curriculum and a 5-grade 내신 scale.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://127.0.0.1:3000`.

## Deploy to Vercel

This project is ready for Vercel deployment.

1. Push this folder to a GitHub repository.
2. Go to `https://vercel.com/new`.
3. Import the GitHub repository.
4. Use the default Next.js settings.
5. Deploy.

Vercel settings:

```text
Framework Preset: Next.js
Install Command: pnpm install
Build Command: pnpm build
Output Directory: .next
```

## Data status

The app uses bundled local JSON data in `data/universities.json` and `data/majors.json`. Replace these files with verified admission data before using the service for real counseling.
