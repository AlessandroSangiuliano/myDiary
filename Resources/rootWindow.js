//this module creates the navigation group. The rootWIndow module is the first window.

Ti.include('helper.js');
var loginModule = require('login');
var root_window;
var navGroup;
var login;
var read_button;
var action_bar;

function navigationGroup(){
  commonBriks();
  if (isIOS()) {
    iPhoneBriks();
  }
  else {
    androidBriks();
  }
}

commonBriks = function(){
  read_button = Titanium.UI.createButton({
    title:'Read your Diary',
    height:Titanium.UI.SIZE,
    width:Titanium.UI.SIZE
  });

  root_window = Titanium.UI.createWindow({
    backgroundImage:'copertina4.jpg',
    title:'myDiary',
  });
  root_window.add(read_button);
};

iPhoneBriks = function(){
  navGroup = Titanium.UI.iOS.createNavigationWindow({
    window:root_window
  });

  read_button.addEventListener('click', function(e){
    var logged = Titanium.App.Properties.getBool('logged');

    if (logged == false) {
      login = new loginModule;
      navGroup.openWindow(login.getLoginWindow());
    }
    else {
      Ti.App.fireEvent('logged');
    }
  });

  navGroup.open();
};

androidBriks = function(){
  root_window.addEventListener('open', eventHandler = function(e){
    action_bar = root_window.activity.actionBar;
    if(action_bar){
      action_bar.setDisplayHomeAsUp(true);
    }
  });

  read_button.addEventListener('click', function(e){
    var logged = Titanium.App.Properties.getBool('logged');

    if (logged == false) {
      login = new loginModule;
    }
    else {
      Ti.App.fireEvent('logged');
    }
  });

  root_window.open();
};

navigationGroup.prototype.newTab = function(win, the_title){
  var tab = Titanium.UI.createTab({
    window:win,
    title:the_title
  });
  return tab;
};

navigationGroup.prototype.getLoginManager = function()
{
  return login;
};

navigationGroup.prototype.getNavigationGroup = function()
{
  return navGroup;
};

module.exports = navigationGroup;
