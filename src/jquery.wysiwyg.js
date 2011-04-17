/**
 * WYSIWYG - jQuery plugin @VERSION
 * (Pretty girl)
 *
 * Copyright (c) 2008-2009 Juan M Martinez, 2010-2011 Akzhan Abdulin and all contributors
 * https://github.com/akzhan/jwysiwyg
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 */

/*jslint browser: true, forin: true */

(function ($) {

	var console = window.console ? window.console : {
		log: $.noop,
		error: function(msg){ $.error(msg); }
	};

	$.wysiwyg = $.wysiwyg || { version: '@VERSION' };
	 
	// Global configuration. Allows setting configuration information
	// for all editor instances at once.

	$.wysiwyg.config = {
		html: '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"></head><body style="margin: 0px;">INITIAL_CONTENT</body></html>',
		debug: false,
		controls: {},
		init: true,
		css: {},
		events: {},
		autoGrow: false,
		autoSave: true,
		brIE: true,					// http://code.google.com/p/jwysiwyg/issues/detail?id=15
		formHeight: 270,
		formWidth: 440,
		iFrameClass: null,
		initialContent: "<p>Initial content</p>",
		maxHeight: 10000,			// see autoGrow
		maxLength: 0,
		toolbar: false,		// Allow setting a toolbar element directly.
		toolbarHtml: '<ul role="menu" class="toolbar"></ul>',
		removeHeadings: false,
		replaceDivWithP: false,
		resizeOptions: false,
		rmUnusedControls: false,	// https://github.com/akzhan/jwysiwyg/issues/52
		rmUnwantedBr: true,			// http://code.google.com/p/jwysiwyg/issues/detail?id=11
		tableFiller: "Lorem ipsum",
		initialMinHeight: null, 
		
		// Plugin references
		plugins: {}				
	};
	
	// References the active editor instance, useful for having a global toolbar.
	$.wysiwyg.activeEditor = null;
	// Default control list, allows easily adding basic / custom controls to 
	// all editor instances.
	$.wysiwyg.controls = {
		register: function(){
			
		}		
	};
	
	// Utility Functions
	
	function parsePluginName(name) {
		var elements;
		
		if ("string" !== typeof (name)) return false;
		elements = name.split(".");
		
		if (2 > elements.length) return false;
		return {name: elements[0], method: elements[1]};
	}
	
	// Global utility functions
	$.wysiwyg.utils = {
		extraSafeEntities: [["<", ">", "'", '"', " "], [32]],
		encodeEntities: function(str) {
			var self = this, aStr, aRet = [];
			if (this.extraSafeEntities[1].length === 0) {
				$.each(this.extraSafeEntities[0], function (i, ch) {
					self.extraSafeEntities[1].push(ch.charCodeAt());
				});
			}
			aStr = str.split("");
			$.each(aStr, function (i) {
				var iC = aStr[i].charCodeAt();
				if ($.inArray(iC, self.extraSafeEntities[1]) && (iC < 65 || iC > 127 || (iC > 90 && iC < 97))) {
					aRet.push('&#' + iC + ';');
				} else {
					aRet.push(aStr[i]);
				}
			});

			return aRet.join('');
		},
		// Replaces wrapInitialContent to make sure that plain text (usually initial content)
		// at least has a paragraph tag.
		wrapTextContent: function(str){
			var found = str.match(/<\/?p>/gi);
			if(!found) return "<p>" + str + "</p>";
			else{
				// :TODO: checking/replacing
			}
			return str;
		}
	};
	
	// Plugin API
	
	$.wysiwyg.plugin = {
		register: function(data) {
			// Plugins require a name
			if (!data.name) console.error("Plugin name missing");
			// Add the plugin unless it already exists.
			if (!$.wysiwyg[data.name]) $.wysiwyg[data.name] = data;
			return true;
		},
		
		exists: function(name) {
			var plugin;
			if ("string" !== typeof (name)) return false;
			plugin = parsePluginName(name);
			return ($.wysiwyg[plugin.name] || $.wysiwyg[plugin.name][plugin.method]);
		}
	};
	
	// TODO: Dialog API
	// Unifies dialog methods to allow custom implementations
	$.wysiwyg.dialog = {
		// Opens a dialog with the specified content
		open:  function(content){},
		// Closes the dialog window
		close: function(){},
		// Callbacks
		beforeOpen: function(){},
		afterOpen:  function(){},
		beforeClose: function(){},
		afterClose:  function(){}
	};
	
	// Wysiwyg
	
	function Wysiwyg(el, conf) {
		
		var self 		  = this,
			editor		  = null,
			editorDoc	  = null,
			element		  = null, // To be compatable with original code?
			events		  = {},
			form 		  = null,
			handler,			
			isDestroyed   = true,
			options		  = $.extend({}, $.wysiwyg.config, conf),
			original	  = $(el),
			savedRange	  = null,
			timers		  = [],				
			ui			  =	{},	
			validKeyCodes = [8, 9, 13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46],
			viewHTML,
			// creating an array to make it easier to expand later.
			callbackMethods = [
				"onBeforeInit", "onInit",
				"onFrameInit",
				"beforeCreate", "afterCreate",
				"beforeDestroy", "afterDestroy",
				"beforeSave", "afterSave"
			];
			
		// Allows the ability to trigger events easily.
		// ie: handler.trigger('onInit', [opts])
		handler       = el.add(self);
		
		//////////////////////////////////////////////////////////////////////////////
		// Private functions
		//////////////////////////////////////////////////////////////////////////////
		
		// Enable deignMode
		function designMode(){
			var attempts = 3,
				runner = function(attempts) {
					if("on" === editorDoc.designMode) {
						if (timers.designMode) window.clearTimeout(timers.designMode);
						// IE needs to reget the document element (this.editorDoc) after designMode was set
						if (innerDocument() !== editorDoc) initFrame();
						return;
					}

					try {
						editorDoc.designMode = "on";
					}catch(e){}

					attempts -= 1;
					if(attempts > 0) timers.designMode = window.setTimeout(function() { runner(attempts); }, 100);
				};

			runner(attempts);
		}
		
		// Get the selection range, functions for editor instance, and within the editor.
		function getInternalRange() {
			var selection = getInteralSelection();
			if (!selection) return null;

			if (selection.rangeCount && selection.rangeCount > 0) return selection.getRangeAt(0); // w3c
			else if (selection.createRange) return selection.createRange(); // IE
			return null;
		};
		
		function getRange() {
			var selection = getSelection();
			if (!selection) return null;
			if (selection.rangeCount && selection.rangeCount > 0) selection.getRangeAt(0); // w3c
			else if (selection.createRange) return selection.createRange(); // IE
			return null;
		};
		
		function getRangeText() {
			var rng = getInternalRange();
			if(rng.toString) rng   = rng.toString();
			else if (rng.text) rng = rng.text; // IE
			return rng;
		};

		function getInternalSelection() {
			// Firefox: document.getSelection is deprecated
			if (editor.get(0).contentWindow) {
				if (editor.get(0).contentWindow.getSelection) 	return editor.get(0).contentWindow.getSelection();
				if (editor.get(0).contentWindow.selection) 		return editor.get(0).contentWindow.selection;
			}
			if (editorDoc.getSelection) 	return editorDoc.getSelection();
			if (editorDoc.selection) 		return editorDoc.selection;

			return null;
		};
		
		function getSelection() {
			return (window.getSelection) ? window.getSelection() : window.document.selection;
		};
		
		function initEditor(){
			var newX = (original.width || original.clientWidth || 0),
				newY = (original.height || original.clientHeight || 0),
				i;

			form = original.closest("form");
			if ($.browser.msie && parseInt($.browser.version, 10) < 8) options.autoGrow = false;

			if (newX === 0 && original.cols) newX = (original.cols * 8) + 21;

			// fix for issue 30 ( http://github.com/akzhan/jwysiwyg/issues/issue/30 ) 
			//element.cols = 1;
			
			if (newY === 0 && original.rows) newY = (original.rows * 16) + 16;

			// fix for issue 30 ( http://github.com/akzhan/jwysiwyg/issues/issue/30 )
			//element.rows = 1;
			
			editor = $(window.location.protocol === "https:" ? '<iframe src="javascript:false;"></iframe>' : "<iframe></iframe>").attr("frameborder", "0");
			
			if (options.iFrameClass) editor.addClass(options.iFrameClass);
			else {
				editor.css({
					minHeight: (newY - 6).toString() + "px",
					// fix for issue 12 ( http://github.com/akzhan/jwysiwyg/issues/issue/12 )
					width: (newX > 50) ? (newX - 8).toString() + "px" : ""
				});
				if ($.browser.msie && parseInt($.browser.version, 10) < 7) editor.css("height", newY.toString() + "px");
			}
			/**
			 * http://code.google.com/p/jwysiwyg/issues/detail?id=96
			 */
			editor.attr("tabindex", original.attr("tabindex"));
			element = $("<div/>").addClass("wysiwyg");

			if (!options.iFrameClass) {
				element.css({
					width: (newX > 0) ? newX.toString() + "px" : "100%"
				});
			}
			
			original.hide().before(element);
			viewHTML = false;
			initialContent = original.val();
			if (options.resizeOptions && $.fn.resizable) {
				element.resizable($.extend(true, {
					alsoResize: this.editor
				}, options.resizeOptions));
			}
			
			// AutoSave when the form is submitted
			if (options.autoSave) form.bind("submit.wysiwyg", function() { self.save(); });

			form.bind("reset.wysiwyg", function() { self.clear(); });
			initFrame();
			return self;
			
		};
		
		function initFrame(){
			var stylesheet,
				growHandler,
				saveHandler;
			
			if (options.toolbar) {
				ui.toolbar = $(options.toolbar);
			}else{
				ui.toolbar = $(options.toolbarHTML);
				element.append(ui.toolbar)
					.append($("<div><!-- --></div>")
						.css({
							clear: "both"
						}))
					.append(editor);
				editorDoc = innerDocument();
			}
			
			designMode();
			editorDoc.open();
			editorDoc.write(
				options.html
					/**
					 * @link http://code.google.com/p/jwysiwyg/issues/detail?id=144
					 */
					.replace(/INITIAL_CONTENT/, $.wysiwyg.utils.wrapTextContent(options.initialContent)));
			editorDoc.close();
			
			// TODO: Check this against plugin / namespace changes.
			//$.wysiwyg.plugin.bind(self);
			
			// Setup any necessary events on the editor's document
			$(editorDoc)
				.trigger("initFrame.wysiwyg")
				.bind("click.wysiwyg", function(event) {
					ui.checkTargets(event.target ? event.target : event.srcElement);
				})
				.keydown(function(event) {
					var emptyContentRegex;
					if (event.keyCode === 0) { // backspace
						emptyContentRegex = /^<([\w]+)[^>]*>(<br\/?>)?<\/\1>$/;
						
						// Check for empty content
						if (emptyContentRegex.test(self.getContent())) {
							event.stopPropagation();
							return false;
						}
					}
					return true;
				})
				// Handle control hotkeys
				.keydown(function(event) {
					var controlName, rng;
					
					if(!$.browser.msie){
						/* Meta for Macs. tom@punkave.com */
						if(event.ctrlKey || event.metaKey){
							for(controlName in options.controls){
								if(options.controls[controlName].hotkey && options.controls[controlName].hotkey.ctrl){
									if(event.keyCode === options.controls[controlName].hotkey.key){
										self.triggerControl.apply(self, [controlName, options.controls[controlName]]);
										return false;
									}
								}
							}
						}
						return false;
						
					}else if(options.brIE && event.keyCode === 13){
						rng = getRange();
						rng.pasteHTML("<br />");
						rng.collapse(false);
						rng.select();
						return false;
							
					}else return true;

				});
			
			// Ensure editor content doesn't get longer than the maxLength 
			// setting if it was provided and greater than 0	
			if(options.maxLength > 0 ){	
				$(editorDoc).keydown(function(event){
					if($(editorDoc).text().length >= options.maxLength && $.inArray(event.which, validKeyCodes) == -1) event.preventDefault();
				});
			}
				
			// Setup a list of events that should autoSave.
			if(options.autoSave){
				$(editorDoc).bind('keydown keyup mousedown', function(event){ self.save(); })
					.bind(($.support.noCloneEvent ? "input.wysiwyg" : "paste.wysiwyg"), function(event){ self.save(); });
			}

			// @link http://code.google.com/p/jwysiwyg/issues/detail?id=20
			original.focus(function () {
				if ($(this).filter(":visible")) return;
				ui.focus();
			});
			
			// Setup editor css
			if(options.css) {				
				// A url to a CSS file was passed.
				if($.type(options.css) == "string"){ 
					if ($.browser.msie) stylesheet = $(editorDoc.createStyleSheet(options.css)).attr({'media':'all'});
					else{
						stylesheet = $("<link/>").attr({
							"href" : options.css,
							"media": "all",
							"rel"  : "stylesheet",
							"type" : "text/css"
						}).appendTo($(editorDoc).find("head"));
					}
					
				// An object of CSS options was passed.
				}else editor.ready(function(){ $(editorDoc.body).css(options.css); });
			}
			
			// Expose document events on the editor document so
			// users can hook into them as necessary.
			$.each(options.events, function (key, func){
				$(editorDoc).bind(key + ".wysiwyg", function(event){
					// Trigger event handler, providing the event and api.
					func.apply(editorDoc, [event, self]);
				});
			});

			// Saves the selection on blur/deactivate so it can be restored on focus.
			if($.browser.msie) {
				// Event chain: beforedeactivate => focusout => blur.
				// Focusout & blur fired too late to handle internalRange() in dialogs.
				// When clicked on input boxes both got range = null
				$(editorDoc)
					.bind("beforedeactivate.wysiwyg", function(event) {
						savedRange = getInternalRange();						
					});
			}else {				
				$(editorDoc)
					.bind("blur.wysiwyg", function(event){
						savedRange = getInternalRange();						
					});
			}
			
			$(editorDoc).bind('focusin.wysiwyg', function(event){
				$.wysiwyg.activeEditor = self;
			});
			
			$(editorDoc.body).addClass("wysiwyg");
			
			// Setup save callbacks
			if(options.events.save && $.isFunction(options.events.save)) {
				saveHandler = options.events.save;
				$(editorDoc)
					.bind("keyup.wysiwyg", saveHandler)
					.bind("change.wysiwyg", saveHandler);

				if($.support.noCloneEvent) $(editorDoc).bind("input.wysiwyg", saveHandler);
				else {
					$(editorDoc)
						.bind("paste.wysiwyg", saveHandler)
						.bind("cut.wysiwyg", saveHandler);
				}
			}
			
		};
		
		function innerDocument() {
			var doc = $(editor).get(0);
			if (doc.nodeName.toLowerCase() === "iframe") {
				if(doc.contentDocument) return doc.contentDocument; // Gecko
				else if(doc.contentWindow) return doc.contentWindow.document; // IE
				console.error("Unexpected error in innerDocument");
			}
			return doc;
		};
		
		//////////////////////////////////////////////////////////////////////////////
		// UI / Interface
		//////////////////////////////////////////////////////////////////////////////
		
		ui.checkTargets = function(target){
			
		};
		
		// Focus the editor window
		ui.focus = function () {
			editor.get(0).contentWindow.focus();
			return self;
		};
			
		//////////////////////////////////////////////////////////////////////////////
		// API Functionality
		//////////////////////////////////////////////////////////////////////////////
		
		$.extend(self, {
			
			// Adds a control to the toolbar
			addControl: function(){},
			// Clear all editor content and save
			clear: function(){},
			// Access the console for development
			console: function(){},			
			// Destroy the editor instance
			destroy: function(){
				isDestroyed = true;
				return self;
			},			
			// Get the current content of the editor
			getContent: function(){
				return editorDoc.body.innerHTML;
			},
			// Allow access to the configuration options of this editor instance
			getConfig: function(){
				return options;
			},
			// Get a reference to the textarea
			getTextarea: function(){
				return original;
			},			
			// Initialize an editor instance on the target object
			init: function(){				
				// Only init once.
				if(!isDestroyed) return self;
				//onBeforeInit callback
				handler.trigger('onBeforeInit', [self]);
				initEditor();
				handler.trigger('onInit', [self]);
				return self;
			},
			
			// Insert HTML at the cursor location
			insertHTML: function(){},
			// Remove formatting for the current selection
			removeFormat: function(){},
			// Allow for forced refreshing of content (to re-size etc)
			refresh: function(){
				
			},
			// Save the content to the textarea
			save: function(){
				var event, result;
				// Before save callback. Plugins can capture this to process content pre-save
				// they can also stop propagation if necessary.
				event  = $.Event("beforeSave"); 
				result = handler.trigger(event, [self]);
				if(event.isDefaultPrevented() || !result) return self;
				original.val(self.getContent());
				// Trigger after save callback
				handler.trigger('afterSave', [self]);
				return self;
			},
			// Select all content in the document
			selectAll: function(){
				
			},
			// Set new content
			setContent: function(){
				
			},
			// Trigger a control callback
			triggerControl: function(){},
			// Access to controlbar
			ui: ui			
			
		});
		
		// Load and activate any plugins requested.
		$.each(options.plugins, function(name, conf){
			
		});		
		
		// Callback methods. Configures callbacks on a per-instance basis as well as 
		// a global basis.	
		$.each(callbackMethods, function(i, name) {
				
			// Callback per instance
			if($.isFunction(options[name])) $(self).bind(name, options[name]); 
			// API / Internal callbacks
			self[name] = function(fn) {
				if (fn){ $(self).bind(name, fn); }
				return self;
			};
			
		});
		
		if(options.init) return self.init();
		return self;
		
	}
	
	// jQuery function method.
	
	$.fn.wysiwyg = function(opts) {
		// If editor exists, return API access.
		var api = this.data("wysiwyg");
		if(api) return api;

		config = $.extend({}, $.wysiwyg.config, opts);
		
		this.each(function() {			
			editor = new Wysiwyg($(this), config);
			$(this).data("wysiwyg", editor);	
		});
		
		return this; 
		
	};

})(jQuery);
