const oohttp = require('oohttp');

class Proxmox {

	constructor(obj) {

		this.port = 8006;
		this.ticketTime = null;

		if (obj) {
			Object.assign(this, obj);
		}

		this.http = new oohttp.Base();
		this.http.headers['content-type'] = 'application/x-www-form-urlencoded';
		this.http.rejectUnauthorized = false;
		this.http.autoContentLength = true;

		this.Node = require('./Node.js')(this);

	}

	login() {

		let req = this.http.request('POST', `https://${this.hostname}:${this.port}/api2/json/access/ticket`);
		return req.toJson({
			password: this.password,
			username: this.username
		}).then((data) => {

			this.ticketTime = Date.now();
			this.http.headers.Cookie = `PVEAuthCookie=${encodeURIComponent(data.data.ticket)}`;
			this.http.headers.CSRFPreventionToken = data.data.CSRFPreventionToken;

		});

	}

}

module.exports = Proxmox;
