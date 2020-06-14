$(function () {
    var socket = io();
    var SumNumberCmt = 0;
    socket.emit('chat message','helllo');
    //
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
          });
          $('#emojionearea1').data("emojioneArea").setText("");
          $('#beforeupload').html("");
          setTimeout(function(){

          });   
      };

    });
    //
    socket.on('id commentposts', async (data) => {
      if( document.getElementById("file-input").files.length != 0 ){
        var formData = new FormData();
        var imagefile = document.querySelector('#file-input');
        formData.append("imgcomment", imagefile.files[0]);
        axios.post('http://localhost:3000/admin/comment/'+data.id, formData,{id:data.id}, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
          });
          await setTimeout( async function(){ 
            await socket.emit('id getcommentposts', {id:data.id});
          }, 1000);
          $( "#file-input" ).val("");
      }else{
        await socket.emit('id getcommentposts', {id:data.id});
      };     
    });
    //get cmt from serve
    socket.on('get commentposts', (data) => {
      //
        SumNumberCmt++;
        let lines = data.document.split('\n');
        lines.splice(lines.length-2);
        let documentcmt = lines.join('\n');
      //
        let srcimg = "";
        if(data.file.image != " "){
          srcimg = '<img id="imgtextcmt" src="../../../uploads/'+data.file.image+'" alt="">';
        }else{
          srcimg = "<div></div>";
        }
        let htmlcmt="";
        htmlcmt += '<div class="commentuserposts">';
        htmlcmt += '<div class="checkuserposts" style="padding: 10px;color: #ffffff;">';
        htmlcmt +=  '<div class="avatauserposts">';
        htmlcmt +=       '<img id="imageuserpostscomment" src="../../../uploads/'+data.iduser.avata+'" alt="">';
        htmlcmt +=   '</div>';
        htmlcmt +=  '<div class="divtextcomment">';
        htmlcmt +=     ' <table>';
        htmlcmt +=       ' <tr>';
        htmlcmt +=    '  <td style="width: 95%;">';
        htmlcmt +=                 '<div class="textcomment">';
        htmlcmt +=                    '<label  id="usercmtposts">'+data.iduser.username+'</label>';
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
        htmlcmt +=        '<span><a href="#">Thích </a>- </span><span onclick="replyComment('+SumNumberCmt+')"><a href="#">Trả lời </a>- </span> <span> Time</span>';
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

    // show comment
    $('th#cmtpostsmodal').on('click', function(){

        let idpostsajax = document.getElementById('idpostsmodal').innerHTML;
        socket.emit('show commentposts', {
          idposts: idpostsajax
        });
    });
    socket.on('all commentposts', async (datascmt) => {
        SumNumberCmt = datascmt.length - 1;
        $('span#numbercmtposts').html(datascmt.length);
        for(var i = 0 ; i < datascmt.length; i++ ){
            let lines = datascmt[i].document.split('\n');
            let documentcmt="";
            if(lines.length>1){
              lines.splice(lines.length-2);
              documentcmt = lines.join('\n');
            }
            let timecreated = datascmt[i].createdAt;
            let diff = Math.abs(new Date() - new Date(timecreated));
           
          //
            let srcimg = "";
            if(datascmt[i].file.image != " "){
              srcimg = '<img id="imgtextcmt" src="../../../uploads/'+datascmt[i].file.image+'" alt="">';
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
});