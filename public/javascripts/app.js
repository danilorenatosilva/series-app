var app = angular.module('seriesApp', ['ui.router']);

app.factory('series', ['$http', function($http) {

	var service = {
		series: []
	};

	service.getSeries = function() {
		return $http.get('/series').success(function(data) {
			angular.copy(data, service.series);
		});
	};	

	service.getSerie = function(id) {
		return $http.get('/series/' + id).then(function(res) {
			return res.data;
		});
	};

	service.adicionaSerie = function(serie) {
		return $http.post('/series', serie).success(function(data) {
			service.series.push(data);
		});
	};

	service.apagaSerie = function(id) {
		return $http.delete('/series/'+id);
	};

	service.atualizaSerie = function(serie) {
		return $http.put('/series/'+serie._id, serie);
	};

	return service;

}]);

app.controller('MainCtrl', ['$scope', '$location', 'series', function($scope, $location, series) {
	
	$scope.series = series.series;
	
	$scope.adicionaSerie = function() {
		if(!$scope.titulo || $scope.titulo === '')
			return;

		series.adicionaSerie({
			titulo: $scope.titulo,
			genero: $scope.genero,
			trailerURL: $scope.trailerURL
		});

		$location.path('/home');

	};


}]);

app.controller('SeriesCtrl', ['$scope', '$location', 'series', 'serie', function($scope, $location, series, serie) {
	
	$scope.serie = serie;

	$scope.apagaSerie = function() {
		series.apagaSerie($scope.serie._id).success(function(data) {
			$location.path('/home');
		});
	};

	$scope.atualizaSerie = function() {
		series.atualizaSerie($scope.serie).success(function(data) {
			console.log(data.message);
			$location.path('/home');
		});
	};

}]);

app.directive('youtube', function() {
	return {
		restrict: 'E',
		scope: {
			src: '='
		},
		templateUrl: 'views/youtube.html'
	}
});

app.filter('trusted', function ($sce) {
  return function(url) {
    return $sce.trustAsResourceUrl(url);
  };
});

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	
	$stateProvider.state('home', {
		url: '/home',
		templateUrl: 'views/home.html',
		controller: 'MainCtrl',
		resolve: {
			seriePromisse: ['series', function(series) {
				return series.getSeries();
			}]
		}
	}).state('series', {
		url: '/series/{id}',
		templateUrl: 'views/serie.html',
		controller: 'SeriesCtrl',
		resolve: {
			serie: ['$stateParams', 'series', function($stateParams, series) {
				return series.getSerie($stateParams.id);
			}]
		}
	}).state('adiciona', {
		url: '/adiciona',
		templateUrl: 'views/adiciona.html',
		controller: 'MainCtrl'
	}).state('delete', {
		url: '/delete/{id}',
		templateUrl: 'views/apaga.html',
		controller: 'SeriesCtrl',
		resolve: {
			serie: ['$stateParams', 'series', function($stateParams, series) {
				return series.getSerie($stateParams.id);
			}]
		}
	}).state('update', {
		url: '/update/{id}',
		templateUrl: 'views/atualiza.html',
		controller: 'SeriesCtrl',
		resolve: {
			serie: ['$stateParams', 'series', function($stateParams, series) {
				return series.getSerie($stateParams.id);
			}]
		}
	});

	$urlRouterProvider.otherwise('home');

}]);

