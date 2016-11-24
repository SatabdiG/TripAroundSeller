/**
 * Created by tasu on 24/11/16.
 */


function landingpagecontroller() {
    $(document).ready(function () {
        console.log("Welcome to the trip Around -- landing page");
        $('#login').on('click', function () {
            window.location.href = "#login";

        });

        $('#pagepiling').pagepiling({
            menu: null,
            direction: 'vertical',
            verticalCentered: true,
            sectionsColor: [],
            anchors: [],
            scrollingSpeed: 700,
            easing: 'swing',
            loopBottom: false,
            sectionsColor: ['#f2f2f2', '#4BBFC3', '#7BAABE', 'whitesmoke', '#000'],
            loopTop: false,
            css3: true,
            navigation: {
                'textColor': '#000',
                'bulletsColor': '#000',
                'position': 'right',
                'tooltips': ['section1', 'section2', 'section3', 'section4']
            },
            normalScrollElements: null,
            normalScrollElementTouchThreshold: 5,
            touchSensitivity: 5,
            keyboardScrolling: true,
            sectionSelector: '.section',
            animateAnchor: false,

            //events
            onLeave: function(index, nextIndex, direction){},
            afterLoad: function(anchorLink, index){},
            afterRender: function(){},
        });

    });
}

