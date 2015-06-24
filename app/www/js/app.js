// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.filters', 'LocalStorageModule'])

.run(function($ionicPlatform, $rootScope, $http, Base64, Settings) {
  // $rootScope.$on('Play.ClickedEmit', function(event,args) {
  //   $rootScope.$broadcast('Play.Clicked', args);
  // });

  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
    console.log("stateChangeStart: ");
    console.log(" .. " + fromState.url +  " ==> " + toState.url);
  });

  $rootScope.$on('$viewContentLoading', function(event, viewConfig) {
    console.log("viewContentLoading");
    console.log(" -->"  + viewConfig.view.templateUrl);
  });


  $http.defaults.headers.common['Authorization'] = 'Basic ' +
    Base64.encode(Settings.getCredentials().username + ":" + Settings.getCredentials().password)


  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(5);

  // note that you can also chain configs
  // $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.views.transition('ios');
})


.config(['localStorageServiceProvider', function(localStorageServiceProvider){
    localStorageServiceProvider.setPrefix('ls');
  }])


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url         : "/tab",
    abstract    : true,
    templateUrl : "templates/tabs.html",
    controller: function () {
      console.log("tab state controller ran.");
    }
  })

  // Each tab has its own nav history stack:

  .state('tab.saavn', {
      resolve: {
        ipMode: function(Settings) {
          return Settings.getIPSettings().mode;
        }
      },
      // template : "<h1>tab.saavn templte</h1>",
      // controller: 'SaavnCtrl',
      url: '/saavn/search/:searchText',
      views: {
        'tab-saavn@tab' : {
        templateUrl     : 'templates/tab-saavn-main.html',
        controller      : 'SaavnCtrl'
        }
        // ,
        // 'main@tab.saavn': {
        //   templateUrl: 'templates/tab-saavn-main.html'
        // }
      },
      onEnter: function() {
        console.log("tab.saavn: entering:");
      },
      onExit: function() {
        console.log("tab.saavn: exiting:");
      }
    })

    .state('tab.saavn.song-detail', {
      resolve: {
        ipMode: function(Settings) {
          return Settings.getIPSettings().mode;
        }
      },
      url: '/songs/:songId',
      views: {
        // 'tab-saavn@tab': {
        //   templateUrl: 'templates/tab-saavn.html'
        //   // controller: 'SaavnCtrl'
        // }
        // ,
        'tab-saavn@tab': {
        // 'temp-saavn-view@tab.saavn': {
          // todo: need above refererence to a view in tab.saavn to 
          // make it's controller run;
          // note: state inheritance; only resolve + custom data is passed down
          // 12/26:
          // if multiple 'view' from differnt states target the same view@state,
          // the child state takes precedence. ie it's template & controller get applied!
          // only
          templateUrl : 'templates/song-detail.html',
          controller  : 'SongDetailCtrl'
        }
        // ,
        // 'main@tab.saavn': {
        //   template: '',
        //   controller: function ($scope) {
        //     $scope.$on( "$ionicView.enter ", function( scopes, states ) {
        //       console.log("$ionicView.enter!: " + states.stateName);  
        //       console.log("here"); 
        //       console.log(scopes);console.log(states);       
        //     });
        //     $scope.$on( "$ionicView.leave", function( scopes, states ) {
        //       console.log("$ionicView.leave!: " + states.stateName);          
        //   });
        //   }
        // }
      },
      onEnter: function() {
        console.log("tab.saavn.song-detail: entering:");
      },
      onExit: function() {
        console.log("tab.saavn.song-detail: exiting:");
      }
    })
  .state('tab.account', {
    url   : '/account',
    views : {
      'tab-account': {
        templateUrl : 'templates/tab-account.html',
        controller  : 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/saavn/search/');

});
