const d3 = require("d3");
const csv = require("./oscar_demos_mod.csv")
const palette = {
    "countryLink": "gray",
    "countryCircle": "lightsteelblue",
    "ageLink": "gray",
    "ageCircle": "orange"
}
const textToCircleDist = -100; // for the ageBin and Country need to be < 0
const ageBinBase = 20
const ageBinSize = 20;
const minCircleSize = 10;
const ageBinNames = ["one", "two", "three", "four", "five"]
// parse csv
d3.csv(csv)
    .then((data) => {
        var tooltip = d3.select("body").append("div")
            .attr("id", "best-actor-tooltip")
            .style("opacity", 0);

        // tree diagram: modified from https://bl.ocks.org/d3noob/43a860bc0024792f8803bba8ca0d5ecd
        // convert data to JSON...
        var actor = {"name": "persons", "children": [], "class": "root"};
        var actorArr = [];
        var countryArr = [];
        var ageBinArr = [];
        data.filter(function(d) {
            if (d["Award"] == "Best Actor" && d["Country of birth"].length > 3) {
                var country = d["Country of birth"];
                if (!countryArr.includes(country)) {
                    countryArr.push(country);
                }
                var code = country.replace(/\s/g, '');
                if (!actorArr.includes(d["Person"])) {
                    var ageBin = ageBinNames[parseInt((d["Age When Award"] - ageBinBase) / ageBinSize)];
                    if (!ageBinArr.includes(ageBin))
                        ageBinArr.push(ageBin);
                    actorArr.push(d["Person"]);
                    actor["children"].push(
                        {
                            "name": d["Person"],
                            "award_year": d["Year of award"],
                            "movie": d["Movie"],
                            "imdb_bio": d["Bio IMDb"],
                            "age_when_award": d["Age When Award"],
                            "date_of_birth": d["Date of birth"],
                            "country_of_birth": d["Country of birth"],
                            "class": "person",
                            "code": code,
                            "ageBin": ageBin
                        }
                    )
                }
            }
        });

        // sort country names
        countryArr.sort();
        // sort ageBin
        ageBinArr = ageBinNames.filter(x => ageBinArr.includes(x));

        // Set the dimensions and margins of the diagram
        var margin = {top: 20, right: 90, bottom: 30, left: 200},
            width = 700 - margin.left - margin.right,
            height = 1200 - margin.top - margin.bottom;

        function invertX(X) {
            return width - X;
        }

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        var svg = d3.select("#best-actor").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate("
                + 0 + "," + margin.top + ")");

        var i = 0,
            duration = 0,
            root;

        // declares a tree layout and assigns the size
        var treemap = d3.tree().size([height, width]);

        // Assigns parent, children, height, depth
        root = d3.hierarchy(actor, function(d) { return d.children; });
        root.x0 = height;
        root.y0 = invertX(0);
        update(root);

        // Collapse the node and all it's children
        function collapse(d) { }

        function update(source) {

            // Assigns the x and y position for the nodes
            var actor = treemap(root);

            // Compute the new tree layout.
            var nodes = actor.descendants(),
                links = actor.descendants().slice(1);

            // Normalize for fixed-depth.
            nodes.forEach(function(d){ d.y = d.depth * 180});

            // ****************** Nodes section ***************************

            // Update the nodes...
            var node = svg.selectAll('g.node')
                .data(nodes, function(d) {return d.id || (d.id = ++i); });

            // Enter any new modes at the parent's previous position.
            var nodeEnter = node.enter().append('g')
                .attr('class', function(d) {
                    return `node ${d.data.code} ${d.data.ageBin}`;
                })
                .attr("transform", function(d) {
                    return "translate(" + invertX(source.y0) + "," + source.x0 + ")";
                })

            // // Add Circle for the nodes
            // nodeEnter.append('circle')
            //     .attr('class', 'node')
            //     .attr('r', 1e-6)
            //     .style("fill", function(d) {
            //         return d._children ? "lightsteelblue" : "#fff";
            //     });

            // Add labels for the nodes
            nodeEnter.append('text')
                .attr("dy", ".35em")
                .attr("class", function(d) {
                    return d.data.class;
                })
                .attr("x", function(d) {
                    return !(d.children || d._children) ? -13 : 25;
                })
                .attr("text-anchor", function(d) {
                    return !(d.children || d._children) ? "end" : "start";
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
                        tooltip.html(`Name: ${d.data.name}<br>
                                      Year Awarded: ${d.data.award_year}<br>
                                      Country of Birth: ${d.data.country_of_birth}<br>
                                      Age When Awarded: ${d.data.age_when_award}<br>
                                      An Award Movie: ${d.data.movie}`)
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
                }).on("click", function(d) {
                    window.open(d.data.imdb_bio);
                });

            // UPDATE
            var nodeUpdate = nodeEnter.merge(node);

            // store node position for drawing lines
            var personPos = {}
            // Transition to the proper position for the node
            nodeUpdate.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    if (d.data.class == "person") {
                        personPos[d.data.name] = {
                            "x": invertX(d.y),
                            "y": d.x,
                            "code": d.data.code,
                            "ageBin": d.data.ageBin
                        };
                    }
                    return "translate(" + invertX(d.y) + "," + d.x + ")";
                });

            var totalHeight = 0
            var betweenHeight = 5;
            // *************** Draw in coutry circles *****************
            var countryRadius = [];
            for (let j = 0; j < countryArr.length; j++) {
                var country = countryArr[j]
                var code = country.replace(/\s/g, '');
                countryRadius.push(document.querySelectorAll(`.${code}`).length + minCircleSize);
            }
            var countryCirclePos = {};
            for (let j = 0; j < countryArr.length; j++) {
                var country = countryArr[j]
                var code = country.replace(/\s/g, '');
                var node = svg.append("g")
                    .attr("class", `node ${code} countries`)
                    .attr("transform", function() {
                        var x = margin.left - 150;
                        var y = margin.top + totalHeight + betweenHeight * j + countryRadius[j];
                        countryCirclePos[code] = {"x": invertX(x), "y": y, "connector": [invertX(x + 80), y]};
                        return "translate(" + invertX(x) + "," + y + ")";
                    })
                    .on("click", selectThisCode)
                .append('circle')
                    .attr("r", function() {
                        var r = countryRadius[j];
                        totalHeight += 2 * r;
                        return r;
                    })
                    .style("fill", palette["countryCircle"])
                    .attr("cursor", "pointer");
                d3.select(`g.countries.${code}`)
                    .append('text')
                        .attr("dy", ".35em")
                        .attr("x", function() {
                            return -textToCircleDist;
                        })
                        .attr("text-anchor", function(d) {
                            return "start";
                        })
                        .text(countryArr[j]);
            }

            // draw person to country connector lines
            for (var person in personPos) {
                person = personPos[person];
                var code = person.code;
                var link = d3.linkHorizontal()({
                    source: [person["x"], person["y"]],
                    // target: [countryCirclePos[code]["x"], countryCirclePos[code]["y"]]
                    target: countryCirclePos[code]["connector"]
                });
                svg
                    .append('path')
                    .attr('d', link)
                    .attr('stroke', palette["countryLink"])
                    .attr('fill', 'none')
                    .attr("opacity", "50%")
                    .attr("class", `link ${code}`)
            }
            // draw country to country connector lines
            for (var code in countryCirclePos) {
                var link = d3.linkHorizontal()({
                    source: [countryCirclePos[code]["x"], countryCirclePos[code]["y"]],
                    target: countryCirclePos[code]["connector"]
                });
                svg
                    .append('path')
                    .attr('d', link)
                    .attr('stroke',  palette["countryLink"])
                    .attr('fill', 'none')
                    .attr("opacity", "50%")
                    .attr("class", `link ${code}`)
            }

            // move country circles to the top
            var countries = document.querySelectorAll("#best-actor .countries");
            var countryContainer = countries[0].parentNode;
            countries.forEach(e => {
                e.remove();
                countryContainer.append(e);
            });

            // *************** Draw in age circles *****************
            totalHeight += 100 // Distance between age circles and country circles
            var ageBinRadius = [];
            for (let j = 0; j < ageBinArr.length; j++) {
                var ageBin = ageBinArr[j]
                ageBinRadius.push(document.querySelectorAll(`.${ageBin}`).length + minCircleSize);
            }
            var ageCirclePos = {};
            for (let j = 0; j < ageBinArr.length; j++) {
                var ageBin = ageBinArr[j]
                var node = svg.append("g")
                    .attr("class", `node ${ageBin} ageBins`)
                    .attr("transform", function() {
                        var x = margin.left - 150;
                        var y = margin.top + totalHeight + betweenHeight * j + ageBinRadius[j];
                        ageCirclePos[ageBin] = {"x": invertX(x), "y": y, "connector": [invertX(x + 80)  , y]};
                        return "translate(" + invertX(x) + "," + y + ")";
                    })
                    .on("click", selectThisAge)
                .append('circle')
                    .attr("r", function() {
                        var r = ageBinRadius[j];
                        totalHeight += 2 * r;
                        return r;
                    })
                    .style("fill", palette["ageCircle"])
                    .attr("cursor", "pointer");
                d3.select(`g.ageBins.${ageBin}`)
                    .append('text')
                        .attr("dy", ".35em")
                        .attr("x", function() {
                            return -textToCircleDist;
                        })
                        .attr("text-anchor", function(d) {
                            return "start";
                        })
                        .text(function() {
                            var ind = ageBinNames.indexOf(ageBin);
                            ind+= 1;
                            if (ind == 0) {
                                return `0 to ${ageBinSize}`;
                            } else {
                                return `${ageBinSize * ind} to ${ageBinSize * (ind + 1)}`;
                            }
                        });
            }

            // draw person to ageBin connector lines
            for (var person in personPos) {
                person = personPos[person];
                var ageBin = person.ageBin;
                var link = d3.linkHorizontal()({
                    source: [person["x"], person["y"]],
                    target: ageCirclePos[ageBin]["connector"]
                });
                svg
                    .append('path')
                    .attr('d', link)
                    .attr('stroke', palette["ageLink"])
                    .attr('fill', 'none')
                    .attr("opacity", "50%")
                    .attr("class", `link ${ageBin}`)
            }
            // draw ageBin to ageBin connector lines
            for (var ageBin in ageCirclePos) {
                var link = d3.linkHorizontal()({
                    source: [ageCirclePos[ageBin]["x"], ageCirclePos[ageBin]["y"]],
                    target: ageCirclePos[ageBin]["connector"]
                });
                svg
                    .append('path')
                    .attr('d', link)
                    .attr('stroke',  palette["ageLink"])
                    .attr('fill', 'none')
                    .attr("opacity", "50%")
                    .attr("class", `link ${ageBin}`)
            }

            // move age circles to the top
            var ageBins = document.querySelectorAll("#best-actor .ageBins");
            var ageBinContainer = ageBins[0].parentNode;
            ageBins.forEach(e => {
                e.remove();
                ageBinContainer.append(e);
            });

            // ********************** Code for selecting things ***********************
            // country
            function selectThisCode() {
                var currSelectedCode;
                document.querySelectorAll("#best-actor .selected").forEach(e => {
                    currSelectedCode = e.classList[1]
                    e.classList.remove("selected");
                })
                var code = this.classList[1];
                if (currSelectedCode != code) {
                    document.querySelectorAll(`#best-actor .${code}`).forEach(e => {
                        e.classList.add("selected");
                    })
                }
            }
            // age
            function selectThisAge() {
                var currSelectedAgeBin;
                document.querySelectorAll("#best-actor .selected").forEach(e => {
                    currSelectedAgeBin = e.classList[1]
                    e.classList.remove("selected");
                })
                var ageBin = this.classList[1];
                if (currSelectedAgeBin != ageBin) {
                    document.querySelectorAll(`#best-actor .${ageBin}`).forEach(e => {
                        e.classList.add("selected");
                    })
                }
            }
        }
    })
