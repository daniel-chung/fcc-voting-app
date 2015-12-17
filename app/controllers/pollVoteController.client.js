'use strict';

(function () {
  var currUrl = window.location.pathname.split( '/' );
  var apiUrl = appUrl + '/api/'+currUrl[2]+'/poll/'+currUrl[4];
  var pollName = document.getElementsByClassName('poll-name')[0];
  var formGroup = document.getElementsByClassName('form-group')[0];
  var shareLink = document.getElementsByClassName('share-link')[0];

  // function to handle poll options dynamically
  function addPollOption (obj) {
    var br = document.createElement("br");
    var myInput = document.createElement("input");
    var t = document.createTextNode(' '+obj.name);

    myInput.setAttribute("type", "radio");
    myInput.setAttribute("name", "voteResult");
    myInput.setAttribute("value", "option"+obj.id);
    if (obj.id === 0) {
      myInput.setAttribute("checked", "");
    }
    formGroup.appendChild(br);
    formGroup.appendChild(myInput);
    formGroup.appendChild(t);
  };

  // Call back function for adding values to the page
  function updatePage (data) {
    var jsonData = JSON.parse(data)
    var options = jsonData.options;
    pollName.innerHTML = jsonData.name;
    // Add all options using above function
    for (var i=0; i<options.length; i++) {
      addPollOption(options[i]);
    }
    // Add a sharable link for master
    if (currUrl[currUrl.length-1] === 'master') {
      shareLink.innerHTML =
        'Share your poll with others by sending them the following url:'+
        '<br>'+
          window.location.href.toString().replace(/\/master$/, '');
    }
  };

  // On load - run script
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePage));

  // Add listener on add button
  var submitButton = document.getElementsByClassName('submit-btn')[0];
  submitButton.addEventListener('click', function () {
     ajaxFunctions.ajaxRequest('POST', apiUrl, function () {
       console.log("vote submitted");
     });
  }, false);


})();
