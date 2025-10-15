function openNav() {
    document.getElementById("mySidenav").style.width = "300px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

document.querySelectorAll(".row").forEach(section => {
    section.classList.add(`section`);
})


$(function () {

    // Set up vars
    var _window = $(window),
        sections = $('.section'),
        sectionsY = [];

    // Cache position of each panel
    $.each(sections, function (i, el) {
        sectionsY.push(sections.eq(i).offset().top);
    });


    // Bind our function to window scroll
    _window.bind('scroll', function () {
        updateWindow();
    });

    // Update the window
    function updateWindow() {
        var y = _window.scrollTop();

        // Loop through our section positions
        for (i = 0, l = sections.length; i < l; i++) {
            /*
                Firstly, we break if we're checking our last section,
                otherwise we compare if he y position is in between
                two panels
            */
            if ((i === l - 1) || (y >= sectionsY[i] && y <= sectionsY[i + 1])) {
                break;
            }
        };

        // Update classes


        sections.not(':eq(' + i + ')').removeClass('section-fixed');
        sections.eq(i).addClass('section-fixed');






    };

});
