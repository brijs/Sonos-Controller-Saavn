angular.module('starter.filters', [])

.filter('largeimage', function ($sce) {
	return function(text){
  		return text ? $sce.trustAsHtml(text.replace('150x150.jpg', '500x500.jpg')) : '';
  	}
})

.filter('splitByComma', function () {
	return function(text){
  		return text ? text.split(",") : [''];
  	}
})

.filter('guessArtistUrl', function () {
	return function(artistName){
  		return artistName ? "http://c.saavncdn.com/artists/" 
  			+ artistName.trim().replace(" ", "_") + ".jpg" : "";
  	}
})

.filter('guessActorUrl', function () {
  return function(actorName){
      n = actorName.split(" ");
      if (n.length < 2) return "";
      return "http://graph.facebook.com/" 
        + n[1] + "." + n[0]  + "/picture";
    }
})

;