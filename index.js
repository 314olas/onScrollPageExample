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
      addInlineDuration( $('.navigation-list-item'), 'shown' );
    }
  });
}

function addInlineDuration(lists, classAdd) {
  for (let i = 1; i <= lists.length + 1; i++) {
    var animationDelay = ( i + i ) <= 9 ? '0.' + ( i + i ) : ( i + i )  / 10 ;
    setTimeout(function () {
      $(lists[i-1]).attr('data-item', i);
      ($(lists[i-1]).addClass(classAdd));
    }, (i * 150) );
  }
}

function navigationAmimationHandler() {
  $('.navigation-link_dropdown-slide a').on('click', function (e) {
    e.stopPropagation();
  });

  $('.navigation-list-item').on('click', function (e) {

    if ($(this).hasClass('navigation-list-item_dropdown')) {
      e.stopPropagation();
      var thatId = $(this).attr('data-item');
      $('.navigation-list-item').each( function (i, el) {

        setTimeout( function () {
          if ($(el).attr('data-item') !== thatId ) {
            $(el).toggleClass('shown');
          } else {

            if ($(el).hasClass('open-sub')) {
              $(el).find('.navigation-link_dropdown-slide li').each( function (i, el) {
                setTimeout(function () {
                  $(el).removeClass('open-sub')
                }, (i+1) * 100)
              });
              $('.navigation').removeClass('bg-primary');
              $(el).removeClass('open-sub');
            } else {

              if ( $(el).hasClass('navigation-list-item_dropdown')) {
                setTimeout( function () {
                  addInlineDuration($(el).find('.navigation-link_dropdown-slide li'), 'open-sub');
                  $(el).addClass('open-sub');
                  $('.navigation').addClass('bg-primary');
                }, $('.navigation-list-item').length * 100)
              }

            }
          }
        },  (i +1) * 100)
      })
    }

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
    $('.navigation-list-item').removeClass('shown');
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
  el.wrap(`<div class="wrap" style="height: ${wrapHeight}px; "></div>`);
  el.attr('style', `top: ${headerHeight}px `).addClass('fixed');

  if (number) {
    currI = number;
  }

}

function removeFixedBehaviorHandler(el, number) {
  el.removeClass('fixed');
  el.unwrap();
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
    $(document).on('scrollUp',function(){
      var elemList = $('.timeline-section_large');
      var $lastItem = $( $('.timeline-section_large')[ $('.timeline-section_large').length -1 ]);
      var $lastItemTargetBlock = $(`[data-target='#${ $lastItem.attr('id') }' ]`) ;
      var scrollHeight = $(window).scrollTop() + headerHeight;

      elemList.each( function (i, el) {
        var $el = $(el);
        var wrapHeight = $el[0].offsetHeight + headerHeight;
        var $currentEl = $($('.timeline-section_large')[currI]);
        var dataCurrent =  `[data-target='#${$currentEl.attr('id')}' ]`;
        var $currentElByDataTarget = $(dataCurrent);
        var startPoint = ( $currentElByDataTarget.offset().top ) + $( window ).height() + headerHeight;
        var endPoint = ( $currentElByDataTarget.offset().top ) - $( window ).height() + headerHeight;

        if ($el.hasClass('fixed') && $el.parent().offset().top >=  scrollHeight) {

          if ( i === 0 ) {
            removeFixedBehaviorHandler($el, i);
            $('.stats-bar').removeClass('visible');
            countStatsBarNumber( $($('.stats-bar .stats-bar-counter')[0]).text() , 0);
          } else {
            removeFixedBehaviorHandler($el, i - 1);
            addFixedBehaviorHandler($($('.timeline-section_large')[currI]), wrapHeight);
            var dataTarget =`[data-target='#${$($('.timeline-section_large')[currI]).attr('id')}' ]` ;
            countStatsBarNumber( $($('.stats-bar .stats-bar-counter')[0]).text() , $(dataTarget).attr('data-number'), transformDataYearText($(dataTarget).attr('data-year')));
          }
        }

        if ( currI === $('.timeline-section_large').length -1
          && scrollHeight <= $lastItemTargetBlock.offset().top + $lastItemTargetBlock.height() ) {
          $('.stats-bar').addClass('visible');
        }

        if ( scrollHeight <= startPoint) {

          var percentOpacity = ( scrollHeight - endPoint )  / (startPoint - endPoint );

          if ( (1 - percentOpacity ) < 0 ) {
            $currentEl.css('opacity', 0);
          } else if ( (1 - percentOpacity ) > 1 ) {
            $currentEl.css('opacity', 1);
          } else {
            $currentEl.css('opacity', (1 - percentOpacity ));
          }
        }

      });

    });
    $(document).on('scrollDown',function(){

      $('.timeline-section_large').each( function (i, el) {
        var $el = $(el);
        var toCenterEl = ($el.innerHeight() / 2) + headerHeight;
        var elementOffset = $el.offset().top;
        var wrapHeight = $el[0].offsetHeight;
        var data = `[data-target='#${$(el).attr('id')}' ]`;
        var $elByDataTarget = $(data);
        var elByDataTargetHeight = $elByDataTarget.height();
        var startPoint = ( $elByDataTarget.offset().top ) - $( window ).height() - (elByDataTargetHeight / 1) ;
        var scrollHeight = $(window).scrollTop() + headerHeight;


        if ( elementOffset <=  scrollHeight ) {

          if ( !$el.parent().hasClass('wrap') && i > currI ) {
            addFixedBehaviorHandler($el, wrapHeight, i);
            countStatsBarNumber( $($('.stats-bar .stats-bar-counter')[0]).text() , $elByDataTarget.attr('data-number'), transformDataYearText($elByDataTarget.attr('data-year')));

          } else if ( !$el.parent().hasClass('wrap') && i === currI ) {

            if ( currI === 0 ) {
              $('.stats-bar').addClass('visible');
            }

            addFixedBehaviorHandler($el, wrapHeight, i);
            countStatsBarNumber( $($('.stats-bar .stats-bar-counter')[0]).text() , $elByDataTarget.attr('data-number'), transformDataYearText($elByDataTarget.attr('data-year')));

          } else {

            if ( currI > 0)  {
              if ($($('.timeline-section_large')[currI-1]).hasClass('fixed') && $($('.timeline-section_large')[currI-1]).parent().hasClass('wrap') ) {
                $($('.timeline-section_large')[currI-1]).removeClass('fixed');
                $($('.timeline-section_large')[currI-1]).unwrap();
              }
            }
          }

          if ( scrollHeight >= startPoint) {
            var percentOpacity = (scrollHeight - startPoint ) / ( ($elByDataTarget.offset().top + elByDataTargetHeight) -  startPoint ) * 100 ;

            if ( ((100 - percentOpacity) / 100) < 0 ) {
              $el.css('opacity', 0);
            } else if ( ((100 - percentOpacity) / 100) > 1 ) {
              $el.css('opacity', 1);
            } else {
              $el.css('opacity', (100 - percentOpacity) / 100);
            }

            if ( currI === $('.timeline-section_large').length -1) {

              var $lastItem = $(`[data-target='#${  $($('.timeline-section_large')[$('.timeline-section_large').length -1]).attr('id') }' ]`);

              if ( scrollHeight >= $lastItem.offset().top + $( window ).height() + headerHeight ) {
                $('.stats-bar').removeClass('visible');
              }
            }
          }
        }
      })

    });
  }
}


$(document).ready( function () {
  navigationHandler();
  navigationAmimationHandler();
  timelinePageScrollFunctionality();

  windowOnResizeHandler();

});

