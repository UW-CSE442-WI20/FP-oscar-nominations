// set the dimensions and margins of the graph
var width =  $(window).width() * 0.7
var height = 550

// append the svg object to the body of the page
var svg = d3.select("#best_dots")
  .append("svg")
    .attr("width", width)
    .attr("height", 550)
    .attr("align", 'center')
// create dummy data -> just one element per circle

var award = 'st'

const dfe = require('./oscar_demos_def.csv');
d3.csv(dfe, function(data) {

    data = data.filter(function(d){
      var cond = d['award'].includes(award);
      return cond;
    })

    var unique = d3.set(data, function(d) {return d.race_ethnicity});
    var x_range = [];
    var incrementor =  width / unique.size()
    for (var i = 1; i <= unique.size(); i++) {
        x_range.push(i);
    }
    console.log(x_range)

    // A scale that gives a X target position for each group
    var x = d3.scaleOrdinal()
      .domain(unique)
      .range(x_range)

    // A color scale
    var color = d3.scaleOrdinal()
      .domain(unique)
      .range([ "#FFFFFF", "#00BA38", "#619CFF", "#d712a3", "#e0cb3f", "#9d34c8"])

      // create a tooltip
    var Tooltip = d3.select("#best_dots")
      .append("div")
      .style("opacity", 1)
      .html("[INSTRUCTIONS FOR VISUALIZATION GOES HERE]")
      .attr("class", "tooltip")
      // .style("background-color", "white")
      // .style("border", "solid")
      .style("color", 'white')
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .attr('align', 'left')

    var Info_box = d3.select("#info_box")
      .append("div")
      .style("opacity", 1)
      .html("Double Click a dot for more information")
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .attr('align', 'left')

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip
        .transition()
        .duration(100)
        .style("opacity", 1)
      d3.select(this)
        .transition()
        .duration(100)
        .attr("r", 10)
    }
    var mousemove = function(d) {
      Tooltip
        .html("Name: " + d.person +"<br>Movie: "+d.movie)
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
    }
    var mouseleave = function(d) {
      Tooltip
        .transition()
        .duration(100)
        .style("opacity", 1)
        .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
      d3.select(this)
        .transition()
        .duration(100)
        .attr("r", 5)
    }


    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("r", 5)
        .attr("cx", $(window).width() * 0.66 / unique.size())
        .attr("cy", height / 2)
        .style("fill", function(d){ return color(d.race_ethnicity)})
        .style("fill-opacity", 0.9)
        .attr("stroke", "#D8A75E")
        .style("stroke-width", 1)
        .call(d3.drag() // call specific function when circle is dragged
             .on("start", dragstarted)
             .on("drag", dragged)
             .on("end", dragended))

         .on("mouseover", mouseover)
         .on("mousemove", mousemove)
         .on("mouseleave", mouseleave)
         .on("dblclick", doubleclick);;

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX().strength(0.2).x( function(d){ return $(window).width() * x(d.race_ethnicity) * 0.7 / (unique.size()) } ))
        .force("y", d3.forceY().strength(0.04).y( height/2 ))
        .force("center", d3.forceCenter().x($(window).width() * 0.66 / unique.size()).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.4).radius(11).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
          node
              .attr("cx", function(d){ return d.x; })
              .attr("cy", function(d){ return d.y; })
        });
    function doubleclick(d) {
      Info_box
      .html("Name: " + d.person + "<br>Movie: " + d.movie + "<br><a href =\"" + d.movie_IMDB_Link + "\" target = _blank> IMDb</a>")
      .transition()
      .duration(100)
    }
    // What happens when a circle is dragged?
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }
    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }
    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
    }
  })
