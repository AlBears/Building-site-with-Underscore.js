function ISSFlyover() {
  _.bindAll(this, 'refreshData', 'gotRefreshedData');
  this.refreshData();
  $('#refresh').on('click', this.refreshData);
  $('#latitude, #longitude').on('change keypress', _.debounce(this.refreshData, 500));
}

_.extend(ISSFlyover.prototype, {
  gotRefreshedData: function () {
    var me = this;

    var atTheISS = _.pluck(_.where(this.astronauts.people, {craft: 'ISS'}), 'name');
    $('#astronauts').text(atTheISS.join(", "));

    function outputFlyover(flyover, i) {
      $('#flyovers').append(
        '<div>Flyover at ' + flyover.risetime + ': ' + flyover.weatherDescription + '</div>'
      );
    }

    function processFlyoverData(flyover) {
      var weatherAtFlyover = _.find(me.weather.list, function (w) {
        return w.dt <= flyover.risetime && w.dt + 60*60*3 > flyover.risetime;
      });

      return {
        clouds: weatherAtFlyover && weatherAtFlyover.clouds.all,
        hasWeather: !_.isUndefined(weatherAtFlyover),
        weatherDescription: weatherAtFlyover && weatherAtFlyover.weather[0].description,
        risetime: new Date(flyover.risetime*1000),
        duration: flyover.duration
      };
    }

    function getDay(flyover) {
      return flyover.risetime.toDateString();
    }

    var flyovers = _.map(this.iss.response, processFlyoverData);

    var flyoversWithWeather = _.where(flyovers, {hasWeather: true});

    var flyoversGrouped = _.groupBy(flyoversWithWeather, getDay);

    var dayTemplate = _.template($('#day-template').html());

    _.each(flyoversGrouped, function (flyoversForDay, day) {
      // $('#flyovers').append('<h2>' + day + '</h2>');
      flyoversForDay = _.sortBy(flyoversForDay, 'clouds');
      $('#flyovers').append(dayTemplate({title:day, flyovers: flyoversForDay}));
      // _.each(flyoversForDay, outputFlyover);
    });

    var summary = _.countBy(flyoversWithWeather, 'weatherDescription');
    $('#summary').html('');
    _.each(summary, function (count, condition) {
      $('#summary').append('<div><b>' + condition + '</b>:' + count + '</div>');
    });
  },

  refreshData: function () {
    var me = this;
    var appId = "";
    var location = {lat: $('#latitude').val(), lon: $('#longitude').val()};

    var complete = _.after(3, this.gotRefreshedData);

    var getData = function(property, url, options){
      jQuery.getJSON(url, options, function (data){
        me[property] = data;
        complete();
      });
    };
    getData('iss', "http://api.open-notify.org/iss-pass.json?callback=?", _.extend({n: 100}, location));
    getData('weather', "http://api.openweathermap.org/data/2.5/forecast?APPID=" + appId + "&callback=?", location)
    getData('astronauts', "http://api.open-notify.org/astros.json?callback=?", {});
  
 }
});

var issFlyover = new ISSFlyover();
