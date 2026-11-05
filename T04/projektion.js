const fs = require("fs"); // ganz oben

const BREITE_SVG = 2000;
const HOEHE_SVG = 1000;

function lonZuX(lon, breite) {
  return ((lon + 180) / 360) * breite;
}

function latZuY(lat, hoehe) {
  return ((90 - lat) / 180) * hoehe;
}

const orte = JSON.parse(fs.readFileSync("orte.json", "utf8"));

for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE_SVG);
  const y = latZuY(ort.lat, HOEHE_SVG);
  console.log(ort.name, "→ x:", x, "y:", y);
}

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE_SVG}" height="${HOEHE_SVG}">
  <rect width="${BREITE_SVG}" height="${HOEHE_SVG}" fill="#f4f1ea" stroke="#222"/>`;

for (const ort of orte) {
  const x = lonZuX(ort.lon, BREITE_SVG);
  const y = latZuY(ort.lat, HOEHE_SVG);
  const r = Math.sqrt(ort.day);
  svg += `
  <circle cx="${x}" cy="${y}" r="${r}" fill="#c0392b"/>
  <text x="${x + 10}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
}

svg += `
</svg>`;

fs.writeFileSync("karte.svg", svg);