using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using server.services;

namespace server.Hubs
{
    public class SyncHub: Hub
    {
        private IFileService _service;
        public SyncHub(IFileService service) {
            this._service = service;
        }
        public override Task OnConnectedAsync()
        {
            this._service.addUser(Context.ConnectionId);
            return base.OnConnectedAsync();
        }
        public async void PatchFromClient(string patch) {
            this._service.applyPatch(Context.ConnectionId, patch);
            var patches=this._service.getPatchesForOther(Context.ConnectionId);
            var keys = patches.Keys;
            foreach (var id in keys) {
                await this.Clients.Client(id).SendAsync("PatchFromServer", patches[id]);
            }
        }
    }
}
