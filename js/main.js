////////////////////////
// GLOBAL VARS

var isMobile = false;
var parallaxOn = true;
var numHallwayPics = 29;

/*
 * TO DO:
 * redo parallax behavior
 * write custom mailchimp API call
 * Add load/resize function for parralax
 */

//////////////////////////////////////// 

////////////////////////
// SETUP ON READY

$(document).ready(function() {

    // Build backgrounds

    $(".hasFullBg").each(function(){
        var cover = $(this);
        var coverSrc = cover.attr("data-bg");
        if (coverSrc != undefined) {
            var img = new Image();
            img.onload = function() {
              cover.backstretch(coverSrc, {fade: 3000});
              gifBg(cover);
            };
            img.onerror = function() {
              gifBg(cover);
            };
            img.src = coverSrc;
        };
    });


    // Initialize plugins

    if ($(".vidHolder").length) {
        $(".vidHolder").fitVids();  
    };

    $(".carousel").carousel();
    $(".carousel").carousel('pause');



    $('[data-toggle="tooltip"]').tooltip();
    

    // resize and reposition things

    var buttWidth = $(".resizeButtons .row:nth-of-type(2) a").eq(1).outerWidth();
    $(".resizeButtons .row:nth-of-type(2) a").eq(0).css("width",buttWidth +"px");

    projectTitle();
    resizeClientLogos();

    if (parallaxOn && !Modernizr.touch) {
        $(".parallaxPossible").each(function(){
            $(this).removeClass("parallaxOff").addClass("parallaxOn").css("background-position","center " + 100 +"px");
        });
    };
});

////////////////////////
// EVENTS

$( window ).load(function() {
    if (jQuery.browser.mobile == true) {
        isMobile = true;
        $("body").addClass("isMobile");
    } else {
        $("body").addClass("isNotMobile");
    };

    setTimeout(function() {
          resizeNavMenu(window.innerHeight*0.9,0);
    }, 450);

    resizeCarousel();

    if (!isMobile) {
        var promises = [];
        for (var i = 1; i <= numHallwayPics; i++) {
            preloadHallway("img/bgseq/"+i+".jpg", promises[i] = $.Deferred());
        }
        $.when.apply($, promises).done(function() {
            // console.log("preloaded");    
            $(".hallway").addClass("moveHallway");
        });
    };
});


$(".navArrow").hover(
  function() {
    $("span:nth-of-type(1)", this).addClass("hidden");
    $("span:nth-of-type(2)", this).removeClass("hidden");
  }, function() {
    $("span:nth-of-type(2)", this).addClass("hidden");
    $("span:nth-of-type(1)", this).removeClass("hidden");
  }
);


//Throttled on-resize handler
on_resize(function() {
    resizeClientLogos();
    projectTitle();
    resizeCarousel();
    setTimeout(function() {
          resizeNavMenu(window.innerHeight*0.9,0);
    }, 450);
})();

//Normal on-resize handler
$( window ).resize(function() {
});

$(window).scroll(function(e) {
    if ($("body").hasClass("isNotMobile")) {
        var scrollTop = $(window).scrollTop();
        
        $(".parallaxPossible").each(function(){
            parallaxIt($(this),scrollTop,window.innerHeight);
        })
    };
});

$(".menuLines").click(function(e){
    e.preventDefault();
    $(this).toggleClass("active");
    toggleFullScreenMenu();
});

$("#body-nav").click(function(e){
    if ($(".menuLines").hasClass("active")) {
        toggleFullScreenMenu();
    };
    $(".menuLines").removeClass("active");
});

$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        if ($('body').hasClass('show-nav')) {
            $('body').removeClass('show-nav').addClass('hide-nav');
            $(".menuLines").removeClass("active");
            setTimeout(function() {
                $('body').removeClass('hide-nav');
            }, 500);
        }
    }
});

$(".project").click(function(e){
    var dest = $("a", this).attr("href");
    document.location.href = dest;
});

$(".samePageLink").click(function(e){
    e.preventDefault();
    var dest = $(this).attr("href");
    var target;
    target = Math.floor($(dest).offset().top);
    var speed = Math.floor((target - $(window).scrollTop())/3);
    $("body").animate({
        scrollTop: target
    }, Math.abs(speed));
});


////////////////////////
// CUSTOM FUNCTIONS

function resizeClientLogos(){
    var logoWidth = $(".logoHolder").width() / $(".clientLogo").length;
    $(".clientLogo").css("width",Math.floor(logoWidth));
}


function preloadHallway(url, promise) {
    var img = new Image();
    img.onload = function() {
      promise.resolve();
    };
    img.src = url;
    $("#preloadCache").append('<img src="' + img.src + '">')
}

function parallaxIt(section,scrollPos,winHeight){
    // console.log("section top: " + section.offset().top + " | " + scrollPos);
    var sectionBegin = section.offset().top - winHeight;
    var sectionLength = section.outerHeight();
    var sectionEnd = section.offset().top + sectionLength;
    var scrollProportion = Math.abs(sectionBegin - scrollPos) / (winHeight);
    if (scrollPos > sectionBegin && scrollPos < sectionEnd) {
        var parallaxShift = 100 - (100*scrollProportion);
        // console.log(scrollProportion);
        if (section.hasClass("hallway")) {
            scrollHallway(scrollPos,sectionBegin,sectionEnd,sectionLength,winHeight);
        };
        section.css("background-position","center " + parallaxShift +"px");
    } else {
        section.removeAttr("style");
    };
}

function scrollHallway(scrollPos,sectionBegin,sectionEnd,sectionLength,winHeight) {
    var scrollProportion = Math.abs(sectionBegin - scrollPos) / (sectionLength + winHeight);
    //console.log(scrollProportion);
    var value = scrollProportion * numHallwayPics;
    if (Math.ceil(value) <= 0) {
        whichImg = 1;
    } else if (Math.ceil(value) > 0 && Math.ceil(value) <= numHallwayPics){
        whichImg = Math.ceil(value);
    } else {
        whichImg = numHallwayPics;
    }
    // console.log(whichImg);
    $(".moveHallway").css("background","url(img/bgseq/" + whichImg + ".jpg)")
}

function toggleFullScreenMenu() {
    if ($('body').hasClass('show-nav')) {
        $('body').removeClass('show-nav').addClass('hide-nav');

        setTimeout(function() {
            $('body').removeClass('hide-nav');
        }, 500);

    } else {
        $('body').removeClass('hide-nav').addClass('show-nav');
    }
}

function resizeCarousel(){
    // console.log($(".carousel").width());
    var carWidth = $(".carousel").width();
    var carHeight = carWidth / 1.77777777777778;
    $(".carousel").height(carHeight);

    // $(".carousel-inner div.item").each(function(){
    //     var thisHeight = $(this).height();
    //     if (thisHeight > carHeight) {
    //         var offset = -1 * Math.floor((thisHeight - carHeight)/2);
    //         $(this).css("top",offset + "px");
    //         //console.log("set: " + offset);
    //     };
    // });

    // 1.77777777777778
    // // var maxHeight = 800;
    // var maxHeight = window.innerHeight;
    // $(".carousel-inner div.item").each(function(){
    //     var thisHeight = $(this).height();
    //     // console.log($(this).height());
    //     if (thisHeight < maxHeight) {
    //         maxHeight = thisHeight;
    //     };
    // });

    // $(".carousel-inner").css("max-height",maxHeight + "px");

    // $(".carousel-inner div.item").each(function(){
    //     var thisHeight = $(this).height();
    //     if (thisHeight > maxHeight) {
    //         var offset = -1 * Math.floor((thisHeight - maxHeight)/2);
    //         $(this).css("top",offset + "px");
    //         //console.log("set: " + offset);
    //     };
    // });
 };

 function projectTitle() {
    var pos = window.innerHeight/3;
    $(".bigTitle").css("padding-top",pos);
 }

 function gifBg(element){
    var coverGifSrc = element.attr("data-gif");
    if (coverGifSrc != undefined) {
        // console.log(coverSrc);
        var img = new Image();
        img.onload = function() {
          // console.log("loaded!");
          element.backstretch(coverGifSrc, {fade: 3000});
        };
        img.onerror = function() {
          //console.log("problem!");
        };
        img.src = coverGifSrc;
    }
};

function resizeNavMenu(windowHeight,steps){
    var nav = $("#body-nav ul");
    var navLink = $("#body-nav ul li a");
    
    if (nav.outerHeight() > windowHeight && steps < 10) {
        var adjust = navLink.outerHeight() * 0.9;
        navLink.height(adjust).css("line-height",adjust+"px");  
        setTimeout(function() {
              resizeNavMenu(windowHeight,steps++);
        }, 150);
    } else if(nav.outerHeight() < windowHeight*0.75 && steps < 10) {
        var adjust = navLink.outerHeight() * 1.1;
        navLink.height(adjust).css("line-height",adjust+"px");  
        setTimeout(function() {
              resizeNavMenu(windowHeight,steps++);
        }, 150);
    }
}


////////////////////////
// UTILITIES

// debulked onresize handler
function on_resize(c,t){onresize=function(){clearTimeout(t);t=setTimeout(c,250)};return c};


// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());


// Mailchimp validate
(function($) {
    window.fnames = new Array(); 
    window.ftypes = new Array();
    fnames[0]='EMAIL';ftypes[0]='email';
    fnames[1]='FNAME';ftypes[1]='text';
    fnames[2]='LNAME';ftypes[2]='text';
}(jQuery));
var $mcj;
// init only if loaded external script
if (window.mc !== undefined) {
    $mcj = jQuery.noConflict(true);
};


/////////////////////////////////////
// Old/Unused/In-progress

/*
$('.checkVisible').appear();
if (typeof $('.checkVisible').appear == "function" && $('.checkVisible').is(':appeared') == false) {
    console.log("do stuff");
    $('.checkVisible').each(function(){
        $(this).addClass("faded");
    });
};

$(document.body).on('appear', '.checkVisible', function(e, $affected) {
    // this code is executed for each appeared element
    $(this).addClass("isVisible");
    $(this).removeClass("faded");
});
$(document.body).on('disappear', '.checkVisible', function(e, $affected) {
    // this code is executed for each disappeared element
    // $(this).addClass("isNotVisible");
});
*/

// if ($(".projNavArrow").length) {
//     $.get("work.html",function(workData) {
//         // my_var contains whatever that request returned
//     }, 'html');
// };


// function projectSizer() {
//     //var ratio = 16/9;
//     var maxWidth = 1280;
//     if (maxWidth > $(window).width() * 0.9) { maxWidth = $(window).width() * 0.9};
//     var margin = $("#projectMenuBar").height();
//     var elemHeight = $(window).height() - margin - (margin * 1.25);
    

//     $(".vidBox").each(function(){
//         var ratio = 16/9;
//         var elemWidth = elemHeight * ratio;
//         if (elemWidth > maxWidth) { elemWidth = maxWidth};
//         $(this).css({
//             "padding-top" : (margin * 1.25) + "px",
//             "width" : elemWidth + "px"
//         });
//     });

//     $(".imgBox").each(function(){
//         var ratio = $(this).width()/$(this).height();
//         var elemWidth = elemHeight * ratio;
//         if (elemWidth > maxWidth) { elemWidth = maxWidth};
//         $(this).css({
//             "padding-top" : (margin * 1.25) + "px",
//             "width" : elemWidth + "px"
//         });
//     });
// }