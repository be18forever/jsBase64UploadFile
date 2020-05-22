using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using jsBase64Upload.Models;
using System.IO;
using jsBase64Upload.Interface;

namespace jsBase64Upload.Controllers
{
    public class HomeController : Controller
    {
        private IPathProvider pathProvider;

        public HomeController(IPathProvider pathProvider)
        {
            this.pathProvider = pathProvider;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About(string fileBase64, string fileType)
        {

            var a = fileBase64;
            var b = fileType;
            if (!string.IsNullOrEmpty(fileBase64))
            {

                //文件名称
                var fileName = Guid.NewGuid().ToString();

                //string rootdir = AppContext.BaseDirectory;
                //DirectoryInfo Dir = Directory.GetParent(rootdir);
                //string root = Dir.Parent.Parent.FullName;


                var path = pathProvider.MapPath("")+"/";

                //当前程序所在的文件夹
                string saveDicPath = path + "TempUpload/";// 
                                                          //文件路径                                                                             //文件完整路径
                var fileFullPath = saveDicPath + fileName + fileType;
                if (!Directory.Exists(saveDicPath))
                    Directory.CreateDirectory(saveDicPath);
                try
                {
                    byte[] bt = Convert.FromBase64String(fileBase64);
                    //使用文件流读取byte数组中的数据
                    Stream s = new FileStream(fileFullPath, FileMode.Append);
                    s.Write(bt, 0, bt.Length);
                    s.Close();
                    
                return Content("上传成功");
                }
                catch (Exception ex)
                {
                    return Content("上传失败");
                }
                ViewData["Message"] = "Your application description page.";

            }

            return Content("上传失败");
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
