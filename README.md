# Zariyah Tech

**ZariyahTech LLP** is a modern static marketing website for Data Annotation and AI Training Services.

Live site: https://zariyah-tech.vercel.app/

## Overview

ZariyahTech helps organizations build, train, and improve AI models through accurate, scalable, and secure human-in-the-loop data annotation services.

The current website highlights:

- Computer Vision Data Annotation
- NLP Annotation
- Generative AI and LLM Evaluation
- Audio and Speech Annotation
- Data Validation and Quality Assurance
- Industry applications
- Multilingual annotation support
- Quality and security workflows
- Pricing dialog
- Login and signup UI contract for future backend integration

## Project Structure

```text
Zariyah Tech/
└── client/
    ├── assets/
    │   ├── data/
    │   ├── img/
    │   ├── logo/
    │   └── video/
    │
    ├── css/
    │   ├── auth.css
    │   ├── company.css
    │   ├── core.css
    │   ├── dialog.css
    │   ├── effects.css
    │   ├── faq.css
    │   ├── footer.css
    │   ├── hero.css
    │   ├── industries.css
    │   ├── languages.css
    │   ├── marquee.css
    │   ├── navbar.css
    │   ├── notice.css
    │   ├── pricing.css
    │   ├── quality.css
    │   ├── sections.css
    │   └── services.css
    │
    ├── js/
    │   ├── app.js
    │   ├── auth.js
    │   ├── faq.js
    │   ├── footer.js
    │   ├── marquee.js
    │   ├── navbar.js
    │   ├── notice.js
    │   ├── pricing.js
    │   ├── reveal.js
    │   ├── ripple.js
    │   └── services.js
    │
    └── index.html
```

## Run Locally

Because the site uses ES modules, open it through a local server instead of opening `index.html` directly.

### Option 1: Python

```bash
cd client
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

### Option 2: Node.js

Install a tiny static server:

```bash
npm install -g serve
```

Run:

```bash
serve client
```

## Deploying to Vercel

This is a static HTML, CSS, and JavaScript project.

Recommended Vercel settings:

```text
Framework Preset: Other
Root Directory: client
Build Command: None
Output Directory: .
Install Command: None
```

If the files inside `client/` are moved directly to the repository root, then leave Root Directory as the repository root.

## GitHub Push Flow

From the project root:

```bash
git init
git branch -M main
git add .
git commit -m "Deploy Zariyah Tech static site"
git remote add origin https://github.com/<your-username>/Zariyah-Tech.git
git push -u origin main
```

If the remote already exists:

```bash
git remote -v
git remote set-url origin https://github.com/<your-username>/Zariyah-Tech.git
git push -u origin main
```

## Important Notes

- This is currently a static frontend.
- The login and signup modal is a frontend contract only.
- Pricing interactions emit frontend events for later backend integration.
- Documentation, Privacy, and Terms links are placeholders until those pages are added.
- Do not store authentication tokens in browser `localStorage` when backend integration begins.

## Planned Backend Direction

The next major backend phase is expected to use:

- TypeScript
- Node.js
- NestJS
- PostgreSQL
- Prisma
- Secure HTTP-only cookies
- Short-lived access tokens
- Refresh-session rotation
- Google, Apple, and GitHub OAuth/OIDC
- Profile CRUD
- Postman and automated API testing

## License

All rights reserved by ZariyahTech LLP.
