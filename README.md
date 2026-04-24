# Portfolio

Personal portfolio site and Berlin summer journal. Built with Next.js, shadcn/ui, and deployed to GitHub Pages.

## Stack

- **Next.js 14** — framework
- **shadcn/ui** — component library
- **Tailwind CSS** — styling
- **gray-matter + next-mdx-remote** — markdown parsing for Berlin journal posts
- **GitHub Pages** — hosting

## Dev

```bash
npm run dev
```

Opens at `http://localhost:3000`.

## Deploy

```bash
npm run deploy
```

Builds the static export and pushes to the `gh-pages` branch.

## Structure

```
app/
├── layout.tsx        # Root layout (nav, fonts)
├── page.tsx          # Home
├── about/            # About page
├── projects/         # Projects page
└── berlin/           # Photo journal
    └── [slug]/       # Individual journal posts
components/
content/
└── berlin/           # Markdown files for journal posts
public/
└── images/           # Static images
```
