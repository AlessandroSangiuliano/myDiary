//this module is responsible of a new entry creation.
Ti.include('helper.js');

var page_window;
var annotation_area;
var action_bar;
var date_label;
var top_view, container;
var prev_button, next_button, done_button, add_button;
var image_container, another_ann_area;
var track_pictures = [], track_text_areas = [];

function newPage(){

  page_window = Titanium.UI.createWindow({
    backgroundColor:'#D8C10F',
    title:"Titolo dell'entry"
  });
  var date = new Date();
  date_label = Ti.UI.createLabel({
    width:Ti.UI.SIZE,
    height:38,
    color:'black',
    text:date.toUTCString().substring(0,16),
    left:2
  });
  top_view = Ti.UI.createView({
    layout:'horizontal',
    width:Ti.UI.FILL,
    height:39,
    top:0,
    backgroundColor:'white'
  });
  container = Ti.UI.createScrollView({
    layout:'vertical',
    width:Ti.UI.FILL,
    height:Ti.UI.FILL,
    scrollType:'vertical'
  });

  annotation_area = Titanium.UI.createTextArea({
    top:1,
    color:'black',
    hintText:'Write here your memories...',
    hintTextColor:'gray'
  });

  if (isAndroid()) {
    page_window.addEventListener('open', eventHandler = function(e){
      action_bar = page_window.getActivity().getActionBar();
      if (action_bar) {
        action_bar.setDisplayHomeAsUp(true);
        action_bar.onHomeIconItemSelected = function(){
          page_window.close();
          //page_window.removeEventListener('open', eventHandler);
          newPage.prototype.dealloc();
        };
      }
    });
  }

  prev_button = Ti.UI.createButton({
    title:'Prev',
    height:Ti.UI.SIZE,
    left:0,
    top:1,
    width:Ti.UI.SIZE
  });

  next_button = Ti.UI.createButton({
    title:'Next',
    height:Ti.UI.SIZE,
    left:1,
    top:1,
    width:Ti.UI.SIZE
  });

  done_button = Ti.UI.createButton({
    title:'Done',
    height:Ti.UI.SIZE,
    left:1,
    top:1,
    width:75
  });

  add_button = Ti.UI.createButton({
    title:'Add a picture...!',
    height:Ti.UI.SIZE,
    width:Ti.UI.SIZE
  });

  add_button.addEventListener('click', eventHandler = function(e){
    Ti.Media.openPhotoGallery({
      success:function(e){
        if (e.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
          image_container = newPage.prototype.createImageContainer();
          image_container.setImage(e.media);
          another_ann_area = newPage.prototype.createAnnotationArea();
          track_pictures.push(image_container);
          track_text_areas.push(another_ann_area);
          newPage.prototype.buildContainerView(image_container,another_ann_area);
        }
      },
      error:function(e){
        Ti.API.info('Sbaglieto!');
      }
    });
  });
//implementare spostamento immagini nella directory Gallery
  done_button.addEventListener('click', eventHandler = function(e){
    saveToJSON(annotation_area.getValue());
    var image;
    if(track_text_areas.length != 0){
      for (var i = 0; i < track_text_areas.length; i++) {
        if (track_pictures.length >= i) {
          image = track_pictures[i].getImage().getFile();
          saveToJSON(track_text_areas[i].getValue(), image.getName());
          image.move(Ti.Filesystem.applicationDataDirectory+"/Gallery/" + image.getName());
        }
        else {
          saveToJSON(track_text_areas[i].getValue(),null);
        }
      }
    }
    //codice di debug.
    if (track_pictures.length != 0) {
      for (var i = 0; i < track_pictures.length; i++) {
        Ti.API.info(track_pictures[i].getImage().getFile().getName());
      }
    }
    newPage.prototype.readFromJSON();
  });

  top_view.add(prev_button);
  top_view.add(createVerticalDivisor(1, top_view.getHeight()));
  top_view.add(date_label);
  top_view.add(createVerticalDivisor(1, top_view.getHeight()));
  top_view.add(next_button);
  top_view.add(createVerticalDivisor(1, top_view.getHeight()));
  top_view.add(done_button);
  container.add(top_view);
  container.add(createHorizontalDivisor(page_window.getWidth(), 1));
  container.add(annotation_area);
  container.add(add_button);
  page_window.add(container);
}

newPage.prototype.getPageWindow = function(){
  return page_window;
};

newPage.prototype.dealloc = function(){
  page_window.removeEventListener('open', eventHandler);
  top_view.remove(date_label);
  date_label = null;
  top_view.remove(prev_button);
  prev_button = null;
  top_view.remove(next_button);
  next_button = null;
  container.remove(top_view);
  top_view = null;
  action_bar = null;
  container.remove(annotation_area);
  annotation_area = null;
  page_window.remove(container);
  container.remove(add_button);
  add_button = null;
  container = null;
  page_window = null;
};

newPage.prototype.setText = function(text){
  annotation_area.setValue(text);
};

newPage.prototype.setTextInSpecificArea = function(an_annotation_area, text){
  an_annotation_area.setValue(text);
  track_text_areas.push(an_annotation_area);
};

newPage.prototype.setImage = function(an_image_container, an_image){
  an_image_container.setImage(an_image);
  track_pictures.push(an_image_container);
};

newPage.prototype.buildContainerView = function(an_image_container, an_annotation_area){
  container.remove(add_button);
  container.add(an_image_container);
  container.add(an_annotation_area);
  container.add(add_button);
};

newPage.prototype.setDateLabel = function(date_string){
  date_label.setText(date_string);
};

saveToJSON = function(text, image_name){
  var path = "Memories/" + date_label.getText();
  var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, path);
  var json_object;
  if (isIOS()) {
    file.setRemoteBackup(false);
  }
  if (file.exists() === false) {
    //file.createFile();
    file.write('{"memories":[]}');
  }
  json_object = JSON.parse(file.read().text);
  json_object.memories.push({"note":text, "image":image_name});
  var stringed = JSON.stringify(json_object);
  file.write(stringed);
};

newPage.prototype.readFromJSON = function(){
  var path = "Memories/" + date_label.getText();
  var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, path);
  var json_object;

  Ti.API.info('LeL:\n' + file.read().text);
  json_object = JSON.parse(file.read().text);
  /*for (var i = 0; i < json_object.memories.length; i++) {
    Ti.API.info('LoL: ' + json_object.memories[i].note);
  }*/
  //var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "Memories");
  //Ti.API.info('Cartelle: ' + dir.getDirectoryListing());
  return json_object;
};

newPage.prototype.createImageContainer = function(){
  return Ti.UI.createImageView({
    height:100,
    width:100
  });
};

newPage.prototype.createAnnotationArea = function(){
  return Ti.UI.createTextArea({
    hintText:'Write here your memories...',
    hintTextColor:'gray',
    color:'black'
  });
};

module.exports = newPage;
