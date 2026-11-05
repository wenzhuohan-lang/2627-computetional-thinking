const BREITE = 720;
const HOEHE = 360;

function lonZuX(lon, breite) {
  return ((lon + 180) / 360) * breite;
}

// 90 - lat, weil y auf dem Bildschirm nach unten wächst.
function latZuY(lat, hoehe) {
  return ((90 - lat) / 180) * hoehe;
}

// // Zwei Schritte, nicht einer: erst den Text von der Platte holen,
// // dann den Text in Daten verwandeln. JSON.parse ist die Grenze zwischen
// // "Zeichen in einer Datei" und "Objekte im Speicher".
// const roh = fs.readFileSync("orte.json", "utf8");
// const orte = JSON.parse(roh);

const response = await fetch("orte.json")
// console.log(response.text());
const orte = await response.json();

console.log("Gelesen:", orte.length, "Orte aus orte.json");
console.log("Typ von roh:  ", typeof roh);
console.log("Typ von orte: ", typeof orte, "– Array?", Array.isArray(orte));
console.log();

for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE);
  const y = latZuY(ort.lat, HOEHE);
  console.log(ort.name, "→ x:", x, "y:", y);
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE}" height="${HOEHE}">
  <rect width="${BREITE}" height="${HOEHE}" fill="#f4f1ea" stroke="#222"/>`;

for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE);
  const y = latZuY(ort.lat, HOEHE);
  svg += `
  <circle cx="${x}" cy="${y}" r="4" fill="${ort.farbe}"/>
  <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
}

svg += `
</svg>`;

// fs.writeFileSync("karte.svg", svg);
document.querySelector("#karte").innerHTML = svg;