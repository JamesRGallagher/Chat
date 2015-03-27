/**
 * slideOut 
 * Contains functions to deal with page 
 * and history managment with the slideout
 * menu
 */
var SlideOut = (function() {  

	var slider = slideOutMenu.menuHolder;  

	function newSliderPage(html){
	    current = slider.html();
	    backstack.push(current);
	    slider.html('');
	    slider.html(html);   
	}  return {
		newSliderPage:newSliderPage
	}

})();