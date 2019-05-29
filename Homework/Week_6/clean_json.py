import csv
import json

# initialises csv infile, json outfile and names each field
j_file = "final_data.json"
cleanRow = "GDP/capita ($PPP)"
outfile = "fin.json"

# converts csv file to json file
def clean_JSON():
    with open(j_file, "r") as infile:
        data = json.load(infile)
    clean_data = {}
    for i in data:
        data[i]["GDP/capita ($PPP)"] = data[i]["GDP/capita ($PPP)"][1:].replace(",", "")
        data[i]["Average Life Expectancy"] = (float(data[i]["Average Life Expectancy"].replace(".", "")) / 10)
        print(data[i]["Average Life Expectancy"])
    with open(outfile, "w") as datafile:
        data = json.dump(data, datafile)

if __name__ == "__main__":
    clean_JSON()
