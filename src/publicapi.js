/*********************************************************
 * The actual jQuery plugin and document ready handlers.
 ********************************************************/

//The publicy exposed method of jQuery.prototype, available (and meant to be
//called) on jQuery-wrapped HTML DOM elements.
$.fn.mathquill = function(cmd, latex) {
  switch (cmd) {
  case 'redraw':
    this.find(':not(:has(:first))').each(function() {
      var data = $(this).data(jQueryDataKey);
      if (data && (data.cmd || data.block)) Cursor.prototype.redraw.call(data.cmd || data.block);
    });
    return this;
  case 'revert':
    return this.each(function() {
      var data = $(this).data(jQueryDataKey);
      if (data && data.revert)
        data.revert();
    });
  case 'latex':
    if (arguments.length > 1) {
      return this.each(function() {
        var data = $(this).data(jQueryDataKey);
        if (data && data.block && data.block.renderLatex)
          data.block.renderLatex(latex);
      });
    }

    var data = this.data(jQueryDataKey);
    return data && data.block && data.block.latex();
  case 'text':
    var data = this.data(jQueryDataKey);
    return data && data.block && data.block.text();
  case 'html':
    return this.html().replace(/ ?hasCursor|hasCursor /, '')
      .replace(/ class=(""|(?= |>))/g, '')
      .replace(/<span class="?cursor( blink)?"?><\/span>/i, '')
      .replace(/<span class="?textarea"?><textarea><\/textarea><\/span>/i, '');
  case 'write':
    if (arguments.length > 1)
      return this.each(function() {
        var data = $(this).data(jQueryDataKey),
          block = data && data.block,
          cursor = block && block.cursor;

        if (cursor)
          cursor.writeLatex(latex).parent.blur();
      });
  case 'writefunc':
      if (arguments.length > 1)
      return this.each(function() {
        var data = $(this).data(jQueryDataKey),
          block = data && data.block,
          cursor = block && block.cursor;

          if (cursor) {
          	  if (cursor.selection) {
          	  	  cursor.writeLatex(latex+'\\left('+cursor.selection.latex()+'\\right)').parent.blur();
          	  } else {
          	  	  cursor.writeLatex(latex+'\\left(\\right)').parent.blur();
          	  }
          	  cursor.moveLeft();
          }
      });
   case 'movecursor':
      if (arguments.length > 1)
      return this.each(function() {
          var data = $(this).data(jQueryDataKey),
          block = data && data.block,
          cursor = block && block.cursor;

          if (cursor) {
          	  if (latex=='l') { cursor.moveLeft();}
          	  else if (latex=='r') {cursor.moveRight();}
          	  else if (latex=='u') {
          	    if (cursor.parent.prev)
		      cursor.clearSelection().appendTo(cursor.parent.prev);
		    else if (cursor.prev)
		      cursor.clearSelection().prependTo(cursor.parent);
		    else 
		      cursor.moveLeft(); 
          	  } else if (latex=='d') {
          	    if (cursor.parent.next)
		      cursor.clearSelection().prependTo(cursor.parent.next);
		    else if (cursor.next)
		      cursor.clearSelection().appendTo(cursor.parent);
		    else
		      cursor.moveRight();
		  }
          }
      });	      
   case 'writesimpfunc':
      if (arguments.length > 1)
      return this.each(function() {
        var data = $(this).data(jQueryDataKey),
          block = data && data.block,
          cursor = block && block.cursor;

          if (cursor) {
          	  if (cursor.selection) {
          	  	  cursor.writeLatex(latex+'{'+cursor.selection.latex()+'}').parent.blur();
          	  } else {
          	  	  cursor.writeLatex(latex).parent.blur();
          	  }
          	  cursor.moveLeft();
          }
      });
  case 'cmd':
    if (arguments.length > 1)
      return this.each(function() {
        var data = $(this).data(jQueryDataKey),
          block = data && data.block,
          cursor = block && block.cursor;

        if (cursor) {
          cursor.show();
          if (/^\\[a-z]+$/i.test(latex)) {
            if (cursor.selection) {
              //gotta do cursor before cursor.selection is mutated by 'new cmd(cursor.selection)'
              cursor.prev = cursor.selection.prev;
              cursor.next = cursor.selection.next;
            }
            cursor.insertCmd(latex.slice(1), cursor.selection);
            delete cursor.selection;
          }
          else
            cursor.insertCh(latex);
          cursor.hide().parent.blur();
        }
      });
  case 'writeint':
    if (arguments.length > 1)
      return this.each(function() {
        var data = $(this).data(jQueryDataKey),
          block = data && data.block,
          cursor = block && block.cursor;

        if (cursor) {
          var hascomma = false;
          if (cursor.selection && cursor.selection.latex().match(/,/)) {
            	    hascomma = true;    
          }
          cursor.show();
          if (/^\\[a-z]+$/i.test(latex)) {
            if (cursor.selection) {
              //gotta do cursor before cursor.selection is mutated by 'new cmd(cursor.selection)'
              cursor.prev = cursor.selection.prev;
              cursor.next = cursor.selection.next;
            }
            
            
            cursor.insertCmd(latex.slice(1), cursor.selection);
            delete cursor.selection;
          }
          else {
            cursor.insertCh(latex);
          }
          if (!hascomma) {
            	    cursor.insertCh(',');
            	    cursor.moveLeft();
            }
          cursor.hide().parent.blur();
        }
      });
      default:
    var textbox = cmd === 'textbox',
      editable = textbox || cmd === 'editable',
      RootBlock = textbox ? RootTextBlock : RootMathBlock;
    return this.each(function() {
      createRoot($(this), new RootBlock, textbox, editable);
    });
  }
};

//on document ready, mathquill-ify all `<tag class="mathquill-*">latex</tag>`
//elements according to their CSS class.
$(function() {
  $('.mathquill-editable:not(.mathquill-rendered-math)').mathquill('editable');
  $('.mathquill-textbox:not(.mathquill-rendered-math)').mathquill('textbox');
  $('.mathquill-embedded-latex').mathquill();
});

