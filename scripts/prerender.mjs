// Runs after the client + SSR builds (see "build" in package.json):
//   1. renders the app to HTML and injects it into dist/index.html, so crawlers
//      and the first paint get real content instead of an empty <div id="root">
//   2. writes dist/sitemap.xml with today's date as <lastmod>
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SITE_URL = 'https://www.ayushraj.live/'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const ssrDir = path.join(root, 'dist-ssr')

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)

const indexPath = path.join(dist, 'index.html')
const template = fs.readFileSync(indexPath, 'utf8')
const marker = '<div id="root"></div>'
if (!template.includes(marker)) throw new Error(`prerender: ${marker} not found in dist/index.html`)

const appHtml = render()
fs.writeFileSync(indexPath, template.replace(marker, `<div id="root">${appHtml}</div>`))

const today = new Date().toISOString().slice(0, 10)
fs.writeFileSync(
  path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}</loc>
    <lastmod>${today}</lastmod>
  </url>
</urlset>
`,
)

fs.rmSync(ssrDir, { recursive: true, force: true })
console.log(`prerender: injected ${(appHtml.length / 1024).toFixed(1)} kB of HTML, wrote sitemap.xml`)
