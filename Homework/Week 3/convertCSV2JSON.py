import csv
import json


# initialises csv infile, json outfile and names each field
infile = "KNMI_data.txt"
fieldnames = "STN", "YYYYMMDD", "DR"
outfile = "KNMI_data.json"

# converts csv file to json file
with open(infile, "r") as f:
    reader = csv.DictReader(f, fieldnames = (fieldnames))
    out = json.dumps([row for row in reader])
    open(outfile, 'w').write(out)
