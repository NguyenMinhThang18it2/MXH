var Posts = require('../models/posts.models');



//
module.exports.getPosts = async (req, res) => {
  await Posts.find({}).populate('iduser','username').exec(function (err, posts) {
    if (err) return handleError(err);
    res.render('./admin/layoutadmin/posts',{postsall:posts});
    // res.send(posts);
  });
};
//
module.exports.postPost = async (req, res) => {
    let parts = req.file.filename.split('.');
    let format = parts[parts.length - 1];
    let formatBackground = parts[parts.length-2];
    if(formatBackground != "background" && (format == "jpg" || format == "png")){
        var fileimage = req.file.filename;
        var filevideo = " ";
        var background = " ";
    }
    else if(format == "mp4" && formatBackground != "background"){
        var filevideo = req.file.filename;
        var fileimage = " ";
        var background = " ";
    }else {
        var fileimage = " ";
        var filevideo = " ";
        var background = req.file.filename;
    }
    let newPost = await new Posts({
        iduser: req.signedCookies.cookieid,
        document: req.body.document,
        file:{
            image: fileimage,
            video: filevideo,
            background: background
        },
        numberLike: 0,
        numberCmt: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    await newPost.save((err, posts) => {
        if(err) {
        res.json({
            success: false,
            msg: "Failed to add author"
        });
        } else {
            res.redirect('tablepost');
        }
    });
};
//
module.exports.delete = async (req, res) => {
    await Posts.findByIdAndDelete({_id: req.params.id}, function(err, posts) {
        if (err) throw err;
        res.redirect('/admin/tablepost');
    });
};
//
module.exports.edit = async (req, res) =>{

};