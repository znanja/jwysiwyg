/**
 * Controls: Image plugin
 * 
 * Depends on jWYSIWYG
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
	$.wysiwyg.controls.image = function (Wysiwyg) {
		var self = Wysiwyg, elements, dialog, szURL,
			formImageHtml = '<form class="wysiwyg"><fieldset><legend>Insert Image</legend><label>Image URL: <input type="text" name="src" value=""/></label><label>Image Title: <input type="text" name="imgtitle" value=""/></label><label>Image Description: <input type="text" name="description" value=""/></label><input type="submit" class="button" value="Insert Image"/> <input type="reset" value="Cancel"/></fieldset></form>',
			img = {
				alt: "",
				self: Wysiwyg.dom.getElement("img"), // link to element node
				src: "http://",
				title: ""
			};

		if (img.self) {
			img.src = img.self.src ? img.self.src : "";
			img.alt = img.self.alt ? img.self.alt : "";
			img.title = img.self.title ? img.self.title : "";
		}

		if ($.modal) {
			elements = $(formImageHtml);
			elements.find('input[name="src"]').val(img.src);
			elements.find('input[name="imgtitle"]').val(img.title);
			elements.find('input[name="description"]').val(img.alt);

			$.modal(elements, {
				onShow: function (dialog) {
					$("input:submit", dialog.data).click(function (e) {
						e.preventDefault();
						var image,
							szURL = $('input[name="src"]', dialog.data).val(),
							title = $('input[name="imgtitle"]', dialog.data).val(),
							description = $('input[name="description"]', dialog.data).val();

						if (img.self) {
							// to preserve all img attributes
							$(img.self).attr("src", szURL).attr("title", title).attr("description", description);
						} else {
							image = "<img src='" + szURL + "' title='" + title + "' alt='" + description + "' />";
							self.insertHtml(image);
						}
						$.modal.close();
					});
					$("input:reset", dialog.data).click(function (e) {
						e.preventDefault();
						$.modal.close();
					});
				},
				maxWidth: self.defaults.formWidth,
				maxHeight: self.defaults.formHeight,
				overlayClose: true
			});
		} else if ($.fn.dialog) {
			elements = $(formImageHtml);
			elements.find("input[name=src]").val(img.src);
			elements.find("input[name=imgtitle]").val(img.title);
			elements.find("input[name=description]").val(img.alt);

			dialog = elements.appendTo("body");
			dialog.dialog({
				modal: true,
				width: self.defaults.formWidth,
				height: self.defaults.formHeight,
				open: function (ev, ui) {
					$("input:submit", dialog).click(function (e) {
						e.preventDefault();
						var image,
							szURL = $('input[name="src"]', dialog).val(),
							title = $('input[name="imgtitle"]', dialog).val(),
							description = $('input[name="description"]', dialog).val();

						if (img.self) {
							// to preserve all img attributes
							$(img.self).attr("src", szURL).attr("title", title).attr("description", description);
						} else {
							image = "<img src='" + szURL + "' title='" + title + "' alt='" + description + "' />";
							self.insertHtml(image);
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
			if ($.browser.msie) {
				self.ui.focus();
				self.editorDoc.execCommand("insertImage", true, null);
			} else {
				szURL = window.prompt("URL", img.src);
				if (szURL && szURL.length > 0) {
					if (img.self) {
						// to preserve all img attributes
						$(img.self).attr("src", szURL);
					} else {
						self.editorDoc.execCommand("insertImage", false, szURL);
					}
				}
			}
		}

		$(self.editorDoc).trigger("wysiwyg:refresh");
	};

	$.wysiwyg.insertImage = function (object, szURL, attributes) {
		if ("object" !== typeof (object) || !object.context) {
			object = this;
		}

		if (!object.each) {
			console.error("Something goes wrong, check object");
		}

		return object.each(function () {
			var self = $(this).data("wysiwyg"),
				image,
				attribute;

			if (!self) {
				return this;
			}

			if (!szURL || szURL.length === 0) {
				return this;
			}

			if ($.browser.msie) {
				self.ui.focus();
			}

			if (attributes) {
				self.editorDoc.execCommand("insertImage", false, "#jwysiwyg#");
				image = self.getElementByAttributeValue("img", "src", "#jwysiwyg#");

				if (image) {
					image.src = szURL;

					for (attribute in attributes) {
						if (attributes.hasOwnProperty(attribute)) {
							image.setAttribute(attribute, attributes[attribute]);
						}
					}
				}
			} else {
				self.editorDoc.execCommand("insertImage", false, szURL);
			}

			$(self.editorDoc).trigger("wysiwyg:refresh");

			return this;
		});
	};
})(jQuery);