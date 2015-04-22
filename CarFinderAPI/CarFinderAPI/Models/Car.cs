using Insight.Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CarFinderAPI.Models
{
    public class Car
    {
        [Column("model_year")]
        public int year { get; set; }
        public string make { get; set; }
        [Column("model_name")]
        public string model { get; set; }
        [Column("model_trim")]
        public string trim { get; set; }
        public int id { get; set; }
    }

    public class CarViewModel
    {
        public Car Car { get; set; }
        public string RecallData {get; set;}
        public string ImageUrl {get; set;}
    }

}