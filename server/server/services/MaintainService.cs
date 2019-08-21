using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.services
{
    public class Differance {
        public int id { get; set; }
        public string diff { get; set; }
    }
    public class Shadow {
        public int id { get; set; }
        public string obj { get; set; }
    }
    public class Backup{
        public int id { get; set; }
        public string obj { get; set; }
    }
    public class MaintainService
    {
        public Dictionary<string, Differance> diffVersion;
        public Dictionary<string, Shadow> shadowcopy;
        public Dictionary<string, Backup> backupCopy;
        public string masterCopy;
        public int serverV;
        private diff_match_patch ai;
        public MaintainService() {
            diffVersion =new Dictionary<string, Differance>();
            shadowcopy = new Dictionary<string, Shadow>();
            backupCopy = new Dictionary<string, Backup>();
            this.ai = new diff_match_patch();
            masterCopy = "";
        }
        public void addUser(string connectionId)
        {
            this.shadowcopy.Add(connectionId, new Shadow() { id = serverV, obj = masterCopy });
            this.backupCopy.Add(connectionId, new Backup() { id = serverV, obj = masterCopy });
        }
        public bool apply_diif(string diff,int clientV) {
            lock (this.shadowcopy){
                lock (this.diffVersion) {
                    lock (this.backupCopy){
                        lock (this.masterCopy) {
                            return true;
                        }
                    }
                }
            }
        }
    }
}
