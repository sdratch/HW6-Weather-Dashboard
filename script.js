console.log("hello");

//6f1f4727eeab75aa99bbdae6e23dda36

$(document).ready(function () {
  $("#search-button").on("click", search);

  function search() {
    var city = $("#city-search").val();

    var queryURLCurrent =
      "https://api.openweathermap.org/data/2.5/weather?q=atlanta&units=imperial&appid=6f1f4727eeab75aa99bbdae6e23dda36";
    var queryURLForcast =
      "https://api.openweathermap.org/data/2.5/forecast?q=atlanta&units=imperial&appid=6f1f4727eeab75aa99bbdae6e23dda36";
    var lat;
    var lon;

    $.ajax({
      url: queryURLCurrent,
      method: "GET",
    }).then(function (response) {
      lat = response.coord.lat;
      lon = response.coord.lon;
      $("#current-time-date").text(
        response.name + " " + moment().format("MM/DD/YYYY")
      );
      $("#current-temp").text("Temperature: " + response.main.temp + " F");
      $("#current-humid").text("Humidity: " + response.main.humidity + "%");
      $("#current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
      var queryURLIndex =
        "http://api.openweathermap.org/data/2.5/uvi?appid=6f1f4727eeab75aa99bbdae6e23dda36&lat=" +
        lat +
        "&lon=" +
        lon;
      $.ajax({
        url: queryURLIndex,
        method: "GET",
      }).then(function (response) {
        var uvIndex = response.value;
        var badgeColor;
        // if(uvIndex > 7){
        //     badgeColor = "badge-danger"
        // } else{
// 
        // }
        $("#current-uv").text("UV Index: " + uvIndex);

      });
    });

    $.ajax({
      url: queryURLForcast,
      method: "GET",
    }).then(function (response) {

      for (var i = 1; i < 6; i++) {
        var newCardEl = $("<div class = 'card'></div>");
        var newCardBodyEl = $("<div class = 'card-body'></div>");
        var time = moment().add(i, "d");
        var cardTitleEl = $(
          "<h5 class = 'card-title'>" + time.format("MM/DD/YYYY") + "<div>"
        );
        //var emoteEl = $("<i>")
        var tempEl = $("<p>");
        tempEl.text("Temperature: " + response.list[(i+4)].main.temp);
        var humidityEl = $("<p>");
        humidityEl.text("Humidity: " + response.list[(i+4)].main.humidity);
        newCardBodyEl.append(cardTitleEl, tempEl, humidityEl);
        newCardEl.append(newCardBodyEl);
        $(".card-deck").append(newCardEl);
      }
    });
  }
});
