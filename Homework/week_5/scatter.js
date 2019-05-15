// Datavisualisatie week 5
// Jesse Pannekeet
// 10151494

window.onload = function() {

  // Loads datasets and converts them to json files
  var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUT+BEL+BEL-VLG+CZE+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+LVA+LTU+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+GBR+NMEC+BRA+BGR+HRV+CYP+MLT+PER+ROU.CWB11/all?startTime=2000&endTime=2015"
  var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUT+BEL+BEL-VLG+CZE+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+LVA+LTU+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+GBR+NMEC+BRA+BGR+HRV+CYP+MLT+PER+ROU.CWB46/all?startTime=2000&endTime=2015"
  var gdp = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUT+BEL+CZE+DNK+EST+FIN+FRA+GRC+HUN+ISL+IRL+ITA+LVA+LTU+LUX+NLD+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+GBR+BGR+HRV+CYP+MLT+ROU.B1_GE.HCPC/all?startTime=2000&endTime=2015&dimensionAtObservation=allDimensions"
  var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(gdp)];

  // Implements basics like page title and name
  basics();

  Promise.all(requests).then(function(response) {
    cleanData = convertToUsableData(response);
    selectMenu(cleanData);
    scatterPlot(cleanData[0]);
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
  dataOne = cleanOECDDataFormat0(data[0])
  dataTwo = cleanOECDDataFormat0(data[1])
  dataThree = cleanOECDDataFormat1(data[2])

  // Fuses datasets together
  for (index = 0; index < dataOne.length; index++) {
    dataOne[index].push(dataTwo[index][1])
  }
  for (index in dataThree){
    for (country in dataOne) {
      if (dataThree[index][0] == dataOne[country][0]) {
        dataOne[country].push(dataThree[index][1])
      }
    }
  }

  // Converts dataset to a more usable form
  allData = []
  for (index in dataOne){
    intermediate = [];
    for (year in dataOne[index][1]){
      intermediate.push([dataOne[index][1][year], dataOne[index][2][year], dataOne[index][3][year], dataOne[index][0].length])
    }
    allData.push([dataOne[index][0], intermediate])
  }
  console.log(allData)
  // Returns clean and fused data from the three datafiles provided
  return allData
};

function basics() {
  graphTitle = "The scatterplot shown beneath shows the relationship between the percentage of teens that report living in a violent area and teenage pregnancy for the selected country. The size of the circles corresponds to the length of the country name"

  // Displays page title
  d3.select("head").append("title").text("Teens in violent area/Teen pregnancy");

  d3.select("body").append("h2").text("Scatterplot")
    .style("font-family", "Monospace");

  // Displays title of body and sets font
  d3.select("body").append("p").text(graphTitle)
    .style("font-family", "Monospace")
    .style("text-align", "center");

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
  var w = 800;
  var h = 450;

  var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

  // Sets scale
  var xScale = d3.scaleLinear()
                 .domain([0, d3.max(data[1], function(d) { return d[0]; })])
                 .range([10, w - 50]);
  // Sets scale
  var yScale = d3.scaleLinear()
                 .domain([0, d3.max(data[1], function(d) { return d[1]; })])
                 .range([50, h - 50]);

  // Sets x and y axis range
  var xAxis = d3.axisBottom(d3.scaleLinear()
                              .domain([0, d3.max(data[1], function(d) {
                                                           return d[0]; })])
                              .range([10, w - 50]));
  var yAxis = d3.axisLeft(d3.scaleLinear()
                            .domain([0, d3.max(data[1], function(d) {
                                                        return d[1]; })])
                            .range([h - 50, 50]));

  // Plots axes
  svg.append("g").attr("class", "axis").call(xAxis)
     .attr("transform", "translate(35, 400)");
  svg.append("g").attr("class", "axis").call(yAxis)
     .attr("transform", "translate(45, 0)");

  svg.append("text")
     .attr("transform", "translate(410, 40)")
     .style("text-anchor", "middle").style("font-family", "Arial")
     .style("font-size", "15px")
     .text(data[0]);

  // Plots axes labels
  svg.append("text").attr("transform", "translate(410, 435)")
     .style("text-anchor", "middle").style("font-family", "Arial")
     .style("font-size", "15px")
     .text("Percentage of teens that report living in a violent neighbourhood");
  svg.append("text").attr("transform", "rotate(-90)").attr("y", 15)
     .attr("x", -205).style("text-anchor", "middle")
     .style("font-family", "Arial").style("font-size", "15px")
     .text("Teenage pregnancy rate(/1000 teens)");


  svg.selectAll("circle").data(data[1]).enter().append("circle")
    .attr("cx", function(d){ return xScale(d[0]); })
    .attr("cy", function(d){ return yScale(d[1]) - 50; })
    .attr("r", function(d){ return d[3] / 2})
    .style("fill", function(d){ if (d[2] < 15000){ return "ccece6" }
                                else if (d[2] < 19000) { return "99d8c9"}
                                else if (d[2] < 23000) { return "66c2a4"}
                                else if (d[2] < 27000) { return "41ae76"}
                                else if (d[2] < 31000) { return "238b45"}
                                else if (d[2] < 35000) { return "006d2c"}
                                else { return "00441b" }});
  legend = svg.append("g")
              .attr("class","legend")
              .attr("transform","translate(50,30)")
              .style("font-size","12px")
              .call(d3.legend)

};

function selectMenu(data) {
  selMen = d3.select("body").append("div").attr("class", "selMen")
  selectMenu = selMen.append("select").attr("width", "250px")
                 .attr('class','select').attr("name", "Select-menu");
  selectMenu.selectAll("option").data(data).enter().append("option")
            .text(function(d) { return d[0]; });
  selectMenu.on("change", function() { switchDots(d3.select("select")
                                                    .property("value"), data); })
};

function switchDots(country, data) {
  d3.selectAll("svg").remove();
  for (i in data) {
    if (data[i][0] == country) {
      scatterPlot(data[i])
    }
  }
}
