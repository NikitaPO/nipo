$(function() {
  $('.slider').slick({
    responsive: [{
      breakpoint: 1024,
      settings: {
        arrows: false
      }
    }]
  });

  $('.header__menu-icon').click(function() {
    $('.header__menu').slideToggle();
  });
});
