import fetch from 'node-fetch'

async function checkSitemap() {
  try {
    const res = await fetch('http://localhost:3000/sitemap.xml')
    const text = await res.text()
    console.log('--- SITEMAP.XML PREVIEW ---')
    console.log(text.slice(0, 2000))
  } catch (err) {
    console.error('Error fetching sitemap:', err)
  }
}

checkSitemap()
