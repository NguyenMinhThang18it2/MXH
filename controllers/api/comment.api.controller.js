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
// delete
module.exports.deleteComment = async (req, res) =>{
    await Comment.findByIdAndDelete(req.params.id)
        .then(data=>{
            res.json({
                success: true,
                msg: "Success!"
            })
        }).catch(err => {
            res.json({
                success: false,
                msg: "Failed to add author"
            });
        })
}
// update
module.exports.putComment = async (req, res) => {
    await Comment.findByIdAndUpdate(req.params.id, {$set: {
        document: req.body.document
    }}).then(data => {
        res.json({
            success: true,
            msg: "Success!"
        })
    }).catch(err => {
        res.json({
            success: false,
            msg: "Failed to add author"
        });
    })      
}