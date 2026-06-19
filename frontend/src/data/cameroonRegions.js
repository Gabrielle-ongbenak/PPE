export const cameroonRegions = [
  {
    name: "Centre",
    cities: ["Yaoundé", "Mbalmayo", "Obala", "Akonolinga"]
  },
  {
    name: "Littoral",
    cities: ["Douala", "Edéa", "Nkongsamba", "Kribi"]
  },
  {
    name: "Ouest",
    cities: ["Bafoussam", "Dschang", "Foumban", "Bangangté", "Mbouda"]
  },
  {
    name: "Adamaoua",
    cities: ["Ngaoundéré", "Tibati", "Meiganga"]
  },
  {
    name: "Extrême-Nord",
    cities: ["Maroua", "Mokolo", "Yagoua", "Kousseri"]
  },
  {
    name: "Nord",
    cities: ["Garoua", "Guider", "Garoua-Boulaï"]
  },
  {
    name: "Est",
    cities: ["Bertoua", "Abong-Mbang", "Batouri", "Yokadouma"]
  },
  {
    name: "Sud",
    cities: ["Ebolowa", "Sangmélima", "Kribi", "Ambam"]
  },
  {
    name: "Nord-Ouest",
    cities: ["Bamenda", "Kumbo", "Wum"]
  },
  {
    name: "Sud-Ouest",
    cities: ["Buéa", "Limbe", "Kumba", "Tiko"]
  }
];

export const getCitiesByRegion = (regionName) => {
  const region = cameroonRegions.find(r => r.name === regionName);
  return region ? region.cities : [];
};

export const getAllRegions = () => {
  return cameroonRegions.map(r => r.name);
};

export const getAllCities = () => {
  return cameroonRegions.flatMap(r => r.cities);
};
