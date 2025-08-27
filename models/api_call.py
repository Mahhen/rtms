import requests

url = "https://erail.in/rail/getTrains.aspx?Station_From=NLR&Station_To=KTYM&DataSource=0&Language=0&Cache=true"
response = requests.get(url)
text = response.text

# Split the response into individual train entries (assuming they start with a delimiter like '^')
entries = text.split('^')
trains = []

for entry in entries:
    fields = entry.split('~')
    if fields and fields[0].strip():
        train = {
            "train_number": fields[0],
            "train_name": fields[1],
            "origin": fields[2],
            "origin_code": fields[3],
            "destination": fields[4],
            "destination_code": fields[5],
            "departs_from": fields[6],
            "depart_code": fields[7],
            "arrives_at": fields[8],
            "arrive_code": fields[9],
            "distance_km": fields[39],
            # Add more fields as needed based on the tilde-delimited position
        }
        trains.append(train)

import json
print(json.dumps(trains, indent=2))
