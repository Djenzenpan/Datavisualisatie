// Datavisualisatie week 5
// Jesse Pannekeet
// 10151494

window.onload = function() {

  // Loads datasets and converts them to json files
  var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUT+BEL+BEL-VLG+CZE+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+LVA+LTU+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+GBR+NMEC+BRA+BGR+HRV+CYP+MLT+PER+ROU.CWB11/all?startTime=2010&endTime=2015"
  var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUT+BEL+BEL-VLG+CZE+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+LVA+LTU+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+GBR+NMEC+BRA+BGR+HRV+CYP+MLT+PER+ROU.CWB46/all?startTime=2010&endTime=2015"
  var gdp = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUT+BEL+CZE+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+LVA+LTU+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+GBR+BGR+HRV+CYP+MLT+ROU.B1_GE.HCPC/all?startTime=2010&endTime=2015&dimensionAtObservation=allDimensions"
  var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(gdp)];

  // Implements basics like page title and name
  basics();

  Promise.all(requests).then(function(response) {
    cleanData = convertToUsableData(response);
    scatterPlot(cleanData[0])
  })
};

// Converts data to a usable format
function convertToUsableData(data){

  // Cleans data from first and second file
  function cleanOECDDataFormat0(data){

    // Initialises lists for storage of extraced data
    let dataCountries = [];
    let dataValues = [];
    let countryData = [];

    // Extracts country names from data file
    for (country in data["structure"]["dimensions"]["series"][0]["values"]) {
      dataCountries.push(data["structure"]["dimensions"]["series"][0]["values"][country]["name"]);
    };

    // Extracts data from file and cleans it
    tempStorage = [];
    for (value in data["dataSets"][0]["series"]) {
      tempStorage.push(data["dataSets"][0]["series"][value]["observations"]);
    };
    for (filthyData in tempStorage){
      intermediate = [];
      for (observation in tempStorage[filthyData]){
        intermediate.push(tempStorage[filthyData][observation][0]);
      };
      dataValues.push(intermediate);
    };

    // Fuses both together
    for (index = 0; index < dataCountries.length; index++){
      countryData.push([dataCountries[index], dataValues[index]]);
    };

    // Returns clean data
    return countryData;
  };

  // Cleans data from third file
  function cleanOECDDataFormat1(data){

    // Initialises lists for storage of extraced data
    let dataCountries = [];
    let dataValues = [];
    let countryData = [];

    // Extracts country names from data file
    for (country in data["structure"]["dimensions"]["observation"][0]["values"]) {
      dataCountries.push(data["structure"]["dimensions"]["observation"][0]["values"][country]["name"]);
    };

    // Extracts data from file and cleans it
    intermediate = [];
    var counter = 0;
    for (value in data["dataSets"][0]["observations"]){
      intermediate.push(data["dataSets"][0]["observations"][value][0]);
      counter += 1;
      if (counter > 5){
        dataValues.push(intermediate);
        counter = 0;
        intermediate = [];
      };
    };
    // Fuses both together
    for (index = 0; index < dataCountries.length; index++){
      countryData.push([dataCountries[index], dataValues[index]]);
    };

    // Returns clean data
    return countryData;
  };

  // Cleans data from every json_file
  allData = cleanOECDDataFormat0(data[0])
  dataTwo = cleanOECDDataFormat0(data[1])
  dataThree = cleanOECDDataFormat1(data[2])

  // Fuses datasets together
  for (index = 0; index < allData.length; index++) {
    allData[index].push(dataTwo[index][1])
  }
  for (index in dataThree){
    for (country in allData) {
      if (dataThree[index][0] == allData[country][0]) {
        allData[country].push(dataThree[index][1])
      }
    }
  }
  console.log(allData)
  // Returns clean and fused data from the three datafiles provided
  return allData
};

function basics() {
  graphTitle = "ToDo"

  // Displays page title
  d3.select("head").append("title").text("Teens in violent area/Teen pregnancy");

  // Displays title of body and sets font
  d3.select("body").append("h2").text(graphTitle)
    .style("text-decoration", "underline")
    .style("font-family", "Monospace");

  // Displays name and student number and sets font for both
  d3.select("body").append("a").text("Jesse Pannekeet");
  d3.select("body").append("br");
  d3.select("body").append("a").text("10151494");
  d3.selectAll("a").style("font-family", "Monospace");
  d3.select("body").append("br");

  // Sets whole body to center of page
  d3.select("body").style("text-align", "center");
};

function scatterPlot(data) {
  var w = 1150;
  var h = 450;

  var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

  // Sets scale
  var xScale = d3.scaleLinear()
                 .domain([0, d3.max(data[1], function(d) { return d; })])
                 .range([0, h - 50]);
  var yScale = d3.scaleLinear()
                 .domain([0, d3.max(data[2], function(d) { return d; })])
                 .range([0, h - 50]);

  // Sets x and y axis range
  var xAxis = d3.axisBottom(d3.scaleLinear()
                              .domain([0, d3.max(data[1], function(d){
                                                          return d; })])
                              .range([15, 1037]));
  var yAxis = d3.axisLeft(d3.scaleLinear()
                            .domain([0, d3.max(data[2], function(d) {
                                                         return d; })])
                            .range([400, 0]));

  // Plots axes
  svg.append("g").attr("class", "axis").call(xAxis)
     .attr("transform", "translate(35, 400)");
  svg.append("g").attr("class", "axis").call(yAxis)
     .attr("transform", "translate(50, 0)");

  // Plots axes labels
  svg.append("text").attr("transform", "translate(578, 435)")
     .style("text-anchor", "middle").style("font-family", "Arial")
     .text("Every year between 1960-2016");
  svg.append("text").attr("transform", "rotate(-90)").attr("y", 12)
     .attr("x", -175).style("text-anchor", "middle")
     .style("font-family", "Arial").text("Average value ($)");

  // Plots bar graph in svg element in index.html
  svg.selectAll("circle").data(data[1]).enter().append("circle")
     .attr("cx", function(d){ return xScale(d); })
     .attr("cy", function(d){ return yScale(d); })
     .attr("r", 10);
};
