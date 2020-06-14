var Storys = require('../models/story.models');



//
module.exports.getStory = async (req, res) => {
  await Storys.find({}).populate('iduser','username').exec(function (err, storys) {
    if (err) return handleError(err);
    res.render('./admin/layoutadmin/story',{storysall:storys});
    // res.send(storys);
  });
};
//
module.exports.postStory = async (req, res) => {
    let parts = req.file.filename.split('.');
    let format = parts[parts.length - 1];
    if(format == "jpg" || format == "png"){
        var fileimage = req.file.filename;
        var filevideo = " ";
    }
    else if(format == "mp4"){
        var filevideo = req.file.filename;
        var fileimage = " ";
    }
    let newStorys = await new Storys({
        iduser: req.signedCookies.cookieid,
        text:{
            document: req.body.document,
            color: req.body.color
        },
        file:{
            image: fileimage,
            video: filevideo,
        },
        numberLike: [],
        createdAt: new Date(),
        updatedAt: new Date()
    });
    await newStorys.save((err, storys) => {
        if(err) {
        res.json({
            success: false,
            msg: "Failed to add author"
        });
        } else {
            res.redirect('tablestory');
        }
    });
};
//
module.exports.delete = async (req, res) => {
    await Storys.findByIdAndDelete({_id: req.params.id}, function(err, posts) {
        if (err) throw err;
        res.redirect('/admin/tablestory');
    });
};
//
module.exports.edit = async (req, res) =>{

};