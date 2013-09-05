/**
 * ManifestController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */

//    index:function (req, res) {
//        res.send('hello world!');
//    },

    admin: function(req,res){
        res.view({});
    },
    documents_by_manifest:function(req,res){

        console.log(req);

        Document.find()
            .where({manifest:req.body.manifestid})
            .exec(function(err, documents) {
                // Do stuff here
                res.json({documents:documents});
            });


    }

};
