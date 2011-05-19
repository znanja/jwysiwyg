#!/usr/bin/perl -w

# This handler requires JSON::XS.
use strict;
use warnings;
use CGI qw(:standard);
use JSON::XS;
use utf8;

my $base_url = "http://localhost"; # The base URL for your file directory
my $root = "/srv/http/jwysiwyg"; # Local URI for file directory
my $action = param("action");

warn "Shalalala";
# All responses are strict JSON.
print "Content-type: application/json; charset=utf-8\n\n";

my $JSON = JSON::XS->new()->pretty(1);
my $dir = url_decode(param("dir"));
my $fhandle = param("handle");
my $newName = url_decode(param("newName"));

# Upload File Method:
if ($action eq "upload") {
	print "Failed";
}

# Method for decoding GET method utf8
sub url_decode {
	my $arg = $_[0];
	if ($arg =~ /\/?\.\.\/?/) { return 0; } # This is an important safety precaution -> Using firebug it is very easy to access all the data on the server, simply by using the hard-links of the linux system: ../ and ./ to reach higher level directories.
	# Support for Unicode, UTF-8:
	$arg =~ tr/+/ /;
	$arg =~ s/%([a-fA-F0-9]{2})/pack("C", hex($1))/eg;
	$arg =~ s/%u0([a-fA-F0-9]{3})/pack("U", hex($1))/eg;
	utf8::decode($arg);	
	return $arg;
}
