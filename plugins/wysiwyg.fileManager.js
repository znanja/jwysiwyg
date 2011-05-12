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
		init: function (callback) {
			if (this.ajaxHandler) {
				manager = new fileManagerObj(this.ajaxHandler);
				manager.load(callback);
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
		this.curListHtml = "";
		// Methods
		this.load = function (callback) {
			var self = this;
			self.loaded = true;
			// Wrap the file list:
			self.loadDir("/", function (fileList) {
				var uiHtml = '<div class="wysiwyg-files-wrapper" title="File Manager"><div id="wysiwyg-files-list-wrapper">'+fileList+'</div><input type="text" name="url" /><input style="display:none;" type="button" name="submit" value="Select" /></div>';
				if ($.wysiwyg.dialog) {
					// Future support for native $.wysiwyg.dialog()
					$.wysiwyg.dialog(uiHtml);
				} else if ($.fn.dialog()) {
					$(uiHtml).dialog({
						modal: true,
						draggable: true,
						resizable: true,
						open: function () {
							dialog = $(this);
							dialog.find("li").live("mouseenter", function () {
								if ($(this).hasClass("wysiwyg-files-dir")) {
									$(this).addClass("wysiwyg-files-dir-expanded");
								}
								$(this).addClass("wysiwyg-files-hover");
							}).live("mouseleave", function () {
								$(this).removeClass("wysiwyg-files-dir-expanded");
								$(this).removeClass("wysiwyg-files-hover");
							});
							dialog.find("li").live("click", function () {
								$(".wysiwyg-files-wrapper").find("li").css("backgroundColor", "#FFF");
								if ($(this).hasClass("wysiwyg-files-dir")) {
									$(".wysiwyg-files-wrapper").find("input[name=url]").val('');
									$('#wysiwyg-files-list-wrapper').addClass("wysiwyg-files-ajax");
									$('#wysiwyg-files-list-wrapper').html("");
									self.loadDir($(this).attr("rel"), function (newFileList) {
										$('#wysiwyg-files-list-wrapper').html(newFileList);
										$('#wysiwyg-files-list-wrapper').removeClass("wysiwyg-files-ajax");
									});
									dialog.find("input[name=submit]").hide();
								} else {
									$(this).css("backgroundColor", "#BDF");
									$(".wysiwyg-files-wrapper").find("input[name=url]").val($(this).attr("rel"));
									dialog.find("input[name=submit]").show();
								}
							});
							dialog.find("input[name=submit]").live("click", function () {
								var file = dialog.find("input[name=url]").val();
								dialog.dialog("close");
								self.loaded = false;
								callback(file);
							});
							dialog.find("li.wysiwyg-files-file").live("dblclick", function () {
								$(this).trigger("click");
								dialog.find("input[name=submit]").trigger("click");
							});
							dialog.find("li.wysiwyg-files-png, li.wysiwyg-files-jpg, li.wysiwyg-files-jpeg, li.wysiwyg-files-gif, li.wysiwyg-files-ico, li.wysiwyg-files-bmp").live("mouseenter", function () {
								var $this = $(this);
								$("<img/>", { "class": "wysiwyg-files-ajax wysiwyg-files-file-preview", "src": $this.attr("rel"), "alt": $this.text() }).appendTo("body");
								$("img.wysiwyg-files-file-preview").load(function () {
									$(this).removeClass("wysiwyg-files-ajax");
								});
							}).live("mousemove", function (e) {
								$("img.wysiwyg-files-file-preview").css("left", e.pageX + 15);
								$("img.wysiwyg-files-file-preview").css("top", e.pageY - 15);
							}).live("mouseout", function () {
								$("img.wysiwyg-files-file-preview").remove();
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
			});
		}
		
		this.loadDir = function (dir, callback) {
			var self = this;
			self.curDir = dir;
			// Retreives list of files inside a certain directory:
			$.getJSON(self.handler, { "dir": self.curDir, "action": "list" }, function (json) {
				callback(self.renderList(json));
			});
		}
		
		this.renderList = function (json) {
			var self = this;
			var treeHtml = '<ul class="wysiwyg-files-list">';
			if (self.curDir !== "/") {
				var prevDir = self.curDir.replace(/[^\/]+\/?$/, '');
				treeHtml += '<li class="wysiwyg-files-dir wysiwyg-files-dir-prev" rel="'+prevDir+'" title="Go to previous directory">'+self.curDir+'</li>';
			}
			$.each(json.data.directories, function(name, dirPath) {
				treeHtml += '<li class="wysiwyg-files-dir" rel="'+dirPath+'">'+name+'</li>';
			});			
			$.each(json.data.files, function(name, url) {
				var ext = name.replace(/^.*?\./, '').toLowerCase();
				treeHtml += '<li class="wysiwyg-files-file wysiwyg-files-'+ext+'" rel="'+url+'">'+name+'</li>';
			});			
			treeHtml += '</ul>';
			return treeHtml;
		}

	}
	
	this.deleteFile = function () {
		
	}
	
	this.moveFile = function () {
		
	}
	
	this.renameFile = function () {
		
	}
	
})(jQuery);
