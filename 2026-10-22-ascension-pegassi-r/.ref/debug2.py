import asyncio
from playwright.async_api import async_playwright

URL = "https://ascension.pegassi.be/"
OUT = "/home/ubuntu/awwwards-exploration/2026-10-22-ascension-pegassi-r/.ref"


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(
            executable_path="/home/ubuntu/.cache/ms-playwright/chromium-1217/chrome-linux/chrome",
            args=[
                "--no-sandbox",
                "--use-gl=angle",
                "--use-angle=swiftshader",
                "--enable-unsafe-swiftshader",
                "--ignore-gpu-blocklist",
            ],
        )
        pg = await b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        pg.on("pageerror", lambda e: print("PAGEERROR", str(e)[:200]))
        await pg.goto(URL, wait_until="domcontentloaded", timeout=120000)
        await pg.wait_for_timeout(6000)
        info = await pg.evaluate(
            """() => ({
                sh: document.body.scrollHeight,
                hasCue: !!document.querySelector('[data-cue]'),
                hasTracklist: !!document.querySelector('.tracklist'),
                gl: (()=>{try{const c=document.createElement('canvas');return !!(c.getContext('webgl2')||c.getContext('webgl'))}catch(e){return false}})()
            })"""
        )
        print("INFO", info)
        await pg.screenshot(path=f"{OUT}/t-intro.png", timeout=120000)
        print("shot ok")
        await b.close()


asyncio.run(main())
