// Datavisualisatie week 5
// Jesse Pannekeet
// 10151494

window.onload = function() {
  var teensInViolentArea = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB11/all?startTime=2010&endTime=2017"
  var teenPregnancies = "https://stats.oecd.org/SDMX-JSON/data/CWB/AUS+AUT+BEL+BEL-VLG+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+OAVG+NMEC+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+PER+ROU+RUS+ZAF.CWB46/all?startTime=2010&endTime=2017"
  var gdp = "https://stats.oecd.org/SDMX-JSON/data/SNA_TABLE1/AUS+AUT+BEL+CAN+CHL+CZE+DNK+EST+FIN+FRA+DEU+GRC+HUN+ISL+IRL+ISR+ITA+JPN+KOR+LVA+LTU+LUX+MEX+NLD+NZL+NOR+POL+PRT+SVK+SVN+ESP+SWE+CHE+TUR+GBR+USA+EU28+EU15+OECDE+OECD+OTF+NMEC+ARG+BRA+BGR+CHN+COL+CRI+HRV+CYP+IND+IDN+MLT+ROU+RUS+SAU+ZAF+FRME+DEW.B1_GE.HCPC/all?startTime=2010&endTime=2018&dimensionAtObservation=allDimensions"
  var requests = [d3.json(teensInViolentArea), d3.json(teenPregnancies), d3.json(gdp)];
  console.log(requests)

  Promise.all(requests).then(function(response) {
    console.log(response[0])
    transformResponse(response);
  }).catch(function(e){
    throw(e);
  });
};

function transformResponse(data){

  // Save data
  let originalData = data;

  // access data
  let dataHere = data.dataSets[0].observations;

  // access variables in the response and save length for later
  let series = data.structure.dimensions.observation;
  let seriesLength = series.length;

  // get the time periods in the dataset
  let observation = data.structure.dimensions.observation[0];

  // set up array of variables and array of lengths
  let varArray = [];
  let lenArray = [];

  series.forEach(function(serie){
      varArray.push(serie);
      lenArray.push(serie.values.length);
  });

  // add time periods to the variables, but since it's not included in the
  // 0:0:0 format it's not included in the array of lengths
  varArray.push(observation);

  // create array with all possible combinations of the 0:0:0 format
  let strings = Object.keys(dataHere);

  // set up output array, an array of objects, each containing a single datapoint
  // and the descriptors for that datapoint
  let dataObject = {};

  // for each string that we created
  strings.forEach(function(string){
      observation.values.forEach(function(obs, index){
          let data = dataHere[string];
          if (data != undefined){

              // set up temporary object
              let tempObj = {};

              // split string into array of elements seperated by ':'
              let tempString = string.split(":")
              tempString.forEach(function(s, index){
                  tempObj[varArray[index].name] = varArray[index].values[s].name;
              });

              tempObj["Datapoint"] = data[0];

              // Add to total object
              if (dataObject[tempObj["Country"]] == undefined){
                dataObject[tempObj["Country"]] = [tempObj];
              } else if (dataObject[tempObj["Country"]][dataObject[tempObj["Country"]].length - 1]["Year"] != tempObj["Year"]) {
                  dataObject[tempObj["Country"]].push(tempObj);
              };

          }
      });
  });

  // return the finished product!
  return dataObject;
};
