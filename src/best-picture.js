const d3 = require("d3");
const csv = require("./best-picture.csv")
const circleColors = {
    "base": "lightblue",
    "budget": "orange",
    "revenue": "pink"
}

// parse csv
d3.csv(csv)
    .then((data) => {
// Define the div for the tooltip
        var tooltip = d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("opacity", 0);

        // tree diagram: modified from https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd
        // convert data to JSON...
        var treeData = {"name": "Genres", "children": [], "class": "root"};
        var genreArr = [];
        var maxBudget = 0;
        var maxRevenue = 0;
        data.filter(function(d) {
            var genre = d["genre"];
            if (!genreArr.includes(genre)) {
                treeData["children"].push({"class": "genre", "name": genre, "children": []})
                genreArr.push(genre);
            }
            treeData["children"][genreArr.indexOf(genre)]["children"].push(
                {
                    "name": "",
                    "number":  d["revenue"],
                    "class": "revenue",
                    "always_show_circle": true,
                    "children": [{"name": "",
                                  "number": d["budget"],
                                  "always_show_circle": true,
                                  "class": "budget",
                                  "children": [{
                                    "name": d["title"],
                                    "class": "title",
                                    "year": d["year"],
                                    "is_winner": d["is_winner"] == "TRUE",
                                    "oviewview": d["overview"],
                                    "imdb_id": d["imdb_id"]
                                    }]
                                }]
                }
            )
        });

        // Set the dimensions and margins of the diagram
        var margin = {top: 20, right: 90, bottom: 30, left: 90},
            width = 1200 - margin.left - margin.right,
            height = 1800 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#best-picture").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate("
                + margin.left + "," + margin.top + ")");

        var i = 0,
            duration = 750,
            root;

        // declares a tree layout and assigns the size
        var treemap = d3.tree().size([height, width]);

        // Assigns parent, children, height, depth
        root = d3.hierarchy(treeData, function(d) { return d.children; });
        root.x0 = height;
        root.y0 = 0;

        // Collapse after the second level
        root.children.forEach(collapse);

        update(root);

        // Collapse the node and all it's children
        function collapse(d) {
            if(d.children && !Array("budget", "revenue").includes(d.data.class)) {
                d._children = d.children
                d._children.forEach(collapse)
                d.children = null
            }
        }

        function update(source) {

            // Assigns the x and y position for the nodes
            var treeData = treemap(root);

            // Compute the new tree layout.
            var nodes = treeData.descendants(),
                links = treeData.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach(function(d){ d.y = d.depth * 180});

            // ****************** Nodes section ***************************

            // Update the nodes...
            var node = svg.selectAll('g.node')
                .data(nodes, function(d) {return d.id || (d.id = ++i); });

            // Enter any new modes at the parent's previous position.
            var nodeEnter = node.enter().append('g')
                .attr('class', function(d) {
                    return `node ${d.data.class}`;
                })
                .attr("transform", function(d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on('click', function(d) {
                    if (d.data.class == "genre")
                        click(d)
                });

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
                    return d.children || d._children ? -13 : 13;
                })
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) {
                    if (d.data.class == "root")
                        return "";
                    if (d.data.class == "title")
                        return `${d.data.name} (${d.data.year})`
                    return d.data.name;
                 })
                 .attr("fill", function(d) {
                    if (d.data.class == "title" && d.data["is_winner"]) {
                        return "red"
                    }
                    return "black";
                 })
                 .attr("cursor", function(d) {
                     if (d.data.class == "title")
                        return "pointer";
                 }).on("click", function(d) {
                    if (d.data.class == "title")
                        changeInfoDisplay(d);
                 });

            // UPDATE
            var nodeUpdate = nodeEnter.merge(node);

            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            // Update the node attributes and style
            nodeUpdate.select('circle.node')
                .attr('r', function(d) {
                    var minSize = 10;
                    var size = 0;
                    if (d.data.number) {
                        size = Math.log2(d.data.number);
                    }
                    return Math.max(minSize, size)
                })
                .style("fill", function(d) {
                    if (d.data.always_show_circle) {
                        return circleColors[d.data.class]
                    }
                    return d._children ? circleColors["base"] : "#fff";
                })
                .style("stroke", function(d) {
                    if (d.data.class == "root" || d.data.class == "title") {
                        return "#fff"
                    }
                    if (d.data.always_show_circle) {
                        return circleColors[d.data.class]
                    }
                    return circleColors["base"];
                })
                .attr('cursor', function(d) {
                    if (d.data.class == "genre")
                        return 'pointer';
                })
                .on("mouseover", function(d) {
                    var className = d.data.class;
                    if (className != "revenue" && className != "budget")
                        return function() {};
                    var num = d.data.number;
                    if (num == 0) {
                        num = "Data Unavaliable"
                    } else {
                        num = "$" + num
                    }
                    tooltip.transition()
                        .duration(200)
                        .style("opacity", .9);
                        tooltip.html(`${className.charAt(0).toUpperCase()}${className.substring(1,)}:
                                        <br/>${num}`)
                        .style("left", (d3.event.pageX) + "px")
                        .style("top", (d3.event.pageY - 28) + "px");
                    })
                .on("mouseout", function(d) {
                    var className = d.data.class;
                    if (className != "revenue" && className != "budget")
                        return function() {};
                    tooltip.transition()
                        .duration(500)
                        .style("opacity", 0);
                });


            // Remove any exiting nodes
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            // On exit reduce the node circles size to 0
            nodeExit.select('circle')
                .attr('r', 1e-6);

            // On exit reduce the opacity of text labels
            nodeExit.select('text')
                .style('fill-opacity', 1e-6);

            // ****************** links section ***************************

            // Update the links...
            var link = svg.selectAll('path.link')
                .data(links, function(d) { return d.id; });

            // Enter any new links at the parent's previous position.
            var linkEnter = link.enter().insert('path', "g")
                .attr("class", "link")
                .attr('d', function(d){
                    var o = {x: source.x0, y: source.y0}
                    return diagonal(o, o)
                })
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("opacity", function(d) {
                    if (d.data.class == "genre")
                        return "0%";
                    return "50%";
                });

            // UPDATE
            var linkUpdate = linkEnter.merge(link);

            // Transition back to the parent element position
            linkUpdate.transition()
                .duration(duration)
                .attr('d', function(d){ return diagonal(d, d.parent) });

            // Remove any exiting links
            var linkExit = link.exit().transition()
                .duration(duration)
                .attr('d', function(d) {
                    var o = {x: source.x, y: source.y}
                    return diagonal(o, o)
                })
                .remove();

            // Store the old positions for transition.
            nodes.forEach(function(d){
                d.x0 = d.x;
                d.y0 = d.y;
            });

            // Creates a curved (diagonal) path from parent to the child nodes
            function diagonal(s, d) {
                path = `M ${s.y} ${s.x}
                        L ${(s.y + d.y) / 2} ${s.x},
                        L  ${(s.y + d.y) / 2} ${d.x},
                        L ${d.y} ${d.x}
                        `
                return path
            }

            // Toggle children on click.
            function click(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }

            // change info display
            function changeInfoDisplay(d) {
                var overview = document.getElementById("movie-overview");
                overview.innerText = d.data.overview;
                var imdbLink = document.getElementById("imdb-link");
                imdbLink.href = `https://www.imdb.com/title/${d.data.imdb_id}/`
                imdbLink.innerText = "Link to IMDB"

            }
        }
    })
