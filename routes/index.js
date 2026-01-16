var express = require('express');
var router = express.Router();

// MOVED: Club data is now in a separate variable so it's easier to replace with database later
const clubs = [
  {
    id: 'mun',
    name: 'Model United Nations',
    meeting: 'Tuesdays @ Lunch in Room 302',
    location: 'Room 302',
    shortDesc: 'Debate, diplomacy, and international relations.',
    commitment: 'Medium',
    advisor: 'Mr. Smith',
    officers: 'President: Jane Doe, VP: John Doe',
    banner: '/images/mun-banner.png',
    logo: '/images/mun-logo.png'
  },
  {
    id: 'cinema',
    name: 'Cinema Club',
    meeting: 'Fridays After School in Room 214',
    location: 'Room 214',
    shortDesc: 'Watch, discuss, and analyze classic and modern films.',
    commitment: 'Low',
    advisor: 'Ms. Lee',
    officers: 'President: Alice, VP: Bob',
    banner: '/images/cinema-banner.png',
    logo: '/images/cinema-logo.jpg'
  },
  {
    id: 'keyclub',
    name: 'Key Club',
    meeting: 'Thursdays @ Lunch in Room 405',
    location: 'Room 405',
    shortDesc: 'Volunteer service and leadership for the community.',
    commitment: 'High',
    advisor: 'Mrs. Johnson',
    officers: 'President: Maria, VP: Carlos',
    banner: '/images/keyclub-banner.png',
    logo: '/images/keyclub-logo.png'
  },
  {
    id: 'spongebobclub',
    name: 'Spongebob Club',
    meeting: 'Fridays @ Lunch in the Krusty Krab',
    location: 'Krusty Krab Kitchen',
    shortDesc: 'Appreciate the cinematic masterpiece that the Spongebob (first four seasons) show is.',
    commitment: 'Ultra High',
    advisor: 'Mr. Torres Sanchez',
    officers: 'President: Efren, VP: Efrain',
    banner: '/images/placeholder-banner.png',
    logo: '/images/spongebob-logo.jpg'
  }
];

// GET home page - shows all clubs
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Home',
    clubs: clubs  // Pass clubs to template
  });
});

// NEW: GET individual club page by ID
// When someone visits /clubs/mun or /clubs/cinema, etc.
router.get('/clubs/:id', function(req, res, next) {
  // Find the club that matches the ID from the URL
  const club = clubs.find(c => c.id === req.params.id);

  // If club doesn't exist, show 404
  if (!club) {
    return res.status(404).render('error', {
      message: 'Club not found',
      error: { status: 404, stack: '' }
    });
  }

  // Render the individual club page
  res.render('club', {
    title: club.name,
    club: club
  });
});

module.exports = router;