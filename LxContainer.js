'use strict';

module.exports = function(PROXMOX, NODE) {
  class LxContainer {
    constructor(obj) {
      if (obj) {
        Object.assign(this, obj);
      }
    }

    async getStatus() {
      const req = await PROXMOX.request('GET', `/api2/json/nodes/${NODE.name}/lxc/${this.vmId}/status/current`);
      const data = await req.toJson();
      return data.data;
    }

    async clone(obj) {
      return NODE.requestHandleUpid('POST', `/api2/json/nodes/${NODE.name}/lxc/${this.vmId}/clone`, {
        newid: obj.newVmId,
        name: obj.newName,
        full: obj.full ? 1 : 0
      });
    }

    start() {
      return NODE.requestHandleUpid('POST', `/api2/json/nodes/${NODE.name}/lxc/${this.vmId}/status/start`);
    }

    stop() {
      return NODE.requestHandleUpid('POST', `/api2/json/nodes/${NODE.name}/lxc/${this.vmId}/status/stop`);
    }

    shutdown() {
      return NODE.requestHandleUpid('POST', `/api2/json/nodes/${NODE.name}/lxc/${this.vmId}/status/shutdown`);
    }

    suspend() {
      return NODE.requestHandleUpid('POST', `/api2/json/nodes/${NODE.name}/lxc/${this.vmId}/status/suspend`);
    }

    reset() {
      return NODE.requestHandleUpid('POST', `/api2/json/nodes/${NODE.name}/lxc/${this.vmId}/status/reset`);
    }

    delete() {
      return NODE.requestHandleUpid('DELETE', `/api2/json/nodes/${NODE.name}/lxc/${this.vmId}`);
    }

    static async getByVmId(vmId) {
      const req = await PROXMOX.request('GET', `/api2/json/nodes/${encodeURIComponent(NODE.name)}/lxc/${vmId}`);
      await req.toJson();
      return new LxContainer({vmId: vmId});
    }

    static async getAll() {
      const req = await PROXMOX.request('GET', `/api2/json/nodes/${encodeURIComponent(NODE.name)}/lxc`);
      return req.toObjectArray(LxContainer);
    }
  }

  return LxContainer;
};
