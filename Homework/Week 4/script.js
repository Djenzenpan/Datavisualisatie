var fileName = "average_data.json";
var txtFile = new XMLHttpRequest();

var pageTitle = "Averaged value of all countries for every year between 1960-2016"

// Sets width and height of SVG object
var w = 1150;
var h = 420;

var barWidth = 15
var distanceBtwnBars = barWidth + 3
var reductionFactor = 40

// Implements basics(title, text and name) of index.html page
function basics() {

  // Sets page title
  d3.select("head").append("title").text("Average value/year for every country");

  // Displays title of body and sets font
  d3.select("body").append("h2").text(pageTitle)
    .style("text-decoration", "underline")
    .style("font-family", "Monospace");

  // Displays explanatory text
  d3.select("body").append("p").text("A bit of text");

  // Displays name and student number and sets font for both
  d3.select("body").append("a").text("Jesse Pannekeet");
  d3.select("body").append("br")
  d3.select("body").append("a").text("10151494");
  d3.selectAll("a").style("font-family", "Monospace")
  d3.select("body").append("br")

  // Sets whole body to center of page
  d3.select("body").style("text-align", "center");
}

function convertToBars(datafile) {
  var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
  var scale = d3.scaleLinear()
                .domain([0, d3.max(datafile, function(d) { return d; })])
                .range([0, h]);
  var xAxis = d3.axisBottom(d3.scaleLinear()
                .domain([1960, 2017])
                .range([15, 1037]))

  // scale???
  svg.selectAll("rect").data(datafile).enter().append("rect")
    .style("width", barWidth)
    .style("height", function(d){ return scale(d); })
    .style("x", function(d, i){ return (i * distanceBtwnBars) + 30; })
    .style("y", function(d){ return h - 20 - scale(d); } )
    .attr("fill", function(d, i){
      if (i % 2 == 0) {
        return "black";
      }
      else {
        return "darkgrey"
      }
    })
    .attr("class", function(d, i){ return i + 1960; });
    svg.append("g").call(xAxis).attr("transform", "translate(15, 400)");
}

txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
    // Opens clean JSON file and converts it to a bar graph
    datafile = JSON.parse(txtFile.responseText)
    basics();
    convertToBars(datafile);
  }
}
txtFile.open("GET", fileName);
txtFile.send();
