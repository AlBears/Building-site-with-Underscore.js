var ipInfo = 'http://ipinfo.io';
function getCoordinates(){ 
$.getJSON(ipInfo, function(data){
  getCoords(data);
});
};
//var coord = [];
function getCoords(data){
var coord = data.loc.split(',');
var appId = "";
var apiOn = "http://api.open-notify.org/iss-pass.json?lat="+coord[0]+"&lon="+coord[1]+"&n=100&callback=?";
var weatherApi = "http://api.openweathermap.org/data/2.5/forecast?lat="+coord[0]+"&lon="+coord[1]+"&APPID="+appId+"&callback=?";

function getRefreshedData(iss, weather) {
  console.log('ISS', iss);
  console.log('WEATHER', weather);
  
}

function refreshData() {
  jQuery.getJSON(apiOn, function (iss){
    jQuery.getJSON(weatherApi, function (weather){
      getRefreshedData(iss, weather);
    });
  });
};
refreshData();
$('#refresh').on('click', refreshData);


}

getCoordinates();
