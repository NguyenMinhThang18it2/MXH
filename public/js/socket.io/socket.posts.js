var socket = io();
$(function () {
    var SumNumberCmt = 0;
    let iduserabcd = document.getElementById('idthisuserlogin').innerHTML;
    socket.emit('chat message',iduserabcd);
     // show comment
     $('th#cmtpostsmodal').on('click', function(){

      let idpostsajax = document.getElementById('idpostsmodal').innerHTML;
      socket.emit('show commentposts', {
        idposts: idpostsajax
      });
    });
    // comment
    $('.newtext').on('keyup', async (event) => {
      if(event.keyCode === 13 && !event.shiftKey){
          event.preventDefault();
          let idpostsajax = document.getElementById('idpostsmodal').innerHTML;  
          let data = $('#emojionearea1').data("emojioneArea").getText();
          let iduser = document.getElementById('idthisuserlogin').innerHTML;
          await socket.emit('post commentposts', {
            idposts: idpostsajax,
            iduser: iduser,
            document: data,
            address: 'web'
          });
          $('#emojionearea1').data("emojioneArea").setText("");
          $('#beforeupload').html("");
          setTimeout(function(){

          });   
      };

    });
    //
    socket.on('id commentposts web', async (data) => {
      if( document.getElementById("file-input").files.length != 0 ){
        var formData = new FormData();
        var imagefile = document.querySelector('#file-input');
        formData.append("imgcomment", imagefile.files[0]);
        axios.post('http://localhost:3000/admin/comment/'+data.id, formData,{id:data.id}, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
          }).then(async (response)=>{
            console.log(response);
            await socket.emit('id getcommentposts', {id:data.id});
          });
          $( "#file-input" ).val("");
      }else{
        await socket.emit('id getcommentposts', {id:data.id});
      };     
    });
    //get cmt from serve
    socket.on('get commentposts', (data) => {
      //
        SumNumberCmt++;
        let lines = data.datacmt.document.split('\n');
        let documentcmt="";
        if(lines.length>2){
          lines.splice(lines.length-2);
          documentcmt = lines.join('\n');
        }else{
          documentcmt = lines.join('\n');
        }
      //
        let srcimg = "";
        if(data.datacmt.file.image != " "){
          srcimg = '<img id="imgtextcmt" src="../../../uploads/'+data.datacmt.file.imageComment+'" alt="">';
        }else{
          srcimg = "<div></div>";
        }
        let htmlcmt="";
        htmlcmt += '<div class="commentuserposts">';
        htmlcmt += '<div class="checkuserposts" style="padding: 10px;color: #ffffff;">';
        htmlcmt +=  '<div class="avatauserposts">';
        htmlcmt +=       '<img id="imageuserpostscomment" src="../../../uploads/'+data.datacmt.iduser.avata+'" alt="">';
        htmlcmt +=   '</div>';
        htmlcmt +=  '<div class="divtextcomment">';
        htmlcmt +=     ' <table>';
        htmlcmt +=       ' <tr>';
        htmlcmt +=    '  <td style="width: 95%;">';
        htmlcmt +=                 '<div class="textcomment">';
        htmlcmt +=                    '<label  id="usercmtposts">'+data.datacmt.iduser.username+'</label>';
        htmlcmt +=                   ' <span  id="textcmtuserposts" style="white-space: pre-wrap;">'+documentcmt+' </span>';
        htmlcmt +=                ' </div>';
        htmlcmt +=            '</td>';
        htmlcmt +=             '<td style="width: 5%;">';
        htmlcmt +=                 '<span id="showmenucomment"><i class="fas fa-ellipsis-h"></i></span>';
        htmlcmt +=             '</td>';
        htmlcmt +=          '</tr>';
        htmlcmt +=    ' </table>';
        htmlcmt += srcimg;
        htmlcmt +=    '<div class="replycomment">';
        htmlcmt +=        '<span><a href="#">Thích </a>- </span><span onclick="replyComment('+SumNumberCmt+')"><a href="#">Trả lời </a>- </span> <span> just now</span>';
        htmlcmt +=     '<div hidden id="replycomment'+SumNumberCmt+'">'
        htmlcmt +=      '<div class="newtextreplycomment">'
        htmlcmt +=         ' <div class="avatauserposts">'
        htmlcmt +=            '  <img id="imageuserposts" src="" alt="">'
        htmlcmt +=          '</div>'
        htmlcmt +=          '<div class="newtext">'
        htmlcmt +=             ' <textarea id="emojioneareacmt'+SumNumberCmt+'"></textarea>'
        htmlcmt +=             ' <label for="file-inputreply'+SumNumberCmt+'">'
        htmlcmt +=                  '<i style="color: #b3b2b2" class="fas fa-camera"></i>'
        htmlcmt +=             ' </label>'
        htmlcmt +=             ' <input type="file" id="file-inputreply'+SumNumberCmt+'">'
        htmlcmt +=           '   <i class="fas fa-times" id="closefileupload'+SumNumberCmt+'" hidden></i>'
        htmlcmt +=              '<div id="filereplycmt'+SumNumberCmt+'">'
        htmlcmt +=             ' </div>'
        htmlcmt +=         ' </div>'
        htmlcmt +=      '</div>'
        htmlcmt +=    '</div>'
        htmlcmt +=    '</div>';
        htmlcmt +=  ' </div>';
        htmlcmt += '</div>';
        htmlcmt += '</div>';

        $('div#showcomment').append(htmlcmt);
    });
    socket.on('all commentposts', async (datascmt) => {
        SumNumberCmt = datascmt.length - 1;
        $('span#numbercmtposts').html(datascmt.length);
        for(var i = 0 ; i < datascmt.length; i++ ){
            let lines = datascmt[i].document.split('\n');
            let documentcmt="";
            if(lines.length>2){
              lines.splice(lines.length-2);
              documentcmt = lines.join('\n');
            }else{
              documentcmt = lines.join('\n');
            }
            let timecreated = datascmt[i].createdAt;
            let diff = Math.abs(new Date() - new Date(timecreated));
           
          //
            let srcimg = "";
            if(datascmt[i].file.image != " "){
              srcimg = '<img id="imgtextcmt" src="../../../uploads/'+datascmt[i].file.imageComment+'" alt="">';
            }else{
              srcimg = "<div></div>";
            }
            let htmlcmt="";
            htmlcmt += '<div class="commentuserposts" onmouseover="displaymenucmt('+i+')" onmouseout="hiddenmenucmt('+i+')">';
            htmlcmt += '<div class="checkuserposts" style="padding: 10px;color: #ffffff;">';
            htmlcmt +=  '<div class="avatauserposts">';
            htmlcmt +=       '<img id="imageuserpostscomment" src="../../../uploads/'+datascmt[i].iduser.avata+'" alt="">';
            htmlcmt +=   '</div>';
            htmlcmt +=  '<div class="divtextcomment">';
            htmlcmt +=     ' <table>';
            htmlcmt +=       ' <tr>';
            htmlcmt +=    '  <td style="width: 95%;">';
            htmlcmt +=                 '<div class="textcomment">';
            htmlcmt +=                    '<label  id="usercmtposts">'+datascmt[i].iduser.username+'</label>';
            htmlcmt +=                   ' <span  id="textcmtuserposts" style="white-space: pre-wrap;">'+documentcmt+' </span>';
            htmlcmt +=                ' </div>';
            htmlcmt +=            '</td>';
            htmlcmt +=             '<td style="width: 5%;">';
            htmlcmt +=                 '<span hidden id="showmenucomment'+i+'"><i class="fas fa-ellipsis-h"></i></span>';
            htmlcmt +=             '</td>';
            htmlcmt +=          '</tr>';
            htmlcmt +=    ' </table>';
            htmlcmt += srcimg;
            htmlcmt +=    '<div class="replycomment">';
            htmlcmt +=        '<span><a href="#">Thích </a>- </span><span onclick="replyComment('+i+')"><a href="#">Trả lời </a>- </span> <span> '+dhms(diff)+'</span>';
            htmlcmt +=     '<div hidden id="replycomment'+i+'">'
            htmlcmt +=      '<div class="newtextreplycomment">'
            htmlcmt +=         ' <div class="avatauserposts">'
            htmlcmt +=            '  <img id="imageuserposts" src="" alt="">'
            htmlcmt +=          '</div>'
            htmlcmt +=          '<div class="newtext">'
            htmlcmt +=             ' <textarea id="emojioneareacmt'+i+'"></textarea>'
            htmlcmt +=             ' <label for="file-inputreply'+i+'">'
            htmlcmt +=                  '<i style="color: #b3b2b2" class="fas fa-camera"></i>'
            htmlcmt +=             ' </label>'
            htmlcmt +=             ' <input type="file" id="file-inputreply'+i+'">'
            htmlcmt +=           '   <i class="fas fa-times" id="closefileupload'+i+'" hidden></i>'
            htmlcmt +=              '<div id="filereplycmt'+i+'">'
            htmlcmt +=             ' </div>'
            htmlcmt +=         ' </div>'
            htmlcmt +=      '</div>'
            htmlcmt +=  '</div>'
            htmlcmt +=    '</div>';
            htmlcmt +=  ' </div>';
            htmlcmt += '</div>';
            htmlcmt += '</div>';

            $('div#showcomment').append(htmlcmt);
        };
    });
    // send event Like real time
    $('#likepostsmodal').on('click' , async (e)=>{
      let idpostsajax = document.getElementById('idpostsmodal').innerHTML;
      let iduser = document.getElementById('idthisuserlogin').innerHTML;
      let action = "";
      e.preventDefault();

      $('#buttonlikeposts').toggleClass('far').toggleClass('fas');
      if($('#buttonlikeposts').hasClass('far')){
          action = "dislike"
      }else if($('#buttonlikeposts').hasClass('fas')){
          action = "like"
      }
      // send event
      await socket.emit('Like posts to server',{
        idposts: idpostsajax,
        iduser: iduser,
        action: action,
        typelike: 0
      });
    });
    // start listen event Like post
    socket.on('Like posts to client', async (data) =>{
      if(data != ""){ 
        var datalike = data.userlike;
        var abc = 0;
        var idtblike = document.getElementById('idpostsmodal').innerHTML;
        var thisuser = document.getElementById('idthisuserlogin').innerHTML;

        let numberlike = data.numberlikeposts;
        $('span#numberlikeposts').html(numberlike);

        datalike.forEach( like => {
            if(String(like.iduserLike._id) === String(thisuser)){
                $("td#"+idtblike).attr('data-typelikenumber', 1);
                $("td#"+idtblike).attr('data-likenumber', datalike.length);
                $("td#"+idtblike).html(datalike.length);
                abc = 1;
            }
        });
        if(abc != 1){
            $("td#"+idtblike).attr('data-typelikenumber', 0);
            $("td#"+idtblike).attr('data-likenumber', datalike.length);
            $("td#"+idtblike).html(datalike.length);
        }  
     }
    });
    // end listen event Like post
    // notification
    socket.on('send notification to client', async (data)=>{
      console.log(data);
      let searchThis = document.getElementById('mCSB_3_container').innerHTML;
      await $('div#mCSB_3_container').html("");
      let iduser = document.getElementById('idthisuserlogin').innerHTML;

      let docNoify = "";
      // comment
      if(data.action === 'comment') {
       docNoify = 'Đã bình luận bài viết của <b>'+data.userPosts+'</b>';
       await data.sendNotify.forEach( async (notify) =>{
          if(notify === iduser){
            let htmlNotify = '';
            htmlNotify += '<li style="width: 100%; background: #888888";>'
            htmlNotify +=    '<a href="#">';
            htmlNotify +=       ' <div class="notification-icon">';
            htmlNotify +=         '   <img src="../../../uploads/'+data.userCmt.avata+'" alt=""style="border-radius:100%;width:100%;height:100%;margin-top: -3px">';
            htmlNotify +=        '</div>';
            htmlNotify +=        '<div class="notification-content">';
            htmlNotify +=           ' <span class="notification-date">just now</span>';
            htmlNotify +=               ' <h2>'+data.userCmt.username+'</h2>  ';
            htmlNotify +=              '  <h2></h2>  ';
            htmlNotify +=          '  <p>'+docNoify+'</b></p>';
            htmlNotify +=     '   </div>';
            htmlNotify +=  '  </a>';
            htmlNotify += '</li>';
            console.log(htmlNotify);
            await $('div#mCSB_3_container').append(htmlNotify);
            await $('div#mCSB_3_container').append(searchThis);
          }
        });

      }else if(data.action === 'likeposts'){ // like       
        docNoify = 'Đã like bài viết của bạn';
        if(String(data.sendNotify) === iduser){
            let htmlNotify = '';
            htmlNotify += '<li style="width: 100%; background: #888888";>'
            htmlNotify +=    '<a href="#">';
            htmlNotify +=       ' <div class="notification-icon">';
            htmlNotify +=         '   <img src="../../../uploads/'+data.userLike.avata+'" alt=""style="border-radius:100%;width:100%;height:100%;margin-top: -3px">';
            htmlNotify +=        '</div>';
            htmlNotify +=        '<div class="notification-content">';
            htmlNotify +=           ' <span class="notification-date">just now</span>';
            htmlNotify +=               ' <h2>'+data.userLike.username+'</h2>  ';
            htmlNotify +=              '  <h2></h2>  ';
            htmlNotify +=          '  <p>'+docNoify+'</b></p>';
            htmlNotify +=     '   </div>';
            htmlNotify +=  '  </a>';
            htmlNotify += '</li>';
            console.log(htmlNotify);
            await $('div#mCSB_3_container').append(htmlNotify);
            await $('div#mCSB_3_container').append(searchThis);
          }
      }else if(data.action === 'newposts'){ // new post
        docNoify = 'Đã đăng bài viết mới';
      }
      else if(data.action === 'follow'){
        console.log(data);
        
        docNoify = 'Đã bắt đầu theo dõi bạn';
        if(String(data.sendNotify) === iduser){
          let htmlNotify = '';
          htmlNotify += '<li style="width: 100%; background: #888888";>'
          htmlNotify +=    '<a href="#">';
          htmlNotify +=       ' <div class="notification-icon">';
          htmlNotify +=         '   <img src="../../../uploads/'+data.userFollow.avata+'" alt=""style="border-radius:100%;width:100%;height:100%;margin-top: -3px">';
          htmlNotify +=        '</div>';
          htmlNotify +=        '<div class="notification-content">';
          htmlNotify +=           ' <span class="notification-date">just now</span>';
          htmlNotify +=               ' <h2>'+data.userFollow.username+'</h2>  ';
          htmlNotify +=              '  <h2></h2>  ';
          htmlNotify +=          '  <p>'+docNoify+'</b></p>';
          htmlNotify +=     '   </div>';
          htmlNotify +=  '  </a>';
          htmlNotify += '</li>';
          console.log(htmlNotify);
          await $('div#mCSB_3_container').append(htmlNotify);
          await $('div#mCSB_3_container').append(searchThis);
        }
      }else if(data.action === 'addfriend'){
        console.log(data);
        await $('div#mCSB_3_container').html("");
        if(String(data.sendNotify) === iduser){
          let ArrNotification = data.userNotification.listnotification.reverse();
          ArrNotification.forEach(async (notify)=>{
            let htmlNotify = '';
            htmlNotify += '<li style="width: 100%; background: #888888";>'
            htmlNotify +=    '<a href="#">';
            htmlNotify +=       ' <div class="notification-icon">';
            htmlNotify +=         '   <img src="../../../uploads/'+data.userFollow.avata+'" alt=""style="border-radius:100%;width:100%;height:100%;margin-top: -3px">';
            htmlNotify +=        '</div>';
            htmlNotify +=        '<div class="notification-content">';
            htmlNotify +=           ' <span class="notification-date">just now</span>';
            htmlNotify +=               ' <h2>'+data.userFollow.username+'</h2>  ';
            htmlNotify +=              '  <h2></h2>  ';
            htmlNotify +=          '  <p>'+docNoify+'</b></p>';
            htmlNotify +=     '   </div>';
            htmlNotify +=  '  </a>';
            htmlNotify += '</li>';
            console.log(htmlNotify);
            await $('div#mCSB_1_container').append(htmlNotify);
          });
        }
      }
    });
    socket.on('add friend success', async (data)=>{
      alert(data);
    });
    // end notification 
    //FollowUser
});