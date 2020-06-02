//calculates the avg distance with latitude and logitude
function distance(lat1, lon1, lat2, lon2) {
  var rad = deg => deg * 0.017453293;
  var a =
    Math.pow(Math.sin(rad(lat2 - lat1) / 2), 2) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
    Math.pow(Math.sin(rad(lon2 - lon1) / 2), 2);
  return 12742000 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

//Converts TSV file to JSON for easier data manipulation
function partialMatch(city_name,query,lat,lng){
  const city = city_name.split('')
  const queryString = query.split('')
  const nameOnly = lat && lng;
  const distance = stringDifference(city_name,queryString);
  const score =  nameOnly ? ((city.length - distance)/city.length)/2 : ((city.length - distance)/city.length);
  return score;

}

/**
 * Calculates the Damerau-Levenshtein distance between two strings.
 */
function stringDifference (source, target) {
  if (!source) return target ? target.length : 0;
  else if (!target) return source.length;

  var m = source.length, n = target.length, INF = m+n, score = new Array(m+2), sd = {};
  for (var i = 0; i < m+2; i++) score[i] = new Array(n+2);
  score[0][0] = INF;
  for (var i = 0; i <= m; i++) {
      score[i+1][1] = i;
      score[i+1][0] = INF;
      sd[source[i]] = 0;
  }
  for (var j = 0; j <= n; j++) {
      score[1][j+1] = j;
      score[0][j+1] = INF;
      sd[target[j]] = 0;
  }

  for (var i = 1; i <= m; i++) {
      var DB = 0;
      for (var j = 1; j <= n; j++) {
          var i1 = sd[target[j-1]],
              j1 = DB;
          if (source[i-1] === target[j-1]) {
              score[i+1][j+1] = score[i][j];
              DB = j;
          }
          else {
              score[i+1][j+1] = Math.min(score[i][j], Math.min(score[i+1][j], score[i][j+1])) + 1;
          }
          score[i+1][j+1] = Math.min(score[i+1][j+1], score[i1] ? score[i1][j1] + (i-i1-1) + 1 + (j-j1-1) : Infinity);
      }
      sd[source[i-1]] = i;
  }
  return score[m+1][n+1];
}
  
  function tsvtoJSON(tsv) {
    const lines = tsv.split('\n');
    const headers = lines.shift().split('\t');
    return lines.map(line => {
      const data = line.split('\t');
      return headers.reduce((obj, nextKey, index) => {
        obj[nextKey] = data[index];
        return obj;
      }, {});
    });
  }

  module.exports = {
    tsvtoJSON,
    partialMatch,
    stringDifference,
    distance
  }
  