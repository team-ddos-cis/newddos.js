const playwright = require('playwright');
const colors = require('colors');

process.on('uncaughtException', function(er) {
    //console.log(er);
});
process.on('unhandledRejection', function(er) {
    //console.log(er);
});

const susDetection = {
	"js": [{
		"name": "CloudFlare",
		"navigations": 2,
		"locate": "<h2 class=\"h2\" id=\"challenge-running\">"
	}, {
		"name": "React",
		"navigations": 1,
		"locate": "Check your browser..."
	}, {
		"name": "DDoS-Guard",
		"navigations": 1,
		"locate": "DDoS protection by DDos-Guard"
	}, {
		"name": "VShield",
		"navigations": 1,
		"locate": "fw.vshield.pro/v2/bot-detector.js"
	}, {
		"name": "GameSense",
		"navigations": 1,
		"locate": "<title>GameSense</title>"
	}]
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function log(string) {
	let d = new Date();
	let hours = (d.getHours() < 10 ? '0' : '') + d.getHours();
	let minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
	let seconds = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
	console.log(`(${hours}:${minutes}:${seconds}) ${string}`);
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function cookiesToStr(cookies) {
	if (Array.isArray(cookies)) {
		return cookies.reduce((prev, {
			name,
			value
		}) => {
			if (!prev) return `${name}=${value}`;
			return `${prev}; ${name}=${value}`;
		}, "");
		return "";
	}
}

function findJs(argument) {
	for (let i = 0; i < susDetection['js'].length; i++) {
		if (argument.includes(susDetection['js'][i].locate)) {
			return susDetection['js'][i]
		}
	}
}

function solverInstance(args) {
	return new Promise((resolve, reject) => {
		log('['.red + 'Onion'.white + 'suck'.red + '] '.white +  'Browser (Firefox)'.red + ' -> '.white + 'created.'.red);

		playwright.firefox.launch({
      proxy: {
        server: args.Proxy
      }, 
      headless: true,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: [
        "--disable-extensions",
        "--enable-automation"
      ],
      args: [
        `--proxy-server=http://${args.proxy}`,
        '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
        '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
        `--window-size=1920,1080`,
        "--window-position=000,000",
        "--disable-dev-shm-usage",
		'--no-sandbox',
		'--disable-setuid-sandbox',
		'--disable-infobars',
		'--no-zygote',
		'--ignore-certificate-errors',
		'--ignore-certificate-errors-skip-list',
		'--disable-dev-shm-usage',
		'--disable-accelerated-2d-canvas',
		'--disable-gpu',
		'--hide-scrollbars',
		'--disable-notifications',
		'--disable-background-timer-throttling',
		'--disable-backgrounding-occluded-windows',
		'--disable-breakpad',
		'--disable-component-extensions-with-background-pages',
		'--disable-extensions',
		'--disable-features=TranslateUI,BlinkGenPropertyTrees',
		'--disable-ipc-flooding-protection',
		'--disable-renderer-backgrounding',
		'--enable-features=NetworkService,NetworkServiceInProcess',
		'--force-color-profile=srgb',
		'--metrics-recording-only',
		'--mute-audio',
		'--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
		'--disable-blink-features',
		'--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
		'--disable-blink-features=AutomationControlled'
      ]

	  }).then(async(browser) => {
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(60000);
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false
        });
      })
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'platform', {
          get: () => 'Win32'
        });
      })

			try {
				await page.goto(args.Target);
			} catch (e) {
				console.log('[info] '.yellow + `Failed with ${args.Proxy}`.red)

				await browser.close();
				reject(e);
			}

			const geoblock = await page.title();
            if (geoblock == "Access denied") {
            console.log('['.red + 'Onion'.white + 'suck'.red + ']' + 'PROXY GEO' + args.proxy + '[BLOCKED]');
            browser.close();
           }
         
            const ua = await page.evaluate(
				() => navigator.userAgent
			);
			log('['.red + 'Onion'.white + 'suck'.red + '] '.white + 'Browser got User-Agent'.red + ' -> '.white + `${ua}`.red)
			
			
			const source = await page.content();
			const JS = await findJs(source);

			if (JS) {
				log('['.red + 'Onion'.white + 'suck'.red + '] '.white + `Browser detected`.red + ` -> `.white + `(${JS.name})`.red);

				if (JS.name == "VShield") {
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.down();
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(100), randomIntFromInterval(100));
					await page.mouse.up();
				}

				for (let i = 0; i < JS.navigations; i++) {
					var [response] = await Promise.all([
						page.waitForNavigation(),
					])

					log('['.red + 'Onion'.white + 'suck'.red + '] '.white + 'Browser waiting navigations'.red + ' -> '.white + `${i}`.red)
				}
			} else {
				log('['.red + 'Onion'.white + 'suck'.red + '] '.white + 'No JS/Captcha'.red)
			}

	//////////////////////////////////////////////////////////////////////////////////////

			const source2 = await page.content();
			const JS2 = await findJs(source2);

			if (JS2) {
				log('['.red + 'Onion'.white + 'suck'.red + '] '.white + `Browser detected`.red + ` -> `.white + `(${JS2.name})`.red);

				if (JS2.name == "VShield") {
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.down();
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(0), randomIntFromInterval(100));
					await page.mouse.move(randomIntFromInterval(100), randomIntFromInterval(100));
					await page.mouse.up();
				}

				for (let i = 0; i < JS2.navigations; i++) {
					var [response] = await Promise.all([
						page.waitForNavigation(),
					])

					log('['.red + 'Onion'.white + 'suck'.red + '] '.white + 'Browser waiting navigations'.red + ' -> '.white + `${i}`.red)
				}
			} else {
				log('['.red + 'Onion'.white + 'suck'.red + '] '.white + 'No JS/Captcha'.red)
			}			


			const cookies = cookiesToStr(await page.context().cookies());
			const titleParsed = await page.title();

			log('['.red + 'Onion'.white + 'suck'.red + '] '.white + 'Browser got Cookies'.red + ' -> '.white + `${cookies}`.red)
			log('['.red + 'Onion'.white + 'suck'.red + '] '.white + 'Browser got Title'.red + ' -> '.white + `${titleParsed}`.red)

			await browser.close();
			resolve(cookies);
		})
	})
}

module.exports = {
	solverInstance: solverInstance
};