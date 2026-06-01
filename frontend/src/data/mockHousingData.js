export const mockHousingData = [
  {
    id: 1,
    title: "Studio Moderne Bastos",
    type: "Studio",
    price: 150000,
    currency: "XAF",
    location: "Yaoundé",
    region: "Centre",
    rating: 4.5,
    reviews: 23,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    description: "Studio moderne et lumineux situé dans le quartier prisé de Bastos. Proche des commerces et transports.",
    amenities: ["WiFi", "Climatisation", "Parking", "Sécurité 24/7"],
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    isFavorite: false,
    landlord: {
      name: "Jean Dupont",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      phone: "+237 699 123 456"
    }
  },
  {
    id: 2,
    title: "Appartement 3 Pièces Akwa",
    type: "Appartement",
    price: 350000,
    currency: "XAF",
    location: "Douala",
    region: "Littoral",
    rating: 4.8,
    reviews: 45,
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    description: "Bel appartement spacieux au cœur de Douala. Vue sur la ville et équipements modernes.",
    amenities: ["WiFi", "Climatisation", "Parking", "Piscine", "Sécurité 24/7"],
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800"
    ],
    isFavorite: true,
    landlord: {
      name: "Marie Kouame",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      phone: "+237 677 234 567"
    }
  },
  {
    id: 3,
    title: "Villa Meublée Bafoussam",
    type: "Villa",
    price: 500000,
    currency: "XAF",
    location: "Bafoussam",
    region: "Ouest",
    rating: 4.7,
    reviews: 18,
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    description: "Magnifique villa meublée avec jardin. Idéale pour les familles.",
    amenities: ["WiFi", "Climatisation", "Parking", "Jardin", "Sécurité 24/7", "Générateur"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    isFavorite: false,
    landlord: {
      name: "Paul Nkodo",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      phone: "+237 655 345 678"
    }
  },
  {
    id: 4,
    title: "Studio Coquet Ngaoundéré",
    type: "Studio",
    price: 80000,
    currency: "XAF",
    location: "Ngaoundéré",
    region: "Adamaoua",
    rating: 4.2,
    reviews: 12,
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    description: "Studio cosy et économique. Parfait pour les étudiants ou jeunes professionnels.",
    amenities: ["WiFi", "Ventilateur", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"
    ],
    isFavorite: false,
    landlord: {
      name: "Aminatou Ahmadou",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      phone: "+237 666 456 789"
    }
  },
  {
    id: 5,
    title: "Appartement Luxe Maroua",
    type: "Appartement",
    price: 280000,
    currency: "XAF",
    location: "Maroua",
    region: "Extrême-Nord",
    rating: 4.6,
    reviews: 31,
    bedrooms: 2,
    bathrooms: 2,
    area: 90,
    description: "Appartement de standing avec finitions haut de gamme.",
    amenities: ["WiFi", "Climatisation", "Parking", "Sécurité 24/7", "Générateur"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
    ],
    isFavorite: false,
    landlord: {
      name: "Ibrahim Mahamat",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      phone: "+237 677 567 890"
    }
  },
  {
    id: 6,
    title: "Chambre Individuelle Garoua",
    type: "Chambre",
    price: 45000,
    currency: "XAF",
    location: "Garoua",
    region: "Nord",
    rating: 4.0,
    reviews: 8,
    bedrooms: 1,
    bathrooms: 1,
    area: 20,
    description: "Chambre individuelle dans une maison partagée. Calme et sécurisé.",
    amenities: ["WiFi", "Ventilateur", "Cuisine partagée"],
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800",
      "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800"
    ],
    isFavorite: false,
    landlord: {
      name: "Habiba Ali",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
      phone: "+237 688 678 901"
    }
  },
  {
    id: 7,
    title: "Duplex Bertoua",
    type: "Duplex",
    price: 420000,
    currency: "XAF",
    location: "Bertoua",
    region: "Est",
    rating: 4.4,
    reviews: 15,
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    description: "Duplex moderne avec terrasse. Idéal pour les familles nombreuses.",
    amenities: ["WiFi", "Climatisation", "Parking", "Terrasse", "Sécurité 24/7"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"
    ],
    isFavorite: true,
    landlord: {
      name: "Emmanuel Mbarga",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      phone: "+237 699 789 012"
    }
  },
  {
    id: 8,
    title: "Studio Ebolowa",
    type: "Studio",
    price: 65000,
    currency: "XAF",
    location: "Ebolowa",
    region: "Sud",
    rating: 4.3,
    reviews: 9,
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
    description: "Studio fonctionnel proche du centre-ville.",
    amenities: ["WiFi", "Ventilateur", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800"
    ],
    isFavorite: false,
    landlord: {
      name: "Claire Mballa",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      phone: "+237 677 890 123"
    }
  },
  {
    id: 9,
    title: "Appartement Bamenda",
    type: "Appartement",
    price: 220000,
    currency: "XAF",
    location: "Bamenda",
    region: "Nord-Ouest",
    rating: 4.5,
    reviews: 27,
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    description: "Appartement bien situé avec vue panoramique.",
    amenities: ["WiFi", "Climatisation", "Parking", "Sécurité 24/7"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"
    ],
    isFavorite: false,
    landlord: {
      name: "Peter Fru",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
      phone: "+237 666 901 234"
    }
  },
  {
    id: 10,
    title: "Villa Limbe",
    type: "Villa",
    price: 450000,
    currency: "XAF",
    location: "Limbe",
    region: "Sud-Ouest",
    rating: 4.9,
    reviews: 52,
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    description: "Superbe villa avec vue sur mer. Jardin et piscine privée.",
    amenities: ["WiFi", "Climatisation", "Parking", "Piscine", "Jardin", "Sécurité 24/7", "Générateur"],
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800"
    ],
    isFavorite: true,
    landlord: {
      name: "Grace Epie",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      phone: "+237 688 012 345"
    }
  }
];

export const getHousingById = (id) => {
  return mockHousingData.find(housing => housing.id === id);
};

export const getHousingByRegion = (region) => {
  return mockHousingData.filter(housing => housing.region === region);
};

export const getHousingByCity = (city) => {
  return mockHousingData.filter(housing => housing.location === city);
};

export const getFavoriteHousing = () => {
  return mockHousingData.filter(housing => housing.isFavorite);
};
