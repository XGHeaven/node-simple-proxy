'use strict';

let http = require('http')
let request = require('superagent')
let parse = require('url-parse')
let im = require('gm').subClass({imageMagick: true})

let app = http.createServer((req, res) => {
	let headers = Object.assign({}, req.headers)
	delete headers['host'];

	let url = parse(req.url.slice(1))

	if (url.href === '//favicon.ico' || !url.hostname || url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
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
		if (err) {
			if (err.status) {
				res.writeHead(newRes.status, newRes.header)
			} else {
				res.writeHead(err.status || 500)
			}
			res.end()
			return;
		}

		im(newRes.body)
			.compress('None')
			.toBuffer((err, buffer) => {
				if (err) {
					res.writeHead(500)
					res.end()
					return
				}

				newRes.header['content-length'] = buffer.length
				res.writeHead(newRes.status, newRes.header)
				res.end(buffer)
			})
	})
})

app.listen(process.env.PORT || 8080, () => {
	console.log('listening')
})