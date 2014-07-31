var apikey = "d2891f52bbd6ea570d508ec6521df87c8b84de20";
var baseUrl = "http://www.giantbomb.com/api/game";

// construct the uri with our apikey
var GamesSearchUrl = baseUrl + '/search/?api_key=' + apikey + '&format=jsonp';
var query
var characters
var yearArray = []
var totalGames
var gameYearQuery = 0
var selectedCharacter
var noDateAvailable

$(document).ready(function() {
    $(document).on('click','#search', function() {
    	//$('.searchResultsItem').remove();
    	if ($("#characterSearch").val() != "") {
    		console.log($("#characterSearch").val());
    		query = $("#characterSearch").val();
		    $.ajax ({
		        type: 'GET',
		        dataType: 'jsonp',
		        crossDomain: true,
		        jsonp: 'json_callback',
		        limit:500,
		        url: 'http://www.giantbomb.com/api/search/?format=jsonp&api_key=' + apikey + '&query=' + encodeURI(query)  + '&resources=character',
		        complete: function() {
		            console.log('done');
		        },
		        success: function(data) {
		            console.log(data);
		            console.log(data.number_of_total_results);
		            $('#numResults').append('Found ' + data.number_of_total_results + ' results for ' + query);
		            characters = data.results;
		            $.each(characters, function(index, character) {
		                $('#searchResults').append('<div class="searchResultsItem"><div class="searchResultsImage"><img src="' + character.image.icon_url + '" /></div><div class="searchResultsText"><h1>' + character.name + '</h1><p>' + character.deck + '</p></div></div>');
		            });
		        }
		    });
		}
    });
    $(document).on('click','.searchResultsItem', function() {
    	//console.log($('.searchResultsItem').index(this)-1);
        selectedCharacter = $('.searchResultsItem').index(this)-1;
        singleCharacterSearch(characters[selectedCharacter].id);
    });
});

var singleCharacterSearch = function (characterID) {
    $.ajax ({
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'json_callback',
        limit:500,
        url: 'http://www.giantbomb.com/api/character/3005-' + characterID +'/?api_key=' + apikey + '&format=jsonp', //retreieves a single character (unique ID 66) from GB DB
        complete: function() {
            console.log('done');
        },
        success: function(data) {
            console.log(data);
            //console.log(data.results.games.length);
            gameYearQuery = 0;
            noDateAvailable = false;
            totalGames = data.results.games.length;
            $('#numGames').append('<p>' + data.results.name + ' appears in ' + totalGames + ' games</p>');
            $.each(data.results.games, function(index, characterGame) {
                (function(index) {
                    gameYearSearch(characterGame.id);
                })(index);
            });
        }
    });
}

var gameYearSearch = function (gameID) {
    $.ajax ({
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'json_callback',
        limit:500,
        url: 'http://www.giantbomb.com/api/game/3030-' + gameID +'/?api_key=' + apikey + '&format=jsonp', //retreieves a single game
        complete: function() {
            updateChart();
        },
        success: function(data) {
            console.log(data.results);
            if (data.results.original_release_date != null) {
                yearArray.push(parseInt(data.results.original_release_date.substring(0, 4)));
            }
            else if (data.results.expected_release_year != null) {
                yearArray.push(data.results.expected_release_year);
            }
            else {
                yearArray.push("No date available");
            }
        }
    });
}

var updateChart = function () {
    gameYearQuery++;
    console.log(gameYearQuery);
    if (gameYearQuery == totalGames) {
        var maxYear = parseInt(findMax());
        var minYear = parseInt(findMin());
        var ctx = $("#myChart").get(0).getContext("2d");
        var yearLabels = [];
        var chartData = [];
        var myNewChart = new Chart(ctx);
        for (i = minYear; i <= maxYear; i++) {
            yearLabels[i-minYear] = i.toString();
            chartData[i-minYear] = 0;
            console.log(i-minYear )
            for (j = 0; j <= totalGames; j++) {
                if (yearArray[j] == i) {
                    chartData[i-minYear]++;
                }
            }
        }

        console.log(chartData);     
        var data = {
            labels: yearLabels,
            datasets: [
            {
            label: characters[selectedCharacter].name + "'s appearances in video games",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: chartData
            }
            ]
        };
        new Chart(ctx).Bar(data);
    }
}

var findMax = function () {
    var maximum = 0;
    for (i=0; i<=totalGames; i++) {
        if (yearArray[i] == "No date availabe") {
            noDateAvailable = true;
        }
        else if (yearArray[i] >= maximum) {
            maximum = yearArray[i];
        }
    }
    return maximum
}

var findMin = function () {
    var minimum = 100000;
    for (i=0; i<=totalGames; i++) {
        if (yearArray[i] == "No date availabe") {
            noDateAvailable = true;
        }
        else if (yearArray[i] <= minimum) {
            minimum = yearArray[i];
        }
    }
    return minimum
}