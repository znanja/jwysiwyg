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
	$.wysiwyg.controls.image = {
		groupIndex: 6,
		visible: true,
		exec: function () {
			$.wysiwyg.controls.image.init(this);
		},
		tags: ["img"],
		tooltip: "Insert image",	
		init: function (Wysiwyg) {
			var self = this, elements, dialog, formImageHtml,
				formTextLegend, formTextPreview, formTextUrl, formTextTitle,
				formTextDescription, formTextWidth, formTextHeight, formTextOriginal,
				formTextFloat, formTextFloatNone, formTextFloatLeft, formTextFloatRight,
				formTextSubmit, formTextReset,
				img = {
					alt: "",
					self: Wysiwyg.dom ? Wysiwyg.dom.getElement("img") : null, // link to element node
					src: "http://",
					title: ""
				};

			formTextLegend  = "Insert Image";
			formTextPreview = "Preview";
			formTextUrl     = "URL";
			formTextTitle   = "Title";
			formTextDescription = "Description";
			formTextWidth   = "Width";
			formTextHeight  = "Height";
			formTextOriginal = "Original W x H";
			formTextFloat	= "Float";
			formTextFloatNone = "None";
			formTextFloatLeft = "Left";
			formTextFloatRight = "Right";
			formTextSubmit  = "Insert Image";
			formTextReset   = "Cancel";

			if ($.wysiwyg.i18n) {
				formTextLegend = $.wysiwyg.i18n.t(formTextLegend, "dialogs.image");
				formTextPreview = $.wysiwyg.i18n.t(formTextPreview, "dialogs.image");
				formTextUrl = $.wysiwyg.i18n.t(formTextUrl, "dialogs.image");
				formTextTitle = $.wysiwyg.i18n.t(formTextTitle, "dialogs.image");
				formTextDescription = $.wysiwyg.i18n.t(formTextDescription, "dialogs.image");
				formTextWidth = $.wysiwyg.i18n.t(formTextWidth, "dialogs.image");
				formTextHeight = $.wysiwyg.i18n.t(formTextHeight, "dialogs.image");
				formTextOriginal = $.wysiwyg.i18n.t(formTextOriginal, "dialogs.image");
				formTextFloat = $.wysiwyg.i18n.t(formTextFloat, "dialogs.image");
				formTextFloatNone = $.wysiwyg.i18n.t(formTextFloatNone, "dialogs.image");
				formTextFloatLeft = $.wysiwyg.i18n.t(formTextFloatLeft, "dialogs.image");
				formTextFloatRight = $.wysiwyg.i18n.t(formTextFloatRight, "dialogs.image");
				formTextSubmit = $.wysiwyg.i18n.t(formTextSubmit, "dialogs.image");
				formTextReset = $.wysiwyg.i18n.t(formTextReset, "dialogs");
			}

			formImageHtml = '<form class="wysiwyg" id="wysiwyg-addImage"><fieldset>' +
				'<div class="form-row"><span class="form-row-key">' + formTextPreview + ':</span><div class="form-row-value"><img src="" alt="' + formTextPreview + '" style="margin: 2px; width: 80px; height: 60px; border: 1px solid rgb(192, 192, 192);"/></div></div>'+
				'<div class="form-row"><label for="name">' + formTextUrl + ':</label><div class="form-row-value"><input type="text" name="src" value=""/></div></div>' +
				'<div class="form-row"><label for="name">' + formTextTitle + ':</label><div class="form-row-value"><input type="text" name="imgtitle" value=""/></div></div>' +
				'<div class="form-row"><label for="name">' + formTextDescription + ':</label><div class="form-row-value"><input type="text" name="description" value=""/></div></div>' +
				'<div class="form-row"><label for="name">' + formTextWidth + ' x ' + formTextHeight + ':</label><div class="form-row-value"><input type="text" name="width" value="" class="width-small"/> x <input type="text" name="height" value="" class="width-small"/></div></div>' +
				'<div class="form-row"><label for="name">' + formTextOriginal + ':</label><div class="form-row-value"><input type="text" name="naturalWidth" value="" class="width-small" disabled="disabled"/> x ' +
				'<input type="text" name="naturalHeight" value="" class="width-small" disabled="disabled"/></div></div>' +
				'<div class="form-row"><label for="name">' + formTextFloat + ':</label><div class="form-row-value"><select name="float">' + 
				'<option value="">' + formTextFloatNone + '</option>' +
				'<option value="left">' + formTextFloatLeft + '</option>' +
				'<option value="right">' + formTextFloatRight + '</option></select></div></div>' +
				'<div class="form-row form-row-last"><label for="name"></label><div class="form-row-value"><input type="submit" class="button" value="' + formTextSubmit + '"/> ' +
				'<input type="reset" value="' + formTextReset + '"/></div></div></fieldset></form>';

			if (img.self) {
				img.src = img.self.src ? img.self.src : "";
				img.alt = img.self.alt ? img.self.alt : "";
				img.title = img.self.title ? img.self.title : "";
				img.width = img.self.width ? img.self.width : "";
				img.height = img.self.height ? img.self.height : "";
			}
			
			var adialog = new $.wysiwyg.dialog(Wysiwyg, {
				"title": formTextLegend,
				"content": formImageHtml
			});
			
			$(adialog).bind("afterOpen", function (e, dialog) {
				$("form#wysiwyg-addImage", dialog).submit(function (e) {
					e.preventDefault();
					self.processInsert(dialog.container, Wysiwyg, img);
					
					adialog.close();
					return false;
				});
				$("input:reset", dialog).click(function (e) {
					adialog.close();
					
					return false;
				});
				$("fieldset", dialog).click(function (e) {
					e.stopPropagation();
				});
				
				self.makeForm(dialog, img);
			});
			
			adialog.open();
			
			$(Wysiwyg.editorDoc).trigger("editorRefresh.wysiwyg");
		},

		processInsert: function (context, Wysiwyg, img) {
			var image,
				url = $('input[name="src"]', context).val(),
				title = $('input[name="imgtitle"]', context).val(),
				description = $('input[name="description"]', context).val(),
				width = $('input[name="width"]', context).val(),
				height = $('input[name="height"]', context).val(),
				styleFloat = $('select[name="float"]', context).val(),
				style = [],
				found,
				baseUrl;

			if (Wysiwyg.options.controlImage && Wysiwyg.options.controlImage.forceRelativeUrls) {
				baseUrl = window.location.protocol + "//" + window.location.hostname;
				if (0 === url.indexOf(baseUrl)) {
					url = url.substr(baseUrl.length);
				}
			}

			if (img.self) {
				// to preserve all img attributes
				$(img.self).attr("src", url)
					.attr("title", title)
					.attr("alt", description)
					.css("float", styleFloat);

				if (width.toString().match(/^[0-9]+(px|%)?$/)) {
					$(img.self).css("width", width);
				} else {
					$(img.self).css("width", "");
				}

				if (height.toString().match(/^[0-9]+(px|%)?$/)) {
					$(img.self).css("height", height);
				} else {
					$(img.self).css("height", "");
				}
			} else {
				found = width.toString().match(/^[0-9]+(px|%)?$/);
				if (found) {
					if (found[1]) {
						style.push("width: " + width + ";");
					} else {
						style.push("width: " + width + "px;");
					}
				}

				found = height.toString().match(/^[0-9]+(px|%)?$/);
				if (found) {
					if (found[1]) {
						style.push("height: " + height + ";");
					} else {
						style.push("height: " + height + "px;");
					}
				}

				if (styleFloat.length > 0) {
					style.push("float: " + styleFloat + ";");
				}

				if (style.length > 0) {
					style = ' style="' + style.join(" ") + '"';
				}

				image = "<img src='" + url + "' title='" + title + "' alt='" + description + "'" + style + "/>";
				Wysiwyg.insertHtml(image);
			}
		},

		makeForm: function (form, img) {
			console.log(form.find("input[name=src]"));
			form.find("input[name=src]").val(img.src);
			form.find("input[name=imgtitle]").val(img.title);
			form.find("input[name=description]").val(img.alt);
			form.find('input[name="width"]').val(img.width);
			form.find('input[name="height"]').val(img.height);
			form.find('img').attr("src", img.src);

			form.find('img').bind("load", function () {
				if (form.find('img').attr("naturalWidth")) {
					form.find('input[name="naturalWidth"]').val(form.find('img').attr("naturalWidth"));
					form.find('input[name="naturalHeight"]').val(form.find('img').attr("naturalHeight"));
				}
			});

			form.find("input[name=src]").bind("change", function () {
				form.find('img').attr("src", this.value);
			});

			return form;
		}
	};

	$.wysiwyg.insertImage = function (object, url, attributes) {
		return object.each(function () {
			var self = $(this).data("wysiwyg"),
				image,
				attribute;

			if (!self) {
				return this;
			}

			if (!url || url.length === 0) {
				return this;
			}

			if ($.browser.msie) {
				self.ui.focus();
			}

			if (attributes) {
				self.editorDoc.execCommand("insertImage", false, "#jwysiwyg#");
				image = self.getElementByAttributeValue("img", "src", "#jwysiwyg#");

				if (image) {
					image.src = url;

					for (attribute in attributes) {
						if (attributes.hasOwnProperty(attribute)) {
							image.setAttribute(attribute, attributes[attribute]);
						}
					}
				}
			} else {
				self.editorDoc.execCommand("insertImage", false, url);
			}

			$(self.editorDoc).trigger("editorRefresh.wysiwyg");

			return this;
		});
	};
})(jQuery);
