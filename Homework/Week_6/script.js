var fileName = "https//djenzenpan.github.io/Datavisualisatie/Homework/Week_6/data.json"
var txtFile = new XMLHttpRequest();

txtFile.onreadystatechange = function() {
  if (txtFile.readyState === 4 && txtFile.status == 200) {
    // Opens JSON file
    datafile = JSON.parse(txtFile.responseText)
    console.log(datafile)
  }
}
txtFile.open("GET", fileName);
txtFile.send();
