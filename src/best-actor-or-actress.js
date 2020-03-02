const d3 = require("d3");
const csv = require("./oscar_demos_mod.csv")
const circleColors = {
    "base": "blue"
}
var countryCirclePos = {};

// parse csv
d3.csv(csv)
    .then((data) => {
        var tooltip = d3.select("body").append("div")
            .attr("id", "best-actress-tooltip")
            .style("opacity", 0);

        // tree diagram: modified from https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd
        // convert data to JSON...
        var actress = {"name": "persons", "children": [], "class": "root"};
        var actressArr = [];
        var countryArr = [];
        data.filter(function(d) {
            if (d["Award"] == "Best Actress" && d["Country of birth"].length > 3) {
                var country = d["Country of birth"];
                if (!countryArr.includes(country)) {
                    countryArr.push(country);
                }
                var code = country.replace(/\s/g, '');
                if (!actressArr.includes(d["Person"])) {
                    actressArr.push(d["Person"]);
                    actress["children"].push(
                        {
                            "name": d["Person"],
                            "award_year": d["Year of award"],
                            "movie": d["Movie"],
                            "imdb_bio": d["Bio IMDb"],
                            "date_of_birth": d["Date of birth"],
                            "class": "person",
                            "code": code
                        }
                    )
                }
            }
        });

        // Set the dimensions and margins of the diagram
        var margin = {top: 20, right: 90, bottom: 30, left: 100},
            width = 1300 - margin.left - margin.right,
            height = 1000 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#best-actress").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate("
                + margin.left + "," + margin.top + ")");

        var i = 0,
            duration = 0,
            root;

        // declares a tree layout and assigns the size
        var treemap = d3.tree().size([height, width]);

        // Assigns parent, children, height, depth
        root = d3.hierarchy(actress, function(d) { return d.children; });
        root.x0 = height;
        root.y0 = 0;
        update(root);

        // Collapse the node and all it's children
        function collapse(d) { }

        function update(source) {

            // Assigns the x and y position for the nodes
            var actress = treemap(root);

            // Compute the new tree layout.
            var nodes = actress.descendants(),
                links = actress.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach(function(d){ d.y = d.depth * 180});

            // ****************** Nodes section ***************************

            // Update the nodes...
            var node = svg.selectAll('g.node')
                .data(nodes, function(d) {return d.id || (d.id = ++i); });

            // Enter any new modes at the parent's previous position.
            var nodeEnter = node.enter().append('g')
                .attr('class', function(d) {
                    return `node ${d.data.code}`;
                })
                .attr("transform", function(d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on("click", selectThisCode);

            // Add Circle for the nodes
            nodeEnter.append('circle')
                .attr('class', 'node')
                .attr('r', 1e-6)
                .style("fill", function(d) {
                    return d._children ? "lightsteelblue" : "#fff";
                });

            // Add labels for the nodes
            nodeEnter.append('text')
                .attr("dy", ".35em")
                .attr("x", function(d) {
                    return d.children || d._children ? -25 : 13;
                })
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) {
                    if (d.data.class == "root")
                        return "";
                    if (d.data.class == "person")
                        return `${d.data.name} (${d.data.award_year})`
                    return d.data.name;
                 })
                 .attr("cursor", function(d) {
                     if (d.data.class == "person")
                        return "pointer";
                 })
                 .on("mouseover", function(d) {
                    var className = d.data.class;
                    if (className != "person")
                        return function() {};
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                        tooltip.html(`${d.data.name}<br>
                                      ${d.data.date_of_birth}<br>
                                      ${d.data.movie}`)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    })
                .on("mouseout", function(d) {
                    var className = d.data.class;
                    if (className != "person")
                        return function() {};
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });

            // UPDATE
            var nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

                var totalHeight = 0
            var betweenHeight = 5;
            var countryRadius = [];
            for (let j = 0; j < countryArr.length; j++) {
                var country = countryArr[j]
                var code = country.replace(/\s/g, '');
                countryRadius.push(document.querySelectorAll(`.${code}`).length + 10);
            }
            // *************** Draw in coutry circles *****************
            for (let j = 0; j < countryArr.length; j++) {
                var country = countryArr[j]
                var code = country.replace(/\s/g, '');
                var node = svg.append("g")
                    .attr("class", `node ${code} countries`)
                    .attr("transform", function() {
                        var x = margin.left;
                        var y = margin.top + totalHeight + betweenHeight * j + countryRadius[j];
                        countryCirclePos[code] = {"x": x, "y": y};
                        return "translate(" + x + "," + y + ")";
                    })
                    .on("click", selectThisCode)
                .append('circle')
                    .attr("r", function() {
                        var r = countryRadius[j];
                        totalHeight += 2 * r;
                        return r;
                    })
                    .style("fill", "blue")
                d3.select(`g.countries.${code}`)
                    .append('text')
                        .attr("dy", ".35em")
                        .attr("x", function() {
                            return -35;
                        })
                        .attr("text-anchor", function(d) {
                            return "end";
                        })
                        .text(countryArr[j]);
            }

            // ****************** links section ***************************

            // // Update the links...
            // var link = svg.selectAll('path.link')
            //     .data(links, function(d) { return d.id; });

                

            // // Enter any new links at the parent's previous position.
            // var linkEnter = link.enter().insert('path', "g")
            //     .attr("class", function(d) {
            //         if (d.data.class == "person")
            //             return `link ${d.data.code}`
            //         return `link`;
            //     })
            //     .attr('d', function(d){
            //         var o = {x: d.x, y: d.y};
            //         if (d.data.class == "person") {
            //             var p = countryCirclePos[d.data.code];
            //             d3.linkHorizontal()
            //         }
            //         return ""
            //     })
            //     .attr("fill", "none")
            //     .attr("stroke", "gray")
            //     .attr("opacity", function(d) {
            //         return "50%";
            //     });

            // // Creates a curved (diagonal) path from parent to the child nodes
            // function diagonal(s, d) {
            //     path = `M ${s.y} ${s.x}
            //             L ${(s.y + d.y) / 2} ${s.x},
            //             L  ${(s.y + d.y) / 2} ${d.x},
            //             L ${d.y} ${d.x}
            //             `
            //     // debugger;
            //     return path
            // }

            // Toggle children on click.
            function selectThisCode(d) {
                console.log(d)
            }
        }
    
        for (var code in countryCirclePos) {
            debugger;
            var groups = document.querySelectorAll(`.${code}`)
            for (let k = 0; k < groups.length - 1; k++) {
                var x, y;
                [x, y] = groups[k].getAttribute("transform").split(",");
                x = parseFloat(x.replace(/[^\d]/g, ''));
                y = parseFloat(y.replace(/[^\d]/g, ''));
                console.log(`x: ${x}, y: ${y}`)
                var link = d3.linkHorizontal()({
                    source: [x, y],
                    target: [countryCirclePos[code]["x"], countryCirclePos[code]["y"]]
                });
                svg
                    .append('path')
                    .attr('d', link)
                    .attr('stroke', 'black')
                    .attr('fill', 'none');
            }
        }
    })

