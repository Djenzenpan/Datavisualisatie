// Datavisualisatie week 5
// Jesse Pannekeet
// 10151494

window.onload = function() {
  // Loads datasets and converts them to json files
  var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
  var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=2010&endTime=2017"
  var gdp = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2010&endTime=2017&dimensionAtObservation=allDimensions"
  var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(gdp)];

  Promise.all(requests).then(function(response) {
    convertToUsableData(response);
    })
};

// Converts data to a usable format
function convertToUsableData(data){
  dataSetOne = data[0];
  dataSetTwo = data[1];
  dataSetThree = data[2];
  console.log(dataSetOne["dataSets"][0]["series"]);
  console.log(dataSetOne["structure"]["dimensions"]["series"][0]["values"]);
  console.log(dataSetTwo["structure"]["dimensions"]["series"][0]["values"]);
  console.log(dataSetOne["structure"]["dimensions"]["observation"][0]["values"]);
  console.log(dataSetTwo["dataSets"][0]["series"])
  console.log(dataSetThree["dataSets"][0]["observations"])
  console.log(dataSetThree)
};
