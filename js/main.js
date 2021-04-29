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
region (dyanmically added)
OrchardVineyardCropProduced aka farmSystem (dynamic)
SoilType (dynamic?)
Benefits (from list, for now choose a few, ex: nitrogen fixing)
Challenge (from list, for now choose a few)
*/
MyApp.headerData = [
  { sTitle: "Farm Name" },
  { sTitle: "Location" },
  { sTitle: "System" },
  { sTitle: "Benefits" },
  { sTitle: "Challenges" },
];

MyApp.filterIndexes = {
  regions: 1, // aka locations
  benefits: 3,
  soilType: 9, // TBD
  farmSystem: 2,
  challenges: 4,
};

(MyApp.Regions = []),
  (MyApp.Benefits = []),
  (MyApp.SoilTypes = []),
  (MyApp.FarmSystems = []);

$(function () {
  var url =
    "https://spreadsheets.google.com/feeds/list/10oWvxWAJyQxo9OIEtChs-oDBc5ZA8AahGwU-Bo20WU4/1/public/full?alt=json-in-script&callback=?";
  $.getJSON(url, {}, function (data) {
    $.each(data.feed.entry, function (key, val) {
      var farmName = val.gsx$farmname.$t;
      var location = val.gsx$location.$t;
      var benefits = val.gsx$benefitsofthiscovercrop.$t;
      var farmSystem = val.gsx$orchardvineyardcropproduced.$t;
      // TODO: soil type - currently not available in dataset
      var challenges = val.gsx$challenges.$t;

      console.log("got farm", farmName);

      MyApp.spreadsheetData.push([
        farmName,
        location,
        farmSystem,
        benefits,
        challenges,
      ]);

      // TODO: create sidebar links if the need to be dynamic

      // Add data to filters
      if ($.inArray(location, MyApp.Regions) === -1) {
        MyApp.Regions.push(location);
      }

      if ($.inArray(location, MyApp.FarmSystems) === -1) {
        MyApp.FarmSystems.push(farmSystem);
      }
    });

    createDataTable();

    addFilters();

    // hook up extra links or popups
  });
});

function addFilters() {
  var $regions = $("#regions");

  $.each(MyApp.Regions, function (key, val) {
    $regions.append(
      '<li><label><input type="checkbox" name="' +
        val +
        '"> ' +
        val +
        "</label></li>"
    );
  });

  var $regions = $("#farmSystem");

  $.each(MyApp.FarmSystems, function (key, val) {
    $regions.append(
      '<li><label><input type="checkbox" name="' +
        val +
        '"> ' +
        val +
        "</label></li>"
    );
  });

  $(".filterrow").on("click", "ul.filterlist", function (e) {
    var filterRegex = "";
    var filterName = this.id;
    var filterIndex = MyApp.filterIndexes[filterName];

    var filters = [];
    $("input", this).each(function (key, val) {
      if (val.checked) {
        if (filterRegex.length !== 0) {
          filterRegex += "|";
        }

        filterRegex += "(^" + val.name + "$)"; //Use the hat and dollar to require an exact match
      }
    });

    console.log("filtering", filterName, filterRegex, filterIndex);

    MyApp.oTable.fnFilter(filterRegex, filterIndex, true, false);
    displayCurrentFilters();
  });

  $("#clearfilters").click(function (e) {
    e.preventDefault();

    $(":checkbox", "ul.filterlist").each(function () {
      this.checked = false;
    });

    $("ul.filterlist").click();
  });
}

function displayCurrentFilters() {
  var $filterAlert = $("#filters");
  var filters = "";

  $(":checked", "ul.filterlist").each(function () {
    if (filters.length !== 0) {
      filters += " + ";
    }
    filters += "<strong>" + this.name + "</strong>";
  });

  if (filters.length !== 0) {
    var alert = $(
      "<div class='alert alert-info'><strong>Filters</strong><p>You are filtering on " +
        filters +
        "</p></div>"
    );

    $filterAlert.html(alert);
  } else {
    $filterAlert.html(null);
  }

  $filterAlert[0].scrollIntoView(true);
}

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
    iDisplayLength: 50,
    bLengthChange: false,
    data: MyApp.spreadsheetData,
    columns: MyApp.headerData,
  });
}
