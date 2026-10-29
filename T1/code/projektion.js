function lonToX(lon, breite) {
  const x = ((lon + 180) / 360) * breite;
  return x;
}

const x = lonToX(-180, 720);
console.log(x);