//helper file for common functions.

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
