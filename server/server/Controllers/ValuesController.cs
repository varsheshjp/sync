using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using server.services;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private IFileService _service;
        public ValuesController(IFileService service) {
            this._service = service;
        }
        // GET api/values
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "value1", "value2" };
        }
        [HttpGet("file")]
        public ActionResult<IEnumerable<string>> File()
        {
            string text = this._service.getFile();
            Console.WriteLine("                 +++++ " + text);
            var a = (new List<string>());
            a.Add(text);
            return a;
        }
        [HttpPut("fileUp")]
        public ActionResult<string> FileU(string msg) {
            return this._service.setFile(msg);
        }
        [HttpGet("patchlist")]
        public ActionResult<List<Patcher>> patchFile()
        {
            return this._service.getListPatch();
        }
    }
}
