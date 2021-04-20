MyApp = {};
MyApp.spreadsheetData = [];

/* TODO: want to use the following columns to show:
FarmName
Location
OrchardVineyardCropProduced
BenefitsOfThisCoverCrop
Challenges
*/

/* TODO: want to filter on
Location (dyanmically added)
OrchardVineyardCropProduced (dynamic)
SoilType (dynamic?)
Benefits (from list, for now choose a few, ex: nitrogen fixing)
Challenge (from list, for now choose a few)
*/
MyApp.headerData = [
  { sTitle: "Farm Name" },
  { sTitle: "Location" },
  { sTitle: "Benefits" },
  { sTitle: "Col4" },
];

// TODO: these categories are from an old app.  Need to replace and hook up to new app
MyApp.ResearchAreaCategories = {
  researchareapopulations: { name: "Populations defined by…", values: [] },
  researcharealifephase: { name: "Life Phase", values: [] },
  researchareaother: { name: "Other", values: [] },
};

MyApp.filterIndexes = {
  colleges: 1,
  departments: 2,
  researchtitles: 3,
  researcharea: 6,
};

(MyApp.Colleges = []), (MyApp.ResearchTitles = []), (MyApp.Departments = []);

$(function () {
  console.log("running on start");

  var url =
    "https://spreadsheets.google.com/feeds/list/10oWvxWAJyQxo9OIEtChs-oDBc5ZA8AahGwU-Bo20WU4/1/public/full?alt=json-in-script&callback=?";
  $.getJSON(url, {}, function (data) {
    $.each(data.feed.entry, function (key, val) {
      var farmName = val.gsx$farmname.$t;
      var location = val.gsx$location.$t;
      var benefits = val.gsx$benefitsofthiscovercrop.$t

      console.log("got farm", farmName);

      MyApp.spreadsheetData.push([farmName, location, benefits, "col4"]);

      // TODO: create sidebar links if the need to be dynamic
    });

    createDataTable();

    // add filters

    // hook up extra links or popups
  });
});

function createDataTable() {
  //Create a sorter that uses case-insensitive html content
  jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    "link-content-pre": function (a) {
      return $(a).html().trim().toLowerCase();
    },

    "link-content-asc": function (a, b) {
      return a < b ? -1 : a > b ? 1 : 0;
    },

    "link-content-desc": function (a, b) {
      return a < b ? 1 : a > b ? -1 : 0;
    },
  });

  console.log(MyApp.spreadsheetData);

  MyApp.oTable = $("#spreadsheet").dataTable({
    "iDisplayLength": 50,
    "bLengthChange": false,
    data: MyApp.spreadsheetData,
    columns: MyApp.headerData,
  });
}
