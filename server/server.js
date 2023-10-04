require("dotenv").config();
const express = require("express");
const cors = require("cors");

const db = require("./db");

const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json()); //connects the body in postman to req 

// //THIRD PARTY MIDDLEWARE
// app.use(morgan("dev"));

// //create middleware
// app.use((req, res, next) => {
//     console.log("yeah our middleware");
//     next();

//     //middleware can also be used to send back response to the user
//     // res.status(404).json({
//     //     status: "fail";
//     // });
// });


//Get all Restaurants
app.get("/api/v1/restaurants", async (req, res) => {

    try{
        //const results = await db.query("SELECT * FROM restaurants;");
                      
        const restaurantRatingsData = await db.query("SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating FROM reviews GROUP BY restaurant_id) reviews ON(restaurants.id = reviews.restaurant_id);");

        res.status(200).json({
            status: "success",
            results: restaurantRatingsData.rows.length,
            data: {
                //results: results.rows.length,
                restaurant: restaurantRatingsData.rows,
            },
            
        });
    }catch(err){
        console.log(err);
    }
});

//Get a restaurant
app.get("/api/v1/restaurants/:id",async (req, res)=> {

    console.log(req.params.id);
    try{
        //const results = await db.query(`SELECT * FROM restaurants WHERE id= ${req.params.id}`);
        const restaurant = await db.query("SELECT * FROM restaurants LEFT JOIN (SELECT restaurant_id, COUNT(*), TRUNC(AVG(rating), 1) as average_rating FROM reviews GROUP BY restaurant_id) reviews ON(restaurants.id = reviews.restaurant_id) WHERE id = $1;", [req.params.id]);

        const reviews = await db.query("SELECT * FROM reviews WHERE restaurant_id = $1", [req.params.id]);
         
        res.status(200).json({
            status: "success",
            data: {
                restaurant: restaurant.rows[0],
                reviews: reviews.rows,
            },
        });
    }catch(err){
        console.log(err);
    }
});


//create a restaurant 
app.post( "/api/v1/restaurants", async (req, res) => {
    console.log(req.body);

    try{
        const results = await db.query("INSERT INTO restaurants (name, location, price_range) VALUES($1, $2, $3) returning *", [req.body.name, req.body.location, req.body.price_range]);
        console.log(results);
        res.status(201).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            },
        });
    }catch(err){
        console.log(err);
    }

});

//update restaurants

app.put("/api/v1/restaurants/:id", async (req, res) =>{
    try{
        const results = await db.query("UPDATE restaurants SET name = $1, location = $2, price_range = $3 WHERE id= $4 returning *;", [req.body.name, req.body.location, req.body.price_range, req.params.id]);
        console.log(results)
        res.status(200).json({
            status: "success",
            data: {
                restaurant: results.rows[0],
            },
        });
    }catch(err){
        console.log(err)
    }
});

app.delete("/api/v1/restaurants/:id", async (req, res) => {
    try{
        const results = await db.query("DELETE FROM restaurants WHERE id= $1;", [req.params.id] );
        res.status(204).json({
            status: "success",
        });
    }catch(err){
        console.log(err);
    }

});

//add a review
app.post("/api/v1/restaurants/:id/addReview", async(req, res) => {
    try{
        const newReview = await db.query("INSERT INTO reviews(restaurant_id, name, review, rating) values($1, $2, $3, $4) returning *;",[req.params.id, req.body.name, req.body.review, req.body.rating] );
        res.status(201).json({
            status:"success",
            data:{
                review: newReview.rows[0],
            },
        })
    }catch(err){
        console.log(err);
    }
})

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`server is up and listening on port ${port}`)
});