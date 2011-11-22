/**
 * jQuery exdent - add hanging punctuation
 *
 * Copyright (c) 2011 Manuel Strehl, http://www.manuel-strehl.de
 *
 * This file is licensed under the same terms as jQuery, namely
 * an MIT-style and GPL license.
 */
(function($) {


  /* cache for auto-width detection results */
  var widthCache = {};


  /**
   * jQuery method exdent()
   *
   * Usage:
   * js> $('body q').exdent();
   * js> $('article q, article blockquote').exdent({
   * ...   detect: true
   * ... });
   * js> $('q').exdent({ by: '.3em' });
   *
   * Options:
   * - by (String): the width by which to exdent
   * - detect (Boolean or String): whether to autodetect the
   *   exdentation width (will ignore "width"). If a string is given,
   *   this is used for detection, other wise an english opening quote,
   *   U+201C
   * - className (String): class to add to / remove from exdented elements
   */
  $.fn.exdent = function(o) {
    o = $.extend({
      by: '.5em',
      detect: false,
      className: 'exdented'
    }, o);
    if (o.detect === true) {
      o.detect = '\u201C';
    }

    return this.each(function() {

      var $this = $(this), left = 0,
          width, tmp, cacheKey, top;

      // we must detect the desired width upfront, because we need it
      // esp. in case of :before pseudo-elements
      if (o.detect) {
        cacheKey = $this.css('fontWeight') + " " +
                   $this.css('fontSize') + " " +
                   $this.css('fontFamily') + " " +
                   o.detect;
        if (! (cacheKey in widthCache)) {
          tmp = $('<span>'+o.detect+'</span>').prependTo(this);
          widthCache[cacheKey] = tmp.width();
          tmp.remove();
        }
        width = widthCache[cacheKey];
      } else {
        // get the numeric width instead of "em", "%", ...
        tmp = $('<span style="display:inline-block"></span>')
                .css('width', o.by).prependTo(this);
        width = tmp.width();
        tmp.remove();
      }
      tmp = null;

      // this is the "true" offset in case of multiline elements
      // see <http://stackoverflow.com/q/995838/113195>
      tmp = $('<span style="display:inline">\u00A0</span>').prependTo(this);
      left = tmp.offset().left;
      tmp.remove();
      tmp = null;

      $this.prev('br._exdent_helper').remove();
      if (left - width - 1 <= $this.parent().offset().left) {
        top = $this.offset().top;
        $this.css('marginLeft', -width).addClass(o.className);
        if (top !== $this.offset().top) {
          $this.before('<br class="_exdent_helper"/>');
        }
      } else {
        $this.css('marginLeft', '0').removeClass(o.className);
      }
    });
  };


  if ($.cssHooks) {
    /* Allow setting via $('q').css('exdent', -10);
     */
    $.cssHooks['exdent'] = {
      get: function(elem, computed, extra) {
        return $.css(elem, marginLeft);
      },
      set: function(elem, value) {
        $(elem).exdent({ by: value });
      }
    };
  }

})(jQuery);
