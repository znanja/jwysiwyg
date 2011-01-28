/**
 * Controls: Link plugin
 *
 * Depends on jWYSIWYG
 *
 * By: Esteban Beltran (academo) <sergies@gmail.com>
 */
(function ($) {
	if (undefined === $.wysiwyg) {
		throw "wysiwyg.image.js depends on $.wysiwyg";
	}

	if (!$.wysiwyg.controls) {
		$.wysiwyg.controls = {};
	}

	/*
	* Wysiwyg namespace: public properties and methods
	*/
	$.wysiwyg.controls.link = function (Wysiwyg) {
		var self = Wysiwyg, elements, dialog, szURL, a, selection,
			formLinkHtml = '<form class="wysiwyg"><fieldset><legend>Insert Link</legend>' + 
			'<label>Link URL: <input type="text" name="linkhref" value=""/></label>' +
			'<label>Link Title: <input type="text" name="linktitle" value=""/></label>' +
			'<label>Link Target: <input type="text" name="linktarget" value=""/></label>' + 
			'<input type="submit" class="button" value="Insert Link"/><input type="reset" value="Cancel"/></fieldset></form>';

		a = {
			self: self.dom.getElement("a"), // link to element node
			src: "http://",
			title: "",
			target: ""
		};

		if (a.self) {
			a.href = a.self.href ? a.self.href : "";
			a.title = a.self.title ? a.self.title : "";
			a.target = a.self.target ? a.self.target : "";
		}

		if ($.fn.dialog) {
			elements = $(formLinkHtml);
			elements.find("input[name=linkhref]").val(a.href);
			elements.find("input[name=linktitle]").val(a.title);
			elements.find("input[name=linktarget]").val(a.target);

			if ($.browser.msie) {
				dialog = elements.appendTo(Wysiwyg.editorDoc.body);
			} else {
				dialog = elements.appendTo("body");
			}

			dialog.dialog({
				modal: true,
				width: self.defaults.formWidth,
				height: self.defaults.formHeight,
				open: function (ev, ui) {
					$("input:submit", dialog).click(function (e) {
						e.preventDefault();
						var link,
							szURL = $('input[name="linkhref"]', dialog).val(),
							title = $('input[name="linktitle"]', dialog).val(),
							target = $('input[name="linktarget"]', dialog).val();

						if (a.self) {
							// to preserve all link attributes
							if (szURL && szURL.length > 0) {
								$(a.self).attr("href", szURL).attr("title", title).attr("target", target);
							}
						} else {

							if ($.browser.msie) {
								self.ui.returnRange();
							}

							//Do new link element
							selection = self.getInternalRange();


							if (selection.toString) {
								selection = selection.toString();
							} else if (selection.text) {	// IE
								selection = selection.text;
							}

							if (selection && selection.length > 0) {
								if ($.browser.msie) {
									self.ui.focus();
								}

								if (szURL && szURL.length > 0) {
									self.editorDoc.execCommand("unlink", false, null);
									self.editorDoc.execCommand("createLink", false, szURL);
								}
								a = self.dom.getElement("a");
								$(a).attr("href", szURL).attr("title", title).attr("target", target);
							} else if (self.options.messages.nonSelection) {
								window.alert(self.options.messages.nonSelection);
							}
						}
						$(dialog).dialog("close");
					});
					$("input:reset", dialog).click(function (e) {
						e.preventDefault();
						$(dialog).dialog("close");
					});
				},
				close: function (ev, ui) {
					dialog.dialog("destroy");
				}
			});
		} else {
			if (a.self) {
				szURL = window.prompt("URL", a.href);

				if (szURL && szURL.length > 0) {
					a.href = szURL;
				}
			} else {
				//Do new link element
				selection = self.getInternalRange();

				if (selection.toString) {
					selection = selection.toString();
				} else if (selection.text) {	// IE
					selection = selection.text;
				}

				if (selection && selection.length > 0) {
					if ($.browser.msie) {
						self.ui.focus();
						self.editorDoc.execCommand("createLink", true, null);
					} else {
						szURL = window.prompt("URL", "http://");

						if (szURL && szURL.length > 0) {
							self.editorDoc.execCommand("unlink", false, null);
							self.editorDoc.execCommand("createLink", false, szURL);
						}
					}
				} else if (self.options.messages.nonSelection) {
					window.alert(self.options.messages.nonSelection);
				}
			}
		}
		$(self.editorDoc).trigger("wysiwyg:refresh");
	};

})(jQuery);