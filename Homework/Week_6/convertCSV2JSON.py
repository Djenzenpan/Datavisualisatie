import csv
import json

# initialises csv infile, json outfile and names each field
infile = "data.csv"
fieldnames = "Country", "Region", "Average Life Expectancy", "Average Wellbeing (0-10)", "Happy Life Years","Footprint (gha/capita)","Inequality of Outcomes","Inequality-adjusted Life Expectancy", "Inequality-adjusted Wellbeing","Happy Planet Index","GDP/capita ($PPP)","Population"
json_file = "data.json"

# converts csv file to json file
def convert_CSV_to_JSON():
    with open(infile, "r") as csv_file:
        reader = csv.DictReader(csv_file, fieldnames = (fieldnames))
        out = json.dumps([row for row in reader])
        open(json_file, 'w').write(out)

if __name__ == "__main__":
    convert_CSV_to_JSON()
