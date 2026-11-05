
```
将projektion.js中的画布尺寸改为距离最上下左右第一地址的坐标30px，然后将已有的图纸倍数放大，避免因为城市距离太近和在某城市的天数过大而导致重叠或者遮挡

Ändere in projektion.js die Größe der Zeichenfläche so, dass sie oben, unten, links und rechts genau 30 px vom jeweils äußersten Ort entfernt endet. Vergrößere anschließend die bestehende Karte um einen Faktor, damit sich Kreise und Beschriftungen nicht mehr überlappen oder verdecken, wenn Städte sehr nah beieinander liegen oder die Aufenthaltsdauer (day) in einer Stadt sehr groß ist.

问题变成了画布太大了看不清楚了

当前projektion.js的问题是，当SKALIERUNG小的时候互相遮挡，当SKALIERUNG大的时候，svg变得非常大，因此我希望增加一个滑块。一个固定大小的 SVG（1200 × 800 px），一个滑动条（<input type="range">，取值 1 到 30，初始值 4），用来控制缩放比例。拖动滑动条时，只重新计算地点的位置。圆的半径和字号保持不变。缩放以画布中心为基准，加上鼠标拖拽平移，放大后可以拖到欧洲或亚洲去看。

Das Problem im aktuellen projektion.js: Ist SKALIERUNG klein, verdecken sich die Orte gegenseitig; ist SKALIERUNG groß, wird das SVG sehr groß. Deshalb möchte ich einen Schieberegler hinzufügen: ein SVG mit fester Größe (1200 × 800 px) und einen Schieberegler (<input type="range">, Werte 1 bis 30, Startwert 4), der die Skalierung steuert. Beim Schieben sollen nur die Positionen der Orte neu berechnet werden. Kreisradius und Schriftgröße bleiben gleich. Gezoomt wird um die Mitte der Zeichenfläche. Zusätzlich soll man die Karte mit der Maus verschieben können, damit man nach dem Vergrößern zu Europa oder Asien ziehen kann.