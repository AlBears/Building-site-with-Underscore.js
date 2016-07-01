var ipInfo = 'http://ipinfo.io';

function getCoordinates() {
  $.getJSON(ipInfo, function(data) {
    getCoords(data);
  });
};
//var coord = [];
function getCoords(data) {
  var coord = data.loc.split(',');
  var appId = "";
  var apiOn = "http://api.open-notify.org/iss-pass.json?lat=" + 
              coord[0] + "&lon=" + coord[1] + "&n=100&callback=?";
  var weatherApi = "http://api.openweathermap.org/data/2.5/forecast?lat=" + 
                    coord[0] + "&lon=" + coord[1] + "&APPID=" + 
                    appId + "&callback=?";

function getRefreshedData(iss, weather) {
    console.log('ISS', iss);
    console.log('WEATHER', weather);

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
    jQuery.getJSON(apiOn, function(iss) {
      jQuery.getJSON(weatherApi, function(weather) {
        getRefreshedData(iss, weather);
      });
    });
  };
  refreshData();
  $('#refresh').on('click', refreshData);

}

getCoordinates();
