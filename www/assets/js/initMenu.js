var mobile_menu_visible = 0,
    mobile_menu_initialized = false,
    toggle_initialized = false,
    bootstrap_nav_initialized = false,
    $sidebar,
    transparent = true;
mdp = {
    misc: {
        navbar_menu_visible: 0,
        active_collapse: true,
        disabled_collapse_init: 0,
    },
    initSidebarsCheck: function () {
        if ($(window).width() <= 991) {
            if ($sidebar.length != 0) {
                mdp.initRightMenu();
            } else {
                mdp.initBootstrapNavbarMenu();
            }
        }
    },
    initMinimizeSidebar: function () {
        $('#minimizeSidebar').click(function () {
            var $btn = $(this);
            if (mdp.misc.sidebar_mini_active == true) {
                $('body').removeClass('sidebar-mini');
                mdp.misc.sidebar_mini_active = false;
            } else {
                setTimeout(function () {
                    $('body').addClass('sidebar-mini');
                    mdp.misc.sidebar_mini_active = true;
                }, 300);
            }
            // we simulate the window Resize so the charts will get updated in realtime.
            var simulateWindowResize = setInterval(function () {
                window.dispatchEvent(new Event('resize'));
            }, 180);
            // we stop the simulation of Window Resize after the animations are completed
            setTimeout(function () {
                clearInterval(simulateWindowResize);
            }, 1000);
        });
    },
    checkScrollForTransparentNavbar: debounce(function () {
        if ($(document).scrollTop() > 260) {
            if (transparent) {
                transparent = false;
                $('.navbar-color-on-scroll').removeClass('navbar-transparent');
            }
        } else {
            if (!transparent) {
                transparent = true;
                $('.navbar-color-on-scroll').addClass('navbar-transparent');
            }
        }
    }, 17),
    initRightMenu: debounce(function () {
        $sidebar_wrapper = $('.sidebar-wrapper');
        if (!mobile_menu_initialized) {
            $navbar = $('nav').find('.navbar-collapse').first().clone(true);
            nav_content = '';
            mobile_menu_content = '';
            $navbar.children('ul').each(function () {
                content_buff = $(this).html();
                nav_content = nav_content + content_buff;
            });
            nav_content = '<ul class="nav nav-mobile-menu">' + nav_content + '</ul>';
            $navbar_form = $('nav').find('.navbar-form').clone(true);
            $sidebar_nav = $sidebar_wrapper.find(' .nav-container');
            // insert the navbar form before the sidebar list
            $nav_content = $(nav_content);
            $nav_content.insertBefore($sidebar_nav);
            $navbar_form.insertBefore($nav_content);
            $(".sidebar-wrapper .dropdown .dropdown-menu > li > a").click(function (event) {
                event.stopPropagation();
            });
            // simulate resize so all the charts/maps will be redrawn
            window.dispatchEvent(new Event('resize'));
            mobile_menu_initialized = true;
        } else {
            if ($(window).width() > 991) {
                // reset all the additions that we made for the sidebar wrapper only if the screen is bigger than 991px
                $sidebar_wrapper.find('.navbar-form').remove();
                $sidebar_wrapper.find('.nav-mobile-menu').remove();
                mobile_menu_initialized = false;
            }
        }
        if (!toggle_initialized) {
            $toggle = $('.navbar-toggle');
            $toggle.click(function () {
                if (mobile_menu_visible == 1) {
                    $('body').removeClass('nav-open');
                    $('.close-layer').remove();
                    setTimeout(function () {
                        $toggle.removeClass('toggled');
                    }, 400);
                    mobile_menu_visible = 0;
                } else {
                    setTimeout(function () {
                        $toggle.addClass('toggled');
                    }, 430);
                    main_panel_height = $('.main-panel')[0].scrollHeight;
                    $layer = $('<div class="close-layer"></div>');
                    $layer.css('height', main_panel_height + 'px');
                    $layer.appendTo(".main-panel");
                    setTimeout(function () {
                        $layer.addClass('visible');
                    }, 100);
                    $layer.click(function () {
                        $('body').removeClass('nav-open');
                        mobile_menu_visible = 0;
                        $layer.removeClass('visible');
                        setTimeout(function () {
                            $layer.remove();
                            $toggle.removeClass('toggled');
                            $('div').remove('.close-layer');
                        }, 400);
                    });
                    $('body').addClass('nav-open');
                    mobile_menu_visible = 1;
                }
            });

            // new function
            $toggle = $('.navbar-toggler');
            $toggle.click(function () {
                if (mobile_menu_visible == 1) {
                    $('body').removeClass('nav-open');
                    $('.close-layer').remove();
                    setTimeout(function () {
                        $toggle.removeClass('toggled');
                    }, 400);
                    mobile_menu_visible = 0;
                } else {
                    setTimeout(function () {
                        $toggle.addClass('toggled');
                    }, 430);
                    main_panel_height = $('.main-panel')[0].scrollHeight;
                    $layer = $('<div class="close-layer"></div>');
                    $layer.css('height', main_panel_height + 'px');
                    $layer.appendTo(".main-panel");
                    setTimeout(function () {
                        $layer.addClass('visible');
                    }, 100);
                    $layer.click(function () {
                        $('body').removeClass('nav-open');
                        mobile_menu_visible = 0;
                        $layer.removeClass('visible');
                        setTimeout(function () {
                            $layer.remove();
                            $toggle.removeClass('toggled');
                            $('div').remove('.close-layer');
                        }, 400);
                    });
                    $('body').addClass('nav-open');
                    mobile_menu_visible = 1;
                }
            });

            toggle_initialized = true;
        }
    }, 200),
    initBootstrapNavbarMenu: debounce(function () {
        if (!bootstrap_nav_initialized) {
            $navbar = $('nav').find('.navbar-collapse').first().clone(true);
            nav_content = '';
            mobile_menu_content = '';
            //add the content from the regular header to the mobile menu
            $navbar.children('ul').each(function () {
                content_buff = $(this).html();
                nav_content = nav_content + content_buff;
            });
            nav_content = '<ul class="nav nav-mobile-menu">' + nav_content + '</ul>';
            $navbar.html(nav_content);
            $navbar.addClass('off-canvas-sidebar');
            // append it to the body, so it will come from the right side of the screen
            $('body').append($navbar);
            $toggle = $('.navbar-toggle');
            $navbar.find('a').removeClass('btn btn-round btn-default');
            $navbar.find('button').removeClass('btn-round btn-fill btn-info btn-primary btn-success btn-danger btn-warning btn-neutral');
            $navbar.find('button').addClass('btn-simple btn-block');
            $toggle.click(function () {
                if (mobile_menu_visible == 1) {
                    $('html').removeClass('nav-open');
                    $('.close-layer').remove();
                    setTimeout(function () {
                        $toggle.removeClass('toggled');
                    }, 400);
                    mobile_menu_visible = 0;
                } else {
                    setTimeout(function () {
                        $toggle.addClass('toggled');
                    }, 430);
                    $layer = $('<div class="close-layer"></div>');
                    $layer.appendTo(".wrapper-full-page");
                    setTimeout(function () {
                        $layer.addClass('visible');
                    }, 100);
                    $layer.click(function () {
                        $('html').removeClass('nav-open');
                        mobile_menu_visible = 0;
                        $layer.removeClass('visible');
                        setTimeout(function () {
                            $layer.remove();
                            $toggle.removeClass('toggled');
                        }, 400);
                    });
                    $('html').addClass('nav-open');
                    $('<div class="close-layer"></div>').remove;
                    mobile_menu_visible = 1;
                }
            });
            bootstrap_nav_initialized = true;


        }
    }, 500),
}
// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
};
jQuery(document).ready(function () {
    window_width = $(window).width();
    $sidebar = $('.sidebar');
    mdp.initSidebarsCheck();
    if ($('body').hasClass('sidebar-mini')) {
        mdp.misc.sidebar_mini_active = true;
    }
    mdp.initMinimizeSidebar();
});
// activate mobile menus when the windows is resized
$(window).resize(function () {
    mdp.initSidebarsCheck();
});
