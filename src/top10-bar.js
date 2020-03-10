var margin = {top: 10, right: 30, bottom: 30, left: 150},
    width = 750,
    height = 600 - margin.top - margin.bottom;

var year = 1928;
var xx;
const delay = function(d, i) {
  return i * 40;
};

var prevWidth;

var svg = d3.select("#top10")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

let label = document.getElementById("time-slider-label");
let labels = [];
labels[0] = 1928;

for (let i = 1; i <= 92; i++){
  labels[i] = labels[i-1]+1;
}
      for (let i = 0; i <= 92; i++) {
        if (i % 4 == 0){
          div = document.createElement("div");
          div.innerText = labels[i]
          label.appendChild(div);
        }

      }
  // create the tick mark
  let list = document.getElementById("steplist");
  for (let i = 0; i < 92; i++) {
      opt = document.createElement("option");
      opt.innerText = i;
      list.appendChild(opt);
}

// get the data
const test = require('./imdb_rated_nominees.csv')
function update(yr) {
  if (yr == 1934) {yr = 1935;}
d3.csv(test, function(data) {
    // filter earlier; not quite sure if this is correct, but
    // at least bar chart is not crowded anymore
    var dataNew = data.filter(function(d) {
      if (parseInt(d.Year) == yr)
      return d.Year;
    });
    var duration = 1000;
  // X axis
  var x = d3.scaleLinear()
    .domain([0, 10])
    .range([ 0, width]);

    svg.append('g')
        .attr('transform', 'translate(0, ' + (height) + ')')
        .attr('class', 'x axis');

    svg.append('g')
        .attr('class', 'y axis');

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(dataNew.map(function(d) {
      return d.Name; }))
    .padding(.1);

    var bars = svg.selectAll(".bar")
        .remove()
        .exit()
        .data(dataNew);

    bars
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr("fill", function(d) {
          if (d.Win == 'True'){
            return "#D7A764";
          }
          else {
            return "#595959";
          }
        })
        .attr('width', 0)
        .attr('height', y.bandwidth())
        .attr("y", function(d) { return y(d.Name); })
        .merge(bars)
        .transition()
        .duration(1000)
        .delay(100)
        .attr("height", y.bandwidth())
        .attr("width", function(d, i) {
          return x(d.averageRating);
        })
        .attr("x", x(0) )
        .transition()
        .duration(1000);
        /*
        .attr("height", function(d, i) {
            return height - yscale(d);
        })
        */
    bars
        .exit()
        .remove();

    bars
        .transition()
        .duration(duration)
        .attr("width", function(d) { return x(d.averageRating); })
            .transition()
            .duration(1000)
            .delay(function (d, i) {
                return i * 150;
            })
        .attr("x", x(0))
        .delay(delay);

    var labels = svg.selectAll('.label')
        .data(dataNew);

      svg.select('.y.axis')
          .transition()
          .duration(duration)
          .call(d3.axisLeft(y))

      svg.select('.x.axis')
          .transition()
          .duration(duration)
          .call(d3.axisBottom(x));
});

}

  update(year); // call update once so bars will be generated on load


d3.select("#mySlider").on("input", function(d){
  let yearLabel = document.getElementById("yearTitle");
  year = parseInt(this.value);
  xx = ((year - 1928)/92)*100;
  let colorS = "linear-gradient(90deg, rgb(215, 167, 100)" + xx +"%" + ", rgb(155, 155, 155)" + xx +"%" + ")";
  this.style.background = colorS;
  yearLabel.innerText = year;
  update(year);
});
