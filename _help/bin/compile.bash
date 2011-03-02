#!/bin/bash

#
# Compile & minimize
#

JWYSIWYG_ROOT_DIR=`pwd`/`dirname $0`/../..
JWYSIWYG_BIN_DIR=$JWYSIWYG_ROOT_DIR/_help/bin
JWYSIWYG_OUTFILE="jquery.wysiwyg.full.js"

jwysiwyg_help() {
	echo
	echo "jWYSIWYG compile"
	echo
	echo "Usage: compile full [outfile]"
	echo
}

jwysiwyg_title() {
	echo "//=================" >> $2
	echo "//" >> $2
	echo "// File: $1" >> $2
	echo "//" >> $2
	echo "//=================" >> $2
	echo -e "\n" >> $2
	cat $1 >> $2
	echo -e "\n\n\n" >> $2
}

case $1 in
	full)
		outfile=$JWYSIWYG_OUTFILE
		if [ -n "$2" ]; then
			outfile="$2"
		fi

		outfile=$JWYSIWYG_ROOT_DIR/$outfile
		echo -e "Using $outfile"
		
		if [ ! -e "$outfile" ]; then
			echo "File $outfile not exists. Create..."
			touch $outfile
		else
			echo "File $outfile exists. Clear..."
			echo > $outfile
		fi

		jwysiwyg_title $JWYSIWYG_ROOT_DIR/jquery.wysiwyg.js $outfile

		for filename in `find $JWYSIWYG_ROOT_DIR/controls/*.*`; do
			jwysiwyg_title $filename $outfile
		done

		for filename in `find $JWYSIWYG_ROOT_DIR/plugins/*.*`; do
			jwysiwyg_title $filename $outfile
		done

		for filename in `find $JWYSIWYG_ROOT_DIR/i18n/*.*`; do
			jwysiwyg_title $filename $outfile
		done

		if [ ! -e "$JWYSIWYG_BIN_DIR/yuicompressor-2.4.2.jar" ]; then
			echo -e "\nyuicompressor-2.4.2.jar not found\n"
			echo "To minimize file:"
			echo "1. Download YUI Compressor [http://yuilibrary.com/downloads/#yuicompressor]"
			echo "2. Extract and copy file from ./build/yuicompressor-2.4.2.jar to jwysiwyg/_help/bin/yuicompressor-2.4.2.jar"
		else
			java -jar $JWYSIWYG_BIN_DIR/yuicompressor-2.4.2.jar $outfile -o "${outfile%"js"}min.js" --charset utf-8 --line-break 500 --type js
		fi
	;;
	help)
		jwysiwyg_help
		exit 0
	;;
	*)
		jwysiwyg_help
		exit 1
	;;
esac