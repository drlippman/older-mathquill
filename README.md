# [MathQuill](http://mathquill.github.com)

by [Han](http://github.com/laughinghan) and [Jay](http://github.com/jayferd)

Modified by [David Lippman](http://dlippman.imathas.com) for [IMathAS](http://www.imathas.com)

# Modifications

This modified version has a palette-based equation editor.  There are three
examples of the equation editor included:

* tt2.html shows an editor that hovers hovers above the input box
* tt3.html shows an accordian style editor that flys in the from the right
* tt4.html shows a modal editor, in a div that can be dragged around

This modified version also allows for entry of some basic functions (sin, cos, sqrt, etc.)
without needing the leading backslash.  A workable, if not klunky, input/output format
for angle brackets and nth-roots was also added.

Also included is a language translation script to change from and to AsciiMath from the
native MathQuill format.  This is only implemented currently for basic functions, and 
will not work for all symbols and higher-level notation.  testcases.html demonstrates
this translation.

This version also integrates some IE fixes found on github from asavoy.  These allow
the editor to be quite usable down to IE7, and even tolerably in IE6.

A mathquill.php script was added to merge on-the-fly the MathQuill src scripts.

## Open-Source License

[GNU Lesser General Public License](http://www.gnu.org/licenses/lgpl.html)

MathQuill is Copyleft 2010-2011 [Han](http://github.com/laughinghan) and [Jay](http://github.com/jayferd)

Added files are Copyleft 2012 David Lippman
