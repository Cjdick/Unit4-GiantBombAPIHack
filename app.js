var apikey = "d2891f52bbd6ea570d508ec6521df87c8b84de20";
var baseUrl = "http://www.giantbomb.com/api/game";

// construct the uri with our apikey
var GamesSearchUrl = baseUrl + '/search/?api_key=' + apikey + '&format=jsonp';
var query = "Batman";

$(document).ready(function() {

  // send off the query
  /*$.ajax({
    url: GamesSearchUrl + '&query=' + encodeURI(query) + "&resources=game",
    dataType: "jsonp",
    success: searchCallback
  });*/


    $.ajax ({
        type: 'GET',
        dataType: 'jsonp',
        crossDomain: true,
        jsonp: 'json_callback',
        limit:500,
        //url: 'http://www.giantbomb.com/api/search/?format=jsonp&api_key=' + apikey + '&query=' + encodeURI(query)  + '&filter=id:3005-66',
        //url: 'http://www.giantbomb.com/api/search/?format=jsonp&api_key=' + apikey + '&filter=id:3005-66',
        
        // ---> ** Call this first //url: 'http://www.giantbomb.com/api/search/?format=jsonp&api_key=' + apikey + '&query=' + encodeURI(query)  + '&resources=character',
        //url: 'http://www.giantbomb.com/api/games/?api_key=' + apikey + '&filter=expected_release_year:2011,original_release_date:2011-01-01%2000:00:00|2011-12-31%2023:59:59,name:battlefield%203&format=json&limit=5&sort=original_release_date:asc',
        //url: 'http://www.giantbomb.com/api/games/?format=jsonp&api_key=' + apikey + '&query=' + encodeURI(query),
        //url: 'http://www.giantbomb.com/api/search/?api_key=' + apikey + '&format=jsonp' + '&query=' + encodeURI(query),
        //url: 'http://www.giantbomb.com/api/characters/?api_key=' + apikey + '&format=jsonp' + '&filder=id:66',
        //url: 'http://www.giantbomb.com/api/characters/3005-66/?api_key=' + apikey +' &format=jsonp', //&field_list=[COMMA-SEPARATED-LIST-OF-RESOURCE-FIELDS]'        
        //url: 'http://www.giantbomb.com/api/game/3030-4725/?api_key=' + apikey + '&format=jsonp',
        url: 'http://www.giantbomb.com/api/character/3005-66/?api_key=' + apikey + '&format=jsonp', //retreieves a single character (unique ID 66) from GB DB
        complete: function() {
            console.log('done');
        },
        success: function(data) {
            console.log(data);
            console.log(data.number_of_total_results);
            $('body').append('Found ' + data.number_of_total_results + ' results for ' + query);
            var games = data.results;
            console.log(games.name);
            $.each(games, function(index, game) {
                console.log(game);
                $('body').append('<h1>' + game.name + '</h1>');
                //$('body').append('<p>' + game.deck + '</p>');
                //$('body').append('<img src="' + game.image.super_url + '" />')
            });
        }
    });


    // callback for when we get back the results
    function searchCallback(data) {
        $('body').append('Found ' + data.total + ' results for ' + query);
        var games = data.results;
        $.each(games, function(index, game) {
            $('body').append('<h1>' + game.name + '</h1>');
            $('body').append('<p>' + game.deck + '</p>');
            //$('body').append('<img src="' + game.posters.thumbnail + '" />');
        });
    }
});