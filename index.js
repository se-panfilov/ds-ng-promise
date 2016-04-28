'use strict';

angular.module('ds-ng-promise', [])
    .config(function ($provide) {

      $provide.decorator('$q', function ($delegate) {
        var defer = $delegate.defer;
        $delegate.defer = function () {
          var deferred = defer();
          deferred.promise.success = function (fn) {
            deferred.promise.then(function (response) {
              fn(response.data, response.status, response.headers);
            });
            return deferred.promise;
          };
          deferred.promise.error = function (fn) {
            deferred.promise.then(null, function (response) {
              fn(response.data, response.status, response.headers);
            });
            return deferred.promise;
          };
          return deferred;
        };
        return $delegate;
      })
    })

    .factory('DsClient', function ($q) {

      return {
        make: function (endPoint, data) {
          var defer = $q.defer();

          deepstream.rpc.make(endPoint, data, function (error, result) {
            if (error) {
              defer.reject({data: error});
            } else {
              defer.resolve({data: result});
            }
          });

          return defer.promise;
        }
      }
    })
;