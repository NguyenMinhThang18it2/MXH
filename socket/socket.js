var io = require('socket.io')();
var Comment = require('../models/comment.models');
io.on('connection', (socket) => {
    console.log('a user connected');


    socket.on('disconnect', () => {
        console.log('a user disconnect');
    });

    socket.on('chat message', (data) => {
        console.log(data);
    });
    // post comment
    socket.on('post commentposts', async (data) => {
        let newCmt = await new Comment({
            idposts: data.idposts,
            iduser: data.iduser,
            document: data.document,
            file:{
                image:" ",
                video: " "
            },
            numberLike:[],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await newCmt.save( async (err, cmt) => {
            if(err) {
                res.json({
                    success: false,
                    msg: "Failed to add author"
                });
                } else {
                    socket.emit('id commentposts', {id:cmt._id});
                }
        });
    });
    //
    socket.on('id getcommentposts', async (data) => {
        await Comment.findOne({_id: data.id}).populate('iduser','username avata').exec(function (err, datacmt) {
            if (err) return handleError(err);
            io.sockets.emit('get commentposts', datacmt);
          });
    });
    // get all cmt
    socket.on('show commentposts', async (data) => {
        await Comment.find({idposts: data.idposts}).populate('iduser','username avata').exec(function (err, datacmt) {
            if (err) return handleError(err);
            socket.emit('all commentposts', datacmt);
          });
    });
});


module.exports = io;