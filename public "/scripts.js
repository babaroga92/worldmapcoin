var map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap',
  minZoom: 2,
  maxZoom: 18
}).addTo(map);

let markers = {}; // Objekt za praćenje markera po imenu grada

// Dohvati iskorištene markere iz localStorage
const usedCities = JSON.parse(localStorage.getItem('usedCities') || '[]');

fetch('locations.json')
  .then(response => response.json())
  .then(data => {
    data.largeMarkers.forEach(loc => {
      // Preskoči gradove koji su već iskorišteni
      if (!usedCities.includes(loc.name)) {
        var marker = L.marker(loc.coords).addTo(map);
        marker.bindPopup(`
          <b>${loc.name}</b><br>
          Reward: ${loc.reward}<br>
          Riddle: ${loc.riddle}<br>
          <input type="text" id="answer_${loc.name}" placeholder="Enter answer">
          <button onclick="checkAnswer('${loc.name}', '${getCorrectAnswer(loc.name)}', this)">Check</button>
          <div id="qr_${loc.name}" style="display:none;"></div>
        `);
        markers[loc.name] = marker; // Spremi marker u objekt
        console.log(`Marker added for ${loc.name} at ${loc.coords} with ID: ${marker._leaflet_id}`);
      } else {
        console.log(`Skipped used city: ${loc.name}`);
      }
    });
  })
  .catch(error => console.error('Error loading locations.json:', error));

function getCorrectAnswer(city) {
  const answers = {
    "Washington, D.C.": "Washington Monument",
    "London": "Big Ben",
    "Zagreb": "Ban Jelačić Square",
    "Belgrade": "Republic Square",
    "Paris": "Eiffel Tower",
    "Rome": "Colosseum",
    "Moscow": "Red Square",
    "Ankara": "Anitkabir",
    "Berlin": "Berlin Wall",
    "Tokyo": "Shibuya Crossing",
    "Canberra": "Parliament House",
    "Buenos Aires": "Tango",
    "Sydney": "Sydney Opera House",
    "Brasilia": "Cathedral of Brasilia",
    "Nairobi": "Masai Mara",
    "Cairo": "Great Pyramid",
    "Pretoria": "Voortrekker Monument",
    "Beijing": "Tiananmen Square",
    "New Delhi": "India Gate",
    "Bangkok": "Temple of the Emerald Buddha",
    "Jakarta": "Merdeka Square",
    "Tehran": "Golestan Palace",
    "Karachi": "Quaid-e-Azam Square",
    "Mumbai": "Chhatrapati Shivaji Terminus",
    "Manila": "Rizal Park",
    "Singapore": "Gardens by the Bay",
    "Abu Dhabi": "Sheikh Zayed Grand Mosque",
    "Taipei": "Taipei 101",
    "Kuala Lumpur": "Petronas Towers",
    "Montevideo": "Plaza Independencia",
    "Lima": "Plaza Mayor",
    "Santiago": "San Cristobal Hill",
    "Bogota": "Gold Museum",
    "San José": "Arenal Volcano",
    "Hyderabad": "Golconda Fort",
    "Dhaka": "Shahbag Square",
    "Phnom Penh": "Norodom Square",
    "Hanoi": "Hoan Kiem Lake",
    "San Salvador": "Metropolitan Cathedral",
    "Niamey": "Place de la Concorde",
    "Khartoum": "Al-Mogran Square",
    "Accra": "Independence Square",
    "Lagos": "Tafawa Balewa Square",
    "Kampala": "Constitutional Square",
    "Kinshasa": "Martyrs' Square",
    "Maputo": "Independence Square",
    "Antananarivo": "Analakely Square",
    "Windhoek": "Independence Square",
    "Budapest": "Chain Bridge",
    "Prague": "Prague Castle",
    "Vienna": "Schönbrunn Palace",
    "Stockholm": "Gamla Stan",
    "Copenhagen": "Little Mermaid",
    "Helsinki": "Senate Square",
    "Reykjavik": "Geysir",
    "Oslo": "Oslofjord",
    "Philadelphia": "Liberty Bell",
    "Amsterdam": "Herengracht Canal",
    "Vatican City": "St. Peter's Basilica",
    "Hong Kong": "Victoria Harbour",
    "Wellington": "Wellington Cable Car",
    "Port Moresby": "Gordon Market",
    "Kyiv": "Maidan Nezalezhnosti",
    "Santo Domingo": "Cathedral of Santa Maria la Menor",
    "St. John's": "Fort James",
    "Guatemala City": "Santa Catalina Arch",
    "Antigua Guatemala": "Santa Catalina Arch",
    "San Miguel": "Church of San Miguel",
    "Kingston": "Coronation Market",
    "Road Town": "Fort Charlotte",
    "Bridgetown": "Parliament Buildings",
    "St. George's": "Fort George",
    "Castries": "Castries Market",
    "Vieux Fort": "Toraille Waterfall",
    "Roseau": "Botanical Gardens",
    "Charlotte Amalie": "Havensight Market",
    "Philipsburg": "Great Bay Beach",
    "Kingstown": "Botanical Garden",
    "Basseterre": "Circus",
    "Algiers": "Casbah of Algiers",
    "Tunis": "Great Mosque of Zitouna",
    "Rabat": "Hassan Tower",
    "Mogadishu": "Bakaara Market",
    "Asmara": "Enda Mariam Cathedral",
    "Abuja": "Aso Rock",
    "Yamoussoukro": "Basilica of Our Lady of Peace",
    "Dakar": "Goree Island",
    "Bamako": "Grand Market",
    "Seoul": "Gyeongbokgung Palace",
    "Riyadh": "Kingdom Centre Tower",
    "Damascus": "Umayyad Mosque",
    "Tehran": "Golestan Palace",
    "Dubai": "Burj Khalifa",
    "Lisbon": "Belem Tower",
    "Madrid": "Royal Palace",
    "Athens": "Acropolis",
    "Bucharest": "Palace of the Parliament",
    "Bern": "Bear Pit",
    "Nuku'alofa": "Royal Palace",
    "Funafuti": "Funafuti Lagoon",
    "Warsaw": "Royal Castle",
    "Rome": "Trevi Fountain",
    "Oslo": "Vigeland Sculpture Park",
    "Ottawa": "Rideau Canal",
    "Mexico City": "Zocalo",
    "Quito": "Basilica of the National Vow",
    "Port Vila": "Port Vila Market",
    "Suva": "Government Buildings",
    "Apia": "Mulinu'u Clock Tower"
  };
  return answers[city] || "";
}

function checkAnswer(city, correctAnswer, button) {
  var userAnswer = document.getElementById(`answer_${city}`).value.trim().toLowerCase();
  correctAnswer = correctAnswer.toLowerCase();
  var qrDiv = document.getElementById(`qr_${city}`);
  if (userAnswer === correctAnswer) {
    qrDiv.style.display = "block";
    qrDiv.innerHTML = `<br><h2 style="color: green;">CONGRATULATIONS YOU HAVE WON THE PRIZE</h2><br><small>Enter your wallet address:</small><br><input type="text" id="wallet_${city}" placeholder="Enter Phantom address"><button onclick="submitAddress('${city}')">Submit</button><br><small>I will send tokens after verification!</small>`;
  } else {
    alert("Wrong answer. Try again!");
  }
}

function submitAddress(city) {
  var walletAddress = document.getElementById(`wallet_${city}`).value.trim();
  if (walletAddress) {
    fetch('/submit-address', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ city, walletAddress })
    })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok ' + response.statusText);
      return response.text();
    })
    .then(message => {
      alert(message);
      // Ukloni marker nakon uspješnog slanja adrese
      if (markers[city]) {
        console.log(`Attempting to remove marker for ${city} with ID: ${markers[city]._leaflet_id}`);
        if (map.hasLayer(markers[city])) {
          map.removeLayer(markers[city]);
          console.log(`Marker for ${city} removed successfully`);
        } else {
          console.log(`Marker for ${city} not found on map`);
        }
        delete markers[city]; // Očisti iz objekta
        // Označi grad kao iskorišten u localStorage
        if (!usedCities.includes(city)) {
          usedCities.push(city);
          localStorage.setItem('usedCities', JSON.stringify(usedCities));
          console.log(`Marked ${city} as used in localStorage`);
        }
        // Zatvori popup
        var popup = document.querySelector(`#qr_${city}`).closest('.leaflet-popup-content-wrapper');
        if (popup) popup.style.display = 'none';
      } else {
        console.log(`No marker reference found for ${city}`);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      alert('Error: ' + error.message);
    });
  } else {
    alert("Please enter a valid wallet address!");
  }
}
