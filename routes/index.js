var express = require('express');
var router = express.Router();
const { Club, Officer, User } = require('../models');
const { Op } = require('sequelize');

// GET home page - shows all clubs from database
router.get('/', addUserToViews, async function(req, res, next) {
  try {
    const clubs = await Club.findAll();

    const formattedClubs = clubs.map(club => ({
      id: club.id,
      name: club.clubname,
      meeting: club.meetingdate,
      location: club.clubroomnumber,
      shortDesc: club.smalldescription,
      uniqueDesc: club.uniquedescription,
      bigDesc: club.bigdescription,
      commitment: club.commitment,
      advisor: `${club.advisorfirstname || ''} ${club.advisorlastname || ''}`.trim(),
      officers: 'See details page',
      banner: club.clubbanner || '/images/placeholder-banner.png',
      logo: club.clublogo || '/images/placeholder-logo.png',
      category: club.category,
    }));

    res.render('index', {
      title: 'Edison High School Clubs',
      clubs: formattedClubs
    });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    next(error);
  }
});

// GET individual club page by ID
router.get('/clubs/:id', addUserToViews, async function(req, res, next) {
  try {
    const club = await Club.findByPk(req.params.id, {
      include: [{ model: Officer, required: false }]
    });

    if (!club) {
      return res.status(404).render('error', {
        message: 'Club not found',
        error: { status: 404, stack: '' }
      });
    }

    const officersList = club.Officers && club.Officers.length > 0
        ? club.Officers.map(o => `${o.officertitle}: ${o.officerfirstname} ${o.officerlastname}`).join(', ')
        : 'No officers listed';

    const formattedClub = {
      id: club.id,
      name: club.clubname,
      meeting: club.meetingdate,
      location: club.clubroomnumber,
      shortDesc: club.smalldescription,
      commitment: club.commitment,
      uniqueDesc: club.uniquedescription,
      advisor: `${club.advisorfirstname || ''} ${club.advisorlastname || ''}`.trim(),
      secondAdvisor: club.secondadvisorfirstname ?
          `${club.secondadvisorfirstname} ${club.secondadvisorlastname || ''}`.trim() : null,
      officers: officersList,
      banner: club.clubbanner || '/images/placeholder-banner.png',
      logo: club.clublogo || '/images/placeholder-logo.png',
      category: club.category,
      bigDesc: club.bigdescription,
    };

    res.render('club', {
      title: club.clubname,
      club: formattedClub
    });
  } catch (error) {
    console.error('Error fetching club:', error);
    next(error);
  }
});

// GET club creation form
router.get('/clubcreate', requireLogin, requireOfficerOrAdmin, addUserToViews, function(req, res) {
  res.render('club-create', { title: 'Create New Club' });
});

// POST new club
router.post('/clubs', addUserToViews, async function(req, res) {
  try {
    console.log('Form data received:', req.body);

    const newClub = await Club.create({
      clubname: req.body.clubname,
      advisorfirstname: req.body.advisorfirstname,
      advisorlastname: req.body.advisorlastname,
      meetingdate: req.body.meetingdate,
      clubroomnumber: req.body.clubroomnumber,
      category: req.body.category,
      smalldescription: req.body.smalldescription,
      uniquedescription: req.body.uniquedescription,
      commitment: req.body.commitment,
      clublogo: req.body.clublogo || 'placeholder.jpg',
      clubbanner: req.body.clubbanner || '/images/placeholder-banner.png',
      bigdescription: req.body.bigdescription,
    });

    console.log('Club created successfully:', newClub.id);
    res.redirect('/clubs/' + newClub.id);
  } catch (error) {
    console.error('FULL ERROR:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors.map(e => e.message));
    }

    res.render('club-create', {
      title: 'Create New Club',
      error: 'Failed to create club: ' + error.message,
      formData: req.body
    });
  }
});

// GET officer registration form
router.get('/registerofficer', requireLogin, addUserToViews, function(req, res) {
  res.render('register-officer', { title: 'Register Officer' });
});

// POST new officer
router.post('/officers', addUserToViews, async function(req, res) {
  try {
    await Officer.create({
      officertitle: req.body.officertitle,
      officerfirstname: req.body.officerfirstname,
      officerlastname: req.body.officerlastname,
      clubin: req.body.clubin,
      officerstudentid: req.body.officerstudentid,
      officergradelevel: req.body.officergradelevel,
      officerimage: req.body.officerimage
    });

    res.redirect('/');
  } catch (error) {
    console.error('Error creating officer:', error);
    res.render('register-officer', {
      title: 'Register Officer',
      error: 'Failed to register officer: ' + error.message
    });
  }
});

// GET search clubs
router.get('/search', addUserToViews, async function(req, res) {
  try {
    const query = req.query.q;
    const clubs = await Club.findAll({
      where: {
        [Op.or]: [
          { clubname: { [Op.iLike]: `%${query}%` } },
          { category: { [Op.iLike]: `%${query}%` } },
          { commitment: { [Op.iLike]: `%${query}%` } },
          { advisorlastname: { [Op.iLike]: `%${query}%` } },
          { smalldescription: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });

    res.render('index', {
      title: 'Search Results',
      clubs: clubs.map(club => ({
        id: club.id,
        name: club.clubname,
        meeting: club.meetingdate,
        location: club.clubroomnumber,
        shortDesc: club.smalldescription,
        commitment: club.commitment,
        uniqueDesc: club.uniquedescription,
        advisor: `${club.advisorfirstname || ''} ${club.advisorlastname || ''}`.trim(),
        officers: 'See details page',
        banner: club.clubbanner || '/images/placeholder-banner.png',
        logo: club.clublogo || '/images/placeholder-logo.png',
        category: club.category,
        bigDescription: club.bigdescription,
      })),
      searchQuery: query
    });
  } catch (error) {
    console.error('Search error:', error);
    res.redirect('/');
  }
});

// GET edit club form
router.get('/clubs/:id/edit', addUserToViews, async function(req, res) {
  try {
    const club = await Club.findByPk(req.params.id);
    if (!club) return res.status(404).send('Club not found');
    res.render('club-edit', { title: 'Edit Club', club: club });
  } catch (error) {
    next(error);
  }
});

// POST update club
router.post('/clubs/:id/edit', addUserToViews, async function(req, res) {
  try {
    await Club.update({
      clubname: req.body.clubname,
      advisorfirstname: req.body.advisorfirstname,
      advisorlastname: req.body.advisorlastname,
      meetingdate: req.body.meetingdate,
      clubroomnumber: req.body.clubroomnumber,
      category: req.body.category,
      smalldescription: req.body.smalldescription,
      commitment: req.body.commitment,
      uniquedescription: req.body.uniquedescription,
      clublogo: req.body.clublogo || 'placeholder.jpg',
      clubbanner: req.body.clubbanner || '/images/placeholder-banner.png',
      bigdescription: req.body.bigdescription,
    }, {
      where: { id: req.params.id }
    });
    res.redirect('/clubs/' + req.params.id);
  } catch (error) {
    console.error('Error updating club:', error);
    res.send('Error updating club');
  }
});

// POST delete club
router.post('/clubs/:id/delete', addUserToViews, async function(req, res) {
  try {
    await Club.destroy({ where: { id: req.params.id } });
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting club:', error);
    res.send('Error deleting club');
  }
});

const md5 = require('md5');

router.get('/registeruser', addUserToViews, function(req, res) {
  res.render('register-user', { title: 'Register User' });
});

router.post('/registeruser', addUserToViews, async function (req, res) {
  try {

    const existingUser = await User.findOne({
      where: { email: req.body.email }
    });

    if (existingUser) {
      return res.render('register-user', {
        title: 'Register User',
        error: 'Email already registered'
      });
    }

    await User.create({
      email: req.body.email,
      password: md5(req.body.password),
      ufirstname: req.body.ufirstname,
      ulastname: req.body.ulastname,
      role: req.body.role,
    });

    res.redirect('/');

  } catch (error) {
    console.error('Error creating user:', error);

    res.render('register-user', {
      title: 'Register User',
      error: 'Failed to register user: ' + error.message
    });
  }
});

const passport = require('passport');


router.post('/login', addUserToViews, passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login',
      failureMessage: 'Username or password incorrect'
    })
);
// router.post('/login', function(req, res, next) {

//   passport.authenticate('local', function(err, user, info) {

//     if (err) return next(err);

//     if (!user) {
//       return res.render('login', {
//         title: 'Login User',
//         error: info.message
//       });
//     }

//     req.logIn(user, function(err) {
//       if (err) return next(err);
//       return res.redirect('/');
//     });

//   })(req, res, next);

// });

router.get('/login', addUserToViews, function (req, res) {
  res.render('login', { title: 'Login User' });
});

module.exports.logout = function (req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
  });
  res.redirect('/login');
}

router.get('/logout', addUserToViews, function(req, res) {
  req.logout(function() {
    res.redirect('/');
  });
});

function addUserToViews(req, res, next) {
  if (req.user){
    res.locals.user = req.user;
  }
  next();
}

function requireLogin(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
}

function requireOfficerOrAdmin(req, res, next) {
  if (req.user.admin || req.user.officer) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
