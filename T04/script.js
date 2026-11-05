const BREITE_SVG = 720;
const HOEHE_SVG = 360;

const sliderBreite = document.querySelector("#breite")
console .log(sliderBreite)

function lonZuX(lon, breite) {
  return ((lon + 180) / 360) * breite;
}

function latZuY(lat, hoehe) {
  return ((90 - lat) / 180) * hoehe;
}

// const orte = JSON.parse(fs.readFileSync("orte.json", "utf8"));
const repose = await fetch("orte.json")
const orte =await repose.json()
console.log(orte)

// for (const ort of orte) {
//  const x = lonZuX(ort.lon, BREITE);
//  const y = latZuY(ort.lat, HOEHE);
//  console.log(ort.name, "→ x:", x, "y:", y);
// }

function zeichnen(){
 const breite = sliderBreite.value;
 const hoehe = breite/2;
 console.log("zeichnen")
 let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}">
 <rect width="${breite}" height="${hoehe}" fill="#f4f1ea" stroke="#222"/>`;

for (const ort of orte) {
 const x = lonZuX(ort.lon, breite);
 const y = latZuY(ort.lat, hoehe);
 const r = Math.sqrt(ort.day);
 svg += `
 <circle cx="${x}" cy="${y}" r="${r}" fill="#c0392b"/>
 <text x="${x + 10}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
}

svg += `
</svg>`;

//fs.writeFileSync("karte.svg", svg);
document.querySelector("#karte").innerHTML = svg

}

sliderBreite.addEventListener("input",zeichnen);
zeichnen()