const fs = require("fs"); // ganz oben

const roh = fs.readFileSync("orte.json", "utf8");
const orte = JSON.parse(roh);
//console.log(roh)
//console.log(orte)
// Grad in Bogenmaß umrechnen
function gradZuRad(grad) {
  return grad * Math.PI / 180;
}

// Entfernung zwischen zwei Orten in km (Haversine-Formel)
function entfernung(ort1, ort2) {
  const R = 6371; // mittlerer Erdradius in km
  const dLat = gradZuRad(ort2.lat - ort1.lat);
  const dLon = gradZuRad(ort2.lon - ort1.lon);
  const lat1 = gradZuRad(ort1.lat);
  const lat2 = gradZuRad(ort2.lat);

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Alle Paare durchgehen (jedes Paar nur einmal)
/*for (let i = 0; i < orte.length; i++) {
  for (let j = i + 1; j < orte.length; j++) {
    const km = entfernung(orte[i], orte[j]);
    console.log(`${orte[i].name} -> ${orte[j].name}: ${km.toFixed(1)} km`);
  }
}*/

const gmuend = orte.find(o => o.name === "Schwäbisch Gmünd");
const stuttgart = orte.find(o => o.name === "Stuttgart");

console.log(`Schwäbisch Gmünd -> Stuttgart: ${entfernung(gmuend, stuttgart).toFixed(1)} km`);
console.log(`Schwäbisch Gmünd -> Schwäbisch Gmünd: ${entfernung(gmuend, gmuend).toFixed(1)} km`);
console.log(`Stuttgart -> Schwäbisch Gmünd: ${entfernung(stuttgart, gmuend).toFixed(1)} km`);