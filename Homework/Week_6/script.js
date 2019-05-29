var fileName = "final_data.json"
var txtFile = new XMLHttpRequest();

function scatterplot(country, allData) {

  d3v5.selectAll("#scatter").remove();
  d3v5.selectAll("body").style("text-align", "centre")
  var w = 850;
  var h = 450;

  for (i in allData) {
    if (allData[i]["Country code"] == country) {
      continent = allData[i]["Region"]
    }
  }

  data = [];

  for (i in allData) {
    if (allData[i]["Region"] == continent) {
      data.push(allData[i])
    }
  }

//  var tip = d3v5.tip()
  //.attr('class', 'd3-tip')
  //.offset([-10, 0])
  //.html(data, function(d) {
  //  return "You're touching my!";
  //});

  var svg = d3v5.select("body").append("svg").attr("id", "scatter").attr("width", w).attr("height", h);

  // Sets scale
  var xScale = d3v5.scaleLinear()
                 .domain([0, d3v5.max(data, function(d) { return d["Happy Planet Index"]; })])
                 .range([10, w - 50]);
  // Sets scale
  var yScale = d3v5.scaleLinear()
                 .domain([0, d3v5.max(data, function(d) { return d["Footprint (gha/capita)"]; })])
                 .range([50, h - 50]);

  // Sets x and y axis range
  var xAxis = d3v5.axisBottom(d3v5.scaleLinear()
                              .domain([0, d3v5.max(data, function(d) {
                                                           return d["Happy Planet Index"]; })])
                              .range([10, w - 50]));
  var yAxis = d3v5.axisLeft(d3v5.scaleLinear()
                            .domain([0, d3v5.max(data, function(d) {
                                                        return d["Footprint (gha/capita)"]; })])
                            .range([h - 50, 50]));


  // Sets title
  svg.append("text").attr("transform", "translate(410, 40)")
     .style("text-anchor", "middle").style("font-family", "Arial")
     .style("font-size", "15px").text("Happy planet index/footprint (" + continent + ")");

  // Sets axes
  svg.append("g").attr("class", "axis").call(xAxis)
     .attr("transform", "translate(35, 400)");
  svg.append("g").attr("class", "axis").call(yAxis)
     .attr("transform", "translate(45, 0)");

  // Sets axes labels
  svg.append("text").attr("transform", "translate(410, 435)")
     .style("text-anchor", "middle").style("font-family", "Arial")
     .style("font-size", "15px")
     .text("Happy Planet Index");
  svg.append("text").attr("transform", "rotate(-90)").attr("y", 15)
     .attr("x", -205).style("text-anchor", "middle")
     .style("font-family", "Arial").style("font-size", "15px")
     .text("Footprint (gha/capita)");

  // Plots datacircles
  console.log(data)
  svg.selectAll("circle").data(data).enter().append("circle")
    .attr("cx", function(d){ return xScale(d["Happy Planet Index"]); })
    .attr("cy", function(d){ return yScale(d["Footprint (gha/capita)"]) - 10; })
    .style("fill", "000000")
    .attr("r", "5px")


}
// ToDO onload function
txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {

    // Sets whole body to center of page
    d3v5.select("body")
        .style("text-align", "center");

    // Creates div for the datamap to reside in
    d3v3.select("body")
        .append("div")
        .attr("id", "container")
        .style("position", "relative")
        .style("width", "700px")
        .style("height", '450px')
        .style("margin", "auto");

    // Opens JSON file
    datafile = JSON.parse(txtFile.responseText)

    // Gets neccesary info from JSON file
    series = []
    for (country in datafile) {
      series.push([datafile[country]["Country code"], parseInt(datafile[country]["Happy Planet Index"])])
    }

    //
    var dataset = {};
    var onlyValues = series.map(function(obj){ return parseFloat(obj[1]); });
    console.log(onlyValues)
    var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);

    // Adds Colour palette
    var paletteScale = d3v3.scale.linear()
            .domain([minValue,maxValue])
            .range(["#ece7f2","#2b8cbe"]); // blue color

    // fill dataset in appropriate format
    series.forEach(function(item){ //
        // item example value ["USA", 70]
        var iso = item[0],
                value = item[1]
        dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
    });

    // render map
    new Datamap({
        element: document.getElementById('container'),
        projection: 'mercator', // big world map
        // countries don't listed in dataset will be painted with this color
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        done: function(data) {
            data.svg.selectAll('.datamaps-subunit').on('click', function(geo) {
                scatterplot(geo["id"], datafile) })},
        geographyConfig: {
            borderColor: '#000000',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function(geo) {
                return '#FEFEFE';
            },
            // only change border
            highlightBorderColor: '#B7B7B7',
            // show desired information in tooltip
            popupTemplate: function(geo, data) {
                // don't show tooltip if country don't present in dataset
                if (!data) { return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>No data available <strong>', '</div>'].join(''); }
                // tooltip content
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Happy planet index: <strong>', data.numberOfThings, '</strong>',
                    '</div>'].join('');},

                  }});
}}
txtFile.open("GET", fileName);
txtFile.send();
