var fileName = "average_data.json";
var txtFile = new XMLHttpRequest();

// Sets width and height of SVG object
var w = 1150;
var h = 450;

// Sets width of bars and distance between them
var barWidth = 15;
var distanceBtwnBars = barWidth + 3;

// Remembers graph title and first year
var graphTitle = "Averaged value of all countries for every year between 1960-2016"
var firstYear = 1960

// Implements basics(title, text and name) of index.html page
function basics() {

  // Displays page title
  d3.select("head").append("title").text("Average value/year");

  // Displays title of body and sets font
  d3.select("body").append("h2").text(graphTitle)
    .style("text-decoration", "underline")
    .style("font-family", "Monospace");

  // Displays explanatory text
  d3.select("body").append("p").text("A bit of explanatory text");

  // Displays name and student number and sets font for both
  d3.select("body").append("a").text("Jesse Pannekeet");
  d3.select("body").append("br")
  d3.select("body").append("a").text("10151494");
  d3.selectAll("a").style("font-family", "Monospace")
  d3.select("body").append("br")

  // Sets whole body to center of page
  d3.select("body").style("text-align", "center");
}

// Converts data to bargraph
function convertToBarGraph(datafile) {

  // Adds svg element to index.html
  var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

  // Sets scale
  var scale = d3.scaleLinear()
                .domain([0, d3.max(datafile, function(d) { return d + 20; })])
                .range([0, h - 50]);
  var xAxis = d3.axisBottom(d3.scaleLinear()
                            .domain([firstYear, 2017])
                            .range([15, 1037]))
  var yAxis = d3.axisLeft(d3.scaleLinear()
                            .domain([0, d3.max(datafile, function(d) {return d })])
                            .range([400, 0]))

  // Plots bar graph in svg element in index.html
  svg.selectAll("rect").data(datafile).enter().append("rect")
     .style("width", barWidth)
     .text(function(d){ return d })
     .style("height", function(d){ return scale(d); })
     .style("x", function(d, i){ return (i * distanceBtwnBars) + 50; })
     .style("y", function(d){ return h - 50 - scale(d); } )
     .attr("fill", function(d, i){
       if (i % 2 == 0) { return "black"; }
       else { return "green" }
    })
    // Changes bar colour and displays tooltip on mousehover
    .on('mouseover', function (d, i) {
        d3.select(this).transition().duration('50').attr('opacity', '.50')
        d3.select("#A" + (i+firstYear)).transition().attr('opacity', '1')
      })
      // Changes bar colour and stops dispaying tooltip when mousehover stops
    .on('mouseout', function (d, i) {
        d3.select(this).transition().duration('50').attr('opacity', '1')
        d3.select("#A" + (i+firstYear)).transition().attr('opacity', '0')

    });

  // Sets tooltips
  svg.selectAll("text").data(datafile).enter().append("text")
     .text(function(d,i){ return parseInt(d)} )
     .attr("fill", "red")
     .attr('opacity', '0')
     .attr("id", function(d, i){ return "A" + (i + firstYear); })
     .attr("transform", function(d,i){
            return "translate(" + (40 + (i*distanceBtwnBars)) + "," +
                              (360 - (d/45)) + ")"
          })

  // Plots axes
  svg.append("g").attr("class", "axis").call(xAxis)
     .attr("transform", "translate(40, 400)");
  svg.append("g").attr("class", "axis").call(yAxis)
     .attr("transform", "translate(55, 0)");

  // Plots axes labels
  svg.append("text").attr("transform", "translate(578, 435)")
     .style("text-anchor", "middle").style("font-family", "Arial")
     .text("Every year between 1960-2016");
  svg.append("text").attr("transform", "rotate(-90)").attr("y", 12)
     .attr("x", -175).style("text-anchor", "middle")
     .style("font-family", "Arial").text("Average value");
}


txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
    // Opens clean JSON file and converts it to a bar graph
    datafile = JSON.parse(txtFile.responseText)
    basics();
    convertToBarGraph(datafile);
    }
  }
txtFile.open("GET", fileName);
txtFile.send();
