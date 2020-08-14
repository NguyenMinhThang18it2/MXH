var Storys = require('../../models/story.models');


//
module.exports.getStory = async (req, res) => {
  await Storys.find({}).populate('iduser','username avata').exec(function (err, storys) {
    if (err) return handleError(err);
    res.send(storys);
  });
};
//
module.exports.postStory = async (req, res) => {
  let arrFileImg = []; // mảng hình ảnh
  req.files.forEach(element => {
      arrFileImg.push(element.filename);
  });
  console.log("asdasda "+arrFileImg);
  await Storys.findOne({iduser : req.params.id}, async (err,data) =>{
      if(err){
          return handleError(err);
      }
      else{
          console.log(data);
          if(data === null){
              let newStorys = await new Storys({
                  iduser: req.params.id,
                  text:{
                      document: "",
                      color: ""
                  },
                  file:arrFileImg,
                  numberLike: [],
                  createdAt: new Date(),
                  updatedAt: new Date()
              });
              await newStorys.save((err, storys) => {
                  if(err) {
                      console.log(err);
                      res.json({
                          success: false,
                          msg: "Failed to add author"
                      });
                  } else {
                    res.json({
                        success: true,
                        msg: "Success!"
                    });
                  }
              });
          }else{
              await Storys.findByIdAndUpdate(data._id, {$addToSet:{
                  file:arrFileImg
              }}, (err, data) => {
                  if(err) {
                      console.log(err);
                      res.json({
                          success: false,
                          msg: "Failed to add author"
                      });
                  }else{
                    res.json({
                        success: true,
                        msg: "Success!"
                    });
                  };
              });
          }
      }
  });
};
// //
// module.exports.edit = async (req, res) =>{

// };