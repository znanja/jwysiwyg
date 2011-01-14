=========
Internals
=========

.. contents::

Workflow
========

::

    // example.html
    $("textarea").wysiwyg();

Wysiwyg.init
    Wysiwyg.initFrame
        Try to switch on this.editorDoc.designMode (Wysiwyg.designMode)

Wysiwyg object
==============

Properties
----------

editor
    jQuery("iframe") object

editorDoc
    iframe.document element

element
    jQuery("<div class="wysiwyg">") object

original
    textarea element provided by $("textarea").wysiwyg()

panel
    jQuery("<ul class="panel">") object

Methods
-------

TODO

$.wysiwyg object
================

TODO

$.fn.wysiwyg object
===================

TODO
