var fileName = "KNMI_data.json";
var txtFile = new XMLHttpRequest();

// Makes data into an array with date as index, removing NaN
function screenData(datapoints) {
  // Initialises 365 enties in array to list
  let observations = []
  for (let number = 1; number <= 365; number += 1) {
    observations[number] = []
  }
  // Adds every datapoint to appropriate list in array
  datapoints.forEach(function(observation) {
    if (parseInt(observation["DR"])) {
      // finds month and day belonging to datapoint
      i = observation["YYYYMMDD"].substring(4);
      month = parseInt(i[0] + i[1]);
      day = parseInt(i[2] + i[3]);
      // Converts days and months to day of the year
      var days = day
      if (month == 2) {
        days = days + 31;
      }
      else if (month == 3){
        days = days + 59;
      }
      else if (month == 4){
        days = days + 90;
      }
      else if (month == 5){
        days = days + 120;
      }
      else if (month == 6){
        days = days + 151;
      }
      else if (month == 7){
        days = days + 181;
      }
      else if (month == 8){
        days = days + 211;
      }
      else if (month == 9){
        days = days + 242;
      }
      else if (month == 10){
        days = days + 272;
      }
      else if (month == 11){
        days = days + 303;
      }
      else if (month == 3){
        days = days + 333;
      }
      observations[days].push(parseInt(observation["DR"]));
    }
  })
  return observations
}

// Averages data in array of 365 lists
function averageData(cleanData) {
  for (i in cleanData){
    var sum = 0
    for (obsEr in cleanData[i]){
      sum = sum + parseInt(cleanData[i][obsEr])
    }
    cleanData[i] = sum / cleanData[i].length;
  }
  return cleanData
}

function drawCanvas(data) {
  // finds canvas on HTML page
  const canvas = document.getElementById('graph');
  const ctx = canvas.getContext('2d');

  // Set line width and font sizess
  ctx.lineWidth = 1;
  ctx.font = "15px Arial";

  // Sets walls of graph
  ctx.strokeRect(150, 30, 935, 380);

  // Fills in y-values
  ctx.fillText("-10", 127, 400);
  ctx.fillText("-5", 133, 350);
  ctx.fillText("0", 137, 300);
  ctx.fillText("5", 137, 250);
  ctx.fillText("10", 131, 200);
  ctx.fillText("15", 131, 150);
  ctx.fillText("20", 131, 100);
  ctx.fillText("25", 131, 50);

  // Fills in title
  ctx.font = "25px Arial";
  ctx.fillText("Average lowest temperature measured for each day in the Netherlands in 2018", 175, 25);

  // Fills in x-label
  ctx.font = "20px Arial";
  ctx.fillText("Month", 575, 450);

  // Saves current context, sets orientation and turns 90 degrees
  ctx.save();
  ctx.translate( 500, 0 );
  ctx.rotate(Math.PI / 2);

  // Fills in  y-label
  ctx.fillText("Average temperature in C", 100, 400 );

  // Restores original context and orientation
  ctx.restore();

  ctx.fillStyle = "#000044";
  // Fills in x-values
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]
  for (i in months){
    ctx.font = "14px Serif";
    ctx.fillText(months[i] + " 1", (parseInt(i)) * 78 + 145, 425);
  }

  // Adds dashed lines for each month
  ctx.beginPath();
  ctx.setLineDash([5, 3]);
  for (i = 1; i < 12; i++){
    ctx.moveTo(i * 78 + 150, 410);
    ctx.lineTo(i * 78 + 150, 30);
  }
  ctx.stroke();

  // Adds line at 0 degrees
  ctx.beginPath();
  ctx.setLineDash([])
  ctx.moveTo(150, 300)
  ctx.lineTo(1085, 300)

  // Moves through the data and draws line accordingly
  for (i in data){
    if (parseInt(i) == 1) {
      ctx.moveTo(150 + (parseInt(i)) * 2.8, 300 - (parseInt(data[parseInt(i)])));
    }
    else{
      ctx.lineTo(150 + (parseInt(i)) * 2.8, 300 - (parseInt(data[parseInt(i)])));
      ctx.moveTo(150 + (parseInt(i)) * 2.8, 300 - (parseInt(data[parseInt(i)])));
    }
  }
  ctx.stroke();
  ctx.beginPath();



  ctx.closePath();
  ctx.stroke();
}

txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
    // Opens JSON file, screens and averages the data for each day
    datafile = JSON.parse(txtFile.responseText)
    allAverages = averageData(screenData(datafile))

    // Draws graph based on averaged data
    drawCanvas(allAverages)
  }
}
txtFile.open("GET", fileName);
txtFile.send();
