//helper file for common functions and "macros".
var APP_NAME = "myDiary";

isAndroid = function(){
  return (Ti.Platform.name === 'android');
};

isIOS = function(){
  return (Ti.Platform.name === 'iPhone OS');
};

createVerticalDivisor = function(_width, _height){
  return Ti.UI.createView({
    width:_width,
    height:_height,
    left:2,
    backgroundColor:"#03C0EF"
  });
};

createHorizontalDivisor = function(_width, _height){
  return Ti.UI.createView({
    width:_width,
    height:_height,
    top:1,
    backgroundColor:"#03C0EF"
  });
};

idGenerator = function(a_mime_type){
	var id_number = Math.floor(Math.random() * 10000 + 1);
	var pic_name = APP_NAME + "-" + id_number + "." + a_mime_type;
	Ti.API.info('tipotpo: ' + pic_name);
	return pic_name;
}

/*createActionBarWithEvenListener(win, an_action_bar){
  win.addEventListener('open', eventHandler = function(e){
    an_action_bar = win.getActivity().getActionBar();
    if(an_action_bar){
      an_action_bar.setDisplayHomeAsUp(true);
      an_action_bar.onHomeIconItemSelected = function(e){
        win.close();
      };
    }
  });
}*/
