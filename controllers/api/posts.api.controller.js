var Posts = require('../../models/posts.models');
var User = require('../../models/users.models');
var passwordHash = require('password-hash');

//
module.exports.getPosts = async (req, res) => {
  await Posts.find({}).populate('iduser','username avata coverimage').exec(function (err, posts) {
    if (err) return handleError(err);
    res.send(posts);
  });
};
//
module.exports.getPostsDetail = async (req, res)=>{
  Posts.findOne({_id:req.params.id}).populate('iduser','username avata coverimage').exec(function (err, posts) {
    if (err) console.log(err);;
    res.send(posts);
  });
};
//
module.exports.getPostsUser = async (req, res) => {
  await Posts.find({iduser: req.params.id}).populate('iduser','username avata coverimage').exec(function (err, posts) {
    if (err) return handleError(err);
    res.send(posts);
  });
};
//
module.exports.postPosts = async (req, res) => {
  console.log(req.files[0]);
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
      var filevideo = req.files[0].filename;
      var fileimage = [];
      var background = " ";
  }else {
      var fileimage = [];
      var filevideo = " ";
      var background = req.file.filename;
  }
  console.log(req.body.iduser)
  let newPost = await new Posts({
      iduser: req.body.iduser,
      document: req.body.document,
      level: 1,
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
            msg: "Posts new False"
        });
      } else {
        res.json({
            success: true,
            msg: "Posts new success"
        });
      }
  });
};
//
module.exports.postBackground = async (req, res) => {
  let newPost = await new Posts({
    iduser: req.body.iduser,
    document: req.body.document,
    level: 1,
    file:{
        image: [],
        video: " ",
        background: req.body.background
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
          msg: "Posts new False"
      });
      } else {
        res.json({
          success: true,
          msg: "Posts new success"
      });
      }
  });
};
// update
module.exports.getUpdate = async (req, res)=>{
  await Posts.findByIdAndUpdate(req.params.id,{$set:{
    document: req.body.document
  }}).then(x=>{
    res.json({
        success: true,
        msg: "Posts update success"
    });
  }).catch(err=>{
    res.json({
        success: false,
        msg: "Posts update fail"
    });
  })
};
// delete
module.exports.getDelete = async (req, res) => {
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
        if (err) {
          console.log(err);
          res.json({
              success: false,
              msg: "Posts new fail"
          });
        }
        else{
          res.json({
              success: true,
              msg: "Posts new success"
          });
        }
    });
};