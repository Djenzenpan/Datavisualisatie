import csv
import json

# initialises csv infile, json outfile and names each field
infile_one = "data.json"
infile_two = "countrycodes.json"
json_file = "fin_data.json"

# converts csv file to json file
def fuse_JSON():
    with open(infile_one, "r") as j_file_one:
        data_one = json.load(j_file_one)
    with open(infile_two, "r") as j_file_two:
        data_two = json.load(j_file_two)
    all_data = {}
    for datapoint_one in data_one:
        for datapoint_two in data_two:
            if datapoint_one["Country"] == datapoint_two["Country"]:
                datapoint_one["Country code"] = datapoint_two["Country code"]
        all_data[datapoint_one["Country"]] = datapoint_one
    with open(json_file, 'w') as data_file:
        all_data = json.dump(all_data, data_file)

if __name__ == "__main__":
    fuse_JSON()
