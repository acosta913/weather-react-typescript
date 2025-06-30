export const formatTemperature = (temperature: number): number => {
  const kelvin = 273.16;
  return parseInt((temperature - kelvin).toString());
};
