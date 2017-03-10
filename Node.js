module.exports = function(PROXMOX) {

	class Node {

		constructor(obj) {

			if (obj) {
				Object.assign(this, obj);
			}

			this.Qemu = require('./Qemu.js')(PROXMOX, this);

		}

		getQemus() {

			let req = PROXMOX.http.request('GET', `https://${PROXMOX.hostname}:${PROXMOX.port}/api2/json/nodes/${encodeURIComponent(this.name)}/qemu`);
			return req.toObjectArray(this.Qemu);

		}

		getQemuByVmId(vmId) {

			let req = PROXMOX.http.request('GET', `https://${PROXMOX.hostname}:${PROXMOX.port}/api2/json/nodes/${encodeURIComponent(this.name)}/qemu/${vmId}`);
			return req.toJson().then(() => {
				return new this.Qemu({vmId: vmId});
			});

		}

		static getAll() {

			let req = PROXMOX.http.request('GET', `https://${PROXMOX.hostname}:${PROXMOX.port}/api2/json/nodes`);
			return req.toObjectArray(Node);

		}

		static getByName(name) {

			let req = PROXMOX.http.request('GET', `https://${PROXMOX.hostname}:${PROXMOX.port}/api2/json/nodes/${name}`);
			return req.toJson().then(() => {
				return new Node({
					name: name
				});
			});

		}

	}

	return Node;

};
