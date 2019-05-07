var fileName = "average_data.json";
var txtFile = new XMLHttpRequest();

// Sets width and height of SVG object
var w = 1000;
var h = 500;

var distanceBtwnBars = 17
var reductionFactor = 40

// Implements basics of html page
function basics() {
  d3.select("head").append("title").text("Page title");
  d3.select("body").append("h1").text("Bar chart title").style("color", "red");
  d3.select("body").append("a").text("Jesse Pannekeet");
  d3.select("body").append("br");
  d3.select("body").append("a").text("10151494");
  d3.select("body").append("p").text("A bit of text");
}

function convertToBars(datafile) {
  var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);
  // scale???
  svg.selectAll("rect").data(datafile).enter().append("rect")
    .style("width", "15")
    .style("height", function(d){ return (d); })
    .style("x", function(d, i){ return (i * distanceBtwnBars); })
    .style("y", function(d){ return h - 10 - d / reductionFactor; } )
    .attr("fill", function(d, i){
      if (i % 2 == 0) {
        return "black";
      }
      else {
        return "darkgrey"
      }
    })
    .attr("class", function(d, i){ return i + 1960; });

}

txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
    // Opens JSON file, screens and averages the data for each day
    datafile = JSON.parse(txtFile.responseText)
    convertToBars(datafile);
    basics();
  }
}
txtFile.open("GET", fileName);
txtFile.send();
