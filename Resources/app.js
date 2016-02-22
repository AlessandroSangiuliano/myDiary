//var loginModule = require('login');
var pageModule = require('page');
var openDiary = require('rootWindow');
var activity_choice = require('activityMenu');
Titanium.include('helper.js');
// this sets the background color of the master UIView (when there are no windows/tab groups on it)
//Titanium.UI.setBackgroundColor('#000');
var page, activity_index;
Titanium.App.Properties.setBool('logged', false);
//aux();
if (!createGallery()) {
  alert('Failed to create the Gallery directory');
}

if (!createMemoriesDirectory()) {
  alert('Failed to create the Memories directory');
}

var readDiary = new openDiary;

Ti.App.addEventListener('logging', eventHandler = function(e){
  if (e.success) {
    Ti.App.removeEventListener('logging', eventHandler);

    var nav = readDiary.getNavigationGroup();
    (isAndroid()) ? activity_index = new activity_choice(null) : activity_index = new activity_choice(nav);

    if(isIOS())
      nav.openWindow(activity_index.getActivityWindow());
    else {
      activity_index.getActivityWindow().open();
    }

    var login = readDiary.getLoginManager();

    if (isIOS()) {
      nav.closeWindow(login.getLoginWindow(), {animated:true});
    }
    else {
      login.getLoginWindow().close();
    }

    login.dealloc();
    login = null;
  }
  else {
    alert('Wrong UserID or Password');
  }
  Ti.App.Properties.setBool('logged', true);
});

Ti.App.addEventListener('logged', eventHandler = function(){
  if (isIOS()) {
    readDiary.getNavigationGroup().openWindow(activity_index.getActivityWindow());
  }
  else {
    activity_index.getActivityWindow().open();
  }
});
//starting point
//Titanium.App.Properties.setBool('logged', false);
//var readDiary = new openDiary;
//var login = new loginModule;


function createGallery(){
  var gallery_folder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'Gallery');
  var success;
  if (!gallery_folder.exists()) {
    success = gallery_folder.createDirectory();
  }
  else {
    success = true;
  }

  return success;
}

function createMemoriesDirectory(){
  var memories_folder = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'Memories');
  var success;
  if (!memories_folder.exists()) {
    success = memories_folder.createDirectory();
  }
  else {
    success = true;
  }

  return success;
}

//auxiliar function to put images or other media in the emulator. TO BE REMOVED!
/*function aux(){
  var immagine = Ti.Filesystem.getFile('farfalla.jpg');
  Ti.Media.saveToPhotoGallery(immagine, {
    success:function(e){
      alert('Saved!');
    },
    error:function(e){
      alert("Failed!");
    }
  });
}*/
