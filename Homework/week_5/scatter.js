// Datavisualisatie week 5
// Jesse Pannekeet
// 10151494

window.onload = function() {
  // Loads datasets and converts them to json files
  var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUT+BEL+BEL-VLG+CZE+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+LVA+LTU+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+GBR+NMEC+BRA+BGR+HRV+CYP+MLT+PER+ROU.CWB11/all?startTime=2010&endTime=2015"
  var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUT+BEL+BEL-VLG+CZE+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+LVA+LTU+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+GBR+NMEC+BRA+BGR+HRV+CYP+MLT+PER+ROU.CWB46/all?startTime=2010&endTime=2015"
  var gdp = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUT+BEL+CZE+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+LVA+LTU+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+GBR+BGR+HRV+CYP+MLT+ROU.B1_GE.HCPC/all?startTime=2010&endTime=2015&dimensionAtObservation=allDimensions"
  var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(gdp)];

  Promise.all(requests).then(function(response) {
    convertToUsableData(response);
    })
};

// Converts data to a usable format
function convertToUsableData(data){
  var firstDataCountries = [];
  var firstDataValues = [];
  var secondDataCountries = [];
  var secondDataValues = [];
  var thirdDataCountries = [];
  var thirdDataValues = [];

  // Extracts country names from first file
  for (country in data[0]["structure"]["dimensions"]["series"][0]["values"]) {
    firstDataCountries.push(data[0]["structure"]["dimensions"]["series"][0]["values"][country]["name"]);
  }
  console.log(firstDataCountries)

  // Extracts data from first file and cleans it
  temp_storage = [];
  for (value in data[0]["dataSets"][0]["series"]) {
    temp_storage.push(data[0]["dataSets"][0]["series"][value]["observations"]);
  };
  for (filthyData in temp_storage){
    intermediate = [];
    for (observation in temp_storage[filthyData]){
      intermediate.push(temp_storage[filthyData][observation][0])
    }
    firstDataValues.push(intermediate)
  }
  console.log(firstDataValues)

  // Extracts country names from second file
  for (country in data[1]["structure"]["dimensions"]["series"][0]["values"]) {
    secondDataCountries.push(data[1]["structure"]["dimensions"]["series"][0]["values"][country]["name"])
  };
  console.log(secondDataCountries);

  // Extracts data from second file and cleans it
  temp_storage = [];
  for (value in data[1]["dataSets"][0]["series"]) {
    temp_storage.push(data[1]["dataSets"][0]["series"][value]["observations"]);
  };
  for (filthyData in temp_storage){
    intermediate = [];
    for (observation in temp_storage[filthyData]){
      intermediate.push(temp_storage[filthyData][observation][0])
    }
    secondDataValues.push(intermediate)
  }
  console.log(secondDataValues)

  // Extracts country names from third file
  for (country in data[2]["structure"]["dimensions"]["observation"][0]["values"]) {
    thirdDataCountries.push(data[2]["structure"]["dimensions"]["observation"][0]["values"][country]["name"])
  };
  console.log(thirdDataCountries)

  // Extracts data from third file and cleans it
  intermediate = [];
  var counter = 0
  for (value in data[2]["dataSets"][0]["observations"]){
    intermediate.push(data[2]["dataSets"][0]["observations"][value][0])
    counter += 1
    if (counter > 5){
      thirdDataValues.push(intermediate)
      counter = 0;
      intermediate = [];
    }
  }
  console.log(thirdDataValues)
};
