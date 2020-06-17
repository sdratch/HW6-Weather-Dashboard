//api key: 6f1f4727eeab75aa99bbdae6e23dda36

$(document).ready(function () {
  //the previous searches
  var previousSearch = [];

  //get the last search value and display it if it is not the first time coming to the site
  if (localStorage.getItem("search") !== null) {
    var lastSearch = localStorage.getItem("search");
    previousSearch.push(lastSearch);
    search(lastSearch);
  }
  //on click event for the search button
  $("#search-button").on("click", function () {
    previousSearch.push($("#city-search").val());
    search($("#city-search").val());
  });
  //on click for the previous searches.
  $(document).on("click", ".list-group-item", function (event) {
    event.preventDefault();
    search($(this).text());
    console.log($(this).text());
  });
  // function to organize the previous searches
  function organizeSearch() {
    $(".list-group").empty();
    for (var i = 0; i < previousSearch.length; i++) {
      var newSearch = $("<li>");
      newSearch.addClass("list-group-item");
      newSearch.text(previousSearch[i]);
      $(".list-group").prepend(newSearch);
    }
  }

  //Funtcion when a search button is pressed
  function search(city) {
    //get the city entered
    localStorage.setItem("search", city);
    console.log(city);
    organizeSearch();
    //get query URLS
    var queryURLCurrent =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&appid=6f1f4727eeab75aa99bbdae6e23dda36";
    var queryURLForcast =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=imperial&appid=6f1f4727eeab75aa99bbdae6e23dda36";
    var lat;
    var lon;
    //make ajax request to get current weather
    $.ajax({
      url: queryURLCurrent,
      method: "GET",
    }).then(function (response) {
      //get latitude and longitude for uv index request
      lat = response.coord.lat;
      lon = response.coord.lon;
      //Put the current focast and put them on the html with an image of the forcast
      var iconEl = $("<img>");
      $("#current-time-date").text(
        response.name + " " + moment().format("MM/DD/YYYY")
      );
      iconEl.attr(
        "src",
        "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
      );
      $("#current-time-date").append(iconEl);
      //Change the temperature, humidity, and wind speed
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

        //if else for determining the color of the index
        if (uvIndex > 7) {
          badgeColor = "badge-danger";
        } else if (uvIndex > 3) {
          badgeColor = "badge-warning";
        } else {
          badgeColor = "badge-success";
        }
        //creating the badge for the uv index
        var colorEl = $("<span class = badge>" + uvIndex + "<span>");
        colorEl.addClass(badgeColor);

        $("#current-uv").text("UV Index: ");
        $("#current-uv").append(colorEl);
      });
    });
    //ajax request for 5 day forcast
    $.ajax({
      url: queryURLForcast,
      method: "GET",
    }).then(function (response) {
      //function to loop 5 times over creating different html cards and appending them below the current forcast
      $(".card-deck").empty();
      for (var i = 1; i < 6; i++) {
        var newCardEl = $("<div class = 'card'></div>");
        var newCardBodyEl = $(
          "<div class = 'card-body text-white bg-primary mb-3 '></div>"
        );
        //get the date for the next 5 dives
        var time = moment().add(i, "d");
        var cardTitleEl = $(
          "<h5 class = 'card-title'>" + time.format("MM/DD/YYYY") + "<div>"
        );
        //creating, adding text, and apending the icon, temperature, and humidity to the card body
        var iconEl = $("<img>");
        iconEl.attr(
          "src",
          "http://openweathermap.org/img/w/" +
            response.list[0].weather[0].icon +
            ".png"
        );
        var tempEl = $("<p>");
        tempEl.text("Temperature: " + response.list[i + 4].main.temp);
        var humidityEl = $("<p>");
        humidityEl.text("Humidity: " + response.list[i + 4].main.humidity);
        newCardBodyEl.append(cardTitleEl, iconEl, tempEl, humidityEl);
        //apend the card body to the card
        newCardEl.append(newCardBodyEl);
        //appending the card to the deck
        $(".card-deck").append(newCardEl);
      }
    });
  }
});
