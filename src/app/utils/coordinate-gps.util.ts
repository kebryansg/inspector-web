export const getCoordinatesFromUrl = (url: string) => {
  // Buscar la parte de la URL que contiene las coordenadas
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = url.match(regex);

  // Si se encuentran las coordenadas, extraerlas y devolverlas
  if (match) {
    const latitude = parseFloat(match[1]);
    const longitude = parseFloat(match[2]);
    return {latitude, longitude};
  } else {
    return null; // Si no se encuentran, devolver null
  }
}
