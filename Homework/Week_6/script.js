var fileName = "final_data.json"
var txtFile = new XMLHttpRequest();

function scatterplot(allData, continent) {
  var w = 800;
  var h = 450;

  data = [];

  for (i in allData) {
    if (allData[i]["Region"] == continent) {
      data.push(allData[i])
    }
  }

  var svg = d3v5.select("body").append("svg").attr("width", w).attr("height", h);

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

  tip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d; });

  vis.call(tip)

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
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

}
// ToDO onload function
txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
    // Opens JSON file
    datafile = JSON.parse(txtFile.responseText)
    countries_happy_index = []
    for (country in datafile) {
      countries_happy_index.push([datafile[country]["Country code"], datafile[country]["Happy Planet Index"]])
    }

      // Datamaps expect data in format:
    // { "USA": { "fillColor": "#42a844", numberOfWhatever: 75},
    //   "FRA": { "fillColor": "#8dc386", numberOfWhatever: 43 } }
    var dataset = {};

    // We need to colorize every country based on "numberOfWhatever"
    // colors should be uniq for every value.
    // For this purpose we create palette(using min/max series-value)
    var onlyValues = countries_happy_index.map(function(obj){ return parseFloat(obj[1]); });
    var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);

    // create color palette function
    // color can be whatever you wish
    var paletteScale = d3v3.scale.linear()
            .domain([minValue,maxValue])
            .range(["#888888","#02386F"]); // blue color

    // fill dataset in appropriate format
    countries_happy_index.forEach(function(item){ //
        // item example value ["USA", 70]
        var iso = item[0],
                value = item[1]
        dataset[iso] = { fillColor: paletteScale(value).toUpperCase(), numberOfThings: value  };
        console.log(iso)
        console.log(dataset[iso])
    });

    // render map
    new Datamap({
        element: document.getElementById('container'),
        projection: 'mercator', // big world map
        // countries don't listed in dataset will be painted with this color
        fills: { defaultFill: '#F5F5F5' },
        data: dataset,
        fills: function(data) { return data.fillColor},
        geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function(data) {
                return "purple";
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
                console.log(data.fillKey)
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Happy planet index: <strong>', data.numberOfThings, '</strong>',
                    '</div>'].join('');
            }
        }
    });
    scatterplot(datafile, "Americas")

  }
}
txtFile.open("GET", fileName);
txtFile.send();
