'use strict';

module.exports = function(PROXMOX) {
	class Node {
		constructor(obj) {
			if (obj) {
				Object.assign(this, obj);
			}

			this.Qemu = require('./Qemu.js')(PROXMOX, this);
			this.LxContainer = require('./LxContainer.js')(PROXMOX, this);
			this.Task = require('./Task.js')(PROXMOX, this)
		}

		startAll(obj) {
			return this.requestHandleUpid('POST', `/api2/json/nodes/${NODE.name}/startall`, {
				force: !!obj.force
			});
		}

		stopAll() {
			return this.requestHandleUpid('POST', `/api2/json/nodes/${NODE.name}/stopall`);
		}

		async requestHandleUpid(method, reqUrl, data) {
			return new Promise(async (resolve, reject) => {
				try {
					const req = await PROXMOX.request(method, reqUrl);
					const upid = (await req.toJson(data)).data;
					const task = await this.Task.getByUpid(upid);

					let statusInterval;

					const handleStatus = async () => {
						const status = await task.getStatus();
						if (status && status.status === 'stopped') {
							clearInterval(statusInterval);

							if (status.exitstatus === 'OK') {
								resolve(status);
							} else {
								reject(new Error(status.exitstatus));
							}
							
							return true;
						}
						return false;
					}

					if(!await handleStatus()) {
						statusInterval = setInterval(handleStatus, 1000);
					}
				} catch(err) {
					reject(err);
				}
			});
		}

		static async getAll() {
			const req = await PROXMOX.request('GET', `/api2/json/nodes`);
			return req.toObjectArray(Node);
		}

		static async getByName(name) {
			const req = await PROXMOX.request('GET', `/api2/json/nodes/${name}`);
			await req.toJson();
			return new Node({
				name: name
			});
		}
	}

	return Node;
};
