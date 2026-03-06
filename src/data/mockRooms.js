export const MOCK_ROOMS = [
    // SITE ABOMEY-CALAVI
    {
        id: 'abomey-harmonie',
        name: 'Harmonie',
        description: 'Chambre Simple Ventillée',
        prices: { ventillee: 10500 },
        site: 'Abomey-Calavi',
        amenities: ['Ventilateur', 'Vue sur jardin'],
        image: '/Images/harmonie_v2.jpg',
        room_images: [
            { url: '/Images/harmonie_v2.jpg' }
        ]
    },
    {
        id: 'abomey-simplicite',
        name: 'Simplicité',
        description: 'Chambre Simple',
        prices: { ventillee: 10500, climee: 12500 },
        site: 'Abomey-Calavi',
        amenities: ['Ventilateur', 'Vue verdure'],
        image: '/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg', // Vient de Douceur
        room_images: [{ url: '/Images/b6c0562e-0254-487d-ae87-64b738d093a0.jpg' }]
    },
    {
        id: 'abomey-tranquilite',
        name: 'Tranquilité',
        description: 'Chambre Simple',
        prices: { ventillee: 10500, climee: 12500 },
        site: 'Abomey-Calavi',
        amenities: ['Ventilateur', 'Climatisation'],
        image: '/Images/02d29287-0779-4d84-924c-1fb44b55ad73.jpg', // Vient de Harmonie
        room_images: [
            { url: '/Images/02d29287-0779-4d84-924c-1fb44b55ad73.jpg' },
            { url: '/Images/6d2691ec-8b2b-4940-bca3-d0a161e4bc5f.jpg' }
        ]
    },
    {
        id: 'abomey-douceur',
        name: 'Douceur',
        description: 'Chambre Salon avec Balcon sur Jardin',
        prices: { ventillee: 20500, climee: 26500 },
        site: 'Abomey-Calavi',
        amenities: ['Cuisine équipée', 'Balcon Privé', 'Espace Vert', 'Climatisation'],
        image: '/Images/CHAMBRE DOUCEUR.jpg',
        room_images: [
            { url: '/Images/CHAMBRE DOUCEUR.jpg' },
            { url: '/Images/4c895919-1d54-42ed-94ca-a93e581f0cb2.jpg' }
        ]
    },
    {
        id: 'abomey-noblesse',
        name: 'Noblesse',
        description: '2 chambres salon meublées, cuisine, douche et balcon',
        prices: { ventillee: 31500, climee: 41500 },
        site: 'Abomey-Calavi',
        amenities: ['Cuisine équipée', 'Balcon', 'Grand Salon', 'Ventilateur', 'Climatisation'],
        image: '/Images/SUITE NOBLESSE.jpg',
        room_images: [
            { url: '/Images/SUITE NOBLESSE.jpg' },
            { url: '/Images/SUITE NOBLESSE 3.jpg' },
            { url: '/Images/SUITE NOBLESSE 4.jpg' },
            { url: '/Images/SUITE NOBLESSE 5.jpg' }
        ]
    },
    {
        id: 'abomey-conference',
        name: 'Salle de Conférence',
        description: 'Equipement de Sonorisation (50 à 70 places)',
        prices: { ventillee: 50000, climee: 70000 },
        site: 'Abomey-Calavi',
        amenities: ['Sonorisation', 'Sièges confortables', 'Climatisation', 'Vidéoprojecteur'],
        image: '/Images/SALLE DE CONFERENCE.jpg',
        room_images: [{ url: '/Images/SALLE DE CONFERENCE.jpg' }]
    },

    // SITE ALLADA
    {
        id: 'allada-1',
        name: 'Chambre Standard (2 places)',
        description: 'Ventillée, Lit 2 places',
        price_per_night: 5500,
        site: 'Allada',
        amenities: ['Ventilateur', 'Lit 2 places'],
        image: '/Images/CHAMBRE ALLADA.jpg',
        room_images: [{ url: '/Images/CHAMBRE ALLADA.jpg' }]
    },
    {
        id: 'allada-2',
        name: 'Chambre Standard (3 places)',
        description: 'Ventillée, Lit 3 places',
        price_per_night: 8000,
        site: 'Allada',
        amenities: ['Ventilateur', 'Lit 3 places'],
        image: '/Images/CHAMBRE ALLADA 2.jpg',
        room_images: [{ url: '/Images/CHAMBRE ALLADA 2.jpg' }]
    },
    {
        id: 'allada-3',
        name: 'Chambre Climée',
        description: 'Climée, Lit 3 places',
        price_per_night: 10500,
        site: 'Allada',
        amenities: ['Climatisation', 'Lit 3 places'],
        image: '/Images/CHAMBRE ALLADA 3.jpg',
        room_images: [
            { url: '/Images/CHAMBRE ALLADA 3.jpg' },
            { url: '/Images/CHAMBRE ALLADA.jpg' }
        ]
    }
];
