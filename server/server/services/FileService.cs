using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace server.services
{
    public interface IFileService {
        void addUser(string ConnectionId);
        void applyPatch(string ConnectionId, string patch);
        Dictionary<string, string> getPatchesForOther(string ConnectionId);
        string getFile();
        string setFile(string msg);
        List<Patcher> getListPatch();
    }
    public class Patcher {
        
        public string user { get; set; }
        public string unpatchS { get; set; }
    }
    public class FileService:IFileService
    {
        private Dictionary<string, string> shadowCopy;
        private string mainCopy = "";
        private diff_match_patch ai;
        private List<Patcher> patchList;
        public FileService() {
            this.shadowCopy = new Dictionary<string, string>();
            this.ai = new diff_match_patch();
            patchList = new List<Patcher>();
            this.mainCopy = "[]";
        }
        public void addUser(string ConnectionId) {
            shadowCopy.Add(ConnectionId, mainCopy);
        }
        public void applyPatch(string ConnectionId, string patch)
        {
            lock (this.shadowCopy)
            {
                string shadow = shadowCopy[ConnectionId];
                List<Patch> p = this.ai.patch_fromText(patch);
                List<Patch> unP = new List<Patch>();
                //depatch creator
                foreach (var j in p)
                {
                    var pat = new Patch();
                    foreach (var i in j.diffs)
                    {
                        Operation op = Operation.EQUAL;
                        if (i.operation == Operation.DELETE)
                        {
                            op = Operation.INSERT;
                        }
                        else if (i.operation == Operation.INSERT)
                        {
                            op = Operation.DELETE;
                        }
                        pat.diffs.Add(new Diff(op, i.text));
                    }
                    pat.length1 = j.length2;
                    pat.length2 = j.length1;
                    pat.start1 = j.start1;
                    pat.start2 = j.start2;
                    unP.Add(pat);
                }

                shadowCopy[ConnectionId] = (string)((this.ai.patch_apply(p, shadow))[0]);
                mainCopy = (string)(this.ai.patch_apply(p, mainCopy))[0];
                var nextcopy = (string)((this.ai.patch_apply(unP, shadowCopy[ConnectionId]))[0]);
                this.patchList.Add(new Patcher() {unpatchS=this.ai.patch_toText(unP),user=ConnectionId});
            }
        }
        public Dictionary<string, string> getPatchesForOther(string ConnectionId) {
            Dictionary<string,string> list = new Dictionary<string, string>();
            foreach (var i in shadowCopy.Keys.ToArray<string>()) {
                if (i != ConnectionId) {
                    var patch = this.ai.patch_toText(this.ai.patch_make(shadowCopy[i], mainCopy));
                    shadowCopy[i] = mainCopy;
                    list.Add(i, patch);
                }
            }
            return list;
        }
        public string getFile() {
            return this.mainCopy;
        }
        public string setFile(string msg) {
            this.mainCopy = msg;
            return "ok";
        }
        public List<Patcher> getListPatch() {
            return this.patchList;
        }
    }
}
