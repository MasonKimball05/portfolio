# Portfolio

Personal portfolio site. Built with Next.js, shadcn/ui, and deployed to GitHub Pages.

## Stack

- **Next.js 14** — framework
- **shadcn/ui** — component library
- **Tailwind CSS** — styling
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
└── skills/           # Skills page
components/
public/
└── images/           # Static images
archive/
└── berlin/           # Unlinked — old Berlin journal (gray-matter/MDX practice), not built into the site
```
