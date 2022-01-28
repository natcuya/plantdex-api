require('dotenv').config()
const express = require('express')
const morgan = require('morgan') 
const cors = require('cors')
const app = express()
const helmet = require('helmet')
const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]
const PLANT = require('./plant.json');
const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "dev";
app.get("/types", handleGetTypes);
app.use(validateBearerToken);
app.get("/plant", handleGetPlant)
app.use(morgan(morganSetting));
app.use(helmet())
app.use(cors())
console.log(PLANT.plant[1]);

//process.env.NODE_ENV = "production"
function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' });
    }
    // move to the next middleware
    next();
  }
  
    
function handleGetTypes(req, res) {
    res.json(validTypes);
  }

    function handleGetPlant(req, res) {
      let response = PLANT.plant;
    
      if (req.query.name) {
          response = response.filter(plant =>{
            // case insensitive searching
            return plant.name.toLowerCase().includes(req.query.name.toLowerCase())
          })
        }
      
        // filter our plant by type if type query param is present
        if (req.query.type) {
          response = response.filter(plant =>{
           return plant.type.includes(req.query.type)
          });
        }
      
        res.json(response);
      }

  app.use((error,req,res,next) => {
      let response
      if(process.env.NODE_ENV === 'production'){
        response = { error: { message: 'server error' }}
      } else {
        response = {error}
      }
      res.status(500).json(response); 
    })

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
});
