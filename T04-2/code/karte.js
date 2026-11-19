const AUSSCHNITT = { west: -180, ost: 180, nord: 90, sued: -90 };

const WELTMITTE = { lon: 0, lat: 0 };
const GMUEND = { lon: 9.80, lat: 48.80 };

const BREITE = 720;
const HOEHE = BREITE / 2;

// Mischt zwei Punkte: anteil = 0 → a, anteil = 1 → b
function zwischen(a, b, anteil) {
  return {
    lon: a.lon + (b.lon - a.lon) * anteil,
    lat: a.lat + (b.lat - a.lat) * anteil,
  };
}

// zoom = 1 → ganze Welt, Mitte bei 0/0.
// Je größer der Zoom, desto näher rückt die Mitte an Gmünd.
function ausschnittMitZoom(zoom, ziel = GMUEND, basis = AUSSCHNITT) {
  const anteil = 1 - 1 / (zoom * zoom);
  const mitte = zwischen(WELTMITTE, ziel, anteil);

  const halbeSpanneLon = (basis.ost - basis.west) / 2 / zoom;
  const halbeSpanneLat = (basis.nord - basis.sued) / 2 / zoom;

  return {
    west: mitte.lon - halbeSpanneLon,
    ost:  mitte.lon + halbeSpanneLon,
    nord: mitte.lat + halbeSpanneLat,
    sued: mitte.lat - halbeSpanneLat,
  };
}

function lonZuX(lon, breite, ausschnitt = AUSSCHNITT) {
  return ((lon - ausschnitt.west) / (ausschnitt.ost - ausschnitt.west)) * breite;
}

// nord - lat, weil y auf dem Bildschirm nach unten wächst.
function latZuY(lat, hoehe, ausschnitt = AUSSCHNITT) {
  return ((ausschnitt.nord - lat) / (ausschnitt.nord - ausschnitt.sued)) * hoehe;
}

const response = await fetch("orte.json");
const orte = await response.json();

const sliderZoom = document.querySelector("#breite");
const karte = document.querySelector("#karte");

function zeichnen() {
  // Ganz links am Slider ist immer zoom = 1 (ganze Welt)
  const stufe = Number(sliderZoom.value) - Number(sliderZoom.min);
  const zoom = 2 ** stufe;
  const ausschnitt = ausschnittMitZoom(zoom);

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BREITE}" height="${HOEHE}">
  <rect width="${BREITE}" height="${HOEHE}" fill="#f4f1ea" stroke="#222"/>`;

  for (const ort of orte) {
    const x = lonZuX(ort.lon, BREITE, ausschnitt);
    const y = latZuY(ort.lat, HOEHE, ausschnitt);
    svg += `
  <circle cx="${x}" cy="${y}" r="4" fill="${ort.farbe}"/>
  <text x="${x + 8}" y="${y + 4}" font-family="sans-serif" font-size="11">${ort.name}</text>`;
  }

  svg += `
</svg>`;

  karte.innerHTML = svg;
}

sliderZoom.addEventListener("input", zeichnen);

zeichnen();