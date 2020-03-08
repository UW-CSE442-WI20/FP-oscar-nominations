// set the dimensions and margins of the graph
var width =  $(window).width() * 0.6
var height = 550
var char_generated = document.getElementById("best_dots").childElementCount > 0;
var radius = 4
// append the svg object to the body of the page
var svg = d3.select("#best_dots")
  .append("svg")
    .attr("width", width)
    .attr("height", 550)
    .attr("align", 'center')
var lsvg = d3.select("#dots_legend").attr("width", width * 0.2).attr("height", height)
var award = 'st'

const dfe = require('./oscar_demos_def.csv');
d3.csv(dfe, function(raw_data) {

    var awards = d3.map(raw_data, function(d){return d.award;}).keys();

    data = raw_data.filter(function(d){
      var cond = d['award'].includes(award);
      return cond;
    })

    var unique = d3.map(data, function(d){return d.race_ethnicity;}).keys();
    var x_range = [];
    for (var i = 1; i <= unique.length; i++) {
        x_range.push(width * 0.95 * i / unique.length);
    }

    // A scale that gives a X target position for each group
    var x = d3.scaleOrdinal()
      .domain(unique)
      .range(x_range)

    // A color scale
    var color = d3.scaleOrdinal()
      .domain(unique)
      .range(d3.schemeSet1)
    lsvg.selectAll("dots")
      .data(unique)
      .enter()
      .append("circle")
        .attr("cx", 80)
        .attr("cy", function(d,i){ return ((height / 2 ) - (unique.length * 15) + 25) + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", radius)
        .style("fill", function(d){return color(d)})

    lsvg.selectAll("mylabels")
      .data(unique)
      .enter()
      .append("text")
        .attr("x", 120)
        .attr("y", function(d,i){ return ((height / 2 ) - (unique.length * 15) + 25) + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
    var Tooltip = d3.select("#best_dots")
      .append("div")
      .style("opacity", 1)
      .html("Hover over a dot for the oscar winner's name and movie!")
      .attr("class", "tooltip")
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
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .attr('align', 'left')

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip
        .transition()
        .duration(200)
        .style("opacity", 1)
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", 2 * radius)
        // .attr("stroke", "#eca233")
        .attr("stroke", "#ffffff")
        .style("stroke-width", 2)
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
        .duration(200)
        .style("opacity", 1)
        .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
      d3.select(this)
        .transition()
        .duration(200)
        .attr("r", radius)
        .style("stroke-width", 0)
    }


    // Initialize the circle: all located at the center of the svg area
    var node = svg.append("g")
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
        .attr("r", radius)
        // .attr("cx", $(window).width() * 0.66 / unique.length)
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", function(d){ return color(d.race_ethnicity)})
        .style("fill-opacity", 0.9)
        .attr("stroke", "#D8A75E")
        .style("stroke-width", 0)
        .call(d3.drag() // call specific function when circle is dragged
             .on("start", dragstarted)
             .on("drag", dragged)
             .on("end", dragended))

         .on("mouseover", mouseover)
         .on("mousemove", mousemove)
         .on("mouseleave", mouseleave)
         .on("dblclick", doubleclick);;

    var coll_rad = new Map()
    coll_rad.set("Best Director", 1.5 * radius);
    coll_rad.set("Best Actor", 1.5 * radius);
    coll_rad.set("Best Supporting Actor", 1.5 * radius);
    coll_rad.set("Best Actress", 1.5 * radius);
    coll_rad.set("Best Supporting Actress", 1.5 * radius);
    console.log(coll_rad)

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX().strength(0.3).x( function(d){ return x(d.race_ethnicity) } ))
        .force("y", d3.forceY().strength(0.2).y( height/2 ))
        .force("center", d3.forceCenter().x($(window).width() * 0.6 / unique.length).y(height / 2)) // Attraction to the center of the svg area
        .force("charge", d3.forceManyBody().strength(-10)) // Nodes are attracted one each other of value is > 0
        .force("collide", d3.forceCollide().strength(1).radius(function(d){return coll_rad.get(d.award)} ).iterations(1)) // Force that avoids circle overlapping

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
      .html("Name: " + d.person + "<br>Movie: <a href =\"" + d.movie_IMDB_Link + "\" target = _blank> " + d.movie + "</a>")
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

    d3.selectAll(".checkbox").on("change",update);
      update();


      function update(){
        var choices = [];
                d3.selectAll(".checkbox").each(function(d){
                  cb = d3.select(this);
                  if(cb.property("checked")){
                    choices.push(cb.property("value"));
                  }
                });
        data = raw_data.filter(function(d){return !choices.includes(d.award);});
        svg.selectAll("circle")
        .filter(function(d){return !choices.includes(d.award);})
        .transition()
        .duration(1000)
        .style("opacity", 0).attr("r", 0)
        svg.selectAll("circle")
        .filter(function(d){return choices.includes(d.award);})
        .transition()
        .duration(1000)
        .style("opacity", 0.9).attr("r", radius)

        for (var i = 0; i < awards.length; i++) {
            if (choices.includes(awards[i])) {
              coll_rad.set(awards[i], 1.5 * radius);
            } else {
                coll_rad.set(awards[i], 0);
            }
        }


      }
  })
