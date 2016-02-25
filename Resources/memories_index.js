//This module builds the index menu of the memotires saved on the device.
Ti.include('helper.js');
var pageModule = require('page');

var file;
var memories_table;
var nav_group;
var index_window, index_view;
var memory_row;
var action_bar;

function memoriesIndex(a_navigation_group){
  var table_rows = [];
  var stored_memories;

  nav_group = a_navigation_group;
  index_window = Ti.UI.createWindow({
    backgroundColor:'#fff',
    title:'Read your memories'
  });

  if (isAndroid()) {
    index_window.addEventListener('open', eventHandler = function(e){
      action_bar = index_window.getActivity().getActionBar();
      if (action_bar) {
        action_bar.setDisplayHomeAsUp(true);
        action_bar.onHomeIconItemSelected = function(){
          index_window.close();
          memoriesIndex.prototype.dealloc();
        };
      }
    });
  }
  index_view = Ti.UI.createScrollView({
    layout:'vertical',
    width:Ti.UI.FILL,
    height:Ti.UI.FILL,
    scrollType:'vertical'
  });
  memories_table = Ti.UI.createTableView({
    height:Ti.UI.FILL,
    width:Ti.UI.FILL,
    top:0,
    separatorColor:'gray',
    headerTitle:'Memories index'
  });

  stored_memories = readStoredMemories();//è una prova!
  for (var i = 0; i < stored_memories.length; i++) {
    memory_row = Ti.UI.createTableViewRow({
      title:stored_memories[i],
      color:'black',
      height:35,
      width:Ti.UI.FILL,
      backgroundColor:'#ebe5e0',
      backgroundSelectedColor:'#03C0EF'
    });
    table_rows.push(memory_row);
  }
  stored_memories = null;//attenzione qui!

  memories_table.setData(table_rows);
  index_view.add(memories_table);
  index_window.add(index_view);
  table_rows = null;//attenzione qui!

  memories_table.addEventListener('click', eventHandler = function(e){
    handleMemorySelection(e.rowData, nav_group);
  });
}

readStoredMemories = function(){
  var saved_memories;
  var dir;

  if (isIOS()) {
    file.setRemoteBackup(false);
  }

  dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "Memories");
  saved_memories = dir.getDirectoryListing();
  for (var i = 0; i < saved_memories.length; i++) {
    Ti.API.info(saved_memories[i]);
  }
  return saved_memories;
};

memoriesIndex.prototype.getWindow = function(){
  return index_window;
};

memoriesIndex.prototype.dealloc = function(){
  index_view.remove(memories_table);
  memories_table = null;
  nav_group = null;
  index_window.removeEventListener('open', eventHandler);
  action_bar = null;
  index_window.remove(index_view);
  index_view = null;
  index_window = null;
};

handleMemorySelection = function(row, a_navigation_group){
  var page = new pageModule;
  var json;
  var image_container, annotation_area;
  var image;

  page.setDateLabel(row.title);
  page.getPageWindow().open();//check anche per ios
  json = page.readFromJSON();
  page.setText(json.memories[0].note);
  for (var i = 1; i < json.memories.length; i++) {
    annotation_area = page.createAnnotationArea();
    page.setTextInSpecificArea(annotation_area, json.memories[i].note);
    if (json.memories[i].image != undefined){
      image = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "Gallery/" + json.memories[i].image);
      image_container = page.createImageContainer();
      page.setImage(image_container, image);
    }
    page.buildContainerView(image_container, annotation_area);
  }
  image = null;
  image_container = null;
  annotation_area = null;
  json = null;
};

module.exports = memoriesIndex;
