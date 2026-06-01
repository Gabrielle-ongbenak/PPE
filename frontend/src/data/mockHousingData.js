import img1 from '../assets/images/1.jpg';
import img2 from '../assets/images/2.jpg';
import img3 from '../assets/images/3  .jpg';
import img4 from '../assets/images/4.jpg';
import img5 from '../assets/images/5.jpg';
import img6 from '../assets/images/6.jpg';
import img7 from '../assets/images/7.jpg';
import img8 from '../assets/images/8.jpg';
import img9 from '../assets/images/9.jpg';
import img10 from '../assets/images/10.jpg';
import img11 from '../assets/images/11.jpg';
import img12 from '../assets/images/12.jpg';
import img13 from '../assets/images/13.jpg';
import img14 from '../assets/images/14.jpg';
import img15 from '../assets/images/15.jpg';

export const mockHousingData = [
  {
    id: 1,
    title: "Studio Moderne Bastos",
    type: "Studio",
    price: 150000,
    currency: "FCFA",
    location: "Yaoundé",
    region: "Centre",
    rating: 4.5,
    reviews: 23,
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    description: "Studio moderne et lumineux situé dans le quartier prisé de Bastos. Proche des commerces et transports.",
    amenities: ["WiFi", "Climatisation", "Parking", "Sécurité 24/7"],
    images: [img1, img2, img3],
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
    currency: "FCFA",
    location: "Douala",
    region: "Littoral",
    rating: 4.8,
    reviews: 45,
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    description: "Bel appartement spacieux au cœur de Douala. Vue sur la ville et équipements modernes.",
    amenities: ["WiFi", "Climatisation", "Parking", "Piscine", "Sécurité 24/7"],
    images: [img4, img5, img6],
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
    currency: "FCFA",
    location: "Bafoussam",
    region: "Ouest",
    rating: 4.7,
    reviews: 18,
    bedrooms: 4,
    bathrooms: 3,
    area: 250,
    description: "Magnifique villa meublée avec jardin. Idéale pour les familles.",
    amenities: ["WiFi", "Climatisation", "Parking", "Jardin", "Sécurité 24/7", "Générateur"],
    images: [img7, img8, img9],
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
    currency: "FCFA",
    location: "Ngaoundéré",
    region: "Adamaoua",
    rating: 4.2,
    reviews: 12,
    bedrooms: 1,
    bathrooms: 1,
    area: 35,
    description: "Studio cosy et économique. Parfait pour les étudiants ou jeunes professionnels.",
    amenities: ["WiFi", "Ventilateur", "Parking"],
    images: [img10, img11, img12],
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
    currency: "FCFA",
    location: "Maroua",
    region: "Extrême-Nord",
    rating: 4.6,
    reviews: 31,
    bedrooms: 2,
    bathrooms: 2,
    area: 90,
    description: "Appartement de standing avec finitions haut de gamme.",
    amenities: ["WiFi", "Climatisation", "Parking", "Sécurité 24/7", "Générateur"],
    images: [img13, img14, img15],
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
    currency: "FCFA",
    location: "Garoua",
    region: "Nord",
    rating: 4.0,
    reviews: 8,
    bedrooms: 1,
    bathrooms: 1,
    area: 20,
    description: "Chambre individuelle dans une maison partagée. Calme et sécurisé.",
    amenities: ["WiFi", "Ventilateur", "Cuisine partagée"],
    images: [img1, img2, img3],
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
    currency: "FCFA",
    location: "Bertoua",
    region: "Est",
    rating: 4.4,
    reviews: 15,
    bedrooms: 3,
    bathrooms: 2,
    area: 150,
    description: "Duplex moderne avec terrasse. Idéal pour les familles nombreuses.",
    amenities: ["WiFi", "Climatisation", "Parking", "Terrasse", "Sécurité 24/7"],
    images: [img4, img5, img6],
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
    currency: "FCFA",
    location: "Ebolowa",
    region: "Sud",
    rating: 4.3,
    reviews: 9,
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
    description: "Studio fonctionnel proche du centre-ville.",
    amenities: ["WiFi", "Ventilateur", "Parking"],
    images: [img7, img8, img9],
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
    currency: "FCFA",
    location: "Bamenda",
    region: "Nord-Ouest",
    rating: 4.5,
    reviews: 27,
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    description: "Appartement bien situé avec vue panoramique.",
    amenities: ["WiFi", "Climatisation", "Parking", "Sécurité 24/7"],
    images: [img10, img11, img12],
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
    currency: "FCFA",
    location: "Limbe",
    region: "Sud-Ouest",
    rating: 4.9,
    reviews: 52,
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    description: "Superbe villa avec vue sur mer. Jardin et piscine privée.",
    amenities: ["WiFi", "Climatisation", "Parking", "Piscine", "Jardin", "Sécurité 24/7", "Générateur"],
    images: [img13, img14, img15],
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
