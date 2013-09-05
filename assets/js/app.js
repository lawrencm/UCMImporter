/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


(function (io) {

    // as soon as this file is loaded, connect automatically,
    var socket = io.connect();
    if (typeof console !== 'undefined') {
        log('Connecting to Sails.js...');
    }

    socket.on('connect', function socketConnected() {

        // Listen for Comet messages from Sails
        socket.on('message', function messageReceived(message) {

            ///////////////////////////////////////////////////////////
            // Replace the following with your own custom logic
            // to run when a new message arrives from the Sails.js
            // server.
            ///////////////////////////////////////////////////////////
//      log('New comet message received :: ', message);
            //////////////////////////////////////////////////////

        });


        ///////////////////////////////////////////////////////////
        // Here's where you'll want to add any custom logic for
        // when the browser establishes its socket connection to
        // the Sails.js server.
        ///////////////////////////////////////////////////////////
        log(
            'Socket is now connected and globally accessible as `socket`.\n' +
                'e.g. to send a GET request to Sails, try \n' +
                '`socket.get("/", function (response) ' +
                '{ console.log(response); })`'
        );
        ///////////////////////////////////////////////////////////


    });


    // Expose connected `socket` instance globally so that it's easy
    // to experiment with from the browser console while prototyping.
    window.socket = socket;


    // Simple log function to keep the example simple
    function log() {
        if (typeof console !== 'undefined') {
            console.log.apply(console, arguments);
        }
    }


})(

        // In case you're wrapping socket.io to prevent pollution of the global namespace,
        // you can replace `window.io` with your own `io` here:
        window.io

    );

var InlineEditable = angular.module("InlineEditable",[]);
InlineEditable.directive('contenteditable', function() {
    return {
        restrict: 'A', // only activate on element attribute
        priority:0,
        require: '?ngModel', // get a hold of NgModelController
        link: function(scope, element, attrs, ngModel) {
            if(!ngModel) return; // do nothing if no ng-model
            // Specify how UI should be updated
            ngModel.$render = function(o,n) {
                element.html(ngModel.$viewValue || '');
            };
            // Listen for change events to enable binding
            element.on('blur', function() {
//                element.addClass('ng-dirty');

                scope.$apply(read);
            });

//            element.on('keyup', function(){
//                element.addClass('ng-dirty');
//            });


//            console.log(ngModel);
            //scope.$watch()

//            element.on('click',function () {
//                console.log(element[0]);
//                element[0].select();
//            });


//            read(); // initialize



            // Write data to the model
            function read() {
                var html = element.html();
                // When we clear the content editable the browser leaves a <br> behind
                // If strip-br attribute is provided then we strip this out
                if( attrs.stripBr && html == '<br>' ) {
                    html = '';
                }
                ngModel.$setViewValue(html);
            }
        }
    };
});



var DEFAULT_MANIFEST_TEMPLATE = "/partials/manifestDetail.html";



var UCMManifest = angular.module("UCMManifest", ['InlineEditable']);
UCMManifest.controller("manifestController", function ($scope,$http) {


    $scope.activeManifest = {};
    $scope.updateManifestCount = 1;
    $scope.mainTemplate;

    $scope.toggleEdit = false;
//    $scope.$watch('activeManifest.name',function(o,n){
//        console.log("changed:" + o,n);
//        if (!n){
//            console.log("should chnage")
//            $scope.activeManifest['name']=o;
//        }
//
//    })

    $scope.toggleEditToggle = function(){
        if ($scope.toggleEdit){
            $scope.toggleEdit = false;
        }else{
            $scope.toggleEdit = true;
        }
    }


    $scope.showEditButton = function(){
        if ($scope.toggleEdit){
            return true;
        }else{
            return false;
        }
    }


    $scope.createNewForm = function(){
        $scope.activeManifest = {
            name:"Enter a name for the manifest",
            description: "Enter a brief description"

        };
        $scope.mainTemplate = "/partials/manifestNewForm.html";
    }


    $scope.createManifest = function(){

//
//        console.log("hello");
//        console.log($scope.activeManifest);

        var newData =$.extend(true, {}, $scope.activeManifest);


//        socket.post('/manifest',{name:'xxx'},function(r){
//            console.log(r);
//        });


        $http.post('/manifest', newData).success(function(data, status, headers, config){
            console.log(data);
            $scope.updateManifestCount = $scope.updateManifestCount + 1;


        });

//        socket.post('/document',{name:'test'}, function(a){
////
//            console.log(a);
////
//////            console.log(resp);
//////            $scope.activeManifest = {};
//////            $scope.mainTemplate = "/partials/manifestDetail.html";
//            $scope.updateManifestCount = $scope.updateManifestCount + 1;
//////
//////            console.log($scope.updateManifestCount);
//////
////////            $scope.$broadcast("mainfestsUpdate", {})
//////
////////            $scope.$apply( TEST );
//////
////////            $scope.manifests.push(resp);
//////            $scope.apply();
//        });

    };


    $scope.loadManifest = function(id){
        $scope.mainTemplate = DEFAULT_MANIFEST_TEMPLATE;

        socket.get('/manifest',{id:id},function(resp){
            $scope.activeManifest = $.extend(true, {}, resp);
            $scope.$apply();
        });
    }


//    $scope.$watch('activeManifest.description',function(o,n){
//        console.log(o,n);
//    });

    $scope.updateManifest = function(){

//        console.log($scope.activeManifest);

        socket.put('/manifest/'+ $scope.activeManifest.id ,$scope.activeManifest,function(resp){
            //$scope.activeManifest = null;
//            console.log(resp);
            var aid = $scope.activeManifest.id;
            for(i in $scope.manifests){
                if ($scope.manifests[i].id == aid){
                    $scope.manifests[i] = $.extend(true, {}, resp);
                }
            }
            $scope.$apply();
        });
    };


    $scope.removeManifest = function(aid){
         if(!aid){
             var aid = $scope.activeManifest.id;
         }

        //var aid = $scope.activeManifest.id;

        for(i in $scope.manifests){
            if ($scope.manifests[i].id == aid){
                console.log($scope.manifests.splice(i,1));
            }
        }
        socket.delete('/manifest',{id:aid},function(resp){
            $scope.activeManifest = null;
            $scope.$apply();
        })
    };

    $scope.checkActive = function(id){
        if($scope.activeManifest){
            return (id==$scope.activeManifest.id)?"active":"";
        }else{
            return "";
        };
    };

    });

UCMManifest.directive("ucmDocumentsByManifest", function factory(){
   return {
       templateUrl:'/partials/ucmDocumentsByManifest.html',
       link: function(scope,elm,attrs){
           socket.get("/manifest/documents_by_manifest",{manifestid:scope.activeManifest.id}, function(resp){
               console.log(resp);
               scope.documents = resp;
               scope.$apply();
           })
//            console.log("hello");
       }
   }
});

UCMManifest.directive("ucmDocInfo", function factory() {
    return {
        template:"<td></td><td>{{document.fileName}}</td><td>{{document.filePath}}</td>",
        link:function(scope,elm,attrs){

            socket.get('/document/' + scope.doc,{},function(resp){
                scope.document = resp;
                scope.$apply();
            });
        }
    };

});




UCMManifest.directive("ucmManifests", function factory() {
    var ucmManifestsDefinitionObject = {
        link:function(scope,$rootScope){

//            scope.$on('mainfestsUpdate', function(){
//                console.log("sdsdsdsd");
//            });

            function reloadManifests(){
                socket.get('/manifest',{},function(resp){
                    scope.manifests = resp;
                    scope.$apply();
                })
            };

            scope.$watch('updateManifestCount',function(o,n){
                console.log("updating manifests");
                reloadManifests();
            });
//
            reloadManifests();



        }
    };
    return ucmManifestsDefinitionObject;
});


UCMManifest.directive('test', function () {

    var test = {

        link:function(){

        }

    }



    return function (scope, elm, attr) {

        console.log("xxxcxcxcxc");

//        attr.$observe('ngBindTemplate', function (value) {
//            //if class of clean do nothing
//            if (elm.hasClass("clean")) {
//                elm.removeClass("clean");
//            } else {
//                elm.addClass("notify");
//                elm.bind('webkitAnimationEnd', function () {
//                    elm.removeClass("notify");
//                });
//            }
//        });
    };
});



var UCMDocument = angular.module("UCMDocument", []);

UCMDocument.controller("documentController", function ($scope) {

    $scope.baseUrl = "/Users/lawrencm/Desktop/test/";
    $scope.docs = [];
    $scope.sortOrder = "fileName";
    $scope.messages = [];
    $scope.manifests = [];
    $scope.selectedItems = [];
    $scope.selectedManifest="";
    $scope.sortOrder = "ASC";
    $scope.authors = ["Michael", "Buster", "George Michael","Jobe"];
    $scope.activeDoc;

    socket.on("connect", function () {

        console.log("Socket Connected");
        socket.get("/Document", {}, function (resp) {
            console.log("Getting the initial data");
        });

        socket.on("message", function (msg) {

            console.log(msg);

            switch (msg.action) {
                case "error":
                    $scope.createErrorAlert(msg);
                case "exists":
                    $scope.loadDocument(msg.id);
                    break;
                case "created":
                    $scope.loadDocument(msg.id);
                    break;
                case "updated":
                    $scope.loadDocument(msg.id);
                    break;
                case "metadata":
                    $scope.loadDocument(msg.id);
                    break;
                default:
                    break;
            }
        });

        $scope.updateSelectedItems = function(doc){
            if (doc.selected){
                $scope.selectedItems.push(doc.id)
            }else{
                for(var i = $scope.selectedItems.length - 1; i >= 0; i--) {
                    if($scope.selectedItems[i] === doc.id) {
                        $scope.selectedItems.splice(i,1);
                    }
                }
            }
            console.log(doc);
        }


        $scope.viewMetadata = function (id) {

//            console.log(id)
            var indx = 0;

            var ix = $.grep($scope.docs, function (a, i) {
                if (a.id == id) {
                    indx = i;
                    return a;
                }
            });

//            console.log(indx);

            $scope.activeDoc = $scope.docs[indx];
//            $scope.$apply();
            $("#myModal").modal({});
        }


        $scope.sortOn = function(attr,dataType){

            switch (dataType){
                case "string":

                    $scope.docs.sort(function(a,b){
                        var stA=a[attr].toLowerCase(), stB=b[attr].toLowerCase()




                            if (stA < stB){
                                return -1;
                            };

                            if (stA > stB){
                                return 1;
                            }

                            return 0;



                    });
                default:
                    $scope.docs.sort(function(a,b){
                        return a[attr] - b[attr];
                    });
            }



//            $scope.$apply();
        }

        $scope.adKeys = function () {
            var keys = [];
            if ($scope.activeDoc) {


//                console.log($scope.activeDoc);

                for (i in $scope.activeDoc.metadata) {
                    keys.push(i);
                }
            }
            return keys;
        }


        $scope.createErrorAlert = function (msg) {
            $scope.messages.push(msg);
        }


        /**
         * selct all docs called from client button
         */
        $scope.selectAllDocs = function(){
            for(var i = $scope.docs.length - 1; i >= 0; i--) {
                $scope.docs[i].selected = true;
                $scope.updateSelectedItems($scope.docs[i]);
            }
        };

        /**
         * deselct all docs
         */

        $scope.deselectAllDocs = function(){
            for(var i = $scope.docs.length - 1; i >= 0; i--) {
                $scope.docs[i].selected = false;
                $scope.updateSelectedItems($scope.docs[i]);
            }
        };


        /**
         * get a list of manifests
         */
        $scope.loadManifests = function(){
            socket.get("/Manifest",{},function(resp){
//                console.log(resp);
                $scope.manifests = resp;
                $scope.$apply();
            });
        }()
//        $scope.loadManifests();

        /**
         * displays thre maifest modals
         */

        $scope.displayManifestModal = function(){
            $("#manifestModal").modal({});
        };

        $scope.getManifestName = function(mid){
//            console.log($scope.manifests);
            var m = "";
            $.each($scope.manifests, function(i, el){
//                console.log(el)
                if (el.id == mid){
                    m = el.name;
                }
            });
            return m;

        }

        $scope.addToManifest = function(){
//          console.log($scope.selectedManifest);
          for(var i = $scope.selectedItems.length - 1; i >= 0; i--) {
              var did = $scope.selectedItems[i];
              socket.put("/document/",{id:did,manifest:$scope.selectedManifest}, function(resp){
                  $scope.messages.push({action:'updated',msg:"Added the selected docs to the manifest"});
              });

              $.each($scope.docs, function(i,el){
                  if(el.id == did){
                    el.manifest = $scope.selectedManifest;
                  }
              });


          }
//            $scope.
        };



        $scope.loadDocument = function (id) {

            socket.get("/Document/" + id, {}, function (resp) {

//                console.log($.inArray(resp.id, $scope.selectedItems));

                if ($.inArray(resp.id, $scope.selectedItems) >= 0){
                    resp.selected = true;
                };


                var indx = 0;
                var ix = $.grep($scope.docs, function (a, i) {
//                    console.log(i,a.id,id);

                    if (a.id == id) {
                        indx = i;
                        return a;
                    }
                });


                if (ix.length <= 0) {
                    $scope.docs.push(resp);
                } else {
                    $scope.docs[indx] = resp;
                }
                $scope.$apply();
            })

        }

        $scope.loadNewDirectory = function (dir) {
            $scope.baseUrl = dir;
            console.log(dir);

            socket.post("/Document/listDocumentService", {dir: $scope.baseUrl}, function (resp) {
                $scope.docs = [];
                $scope.$apply();
//                console.log(resp);
//                $scope.doucuments = resp;
//                $scope.$apply();
            });
        }

        $scope.isInPath = function(doc){
            console.log(doc);
        }


        $scope.loadNewDirectory($scope.baseUrl);


    });


});


UCMDocument.directive("ucmBreadcrumbs", function factory() {

    var directiveDefinitionObject = {
        link: function (scope) {
            console.log(scope.baseUrl);


            scope.$watch('baseUrl', function (newValue, oldValue) {

//            "remove the first / ";

                console.log("changed base")


                pathArray = newValue.split("/");

                if (pathArray[0] == "") {
                    pathArray = pathArray.splice(1, pathArray.length - 1);
                }

                pathObj = [];
                for (i = 0; i < pathArray.length; i++) {
                    var label = pathArray[i];
                    var loc = pathArray.slice(0, i + 1).join("/");

                    /*
                     if the root directory doesnt finish in a / we have to add it
                     */
                    if (loc.slice(-1) != "/") {
                        loc += "/";
                    }

                    /*
                     if the root directory doesnt start in a / we have to add it
                     */
                    if (loc.slice(0) != "/") {
                        loc = "/" + loc;
                    }

                    pathObj.push({label: label, loc: loc});
                }

//                console.log(pathObj);
                scope.pathObj = pathObj;
            });
        }
    };

    return directiveDefinitionObject;

});




UCMDocument.filter('fileSize', function () {
    return function (input) {

        if (typeof input !== 'undefined') {
            return filesize(input);
        } else {
            return "";
        }
    };
});


//$(document).ready(function(){
//
//    $('.manifest-edit-menu').click(function(){
//        console.log("clicked");
//        $('#manifest-edit-menu').dropdown();
//    });
//
//
//
//});

/**
 * filesize
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2013 Jason Mulligan
 * @license BSD-3 <https://raw.github.com/avoidwork/filesize.js/master/LICENSE>
 * @link http://filesizejs.com
 * @module filesize
 * @version 1.10.0
 */
(function (global) {
    "use strict";

    var base = 10,
        right = /\.(.*)/,
        bit = /b$/,
        bite = /^B$/,
        zero = /^0$/,
        options;

    options = {
        all: {
            increments: [
                ["B", 1],
                ["kb", 125],
                ["kB", 1000],
                ["Mb", 125000],
                ["MB", 1000000],
                ["Gb", 125000000],
                ["GB", 1000000000],
                ["Tb", 125000000000],
                ["TB", 1000000000000],
                ["Pb", 125000000000000],
                ["PB", 1000000000000000]
            ],
            nth: 11
        },
        bitless: {
            increments: [
                ["B", 1],
                ["kB", 1000],
                ["MB", 1000000],
                ["GB", 1000000000],
                ["TB", 1000000000000],
                ["PB", 1000000000000000]
            ],
            nth: 6
        }
    };

    /**
     * filesize
     *
     * @param  {Mixed}   arg  String, Int or Float to transform
     * @param  {Mixed}   pos  [Optional] Position to round to, defaults to 2 if shrt is ommitted, or `true` for shrthand output
     * @param  {Boolean} bits [Optional] Determines if `bit` sizes are used for result calculation, default is true
     * @return {String}       Readable file size String
     */

    function filesize(arg) {
        var result = "",
            bits = true,
            skip = false,
            i, neg, num, pos, shrt, size, sizes, suffix, z;

        // Determining arguments
        if (arguments[3] !== undefined) {
            pos = arguments[1];
            shrt = arguments[2];
            bits = arguments[3];
        } else {
            typeof arguments[1] === "boolean" ? shrt = arguments[1] : pos = arguments[1];

            if (typeof arguments[2] === "boolean") {
                bits = arguments[2];
            }
        }

        if (isNaN(arg) || (pos !== undefined && isNaN(pos))) {
            throw new Error("Invalid arguments");
        }

        shrt = (shrt === true);
        bits = (bits === true);
        pos = shrt ? 1 : (pos === undefined ? 2 : parseInt(pos, base));
        num = Number(arg);
        neg = (num < 0);

        // Flipping a negative number to determine the size
        if (neg) {
            num = -num;
        }

        // Zero is now a special case because bytes divide by 1
        if (num === 0) {
            if (shrt) {
                result = "0";
            } else {
                result = "0 B";
            }
        } else {
            if (bits) {
                sizes = options.all.increments;
                i = options.all.nth;
            } else {
                sizes = options.bitless.increments;
                i = options.bitless.nth;
            }

            while (i--) {
                size = sizes[i][1];
                suffix = sizes[i][0];

                if (num >= size) {
                    // Treating bytes as cardinal
                    if (bite.test(suffix)) {
                        skip = true;
                        pos = 0;
                    }

                    result = (num / size).toFixed(pos);

                    if (!skip && shrt) {
                        if (bits && bit.test(suffix)) {
                            suffix = suffix.toLowerCase();
                        }

                        suffix = suffix.charAt(0);
                        z = right.exec(result);

                        if (suffix === "k") {
                            suffix = "K";
                        }

                        if (z !== null && z[1] !== undefined && zero.test(z[1])) {
                            result = parseInt(result, base);
                        }

                        result += suffix;
                    } else if (!shrt) {
                        result += " " + suffix;
                    }
                    break;
                }
            }
        }

        // Decorating a 'diff'
        if (neg) {
            result = "-" + result;
        }

        return result;
    }

    // CommonJS, AMD, script tag
    if (typeof exports !== "undefined") {
        module.exports = filesize;
    } else if (typeof define === "function") {
        define(function () {
            return filesize;
        });
    } else {
        global.filesize = filesize;
    }
})(this);


