import csv
import json

# initialises csv infile, json outfile and names each field
infile = "data.csv"
fieldnames = "LOCATION","INDICATOR","SUBJECT","MEASURE","FREQUENCY","TIME", "Value","Flag Codes"
json_file = "data.json"
elements_to_remove = "LOCATION","INDICATOR","SUBJECT","MEASURE","FREQUENCY", "Flag Codes"
clean_json_file = "clean_data.json"
pooled_json_file = "pooled_data.json"
averaged_json_file = "average_data.json"

# converts csv file to json file
def convert_CSV_to_JSON():
    with open(infile, "r") as csv_file:
        reader = csv.DictReader(csv_file, fieldnames = (fieldnames))
        out = json.dumps([row for row in reader])
        open(json_file, 'w').write(out)

def remove_columns_from_JSON_file():
    with open(json_file, "r") as j_file:
        data = json.load(j_file)
    for datapoint in data:
        for element in elements_to_remove:
            datapoint.pop(element, None)
    with open(clean_json_file, "w") as datafile:
        data = json.dump(data, datafile)

def pool_JSON_file():
    years = []
    for i in range(57):
        years.append([])
    with open(clean_json_file, "r") as j_file:
        data = json.load(j_file)
        for element in data:
            if element["Value"]:
                years[int(element["TIME"]) - 1960].append(element["Value"])
    with open(pooled_json_file, 'w') as data_file:
        years = json.dump(years, data_file)

def average_JSON_file():
    years_average = []
    for i in range(57):
        years_average.append([])
    with open(pooled_json_file, "r") as j_file:
        data = json.load(j_file)
        for year in range(len(data)):
            sum = 0
            for datapoint in data[year]:
                sum = sum + float(datapoint)
            average = sum / len(data[year])
            years_average[year] = average

        with open(averaged_json_file, 'w') as data_file:
            years_average = json.dump(years_average, data_file)


if __name__ == "__main__":
    convert_CSV_to_JSON()
    remove_columns_from_JSON_file()
    pool_JSON_file()
    average_JSON_file()
