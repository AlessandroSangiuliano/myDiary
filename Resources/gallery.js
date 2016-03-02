//This module creates a window to show all the pictures in a gallery
Ti.include('helper.js');

var Gallery = (function(){
  function Gallery(a_navigation_group){
    this.gallery_path = Ti.Filesystem.applicationDataDirectory + "/Gallery/";
    this.nav_group = a_navigation_group;
    this.colons_num = 0;
    this.rows_num = 0;

    this.gallery_window = Ti.UI.createWindow({
      title:'Gallery'
    });

    this.gallery_view = Ti.UI.createView({
      layout:'vertical',
      height:Ti.UI.FILL,
      width:Ti.UI.FILL
    });


    if (isAndroid()) {
      this.gallery_window.addEventListener('open', eventHandler = function(e){
        var the_window = e.source;
        var action_bar = the_window.getActivity().getActionBar();
        if (action_bar) {
          action_bar.setDisplayHomeAsUp(true);
          action_bar.onHomeIconItemSelected = function(){
            the_window.close();
            the_window.removeEventListener('open', eventHandler);
            Gallery.prototype.dealloc();
            the_window = null;
            action_bar = null;
          }
        }
      });
    }

    this.gallery_window.add(this.gallery_view);
    //this.gallery_window.open();

  }

  Gallery.prototype.getWindow = function(){
    return this.gallery_window;
  };

  Gallery.prototype.buildGallery = function(){
    var dir = Ti.Filesystem.getFile(this.gallery_path);
    var pictures = dir.getDirectoryListing();
    var pic_num = pictures.length;
    var image_container;
    var file;
    var vertical_view, horizontal_view;

    vertical_view = Ti.UI.createScrollView({
      width:Ti.UI.FILL,
      height:'100'
    });
    this.rows_num = 1;
    for (var i = 0; i < pic_num; i++) {
      if ((i%3) != 0) {
        file = Ti.Filesystem.getFile(gallery_path + pictures[i]);
        image_container = Ti.UI.createImageView({
          height:'100',
          width:'100',
          image:file.nativePath
        });
        vertical_view.add(image_container);
        this.colons_num++;
      }
      else if (i == 0) {
        file = Ti.Filesystem.getFile(this.gallery_path + pictures[i]);
        Ti.API.info('Entro qui! ' + pictures[i]);
        image_container = Ti.UI.createImageView({
          height:'100',
          width:'100',
          image:file.nativePath
        });
        //Ti.API.info('path del cazzo: ');
        vertical_view.add(image_container);
        this.colons_num++;
      }
      else {
        //va aggiunta quella in posizione i per il quale i%3 == 0
        //this.gallery_view.add(vertical_view);
        this.rows_num++;
      }
    }
    this.gallery_view.add(vertical_view);
    Ti.API.info('Allah! ' + vertical_view.children + " window: " + this.gallery_window);
    //this.gallery_window.add(this.gallery_view);
    Ti.API.info('mah: ' + this.gallery_window.children);
  };

  Gallery.prototype.dealloc = function(){
    this.gallery_path = null;
    this.nav_group = null;
  };

    return Gallery;
})();

module.exports = Gallery;
