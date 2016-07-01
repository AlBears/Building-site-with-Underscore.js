var ipInfo = 'http://ipinfo.io';

function getCoordinates() {
  $.getJSON(ipInfo, function(data) {
    getCoords(data);
  });
};

function getCoords(data) {
  var astro = "http://api.open-notify.org/astros.json?callback=?";
  var coord = data.loc.split(',');
  var location = {lat:coord[0], lon:coord[1]};
  var appId = "";
  var apiOn = "http://api.open-notify.org/iss-pass.json?callback=?";
  var weatherApi = "http://api.openweathermap.org/data/2.5/forecast?APPID=" + 
                    appId + "&callback=?";

function getRefreshedData(iss, weather, astronauts) {
    console.log('ISS', iss);
    console.log('WEATHER', weather);

  var atTheISS = _.pluck(_.where(astronauts.people, {craft:"ISS"}), "name");
  // atTheISS = _.map(atTheIss, function (person) {
  //   return person.name;
  // }); 
  //atTheISS = _.pluck(atTheISS, "name");
  $('#astronauts').text(atTheISS.join(", "));


function outputFlyover(flyover, i) {
      $('#flyovers').append('<div>Flyover at ' + 
        flyover.risetime +': '+flyover.weatherDescription+ '</div>');
    }

function processFlyoverData(flyover) {
  var weatherAtFlyover = _.find(weather.list, function (w){
    return w.dt <= flyover.risetime && w.dt + 60*60*3 > flyover.risetime;
  })
      return {
        clouds: weatherAtFlyover && weatherAtFlyover.clouds.all,
        hasWeather: !_.isUndefined(weatherAtFlyover),
        weatherDescription: weatherAtFlyover && weatherAtFlyover.weather[0].description,
        risetime: new Date(flyover.risetime * 1000),
        duration: flyover.duration
      };
    }

function getDay(flyover){
  return flyover.risetime.toDateString();
}

  var flyovers = _.map(iss.response, processFlyoverData);


    // var flyoversWithWeather = _.filter(flyovers, function (flyover){
    //   return flyover.hasWeather;
    // });

  var flyoversWithWeather = _.where(flyovers, {hasWeather: true});

  var flyoversGrouped = _.groupBy(flyoversWithWeather, getDay);

  //var days = _.keys(flyoversGrouped);


  _.each(flyoversGrouped, function (flyoversForDay, day) {
    $('#flyovers').append('<h2>'+day+'</h2>');
    var flyoversForDay = flyoversGrouped[day];
    //flyoversForDay = _.sortBy(flyoversForDay, 'clouds');
    _.each(flyoversForDay, outputFlyover);
  });

  var summary = _.countBy(flyoversWithWeather, 'weatherDescription');
  $('#summary').html('');
  _.each(summary, function (count, condition){
    $('#summary').append('<div><b>'+condition+'</b>:'+count+'</div>');
  });

  // _.each(days, function (day) {
  //   $('#flyovers').append('<h2>'+day+'</h2>');
  //   var flyoversForDay = flyoversGrouped[day];
  //   flyoversForDay = _.sortBy(flyoversForDay, 'clouds');
  //   _.each(flyoversForDay, outputFlyover);
  // });



   // _.each(flyoversWithWeather, outputFlyover);

    //_.each(flyovers, outputFlyover);

    //_.each(iss.response, outputFlyover);

    // for(var i=0; i< iss.response.length; i++ ){
    //   console.log(iss.response[i]);
    // }

  }

function refreshData() {
    jQuery.getJSON(astro, function (astronauts){ 
    jQuery.getJSON(apiOn, _.extend({n: 100}, location), function (iss) {
      jQuery.getJSON(weatherApi, location, function (weather) {
        getRefreshedData(iss, weather, astronauts);
      });
    });
  });
  };
  refreshData();
  $('#refresh').on('click', refreshData);

}

getCoordinates();
