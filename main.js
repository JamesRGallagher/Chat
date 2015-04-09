$("textarea").keyup(function(e) {
    $(this).height(1);
    $(this).height(this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth")) - 30);
});
    //A global - holds the users email
  //  var user_email = "{{ aek.campusm_user_email }}";
    //A global - holds the signalR chat instance
    var chat;
    var threads = [];
    console.log('[VERSION 1]')
    function customURL(url) {
       var page;
       try {
           page = window.parent.CampusM.page;
       } catch (e) {}
       if (page) {
           page.customURL(url);
       } else {
           location.href = url;
       }
   }
   
      

     var current;
     var filter;
     var backstack = [];
     
      
    
    
         /**
    * infolog
    * simple way to turn debug logs
    * on and off
    * takes a message
    */   
    function infolog(msg){
      
    if(ChatModule.getDebug()){
         console.log(msg)
      }
    }
      
    function parseDate(date){
      dateMsg = moment(date).fromNow();
      if(dateMsg == "in a few seconds"){
        dateMsg = "just now"
      }
      return dateMsg;
       
    }
      
      
    function clickedOldMessages(){
       console.log('clicked')
       $('#getOld').remove()
       $('#getOldHolder').append('<img style="display: block; margin:0 auto; width:30px; height:30px;"id="oldSpinner" src="https://portal.ombiel.co.uk/assets/LancasterStudents/AET_Files/712.GIF" />')
       console.log(chat.server.getOldMessages)
       console.log(ChatModule.getChatName())
         console.log(ChatModule.getLastMessageID())
       chat.server.getOldMessagesByID(ChatModule.getChatName(), ChatModule.getLastMessageID())
       infolog("called")
      }
      
    /**
    * getParam 
    * takes a paramater name as a string
    * retuns the value of the param
    *
    * THIS IS NOW IN THE AEK SCREEN
     
    function getParam ( sname ) {
      var room = "{{roomID}}";
      if(!room){
        room = "Lobby"
      }
      return room;
    }  */   
    /**
    * containsObject 
    * returns boolean
    * checks if object is in array
    */   
    function containsObject(obj, list) {   
        var x;
        for (x in list) {
            if (list.hasOwnProperty(x) && list[x] === obj) {
                return true;
            }
        }
        return false;
    }    
    /**
    * createAvatar 
    * takes message id - users name, and a size
    * creates an avatar and returns the canvas object it's on
    */ 
    function createAvatar(messageID, name, size,photo) {
      //console.log('phiti',photo)

      if(photo){
         console.log('photo isnt null')
         var canvas = document.getElementById(messageID).firstElementChild;
         var ctx = canvas.getContext("2d");

         var image = new Image();
         image.src = "data:image/  png;base64,"+photo;
         image.onload = function() {
         ctx.drawImage(image, canvas.width / 2 - image.width / 2,canvas.height / 2 - image.height / 2,image.width,image.height);
        //ctx.drawImage(image,0,0,canvas.width / 2 - image.width / 2,canvas.height / 2 - image.height / 2,0,100,30,30);
         };

      return canvas;
      }
        console.log('Photo is null')


        var canvas = document.getElementById(messageID).firstElementChild;
        console.log(canvas)
        var colours = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
        if (name.indexOf(' ') >= 0) {
            nameSplit = name.split(" "),
            initials = nameSplit[0].charAt(0).toUpperCase() + nameSplit[1].charAt(0).toUpperCase();
        } else {
            initials = name.charAt(0).toUpperCase();
        }
        var charIndex = initials.charCodeAt(0) - 65, colourIndex = charIndex % 19;
        infolog(canvas)
        var context = canvas.getContext("2d");
        var canvasWidth = size,canvasHeight = size,canvasCssWidth = canvasWidth,canvasCssHeight = canvasHeight;
        if (window.devicePixelRatio) {
            $(canvas).attr("width", canvasWidth * window.devicePixelRatio);
            $(canvas).attr("height", canvasHeight * window.devicePixelRatio);
            $(canvas).css("width", canvasCssWidth);
            $(canvas).css("height", canvasCssHeight);
            context.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
         context.fillStyle = colours[colourIndex];
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.font = "20px Arial";
      context.textAlign = "center";
      context.fillStyle = "#FFF";
        context.fillText(initials, canvasCssWidth / 2, canvasCssHeight / 1.5);

      return canvas;
      }
   
    /**
    * initialiseConnection
    * called right at the start
    * initialises the signalR connection
    */ 
    function initialiseConnection(){
      infolog("initialising connection...")
      $.connection(ChatModule.getConnectionURL())
      chat = $.connection.chat; //initialise the chat connection
      $.connection.hub.url = ChatModule.getConnectionURL();     
        infolog('connection.hub.start')   
        $.connection.hub.qs = {
            "token": document.getElementById('token').value
        };   
        $.connection.hub.start({
            jsonp: false
        })
        .done(function () {
         infolog('connected...')
         console.log("Going to get chat name")
         $("#chatWindow").val("Connected \n");
         chat.state.currentChatRoom = ChatModule.getChatName();
          console.log(":)")
                console.log(chat.state.currentChatRoom)
         var name = $("#txtNickName").val();
         
         chat.server.joinRoom(ChatModule.getChatName())
         .done(function (e) {
                infolog('joined room...')
         })
         .fail(function(e){ 
               infolog("E:" + e)
               infolog(e.stack)
               infolog(e)
            });       
        })
        .fail(function (e) {
            infolog(e)
        });
    }

    /**
    * configureUI
    * called right at the start
    * binds key presses, button clicks etc
    * configures toastr
    */ 
    function configureUI(){
      infolog("configureing the UI...")
      //Bind the keypress of Enter to be send
        $(document).keypress(function (e) {
            if (e.which == 13) {
               e.preventDefault();
                $("#submitmsg").click();
              
            }
        });
        //set the toastr options.
        toastr.options = {
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "positionClass": "toast-top-full-width",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut",
        };
        //Define submit message behaviour
        $("#submitmsg").click(function () {
            if ($("#messageTextBox").val()) {  
               chat.server.send($("#messageTextBox").val(), ChatModule.getChatName())
                 if(filter){ 
                    $("#messageTextBox").val(filter+":")
                 } else {
                    $("#messageTextBox").val("")
                 }
               // document.getElementById('submitmsg').scrollIntoView(false);
            }
        });
        
    //  console.log( "$('#getOld')")
      //  console.log( $('#getOld'))
        //$('#getOld').click(function() {
 // alert( "Handler for .click() called." );
//});
          //  alert('hi')
            //console.log('clicked')
            //$('#getOld').remove()
            //infolog(chat.server.getOldMessages)
            //chat.server.getOldMessages(ChatModule.getChatName(), ChatModule.getLastMessageDate())
            //infolog("called")
    //   })
    }

    /**
    * configureClientMethods
    * creates and binds all the methods
    * the server calls on us.
    * each is documented
    */ 
    function configureClientMethods()  {
      infolog("configureing client methods...")
      //Server calls us with the name of a chatroom
      chat.client.addChatRoom = function (chatRoom) { 
         //if the callback chatroom is the current chatroom,
            if (chatRoom == ChatModule.getChatName()) { 
                //TODO: Handle UI name
            } else {
                //TODO: Handle UI name
            }
        }       

        //Server calls when a new user is connected
        chat.client.onNewUserConnected = function (room, user) {
              infolog('New User Connected')
              ChatModule.addUserToRoom(user);
        }     

        //Server calls when a new message is added
        chat.client.addMessage = function (room, msgDetail) {
            infolog("------ Message Details --------")
            infolog(msgDetail)
            addMessageToChatWindow(msgDetail.Message, msgDetail.DisplayName, msgDetail.FromID, msgDetail.Id, ChatModule.getChatName(), "addMessage",msgDetail.MessageTime)
            
        }

        //Server calls with old messages
        chat.client.onOldMessages = function (id, name, userInRoom, messagesInRoom) {
            infolog("messagesInRoom")
            infolog(messagesInRoom)
             
            for (var i = 0; i < messagesInRoom.length; i++) {
                ChatModule.setLastMessageID(messagesInRoom[messagesInRoom.length-1].Id)
                 
                addMessageToChatWindow(messagesInRoom[i].Message, messagesInRoom[i].DisplayName, messagesInRoom[i].FromID, messagesInRoom[i].Id, chat, "onOldMessages",messagesInRoom[i].MessageTime);
            }    
            $('#oldSpinner').remove()
            if (messagesInRoom.length == 0){
                $(".commentArea").prepend('<h3 class="center">Sorry, nothing more here.</h3>')
            } else {               
                $(".commentArea").prepend('<button id="getOld" onclick="clickedOldMessages()">Get Older</button>')            
            }      
        }

        //Server calls when we are connected to the room
        chat.client.onRoomConnected = function (id, name, usersInRoom, messagesInRoom) {
            alert("This Version")
            $(window).bind('beforeunload', function (e) {
                chat.server.leaveRoom(ChatModule.getChatName())
            });
            //$('#usersInRoom').html(usersInRoom.length + " users in the room")
            infolog("--------Messages In Room:-------")
            infolog(messagesInRoom)
            infolog("--------Users In Room:-------")
            infolog(usersInRoom)

            
            if(messagesInRoom.length < 1){
              $('#loadContainer').html('');
              }
            for (var i = 0; i < usersInRoom.length; i++) {
                infolog('Adding User')
                ChatModule.addUserToRoom(usersInRoom[i])
            }
            if(messagesInRoom.length == 0){
               if ($('#spinner').length) {
                  $(".commentArea").html('<h1 id="noMsg" style = "margin: 0 auto; text-align:center;">No messages yet :(</h1><br><br>');
               }
            }
            for (var i = 0; i < messagesInRoom.length; i++) {
               // alert("adding message from "+messagesInRoom[i so the ideaWell].DisplayName+" sayying "+messagesInRoom[i].Message)
                addMessageToChatWindow(messagesInRoom[i].Message, messagesInRoom[i].DisplayName, messagesInRoom[i].FromID, messagesInRoom[i].Id, chat, "onRoomConnected",messagesInRoom[i].MessageTime);
                ChatModule.setLastMessageID(messagesInRoom[0].Id)
            }
            var me = ChatModule.getMe();
           console.log('EMEMEMEMMMEMEMEMMEM',me)
            
         /*   if(!me.Bio || !me.DisplayName){
                //alert('no b')
                 var url = 'campusm://loadaek?toolbar=AEK7772&_action=chat&room='+ChatModule.getChatName()+'&return=AEK6273' 
        var page;
       try {
           page = window.parent.CampusM.page;
       } catch (e) {}
       if (page) {
           page.customURL(url);
       } else {
           location.href = url;
       }
            }*/
            document.getElementById("base").className = "inputArea";
            //document.getElementById('base').scrollIntoView(false);
        }
        //Server calls to tell us what room we are in
        chat.client.roomsIAmIn = function (id, rooms) {//This gives us the USER id and a list of rooms they are in.
            infolog('chat.client.roomsIAmIn')
            ChatModule.setMyId(id);
            infolog(rooms)
            for (var i = 0; i < rooms.length; i++) { //for each room the current user is in, append it to the navigation drawer
                $("#menuList").append('<li><a class="navItem" href="#">' + rooms[i] + '</a></li>');
            }
            $('.menu-link').bigSlide(); //init nav drawer
        }
   }

   function appendLeftMessage(messageID,from,msg,date,hasTag)   {
      if(!hasTag){
      var x = "<span><span class='msgDate '>"+from+", "+parseDate(date)+"</span>"+"<div class=\"container2\"  id=\"" + messageID + "\"><canvas class=\"iconDetailsl\"></canvas><div style=\"margin-left:60px;word-wrap: break-word;\"><p class=\"triangle-border L left\">" + msg + "</p></div></div></span>";
           // var x ="<div class=\"container2\"  id=\"" + messageID + "\"><canvas class=\"iconDetailsl\"></canvas><div style=\"margin-left:60px;word-wrap: break-word;\"><p class=\"triangle-border L left\"><span class='msgDate'>"+parseDate(date)+"</span><br><b>" + from + ":   </b>" + " " + msg + "</p></div></div>";
      } else{
            var x = "<span class='"+hasTag+"'><span class='msgDate "+hasTag+"'>"+from+", "+parseDate(date)+"</span>"+"<div class=\"container2\"  id=\"" + messageID + "\"><canvas class=\"iconDetailsl\"></canvas><div style=\"margin-left:60px;word-wrap: break-word;\"><p class=\"triangle-border L left\">" + msg + "</p></div></div></span>";
        
        }
        
        $(".commentArea").append(x); 
     if(filter){
       $('#commentArea').children('span').each(function () {
       console.log($(this).attr("class"))
         //if this contains a hashtag
        if($(this).attr("class") && $(this).attr("class").indexOf(filter) > -1){
          console.log("To Show:");
          console.log(this);
         } else {
          $(this).hide();
           console.log($(this))
         }
    }); 
        }
   }

   function prependLeftMessage(messageID,from,msg,date,hasTag){
      //if($('#getOld').length()){
          //  $('#getOld').remove();
        //}
           if(!hasTag){
      var x = "<span><span class='msgDate'>"+from+", "+parseDate(date)+"</span>"+"<div class=\"container2\"  id=\"" + messageID + "\"><canvas class=\"iconDetailsl\"></canvas><div style=\"margin-left:60px;word-wrap: break-word;\"><p class=\"triangle-border L left\">" + msg + "</p></div></div></span>";
       
             } else{
                     var x = "<span class='"+hasTag+"'><span class='msgDate "+hasTag+"'>"+from+", "+parseDate(date)+"</span>"+"<div class=\"container2\"  id=\"" + messageID + "\"><canvas class=\"iconDetailsl\"></canvas><div style=\"margin-left:60px;word-wrap: break-word;\"><p class=\"triangle-border L left\">" + msg + "</p></div></div></span>";
               
            }
     
     
      $(".commentArea").prepend(x);
      if(filter){
     $('#commentArea').children('span').each(function () {
       console.log($(this).attr("class"))
         //if this contains a hashtag
        
        if($(this).attr("class") && $(this).attr("class").indexOf(filter) > -1){
          console.log("To Show:");
          console.log(this);
         } else {
          $(this).hide();
           console.log($(this))
         }
    }); 
     }
   }

   function appendRightMessage(messageID,msg,date,hasTag) {
           if(!hasTag){
      var x = "<span><div class=\"container2\" id=\"" + messageID + "\"><canvas id=\"myProPic\" class=\"iconDetailsr\"></canvas><div style=\"margin-right:60px;word-wrap: break-word;\"><p class=\"triangle-border R right\">"+ msg + "</p></div></div></span>";

             } else {
      var x = "<span class='"+hasTag+"'><div class=\"container2\" id=\"" + messageID + "\"><canvas id=\"myProPic\" class=\"iconDetailsr\"></canvas><div style=\"margin-right:60px;word-wrap: break-word;\"><p class=\"triangle-border R right\">"+ msg + "</p></div></div></span>";
               
               
               }
           $(".commentArea").append(x);  
     if(filter){
     $('#commentArea').children('span').each(function () {
       console.log($(this).attr("class"))
         //if this contains a hashtag
        if($(this).attr("class") && $(this).attr("class").indexOf(filter) > -1){
          console.log("To Show:");
          console.log(this);
         } else {
          $(this).hide();
           console.log($(this))
         }
    }); 
     }
   }

   function prependRightMessage(messageID,msg,date,hasTag)   {
      //if($('#getOld').length()){
          //     $('#getOld').remove();
        //}
           if(!hasTag){
      var x = "<span><div class=\"container2\" id=\"" + messageID + "\"><canvas id=\"myProPic\" class=\"iconDetailsr\"></canvas><div style=\"margin-right:60px;word-wrap: break-word;\"><p class=\"triangle-border R right\">"+ msg + "</p></div></div><span>";

             } else {
                     var x = "<span class='"+hasTag+"'><div class=\"container2\" id=\"" + messageID + "\"><canvas id=\"myProPic\" class=\"iconDetailsr\"></canvas><div style=\"margin-right:60px;word-wrap: break-word;\"><p class=\"triangle-border R right\">"+ msg + "</p></div></div></span>";
              }
           $(".commentArea").prepend(x); 
     if(filter){
    $('#commentArea').children('span').each(function () {
       console.log($(this).attr("class"))
         //if this contains a hashtag
        if($(this).attr("class") && $(this).attr("class").indexOf(filter) > -1){
          console.log("To Show:");
          console.log(this);
         } else {
          $(this).hide();
           console.log($(this))
         }
      }); 
  
      }
       }
      
   function search(nameKey, myArray){
      console.log("nameKey",nameKey)
      console.log("myArray",myArray)
      for (var i=0; i < myArray.length; i++) {
         console.log("myArray[i].UserID",myArray[i].UserID)
          if (myArray[i].UserID == nameKey) {
            console.log('found')
              return myArray[i];
          //} else {

            //    return  {DisplayName:"Chat User", Photo64:null,Bio:"Not Set"};
          }
      }
   }
   function createModal(userId,messageID,from,uid) {
      var user = search(userId,ChatModule.getUsersInRoom())
      console.log(user.Bio)
      var bio = user.Bio || "This user does not currently have a bio :("
      var anchorString = '<a style="display:none;" href="#modal' + userId + '" rel="' + messageID + '"></a>';
      var modalProfilePic = '<div class="img-circular" "></div>';
      //if the modal for this user does not already exist
      if (!$('#modal' + userId).length) {
         //build it 
         var modalWindow = '<div class="modalWindow" id="modal' + userId + '"><div class="canvasHolder" id = "canvasHolder' + userId + '"><canvas id="modalCanv" class="modalCanv" ></canvas></div><br> <b>Name:</b>' + ' ' + from + ' <br><br>'+bio+'<br><br><input type="button" value="Block this user" onclick="ChatModule.blockUser('+userId+')"> </div>';
         //and append it!
         $(".commentArea").append(modalWindow);
            
            createAvatar("canvasHolder" + userId, from, 75,uid);
        }
        $(".commentArea").append(anchorString);
        //This is initially hidden until the profile picture is clicked.
        $("a[rel*=" + messageID + "]").leanModal();
   }
   

      
       function isBlocked(id){
          arr = ChatModule.getBlockedUsers();
           for(i=0;i<arr.length;i++){
               if(arr[i] == id){
                 return true;
                 }
             }
          return false
          }

   //**Takes a message and sender, and appends it to the thread of messages in the current chat window**//
    function addMessageToChatWindow(msg, from, id, messageID, chat, type,date) {
       var hasTag =0;
       if($('#noMsg').length){
         
         $('#noMsg').remove();
         
       }
        if(isBlocked(id)){
          console.log('this user has been blocked')
          return;
          }
      

        var tagslistarr = msg.split(' ');
        var added=[];
        $.each(tagslistarr,function(i,val){
          if(tagslistarr[i].indexOf('#') == 0){
                       tagslistarr[i] =  tagslistarr[i].substr(0, tagslistarr[i].indexOf(':')); 

              tagslistarr[i]=tagslistarr[i].replace(':','')
          threads.push(tagslistarr[i]);
            threads = $.unique(threads);
            hasTag = tagslistarr[i];
             var x = document.getElementById("threadDD");
            var txt = "";
            var i;
            for (i = 0; i < x.length; i++) {
                  txt = txt + "\n" + x.options[i].text;
            }
           
            if(txt.indexOf(hasTag) < 0){
              
              $('#threadDD').append('<option>'+hasTag+'</option>');
              }
         
            
            }
        });
      
      
         
     

      
    
      
    
        console.log('adding message')
         var fromUserObj = search(id, ChatModule.getUsersInRoom());

        console.log('user obj')
        console.log(fromUserObj)
        if(fromUserObj){
            if (fromUserObj.DisplayName == null || fromUserObj.DisplayName == undefined) {
             from = "Chat User";
         } else {
          from = fromUserObj.DisplayName
        }
        } else {
from = "Chat User";
        
        }
        

        //if we are showing the loading spinner
        if ($('#spinner').length) {
            $(".commentArea").html('');
            $(".commentArea").append('<span id="getOldHolder" style="width:100%"><button id="getOld" onclick="clickedOldMessages()">Get Older</button></span>')
        }   
        //If message from this user
        if (id == ChatModule.getMyId()) {       
         //If first load or new message
         if (type != "onOldMessages") {         
                          appendRightMessage(messageID,msg,date,hasTag);
                          createAvatar(messageID, from, 33,fromUserObj.Photo64)                       
         } else { //If old message     
            prependRightMessage(messageID,msg,date,hasTag)
                                createAvatar(messageID, from, 33,fromUserObj.Photo64)     
         }
      } else { // If messge is from another user     
           
           if (type != "onOldMessages") { //If first load or new message 
               
                createModal(id, messageID, from,fromUserObj.Photo64)
                appendLeftMessage(messageID,from,msg,date,hasTag)
            
                
                    var canvas = createAvatar(messageID, from, 33,fromUserObj.Photo64) 
                  canvas.addEventListener('click', function () {
                
                  $("a[rel*=" + messageID + "]").click();
                      infolog("Clicked")
                  }, false);
            
         

         } else { //This is an old message
            
            createModal(id, messageID, from,fromUserObj.Photo64)
                prependLeftMessage(messageID,from,msg,date,hasTag)
                var canvas = createAvatar(messageID, from, 33,fromUserObj.Photo64)       
                canvas.addEventListener('click', function () {
                
                $("a[rel*=" + messageID + "]").click();     
                        infolog("Clicked")
                }, false); 
            }
      }
        //if the messages aren't being displayed onload (it's a new message)
        console.log(';;')
        console.log(from)
        console.log(ChatModule.getMyId())
        if (type != "onRoomConnected" && type != "onOldMessages" && id != ChatModule.getMyId() ) {

        
            
            //document.getElementById('base').scrollIntoView(false);
            
            if (id != ChatModule.getMyId) {
                
                toastr.options.onclick = function () {
                  //  document.getElementById('base').scrollIntoView(false);
                };
                
                //trim the message accordingly
               if (msg.length > 15) {
                  x = msg.substring(0, 15) + "...";
               } else {
                  x = msg
               }
               
            //   toastr.info('New Message: ' + x);
               x = "";
            
            }
            
        } else {
            //Otherwise if the messages are being shown on initial load, scroll to the textbox
            //document.getElementById('base').scrollIntoView(false);
        }
      
      //var height = window.innerHeight ||html.clientHeight  || body.clientHeight  || screen.availHeight;
      var distanceFromBottom = $(document).height() - $(window).height() - $(document).scrollTop();
      console.log("scroll",distanceFromBottom)
        if(distanceFromBottom < 300){
                console.log('scroleld')
                 document.getElementById('base').scrollIntoView(false);

        }
        
    }
      
      $.connection.hub.reconnecting(function() {
    tryingToReconnect = true;
});

$.connection.hub.reconnected(function() {
    tryingToReconnect = false;
});
    function configureHubMethods(){
      $.connection.hub.error(function (error) {
            toastr.error('Error. Please refresh the screen, If this persists please contact iLancaster');
            infolog(error)
        });
        $.connection.hub.connectionSlow(function () {
            toastr.warning('We have identified you are on a slow connection, for best experience please use WiFi!');
        });
        $.connection.hub.disconnected(function () {
            toastr.error('Disconnected. Please refresh the screen to conect, If this persists please contact iLancaster');
             window.setInterval(function () {
            infolog("refresh")
            $.connection.hub.start({
                  jsonp: false
            })
         }, 10000);
        });
    }
     
    function displayMyPic(){

        console.log(ChatModule.getMe())
        if(document.getElementById('myPicture')){
        document.getElementById('myPicture').style.backgroundImage = "url(data:image/gif;base64,"+ChatModule.getMe().Photo64 + ")";
        }
       if(document.getElementById('drawerName')){
          document.getElementById('drawerName').innerHTML = ChatModule.getMe().DisplayName + '<br> <h4>'+ChatModule.getMe().Bio+'</h4>' ;
        }
        
    }
 


    //All starts here
    $(document).ready(function () {
      aek.fullscreenModalWindow();
      $('textarea').keyup(function (e) {
    var rows = $(this).val().split("\n");
    $(this).prop('rows', rows.length);
});
       $('.menu-link').bigSlide({'easyClose':true});
         $('.menu-link').click(displayMyPic)
      infolog('The document is ready, we are going to join the room:')
        infolog(ChatModule.getChatName())  
          
        
        initialiseConnection()
        configureUI()
        configureClientMethods()
        configureHubMethods() 
      
         
      //Run on chat load, first function (start here!)
        if (window.jQuery) {
            infolog('jquery inclided')
        } else {
            infolog('no jquery :(')
        }
         
         infolog("--------Server Functions:-------");
        infolog(chat.server)
        infolog("--------Client Functions:-------");
        infolog(chat.client)       
    
    });
      
      
   function restoreSideMenu(){
      console.log("GOING BACK")
        console.log(backstack)
     // backstack.pop();
     console.log(backstack)
     console.log(backstack)
      document.getElementById('menuHolder').innerHTML = '';
     if(backstack.length> 0){
       console.log("Here")
         console.log( backstack[backstack.length-1])
      document.getElementById('menuHolder').innerHTML = backstack[backstack.length-1];
       backstack.pop()
      
     } else {
        document.getElementById('menuHolder').innerHTML='';
        document.getElementById('menuHolder').innerHTML = window.sideMenu;
       backstack.pop()
        }
     console.log("[NS] current backstack length"+backstack.length)
       

       if($('#UserPage')){

         
         console.log($('#UserPage'))
         var uir = ChatModule.getUsersInRoom();
     for (var t=0;t<uir.length;t++){
       if(uir[t].Active){
        var td;
        td = document.getElementById('userInRoom'+t);
        if (typeof window.addEventListener==='function' && td){
                td.addEventListener('click',function(){
                  
                  //get this usr
                  user = ChatModule.getUsersInRoom()[this.id.replace(/\D/g,'')];
                  //add back bar
                  userPageHtml = '<a onclick="restoreSideMenu()"><i style="color:white; font-size:20px;"class="fa fa-chevron-left"></i></a>' + this.id.replace(/\D/g,'');
               
                  userPageHtml +='<div id="theirPicture'+user.UserID+'" class="img-circular" ></div>';
                  userPageHtml +='<h2 style="color:white;text-align:center;">'+user.DisplayName+'</h2>';
                  
                  userPageHtml +='<h3 style="color:white;text-align:center;">'+user.Bio+'</h3>';

                  userPageHtml +='<button onclick="initPrivateChat('+user.UserID+')" class="slideMenuItem">Private chat with '+user.DisplayName+'</button>'
                  
                  
                 
                  
                 
     
                  console.log(userPageHtml)
                   console.log("ABOUT TO MAKE A NEW PAGE!")
                  SlideOut.newSliderPage(userPageHtml) 
                    
                  document.getElementById('theirPicture'+user.UserID).style.backgroundImage = "url(data:image/gif;base64,"+user.Photo64 + ")";
                    
            })}
           } 
        }
         
         
         }
           $("#updateButton").on('click',function(){
        console.log("update!")
        var url = 'campusm://loadaek?toolbar=AEK7772&_action=chat&room='+ChatModule.getChatName()+'&return=AEK6273' 
        var page;
       try {
           page = window.parent.CampusM.page;
       } catch (e) {}
       if (page) {
           page.customURL(url);
         return
       } else {
           location.href = url;
         return
       }
        return
      })
        
        
        
       $("#usersInRoomHolder").on('click',function(){

         createListModal();
       })
            $("#threadsMenuOption").on('click',function(){
              var threadPageHtml;
                  threadPageHtml = '<a onclick="restoreSideMenu()"><i style="color:white; font-size:20px;"class="fa fa-chevron-left"></i></a><button onclick="filterThreads(\'all\')" " class="slideMenuItem">#All</button>';
              threadPageHtml+='<h2 style="color:white"></h2>'
         
                
                for(i=0;i<threads.length;i++){

 (function(index) {
                        console.log('iterator: ' + index);
                    threadPageHtml  += '<button onclick="filterThreads('+index+')" " class="slideMenuItem">'+threads[i]+'</button>';
                      })(i);
              
              
          
            }
        SlideOut.newSliderPage(threadPageHtml) 
        
        });
   }

         
         
         
         
         
         
         
         
    function filterThreads(id){
      
      if(id == 'all'){
        filter = 0;
        $('#commentArea').children('span').each(function () {
       
       $(this).show();
          $('#menuA').click();
         window.scrollTo(0,document.body.scrollHeight);
         });
       return;
      }
      
       
      
      console.log("Hello"+id);
      filter = threads[id];
      
      var toShow = filter + ':';
     
     
      $('#messageTextBox').val(toShow);

        
      
      console.log('Here')
      $('#menuA').click();
      console.log($('.commentArea'))
     $('#commentArea').children('span').each(function () {
       
       $(this).show();
       
       
       console.log($(this).attr("class"))
         //if this contains a hashtag
        if($(this).attr("class") && $(this).attr("class").indexOf(filter) > -1){
          console.log("To Show:");
          console.log(this);
         } else {
          $(this).hide();
           console.log($(this))
         }
    }); 
    
      
      
      
      //  var msgInRoom = //chat"..."
      //for(i=0;i<)
      
      
      
      //}
         
         
         
         
        }
         
         
         
         
         
         
         
         
         
         
    function initPrivateChat(uid){
      console.log("Got this far")
      console.log(uid)
      var thisUser;
      var array = ChatModule.getUsersInRoom()
      console.log(array)
      for(i=0;i<array.length;i++){
       if(array[i].UserID == uid){
           thisUser = array[i]; 
         }
      }
      if(!thisUser){
       alert('There has been an error, sorry :(') 
        return;
      }
      
     var html = '<a  onclick="restoreSideMenu()"><i style="color:white; font-size:20px;"class="fa fa-chevron-left fa-2x slideBack"></i></a> <h2 style="color:white;">Private Chat With ' +thisUser.DisplayName+'</h2>';
     html += '<iframe width="99%" height="70%" src="https://lancaster.ombiel.co.uk/campusm/home#aek/screen/6273/AEK6273/s4367/1427369499929"></iframe>';
     SlideOut.newSliderPage(html)
      
    }
         
         
 
      
    function createListModal()  {
          console.log("Hi")
          window.sideMenu = document.getElementById('menuHolder').innerHTML;
        backstack.push(window.sideMenu)
          var newSlideHtml;
        
         newSlideHtml= '<div id="myPicture" style="display:none;"class="img-circular" ></div> <a   onclick="restoreSideMenu()"><i style="color:white; font-size:20px;"class="fa fa-chevron-left fa-2x slideBack"></i></a><br><h2 id="UserPage" style="text-align:center; color:white;">Users In This Room</h2>';
          var uir = ChatModule.getUsersInRoom();
          for(i=0; i<uir.length;i++){
                if(uir[i].Active){
                  
                    (function(index) {
                        console.log('iterator: ' + index);
                    newSlideHtml  += '<button id="userInRoom'+i+'" class="slideMenuItem">'+uir[i].DisplayName+'</button>';
                      })(i);
                
        
             }
       
        }
      SlideOut.newSliderPage(newSlideHtml) 
                  
     var uir = ChatModule.getUsersInRoom();
     for (var t=0;t<uir.length;t++){
       if(uir[t].Active){
        var td;
        td = document.getElementById('userInRoom'+t);
        if (typeof window.addEventListener==='function'){
                td.addEventListener('click',function(){
                  
                  //get this usr
                  user = ChatModule.getUsersInRoom()[this.id.replace(/\D/g,'')];
                  //add back bar
                  userPageHtml = '<a  onclick="restoreSideMenu()"><i style="color:white; font-size:20px;"class="fa fa-chevron-left fa-2x slideBack"></i></a>' + this.id.replace(/\D/g,'');
               
                  userPageHtml +='<div id="theirPicture'+user.UserID+'" class="img-circular" ></div>';
                  userPageHtml +='<h2 style="color:white;text-align:center;">'+user.DisplayName+'</h2>';
                  userPageHtml +='<h3 style="color:white;text-align:center;">'+user.Bio+'</h3>';
                  userPageHtml +='<button onclick="initPrivateChat('+user.UserID+')" class="slideMenuItem">Private chat with '+user.DisplayName+'</button>'
                 // userPageHtml +='<iframe width="99%" scrolling="no"  height="65%" src="https://lancaster.ombiel.co.uk/campusm/home#aek/screen/6273/AEK6273/s4367/1427367005392"></iframe>'
                  console.log(userPageHtml)
                   console.log("ABOUT TO MAKE A NEW PAGE!")
                  SlideOut.newSliderPage(userPageHtml) 
                    
                  document.getElementById('theirPicture'+user.UserID).style.backgroundImage = "url(data:image/gif;base64,"+user.Photo64 + ")";
                    
            })}
           } 
        }
       
    }
      
      
      
      
      
      
      $("#updateButton").on('click',function(){
        console.log("update!")
        var url = 'campusm://loadaek?toolbar=AEK7772&_action=chat&room='+ChatModule.getChatName()+'&return=AEK6273' 
        var page;
       try {
           page = window.parent.CampusM.page;
       } catch (e) {}
       if (page) {
           page.customURL(url);
         return
       } else {
           location.href = url;
         return
       }
        return
      })
        
        
        
       $("#usersInRoomHolder").on('click',function(){

         createListModal();
       })
        
      $("#toBottomButton").on('click',function(){
        window.scrollTo(0,document.body.scrollHeight);
  
      
      })
         $("#menuButton").on('click',function(){
        window.scrollTo(0,document.body.scrollHeight);
  
      
      })
           
      
          
          $(function(){
            
            
   $("#threadbutton").on('click', function(){
     console.log('clicked')
       var s = $("#threadDD").attr('size')==1?5:1
       $("#threadDD").attr('size', s);
   });
   $("#threadDD option").on({
       click: function() {
           $("#threadDD").attr('size', 1);
       },
       mouseenter: function() {
           $(this).css({background: '#498BFC', color: '#fff'});
       },
       mouseleave: function() {
           $(this).css({background: '#fff', color: '#000'});
       }
   });
});



              
       $( "#threadDD" ).change(function(val) {
            //get the selected thread
            var newThread = $( "#threadDD option:selected" )[0].innerHTML;
            //get the message
            var msgAndThread = $('#messageTextBox').val()
            if(msgAndThread.indexOf(":")){
            var msg = msgAndThread.substring(msgAndThread.indexOf(":") + 1);
            } else {
              var msg = newThread;
            }
            if(newThread!=="Thread"){
              var newMsg = newThread +': '+msg;
            } else {
              var newMsg = msg;
            }
    
            $('#messageTextBox').val(newMsg);
        });
      
        $("#threadsMenuOption").on('click',function(){
              var threadPageHtml;

                  threadPageHtml = '<a onclick="restoreSideMenu()"><i style="color:white; font-size:20px;"class="fa fa-chevron-left"></i></a><button onclick="filterThreads(\'all\')" " class="slideMenuItem">#All</button>';
              threadPageHtml+='<h2 style="color:white"></h2>'
         
                
                for(i=0;i<threads.length;i++){
                     (function(index) {
                        console.log('iterator: ' + index);
                    threadPageHtml  += '<button onclick="filterThreads('+index+')" " class="slideMenuItem">'+threads[i]+'</button>';
                      })(i);
              
          
            }
         console.log(UI);
         console.log(SlideOut);   

        SlideOut.newSliderPage(threadPageHtml) 
        
        });