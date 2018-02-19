'use strict';

const oohttp = require('oohttp');

class Proxmox {
  constructor(obj) {
    this.port = 8006;
    this.ticketTime = null;
    this.ticket = null;

    if (obj) {
      Object.assign(this, obj);
    }

    this.http = new oohttp.Base({
      url: {
        hostname: this.hostname,
        port: this.port,
        protocol: 'https',
      },
      rejectUnauthorized: false,
      autoContentLength: true
    });
    this.http.headers['content-type'] = 'application/x-www-form-urlencoded';

    this.Node = require('./Node.js')(this);
  }

  async request(method, reqUrl) {
    if (!this.ticketTime || Date.now() - this.ticketTime > 3600000) {
      await this.login(this.username, this.ticket || this.password);
    }
    return this.http.request(method, reqUrl);
  }

  async login(username, password) {
    if (username) {
      this.username = username;
    }
  
    const req = this.http.request('POST', `/api2/json/access/ticket`);
    const data = await req.toJson({
      username: this.username,
      password: password || this.password
    });

    this.ticketTime = Date.now();
    this.ticket = data.data.ticket;
    this.http.headers.Cookie = `PVEAuthCookie=${encodeURIComponent(this.ticket)}`;
    this.http.headers.CSRFPreventionToken = data.data.CSRFPreventionToken;
  }
}

module.exports = Proxmox;
