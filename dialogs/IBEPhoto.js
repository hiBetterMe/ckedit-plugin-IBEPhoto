/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add('IBEPhoto', function (editor) {
  var config = editor.config,
    lang = editor.lang.IBEPhoto,
    images = config.smiley_images,
    columns = config.smiley_columns || 8,
    i;


  // Simulate "this" of a dialog for non-dialog events.
  // @type {CKEDITOR.dialog}
  var dialog;


  // Build the HTML for the smiley images table.
  var labelId = CKEDITOR.tools.getNextId() + '_IBEPhoto_emtions_label';
  var contentId = CKEDITOR.tools.getNextId() + '_IBE_content';

  var currentPage = 1;
  var photoSelector = {
    type: 'html',
    id: 'photoSelector',
    html: '<div class="photo-box" ><div id="J-react-IBEPhoto-upload"></div> <div id="' + contentId + '">加载中...</div></div>',
    reloadData: function () {
      currentPage = 1;
      loadPhotoForPage(currentPage);
    },
    onLoad: function (event) {
      dialog = event.sender;

      loadPhotoForPage(currentPage);

      var contentElement = $('#' + contentId);
      contentElement.delegate('img', 'click', function (e) {
        var target = e.target,
          src = target.getAttribute('cke_src'),
          title = target.getAttribute('title');

        var img = editor.document.createElement('img', {
          attributes: {
            src: src,
            'data-cke-saved-src': src,
            title: title,
            alt: title
          }
        });

        editor.insertElement(img);
        dialog.hide();

      });
      contentElement.delegate('.prePage', 'click', function (e) {
        e.preventDefault();
        currentPage -= 1;
        if (currentPage > 0) {
          loadPhotoForPage(currentPage);
        }
      });
      contentElement.delegate('.nextPage', 'click', function (e) {
        e.preventDefault();
        currentPage += 1;
        if (currentPage > 0) {
          loadPhotoForPage(currentPage);
        }
      });
    },
    //focus: function () {
    //  var self = this;
    //  // IE need a while to move the focus (#6539).
    //  setTimeout(function () {
    //    var firstSmile = self.getElement().getElementsByTag('a').getItem(0);
    //    firstSmile.focus();
    //  }, 0);
    //},
    style: 'width: 100%; border-collapse: separate;'
  };

  function loadPhotoForPage(page, limit) {
    page = page || 1;
    limit = limit || 9;
    var skip = limit * (page - 1);
    $.get('/api/1.0/photo/list', {
      limit: limit,
      skip: skip
    }, function (data) {
      var contentElement = $('#' + contentId);
      if (!data.success) {
        return contentElement.html('加载异常，请重试');
      }
      var total = data.total;


      var lists = data.photos.map(function (photo) {

        var li = '<li class="item">' +
          '<img style="cursor: pointer;" cke_src="' + photo.image.url + '" src="' + photo.image.url + '?imageView/1/w/100/" />' +
          '</li>';
        return li;

      });

      var content = "<div>" +


        '<ul class="fn-clear">' + lists.join('') + '</ul>' +
        '<div>' +
        (page > 1 ? '<a href="#" class="prePage">上一页</a>' : '') +
        (skip + data.photos.length < total ? '<a href="#" class="nextPage">下一页</a>' : '') +
        '</div>' +
        "</div>";

      contentElement.html(content);

    });
  }


  return {
    title: editor.lang.IBEPhoto.title,
    minWidth: 500,
    minHeight: 300,
    resizable: false,
    contents: [{
      id: 'tab1',
      label: '',
      title: '',
      expand: true,
      padding: 0,
      elements: [
        photoSelector
      ]
    }],
    buttons: [CKEDITOR.dialog.cancelButton]
  };
});