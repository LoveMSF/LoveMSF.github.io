# LoveMSF — Developer Portfolio

A responsive personal portfolio for Artem (LoveMSF), built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and Lucide icons. The visual system draws on Nothing OS industrial minimalism with an OLED black theme, Nothing Red status accents, and a light mode toggle.

## Development

```bash
pnpm install
pnpm dev
```

## Production build

```bash
pnpm build
```

## GitHub Pages

The GitHub Actions workflow in `.github/workflows/deploy.yml` builds and deploys on every push to `main` and on manual dispatch. Set the repository's Pages source to **GitHub Actions**. Vite uses a relative base path so assets work on GitHub Pages.

The portfolio fetches the public `LoveMSF` profile and repositories from the GitHub API. Static profile and project data remain visible if the API is unavailable or rate-limited.
