
// //Code For Client
// // (function(io) {
// //     var sock = io.connect();
// //     sock.on('welcomeMessage', function(json) {
// //         //Handle Event Received
// //         console.log(json);

// //     });
// // })(window.io);

// function FetchRequirements($scope, $http, $templateCache) {
//     // function FetchRequirements($scope) {
//     $scope.method = 'GET';
//     $scope.url = '/requirement';

//     $scope.status = 'Not Intitialized';
//     $scope.data = [{}];

//     $scope.fetch = function() {
//         console.log("fetching");
//         $scope.code = null;
//         $scope.response = null;

//         $http({
//             method: $scope.method,
//             url: $scope.url,
//             // cache: $templateCache
//             cache: false
//         }).
//         success(function(data, status) {
//             $scope.status = status;
//             $scope.data = data;
//         }).
//         error(function(data, status) {
//             $scope.data = data || "Request failed";
//             $scope.status = status;
//         });
//     };

//     $scope.fetch();


//     $scope.destroyReq = function(reqId) {
//         console.log(reqId);
//         $http({
//             method: "POST",
//             url: "/requirement/destroy/" + reqId,
//             cache: $templateCache
//         }).
//         success(function(data, status) {
//             console.log(data);
//             console.log(status);
//             $scope.status = status;
//             // $scope.data = data;
//         }).
//         error(function(data, status) {
//             // $scope.data = data || "Request failed";
//             $scope.status = status;
//         });

//         $scope.fetch();
//     };


//     // $scope.updateModel = function(method, url) {
//     //     $scope.method = method;
//     //     $scope.url = url;
//     // };
// }