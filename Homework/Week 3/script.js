var fileName = "KNMI_data.json";
var txtFile = new XMLHttpRequest();

txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
      journal = JSON.parse(txtFile.responseText)
      function journalEvents(journal) {
          let observations = []
          for (let number = 1; number <= 27; number += 1) {
            observations[number] = []
          }
          journal.forEach(function(observation) {
            if (observation["DR"]){
              i = parseInt(observation["YYYYMMDD"].substring(6))
              observations[i].push(observation["DR"])
            }
          })
          return observations
        }
        var allValidObservations = journalEvents(journal)
        for (i in allValidObservations){
          var sum = 0
          for (obsEr in allValidObservations[i]){
            sum = sum + parseInt(allValidObservations[i][obsEr])
          }
          allValidObservations[i] = sum / allValidObservations[i].length;
        }
        console.log(allValidObservations)
      }
    }
txtFile.open("GET", fileName);
txtFile.send();

// Canvas part
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');
// Set line width
ctx.lineWidth = 10;

// Wall
ctx.strokeRect(75, 140, 150, 110);

// Door
ctx.fillRect(130, 190, 40, 60);

// Roof
ctx.moveTo(50, 140);
ctx.lineTo(150, 60);
ctx.lineTo(250, 140);
ctx.closePath();
ctx.stroke();
