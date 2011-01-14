/**
 * WYSIWYG - jQuery plugin 0.94
 * (phase 2)
 *
 * Copyright (c) 2008-2009 Juan M Martinez, 2010 Akzhan Abdulin and all contributors
 * http://plugins.jquery.com/project/jWYSIWYG
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * $Id: $
 */

/*jslint browser: true, forin: true */

/*
:TODO:
1) documentSelection || getSelection || window.getSelection ???
 */

(function($) {
	/* Wysiwyg namespace: private properties and methods */

	var console = (typeof(window.console) !== 'undefined') ? window.console : {
		log: $.noop,
		error: function(msg)
		{
			throw msg;
		}
	};

	function Wysiwyg() {
		this.controls = {
			bold: {
				groupIndex: 0,
				visible: true,
				tags: ["b", "strong"],
				css: {
					fontWeight: "bold"
				},
				tooltip: "Bold"
			},

			copy: {
				groupIndex: 8,
				visible: false,
				tooltip: "Copy"
			},

			createLink: {
				groupIndex: 6,
				visible: true,
				exec: function() {
					var selection = this.documentSelection();

					if (selection && selection.length > 0) {
						if ($.browser.msie) {
							this.focus();
							this.editorDoc.execCommand("createLink", true, null);
						}
						else {
							var szURL = prompt("URL", "http://");
							if (szURL && szURL.length > 0) {
								this.editorDoc.execCommand("unlink", false, null);
								this.editorDoc.execCommand("createLink", false, szURL);
							}
						}
					}
					else if (this.options.messages.nonSelection) {
						alert(this.options.messages.nonSelection);
					}
				},
				tags: ["a"],
				tooltip: "Create link"
			},

			cut: {
				groupIndex: 8,
				visible: false,
				tooltip: "Cut"
			},

			decreaseFontSize: {
				groupIndex: 9,
				visible: false && !($.browser.msie),
				tags: ["small"],
				tooltip: "Decrease font size"
			},

			h1: {
				groupIndex: 7,
				visible: true,
				className: "h1",
				command: ($.browser.msie || $.browser.safari) ? "FormatBlock" : "heading",
				"arguments": ($.browser.msie || $.browser.safari) ? "<h1>" : "h1",
				tags: ["h1"],
				tooltip: "Header 1"
			},

			h2: {
				groupIndex: 7,
				visible: true,
				className: "h2",
				command: ($.browser.msie || $.browser.safari)	? "FormatBlock" : "heading",
				"arguments": ($.browser.msie || $.browser.safari) ? "<h2>" : "h2",
				tags: ["h2"],
				tooltip: "Header 2"
			},

			h3: {
				groupIndex: 7,
				visible: true,
				className: "h3",
				command: ($.browser.msie || $.browser.safari) ? "FormatBlock" : "heading",
				"arguments": ($.browser.msie || $.browser.safari) ? "<h3>" : "h3",
				tags: ["h3"],
				tooltip: "Header 3"
			},

			html: {
				groupIndex: 10,
				visible: false,
				exec: function() {
					if (this.viewHTML) {
						this.setContent($(this.original).val());
						$(this.original).hide();
						this.editor.show();
					}
					else {
						this.saveContent();
						$(this.original).css({
							width:	this.element.outerWidth() - 6,
							height: this.element.height() - this.panel.height() - 6,
							resize: "none"
						}).show();
						this.editor.hide();
					}

					this.viewHTML = !(this.viewHTML);
				},
				tooltip: "View source code"
			},

			increaseFontSize: {
				groupIndex: 9,
				visible: false && !($.browser.msie),
				tags: ["big"],
				tooltip: "Increase font size"
			},

			indent: {
				groupIndex: 2,
				visible: true,
				tooltip: "Indent"
			},

			insertHorizontalRule: {
				groupIndex: 6,
				visible: true,
				tags: ["hr"],
				tooltip: "Insert Horizontal Rule"
			},

			insertImage: {
				groupIndex: 6,
				visible: true,
				exec: function() {
					var self = this;

					if ($.wysiwyg.controls && $.wysiwyg.controls.image) {
						$.wysiwyg.controls.image(this);
					}
					else if ($.wysiwyg.autoload) {
						$.wysiwyg.autoload.control("wysiwyg.image.js", function() {
								self.controls.insertImage.exec();
							}
						);
					}
					else {
						console.error("$.wysiwyg.controls.image not defined. You need to include wysiwyg.image.js file");
					}
				},
				tags: ["img"],
				tooltip: "Insert image"
			},

			insertOrderedList: {
				groupIndex: 5,
				visible: true,
				tags: ["ol"],
				tooltip: "Insert Ordered List"
			},

			insertTable: {
				groupIndex: 6,
				visible: true,
				exec: function() {
					var self = this;

					if ($.wysiwyg.controls && $.wysiwyg.controls.table) {
						$.wysiwyg.controls.table(this);
					}
					else if ($.wysiwyg.autoload) {
						$.wysiwyg.autoload.control("wysiwyg.table.js", function() {
								self.controls.insertTable.exec();
							}
						);
					}
					else {
						console.error("$.wysiwyg.controls.table not defined. You need to include wysiwyg.table.js file");
					}
				},
				tags: ["table"],
				tooltip: "Insert table"
			},

			insertUnorderedList: {
				groupIndex: 5,
				visible: true,
				tags: ["ul"],
				tooltip: "Insert Unordered List"
			},

			italic: {
				groupIndex: 0,
				visible: true,
				tags: ["i", "em"],
				css: {
					fontStyle: "italic"
				},
				tooltip: "Italic"
			},

			justifyCenter: {
				groupIndex: 1,
				visible: true,
				tags: ["center"],
				css: {
					textAlign: "center"
				},
				tooltip: "Justify Center"
			},

			justifyFull: {
				groupIndex: 1,
				visible: true,
				css: {
					textAlign: "justify"
				},
				tooltip: "Justify Full"
			},

			justifyLeft: {
				visible: true,
				groupIndex: 1,
				css: {
					textAlign: "left"
				},
				tooltip: "Justify Left"
			},

			justifyRight: {
				groupIndex: 1,
				visible: true,
				css: {
					textAlign: "right"
				},
				tooltip: "Justify Right"
			},

			ltr: {
				groupIndex: 10,
				visible: false,
				exec: function() {
					var selection = this.documentSelection();
					if ($("<div/>").append(selection).children().length > 0) {
						selection = $(selection).attr("dir", "ltr");
					}
					else {
						selection = $("<div/>").attr("dir", "ltr").append(selection);
					}
					this.editorDoc.execCommand("inserthtml", false, $("<div/>").append(selection).html());
				},
				tooltip : "Left to Right"
			},

			outdent: {
				groupIndex: 2,
				visible: true,
				tooltip: "Outdent"
			},

			paste: {
				groupIndex: 8,
				visible: false,
				tooltip: "Paste"
			},

			redo: {
				groupIndex: 4,
				visible: true,
				tooltip: "Redo"
			},

			removeFormat: {
				groupIndex: 10,
				visible: true,
				exec: function() {
					this.removeFormat();
				},
				tooltip: "Remove formatting"
			},

			rtl: {
				groupIndex: 10,
				visible: false,
				exec: function() {
					var selection = this.documentSelection();
					if ($("<div/>").append(selection).children().length > 0) {
						selection = $(selection).attr("dir", "rtl");
					}
					else {
						selection = $("<div/>").attr("dir", "rtl").append(selection);
					}
					this.editorDoc.execCommand("inserthtml", false, $("<div/>").append(selection).html());
				},
				tooltip : "Right to Left"
			},

			strikeThrough: {
				groupIndex: 0,
				visible: true,
				tags: ["s", "strike"],
				css: {
					textDecoration: "line-through"
				},
				tooltip: "Strike-through"
			},

			subscript: {
				groupIndex: 3,
				visible: true,
				tags: ["sub"],
				tooltip: "Subscript"
			},

			superscript: {
				groupIndex: 3,
				visible: true,
				tags: ["sup"],
				tooltip: "Superscript"
			},

			underline: {
				groupIndex: 0,
				visible: true,
				tags: ["u"],
				css: {
					textDecoration: "underline"
				},
				tooltip: "Underline"
			},

			undo: {
				groupIndex: 4,
				visible: true,
				tooltip: "Undo"
			}
		};

		this.defaults = {
			html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">STYLE_SHEET</head><body style="margin: 0px;">INITIAL_CONTENT</body></html>',
			debug: false,
			controls: {},
			css: {},
			events: {},
			autoGrow: false,
			autoload: {"css": ["jquery.wysiwyg.css", "jquery.wysiwyg.modal.css"]},
			autoSave: true,
			brIE: true,					// http://code.google.com/p/jwysiwyg/issues/detail?id=15
			formHeight: 270,
			formWidth: 440,
			i18n: false,
			iFrameClass: null,
			initialContent: "<p>Initial content</p>",
			maxHeight: 10000,			// see autoGrow
			messages: {
				nonSelection: "Select the text you wish to link"
			},
			panelHtml: '<ul role="menu" class="panel"></ul>',
			resizeOptions: false,
			rmUnusedControls: false,	// https://github.com/akzhan/jwysiwyg/issues/52
			rmUnwantedBr: true,			// http://code.google.com/p/jwysiwyg/issues/detail?id=11
			tableFiller: "Lorem ipsum"
		};

		this.availableControlProperties = [
			"arguments",
			"callback",
			"className",
			"command",
			"css",
			"custom",
			"exec",
			"groupIndex",
			"icon",
			"tags",
			"tooltip",
			"visible"
		];

		this.editor		= null;
		this.editorDoc	= null;
		this.element	= null;
		this.options	= {};
		this.original	= null;
		this.panel		= null;
		this.savedRange	= null;
		this.timers		= [];

		this.addHoverClass = function() {
			$(this).addClass("wysiwyg-button-hover");
		};

		this.appendControls = function() {
			var controls = this.parseControls();
			var currentGroupIndex	= 0;
			var hasVisibleControls = true; // to prevent separator before first item
			var i, controlName, control; // jslint wants all vars at top of function
			var groups = [];
			var controlsByGroup = {};

			$.each(controls, function(name, c) {
				var index = "empty";

				if (undefined !== c.groupIndex) {
					if ("" === c.groupIndex) {
						index = "empty";
					}
					else {
						index = c.groupIndex;
					}
				}
				
				if (undefined === controlsByGroup[index]) {
					groups.push(index);
					controlsByGroup[index] = {};
				}
				controlsByGroup[index][name] = c;
			});

			groups.sort(function (a, b) { return (a - b); });

			for (i = 0; i < groups.length; i++) {
				for (controlName in controlsByGroup[groups[i]]) {
					control = controls[controlName];
					if (control.groupIndex && currentGroupIndex !== control.groupIndex) {
						currentGroupIndex = control.groupIndex;
						hasVisibleControls = false;
					}

					if (!control.visible) {
						continue;
					}

					if (!hasVisibleControls) {
						this.appendMenuSeparator();
						hasVisibleControls = true;
					}

					if (control.custom) {
						this.appendMenuCustom(
							control.command || controlName,
							control);
					}
					else {
						var tooltip = control.tooltip || control.command || controlName || "";
						if ($.wysiwyg.i18n) {
							tooltip = $.wysiwyg.i18n.t(tooltip);
						}
						this.appendMenu(
							control.command || controlName,
							control["arguments"] || "",
							control.className || control.command || controlName || "empty",
							control.exec,
							tooltip
						);
					}
				}
			}
		};

		this.appendMenu = function(cmd, args, className, fn, tooltip) {
			var self = this;
			args = args || [];

			return $('<li role="menuitem" unselectable="on">' + (className || cmd) + "</li>")
				.addClass(className || cmd)
				.attr("title", tooltip)
				.hover(this.addHoverClass, this.removeHoverClass)
				.click(function() {
					if (fn) {
						fn.apply(self);
					}
					else {
						self.focus();
						self.withoutCss();
						// when click <Cut>, <Copy> or <Paste> got "Access to XPConnect service denied" code: "1011"
						// in Firefox untrusted JavaScript is not allowed to access the clipboard
						try {
							self.editorDoc.execCommand(cmd, false, args);
						}
						catch(e) {
							console.error(e);
						}
					}
					if (self.options.autoSave) {
						self.saveContent();
					}
					this.blur();
					self.focusEditor();
				})
				.appendTo(this.panel);
		};

		this.appendMenuCustom = function(name, control) {
			var self = this;

			if (control.callback) {
				$(window).bind("trigger-" + name + ".wysiwyg", control.callback);
			}

			return $('<li role="menuitem" unselectable="on" style="background: url(\'' + control.icon + '\') no-repeat;"></li>')
				.addClass("custom-command-" + name)
				.addClass("wysiwyg-custom-command")
				.addClass(name)
				.attr("title", control.tooltip)
				.hover(this.addHoverClass, this.removeHoverClass)
				.click(function() {
					if (control.exec) {
						control.exec.apply(self);
					}
					else {
						self.focus();
						self.withoutCss();
						// when click <Cut>, <Copy> or <Paste> got "Access to XPConnect service denied" code: "1011"
						// in Firefox untrusted JavaScript is not allowed to access the clipboard
						try {
							if (control.command) {
								self.editorDoc.execCommand(control.command, false, control.args);
							}
						}
						catch(e) {
							console.error(e);
						}
					}

					if (self.options.autoSave) {
						self.saveContent();
					}
					this.blur();
					self.focusEditor();
					self.triggerCallback(name);
				})
				.appendTo(this.panel);
		};

		this.appendMenuSeparator = function() {
			return $('<li role="separator" class="separator"></li>').appendTo(this.panel);
		};

		this.autoSaveFunction = function() {
			this.saveContent();
		};

		this.checkTargets = function(element) {
			var self = this;

			$.each(this.options.controls, function(name, control) {
				var className = control.className || control.command || name || "empty";
				var tags, elm, css, el;
				var checkActiveStatus = function(cssProperty, cssValue) {
					if (el.css(cssProperty).toString().toLowerCase() === cssValue) {
						$("." + className, self.panel).addClass("active");
					}
				};

				$("." + className, self.panel).removeClass("active");

				if (control.tags || (control.options && control.options.tags)) {
					tags = control.tags || (control.options && control.options.tags);

					elm = element;
					while (elm) {
						if (elm.nodeType !== 1) {
							break;
						}

						if ($.inArray(elm.tagName.toLowerCase(), tags) !== -1) {
							$("." + className, self.panel).addClass("active");
						}

						elm = elm.parentNode;
					}
				}

				if (control.css || (control.options && control.options.css)) {
					css = control.css || (control.options && control.options.css);
					el = $(element);

					while (el) {
						if (el[0].nodeType !== 1) {
							break;
						}
						$.each(css, checkActiveStatus);

						el = el.parent();
					}
				}
			});
		};

		this.designMode = function() {
			var attempts = 3;
			var self = this;
			var runner = function(attempts) {
				if ("on" === self.editorDoc.designMode) {
					if (self.timers.designMode) {
						clearTimeout(self.timers.designMode);
					}

					// IE needs to reget the document element (this.editorDoc) after designMode was set
					if (self.innerDocument() !== self.editorDoc) {
						self.initFrame();
					}

					return;
				}

				try {
					self.editorDoc.designMode = "on";
				}
				catch(e) {
				}

				attempts--;
				if (attempts > 0) {
					self.timers.designMode = setTimeout(function() { runner(attempts); }, 100);
				}
			};

			runner(attempts);
		};

		this.destroy = function() {
			var i, $form = this.element.closest("form");

			for (i = 0; i < this.timers.length; i++) {
				clearTimeout(this.timers[i]);
			}
			
			// Remove bindings
			$form.unbind(".wysiwyg");
			this.element.remove();
			$.removeData(this.original, "wysiwyg");
			$(this.original).show();
			return this;
		};

		this.documentSelection = function() {
			if (this.editor.get(0).contentWindow.document.selection) {
				return this.editor.get(0).contentWindow.document.selection.createRange().text;
			}
			else {
				return this.editor.get(0).contentWindow.getSelection().toString();
			}
		};
//not used?
		this.execute = function(command, arg) {
			if (typeof(arg) === "undefined") {
				arg = null;
			}
			this.editorDoc.execCommand(command, false, arg);
		};

		this.extendOptions = function(options) {
			var controls = {}, namesToRemove = [];

			/**
			 * If the user set custom controls, we catch it, and merge with the
			 * defaults controls later.
			 */
			if ("object" === typeof options.controls) {
				controls = options.controls;
				delete options.controls;
			}

			options = $.extend(true, {}, this.defaults, options);
			options.controls = $.extend(true, this.controls, controls);

			if (options.rmUnusedControls) {
				$.each(options.controls, function(controlName) {
					if (!controls[controlName]) {
						namesToRemove.push(controlName);
					}
				});

				$.each(namesToRemove, function(name) {
					delete options.controls[namesToRemove[name]];
				});
			}

			return options;
		};

		this.focus = function() {
			this.editor.get(0).contentWindow.focus();
			return this;
		};

		this.focusEditor = function() {
			if (this.savedRange !== null) {
				if (window.getSelection) { //non IE and there is already a selection
					var s = window.getSelection();
					if (s.rangeCount > 0) {
						s.removeAllRanges();
					}
					try {
						s.addRange(this.savedRange);
					}
					catch(e) {
						console.error(e);
					}
				}
				else if (document.createRange) { //non IE and no selection
					window.getSelection().addRange(this.savedRange);
				}
				else if (document.selection) { //IE
					this.savedRange.select();
				}
			}
		};

		this.getContent = function() {
			return $(this.innerDocument()).find("body").html();
		};

		this.getElementByAttributeValue = function(tagName, attributeName, attributeValue) {
			var i, value, elements = this.editorDoc.getElementsByTagName(tagName);

			for (i = 0; i < elements.length; i++) {
				value = elements[i].getAttribute(attributeName);

				if ($.browser.msie) {
					/** IE add full path, so I check by the last chars. */
					value = value.substr(value.length - attributeValue.length);
				}

				if (value === attributeValue) {
					return elements[i];
				}
			}

			return false;
		};

//2 times
		this.getInternalRange = function() {
			var selection = this.getInternalSelection();

			if (!selection) {
				return null;
			}

			return (selection.rangeCount > 0) ? selection.getRangeAt(0) : (selection.createRange ? selection.createRange() : null);
		};
// 2 times
		this.getInternalSelection = function() {
			return (this.editor.get(0).contentWindow.getSelection) ? this.editor.get(0).contentWindow.getSelection() : this.editor.get(0).contentDocument.selection;
		};
// used once in initFrame
		this.getRange = function() {
			var selection = this.getSelection();

			if (!selection) {
				return null;
			}

			return (selection.rangeCount > 0) ? selection.getRangeAt(0) : (selection.createRange ? selection.createRange() : null);
		};
//used once in getRange
		this.getSelection = function() {
			return (window.getSelection) ? window.getSelection() : document.selection;
		};

		// :TODO: you can type long string and letters will be hidden because of overflow
		this.grow = function() {
			var innerBody = $(this.innerDocument().body);
			var innerHeight = $.browser.msie ? innerBody[0].scrollHeight : innerBody.height() + 2 + 20; // 2 - borders, 20 - to prevent content jumping on grow

			var minHeight = this.initialHeight;
			var height = Math.max(innerHeight, minHeight);
			height = Math.min(height, this.options.maxHeight);

			this.editor.attr("scrolling", height < this.options.maxHeight ? "no" : "auto"); // hide scrollbar firefox
			innerBody.css("overflow", height < this.options.maxHeight ? "hidden" : ""); // hide scrollbar chrome

			this.editor.get(0).height = height;
			return this;
		};

		this.init = function(element, options) {
			var self = this;
			var $form = $(element).closest("form");
			var i,
				newX = element.width || element.clientWidth || 0,
				newY = element.height || element.clientHeight || 0;

			this.options	= this.extendOptions(options);
			this.original	= element;
			this.panel		= $(this.options.panelHtml);

			if (this.options.autoload) {
				if ($.wysiwyg.autoload) {
					if (this.options.autoload.css) {
						for (i = 0; i < this.options.autoload.css.length; i++) {
							$.wysiwyg.autoload.css(this.options.autoload.css[i]);
						}
					}
				}
			}

			if (this.options.i18n && $.wysiwyg.i18n) {
				$.wysiwyg.i18n.init(this, this.options.i18n);
			}

			if ($.browser.msie && parseInt($.browser.version, 10) < 8) {
				this.options.autoGrow = false;
			}

			if (newX === 0 && element.cols) {
				newX = (element.cols * 8) + 21;

				// fix for issue 30 ( http://github.com/akzhan/jwysiwyg/issues/issue/30 )
				element.cols = 1;
			}
			if (newY === 0 && element.rows) {
				newY = (element.rows * 16) + 16;

				// fix for issue 30 ( http://github.com/akzhan/jwysiwyg/issues/issue/30 )
				element.rows = 1;
			}

			this.editor = $(location.protocol === "https:" ? '<iframe src="javascript:false;"></iframe>' : "<iframe></iframe>").attr("frameborder", "0");

			if (this.options.iFrameClass) {
				this.editor.addClass(this.options.iFrameClass);
			}
			else {
				this.editor.css({
					minHeight: (newY - 6).toString() + "px",
					// fix for issue 12 ( http://github.com/akzhan/jwysiwyg/issues/issue/12 )
					width: (newX > 50) ? (newX - 8).toString() + "px" : ""
				});
				if ($.browser.msie && parseInt($.browser.version, 10) < 7) {
					this.editor.css("height", newY.toString() + "px");
				}
			}
			/**
			 * http://code.google.com/p/jwysiwyg/issues/detail?id=96
			 */
			this.editor.attr("tabindex", $(element).attr("tabindex"));

			this.appendControls();
			this.element = $("<div/>").addClass("wysiwyg").append(panel)
				.append($("<div><!-- --></div>")
				.css({
					clear: "both"
				}))
				.append(this.editor);

			if (!this.options.iFrameClass) {
				this.element.css({
					width: (newX > 0) ? newX.toString() + "px" : "100%"
				});
			}

			$(element).hide().before(this.element);

			this.viewHTML = false;

			/**
			 * @link http://code.google.com/p/jwysiwyg/issues/detail?id=52
			 */
			this.initialContent = $(element).val();
			this.initFrame();

			if (this.options.resizeOptions && $.fn.resizable) {
				this.element.resizable($.extend(true, {
					alsoResize: this.editor
				}, this.options.resizeOptions));
			}

			if (this.options.autoSave) {
				$form.bind("submit.wysiwyg", this.autoSaveFunction);
			}

			$form.bind("reset.wysiwyg", self.resetFunction);
		};

		this.initFrame = function() {
			var self = this;
			var style = "";

			/**
			 * @link http://code.google.com/p/jwysiwyg/issues/detail?id=14
			 */
			if (this.options.css && this.options.css.constructor === String) {
				style = '<link rel="stylesheet" type="text/css" media="screen" href="' + this.options.css + '"/>';
			}

			this.editorDoc = this.innerDocument();
			this.designMode();
			this.editorDoc.open();
			this.editorDoc.write(
				this.options.html
				/**
				 * @link http://code.google.com/p/jwysiwyg/issues/detail?id=144
				 */
				.replace(/INITIAL_CONTENT/, function() {
					return self.initialContent;
				})
				.replace(/STYLE_SHEET/, function() {
					return style;
				})
			);
			this.editorDoc.close();

			if ($.browser.msie) {
				/**
				 * Remove the horrible border it has on IE.
				 */
				this.timers.initFrame_IeBorder = setTimeout(function() {
					$(self.editorDoc.body).css("border", "none");
				}, 0);
			}

			$(this.editorDoc).bind("click.wysiwyg", function(event) {
				self.checkTargets(event.target ? event.target : event.srcElement);
			});

			/**
			 * @link http://code.google.com/p/jwysiwyg/issues/detail?id=20
			 */
			$(this.original).focus(function() {
				if ($(this).filter(":visible")) {
					return;
				}
				self.focus();
			});

			$(this.editorDoc).keydown(function(event) {
				var emptyContentRegex = /^<([\w]+)[^>]*>(<br\/?>)?<\/\1>/;
				if (event.keyCode === 8) { // backspace
					var content = self.getContent();
					if (emptyContentRegex.test(content)) { // if content is empty
						event.stopPropagation(); // prevent remove single empty tag
						return false;
					}
				}
				return true;
			});

			if (!$.browser.msie) {
				$(this.editorDoc).keydown(function(event) {
					/* Meta for Macs. tom@punkave.com */
					if (event.ctrlKey || event.metaKey) {
						switch (event.keyCode) {
							case 66:
								// Ctrl + B
								this.execCommand("Bold", false, false);
								return false;
							case 73:
								// Ctrl + I
								this.execCommand("Italic", false, false);
								return false;
							case 85:
								// Ctrl + U
								this.execCommand("Underline", false, false);
								return false;
						}
					}
					return true;
				});
			}
			else if (this.options.brIE) {
				$(this.editorDoc).keydown(function(event) {
					if (event.keyCode === 13) {
						var rng = self.getRange();
						rng.pasteHTML("<br/>");
						rng.collapse(false);
						rng.select();
						return false;
					}
					return true;
				});
			}

			if (this.options.autoSave) {
				/**
				 * @link http://code.google.com/p/jwysiwyg/issues/detail?id=11
				 */
				var handler = function() {
					self.saveContent();
				};
				$(this.editorDoc).keydown(handler).keyup(handler).mousedown(handler).bind($.support.noCloneEvent ? "input.wysiwyg" : "paste.wysiwyg", handler);
			}

			if (this.options.autoGrow) {
				this.initialHeight = $(this.editorDoc).height();
				$(this.editorDoc).find("body").css("border", "1px solid white"); // cancel margin collapsing
				var growHandler = function() {
					self.grow();
				};
				$(this.editorDoc).keyup(growHandler);
				// fix when content height > textarea height
				this.grow();
			}

			if (this.options.css) {
				this.timers.initFrame_Css = setTimeout(function() {
					if (self.options.css.constructor !== String) {
						$(self.editorDoc).find("body").css(self.options.css);
					}
				}, 0);
			}

			if (this.initialContent.length === 0) {
				this.setContent(this.options.initialContent);
			}

			$.each(this.options.events, function(key, handler) {
				$(self.editorDoc).bind(key + ".wysiwyg", handler);
			});

			// restores selection properly on focus
			self.editor.blur(function() {
				self.savedRange = self.getInternalRange();
			});

			$(this.editorDoc.body).addClass("wysiwyg");
			if (this.options.events && this.options.events.save) {
				var saveHandler = this.options.events.save;
				$(self.editorDoc).bind("keyup.wysiwyg", saveHandler);
				$(self.editorDoc).bind("change.wysiwyg",saveHandler);
				if ($.support.noCloneEvent) {
					$(self.editorDoc).bind("input.wysiwyg", saveHandler);
				}
				else {
					$(self.editorDoc).bind("paste.wysiwyg", saveHandler);
					$(self.editorDoc).bind("cut.wysiwyg", saveHandler);
				}
			}
		};

		this.innerDocument = function() {
			var element = this.editor.get(0);

			if (element.nodeName.toLowerCase() === "iframe") {
				if (element.contentWindow) {
					return element.contentWindow.document;
				}
				else {
					return element;
				}
				/*
				 return ( $.browser.msie )
				 ? document.frames[element.id].document
				 : element.contentWindow.document // contentDocument;
				 */
			}
			return element;
		};

		this.insertHtml = function(szHTML) {
			if (!szHTML || szHTML.length === 0) {
				return this;
			}
			
			if ($.browser.msie) {
				this.focus();
				this.editorDoc.execCommand("insertImage", false, "#jwysiwyg#");
				var img = this.getElementByAttributeValue("img", "src", "#jwysiwyg#");
				if (img) {
					$(img).replaceWith(szHTML);
				}
			}
			else {
				this.editorDoc.execCommand("insertHTML", false, szHTML);
			}
			return this;
		};

		this.parseControls = function() {
			var self = this;
			$.each(this.options.controls, function(controlName, control) {
				$.each(control, function(propertyName) {
					if (-1 === $.inArray(propertyName, self.availableControlProperties)) {
						throw controlName + '["' + propertyName + '"]: property "' + propertyName + '" not exists in Wysiwyg.availableControlProperties';
					}
				});
			});

			if (this.options.parseControls) {
				return this.options.parseControls.call(this);
			}
			return this.options.controls;
		};

		this.removeFormat = function() {
			if ($.browser.msie) {
				this.focus();
			}

//			this.editorDoc.execCommand("formatBlock", false, "<p>"); // remove headings
			this.editorDoc.execCommand("removeFormat", false, null);
			this.editorDoc.execCommand("unlink", false, null);
			return this;
		};

		this.removeHoverClass = function() {
			$(this).removeClass("wysiwyg-button-hover");
		};

		this.resetFunction = function() {
			this.setContent(this.initialContent);
			this.saveContent();
		};

		this.saveContent = function() {
			if (this.original) {
				if (this.viewHTML) {
					this.setContent($(this.original).val());
				}

				var content = this.getContent();

				if (this.options.rmUnwantedBr) {
					var brLength = ("<br/>".length) * -1;
					content = (content.substr(brLength) === "<br/>") ? content.substr(0, brLength) : content;
				}

				$(this.original).val(content);
				if (this.options.events && this.options.events.save) {
					this.options.events.save.call(this);
				}
			}
			return this;
		};

		this.setContent = function(newContent) {
			$(this.innerDocument()).find("body").html(newContent);
			return this;
		};

		this.triggerCallback = function(name) {
			$(window).trigger("trigger-" + name + ".wysiwyg", [
				this.getInternalRange(),
				this,
				this.getInternalSelection()
			]);
			$(".custom-command-" + name, this.panel).blur();
			this.focusEditor();
		};

		this.withoutCss = function() {
			if ($.browser.mozilla) {
				try {
					this.editorDoc.execCommand("styleWithCSS", false, false);
				}
				catch(e) {
					try {
						this.editorDoc.execCommand("useCSS", false, true);
					}
					catch(e2) {
					}
				}
			}
			return this;
		};
	}

	/*
	 * Wysiwyg namespace: public properties and methods
	 */
	$.wysiwyg = {
		/**
		 * Custom control support by Alec Gorge ( http://github.com/alecgorge )
		 */
		addControl: function(name, settings) {
			return this.each(function() {
				var oWysiwyg = $(this).data("wysiwyg");

				if (!oWysiwyg) {
					return this;
				}

				var customControl = {};				
				customControl[name] = $.extend(true, {visible: true, custom: true}, settings);
				$.extend(true, oWysiwyg.controls, customControl);

				// render new panel
				oWysiwyg.panel = $(oWysiwyg.options.panelHtml);
				oWysiwyg.appendControls();
				$(".panel", oWysiwyg.element).remove();
				$(oWysiwyg.element).prepend(oWysiwyg.panel);
			});
		},

		clear: function() {
			return this.each(function() {
				var oWysiwyg = $(this).data("wysiwyg");

				if (!oWysiwyg) {
					return this;
				}

				oWysiwyg.setContent("");
				oWysiwyg.saveContent();
			});
		},
		
		console: console, // let our console be available for extensions

		createLink: function(szURL) {
			return this.each(function() {
				var oWysiwyg = $(this).data("wysiwyg");

				if (!oWysiwyg) {
					return this;
				}

				if (!szURL || szURL.length === 0) {
					return this;
				}
	
				var selection = oWysiwyg.documentSelection();
	
				if (selection && selection.length > 0) {
					if ($.browser.msie) {
						oWysiwyg.focus();
					}
					oWysiwyg.editorDoc.execCommand("unlink", false, null);
					oWysiwyg.editorDoc.execCommand("createLink", false, szURL);
				}
				else if (oWysiwyg.options.messages.nonSelection) {
					alert(oWysiwyg.options.messages.nonSelection);
				}
			});
		},

		destroy: function() {
			return this.each(function() {
				var oWysiwyg = $(this).data("wysiwyg");

				if (!oWysiwyg) {
					return this;
				}

				oWysiwyg.destroy();
			});
		},

		"document": function() {
			// no chains because of return
			var oWysiwyg = $(this).data("wysiwyg");

			if (!oWysiwyg) {
				return this;
			}

			return $(oWysiwyg.editorDoc);
		},

		getContent: function() {
			// no chains because of return
			var oWysiwyg = $(this).data("wysiwyg");

			if (!oWysiwyg) {
				return this;
			}

			return oWysiwyg.getContent();
		},

		init: function(options) {
			return this.each(function() {
				var opts = $.extend(true, {}, options);
				var obj;

				// :4fun:
				// remove this textarea validation and change line in this.saveContent function
				// $(this.original).val(content); to $(this.original).html(content);
				// now you can make WYSIWYG editor on h1, p, and many more tags
				if (("textarea" !== this.nodeName.toLowerCase()) || $(this).data("wysiwyg")) {
					return;
				}

				obj = new Wysiwyg();
				obj.init(this, opts);
				$.data(this, "wysiwyg", obj);
			});
		},

		insertHtml: function(szHTML) {
			return this.each(function() {
				var oWysiwyg = $(this).data("wysiwyg");

				if (!oWysiwyg) {
					return this;
				}

				oWysiwyg.insertHtml(szHTML);
			});
		},

		removeFormat: function() {
			return this.each(function() {
				var oWysiwyg = $(this).data("wysiwyg");

				if (!oWysiwyg) {
					return this;
				}

				oWysiwyg.removeFormat();
			});
		},

		save: function() {
			return this.each(function() {
				var oWysiwyg = $(this).data("wysiwyg");

				if (!oWysiwyg) {
					return this;
				}

				oWysiwyg.saveContent();
			});
		},

		setContent: function(newContent) {
			return this.each(function() {
				var oWysiwyg = $(this).data("wysiwyg");

				if (!oWysiwyg) {
					return this;
				}

				oWysiwyg.setContent(newContent);
				oWysiwyg.saveContent();
			});
		}
	};

	$.fn.wysiwyg = function(method) {
		if ("undefined" !== typeof $.wysiwyg[method]) {
			return $.wysiwyg[method].apply(this, Array.prototype.slice.call(arguments, 1));
		}
		else if ("object" === typeof method || !method) {
			return $.wysiwyg.init.apply(this, arguments);
		}
		else {
			console.error("Method " +  method + " does not exist on jQuery.wysiwyg.\nTry to include some extra controls or plugins");
		}
	};
})(jQuery);
