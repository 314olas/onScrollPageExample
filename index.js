if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

var overlay = $('<div class="overlay"></div>');
var lastScrollTop = 0;
var action = "stopped";
var timeout = 0;
var headerHeight = $('#header').height();
var currI = 0;

function navigationHandler() {
  $('#btnMenuOpen').on('click', function () {

    if ($('body').hasClass('open-navigation') ) {
      removeHeaderOverlay();
    } else {
      $('body').addClass('open-navigation');
      addHeaderOverlay();
      setTimeout( function () {
        addInlineDuration( $('.navigation-list-item'), 'shown' );
      }, 300)
    }
  });
}


function addInlineDuration(lists, classAdd) {

  for (let i = 1; i <= lists.length + 1; i++) {
    var animationDelay = ( i + i ) <= 9 ? '0.' + ( i + i ) : ( i + i )  / 10 ;
    $(lists[i-1]).css('transition-delay', animationDelay + 's');
  }
  lists.addClass(classAdd)
}

function navigationBtnBackHandler() {
  $('.navigation-sub_back').on('click', function (e) {
    e.stopPropagation();
    var t = $(this).closest('.navigation-link_dropdown-slide').find('li:last-child').css('transition-delay').split('s')[0] * 1000 + 200;
    $(this).closest('.navigation-list-item').removeClass('open-sub');

    setTimeout( function () {
      $('.navigation').removeClass('bg-primary');
      $('.navigation-list').removeAttr('style');
      $('.navigation-list-item').removeClass('notActive').addClass('shown');
    }, t)
  });
}

function navigationAnimationHandler() {
  $('.navigation-list-item_dropdown').on('click', function () {
    var that = this;
    var thatListHeight = $(that).find('.navigation-link_dropdown-slide').height();

    $('.navigation-list-item').removeClass('shown');

    var t = $('.navigation-list-item:last-child').css('transition-delay').split('s')[0] * 1000 + 200;
    setTimeout(function () {
      $('.navigation-list-item').addClass('notActive');
      $('.navigation-list').css('height', thatListHeight + 'px');
      $('.navigation').addClass('bg-primary');

      setTimeout( function () {
        addInlineDuration( $(that).find('.navigation-link_dropdown-slide li'), '');
        $(that).addClass('open-sub');
      }, 0)
    }, t )
  });
}



function addHeaderOverlay() {
  $('#header').append(overlay);
  overlay.on('click', function () {
    removeHeaderOverlay();
  });
  setTimeout(function () {
    overlay.addClass('visible');
  }, 0);
}

function removeHeaderOverlay() {
  setTimeout(function () {
    $('body').removeClass('open-navigation');
    $('#header').find('.overlay').removeClass('visible');
    $('#header').find('.open-sub').removeClass('open-sub');
    $('.navigation').removeClass('bg-primary');
    $('.navigation-list-item').removeAttr('style').removeClass('shown notActive');
    setTimeout(function () {
      $('#header').find('.overlay').remove();
    }, 500)
  })
}


function windowOnResizeHandler() {
  $(window)
    .on('resize orientationchange', function () {

    })
    .on('scroll', function () {
      headerScrollHandler();

    });
}

function headerScrollHandler() {
  if ($(window).scrollTop() > 0) {
    $('body').addClass('scrolled-page');
  } else {
    $('body').removeClass('scrolled-page');
  }
}

function getNumber(number) {
  var str;
  if (number !== 0) {
    str = number.split(',');
    str = str.reduce((prev, current)=> {
      return prev + current
    });

    return +str;
  } else {
    return +number;
  }

}

function countStatsBarNumber(currentNumber, nextNumber, text) {

  $($('.stats-bar .stats-bar-counter')[0]).prop('Counter', getNumber( currentNumber ) ).animate({
    Counter: nextNumber
  }, {
    duration: 1000,
    easing: 'swing',
    step: function (now) {
      $($('.stats-bar .stats-bar-counter')[0]).text(Math.ceil(now).toLocaleString());
    }
  });
  $('.stats-bar-years').text(text);
}

function transformDataYearText(text) {
  var textArr = text.split('');
  textArr = textArr.map(function (item) {
    return item === '/' ? ` / `: item;
  });

  return  textArr.reduce((prev, current)=> {
    return prev + current
  });
}

function addFixedBehaviorHandler(el, wrapHeight, number) {
  var wrapBlock = `<div class="wrap" style="height: ${wrapHeight}px; "></div>`;
  el.wrap(wrapBlock);
  el.css('top', headerHeight + 'px').addClass('fixed');
  if (number) {
    currI = number;
  }
}

function removeFixedBehaviorHandler(el, number) {
  el.removeClass('fixed');
  setTimeout(function () {
    el.unwrap();
  }, 50);

  currI = number;
}

// Scroll end detector:
$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    // get current scroll top
    var st = $(this).scrollTop();
    var $this = $(this);
    // fix for page loads
    if (lastScrollTop !=0 )
    {
      // if it's scroll up
      if (st < lastScrollTop){
        action = "scrollUp";
      }
      // else if it's scroll down
      else if (st > lastScrollTop){
        action = "scrollDown";
      }
    }
    // set the current scroll as last scroll top
    lastScrollTop = st;
    // check if scrollTimeout is set then clear it
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    // wait until timeout done to overwrite scrolls output
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};

$(window).scrollEnd(function(){
  if(action!="stopped"){
    //call the event listener attached to obj.
    $(document).trigger(action);
  }
}, timeout);


function timelinePageScrollFunctionality() {

  if ($('.timeline-section_large').length) {

    $('.timeline-section_large').each( function (i, el) {
      if ( $(el).offset().top <=  $(window).scrollTop() + headerHeight ) {
        currI = i;
      }
    });

    if (currI !== 0) {
      var currentYear =  $(`[data-target='#${$($('.timeline-section_large')[currI]).attr('id')}' ]`).attr('data-year');
      var currentNumber =  $(`[data-target='#${$($('.timeline-section_large')[currI]).attr('id')}' ]`).attr('data-number');
      var prevNumber = $(`[data-target='#${$($('.timeline-section_large')[currI - 1]).attr('id')}' ]`).attr('data-number');

      addFixedBehaviorHandler($($('.timeline-section_large')[currI]),$($('.timeline-section_large')[currI])[0].offsetHeight + headerHeight );
      $('.stats-bar').addClass('visible');
      countStatsBarNumber( prevNumber , currentNumber, transformDataYearText(currentYear));

    }

    $(document).on('scrollUp',function(){
      var elemList = $('.timeline-section_large');
      var $lastItem = $( $('.timeline-section_large')[ $('.timeline-section_large').length - 1 ]);
      var $lastItemTargetBlock = $(`[data-target='#${ $lastItem.attr('id') }' ]`) ;
      var scrollHeight = $(window).scrollTop() + headerHeight;

      elemList.each( function (i, el) {
        var $el = $(el);

        var windowHeight = $(window).height() - headerHeight;
        var $currentEl = $($('.timeline-section_large')[currI]);
        var dataCurrent =  `[data-target='#${$currentEl.attr('id')}' ]`;
        var $currentElByDataTarget = $(dataCurrent);
        var startPoint = ( $currentElByDataTarget.offset().top + $currentElByDataTarget.height() + (headerHeight * 2 ));
        var endPoint = ( $currentElByDataTarget.offset().top ) - windowHeight;
        if ($el.hasClass('fixed') && $el.parent().offset().top >=  scrollHeight ) {

          if ( i === 0 ) {
            removeFixedBehaviorHandler($el, i);
            $('.stats-bar').removeClass('visible');
            countStatsBarNumber( $($('.stats-bar .stats-bar-counter')[0]).text() , 0);
          } else {
            removeFixedBehaviorHandler($el, i - 1);
            addFixedBehaviorHandler($(elemList[currI]), elemList[currI].offsetHeight );
            var dataTarget =`[data-target='#${$(elemList[currI]).attr('id')}' ]` ;
            countStatsBarNumber( $($('.stats-bar .stats-bar-counter')[0]).text() ,
              $(dataTarget).attr('data-number'),
              transformDataYearText($(dataTarget).attr('data-year')));
          }
        }

        if ( scrollHeight <= startPoint && currI !== elemList.length - 1) {

          var percentOpacity = ( scrollHeight - endPoint  )  / (startPoint - endPoint - $el.parent().find('.counter-years_large').height() );

          if ( (1 - percentOpacity ) < 0 ) {
            $currentEl.css('opacity', 0);
          } else if ( (1 - percentOpacity ) > 1 ) {
            $currentEl.css('opacity', 1);
          } else {
            $currentEl.css('opacity', (1 - percentOpacity ));
          }
        }

        if ( currI === elemList.length - 1
          && scrollHeight <= $lastItemTargetBlock.offset().top + ($lastItemTargetBlock.height() / 2) ) {
          $('.stats-bar').addClass('visible');

          if ( scrollHeight <= startPoint ) {
            var percentOpacity = ( scrollHeight - endPoint )  / (startPoint - endPoint );
            $currentEl.css('opacity', (1 - percentOpacity ));
          }
        }

      });

    });
    $(document).on('scrollDown',function() {
      var elemList = $('.timeline-section_large');

      elemList.each( function (i, el) {
        var $el = $(el);
        var $elParent = $el.parent();
        var elementOffset = $el.offset().top ;
        var elementHeight = $el.height();
        var data = `[data-target='#${$(el).attr('id')}' ]`;
        var $elByDataTarget = $(data);
        var elByDataTargetHeight = $elByDataTarget.height();
        var startPoint = ( $elByDataTarget.offset().top ) - $( window ).height();
        var scrollHeight = ($(window).scrollTop() + headerHeight);

        if ( elementOffset  <= scrollHeight ) {

          if ( !$elParent.hasClass('wrap') && i > currI ) {
            addFixedBehaviorHandler($el, elementHeight, i);
            countStatsBarNumber( $($('.stats-bar .stats-bar-counter')[0]).text() , $elByDataTarget.attr('data-number'), transformDataYearText($elByDataTarget.attr('data-year')));

          } else if ( !$el.parent().hasClass('wrap') && i === currI ) {

            if ( currI === 0 ) {
              $('.stats-bar').addClass('visible');
            }

            addFixedBehaviorHandler($el, elementHeight, i);
            countStatsBarNumber( $($('.stats-bar .stats-bar-counter')[0]).text() , $elByDataTarget.attr('data-number'), transformDataYearText($elByDataTarget.attr('data-year')));

          } else {

            if ( currI > 0)  {
              if ($(elemList[currI-1]).hasClass('fixed') && $(elemList[currI-1]).parent().hasClass('wrap') ) {
                $(elemList[currI-1]).removeClass('fixed');
                $(elemList[currI-1]).unwrap();
              }
            }
          }

          if ( scrollHeight >= startPoint) {

            var percentOpacity = ( ( (scrollHeight) - startPoint )
              / ( ($elByDataTarget.offset().top + elByDataTargetHeight)
                -  startPoint - ($elParent.find('.counter-years_large').height() / 2 ) ) * 100 ) ;

            if ( ((100 - percentOpacity) / 100) < 0 ) {
              $el.css('opacity', 0);
            } else if ( ((100 - percentOpacity) / 100) > 1 ) {
              $el.css('opacity', 1);
            } else {
              $el.css('opacity', (100 - percentOpacity) / 100);
            }

            if ( currI === elemList.length - 1) {

              var $lastItem = $(`[data-target='#${  $(elemList[elemList.length - 1]).attr('id') }' ]`);

              if ( scrollHeight >= $lastItem.offset().top + ($lastItem.height() / 2) ) {
                $('.stats-bar').removeClass('visible');
                $el.css('opacity', 0)
              }
            }
          }
        }
      });

    });
  }
}


$(document).ready( function () {
  navigationHandler();
  navigationAnimationHandler();
  timelinePageScrollFunctionality();
  navigationBtnBackHandler();

  windowOnResizeHandler();

});

