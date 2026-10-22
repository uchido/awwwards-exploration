import asyncio
from playwright.async_api import async_playwright

URL = "https://ascension.pegassi.be/"
OUT = "/home/ubuntu/awwwards-exploration/2026-10-22-ascension-pegassi-r/.ref"
ARGS = [
    "--no-sandbox",
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
]


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(
            executable_path="/home/ubuntu/.cache/ms-playwright/chromium-1217/chrome-linux/chrome",
            args=ARGS,
        )
        pg = await b.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=1)
        pg.on("pageerror", lambda e: print("PAGEERROR", str(e)[:200]))
        await pg.goto(URL, wait_until="domcontentloaded", timeout=120000)
        await pg.wait_for_timeout(6000)
        await pg.mouse.move(720, 450)
        await pg.wait_for_timeout(800)
        await pg.screenshot(path=f"{OUT}/00-intro.png", timeout=120000)
        await pg.mouse.click(720, 450)
        await pg.wait_for_timeout(3000)
        await pg.screenshot(path=f"{OUT}/02-hero.png", timeout=120000)
        h = await pg.evaluate("document.body.scrollHeight")
        print("scrollHeight", h)
        ys = list(range(500, h, 600))
        for i, y in enumerate(ys):
            await pg.evaluate(f"window.scrollTo(0,{y})")
            await pg.wait_for_timeout(2400)
            await pg.screenshot(path=f"{OUT}/s{i:02d}-{y}.png", timeout=120000)
            print("shot", y)
        # hover cue
        await pg.evaluate("window.scrollTo(0,700)")
        await pg.wait_for_timeout(1500)
        el = pg.locator('[data-cue="A1"]').first
        box = await el.bounding_box()
        print("cue box", box)
        if box:
            await pg.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
            await pg.wait_for_timeout(2500)
            await pg.screenshot(path=f"{OUT}/cue-a1.png", timeout=120000)
        # player expand
        await pg.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await pg.wait_for_timeout(1500)
        btns = pg.locator("button", has_text="Ascension - Pegassi")
        if await btns.count():
            await btns.first.click()
            await pg.wait_for_timeout(1800)
            await pg.screenshot(path=f"{OUT}/player-open.png", timeout=120000)
        # mobile
        pg2 = await b.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1, is_mobile=True, has_touch=True)
        await pg2.goto(URL, wait_until="domcontentloaded", timeout=120000)
        await pg2.wait_for_timeout(5000)
        await pg2.screenshot(path=f"{OUT}/m0-intro.png", timeout=120000)
        await pg2.touchscreen.tap(195, 422)
        await pg2.wait_for_timeout(3000)
        await pg2.screenshot(path=f"{OUT}/m1-hero.png", timeout=120000)
        for i, y in enumerate([800, 1600, 2400, 3200, 4000]):
            await pg2.evaluate(f"window.scrollTo(0,{y})")
            await pg2.wait_for_timeout(2000)
            await pg2.screenshot(path=f"{OUT}/m{i+2}-{y}.png", timeout=120000)
        await b.close()


asyncio.run(main())
