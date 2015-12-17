'use strict';

let http = require('http')
let request = require('superagent')

let app = http.createServer((req, res) => {
	let headers = Object.assign({}, req.headers)
	delete headers['host'];

	console.log(req.url)
	let url = req.url.slice(1)
	console.log(url)
	if (url[0] === '/' && url[1] === '/') url = 'http:' + url
	console.log(url)

	request(url)
	.buffer()
	.set(headers)
	.end((err, newRes) => {

		if (newRes) {
			res.writeHead(newRes.status, newRes.header)
		}

		if (err) {
			res.end()
			return;
		}

		res.end(newRes.body)
	})
})

app.listen(process.env.PORT || 8080, () => {
	console.log('listening')
})