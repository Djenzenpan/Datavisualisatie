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
