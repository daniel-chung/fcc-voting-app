// /app/controllers/pollController.client.js

'use strict';

(function () {
  var testBtn = document.getElementsByClassName('test-btn')[0];
  var pollList = document.getElementsByClassName('poll-list')[0];
  var apiUrl = appUrl + '/api/:id/poll';

  function updatePolls (data) {
    // Clear polls before adding #Note: think about just removing the necessary ones
    pollList.innerHTML = null;

    // List polls
    var pollsObject = JSON.parse(data);
    for (var i=0; i<pollsObject.polls.length; i++) {
      if (pollsObject.polls[i].name.length > 27 ) {
        var pollName = pollsObject.polls[i].name.substring(0, 24) + "...";
      }
      else {
        var pollName = pollsObject.polls[i].name;
      }
      pollList
        .innerHTML +=
          '<div class="container-fluid">'+
              '<div class="row">'+
                  '<div class="col-sm-6 col-sm-offset-3 center-text">'+
                      '<div class="well polls">'+
                        '<div class="poll-name">' + pollName +'</div> '+

                        '<a href="/poll/'+ pollsObject._id +'/view/'+ pollsObject.polls[i].id +'">'+
                        '<div class="btn btn-default btn-show">'+
                        'show'+
                        '</div> '+
                        '</a> '+

                        '<div class="btn btn-default btn-delete poll-'+ pollsObject.polls[i].id +'">'+
                        'delete'+
                        '</div>'+
                        '<div style="clear: both;"></div>'+
                      '</div>'+
                  '</div>'+
              '</div>'+
          '<div>'
          ;
    }

    // Add listener on delete button
    var deleteButton = document.getElementsByClassName('btn-delete');
    var re = / poll-(\d+)/;
    function addListener(i) {
      deleteButton[i].addEventListener('click', function () {
        var pollId = re.exec(deleteButton[i].className)[1]
        ajaxFunctions.ajaxRequest('DELETE', apiUrl +'/'+ pollId, function () {
          ajaxFunctions.ajaxRequest('GET', apiUrl, updatePolls);
        });
      }, false);
    }
    for (var i=0; i<deleteButton.length; i++) {
      addListener(i);
    }
  }

  // on load - run the GET method
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, updatePolls));


})();
