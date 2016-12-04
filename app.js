require('dotenv').config(); //read in and parse .env file
var express = require('express')
var app = express()
var Sequelize = require('sequelize')
var cors = require('cors') //cross origin resource sharing
var bodyParser = require('body-parser')

var DB_NAME = process.env.DB_NAME;
var DB_USER = process.env.DB_USER;
var DB_PASSWORD = process.env.DB_PASSWORD;

//sequelize
var sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	dialect: 'mysql',
	host: process.env.DB_HOST
});

//domain access
app.use(cors());
app.use(bodyParser());
app.use(bodyParser.urlencoded({extended: true});


//Restaurants
var Restaurant = sequelize.define('restaurant', {
	name: {
		type: Sequelize.STRING
	},
	locationId: {
		type: Sequelize.INTEGER,
		field: 'location_id'
	},
	cuisineId: {
		type: Sequelize.INTEGER,
		field: 'cuisine_id'
	},
	mealId: {
		type: Sequelize.INTEGER,
		field: 'meal_id'
	},
	isVisited: {
		type: Sequelize.INTEGER
	}
}, {
	timestamps: false
});

// app.get('/api/restaurants', function (request, response) {
// 	var promise = Restaurant.findAll();
// 	promise.then(function(restaurants) {
// 		response.json(restaurants)
// 	})
// })

//Filtered restaurant search
//URL: /api/restaurants?li='locationid'&mi='mealid'
//Add logic for if params are empty
//if (Request.QueryString["categoryid"] != null)
app.get('/api/restaurants', function (request, response) {
	if(request.query.li ===  'NULL' && request.query.mi === 'NULL') {
		Restaurant.findAll().then(function(restaurant) {
			response.json(restaurant);
		})
	}
	else if (request.query.mi === 'NULL') {
		Restaurant.findAll({
		  where: {
		    locationId: request.query.li,
		  }
		}).then(function(restaurant) {
			response.json(restaurant);
		})
	} 
	else {
		Restaurant.findAll({
		  where: {
		    locationId: request.query.li,
		    mealId: request.query.mi
		  }
		}).then(function(restaurant) {
			response.json(restaurant);
		})
	}
})

app.post('/api/restaurants', function (request, response) {
	//response.json(request.body);
	var restaurant = Restaurant.build({
		name: request.body.name,
		locationId: request.body.locationId,
		//cuisineId: request.body.cuisine_id,
		mealId: request.body.mealId
	});
	restaurant.save().then(function(restaurant) {
		response.json(restaurant);
	})
});

//Meals
var Meal = sequelize.define('meal', {
	name: {
		type: Sequelize.STRING
	}
}, {
	timestamps: false
})

app.get('/api/meals', function (request, response) {
	var promise = Meal.findAll();
	promise.then(function(meals) {
		response.json(meals)
	})
})

//Locations
var Location = sequelize.define('location', {
	name: {
		type: Sequelize.STRING
	}
}, {
	timestamps: false
})

app.get('/api/locations', function (request, response) {
	var promise = Location.findAll();
	promise.then(function(locations) {
		response.json(locations)
	})
})

//Reviews
var Review = sequelize.define('review', {
	reviewText: {
		type: Sequelize.STRING,
		field: 'review'
	},
	restaurantId: {
		type: Sequelize.INTEGER,
		field: 'restaurant_id'
	}
}, {
	timestamps: false
});

//URL: /api/reviews?ri='restaurantId'
app.get('/api/reviews', function (request, response) {
	Review.findAll({
		where: {
			restaurantId: request.query.ri
		}
	}).then(function(reviews) {
		response.json(reviews);
	})
})

app.post('/api/reviews', function (request, response) {
	//response.json(request.body);
	var review = Review.build({
		reviewText: request.body.reviewText,
		restaurantId: request.body.restaurantId
	});
	review.save().then(function(review) {
		response.json(review);
	})
});


//Cuisines
var Cuisine = sequelize.define('cuisine', {
	type: {
		type:Sequelize.STRING
	}
}, {
	timestamps: false
})

app.get('/api/cuisines', function (request, response) {
	var promise = Cuisine.findAll();
	promise.then(function(cuisines) {
		response.json(cuisines)
	})
})

app.listen(3000)




