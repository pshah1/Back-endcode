const express = require('express')
const router = express.Router()
const fs = require('fs')
const components = require('./component/serviceFunctions.js')


let citiesData = fs.readFileSync('./data/cities_canada-usa.tsv',{ encoding: 'utf8' });

function cities(json,query,lat,lng){
  
  let scores = []
  let distances = []
  let totalCity = 0
  let result = []
  json.forEach((city,index) => {
    if(city.name){
      if((city.name.toLowerCase()).includes(query.toLowerCase())){
        const score = components.partialMatch(city.name,query,lat,lng);
        scores.push(score);
        const dist = components.distance(lat,lng,city.lat,city.long);
        distances.push(dist);
        result.push({ name: getCityFullName(city), latitude:city.lat, longitude:city.long, score:scores[totalCity]});
        totalCity++;
      }
    }
  })
  
  if(lat && lng){
    ObjectSort(distances,result)
    for(let i=distances.length-1; i >=  0; i--){
      result[distances.length - (i+1)]['score'] += (i+1)/(distances.length * 2); 
      scores[distances.length - (i+1)] += (i+1)/(distances.length * 2); 
    }
  }
  else{
    result = result.sort((a, b) => {
      return b.score - a.score;
  });
   
  }
  return result;
}

function getCityFullName(city) {
    return `${city.name}, ${city.admin1}, ${city.tz}`;
}

function ObjectSort(arr,resultArr)
{
    let bubblesort;
    let objectlength = arr.length-1;
    let objArr=arr;
    do {
        bubblesort = false;
        for (let i=0; i < objectlength; i++)
        {   
            if (objArr[i] >= objArr[i+1]){
              swap(objArr,i)
              swap(resultArr,i)
              bubblesort = true;
            }
        }
        objectlength--;
    } while (bubblesort);
 return objArr;
}

function swap(arr,i){
  const temp = arr[i]
  arr[i] = arr[i+1]
  arr[i+1] = temp
}

router.get('/',(req,res,next) => {
  if(!req.query.q)
    res.json({ message: 'enter city name in query parameter' })
  if (req.query.latitude!==undefined ||  req.query.longitude!==undefined) {
      if (isNaN(req.query.latitude) || isNaN( req.query.longitude)) {
        res.json({ message: 'Longitude and latitude parameters must be provided together and must be numeric'})
      }
    }      
  const json =  components.tsvtoJSON(citiesData)
  const response =  cities(json, req.query.q, req.query.latitude, req.query.longitude)
  res.json({ suggestions:response })
})


module.exports = router
