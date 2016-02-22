//This is the login manager module
Ti.include('helper.js');

var login_window;
var user_id_box, user_password_box;
var credential_view;
var log_in_button, create_user_button;
var user_box_content, digest_password;
var login_success = false;
var divisor;
var action_bar;

function loginManager(){
  login_window = Ti.UI.createWindow({
    backgroundColor:'#fff',
    title:'Log in',
    backgroundImage:'copertina4.jpg'
  });

  if(isAndroid()){
    login_window.addEventListener('open', eventHandler = function(e){
      action_bar = login_window.activity.actionBar;
      if(action_bar){
        action_bar.setDisplayHomeAsUp(true);
        action_bar.onHomeIconItemSelected = function(e){
          login_window.close();
          loginManager.prototype.dealloc();
        };
      }
    });
  }


  credential_view = Ti.UI.createView({
    layout:'vertical',
    top:200,
    height:210,
    width:200
  });

  user_id_box = Ti.UI.createTextField({
    top:2,
    height:30,
    width:100,
    color:'black',
    font:{
    	fontSize:10
    },
    hintText:'UserID...',
    hintTextColor:'gray'
  });

  divisor = Ti.UI.createView({
    width:user_id_box.getWidth(),
    height:1,
    top:2,
    backgroundColor:"#03C0EF"
  });

  user_password_box = Titanium.UI.createTextField({
    top:1,
    height:30,
    width:100,
    passwordMask:true,
    color:'black',
    font:{
    	fontSize:10
    },
    hintText:'Password...',
    hintTextColor:'gray'
  });

  if(isAndroid())
  {
  	user_id_box.setHeight(40);
  	user_password_box.setHeight(40);
    user_id_box.setFont({
      fontSize:12
    });
    user_password_box.setFont({
      fontSize:12
    });
  }

  log_in_button = Titanium.UI.createButton({
    title:'Log In',
    height:Ti.UI.SIZE, //20
    width:Ti.UI.SIZE //50
});

  if(isAndroid()){
    log_in_button.setHeight(40);
    log_in_button.setWidth(80);
  }

  log_in_button.addEventListener('click', eventHandler = function(e){
    if (loginManager.prototype.getStoredUserID() === user_id_box.getValue()){
      if (loginManager.prototype.getStoredPassword() === criptPassword(user_password_box.getValue())) {
        login_success = true;
        Ti.App.fireEvent('logging', {success:login_success});
      }
      else {
        login_success = false;
        Ti.App.fireEvent('logging', {success:login_success});
      }
    }
    else {
      login_success = false;
      Ti.App.fireEvent('logging', {success:login_success});
    }
  });

  create_user_button = Titanium.UI.createButton({
    title:'New User',
    height:Ti.UI.SIZE, //20
    width:Ti.UI.SIZE //80

});

  if(isAndroid()){
    create_user_button.setBackgroundColor('#03C0EF');
    //create_user_button.setHeight(40);
    //create_user_button.setWidth(120);
  }

  create_user_button.addEventListener('click', eventHandler = function(e){
    user_box_content = user_id_box.getValue();
    if (user_box_content.length == 0) {
      alert('Please, enter a valid user name');
      return;
    }
    if (user_password_box.getValue().length == 0 ) {
      alert('Please, enter a valid password');
      return;
    }
    digest_password = criptPassword(user_password_box.getValue());
    loginManager.prototype.storeCredential();
  });

  credential_view.add(user_id_box);
  credential_view.add(divisor);
  credential_view.add(user_password_box);
  credential_view.add(log_in_button);
  credential_view.add(create_user_button);
  login_window.add(credential_view);
  if(Ti.Platform.name === 'android'){
    login_window.open();
  }
}

criptPassword = function(a_password){
  var cripted_password = Titanium.Utils.md5HexDigest(a_password);
  return cripted_password;
};

loginManager.prototype.storeCredential = function(){
  Titanium.App.Properties.setString('user_id', user_box_content);
  Titanium.App.Properties.setString('password', digest_password);
};

loginManager.prototype.getStoredUserID = function(){
  return Titanium.App.Properties.getString('user_id');
};

loginManager.prototype.getStoredPassword = function(){
  return Titanium.App.Properties.getString('password');
};

loginManager.prototype.getLoginWindow = function(){
  return login_window;
};

loginManager.prototype.dealloc = function(){
  login_window.remove(user_id_box);
  user_id_box = null;
  login_window.remove(user_password_box);
  user_password_box = null;
  log_in_button.removeEventListener('click', eventHandler);
  credential_view.remove(log_in_button);
  log_in_button = null;
  create_user_button.removeEventListener('click', eventHandler);
  credential_view.remove(create_user_button);
  create_user_button = null;
  credential_view.remove(divisor);
  divisor = null;
  login_window.remove(credential_view),
  login_window.removeEventListener('open', eventHandler);
  action_bar = null;
  credential_view = null;
  user_box_content = null;
  digest = null;
  login_window = null;
};

module.exports = loginManager;
