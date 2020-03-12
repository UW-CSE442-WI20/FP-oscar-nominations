// set the dimensions and margins of the graph
var width =  $(window).width() * 0.65
var selected = 'race_ethnicity'
var height = 550
var char_generated = document.getElementById("best_dots").childElementCount > 0;
var radius = 4
// append the svg object to the body of the page
var svg = d3.select("#best_dots")
  .append("svg")
    .attr("width", width)
    .attr("height", 550)
    .attr("align", 'center')
var lsvg = d3.select("#dots_legend").attr("width", width * 0.125).attr("height", height)
var award = 'st'
var duration_sec = 1000

const dfe = require('./oscar_demos_def.csv');
d3.csv(dfe, function(raw_data) {

    var awards = d3.map(raw_data, function(d){return d.award;}).keys();

    data = raw_data

    var unique = d3.map(raw_data, function(d){return d[selected];}).keys().sort(function(x, y){
       return d3.ascending(x[0], y[0]);
    });
    var x_range = [];
    for (var i = 1; i <= unique.length; i++) {
        x_range.push( width * 0.8 * i / unique.length);
    }

    // A scale that gives a X target position for each group
    x = d3.scaleOrdinal()
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
        .attr("cx", 30)
        .attr("cy", function(d,i){ return ((height / 2 ) - (unique.length * 15) + 25) + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", radius)
        .style("fill", function(d){return color(d)})

    lsvg.selectAll("mylabels")
      .data(unique)
      .enter()
      .append("text")
        .attr("x", 50)
        .attr("y", function(d,i){ return ((height / 2 ) - (unique.length * 15) + 25) + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
    var Tooltip = d3.select("#info_box")
      .append("div")
      .style("opacity", 1)
      .html("Hover over a dot for the oscar winner's name and movie!<br><br><br>")
      .attr("class", "tooltip")
      .style("color", 'white')
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")
      .style("padding-left", "5px")
      .attr('align', 'left')
    var Info_box = d3.select("#info_box")
      .append("div")
      .style("opacity", 1)
      .html("Click a dot for more information ")
      .attr("class", "tooltip")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      // .style("background-color", "#2f2f2f")
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
        .duration(200)
        .attr("r", 2 * radius)
        // .attr("stroke", "#eca233")
        .attr("stroke", "#ffffff")
        .style("stroke-width", 2)
    }
    var mousemove = function(d) {
      Tooltip
        .html("<strong>You're hovering over</strong><br><br>Name: " + d.person +"<br>Movie: "+d.movie+"<br><br><br>")
    }
    var mouseleave = function(d) {
      Tooltip
        .transition()
        .duration(300)
        .style("opacity", 0)
      // .html("")
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
        .style("fill", function(d){ return color(d[selected])})
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
         .on("click", doubleclick);;

    // Features of the forces applied to the nodes:
    var   simulation = d3.forceSimulation()
          .force("x", d3.forceX().strength(0.03).x( function(d){ return x(d[selected]) } ))
          .force("y", d3.forceY().strength(0.02).y( height/2 ))
          .force("charge", d3.forceManyBody().strength(-1.5)) // Nodes are attracted one each other of value is > 0
          .force("collide", d3.forceCollide().strength(0.5).radius(1.5 * radius ).iterations(1)) // Force that avoids circle overlapping
          .velocityDecay(0.25)

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d){
          node
              .attr("cx", function(d){ return d.x; })
              .attr("cy", function(d){ return d.y; })
        });

    var demographic_metrics = [
      ['race_ethnicity', 'Race'],
      ['sexual_orientation', 'Sexuality'],
      ['religion', 'Religion'],
      ['rating_bin', 'IMDb Rating'],
      ['runtime_bin', 'Runtime (Hours)']
    ]
    var demographyMenu = d3.select("#demographyDropdown")
    demographyMenu
    .append("select")
    .selectAll("option")
        .data(demographic_metrics)
        .enter()
        .append("option")
        .attr("value", function(d){return d[0];})
        .text(function(d){return d[1];})
    function doubleclick(d) {
      Info_box
      .html("<strong>You've clicked on</strong><br><br>"+
        "<strong>Name</strong>: <a href = \"" + d.bioLink +  "\" target = _blank> " + d.person + "</a><br>" +
        "<strong>Movie</strong>: <a href =\"" + d.movie_IMDB_Link + "\" target = _blank> " + d.movie + " (" + (d.year_of_award - 1) + ")</a><br><br>" +
        "<strong>Year Awarded</strong>: " + d.year_of_award + "<br>" +
        "<strong>Birthplace</strong>: " + d.birthplace + "<br>" +
        "<strong>DOB</strong>: " + d.date_of_birth + "<br>" +
        "<strong>Race</strong>: " + d.race_ethnicity + "<br>" +
        "<strong>Religion</strong>: " + d.religion + "<br>" +
        "<strong>Sexuality</strong>: " + d.sexual_orientation + "<br>"+
        "<strong>Movie Rating</strong>: " + d.rating_bin + "<br>"+
        "<strong>Movie Runtime</strong>: " + d.runtime_bin + " Hours<br>"
      )
      .transition()
      .duration(duration_sec)
    }

    d3.selectAll(".checkbox").on("change",update);
      function update(){
        simulation.stop()

        var choices = [];
                d3.selectAll(".checkbox").each(function(d){
                  cb = d3.select(this);
                  if(cb.property("checked")){
                    choices.push(cb.property("value"));
                  }
                });
        data = raw_data.filter(function(d){return choices.includes(d.award);});

        unique = d3.map(raw_data, function(d){return d[selected];}).keys().sort(function(x, y){
           return d3.ascending(x[0], y[0]);
        });
        x_range = [];
        for (var i = 1; i <= unique.length; i++) {
            x_range.push( (width *0.8*i / (unique.length)));
        }

        // A scale that gives a X target position for each group
        x = d3.scaleOrdinal()
          .domain(unique)
          .range(x_range)

        // A color scale
        color = d3.scaleOrdinal()
          .domain(unique)
          .range(d3.schemeSet1)

          simulation = d3.forceSimulation()
              .force("x", d3.forceX().strength(0.03).x( function(d){ return x(d[selected]) } ))
              .force("y", d3.forceY().strength(0.02).y( height/2 ))
              .force("charge", d3.forceManyBody().strength(-1.5)) // Nodes are attracted one each other of value is > 0
              .force("collide", d3.forceCollide().strength(0.5).radius(1.5 * radius ).iterations(1)) // Force that avoids circle overlapping
              .velocityDecay(0.25)

        // A color scale
        color = d3.scaleOrdinal()
          .domain(unique)
          .range(d3.schemeSet1)

        svg.selectAll("circle")
        // .filter(function(d){return !choices.includes(d.award);})
        .transition()
        .duration(duration_sec)
        .style("opacity", 0).attr("r", 0).remove()

        // Initialize the circle: all located at the center of the svg area
        node = svg.append("g")
          .selectAll("circle")
          .data(data)
          .enter()
          .append("circle")
            .attr("r", radius)
            // .attr("cx", $(window).width() * 0.66 / unique.length)
            .attr("cx", width / 2)
            .attr("cy", height / 2)
            .style("fill", function(d){ return color(d[selected])})
            .style("fill-opacity", 0.9)
            .call(d3.drag() // call specific function when circle is dragged
                 .on("start", dragstarted)
                 .on("drag", dragged)
                 .on("end", dragended))
             .on("mouseover", mouseover)
             .on("mousemove", mousemove)
             .on("mouseleave", mouseleave)
             .on("click", doubleclick);;
       simulation
           .nodes(data)
           .on("tick", function(d){
             node
                 .attr("cx", function(d){ return d.x; })
                 .attr("cy", function(d){ return d.y; })
           });
        simulation.restart()
      }

      d3.selectAll(".demographyDropdown").on("change", update_demos)
      function update_demos(){
        simulation.stop()
        selected = d3.select(this)
          .select("select")
          .property("value")
        unique = d3.map(raw_data, function(d){return d[selected];}).keys().sort(function(x, y){
           return d3.ascending(x[0], y[0]);
        });
        x_range = [];
        for (var i = 1; i <= unique.length; i++) {
            x_range.push( (width *0.8*i / (unique.length)));
        }

        // A scale that gives a X target position for each group
        x = d3.scaleOrdinal()
          .domain(unique)
          .range(x_range)

        // A color scale
        color = d3.scaleOrdinal()
          .domain(unique)
          .range(d3.schemeSet1)

          simulation = d3.forceSimulation()
              .force("x", d3.forceX().strength(0.03).x( function(d){ return x(d[selected]) } ))
              .force("y", d3.forceY().strength(0.02).y( height/2 ))
              .force("charge", d3.forceManyBody().strength(-1.5)) // Nodes are attracted one each other of value is > 0
              .force("collide", d3.forceCollide().strength(0.5).radius(1.5 * radius ).iterations(1)) // Force that avoids circle overlapping
              .velocityDecay(0.25)

          // Apply these forces to the nodes and update their positions.
          // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.

        lsvg.selectAll("circle").remove()
        lsvg.selectAll("circle")
          .data(unique)
          .enter()
          .append("circle")
            .attr("cx", 30)
            .attr("cy", function(d,i){ return ((height / 2 ) - (unique.length * 15) + 25) + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", radius)
            .style("fill", function(d){return color(d)})

        lsvg.selectAll("text").remove()
        lsvg.selectAll("text")
          .data(unique)
          .enter()
          .append("text")
            .attr("x", 50)
            .attr("y", function(d,i){ return ((height / 2 ) - (unique.length * 15) + 25) + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", function(d){ return color(d)})
            .text(function(d){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")

        svg.selectAll('circle').transition().duration(duration_sec)
        .style("fill", function(d){ return color(d[selected])})
        .attr("x", function(d){ return x(d[selected])})
        simulation
            .nodes(data)
            .on("tick", function(d){
              node
                  .attr("cx", function(d){ return d.x; })
                  .attr("cy", function(d){ return d.y; })
            });
        simulation.restart()
      }

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
