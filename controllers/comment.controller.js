var Comment = require('../models/comment.models');

module.exports.getComment = async (req, res) => {
    await Comment.find().populate('iduser','username avata').exec(function (err, cmt) {
        if (err) return handleError(err);
        // res.render('./admin/layoutadmin/comment',{comment:cmt});
        res.send(cmt);
      });
};
//
module.exports.postImgComment = async (req, res) => {
    console.log(req.params.id);
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
    console.log(fileimage+filevideo);
    await Comment.findByIdAndUpdate(req.params.id, {$set:{'file.image' : fileimage}}, (err, data) => {
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