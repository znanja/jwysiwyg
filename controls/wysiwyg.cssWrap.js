/**
 * Controls: Element CSS Wrapper plugin
 *
 * Depends on jWYSIWYG
 */
(function ($) {
	if (undefined === $.wysiwyg) {
		throw "wysiwyg.cssWrap.js depends on $.wysiwyg";
	}

	if (!$.wysiwyg.controls) {
		$.wysiwyg.controls = {};
	}

	/*
	 * Wysiwyg namespace: public properties and methods
	 */
	$.wysiwyg.controls.cssWrap = {
		init: function (Wysiwyg) {
			var self = this, formWrapHtml, key, translation,
			dialogReplacements = {
				legend	: "Wrap Element",
				wrapperType : "Wrapper Type",
				ID : "ID",
				class : "Class",
				submit  : "Wrap",
				reset   : "Cancel"
			};

			formWrapHtml = '<form class="wysiwyg"><fieldset><legend>{legend}</legend>' +
				'<div class="dialogRow"><label>{wrapperType}: &nbsp;<select name="type"><option value="div">Div</option><option value="span">Span</option></select></label></div>' +
				'<div class="dialogRow"><label>{ID}: &nbsp;<input name="id" type="text" /></label></div>' + 
				'<div class="dialogRow"><label>{class}: &nbsp;<input name="class" type="text" /></label></div>' +
				'<input type="submit" id="submitDialog" class="button" value="{submit}"/></label>' +
				'<input type="reset" id="cancelDialog" value="{reset}"/></fieldset></form>';

			for (key in dialogReplacements) {
				if ($.wysiwyg.i18n) {
					translation = $.wysiwyg.i18n.t(dialogReplacements[key]);
					if (translation === dialogReplacements[key]) { // if not translated search in dialogs 
						translation = $.wysiwyg.i18n.t(dialogReplacements[key], "dialogs");
					}
					dialogReplacements[key] = translation;
				}
				formWrapHtml = formWrapHtml.replace("{" + key + "}", dialogReplacements[key]);
			}
			if (!$("#cssWrapWrapper").length) {
				$('<div id="cssWrapWrapper">'+formWrapHtml+'</div>').appendTo("body");
				$("#cssWrapWrapper").dialog({
					modal: true,
					open: function (ev, ui) {
						$this = $(this);
						var range	= Wysiwyg.getInternalRange(), common;
						// We make sure that there is some selection:
						if (range) {
							common	= $(range.commonAncestorContainer);
						} else {
							alert("You must select some elements before you can wrap them.");
							$this.dialog("close");
						}
						var $nodeName = range.commonAncestorContainer.nodeName.toLowerCase();
						// If the selection is already a .wysiwygCssWrapper, then we want to change it and not wrap it again.
						if (common.parent(".wysiwygCssWrapper").length) {
							$this.find("input[name=id]").val(common.parent(".wysiwygCssWrapper").attr("id"));
							$this.find("input[name=class]").val(common.parent(".wysiwygCssWrapper").attr("class").replace('wysiwygCssWrapper ', ''));							
						}
						// Submit button.
						$("form.wysiwyg").find("#submitDialog").live("click", function(e) {
							e.preventDefault();
							var args = $("#cssWrapWrapper").find("form").serializeArray();
							// If the selection is already a .wysiwygCssWrapper, then we want to change it and not wrap it again.
							if (common.parent(".wysiwygCssWrapper").length) {
								alert('hey');
								common.parent(".wysiwygCssWrapper").attr("id", args[1].value);
								common.parent(".wysiwygCssWrapper").attr("class", "wysiwygCssWrapper "+args[2].value);
								$this.dialog("close");
							} else {
								if ($nodeName !== "body") {
									common.wrap('<'+args[0].value+' id="'+args[1].value+'" class="'+"wysiwygCssWrapper "+args[2].value+'"/>');
									$this.dialog("close");
								} else {
									common.prepend('<'+args[0].value+' id="'+args[1].value+'" class="'+"wysiwygCssWrapper "+args[2].value+'">');
									common.append('</'+args[0].value+'>');
									$this.dialog("close");
								}
							}							
						});
						// Cancel button.
						$("form.wysiwyg").find("#cancelDialog").live('click', function(e) {
							e.preventDefault();
							$this.dialog("close");
						});
					},
					close: function () {
						$(this).remove();
					}
				});
				Wysiwyg.saveContent();
			}
			$(Wysiwyg.editorDoc).trigger("editorRefresh.wysiwyg");
			return 1;
		}
	}
})(jQuery);
