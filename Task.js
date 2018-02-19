'use strict';

module.exports = function(PROXMOX, NODE) {
  class Task {
    constructor(obj) {
      if (obj) {
        Object.assign(this, obj);
      }
    }

    async getStatus() {
      const req = await PROXMOX.request('GET', `/api2/json/nodes/${encodeURIComponent(NODE.name)}/tasks/${encodeURIComponent(this.upid)}/status`);
      return (await req.toJson()).data;
    }

    static async getAll() {
      const req = await PROXMOX.request('GET', `/api2/json/nodes/${encodeURIComponent(NODE.name)}/tasks`);
      return req.toObjectArray(Task);
    }

    static async getByUpid(upid) {
      const req = await PROXMOX.request('GET', `/api2/json/nodes/${encodeURIComponent(NODE.name)}/tasks/${encodeURIComponent(upid)}`);
      await req.toJson();
      return new Task({upid});
    }
  }

  return Task;
};
