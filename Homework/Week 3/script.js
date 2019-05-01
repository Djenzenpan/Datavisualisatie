var fileName = "KNMI_data.json";
var txtFile = new XMLHttpRequest();

function screenData(datapoints) {
  let observations = []
  for (let number = 1; number <= 365; number += 1) {
    observations[number] = []
  }
  datapoints.forEach(function(observation) {
    if (parseInt(observation["DR"])) {
      i = observation["YYYYMMDD"].substring(4);
      month = parseInt(i[0] + i[1]);
      day = parseInt(i[2] + i[3]);
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

function averageData(cleanData) {
  for (i in cleanData){
    var sum = 0
    for (obsEr in cleanData[i]){
      sum = sum + parseInt(cleanData[i][obsEr])
    }
    cleanData[i] = sum / cleanData[i].length;
  }
  console.log(cleanData[1])
  return cleanData
}

txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
    datafile = JSON.parse(txtFile.responseText)
    allAverages = averageData(screenData(datafile))
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"]

    // finds canvas on HTML page
    const canvas = document.getElementById('graph');
    const ctx = canvas.getContext('2d');

    // Set line width
    ctx.lineWidth = 1;

    // Sets walls of graph
    ctx.strokeRect(20, 30, 940, 380);

    for (i in allAverages){
      if (parseInt(i) == 1) {
        ctx.moveTo(20 + (parseInt(i)) * 2.8, 300 - (parseInt(allAverages[parseInt(i)])));
      }
      else{
        ctx.lineTo(20 + (parseInt(i)) * 2.8, 300 - (parseInt(allAverages[parseInt(i)])));
        ctx.moveTo(20 + (parseInt(i)) * 2.8, 300 - (parseInt(allAverages[parseInt(i)])));
      }
      for (i in months){
        ctx.font = "15px Arial";
        ctx.fillText(months[i], (parseInt(i)) * 80 + 20, 425);
      }
      ctx.font = "25px Arial";
      ctx.fillText("Average lowest temperature measured for each day in the Netherlands in 2018", 50, 25);
    }
  ctx.closePath();
  ctx.stroke();
  }
}
txtFile.open("GET", fileName);
txtFile.send();
