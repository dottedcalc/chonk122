# chonk122

Interactive explainers for CMU 15-122, live at https://chonk122.com.

Built with Next.js, hosted on Vercel, with sign-in and data in Supabase.

## Run locally

```bash
cp .env.example .env.local   # fill in your Supabase URL and anon key
npm install
npm run dev
```

The site still runs without Supabase keys; sign-in just shows as unavailable.
