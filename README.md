# Mohamed Raasim & Wafia — Nikah Invitation Website

A premium, mobile-first Islamic Nikah invitation site built with plain HTML, CSS, and JavaScript. No frameworks, no build step — open `index.html` or deploy straight to GitHub Pages.

## Structure

```
index.html
style.css
script.js
CNAME
assets/
  seal.png
  nasheed.mp3
  mosque.jpg
  share-preview.jpg
```

## Assets

`assets/` now contains your real files:

- **`seal.png`** — your navy floral wax seal, background removed so it floats cleanly over the purple gradient. Also used as the browser favicon.
- **`mosque.jpg`** — your photo of Jamiul Masjid.
- **`nasheed.mp3`** — "Wedding Nasheed" (Muhammad Al Muqit / Jahin Music), ~2:46, plays automatically once the seal is tapped.
- **`share-preview.jpg`** — a generated 1200×630 luxury preview image (gold border, floral corner ornaments, the wax seal, Arabic Bismillah, and the couple's names) used for link previews on WhatsApp, Telegram, Instagram, Facebook, X, and Discord.

If you want to swap any of these later, just replace the file in `assets/` and keep the same filename — no code changes needed.

## Link previews, browser tab & SEO

The `<head>` in `index.html` is fully configured with:

- Browser tab title: `💜 Raasim & Wafia Wedding Digital Invitation`
- `<meta name="description">` for search engines
- Full Open Graph tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`, `og:site_name`) so WhatsApp/Telegram/Instagram/Facebook/Discord all show the same branded card
- Twitter/X card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- Favicon set to `assets/seal.png`

**No GitHub username, repository name, or account name appears anywhere in the site's code or the preview image.** The address bar itself will still show `<username>.github.io/<repo-name>/` unless you attach a custom domain — see **"The URL, your GitHub username, and custom domains"** below for exactly how to fix that.

One optional note: `og:url` is set to a relative `./` so the project works immediately without edits. If you want the *canonical* URL to be fully precise for SEO tools, you can optionally replace it with your live GitHub Pages URL after deploying — but this is not required for link previews to display correctly on WhatsApp, Telegram, Instagram, Facebook, X, or Discord.

## Before you publish

1. Swap in your real `assets/seal.png`, `assets/mosque.jpg`, `assets/nasheed.mp3`, and `assets/share-preview.jpg` if you'd like different ones (the current files are already your real photos/audio plus a generated share-preview image — only the preview image is generated, everything else is yours).
2. Open `index.html` and update the Google Maps embed / button URL — search `(GOOGLE MAP LINK HERE)`-style placeholders were replaced with a query-based Google Maps link for "Jamiul Masjid, Adiyakkamangalam." If you have the venue's exact Google Maps share link, swap it into:
   - the `<iframe src="...">` in Section 4 (Venue), and
   - the `href` of the `#maps-button` link.
3. Double-check the countdown target date/time in `index.html` — it's set to `2026-08-03T12:00:00+05:30` (03 August 2026, 12:00 Noon IST) via the `data-target` attribute on `#countdown`.

## The URL, your GitHub username, and custom domains

This is worth explaining clearly, because it trips a lot of people up:

**The page content and its "GitHub username" are two completely separate things.** Everything this README covers so far (title, favicon, Open Graph, Twitter cards, the share-preview image) controls what people *see* — the tab title, the link preview card, the favicon. None of that reveals your GitHub username, and I've already confirmed there's no mention of it anywhere in the site's HTML/CSS/JS.

**But the address bar is different.** When you deploy to GitHub Pages without a custom domain, the URL is *always*:

```
https://<your-username>.github.io/<repo-name>/
```

This is fixed by how GitHub Pages works — it's a server-level routing rule, not something on the page. **No amount of HTML, CSS, JavaScript, meta tags, or `<title>` changes can rename, mask, or rewrite that URL.** The only way to get a different address (like `raasimwafia.com`) is to own an actual domain name and point it at GitHub Pages.

### Option A — Buy a custom domain (the only way to change the visible URL)

1. Purchase one of these (or any domain you like) from a registrar such as Namecheap, GoDaddy, Google Domains/Squarespace, or Cloudflare:
   - `raasimwafia.com`
   - `raasimwedding.com`
   - `raasimandwafia.com`
   - `raasimwafianikah.com`
2. This project already includes a **`CNAME`** file at the repo root, pre-filled with `raasimwafia.com` as a placeholder. Open it and replace the text with whichever domain you actually purchased (just the bare domain, nothing else — e.g. `raasimwedding.com`, no `https://` or trailing slash).
3. At your domain registrar, add these DNS records (GitHub's current requirements):
   - Four `A` records for the apex domain (`raasimwafia.com`) pointing to:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or a `CNAME` record for `www` pointing to `<your-username>.github.io`
4. In your repo's **Settings → Pages**, confirm the custom domain field shows your domain and wait for the "DNS check successful" status, then enable **Enforce HTTPS**.
5. That's it — your invitation will now load at your own domain, with no GitHub username or repo name visible anywhere, including in the address bar.

**If you haven't purchased a domain yet:** just leave the `CNAME` file as-is or delete it — either way, the site still deploys and works fine at the default `<username>.github.io/<repo-name>/` address in the meantime. GitHub Pages will simply show a "domain not verified" note in Settings until you either add a real, DNS-configured domain to the `CNAME` file or remove it; it won't break your live site.

### Option B — No custom domain (fallback, already fully configured)

If you're fine using the free `github.io` URL for now, you don't need to do anything else — everything is already set up so that:

- The browser tab shows **💜 Raasim & Wafia Wedding Digital Invitation**
- The favicon is your wax seal
- Sharing the link on WhatsApp, Telegram, Instagram, Facebook, X, Discord, or iMessage shows a card titled **Raasim & Wafia Wedding Digital Invitation** with the description and the `share-preview.jpg` image — never your GitHub username or repo name
- The only thing still containing your username is the raw address bar text itself, which is unavoidable without Option A

## Deploying to GitHub Pages

1. Push this folder (including the `CNAME` file) to a GitHub repository.
2. In the repo settings, enable **GitHub Pages** for the root of the `main` branch.
3. Without a custom domain, your invitation will be live at `https://<username>.github.io/<repo-name>/`. With a custom domain (see above), it'll be live at your own domain instead.

## Notes on behavior

- The nasheed attempts to autoplay right after the seal is tapped (a direct user gesture), which browsers generally allow. If a browser still blocks it, guests can start playback with the gold circular music button (bottom-right) — it supports play/pause.
- All section reveal animations run once via `IntersectionObserver` and respect `prefers-reduced-motion`.
- The countdown, cards, and buttons are fully responsive from small phones up through desktop.
