var margin = {top: 10, right: 30, bottom: 30, left: 150},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var year = 2000;
// append the svg object to the body of the page
var svg = d3.select("#top10")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
const test = require('./imdb_rated_nominees.csv')
function update(yr) {
d3.csv(test, function(data) {
    // filter earlier; not quite sure if this is correct, but
    // at least bar chart is not crowded anymore
    var dataNew = data.filter(function(d) {
      if (parseInt(d.Year) == yr)
      return d.Year;
    });

  // X axis
  var x = d3.scaleLinear()
    .domain([0, 10])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("fill", "ffffff");

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(dataNew.map(function(d) {
      return d.Name; }))
    .padding(.1);

  svg.append("g")
    .attr("id", "bar-chart-y-axis")
    .call(d3.axisLeft(y))
    .selectAll("text")
      .style("fill", "ffffff");

    var bars = svg.selectAll(".bar")
        .remove()
        .exit()
        .data(dataNew);

    bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr("fill", "#D8A75E")
        .attr("width", function(d) { return x(d.averageRating); })
        .attr("height", y.bandwidth() )
        .attr('y', height)
        .attr("x", x(0) )
        .attr("y", function(d) { return y(d.Name); })
        .merge(bars)
        .transition()
        .duration(1000)

    // svg.selectAll("myRect")
    //   .data(dataNew)
    //   .enter()
    //   .append("rect")
    //     .attr("x", x(0) )
    //     .attr("y", function(d) { return y(d.Name); })
    //     .attr("width", function(d) { return x(d.averageRating); })
    //     .attr("height", y.bandwidth() )
    //     .attr("fill", "#D8A75E")
    //     .transition()
    //     .duration(1000)
    //
    // svg.selectAll("myRect")
    //   .exit()
    //   .transition()
    //   .duration(1000)
    //   .attr("x", x(0) )
    //   .attr("y", function(d) { return y(d.Name); })
    //   .remove();
});

}

  update(year); // call update once so bars will be generated on load


d3.select("#mySlider").on("input", function(d){
  year = parseInt(this.value);
  update(year);
});
