module.exports = function(PROXMOX, NODE) {

	class Qemu {

		constructor(obj) {

			if (obj) {
				Object.assign(this, obj);
			}

		}

		getStatus() {

			let req = PROXMOX.http.request('GET', `https://${PROXMOX.hostname}:${PROXMOX.port}/api2/json/nodes/${NODE.name}/qemu/${this.vmId}/status/current`);
			return req.toJson().then((data) => {
				return data.data;
			});

		}

		clone(obj) {

			let req = PROXMOX.http.request('POST', `https://${PROXMOX.hostname}:${PROXMOX.port}/api2/json/nodes/${NODE.name}/qemu/${this.vmId}/clone`);
			return req.toJson({
				newid: obj.newVmId,
				name: obj.newName,
				full: obj.full ? 1 : 0
			});

		}

		start() {

			let req = PROXMOX.http.request('POST', `https://${PROXMOX.hostname}:${PROXMOX.port}/api2/json/nodes/${NODE.name}/qemu/${this.vmId}/status/start`);
			return req.toJson();

		}

		stop() {

			let req = PROXMOX.http.request('POST', `https://${PROXMOX.hostname}:${PROXMOX.port}/api2/json/nodes/${NODE.name}/qemu/${this.vmId}/status/stop`);
			return req.toJson();

		}

		shutdown() {

			let req = PROXMOX.http.request('POST', `https://${PROXMOX.hostname}:${PROXMOX.port}/api2/json/nodes/${NODE.name}/qemu/${this.vmId}/status/shutdown`);
			return req.toJson();

		}

		delete() {

			let req = PROXMOX.http.request('DELETE', `https://${PROXMOX.hostname}:${PROXMOX.port}/api2/json/nodes/${NODE.name}/qemu/${this.vmId}`);
			return req.toJson();

		}

	}

	return Qemu;

};
