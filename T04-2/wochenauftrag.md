# Wochenauftrag T4 → T5

## Bis zum nächsten Termin

**Unsere Karte wird jetzt im Browser gerendert. Leider haben wir den praktischen Teil nicht fertig bekommen.
Deshalb baut ihr die zwei Aufgaben aus der Werkstatt ein, mit Hilfe vom AI-Hub.**

Keine KI in VS Code – die Aufgabe über den AI-Hub.

Für jede Aufgabe einzeln: Prompt schreiben, umsetzen, Ergebnis prüfen und committen. Erst die eine fertig und committen, dann die andere.

**Speichert die Prompts / Verlauf in `PROMPT.md`.**

### 1 — Aufgabe 1: Einen Ausschnitt auf der Karte anzeigen

`lonZuX` und `latZuY` bekommen einen dritten Parameter `ausschnitt`.

```js
const AUSSCHNITT = { west: …, ost: …, nord: …, sued: … };
```

- Eure zwei Funktionen und die Zeile `AUSSCHNITT` in den AI-Hub, nicht das ganze Projekt
- Baut den Code in euer vorhandenes Projekt ein
- Prüft das Ergebnis und lest den Diff, dann Commit

### 2 — Aufgabe 2: Zoom mit einem Slider auf Gmünd

Zoom auf Schwäbisch Gmünd (auf einen definierten **Zoompunkt**). Der Zoompunkt bleibt dabei an seiner Stelle.

```js
const ZOOMPUNKT = { lat: …, lon: … };
```

- Im Chat von Aufgabe 1 weiter und die neue Aufgabe spezifizieren
- Den Slider selbst einbauen, wie bei der Breite
- Prüft das Ergebnis und lest den Diff, dann Commit

### 3 — `README.md`

`README.md` für `T04` anpassen.

### 4 — `ENTSCHEIDUNGEN.md`

Eine neue `ENTSCHEIDUNGEN.md` in `T04`.

1. Wie funktionieren Ausschnitt und Zoom?
2. Welche Stolpersteine gab es bei der Umsetzung?
3. Was ist dir unklar geblieben?

### 6 — Abgabe

- Pushen, die Abgabe einfach auf main.
