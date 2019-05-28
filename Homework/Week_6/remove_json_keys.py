import csv
import json

# initialises csv infile, json outfile and names each field
infile = "datatwee.json"
json_file = "countrycodes.json"
elements_to_remove = "gfd","Average Wellbeing (0-10)","Happy Life Years","Footprint (gha/capita)", "Inequality of Outcomes", "Inequality-adjusted Life Expectancy", "Inequality-adjusted Wellbeing", "null"

def remove_keys_from_JSON_file():
    with open(infile, "r") as j_file:
        data = json.load(j_file)
    for datapoint in data:
        for element in elements_to_remove:
            datapoint.pop(element, None)
    with open(json_file, "w") as datafile:
        data = json.dump(data, datafile)

if __name__ == "__main__":
    remove_keys_from_JSON_file()
