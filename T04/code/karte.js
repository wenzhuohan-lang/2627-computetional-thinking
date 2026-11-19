// Neu: lonZuX und latZuY rechnen mit einem Ausschnitt statt immer mit der
// ganzen Welt.

const AUSSCHNITT = { west: -180, ost: 180, nord: 90, sued: -90 };

function lonZuX(lon, breite, ausschnitt = AUSSCHNITT) {
  return ((lon - ausschnitt.west) / (ausschnitt.ost - ausschnitt.west)) * breite;
}

// nord - lat, weil y auf dem Bildschirm nach unten wächst.
function latZuY(lat, hoehe, ausschnitt = AUSSCHNITT) {
  return ((ausschnitt.nord - lat) / (ausschnitt.nord - ausschnitt.sued)) * hoehe;
}

const response = await fetch("orte.json");
const orte = await response.json();

const sliderBreite = document.querySelector("#breite");
const karte = document.querySelector("#karte");

// Gradnetz: Längengrade (senkrecht, Nordpol bis Südpol) und
// Breitengrade (waagrecht, parallel zum Äquator).
// Je weiter hineingezoomt, desto dichter das Netz.
function gradnetz(breite, hoehe, ausschnitt = AUSSCHNITT) {
  const abstand = breite >= 3000 ? 5 : breite >= 1200 ? 10 : 15; // Grad zwischen zwei Linien
  let linien = "";

  // Längengrade (Meridiane)
  for (let lon = Math.ceil(ausschnitt.west / abstand) * abstand; lon <= ausschnitt.ost; lon += abstand) {
    const x = lonZuX(lon, breite, ausschnitt);
    const wichtig = lon === 0; // Nullmeridian (Greenwich)
    linien += `
  <line x1="${x}" y1="0" x2="${x}" y2="${hoehe}" stroke="${wichtig ? "#888" : "#ccc"}" stroke-width="${wichtig ? 1.5 : 0.75}"/>`;
  }

  // Breitengrade (Parallelkreise)
  for (let lat = Math.ceil(ausschnitt.sued / abstand) * abstand; lat <= ausschnitt.nord; lat += abstand) {
    const y = latZuY(lat, hoehe, ausschnitt);
    const wichtig = lat === 0; // Äquator
    linien += `
  <line x1="0" y1="${y}" x2="${breite}" y2="${y}" stroke="${wichtig ? "#888" : "#ccc"}" stroke-width="${wichtig ? 1.5 : 0.75}"/>`;
  }

  return linien;
}

function zeichnen() {
  const breite = Number(sliderBreite.value);
  const hoehe = breite / 2;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${breite}" height="${hoehe}">
  <rect width="${breite}" height="${hoehe}" fill="#f4f1ea" stroke="#222"/>`;

  svg += gradnetz(breite, hoehe);

  for (const ort of orte) {
    const x = lonZuX(ort.lon, breite, AUSSCHNITT);
    const y = latZuY(ort.lat, hoehe, AUSSCHNITT);
    svg += `
  <circle cx="${x}" cy="${y}" r="4" fill="${ort.farbe}"/>
  <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
  }

  svg += `
</svg>`;

  karte.innerHTML = svg;
}

sliderBreite.addEventListener("input", zeichnen);

// ---- Dropdown: Ort wählen, Karte fliegt hin ----

const auswahl = document.querySelector("#ort-auswahl");

for (const ort of orte) {
  const option = document.createElement("option");
  option.value = ort.id;
  option.textContent = ort.name;
  auswahl.append(option);
}

// Umkehrung von lonZuX / latZuY: welcher Längen-/Breitengrad liegt bei x / y?
function xZuLon(x, breite, ausschnitt = AUSSCHNITT) {
  return ausschnitt.west + (x / breite) * (ausschnitt.ost - ausschnitt.west);
}
function yZuLat(y, hoehe, ausschnitt = AUSSCHNITT) {
  return ausschnitt.nord - (y / hoehe) * (ausschnitt.nord - ausschnitt.sued);
}

// Schiebt das Kartenfenster so, dass lon/lat in der Mitte liegt.
function zentrieren(lon, lat) {
  const breite = Number(sliderBreite.value);
  const hoehe = breite / 2;
  karte.scrollLeft = lonZuX(lon, breite) - karte.clientWidth / 2;
  karte.scrollTop = latZuY(lat, hoehe) - karte.clientHeight / 2;
}

let animation = null;

function fliegeZu(ort, dauer = 1200) {
  cancelAnimationFrame(animation);

  // Startpunkt: aktuelle Breite und aktuelle Mitte des Fensters
  const startBreite = Number(sliderBreite.value);
  const startLon = xZuLon(karte.scrollLeft + karte.clientWidth / 2, startBreite);
  const startLat = yZuLat(karte.scrollTop + karte.clientHeight / 2, startBreite / 2);

  // Ziel: ganz hineingezoomt (Maximum des Sliders), Ort in der Mitte
  const zielBreite = Number(sliderBreite.max);
  const startZeit = performance.now();

  function schritt(jetzt) {
    const t = Math.min((jetzt - startZeit) / dauer, 1);
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; // sanft an- und abbremsen

    sliderBreite.value = Math.round(startBreite + (zielBreite - startBreite) * e);
    zeichnen();
    zentrieren(startLon + (ort.lon - startLon) * e, startLat + (ort.lat - startLat) * e);

    if (t < 1) animation = requestAnimationFrame(schritt);
  }

  animation = requestAnimationFrame(schritt);
}

auswahl.addEventListener("change", () => {
  const ort = orte.find((o) => o.id === auswahl.value);
  if (ort) fliegeZu(ort);
});

zeichnen();
