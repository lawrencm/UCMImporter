/**
 * DocumentController
 *
 * @module        :: Controller
 * @description    :: Contains logic for handling requests.
 */

var fs = require('fs');
var exec = require('child_process').exec;
//var findit = require('findit');
// var x = require('ucmImporter');
// 
// 
module.exports = {

    /* e.g.
     sayHello: function (req, res) {
     res.send('hello world!');
     }
     */


    listDocumentService: function (req, res) {

        //        console.log(req.body.dir);
        Document.publish(req, "hello world");
        var ROOT_DIR = req.body.dir;

        /*
         if the root directory doesnt finish in a / we have to add it
         */
        if (ROOT_DIR.slice(-1) != "/") {
            ROOT_DIR += "/";
        }

        /*
         if the root directory doesnt start in a / we have to add it
         */

        //        console.log(ROOT_DIR.slice(0,1));
        // if (ROOT_DIR.slice(0,1) != "c://") {
        //     ROOT_DIR = "c://" + ROOT_DIR;
        // }
        console.log(ROOT_DIR);

        fs.readdir(ROOT_DIR, function (err, files) {
            //if erro access the directry
            if (err) {
                console.log(err);
                var socket_msg = {
                    action: "error",
                    msg: "You cannot access this directory"
                };
                sails.io.sockets.socket(req.socket.id).emit('message', socket_msg);
            } else {
                for (var i = 0; i < files.length; i++) {

                    (function (i) {

                    var filePath = ROOT_DIR + files[i];
                    var dirPath = ROOT_DIR;
                    console.log(66, filePath, dirPath);
                    /**
                     * this function will create files if they dont exist in the DB
                     */
                    if (files[i].indexOf(".") !== 0 && files[i].indexOf("~$") !== 0) {

                        console.log(74, filePath);

                        Document.findByFilePath(filePath).done(function (err, doc) {
                            //console.log(doc);
                            //if no doc then create one
                            if (err || doc.length === 0) {


                                Document.create({
                                    filePath: filePath,
                                    fileName: files[i],
                                    dirPath: dirPath,
                                    rules: {}
                                }).done(function (err, doc) {

                                        console.log(84, doc);

                                        //broadcast the creation of the new file
                                        var socket_msg = {
                                            type: "Document",
                                            id: doc.id,
                                            action: "created"
                                        };
                                        Document.publish(req, socket_msg);
                                        fs.stat(doc.filePath, function (err, stats) {
                                            if (err) {
                                                console.log(" An error occured attempting to get stats for " + doc.filePath);
                                            }
                                            console.log("geting stats for: " + doc.filePath);


                                            if (stats && stats.isFile()) {

                                                Document.update(doc.id, {
                                                    isFile: true,
                                                    stats: stats
                                                }, function (err, udoc) {
                                                    //                                        console.log(udoc[0].filePath);
                                                    socket_msg.action = "updated";
                                                    Document.publish(req, socket_msg);

                                                    var st = sails.config.ucmImporter.JAVA_HOME + ' -jar ' + sails.config.ucmImporter.APACHE_TIKA_HOME + ' -v -j "' + udoc[0].filePath + '"';

                                                    console.log(st);

                                                    var child = exec(sails.config.ucmImporter.JAVA_HOME + ' -jar -Xmx1024M -XX:MaxPermSize=512m "' + sails.config.ucmImporter.APACHE_TIKA_HOME + '" -v -j "' + udoc[0].filePath + '"',{maxBuffer:200*1024}, function (error, stdout, stderr) {

                                                        if (error) {
                                                            console.log(error);
                                                            console.log("could not get metadata for file " + udoc[0].filePath);

                                                            Document.update(doc.id, {
                                                                metadataError: "Error extracting metadata"
                                                            }, function () {
                                                                socket_msg.action = "metadata";
                                                                Document.publish(req, socket_msg);
                                                            });

                                                        } else {
                                                            Document.update(doc.id, {
                                                                metadata: JSON.parse(stdout)
                                                            }, function (err, udoc) {
                                                                console.log("added metadata");
                                                                socket_msg.action = "metadata";
                                                                Document.publish(req, socket_msg);

                                                            });

                                                        }

                                                    });
                                                });
                                            }


                                        });
                                    });
                            } else {
                                //req.socket()
                                var socket_msg = {
                                    type: "Document",
                                    id: doc[0].id,
                                    action: "exists"
                                };
                                //                        Document.publish(req, socket_msg);
                                sails.io.sockets.socket(req.socket.id).emit('message', socket_msg);
                                //                        req.socket(req.socket.id).emit('my other event', { my: 'data' });
                                //                        console.log(req.socket);
                            }


                        })
                    }  })(i);
                }

            }


        });

        //        Document.find({
        //            urlPath: {
        //                startWith: ROOT_DIR
        //            }
        //        }, function (err, docs) {
        //            res.json({});
        //        });
        res.json({
            msg: "done"
        });

    },


    listDocument: function (req, res) {
        res.view({
            msg: "Hello World"
        });

    },
    getMetadata: function (req, res) {
        var child = exec(cfg.sails.config.ucmImporter.JAVA_HOME + ' -jar ' + sails.config.ucmImporter.APACHE_TIKA_HOME + ' -v -j "' + udoc[0].filePath + '"', function (error, stdout, stderr) {
            var fileInfo = JSON.parse(stdout);
            console.log(fileInfo);
            res.view({
                fileInfo: fileInfo
            });

        });
    },
    test: function (req, res) {
        //        file.walk("/Users/lawrencm/Desktop/test", function(a,b,c){
        //            console.log(b);
        //        });
        //        var fs = require('fs'),
        //            path = require('path')


        //        findit.find('/Users/lawrencm/Desktop/test', function (file) {
        //            //
        //            // This function is called each time a file is enumerated in the dir tree
        //            //
        //            console.log(file);
        //        });
        res.json({});
    }
};