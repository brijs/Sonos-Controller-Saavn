angular.module('starter.services', ['LocalStorageModule'])


/* Saavn Service */
.factory('Saavn', function($http, $q, Settings) {

  var songs = [];
  function getTopSongs(searchTerm) {
      if (!searchTerm) 
        searchTerm = "weekly_top_15";

      var SAAVN_URL = (Settings.getCachedIP().indexOf("http") != 0 ? "https://": "") 
        + Settings.getCachedIP() + "/saavn/songs?key=value"
  
      var promise = $http.get(SAAVN_URL + "&q=" + searchTerm)
        .then(function(response) {
          console.log("saavn: getTopSongs(" + searchTerm + "): success");
          songs = response.data;
          return songs;
        });
      
      return promise;
  };

function getSong(songId, songsArr) {
  for (var i = 0; i < songsArr.length; i++) {
    if (songsArr[i].id === songId) {
      return songsArr[i];
    }
  }

  console.log(songId + " not found!")
  return undefined;
}

function get(searchTerm, songId) {
  var deferred = $q.defer();

  if (songs.length == 0) {
    getTopSongs(searchTerm).then(function(songs) {
      deferred.resolve(getSong(songId, songs));
    })
  }
  else
    deferred.resolve(getSong(songId, songs));
  
  return deferred.promise;
}

function setSongsState(songsArr) {
  songs = songsArr;
}

  
  // Saavn factory object
  return {
    topSongs      : getTopSongs,
    get           : get,
    setSongsState : setSongsState
  }

})


/* Sonos Service */
.factory('Sonos', function($http, $q, Settings) {

  function get_SONOS_URL() {
    return (Settings.getCachedIP().indexOf("http") != 0 ? "https://": "")
      + Settings.getCachedIP() + "/sonos/player?id=living";
  }
  
  function play(songURI) {
    var URL = get_SONOS_URL() + "&action=play";
      if (songURI) {
        URL = get_SONOS_URL() +  "&action=play_uri&uri=" + encodeURIComponent(songURI);
      } 
      var promise = $http.get(URL)
        .then(function(response) {
          return response.data;
        });
      
      return promise;
  };

  function add(songURI) {
      URL = get_SONOS_URL() +  "&action=add_uri&uri=" + encodeURIComponent(songURI);
      var promise = $http.get(URL)
        .then(function(response) {
          return response.data;
        });
      
      return promise;
  };

  function pause() {
      var promise = $http.get(get_SONOS_URL() + "&action=pause")
        .then(function(response) {
          return response.data;
        });
      
      return promise;
  };
  function prev() {
      var promise = $http.get(get_SONOS_URL() + "&action=prev")
        .then(function(response) {
          return response.data;
        });
      
      return promise;
  };
  function next() {
      var promise = $http.get(get_SONOS_URL() + "&action=next")
        .then(function(response) {
          return response.data;
        });
      
      return promise;
  };

  function getStatus() {
      var promise = $http.get(get_SONOS_URL())
        .then(function(response) {
          return response.data;
        });
      
      return promise;
  };

  function setVolume(vol) {
      var promise = $http.get(get_SONOS_URL() + "&action=volume&val=" + vol)
        .then(function(response) {
          return response.data;
        });
      
      return promise;
  };

  function seek(secsOffset) {
      var promise = $http.get(get_SONOS_URL() + "&action=seek&val=" + secsOffset)
        .then(function(response) {
          return response.data;
        });
      
      return promise;
  };


  // Sonos factory object
  return {
    play      : play,
    add       : add,
    pause     : pause,
    next      : next,
    prev      : prev,
    seek      : seek,
    getStatus : getStatus,
    setVolume : setVolume
  }
})



/* Settings Serivce (Local Storage) */
.factory('Settings', function(localStorageService) {
  var IP_SETTINGS_KEY = 'ipsettings';
  var CREDENTIALS_KEY = 'credentials';
  var ipSettings      = localStorageService.get(IP_SETTINGS_KEY);

  if (!ipSettings) {
    ipSettings = {
      "localIP"  : "https://10.0.0.51:5000",
      "remoteIP" : "http://securesaavnbrij.no-ip.biz",// "73.194.158.177:5000",
      "mode"     : "local"
    };

    localStorageService.set(IP_SETTINGS_KEY, ipSettings);
  }

  var credentials = localStorageService.get(CREDENTIALS_KEY);
  if (!credentials) {
      credentials = {
      username : "",
      password : ""
    };
    localStorageService.set(CREDENTIALS_KEY, credentials);
  }

  function getCachedIP() {
    if (ipSettings.mode == "local")
      return ipSettings.localIP;
    else
      return ipSettings.remoteIP;
  }

  function setIPSettings(settings) {
    if (settings) {
      ipSettings = settings;
      localStorageService.set(IP_SETTINGS_KEY, settings);
    }
  }

  function getIPSettings() {
      ipSettings = localStorageService.get(IP_SETTINGS_KEY);
      return ipSettings;
  }

  function getCredentials() {
      credentials = localStorageService.get(CREDENTIALS_KEY);
      return credentials;
  }
  
  function setCredentials(settings) {
    if (settings) {
      credentials = settings;
      localStorageService.set(CREDENTIALS_KEY, settings);
    }
  }


  // Settings factory object
  return {
    setIPSettings  : setIPSettings,
    getIPSettings  : getIPSettings,
    setCredentials : setCredentials,
    getCredentials : getCredentials,
    getCachedIP    : getCachedIP
  }

})


.factory('Base64', function () {
    /* jshint ignore:start */
  
    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  
    return {
        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
  
            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);
  
                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;
  
                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }
  
                output = output +
                    keyStr.charAt(enc1) +
                    keyStr.charAt(enc2) +
                    keyStr.charAt(enc3) +
                    keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);
  
            return output;
        },
  
        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;
  
            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
  
            do {
                enc1 = keyStr.indexOf(input.charAt(i++));
                enc2 = keyStr.indexOf(input.charAt(i++));
                enc3 = keyStr.indexOf(input.charAt(i++));
                enc4 = keyStr.indexOf(input.charAt(i++));
  
                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;
  
                output = output + String.fromCharCode(chr1);
  
                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }
  
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
  
            } while (i < input.length);
  
            return output;
        }
    };
  
    
});


