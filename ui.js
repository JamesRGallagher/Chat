/**
* UI lib
* Deals with the UI of the chat.
*/
var UI = (function() {  
var mainWindow = {
    messageEntry:$('#messageTextBox'),
    chatArea: $('#commentArea')
};

var slideOutMenu = {
    pageHolder:$('#menuHolder'),
    updateMyInfo:$('#updateButton'),
    usersInRoom:$('#usersInRoomHolder'),
    threads:$('#threadsMenuOption')
};

getSlideOutMenu = function(){
	return slideOutMenu;
} return{

		getSlideOutMenu:getSlideOutMenu;
	

}
}) ();
