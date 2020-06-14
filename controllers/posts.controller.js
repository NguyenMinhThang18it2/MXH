var Posts = require('../models/posts.models');
var fs = require('fs');


//
module.exports.getPosts = async (req, res) => {
  await Posts.find({}).populate('iduser','username avata').exec(function (err, posts) {
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
        level:1,
        file:{
            image: fileimage,
            video: filevideo,
            background: background
        },
        numberLike: [],
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
    await Posts.findOne({_id: req.params.id}, (err, abc) => {
        if (err) throw err;
        else{
            if(abc.file.image.length>10){
                let pathimage = './public/uploads/'+abc.file.image;
                try {
                    fs.unlinkSync(pathimage);
                    console.log("Xóa ảnh thành công");
                } catch (error) {
                    console.error(error);
                }
            }
            if(abc.file.video.length>10){
                let pathvideo = './public/uploads/'+abc.file.video;
                try {
                    fs.unlinkSync(pathvideo);
                    console.log("Xóa video thành công");
                } catch (error) {
                    console.error(error);
                } 
            } 
        }
            
    });
    await Posts.findByIdAndDelete({_id: req.params.id}, function(err, posts) {
        if (err) throw err;
        else{
            res.redirect('/admin/tablepost');
        }
    });
};
//
module.exports.postPostnotfile = async (req, res) => {
    let newPostnotfile = await new Posts({
        iduser: req.signedCookies.cookieid,
        document: req.body.document,
        file:{
            image: " ",
            video: " ",
            background: req.body.background
        },
        numberLike: [],
        numberCmt: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    await newPostnotfile.save((err, posts) => {
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
module.exports.edit = async (req, res) =>{
    
};
// ajax
// like posts
module.exports.likeposts = async (req, res) => {
    console.log(req.body);
    if(req.body.action == 'like'){
        await Posts.findByIdAndUpdate(req.body.id, {$addToSet:{
            numberLike:{
                iduserLike : req.signedCookies.cookieid,
            }
        }}, (err, data) => {
            if(err) {
                res.json({
                    success: false,
                    msg: "Failed to add author"
                });
            }else{
                console.log(data);
            };
        });
    };
    if(req.body.action == 'dislike'){
        await Posts.findByIdAndUpdate(req.body.id, {$pull:{
            numberLike:{
                iduserLike : req.signedCookies.cookieid,
            }
        }}, (err, data) => {
            if(err) {
                res.json({
                    success: false,
                    msg: "Failed to add author"
                });
            }else{
                console.log(data);
            };
        });
    }
    await Posts.findOne({_id: req.body.id}).populate('numberLike.iduserLike','username').exec((err, data) => {
        if(err) {
            res.json({
                success: false,
                msg: "Failed to add author"
            });
        }else{
            resData = {
                numberlikeposts: data.numberLike.length,
                userlike: data.numberLike
            };
            console.log(resData);
            res.send(JSON.stringify(resData));
        };
    });
};