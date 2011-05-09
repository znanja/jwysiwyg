/**
 * File Manager plugin for jWYSIWYG
 * 
 * Yotam Bar-On, 2011
 */
(function ($) {
	if (undefined === $.wysiwyg) {
		throw "wysiwyg.fileManager.js depends on $.wysiwyg";
	}

	/*
	 * Wysiwyg namespace: public properties and methods
	 */
	 // Only for show
	 var fileManager = {
		name: "fileManager",
		version: "0.98", // Same as jwysiwyg
		ajaxHandler: "",
		selected: null,
		setAjaxHandler: function (_handler) {
			this.ajaxHandler = _handler;
			return this;
		},
		isAjaxSet: function () {
			if (this.ajaxHandler) {
				return true;
			} else {
				return false;
			}
		},
		init: function () {
			if (this.ajaxHandler) {
				manager = new fileManagerObj(this.ajaxHandler);
				manager.load();
			} else {
				return false;
			}
		}
		
	 }
	// Register:
	$.wysiwyg.plugin.register(fileManager);
	
	// Private object:
	function fileManagerObj (_handler) {
		this.handler = _handler;
		this.loaded = false;
		this.curDir = "/";
		// Methods
		this.load = function () {
			var self = this;
			self.loaded = true;
			// Wrap the file list:
			var fileList = self.loadDir();
			var uiHtml = '<div class="wysiwyg-files-wrapper"><span class="wysiwyg-files-title">You are in: &nbsp;'+self.curDir+'</span><br/><div id="wysiwyg-files-list-wrapper">'+fileList+'</div><input type="text" name="url" /></div>';
			if ($.wysiwyg.dialog) {
				$.wysiwyg.dialog(uiHtml);
			} else if ($.fn.dialog()) {
				$(uiHtml).dialog({
					modal: true,
					open: function () {
						dialog = $(this);
						$(".wysiwyg-files-wrapper").find("li").click(function () {
							$(".wysiwyg-files-wrapper").find("li").css("backgroundColor", "#FFF")
							$(this).css("backgroundColor", "#BDF")
							if ($(this).hasClass("wysiwyg-files-dir")) {
								self.curDir = $(this).attr("rel");
								$(".wysiwyg-files-wrapper").find("input[name=url]").val('');
								$('#wysiwyg-files-list-wrapper').load(self.loadDir());
							} else {
								$(".wysiwyg-files-wrapper").find("input[name=url]").val($(this).attr("rel"));
							}
						});
						$(".wysiwyg-files-wrapper").find("input[type=submit]").click(function () {
							$(".wysiwyg-files-wrapper").find.text(self.selected);
							dialog.dialog("close");
						});
					},
					close: function () {
						$(this).dialog("destroy");
						$(this).remove();
					}
				});
			} else {
				throw "$.wysiwyg.fileManager: Can't find a working '.dialog()' lib.";
				// If neither of the above works..
			}
		}
		
		this.loadDir = function () {
			var self = this;
			// Retreives list of files inside a certain directory:
			//$.getJSON(self.handler, { "dir": self.curDir }, function (json) {
				var json = {
					"data": {
						"directories": [
							"directory 1",
							"directory 2",
							"directory 3"
						],
						"files": {
							"image.jpg": "http://localhost/image.jpg",
							"movie.avi": "http://localhost/movie.avi",
							"document.pdf": "http://localhost/document.pdf",
							"music.ogg": "http://localhost/music.ogg"
							
						}
					}
				}
				return this.renderList(json);
			//});
		}
		
		this.renderList = function (json) {
			var self = this;
			var treeHtml = '<ul class="wysiwyg-files-list">';
			$.each(json.data.directories, function(idx, name) {
				var dirPath = self.curDir.replace(/\/?$/, '') + '/' + name;
				treeHtml += '<li class="wysiwyg-files-dir" rel="'+dirPath+'">'+name+'</li>';
			});			
			$.each(json.data.files, function(name, url) {
				var ext = name.replace(/^.*?\./, '');
				treeHtml += '<li class="wysiwyg-files-'+ext+'" rel="'+url+'">'+name+'</li>';
			});			
			treeHtml += '</ul>';
			return treeHtml;
		}

	}
	
	this.deleteFile = function () {
		
	}
	
})(jQuery);
