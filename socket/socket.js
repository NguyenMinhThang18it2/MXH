const io = require('socket.io')();
const Comment = require('../models/comment.models');
const Posts = require('../models/posts.models');
const User = require('../models/users.models');
const Notification = require('../models/notification.models');
const Follow = require('../models/follow.models');
const Friend = require('../models/friends.models');
const StatusUser = require('../models/status_users.models');
const Mess = require('../models/mess.model');
const reqlyCmt = require('../models/replycomment.models');
const people={}; 

io.on('connection', (socket) => {
    // user conect
    console.log('a user connected');
    socket.on('chat message', async (data) => {
        if(data !== '') {
            // add id user connect into people{}
            people[data] = socket.id;
            console.log(socket.id);
            console.log(people[data]);
            console.log(people);

            let check = false;
            // load data
            let loadStatusUser =() =>{
                return new Promise((rs,rj)=>{
                    StatusUser.find({}).then(result=>{
                        rs(result);
                    }).catch((err)=>rj(err))
                })
            }
            // check data của iduser login tồn tại hay chưa
            let checkStatusUser = (statusUser)=>{
                for (let index = 0; index < statusUser.length; index++) {
                    const element = statusUser[index];
                    if(String(element.iduser) === String(data)){
                        check = true;
                        break;
                    }else{
                        check = false;
                    }
                }
                return check;
            }
            // cập nhật hoặc tạo mới csdl
            let updateStatusUser = (x) =>{
                if(x === true){
                        StatusUser.updateOne({iduser: data}, {$set: {
                            status: true,
                            createdAt: new Date()
                        }}, (err, kq) => {
                            if(err) console.log(er +'');
                            else console.log("update status true 1 user thành công");
                        });
                }else{
                    let newStatusUser = new StatusUser({
                        iduser : data,
                        status: true,
                        createdAt: new Date()
                    });
                    newStatusUser.save((err, result)=>{
                        if(err) console.log(err+'');
                        else console.log("update status true user thành công");
                    });
                }
            }
            await loadStatusUser()
                .then((result)=>checkStatusUser(result))
                .then(x=>updateStatusUser(x))
                .catch(err=>console.log(err+''))

            await Friend.findOne({iduser: data}, async (err, kq)=>{
                if(err) console.log(err +'');
                else{
                    // gửi cho tất cả bạn bè trong danh sách bạn bè
                    kq.listFriend.forEach(async (arr)=>{
                        socket.broadcast.to(people[arr.idfriend]).emit('status user connect', 'a user connected');
                    });
                }
            });
        }
        
    });

    socket.on('disconnect', async () => {
        console.log('a user disconnect');
        Object.keys(people).forEach(async (key)=>{
            if(people[key]===socket.id){
                delete people[key];
                await StatusUser.updateOne({iduser: key}, {$set: {
                    status: false,
                    createdAt: new Date()
                }}, (err, kq) => {
                    if(err) console.log(er +'');
                    else console.log("update status false user thành công");
                });
                await Friend.findOne({iduser: key}, async (err, kq)=>{
                    if(err) console.log(er +'');
                    else{
                        // gửi cho tất cả bạn bè trong danh sách bạn bè
                        kq.listFriend.forEach(async (arr)=>{
                            socket.broadcast.to(people[arr.idfriend]).emit('status user connect', 'a user disconnected');
                        });
                    }
                });
            }
          });
    });

    socket.on('join room cmt', (data) => {
        socket.join(data);
        console.log(io.sockets.adapter.rooms[data]);
    });
    socket.on('leave room cmt' , (data) =>{
        console.log(data);
        socket.leave(data);
        console.log(io.sockets.adapter.rooms[data]);
    });
    

    // post comment
    socket.on('post commentposts', async (data) => {
        console.log(data);
        let newCmt = await new Comment({
            idposts: data.idposts,
            iduser: data.iduser,
            document: data.document,
            file:{
                imageComment:" "
            },
            numberLike:[],
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await newCmt.save( async (err, cmt) => {
            if(err) throw err;
            else {
                    
                    let sendSocket = "";
                    if(data.address === 'web'){
                        sendSocket = 'id commentposts web';
                    }else if(data.address === 'android'){
                        sendSocket = 'id commentposts android';
                    }
                    console.log("lalalal "+sendSocket);
                    socket.emit(sendSocket, {id:cmt._id});
                    await Comment.findOne({_id: cmt._id})
                        .populate('idposts', 'iduser')
                        .populate('iduser', 'username avata')
                        .exec( async (err, userCmt) => { // lấy tên hình ảnh user comment
                            if(err) throw err;
                            else{
                                console.log(userCmt);
                                await Comment.find({idposts: data.idposts}).distinct('iduser', async (err, arrUserCmt) =>{ /// lấy danh sách các user cmt
                                    if(err) throw err;
                                    else{
                                        arrUserCmt.forEach( async (id)=>{
                                            if(id != data.iduser){
                                                await Notification.findOne({iduser: id}, async (err,notify)=>{
                                                    if(err) throw err;
                                                    else{
                                                        await Notification.findByIdAndUpdate(notify._id, {$addToSet:{
                                                            listnotification:[{
                                                                idPosts: data.idposts,
                                                                iduserNotify: data.iduser,
                                                                status: false,
                                                                title: 'comment',
                                                                createdAt: new Date(),
                                                                updatedAt: new Date()
                                                            }]
                                                        }}, async (err, kq)=>{
                                                            if(err) throw err;
                                                            console.log('cập nhật thông báo thành công');
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                        await User.findOne({_id: userCmt.idposts.iduser}, async (err,userPosts) => { // lấy tên user đã đăng bài posts
                                            if(err) throw err;
                                            else{
                                                await socket.broadcast.emit('send notification to client', {
                                                    sendNotify: arrUserCmt,
                                                    userPosts: userPosts.username,
                                                    userCmt: userCmt.iduser,
                                                    action: 'comment'
                                                });
                                                await socket.broadcast.emit('update notify android', {
                                                    arrUserCmt: arrUserCmt,
                                                    action: 'comment'
                                                });
                                                console.log(arrUserCmt);
                                            }
                                        });
                                    }
                                });
                            }
                    });
                }
        });
        
    });
    // reply comment
    socket.on('reply comment to server', async (data)=>{

        console.log(data);
        let newReplyCmt = new reqlyCmt({
            idcmt: data.idcmt,
            idposts: data.idposts,
            listCmt:[{
                iduser: data.iduserreply,
                document: data.document,
                numberLike:[],
                createdAt: new Date(),
                updatedAt: new Date()
            }]
        })
        // kiểm tra xem dữ liệu với idcmt có hay chư, nếu chưa tạo mói, co rồi thì cập nhật thêm
        await reqlyCmt.findOne({idcmt: data.idcmt})
            .then(dataRCmt =>{ 
                if(dataRCmt) {
                    console.log("vào đây rồi");
                    reqlyCmt.findOneAndUpdate({idcmt: data.idcmt}, {$addToSet:{
                        listCmt:[{
                            iduser: data.iduserreply,
                            document: data.document,
                            numberLike:[],
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }]
                    }}).then(x=>console.log('update ok')).catch(err=>console.log(err+''));
                }else{
                    newReplyCmt.save().then(data => console.log("new reply ok")).catch(err => console.log(err +''));
                }
            }).catch(err=> console.log(err+''))
        
        
        // gửi sự kiện cập nhật data xuông android
        await io.to(data.idcmt).emit('reply comment to client', 'cập nhật lại data');
        // cập nhật thông báo
        // distinct lấy mảng các user reply ko trùng lặp
        await reqlyCmt.findOne({idcmt: data.idcmt}).distinct('listCmt.iduser', async (err, arrUserReply)=>{
            if(err) console.log(err+'');
            else{
                await reqlyCmt.findOne({idcmt: data.idcmt})
                .populate('idcmt', 'iduser')
                .populate('listCmt.iduser', 'username avata')
                .then(datareply=>{
                    // thêm user cmt chủ đề 
                    arrUserReply.push(datareply.idcmt.iduser);
                    console.log("aaaa array "+arrUserReply);
                    // gửi thông báo cho tất cả user reply + user cmt chủ đề
                    arrUserReply.forEach(async (element) => {
                        if(String(element) !== String(data.iduserreply)){
                            await Notification.findOneAndUpdate({iduser: element}, {$addToSet:{
                                listnotification:[{
                                    idPosts: data.idposts,
                                    iduserNotify: data.iduserreply,
                                    status: false,
                                    title: 'replycomment',
                                    createdAt: new Date(),
                                    updatedAt: new Date()
                                }]
                            }})
                            await socket.broadcast.to(people[element]).emit('update notify android', {
                                arrUserCmt: arrUserReply,
                                action: 'replycomment'
                            });
                        }
                    });
                })
            }
        })
    });
    //
    socket.on('id getcommentposts', async (data) => {
        await Comment.findOne({_id: data.id}).populate('iduser','username avata').exec( async (err, datacmt) => {
            if (err) return handleError(err);
            await Comment.find({idposts: datacmt.idposts}).populate('iduser','username avata').exec(async (err, datacmtAll)=> {
                if (err) return handleError(err);
                await io.to(datacmt.idposts).emit('get commentposts', {
                    datacmt:datacmt,
                    datacmtAll:datacmtAll
                });
              });
            
          });
    });
    // get all cmt
    socket.on('show commentposts', async (data) => {
        
        await Comment.find({idposts: data.idposts}).populate('iduser','username avata coverimage').exec(function (err, datacmt) {
            if (err) return handleError(err);
            socket.emit('all commentposts', datacmt);
            
          });
    });
    //Like Post
    socket.on('Like posts to server', async (data) =>{
        console.log(data);
        if(data.action === 'like'){
            await Posts.findByIdAndUpdate(data.idposts, {$addToSet:{
                numberLike:{
                    iduserLike : data.iduser,
                    typeLike: data.typelike
                }
            }}, (err, data) => {
                if(err) {
                    res.json({
                        success: false,
                        msg: "Failed to add author"
                    });
                }else{
                    console.log('like thành công');
                };
            });
        }
        if(data.action === 'updatelike'){
            console.log("aaaaaaaaaaaaaaaa");
            await Posts.updateOne({_id: data.idposts, "numberLike.iduserLike":data.iduser},{$set:{
                "numberLike.$.typeLike": data.typelike
            }}, (err, data) => {
                if(err) {
                    res.json({
                        success: false,
                        msg: "Failed to add author"
                    });
                }else{
                    console.log('update like thành công');
                };
            });
        }
        if(data.action === 'dislike'){
            await Posts.findByIdAndUpdate(data.idposts, {$pull:{
                numberLike:{
                    iduserLike : data.iduser,
                }
            }}, (err, data) => {
                if(err) {
                    res.json({
                        success: false,
                        msg: "Failed to add author"
                    });
                }else{
                    console.log( 'dislike thành công');
                };
            });
        }
        await Posts.findOne({_id: data.idposts})
            .populate('iduser','username avata coverimage')
            .populate('idshareposts')
            .exec( async (err, x) =>{
            if(err) console.log(err);
            else{
                await Posts.populate(x, {
                  path: 'idshareposts.iduser',
                  select: 'username avata coverimage',
                  model: 'User'
              }, async (err, kq)=>{
                if(err) throw err;
                    else{
                        await io.emit('Like posts to client', {
                            id : kq._id,
                            numberlikeposts: kq.numberLike.length,
                            userlike: kq,
                        });
                    }
                });
            }
            
        });
        await Posts.findOne({_id: data.idposts}).populate('iduser','username avata').populate('numberLike.iduserLike','username avata').exec( async (err, result) => {
            if(err) {
                res.json({
                    success: false,
                    msg: "Failed to add author"
                });
            }else{
                console.log(result);
                // update notify
                result.numberLike.forEach(async (like) =>{
                    // kiểm tra user like phải có trong danh sách like của bài viết và user like không phải chủ bài viết này
                    if(String(data.iduser) === String(like.iduserLike._id) && String(data.iduser) != String(result.iduser._id)){
                        await Notification.findOne({iduser: result.iduser._id}, async (err,notify)=>{
                            if(err) throw err;
                            else{
                                if(data.action === 'like'){
                                    await Notification.findByIdAndUpdate(notify._id, {$addToSet:{
                                        listnotification:[{
                                            idPosts: data.idposts,
                                            iduserNotify: data.iduser,
                                            status: false,
                                            title: 'likeposts',
                                            typeLike: data.typelike,
                                            createdAt: new Date(),
                                            updatedAt: new Date()
                                        }]
                                    }}, async (err, kq)=>{
                                        if(err) throw err;
                                        console.log('cập nhật thông báo thành công like');
                                        // send notify
                                        await socket.broadcast.to(people[result.iduser._id]).emit('send notification to client', {
                                            sendNotify: result.iduser._id,
                                            userPosts: result.iduser.username,
                                            userLike: like.iduserLike,
                                            action: 'likeposts'
                                        });
                                        await socket.broadcast.to(people[result.iduser._id]).emit('update notify android', {
                                            action:'likeposts'
                                        });
                                    });
                                }else if(data.action === 'updatelike'){
                                    await Notification.updateOne(
                                        {
                                            _id: notify._id, 
                                            "listnotification.idPosts": data.idposts,
                                            "listnotification.iduserNotify": data.iduser
                                        }, {$set: {
                                            "listnotification.$.typeLike": data.typelike,
                                            "listnotification.$.status" : false
                                    }},  async (err, kq)=>{
                                        if(err) throw err;
                                        console.log('cập nhật thông báo thành công update');
                                        // send notify
                                        //phía web mà chưa lm nên tạm bỏ
                                        // await socket.broadcast.to(people[result.iduser._id]).emit('send notification to client', {
                                        //     sendNotify: result.iduser._id,
                                        //     userPosts: result.iduser.username,
                                        //     userLike: like.iduserLike,
                                        //     action: 'likeposts'
                                        // });
                                        // phía android
                                        await socket.broadcast.to(people[result.iduser._id]).emit('update notify android', {
                                            action:'likeposts'
                                        });
                                    });
                                }
                            }
                        });
                    }
                    // xóa thông báo khi người dùng hủy like
                    if(data.action === 'dislike'){
                        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
                        await Notification.updateOne(
                            {
                                iduser: result.iduser._id
                            }, {$pull: {
                            listnotification:{
                                idPosts: data.idposts,
                                iduserNotify : data.iduser,
                                title: "likeposts"
                            }
                        }}, (err, data) => {
                            if(err) {
                                console.log(err);
                            }else{
                                console.log("xóa thông báo cũ thành công");
                            };
                        });
                    }
                });
            }
        });
    });
    // Like Comment chưa làm
    socket.on('Like comment posts to server', async (data)=>{
        // idcmt, iduserlike, typeLike,action
    });
    // get comment from android
    // get all notification
    socket.on("get all notification", async (data)=>{
        await Notification.findOne({ iduser: data.iduser})
        .populate('listnotification.iduserNotify', 'username avata')
        .populate('listnotification.idPosts', 'iduser')
        .exec(async (err, result)=>{
            if(err) throw err;
            await Posts.populate(result, {
                path: 'listnotification.idPosts.iduser',
                select: 'username',
                model: 'User'
            }, async (err, notify)=>{
                if(err) throw err;
                await socket.emit("send all notification", notify);
            });
        });
    });
    // get update notification in android
    socket.on("get update notification", async (data)=>{
        await Notification.findOne({ iduser: data.iduser})
        .populate('listnotification.iduserNotify', 'username avata')
        .populate('listnotification.idPosts', 'iduser')
        .exec(async (err, result)=>{
            if(err) throw err;
            await Posts.populate(result, {
                path: 'listnotification.idPosts.iduser',
                select: 'username',
                model: 'User'
            }, async (err, notify)=>{
                if(err) throw err;
                console.log("Thành công android");
                await socket.emit("send update notification", notify);
            });
        });
    });
    //follow
    socket.on('followUser', async (datafollow)=>{
        console.log(datafollow);
        
        await Follow.findOne({iduser: datafollow.iduserLogin}, async (err, iduserfollow) =>{ // tìm idfolow chứa id userLogin
            if(err) throw err;
            else{
                console.log(iduserfollow);
                await Follow.findByIdAndUpdate(iduserfollow._id, {$addToSet:{// update user follow { 'listFollowing.iduserFollowing': { '$ne': datafollow.FollowUser } },
                    listFollowing:[{
                        iduserFollowing: datafollow.FollowUser
                    }] 
                }}, async (err, data) => {
                    if(err) throw err;
                    else{
                        await Follow.findOne({iduser: datafollow.FollowUser}, async (err, iduserbefollow) =>{// tìm idfolow chứa id user follow
                            if(err) throw err;
                            else{
                                console.log(iduserbefollow);
                                await Follow.findByIdAndUpdate(iduserbefollow._id, {$addToSet:{// update user Login , { 'listFollowers.iduserFollowers': { '$ne': datafollow.iduserLogin } }, cái này dùng để không bị trùng lặp trong data
                                    listFollowers:[{
                                        iduserFollowers: datafollow.iduserLogin
                                    }] 
                                }}, async (err, data) => {
                                    if(err) throw err;
                                    else{
                                        console.log("Thành công");
                                        
                                        User.findOne({_id: datafollow.iduserLogin}, async (err, result)=>{
                                            if(err) throw err;
                                            else{
                                                console.log(result);
                                                await Notification.findOne({iduser: datafollow.FollowUser}, async (err,notify)=>{
                                                    if(err) throw err;
                                                    else{
                                                        await Notification.findByIdAndUpdate(notify._id, {$addToSet:{
                                                            listnotification:[{
                                                                iduserNotify: datafollow.iduserLogin,
                                                                status: false,
                                                                title: 'follow',
                                                                createdAt: new Date(),
                                                                updatedAt: new Date()
                                                            }]
                                                        }}, async (err, kq)=>{
                                                            if(err) throw err;
                                                            console.log('cập nhật thông báo thành công');
                                                        });
                                                    }
                                                });
                                                await socket.broadcast.to(people[datafollow.FollowUser]).emit('send notification to client', {
                                                    sendNotify: datafollow.FollowUser,
                                                    userFollow:{
                                                        avata:result.avata,
                                                        username: result.username
                                                    },
                                                    action: 'follow'
                                                });
                                            }
                                        });
                                        
                                        // await socket.broadcast.to(people[result.iduser._id]).emit('update notify android', {
                                        //     action:'likeposts'
                                        // });
                                    }
                                });
                            }
                        });
                    }
                });
            };
        });
    });
    // add notification friend
    socket.on('add notication friend', async (data)=>{
        console.log(data);
        await Notification.findOne({iduser: data.friend}, async (err,notify)=>{ // tìm thông báo của id user để lấy _id
            if(err) throw err;
            else{
                await Notification.findByIdAndUpdate(notify._id, {$addToSet:{ // update thông báo id user
                    listnotification:[{
                        iduserNotify: data.iduserLogin,
                        status: false,
                        title: 'addfriend',
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }]
                }}, async (err, kq)=>{
                    if(err) throw err;
                    console.log('cập nhật thông báo thành công');
                    await Notification.findOne({ iduser: data.friend}) // lấy thông tin thông báo của id user với nhiều document 
                        .populate('listnotification.iduserNotify', 'username avata')
                        .populate('listnotification.idPosts', 'iduser')
                        .exec(async (err, result)=>{
                        if(err) throw err;
                        await Posts.populate(result, {
                            path: 'listnotification.idPosts.iduser',
                            select: 'username',
                            model: 'User'
                        }, async (err, notify)=>{
                            if(err) throw err;
                            await socket.broadcast.to(people[result.iduser._id]).emit('update notify android', {
                                action:'addfriend'
                            });
                            // thành công trả về thằng gửi lên :v
                            await socket.emit('add notification friend', {
                                action:'addfriend'
                            });
                        });
                    });
                });
            }
        });
    });
    // add new friend after reply
    socket.on('add new friend', async (datafriend)=>{
        console.log(datafriend);
        await Friend.findOne({iduser: datafriend.iduserLogin}, async (err, iduseradd) =>{
            if(err) throw err;
            else{
                console.log(iduseradd);
                await Friend.findByIdAndUpdate(iduseradd._id, {$addToSet:{
                    listFriend:[{
                        idfriend: datafriend.replyfriend
                    }] 
                }}, async (err, data) => {
                    if(err) throw err;
                    else{
                        await Friend.findOne({iduser: datafriend.replyfriend}, async (err, iduserbeadd) =>{
                            if(err) throw err;
                            else{
                                console.log(iduserbeadd);
                                await Friend.findByIdAndUpdate(iduserbeadd._id, {$addToSet:{
                                    listFriend:[{
                                        idfriend: datafriend.iduserLogin
                                    }] 
                                }}, async (err, data) => {
                                    if(err) throw err;
                                    else{
                                        console.log("update friend success!");
                                        await Notification.findOne({iduser: datafriend.iduserLogin}, async (err,notify)=>{
                                            if(err) throw err;
                                            else{
                                                console.log(notify._id);
                                                // xáo thô
                                                await Notification.findByIdAndUpdate(notify._id, { $pull: { 
                                                    listnotification: { 
                                                        iduserNotify: datafriend.replyfriend, /// vẫn chưa xóa đc
                                                        title: 'addfriend'
                                                    }
                                                }},async (err, kq)=>{
                                                    if(err) {
                                                        console.log(err+'');
                                                    }
                                                    else{
                                                        console.log("delete notication success!");
                                                    }
                                                });
                                            }
                                        });
                                        await Notification.findOneAndUpdate({iduser: datafriend.replyfriend}, {$addToSet:{
                                            listnotification:[{
                                                iduserNotify: data.iduserLogin,
                                                status: false,
                                                title: 'addfriendsuccess',
                                                createdAt: new Date(),
                                                updatedAt: new Date()
                                            }]
                                        }},async (err, kq)=>{
                                            if(err) {
                                                console.log(err+'');
                                            }
                                            else{
                                                console.log("delete notication success!");
                                                await socket.broadcast.to(people[datafriend.replyfriend]).emit('update notify android', {
                                                    action:'addfriendsuccess'
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            };
        });
        let newMess = await new Mess({
            members:[
                {iduser: datafriend.iduserLogin},
                {iduser: datafriend.replyfriend},
            ],
            content:[]
        });
        await newMess.save().then(x=>console.log("tạo chat mới thành công")).catch(err=>console.log(err+''))
        await socket.emit('add friend success', "thành công");
    });
    // chat
    socket.on('join room chat', async (data)=>{
        socket.join(data);
        console.log(io.sockets.adapter.rooms[data]);
    });
    // share posts
    socket.on('share posts to server', async (data) => {
        // idposts, iduser notification, iduserShare
        await Notification.findOneAndUpdate({iduser: data.iduser}, {$addToSet:{
            listnotification:[{
                idPosts: data.idposts,
                iduserNotify: data.iduserShare,
                status: false,
                title: 'shareposts',
                createdAt: new Date(),
                updatedAt: new Date()
            }]
        }}).then(data => console.log('share posts notify OKi')).catch(err => console.log(err + ''));
        await socket.broadcast.to(people[data.iduserShare]).emit('update notify android', {
            action:'shareposts'
        });
        console.log("thông báo đã về");
    })
});

module.exports = io;