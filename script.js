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
  var apiOn = "http://api.open-notify.org/iss-pass.json?lat=" + coord[0] + "&lon=" + coord[1] + "&n=100&callback=?";
  var weatherApi = "http://api.openweathermap.org/data/2.5/forecast?lat=" + coord[0] + "&lon=" + coord[1] + "&APPID=" + appId + "&callback=?";

function getRefreshedData(iss, weather) {
    console.log('ISS', iss);
    console.log('WEATHER', weather);

function outputFlyover(flyover, i) {
      console.log(flyover);
      $('#flyovers').append('<div>Flyover at ' + flyover.risetime + '</div>');
    }

function processFlyoverData(flyover) {
      return {
        risetime: new Date(flyover.risetime * 1000),
        duration: flyover.duration
      };
    }

    var flyovers = _.map(iss.response, processFlyoverData);
    _.each(flyovers, outputFlyover);

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
