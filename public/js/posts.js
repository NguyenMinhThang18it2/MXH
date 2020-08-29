    
    $('table').on('click', '#checkposts', async function () {
        
        var $tr = $(this).closest('tr');
        var idposts = $tr.find('td[data-postsid]').data('postsid');
        var username = $tr.find('td[data-username]').data('username');
        var avatauser = $tr.find('td[data-avatauser]').data('avatauser');
        var document = $tr.find('td[data-document]').data('document');
        var likenumber = $tr.find('td[data-likenumber]').data('likenumber');
        var typelikenumber = $tr.find('td[data-typelikenumber]').data('typelikenumber');
        var cmtnumber = $tr.find('td[data-cmtnumber]').data('cmtnumber');
        var image = $tr.find('td[data-image]').data('image');
        var video = $tr.find('td[data-video]').data('video');
        var update = $tr.find('td[data-update]').data('update');
        var diff = Math.abs(new Date() - new Date(update));
        // alert(avatauser);
        await socket.emit('join room cmt',idposts);
        if(typelikenumber === 0){
            if($('i#buttonlikeposts').hasClass('fas')){
                $('i#buttonlikeposts').removeClass('fas');
                $('i#buttonlikeposts').addClass('far');
            }
        }else if(typelikenumber === 1){
            if($('i#buttonlikeposts').hasClass('far')){
                $('i#buttonlikeposts').removeClass('far');
                $('i#buttonlikeposts').addClass('fas');
            }
        };
        // alert(username + " " + document+ " " + image+ " " + video+ " " + cmtnumber);
        // $('h5.modal-title').html('Edit Admin Data: '+username);
        $('img#imageuserposts').attr('src','../../../uploads/'+avatauser);
        $('#idpostsmodal').html(idposts);
        $('#editnameposts').html(username);
        $('#timeposts').html(dhms(diff));
        $('#documentpost').html(document);
        $('#numberlikeposts').html(likenumber);
        $('#numbercmtposts').html(cmtnumber);
        // $('img#imageuserposts').attr('src' , '../../../uploads/'+image);
        if(image){
            $('div#balabala').html('<img src="../../../uploads/'+image+'" alt="">');
        };
        if(video.length > 5){
            $('div#balabala').html('<video id="playvideoposts" width="320" height="240" controls autoplay><source src="../../../uploads/'+video+'" type="video/mp4"></video>');
        };
        
        // document.getElementById("myImg").src = "hackanm.gif";
        
    });
    //
    $('#exampleModalposts').on('shown.bs.modal', function () {
        $('#playvideoposts')[0].play();
        $('#playvideotable')[0].pause();
        
    });
    $('#exampleModalposts').on('hidden.bs.modal', function () {
        let idpostsajax = document.getElementById('idpostsmodal').innerHTML;  
        socket.emit('leave room cmt', idpostsajax);
        $('div#showcomment').html("");
        $('#playvideoposts')[0].pause();
        // $('#playvideotable')[0].play();
    });
    // edit 
    $('table').on('click', '#editbuttonposts', function () {
        
        var $tr = $(this).closest('tr');
        var postsid = $tr.find('td[data-postsid]').data('postsid');
        var document = $tr.find('td[data-document]').data('document');
        // alert(username + " " + iduser+ " " + email+ " " + password);

        // $('h5.modal-title').html('Edit Admin Data: '+username);
        // $('#editname').val(username);
        // $('#editemail').val(email);
        $('#editdocument').val(document);

        $("form#formEdit").attr('action', window.location.href+'/update/'+postsid);
    });  
    // get time posts
    function dhms(t) {
        w = Math.floor(t / (1000 * 60 * 60 * 24 * 7)),
        d = Math.floor(t / (1000 * 60 * 60 * 24)),
        h = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        m = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60)),
        s = Math.floor((t % (1000 * 60)) / 1000);
        if(w>0) return w + ' week ago ';
        else if(d>0) return d + ' day ago';
        else if(h>0) return h + ' hour ago';
        else if(m>0) return m + ' minute ago';
        else if(s>0) return 'just now';
    }
    // EmojioneArea
    // see file before upload
    function readURL(input) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function(e) {
                let abc1 = input.files[0].name.split('.');
                let abc2 = abc1[1];
                if(abc2 === 'jpg' || abc2 === 'jpeg' || abc2 === 'png' || abc2 === 'what' || abc2 === 'ever'){
                    $('#beforeupload').html('<img id="fileclose" src="'+e.target.result+'" alt="" width="50%"/>');
                }
                else{
                    $('#beforeupload').html('<video id="fileclose" width="320" height="240" controls><source  src="'+e.target.result+'" type="video/mp4"></video>');
                }
            }
            reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
    }
      
    $("#file-input").change( function() {
        readURL(this);
    });
    
    $(function(){
        $('div#beforeupload, #closefileupload').hover(function(){
            $('#closefileupload').show(); 
        }, function(){
            $('#closefileupload').hide();
        });
    });
    $('#closefileupload').on('click', function(e){
        $('#beforeupload').html("");
    });
    //
    $(document).ready(function() {
        $("#emojionearea1").emojioneArea({
            pickerPosition: "top",
            tonesStyle: "bullet",
            emojiPlaceholder: ":smile_cat:",
            placeholder: "Type something here",
            filtersPosition: "bottom",
            hidePickerOnBlur: false
        });
    });
//
    function displaymenucmt(val){
        $('span#showmenucomment'+val).show();
    };
    function hiddenmenucmt(val){
        $('span#showmenucomment'+val).hide();
    };
    // reply comment
    function replyComment(val){
        $('div#replycomment'+val).show();
        $('#emojioneareacmt'+val).emojioneArea({
            pickerPosition: "top",
            tonesStyle: "bullet",
            emojiPlaceholder: ":smile_cat:",
            placeholder: "Type something here",
            filtersPosition: "bottom",
            hidePickerOnBlur: false
        });
        $('#file-inputreply'+val).change(function() {
            readURLreplycmt(this, val);
        });
        $('div#filereplycmt'+val+' , #closefileupload'+val).hover(function(){
            $('#closefileupload'+val).show(); 
        }, function(){
            $('#closefileupload'+val).hide();
        });
        $('#closefileupload'+val).on('click', function(e){
            $('#filereplycmt'+val).html("");
        });
    };
    function readURLreplycmt(input, val) {
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function(e) {
                let abc1 = input.files[0].name.split('.');
                let abc2 = abc1[1];
                if(abc2 === 'jpg' || abc2 === 'jpeg' || abc2 === 'png' || abc2 === 'what' || abc2 === 'ever'){
                    $('#filereplycmt'+val).html('<img id="fileclose" src="'+e.target.result+'" alt="" width="50%"/>');
                }
                else{
                    $('#filereplycmt'+val).html('<video id="fileclose" width="320" height="240" controls><source  src="'+e.target.result+'" type="video/mp4"></video>');
                }
            }
            reader.readAsDataURL(input.files[0]); // convert to base64 string
        }
    }
    // upload file cmt
