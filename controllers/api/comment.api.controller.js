var Comment = require('../../models/comment.models');

module.exports.postFileComment = async (req, res)=>{
    var fileimage = req.file.filename;
    console.log(req.params.id);
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