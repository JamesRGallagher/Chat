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

/**
 * slideOut 
 * Contains functions to deal with page 
 * and history managment with the slideout
 * menu
 */
var SlideOut = (function() {  
	console.log('slider')
	var slider = UI.getSlideOutMenu().pageHolder;  
	function newSliderPage(html){
	    current = slider.html();
	    backstack.push(current);
	    slider.html('');
	    slider.html(html);   
	}  return {
		newSliderPage:newSliderPage
	}

})();