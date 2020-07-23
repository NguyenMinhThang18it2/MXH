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
    var fileimage ="";
    console.log(req.params.id);
    let parts = req.file.filename.split('.');
    let format = parts[parts.length - 1];
    console.log("hahahaha  "+format);
    if(format === "jpg" || format === "png"){
        fileimage = req.file.filename;
    }
    console.log("why ? "+fileimage);
    await Comment.findByIdAndUpdate(req.params.id, {$set:{'file.imageComment' : fileimage}}, (err, data) => {
        if(err) {
            res.json({
                success: false,
                msg: "Failed to add author"
            });
        }else{
            res.json({
                success: true,
                msg: "Success!"
            })
        };
    });
};