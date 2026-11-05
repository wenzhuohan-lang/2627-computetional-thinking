const fs = require("fs"); // ganz oben

// Grundgröße der Weltkarte bei Skalierung 1 (ganze Welt = 1000 x 500 px)
const BREITE_WELT = 1000;
const HOEHE_WELT = 500;

// Feste Größe der Zeichenfläche
const BREITE_SVG = 1200;
const HOEHE_SVG = 800;

// Startwert und Bereich des Schiebereglers
const SKALIERUNG_START = 4;
const SKALIERUNG_MIN = 1;
const SKALIERUNG_MAX = 30;

function lonZuX(lon, breite) {
  return ((lon + 180) / 360) * breite;
}

function latZuY(lat, hoehe) {
  return ((90 - lat) / 180) * hoehe;
}

const orte = JSON.parse(fs.readFileSync("orte.json", "utf8"));

// 1. Alle Orte einmal bei Skalierung 1 projizieren
const punkte = orte.map((ort) => ({
  name: ort.name,
  r: Math.sqrt(ort.day), // Radius bleibt beim Zoomen gleich
  x: lonZuX(ort.lon, BREITE_WELT),
  y: latZuY(ort.lat, HOEHE_WELT),
}));

// 2. Mitte aller Orte bestimmen – dieser Punkt liegt immer in der Bildmitte
const minX = Math.min(...punkte.map((p) => p.x));
const maxX = Math.max(...punkte.map((p) => p.x));
const minY = Math.min(...punkte.map((p) => p.y));
const maxY = Math.max(...punkte.map((p) => p.y));
const mitteX = (minX + maxX) / 2;
const mitteY = (minY + maxY) / 2;

// 3. Positionen relativ zur Mitte speichern (dx, dy bei Skalierung 1)
const daten = punkte.map((p) => ({
  name: p.name,
  r: p.r,
  dx: p.x - mitteX,
  dy: p.y - mitteY,
}));

for (const d of daten) {
  console.log(d.name, "→ dx:", d.dx.toFixed(1), "dy:", d.dy.toFixed(1));
}

// 4. HTML-Seite mit SVG und Schieberegler erzeugen.
//    Der Code im <script> läuft im Browser, nicht in Node.
const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Karte</title>
<style>
  body { font-family: sans-serif; margin: 20px; }
  label { display: block; margin-bottom: 10px; }
  svg { border: 1px solid #222; background: #f4f1ea; display: block; }
</style>
</head>
<body>
<label>
  Skalierung:
  <input id="regler" type="range" min="${SKALIERUNG_MIN}" max="${SKALIERUNG_MAX}" step="1" value="${SKALIERUNG_START}">
  <span id="wert">${SKALIERUNG_START}</span>
</label>
<svg id="karte" xmlns="http://www.w3.org/2000/svg" width="${BREITE_SVG}" height="${HOEHE_SVG}"></svg>

<script>
const orte = ${JSON.stringify(daten)};
const BREITE_SVG = ${BREITE_SVG};
const HOEHE_SVG = ${HOEHE_SVG};
const NS = "http://www.w3.org/2000/svg";

const svg = document.getElementById("karte");
const regler = document.getElementById("regler");
const wert = document.getElementById("wert");

// Kreise und Beschriftungen nur einmal anlegen
const elemente = orte.map((ort) => {
  const kreis = document.createElementNS(NS, "circle");
  kreis.setAttribute("r", ort.r);
  kreis.setAttribute("fill", "#c0392b");

  const text = document.createElementNS(NS, "text");
  text.setAttribute("font-family", "sans-serif");
  text.setAttribute("font-size", "11");
  text.textContent = ort.name;

  svg.append(kreis, text);
  return { ort, kreis, text };
});

// Verschiebung durch Ziehen mit der Maus, gemessen in Kartenkoordinaten
// (bei Skalierung 1). So bleibt beim Zoomen der Punkt in der Bildmitte gleich.
let verschiebungX = 0;
let verschiebungY = 0;

// Nur die Positionen neu berechnen (Radius und Schriftgröße bleiben)
function zeichne() {
  const skalierung = Number(regler.value);
  for (const { ort, kreis, text } of elemente) {
    const x = BREITE_SVG / 2 + (ort.dx + verschiebungX) * skalierung;
    const y = HOEHE_SVG / 2 + (ort.dy + verschiebungY) * skalierung;
    kreis.setAttribute("cx", x);
    kreis.setAttribute("cy", y);
    text.setAttribute("x", x + ort.r + 4);
    text.setAttribute("y", y + 4);
  }
  wert.textContent = skalierung;
}

regler.addEventListener("input", zeichne);

// Ziehen mit der Maus (Pointer-Events funktionieren auch mit Touch)
let ziehen = false;
let letzteX = 0;
let letzteY = 0;

svg.style.cursor = "grab";
svg.style.touchAction = "none";

svg.addEventListener("pointerdown", (e) => {
  ziehen = true;
  letzteX = e.clientX;
  letzteY = e.clientY;
  svg.setPointerCapture(e.pointerId);
  svg.style.cursor = "grabbing";
});

svg.addEventListener("pointermove", (e) => {
  if (!ziehen) return;
  const skalierung = Number(regler.value);
  // Mausbewegung in Pixeln durch Skalierung teilen = Bewegung auf der Karte
  verschiebungX += (e.clientX - letzteX) / skalierung;
  verschiebungY += (e.clientY - letzteY) / skalierung;
  letzteX = e.clientX;
  letzteY = e.clientY;
  zeichne();
});

function ziehenEnde() {
  ziehen = false;
  svg.style.cursor = "grab";
}
svg.addEventListener("pointerup", ziehenEnde);
svg.addEventListener("pointercancel", ziehenEnde);

zeichne();
</script>
</body>
</html>
`;

fs.writeFileSync("karte.html", html);
