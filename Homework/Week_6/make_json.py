import csv
import json

infile = "final_data.json"
outfile = "final_findata.json"

with open(infile, "r") as j_file:
    data = json.load(j_file)
all_data = {}
for datapoint in data:
    all_data[datapoint["Country code"]] = datapoint["Happy Planet Index"]
with open(outfile, "w") as datafile:
    all_data = json.dump(all_data, datafile)
