// /app/controllers/pollCreateController.client.js

'use strict';

(function () {
  var apiUrl = appUrl+'/api/:id/userData';
  var form = document.getElementsByClassName('form')[0];
  var formGroup = document.getElementsByClassName('form-group')[1];
  var counter = 1;
  var maxPolls = '';
  var userId = '';

  // Call back function for adding an option
  function addPollOption () {
    var myInput = document.createElement("input");
    myInput.setAttribute("type", "text");
    myInput.setAttribute("class", "form-control");
    myInput.setAttribute("name", "pollOption"+counter);
    myInput.setAttribute("placeholder", "New Option");
    formGroup.appendChild(myInput);
  };

  // Form validation
  // Add listener on form inputs
  function addValidation () {
    var pollName = document.getElementsByClassName('poll-name')[0];
    var pollInput0 = document.getElementsByClassName('poll-option0')[0];
    var pollInput1 = document.getElementsByClassName('poll-option1')[0];
    var formControl = document.getElementsByClassName('form-control');
    var submitBtn = document.getElementsByClassName('submitBtn')[0];

    for (var i=0; i<formControl.length; i++) {
      formControl[i].addEventListener('input', function() {
        if (pollName.value==='' || pollInput0.value==='' || pollInput1.value==='')
          submitBtn.setAttribute('disabled', '');
        else
          submitBtn.removeAttribute('disabled');
        /*console.log(
          'input name:', pollName.value,
          'input 0:', pollInput0.value,
          'input 1:', pollInput1.value,
          'submit btn:', submitBtn.hasAttribute('disabled'),
          'counter: ', counter
        );*/
      });
    }
    // Send back the number of options in the url
    form.setAttribute('action', '/poll/createPoll/'+counter);

  };

// Figure out if I need to add the ajax functions

  //ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrlRoot, addValidation));
  addValidation();

  // Add listener on add button
  var addButton = document.getElementsByClassName('add-option')[0];
  addButton.addEventListener('click', function() {
    counter++;
    //ajaxFunctions.ajaxRequest('GET', apiUrlRoot, addPollOption);
    addPollOption();
    addValidation();
  }, false);


//=============working
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function(data){
    maxPolls = JSON.parse(data).maxPolls;
    userId = JSON.parse(data)._id;
  }));


})();
