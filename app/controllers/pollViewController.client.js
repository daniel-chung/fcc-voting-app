// /app/controllers/pollViewController.client.js

'use strict';

(function () {

  var pollName = document.getElementsByClassName('poll-name')[0];
  //var pollValues = document.getElementsByClassName('poll-values')[0];
  var currUrl = window.location.pathname.split( '/' );
  var apiUrl = appUrl+'/api/'+currUrl[2]+'/poll/'+currUrl[4];

  function visualizeData (data) {
    // Add Name
    var clicksObject = JSON.parse(data);
    pollName.innerHTML += clicksObject.name;

    /* Currently not showing tabular data
    // Add Name
    var clicksObject = JSON.parse(data);
    pollName.innerHTML = clicksObject.name;

    // Poll Option callback
    function addPollOptions(i) {
      pollValues.innerHTML +=
        '<span>'+clicksObject.options[i].name+'</span> : '+
        '<span>'+clicksObject.options[i].count+'</span>'+
        '<br>';
    };
    // Add poll options
    var data = [];
    console.log('options: ', clicksObject.options)

    for (var i=0; i<clicksObject.options.length; i++) {
      addPollOptions(i);
      data.push(
        {name: clicksObject.options[i].name,
         value: clicksObject.options[i].count});
    }
    */

    // Format data for d3.js
    var data = [];
    for (var i=0; i<clicksObject.options.length; i++) {
      data.push(
        {name: clicksObject.options[i].name,
         value: clicksObject.options[i].count});
    }

    // d3.js vertical
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 400 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;
    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);
    var y = d3.scale.linear()
        .rangeRound([height, 0]);
    /*var y = d3.scale.linear()
        .range([height, 0]);*/
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        //.ticks(0)
        ;

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Data model
    x.domain(data.map(function(d) { return d.name; }));
    y.domain([0, d3.max(data, function(d) { return d.value; })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Count");

    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.name); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });

    function type(d) {
      d.value = +d.value;
      return d;
    }



  };

  // on load - run the GET method
  ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, visualizeData));

})();
