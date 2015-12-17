'use strict';

let http = require('http')
let request = require('superagent')
let parse = require('url-parse')

let app = http.createServer((req, res) => {
	let headers = Object.assign({}, req.headers)
	delete headers['host'];

	let url = parse(req.url.slice(1))

	if (!url.hostname || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
		res.writeHead(404)
		res.end()
		return;
	}

	url.protocol || url.set('protocol', 'http:')

	console.log(url.toString())

	request(url.toString())
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