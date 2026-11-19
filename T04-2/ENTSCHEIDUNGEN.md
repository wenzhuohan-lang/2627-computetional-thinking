1. Wie funktionieren Ausschnitt und Zoom?
Der Rahmen hat eine feste Größe. Der „Ausschnitt" bestimmt, welcher Teil der Welt im Rahmen zu sehen ist. Er besteht aus vier Rändern, die in Grad angegeben werden. Ohne Zoom umfasst der Ausschnitt die ganze Welt.

Der Rahmen selbst wird nicht größer, sondern der Ausschnitt wird kleiner: Die Spanne in Grad wird durch den Parameter zoom geteilt. Auf der gleichen Pixelfläche ist weniger von der Welt zu sehen, deshalb wirkt alles größer.
2. Welche Stolpersteine gab es bei der Umsetzung?

Die KI hat beim Einbauen des Zooms auch die Anfangsgröße meiner Weltkarte verändert. Statt nur hineinzuzoomen, war die Karte schon beim Öffnen größer als vorher. Dafür gab es zwei Gründe: Die Rahmengröße wurde fest auf 720 px gesetzt, statt meine ursprüngliche Größe zu übernehmen. Außerdem startete der Slider nicht bei 0, sodass `zoom` schon am Anfang größer als 1 war. Ich musste die ursprüngliche Größe wiederherstellen und den Zoom so berechnen, dass er ganz links am Slider immer 1 ist .

3. Was ist dir unklar geblieben?
