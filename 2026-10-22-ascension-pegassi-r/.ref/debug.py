import asyncio
from playwright.async_api import async_playwright

URL = "https://ascension.pegassi.be/"
OUT = "/home/ubuntu/awwwards-exploration/2026-10-22-ascension-pegassi-r/.ref"


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(
            executable_path="/home/ubuntu/.cache/ms-playwright/chromium-1217/chrome-linux/chrome",
            args=["--no-sandbox", "--disable-gpu", "--disable-webgl", "--disable-webgl2", "--disable-3d-apis"],
        )
        pg = await b.new_page(viewport={"width": 1905, "height": 1080}, device_scale_factor=1)
        pg.on("console", lambda m: print("CONSOLE", m.type, m.text[:200]))
        pg.on("pageerror", lambda e: print("PAGEERROR", str(e)[:300]))
        await pg.goto(URL, wait_until="domcontentloaded", timeout=90000)
        await pg.wait_for_timeout(4000)
        info = await pg.evaluate(
            """() => ({
                sh: document.body.scrollHeight,
                html: document.body.innerHTML.length,
                hasCue: !!document.querySelector('[data-cue]'),
                hasTracklist: !!document.querySelector('.tracklist'),
                buttons: [...document.querySelectorAll('button')].map(b=>b.className).slice(0,6),
                nuxtLen: (document.querySelector('#__nuxt')||{}).innerHTML?.length || 0
            })"""
        )
        print("INFO", info)
        await b.close()


asyncio.run(main())
