var Posts = require('../models/posts.models');
var Notification = require('../models/notification.models');
var fs = require('fs');


//
module.exports.getPosts = async (req, res) => {
  await Posts.find({}).populate('iduser','username avata').exec( async (err, posts) => {
    if (err) throw err;
    else{
        await res.render('./admin/layoutadmin/posts',{postsall:posts});
    }
    // res.send(posts);./admin/layoutadmin/posts
  });
};
//
module.exports.tetsPostFIle = async (req, res) => {
    let arrFile = [];
    let parts = req.files[0].filename.split('.');
    let format = parts[parts.length - 1];
    req.files.forEach(element => {
        arrFile.push(element.filename);
    });
    console.log(arrFile);
    res.send("ok"+format);
};
//
module.exports.postPost = async (req, res) => {
    let arrFileImg = []; // mảng hình ảnh
    req.files.forEach(element => {
        arrFileImg.push(element.filename);
    });
    let parts = req.files[0].filename.split('.');
    let format = parts[parts.length - 1];
    let formatBackground = parts[parts.length-2];
    if(formatBackground != "background" && (format == "jpg" || format == "png")){
        var fileimage = arrFileImg;
        var filevideo = " ";
        var background = " ";
    }
    else if(format == "mp4" && formatBackground != "background"){
        var filevideo = req.files[0].filename; // 1 video
        var fileimage = [];
        var background = " ";
    }else {
        var fileimage = [];
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
    console.log("ádsadsdas"+req.body.document);
    await Posts.findByIdAndUpdate(req.params.id,{$set:{
        document: req.body.document
      }}).then(x=>{
        res.redirect('/admin/tablepost');
      }).catch(err=>{
          console.log(err+'');
        res.json({
            success: false,
            msg: "Posts update fail"
        });
      })
};
// ajax
// like posts
module.exports.likeposts = async (req, res) => {
    // if(req.body.action == 'like'){
    //     await Posts.findByIdAndUpdate(req.body.id, {$addToSet:{
    //         numberLike:{
    //             iduserLike : req.signedCookies.cookieid,
    //         }
    //     }}, (err, data) => {
    //         if(err) {
    //             res.json({
    //                 success: false,
    //                 msg: "Failed to add author"
    //             });
    //         }else{
    //             console.log('like' +data);
    //         };
    //     });
    // };
    // if(req.body.action == 'dislike'){
    //     await Posts.findByIdAndUpdate(req.body.id, {$pull:{
    //         numberLike:{
    //             iduserLike : req.signedCookies.cookieid,
    //         }
    //     }}, (err, data) => {
    //         if(err) {
    //             res.json({
    //                 success: false,
    //                 msg: "Failed to add author"
    //             });
    //         }else{
    //             console.log( 'dislike' +data);
    //         };
    //     });
    // }
    // await Posts.findOne({_id: req.body.id}).populate('numberLike.iduserLike','username').exec((err, data) => {
    //     if(err) {
    //         res.json({
    //             success: false,
    //             msg: "Failed to add author"
    //         });
    //     }else{
    //         res.send(data);
    //         // resData = {
    //         //     numberlikeposts: data.numberLike.length,
    //         //     userlike: data.numberLike
    //         // };
    //         // console.log(resData);
    //         // res.send(JSON.stringify(resData));
    //     };
    // });
};