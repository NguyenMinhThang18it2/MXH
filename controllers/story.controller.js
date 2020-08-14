var Storys = require('../models/story.models');



//
module.exports.getDataStorys = async (req, res) => {
  await Storys.find({}).populate('iduser','username').exec(function (err, storys) {
    if (err) throw err;
    res.render('./admin/layoutadmin/story',{storysall:storys});
    // res.send(storys);
  });
};
//
module.exports.postStory = async (req, res) => {
    let arrFileImg = []; // mảng hình ảnh
    req.files.forEach(element => {
        arrFileImg.push(element.filename);
    });
    console.log("asdasda "+arrFileImg);
    await Storys.findOne({iduser : req.signedCookies.cookieid}, async (err,data) =>{
        if(err){
            return handleError(err);
        }
        else{
            console.log(data);
            if(data === null){
                let newStorys = await new Storys({
                    iduser: req.signedCookies.cookieid,
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
                        res.redirect('tablestory');
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
                        res.redirect('tablestory');
                    };
                });
            }
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