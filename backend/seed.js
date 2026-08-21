// ============================================================
// seed.js - Populate database with sample data
// Run: node seed.js (from the backend folder)
// ============================================================

const { connectDB } = require('./db-setup');
const User = require('./models/User');
const Tour = require('./models/Tour');

// Image URLs for tours
const goldenTri = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const kerala = "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
const thailand = "https://images.unsplash.com/photo-1589181229070-0dc068beeaad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

const sampleTours = [
  {
    name: 'Golden Triangle Tour',
    destination: 'Delhi - Agra - Jaipur',
    price: 15000,
    duration: 6,
    description: 'Explore India\'s famous Golden Triangle covering Delhi, Agra with the Taj Mahal, and Jaipur the Pink City. Includes heritage sites, local cuisine, and cultural experiences.',
    availableSeats: 20,
    image: `${goldenTri}`,
    itinerary: [
      { day: 1, location: 'Delhi', activities: 'Arrival, Check-in, evening visit to India Gate.' },
      { day: 2, location: 'Delhi', activities: 'Full day sightseeing: Red Fort, Qutub Minar, Lotus Temple.' },
      { day: 3, location: 'Agra', activities: 'Drive to Agra, visit Taj Mahal at sunset.' },
      { day: 4, location: 'Agra', activities: 'Visit Agra Fort, drive to Jaipur via Fatehpur Sikri.' },
      { day: 5, location: 'Jaipur', activities: 'Amber Fort, Hawa Mahal, and Jantar Mantar.' },
      { day: 6, location: 'Delhi', activities: 'Shopping at Johari Bazaar, drive back to Delhi for departure.' },
    ],
  },
  {
    name: 'Kerala Backwaters',
    destination: 'Alleppey, Kerala',
    price: 12000,
    duration: 4,
    description: 'Cruise through serene backwaters on a traditional houseboat. Experience lush greenery, coconut palms, and authentic Kerala cuisine.',
    availableSeats: 15,
    image: `${kerala}`,
    itinerary: [
      { day: 1, location: 'Cochin', activities: 'Arrival, transfer to Alleppey, board the houseboat.' },
      { day: 2, location: 'Alleppey', activities: 'Cruise through backwaters, enjoy local meals on board.' },
      { day: 3, location: 'Kumarakom', activities: 'Visit Bird Sanctuary and local village life.' },
      { day: 4, location: 'Cochin', activities: 'Sightseeing in Fort Kochi, departure.' },
    ],
  },
  {
    name: 'Goa Beach Holiday',
    destination: 'Goa',
    price: 8000,
    duration: 3,
    description: 'Relax on beautiful beaches, enjoy water sports, visit old Portuguese churches, and experience vibrant nightlife in sunny Goa.',
    availableSeats: 30,
    image: `${thailand}`,
    itinerary: [
      { day: 1, location: 'North Goa', activities: 'Arrival, Calangute & Baga beach, evening at a beach shack.' },
      { day: 2, location: 'South Goa', activities: 'Basilica of Bom Jesus, Old Goa churches, Miramar beach.' },
      { day: 3, location: 'Panjim', activities: 'Dolphin trip, shopping at Panjim market, departure.' },
    ],
  },
  {
    name: 'Himalayan Adventure',
    destination: 'Manali, Himachal Pradesh',
    price: 18000,
    duration: 7,
    description: 'Thrilling adventure in the Himalayas! Includes trekking, snow activities, Rohtang Pass visit, and camping under the stars.',
    availableSeats: 12,
    image: `${goldenTri}`,
    itinerary: [
      { day: 1, location: 'Manali', activities: 'Arrival, rest and acclimatization.' },
      { day: 2, location: 'Manali', activities: 'Hadimba Temple, Vashisht Springs, and Mall Road.' },
      { day: 3, location: 'Solang Valley', activities: 'Paragliding, zorbing, and adventure sports.' },
      { day: 4, location: 'Rohtang Pass', activities: 'Snow activities and breathtaking mountain views.' },
      { day: 5, location: 'Beas River', activities: 'River rafting and riverside camping.' },
      { day: 6, location: 'Naggar', activities: 'Visit Naggar Castle and local art galleries.' },
      { day: 7, location: 'Manali', activities: 'Last minute shopping, departure.' },
    ],
  },
  {
    name: 'Rajasthan Desert Safari',
    destination: 'Jaisalmer, Rajasthan',
    price: 14000,
    duration: 5,
    description: 'Experience the magic of the Thar Desert with camel safaris, traditional folk music, desert camping, and the magnificent Jaisalmer Fort.',
    availableSeats: 18,
    image: `${kerala}`,
    itinerary: [
      { day: 1, location: 'Jaisalmer', activities: 'Arrival, check-in to desert camp.' },
      { day: 2, location: 'Sam Dunes', activities: 'Camel safari, sunset in the dunes, folk music & dance.' },
      { day: 3, location: 'Jaisalmer Fort', activities: 'Explore the Golden Fort and Patwon ki Haveli.' },
      { day: 4, location: 'Gadisar Lake', activities: 'Boating and visiting local markets.' },
      { day: 5, location: 'Jaisalmer', activities: 'Departure.' },
    ],
  },
  {
    name: 'Andaman Island Paradise',
    destination: 'Port Blair & Havelock Island',
    price: 25000,
    duration: 5,
    description: 'Discover pristine beaches, crystal-clear waters, and vibrant coral reefs. Includes snorkeling, scuba diving, and a ferry to Havelock Island.',
    availableSeats: 10,
    image: `${thailand}`,
    itinerary: [
      { day: 1, location: 'Port Blair', activities: 'Arrival, Cellular Jail light and sound show.' },
      { day: 2, location: 'Havelock Island', activities: 'Ferry to Havelock, Radhanagar Beach.' },
      { day: 3, location: 'Elephant Beach', activities: 'Snorkeling and water sports.' },
      { day: 4, location: 'Neil Island', activities: 'Visit Bharatpur and Laxmanpur beaches.' },
      { day: 5, location: 'Port Blair', activities: 'Return ferry, departure.' },
    ],
  },
];

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Tour.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user (password will be hashed by the model)
    await User.create({
      name: 'Admin User',
      email: 'admin@tour.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91 9999999999',
    });
    console.log('👤 Admin created: admin@tour.com / admin123');

    // Create a sample regular user
    await User.create({
      name: 'John Traveler',
      email: 'john@example.com',
      password: 'user123',
      role: 'user',
      phone: '+91 8888888888',
    });
    console.log('👤 User created: john@example.com / user123');

    // Insert sample tours
    await Tour.insertMany(sampleTours);
    console.log(`🗺️  Inserted ${sampleTours.length} sample tours`);

    console.log('\n🎉 Seed completed! You can now run the app.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
