import csv
import json

# initialises csv infile, json outfile and names each field
infile = "text.csv"
fieldnames = "Country", "gfd", "Country code", "Average Wellbeing (0-10)", "Happy Life Years","Footprint (gha/capita)","Inequality of Outcomes","Inequality-adjusted Life Expectancy", "Inequality-adjusted Wellbeing"
json_file = "datatwee.json"

# converts csv file to json file
def convert_CSV_to_JSON():
    with open(infile, "r") as csv_file:
        reader = csv.DictReader(csv_file, fieldnames = (fieldnames))
        out = json.dumps([row for row in reader])
        open(json_file, 'w').write(out)

if __name__ == "__main__":
    convert_CSV_to_JSON()
