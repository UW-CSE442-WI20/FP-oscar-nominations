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
})({"epOZ":[function(require,module,exports) {
// set the dimensions and margins of the graph
var margin = {
  top: 10,
  right: 30,
  bottom: 30,
  left: 40
},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom; // append the svg object to the body of the page

var svg = d3.select("#top10").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // get the data

d3.csv("test.csv", function (data) {
  console.log(data); // X axis: scale and draw:

  var x = d3.scaleLinear().domain([0, 10]) // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.price })
  .range([0, width]);
  svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x)); // set the parameters for the histogram

  var histogram = d3.histogram().value(function (d) {
    return d.averageRating * 100;
  }) // I need to give the vector of value
  .domain(x.domain()) // then the domain of the graphic
  .thresholds(x.ticks(70)); // then the numbers of bins
  // And apply this function to data to get the bins

  var bins = histogram(data); // Y axis: scale and draw:

  var y = d3.scaleLinear().range([height, 0]);
  y.domain([0, d3.max(bins, function (d) {
    return d.length;
  })]); // d3.hist has to be called before the Y axis obviously

  svg.append("g").call(d3.axisLeft(y)); // append the bar rectangles to the svg element

  svg.selectAll("rect").data(bins).enter().append("rect").attr("x", 1).attr("transform", function (d) {
    return "translate(" + x(d.x0) + "," + y(d.length) + ")";
  }).attr("width", function (d) {
    return 200;
  }).attr("height", function (d) {
    return height - y(d.length);
  }).style("fill", "#69b3a2");
});
},{}]},{},["epOZ"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-oscar-nominations/top10-bar.dc785559.js.map