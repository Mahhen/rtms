import axios from "axios";

async function fetchTrains() {
  try {
    const url = "https://erail.in/rail/getTrains.aspx?Station_From=NLR&Station_To=KTYM&DataSource=0&Language=0&Cache=true";
    const response = await axios.get(url);

    const text = response.data;

    // Split into train entries using '^'
    const entries = text.split("^");
    const trains = [];

    for (let entry of entries) {
      const fields = entry.split("~");
      if (fields.length > 1 && fields[0].trim()) {
        const train = {
          train_number: fields[0],
          train_name: fields[1],
          origin: fields[2],
          origin_code: fields[3],
          destination: fields[4],
          destination_code: fields[5],
          departs: fields[6],
          depart_code: fields[7],
          arrives_at: fields[8],
          arrive_code: fields[9],
          distance_km: fields[39],
          
        };
        trains.push(train);
      }
    }

    console.log(JSON.stringify(trains, null, 2));
  } catch (err) {
    console.error("Error fetching trains:", err.message);
  }
}

fetchTrains();
