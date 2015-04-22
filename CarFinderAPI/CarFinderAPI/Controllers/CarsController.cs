using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Insight.Database;
using Microsoft.AspNet.Identity.Owin;
using CarFinderAPI.Models.Data_Interfaces;
using System.Web;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Security.Policy;
using CarFinderAPI.Models;
using Bing;

namespace CarFinderAPI.Controllers
{
    [RoutePrefix("api/cars")]
    public class CarsController : ApiController
    {
        private ICarsAccess db;

        public CarsController()
        {
            db = HttpContext.Current.GetOwinContext().Get<SqlConnection>().As<ICarsAccess>();
        }
        [HttpGet, Route("getCars")]
        public IHttpActionResult getCars()
        {
            return Ok("Its a car!");
        }

        [HttpGet, HttpPost, Route("getYears")]
        public async Task<IHttpActionResult> GetYears()
        {
            return Ok(await db.GetYears());
        }

        [HttpGet, HttpPost, Route("getMakes")]
        public async Task<IHttpActionResult> GetMakes(int year)
        {
            return Ok(await db.GetMakes(year));
        }

        [HttpGet, HttpPost, Route("getModels")]
        public async Task<IHttpActionResult> GetModels(int year, string make)
        {
            return Ok(await db.GetModels(year, make));
        }

        [HttpGet, HttpPost, Route("getTrims")]
        public async Task<IHttpActionResult> GetTrims(int year, string make, string model)
        {
            return Ok(await db.GetTrims(year, make, model));
        }


        [HttpGet, HttpPost, Route("getCars")]
        public async Task<IHttpActionResult> GetCars(int? year, string make, string model, string trim)
        {
            return Ok(await db.GetCars(year, make, model, trim));
        }

        [HttpGet, HttpPost, Route("getRecalls")]
        public async Task<IHttpActionResult> getRecalls(string year, string make, string model)
        {
            HttpResponseMessage response;
            string content = "";
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://www.nhtsa.gov");
                try
                {
                    response = await client.GetAsync("/webapi/api/Recalls/vehicle/modelyear/" + year.ToString() + "/make/" + make + "/model/" + model + "?format=json");
                    content = await response.Content.ReadAsStringAsync();
                }
                catch(Exception e)
                {
                    return InternalServerError(e);
                }
            }
            return Ok(content);
        }

        [HttpGet, HttpPost, Route("getCar")]
        public async Task<IHttpActionResult> getCar(int Id)
        {
            HttpResponseMessage response;
            string content = "";
            var carModel = new CarViewModel()
            {
                Car = await db.GetCar(Id),
                RecallData = content,
                ImageUrl = ""
            };
           
            
           
            using (var client = new HttpClient())
            {
                client.BaseAddress = new Uri("http://www.nhtsa.gov");
                try
                {
                    response = await client.GetAsync("/webapi/api/Recalls/vehicle/modelyear/" + carModel.Car.year + "/make/" + carModel.Car.make + "/model/" + carModel.Car.model + "?format=json");
                    content = await response.Content.ReadAsStringAsync();
                }
                catch (Exception e)
                {
                    return InternalServerError(e);
                }
            }
            carModel.RecallData = content;

           

            var image = new BingSearchContainer(
            new Uri("https://api.datamarket.azure.com/Bing/search/")
    );
            image.Credentials = new NetworkCredential("accountKey", "3CaSEx+O29220bzCzXbb+uwDmtXhv6TnyfUfyhVX1k4");
            var marketData = image.Composite(
                "image",
                carModel.Car.year + " " + carModel.Car.make + " " + carModel.Car.model + " " + carModel.Car.trim + " ",
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null
                ).Execute();

            var img = marketData.First().Image.First().MediaUrl;
            carModel.ImageUrl = img;
            
            return Ok(carModel);
        }
        
    }
         
}

