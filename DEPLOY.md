# Deploying jayanexus.com on Coolify

The site is a Next.js app built into a small Docker image (`output: "standalone"`).
Every page is pre-rendered at build time. There is no database and no environment variables.

## First deploy

1. In Coolify, **+ New → Application → Public/Private Repository (GitHub)** and pick this repo.
2. **Branch:** `main` (or `redesign/next-site` to preview before merging).
3. **Build pack:** `Dockerfile` (it's in the repo root).
4. **Ports exposed:** `3000`.
5. **Domains:** `https://jayanexus.com,https://www.jayanexus.com`.
   Point the DNS A records for both at the VPS. Coolify issues the Let's Encrypt certificate.
6. **Environment variables:** none.
7. **Deploy.** The first build takes a few minutes (npm install, Next build). The VPS has no GPU and doesn't need one: the 3D hero renders in the visitor's browser.

Health check: the image already includes one (`/robots.txt` on port 3000).

## Updating the site

Push to the deploy branch. With **Auto Deploy** on (the default for GitHub App sources), Coolify rebuilds automatically.
Adding a project is just adding a folder under `public/projects/` (see `PROJECTS.md`) and pushing.

## Switching over from the old site

The old cleaning-services app is kept in `legacy/` and the tag `backup-before-redesign` points at the last commit of the old `main`.
To roll back, redeploy that tag or revert the merge.

## Build notes

- The build downloads the Archivo font from Google Fonts (next/font) and for the social preview images. The build server needs outbound HTTPS.
- To test the image locally:

  ```bash
  docker build -t jayanexus .
  docker run --rm -p 3000:3000 jayanexus
  ```

  Then open http://localhost:3000.
