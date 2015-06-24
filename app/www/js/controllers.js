angular.module('starter.controllers', [])



.controller('SaavnCtrl', function($scope, $ionicBackdrop, $ionicLoading, $stateParams, $interval, $timeout, Saavn, Settings, Sonos, ipMode) {
  
  $scope.settings = {
    ipMode: ipMode
  };

  $scope.songs = [];
  $scope.search = {
    "Term" : ""
  };
  console.log("stateParams: "+$stateParams.searchText);
  $scope.search.Term = $stateParams.searchText;
  $scope.search.newTerm = $stateParams.searchText;

  $scope.sonos = {
    status       : "PAUSED",
    volume       : 0,
    currentTrack : {
      name     : "",
      position : "0",
      duration : "0"
    }
  };

  // events
  // $scope.$on('Play.Clicked', function(event, args) {
  //   console.logs(args);
  //   $scope.play(args.song.media_url);
  // });
  $scope.$on('$destroy',function(){
      console.log("saavnCtrl: destroy") 
  });

  $scope.$on('$viewContentLoaded', function(event) {
    console.log("saavnCtrl:viewContentLoaded");
  });

  $scope.$on( "$ionicView.enter", function( scopes, states ) {
    console.log("$ionicView.enter1!: " + states.stateName); 
    // console.log(scopes); console.log(states);     
    // console.log("done1");    
  });
  $scope.$on( "$ionicView.leave", function( scopes, states ) {
    console.log("$ionicView.leave2!: " + states.stateName);          
  });


  $scope.doRefresh = function(searchTerm) {
      if (searchTerm != undefined)
        $scope.search.Term = searchTerm

       // $ionicBackdrop.retain();
       //  $timeout(function() {
       //    $ionicBackdrop.release();
       //  }, 1000);

      $ionicLoading.show({
        template: 'Searching for songs ...'
      });
      $scope.getSonosStatus();
      $scope.settings.ipMode = Settings.getIPSettings().mode;
      console.log("search=" + $scope.search.Term)
      Saavn.topSongs($scope.search.Term).then(function(songs) {
        $scope.songs = songs;
      })
      .finally(function() {
        $ionicLoading.hide();
        $scope.$broadcast('scroll.refreshComplete');
      });
  };

  $scope.nextSong = function() {
    $scope.sonos.status = "PAUSED";
    Sonos.next().then(function(response) {
      if (response.status == "OK") {
        $scope.sonos.status = "PLAYING";
        $scope.getSonosStatus();
      }})
  };

  $scope.prevSong = function() {
    $scope.sonos.status = "PAUSED";
    Sonos.prev().then(function(response) {
      if (response.status == "OK") {
        $scope.sonos.status = "PLAYING";
        $scope.getSonosStatus();
      }})
  };

  $scope.seek = function(secs) {
    $scope.sonos.status = "PAUSED";
    Sonos.seek(secs).then(function(response) {
      if (response.status == "OK") {
        $scope.getSonosStatus()
      }})
  };

  $scope.play = function(songURI) {
    Sonos.play(songURI).then(function(response) {
      console.log(response);
      if (response.status == "OK") {
        $scope.sonos.status = "PLAYING";
        $scope.getSonosStatus();
      }
    })
  };

  $scope.add = function(songURI) {
    Sonos.add(songURI).then(function(response) {
      console.log(response);
      if (response.status == "OK") {
        // $scope.sonos.status = "PLAYING";
      }
    })
  };

  $scope.pause = function() {
    Sonos.pause().then(function(response) {
      console.log(response);
      if (response.status == "OK") {
        $scope.sonos.status = "PAUSED";
        $scope.getSonosStatus();
      }
    })
  };

  $scope.togglePlayPause = function() {
    if ($scope.sonos.status == "PAUSED") {
      $scope.play();
    } else {
      $scope.pause();
    }
  };

  $scope.setVolume = function() {
    Sonos.setVolume($scope.sonos.volume).then(function(response) {
      console.log(response);
    })
  };

  $scope.getSonosStatus = function() {
    Sonos.getStatus().then(function(response) {
      console.log(response);
      $scope.sonos.status                = response.status
      $scope.sonos.volume                = response.volume
      $scope.sonos.currentTrack.name     = response.currentTrack.name
      $scope.sonos.currentTrack.position = response.currentTrack.position
      $scope.sonos.currentTrack.duration = response.currentTrack.duration

    })
  };

  $scope.saveState = function() {
    Saavn.setSongsState($scope.songs);
  }

  console.log("SaavnCtrl called..");
  $scope.getSonosStatus();
  $scope.doRefresh();
  $interval( function(){ $scope.getSonosStatus(); }, 30000);
})



.controller('SongDetailCtrl', function($scope, $rootScope, $stateParams, Saavn) {
  // $scope.song = {};

  // $stateParams.searchText does seem to exist, even if it's from ancestor state
  // contrary to documentation; todo: use a resolve on parent state
  console.log($stateParams);
  Saavn.get($stateParams.searchText, $stateParams.songId).then(function(song) {
    $scope.song = song;
  });

  $scope.$on( "$ionicView.enter", function( scopes, states ) {
    console.log("$ionicView.enter2!: " + states.stateName);      
    // console.log(scopes);console.log(states);  
    // console.log("done");    
  });
  $scope.$on( "$ionicView.leave", function( scopes, states ) {
    console.log("$ionicView.leave2!: " + states.stateName);          
  });

  $scope.play = function() {
    // console.log("broadcasting");
    // $scope.$emit('Play.ClickedEmit', {song: $scope.song});
  }

  $scope.splitByComma = function(artists) {
    return artists ? artists.split(",") : [''];
  }
})


.controller('AccountCtrl', function($scope, Settings, $ionicLoading) {
  $scope.settings = {
    enableRemote : false,
    playOnSonos  : true,
    localIP      : "https://10.0.0.51:5000",
    // remoteIP  : "73.194.158.177:5000"
    remoteIP     : "http://securesaavnbrij.no-ip.biz" // https redirect
  };

  var s                        = Settings.getIPSettings();
  $scope.settings.localIP      = s.localIP;
  $scope.settings.remoteIP     = s.remoteIP;
  $scope.settings.enableRemote = s.mode == "remote";
  var c                        = Settings.getCredentials();
  $scope.settings.username     = c.username;
  $scope.settings.password     = c.password;

  $scope.saveSettings = function() {
    Settings.setIPSettings({
      "localIP"  : $scope.settings.localIP,
      "remoteIP" : $scope.settings.remoteIP,
      "mode"     : $scope.settings.enableRemote? "remote" : "local"
    });

    Settings.setCredentials({
      "username" : $scope.settings.username,
      "password" : $scope.settings.password
    });

    $ionicLoading.show({ template: 'Settings saved!', noBackdrop: true, duration: 2000 });
  }
});
