// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"xwt8":[function(require,module,exports) {
module.exports = "https://uw-cse442-wi20.github.io/FP-oscar-nominations/oscar_demos_def.f8f895a9.csv";
},{}],"CPMU":[function(require,module,exports) {
// set the dimensions and margins of the graph
var width = 1000;
var height = 550; // append the svg object to the body of the page

var svg = d3.select("#best_dots").append("svg").attr("width", 77 + '%').attr("height", 550); // create dummy data -> just one element per circle

var dfe = require('./oscar_demos_def.csv');

d3.csv(dfe, function (data) {
  // A scale that gives a X target position for each group
  var x = d3.scaleOrdinal().domain(['White', 'Black', 'Asian', 'Hispanic', 'Middle Eastern', 'Multiracial']).range([150, 300, 450, 600, 750, 900]); // A color scale

  var color = d3.scaleOrdinal().domain(['White', 'Black', 'Asian', 'Hispanic', 'Middle Eastern', 'Multiracial']).range(["#FFFFFF", "#00BA38", "#619CFF", "#d712a3", "#e0cb3f", "#9d34c8"]);
  console.log(data); // Initialize the circle: all located at the center of the svg area

  var node = svg.append("g").selectAll("circle").data(data).enter().append("circle").attr("r", 5).attr("cx", width / 3).attr("cy", height / 3).style("fill", function (d) {
    return color(d.race_ethnicity);
  }).style("fill-opacity", 0.8).attr("stroke", "#D8A75E").style("stroke-width", 1).call(d3.drag() // call specific function when circle is dragged
  .on("start", dragstarted).on("drag", dragged).on("end", dragended)); // Features of the forces applied to the nodes:

  var simulation = d3.forceSimulation().force("x", d3.forceX().strength(0.2).x(function (d) {
    return x(d.race_ethnicity);
  })).force("y", d3.forceY().strength(0.1).y(height / 2)).force("center", d3.forceCenter().x(width / 3).y(height / 3)) // Attraction to the center of the svg area
  .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
  .force("collide", d3.forceCollide().strength(.1).radius(10).iterations(1)); // Force that avoids circle overlapping
  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.

  simulation.nodes(data).on("tick", function (d) {
    node.attr("cx", function (d) {
      return d.x;
    }).attr("cy", function (d) {
      return d.y;
    });
  }); // What happens when a circle is dragged?

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
});
},{"./oscar_demos_def.csv":"xwt8"}]},{},["CPMU"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-oscar-nominations/dots.eda57fcb.js.map