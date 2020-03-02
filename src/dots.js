// set the dimensions and margins of the graph
var width = 1000
var height = 550

// append the svg object to the body of the page
var svg = d3.select("#best_dots")
  .append("svg")
    .attr("width", 77+'%')
    .attr("height", 550)
// create dummy data -> just one element per circle


const dfe = require('./oscar_demos_def.csv')
d3.csv(dfe, function(data) {
    // A scale that gives a X target position for each group
    var x = d3.scaleOrdinal()
      .domain(['White', 'Black', 'Asian', 'Hispanic', 'Middle Eastern', 'Multiracial'])
      .range([150, 300, 450, 600, 750, 900 ])

    // A color scale
    var color = d3.scaleOrdinal()
      .domain(['White', 'Black', 'Asian', 'Hispanic', 'Middle Eastern', 'Multiracial'])
      .range([ "#F8766D", "#00BA38", "#619CFF", "#d712a3", "#e0cb3f", "#9d34c8"])
    console.log(data)

    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("r", 5)
        .attr("cx", width / 3)
        .attr("cy", height / 3)
        .style("fill", function(d){ return color(d.race_ethnicity)})
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 2)
        .call(d3.drag() // call specific function when circle is dragged
             .on("start", dragstarted)
             .on("drag", dragged)
             .on("end", dragended));

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX().strength(0.2).x( function(d){ return x(d.race_ethnicity) } ))
        .force("y", d3.forceY().strength(0.1).y( height/2 ))
        .force("center", d3.forceCenter().x(width / 3).y(height / 3)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(.1).radius(10).iterations(1)) // Force that avoids circle overlapping

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
          node
              .attr("cx", function(d){ return d.x; })
              .attr("cy", function(d){ return d.y; })
        });

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
