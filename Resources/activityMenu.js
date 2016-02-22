/**
 * This module creates the activity menu, where the user choice the action to do
 * like: add a new memory, read the existing memories, and so on.
 */
var pageModule = require('page');
var indexModule = require('memories_index');
Ti.include('helper.js');

var activity_window;
var activity_table;
var nav_group;

function activityMenu(a_navigation_group){
  var add_mem_row;
  var table_rows = [];
  var read_mem_row;
  /*a questo punto, questo check è superfluo. trasformare in: nav_group = a_navigation_group;
  di conseguenza se a_navigation_group è null lo sarà anche nav_group, altrimenti nav_group
  punterà all'oggetto di a_navigation_group!*/
  (a_navigation_group != null) ? nav_group = a_navigation_group : nav_group = null;

  activity_window = Ti.UI.createWindow({
    backgroundColor:'#fff',
    title:'What do you want to do?'
  });

  /*activity_view = Ti.UI.createView({
    layout:'vertical'
  });*/

  activity_table = Ti.UI.createTableView({
    height:Ti.UI.FILL,
    width:Ti.UI.FILL,
    top:0,
    separatorColor:'gray',
    headerTitle:'Activity List'
    });

  add_memory_row = Ti.UI.createTableViewRow({
    title:'Add a memory...',
    color:'black',
    height:35,
    width:Ti.UI.FILL,
    backgroundColor:'#ebe5e0',
    backgroundSelectedColor:'#03C0EF'
  });

  read_mem_row = Ti.UI.createTableViewRow({
    title:'Read memories...',
    color:'black',
    height:35,
    width:Ti.UI.FILL,
    backgroundColor:'#ebe5e0',
    backgroundSelectedColor:'#03C0EF'
  });

  table_rows.push(add_memory_row);
  table_rows.push(read_mem_row);
  activity_table.setData(table_rows);
  activity_window.add(activity_table);
  //activity_window.open();
  //attenzione ai seguenti null-fy
  add_memory_row = null;
  read_mem_row = null;
  table_rows = null;

  activity_table.addEventListener('click', eventHandler = function(e){
    handleActivitySelection(e.index, nav_group);
  });
}

activityMenu.prototype.getActivityWindow = function(){
  return activity_window;
};

activityMenu.prototype.dealloc = function(){
  nav_group = null;
  activity_window.remove(activity_table);
  activity_table = null;
  
  //last thing to null-fy
  activity_window = null;
};

/**
 * a_navigation_group argument may be null.
 */

handleActivitySelection = function(index, a_navigation_group){
  var page;

  switch (index) {
    case 0:
      page = new pageModule;
      isAndroid() ? page.getPageWindow().open() : a_navigation_group.openWindow(page.getPageWindow());
      break;
    case 1:
      var index_list = new indexModule(a_navigation_group); //memory_leak
      isAndroid() ? index_list.getWindow().open() : a_navigation_group.openWindow(index_list.getWindow());
    default:

  }
};

module.exports = activityMenu;
