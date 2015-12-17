// views/js/pollController.view.js
$(document).ready(function() {

  $("li#myNav").hover(
    function() {
      $(this).addClass("nav-hover");
    },
    function() {
      $(this).removeClass("nav-hover");
    }
  );

  $("navbar-brand").hover(
    function() {
      $(this).addClass("nav-hover");
    },
    function() {
      $(this).removeClass("nav-hover");
    }
  );

  $(".dropdown-toggle").dropdown();

});
