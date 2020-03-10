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
})({"khx3":[function(require,module,exports) {
module.exports = "https://uw-cse442-wi20.github.io/FP-oscar-nominations/imdb_rated_nominees.ef0b7910.csv";
},{}],"epOZ":[function(require,module,exports) {
var margin = {
  top: 10,
  right: 30,
  bottom: 30,
  left: 150
},
    width = 750,
    height = 600 - margin.top - margin.bottom;
var year = 1928;
var xx;

var delay = function delay(d, i) {
  return i * 40;
};

var prevWidth;
var svg = d3.select("#top10").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var label = document.getElementById("time-slider-label");
var labels = [];
labels[0] = 1928;

for (var i = 1; i <= 92; i++) {
  labels[i] = labels[i - 1] + 1;
}

for (var _i = 0; _i <= 92; _i++) {
  if (_i % 4 == 0) {
    div = document.createElement("div");
    div.innerText = labels[_i];
    label.appendChild(div);
  }
} // create the tick mark


var list = document.getElementById("steplist");

for (var _i2 = 0; _i2 < 92; _i2++) {
  opt = document.createElement("option");
  opt.innerText = _i2;
  list.appendChild(opt);
} // get the data


var test = require('./imdb_rated_nominees.csv');

function update(yr) {
  if (yr == 1934) {
    yr = 1935;
  }

  d3.csv(test, function (data) {
    // filter earlier; not quite sure if this is correct, but
    // at least bar chart is not crowded anymore
    var dataNew = data.filter(function (d) {
      if (parseInt(d.Year) == yr) return d.Year;
    });
    var duration = 1000; // X axis

    var x = d3.scaleLinear().domain([0, 10]).range([0, width]);
    svg.append('g').attr('transform', 'translate(0, ' + height + ')').attr('class', 'x axis');
    svg.append('g').attr('class', 'y axis'); // Y axis

    var y = d3.scaleBand().range([0, height]).domain(dataNew.map(function (d) {
      return d.Name;
    })).padding(.1);
    var bars = svg.selectAll(".bar").remove().exit().data(dataNew);
    bars.enter().append('rect').attr('class', 'bar').attr("fill", function (d) {
      if (d.Win == 'True') {
        return "#D7A764";
      } else {
        return "#595959";
      }
    }).attr('width', 0).attr('height', y.bandwidth()).attr("y", function (d) {
      return y(d.Name);
    }).merge(bars).transition().duration(1000).delay(100).attr("height", y.bandwidth()).attr("width", function (d, i) {
      return x(d.averageRating);
    }).attr("x", x(0)).transition().duration(1000);
    /*
    .attr("height", function(d, i) {
        return height - yscale(d);
    })
    */

    bars.exit().remove();
    bars.transition().duration(duration).attr("width", function (d) {
      return x(d.averageRating);
    }).transition().duration(1000).delay(function (d, i) {
      return i * 150;
    }).attr("x", x(0)).delay(delay);
    var labels = svg.selectAll('.label').data(dataNew);
    svg.select('.y.axis').transition().duration(duration).call(d3.axisLeft(y));
    svg.select('.x.axis').transition().duration(duration).call(d3.axisBottom(x));
  });
}

update(year); // call update once so bars will be generated on load

d3.select("#mySlider").on("input", function (d) {
  var yearLabel = document.getElementById("yearTitle");
  year = parseInt(this.value);
  xx = (year - 1928) / 92 * 100;
  var colorS = "linear-gradient(90deg, rgb(215, 167, 100)" + xx + "%" + ", rgb(155, 155, 155)" + xx + "%" + ")";
  this.style.background = colorS;
  yearLabel.innerText = year;
  update(year);
});
},{"./imdb_rated_nominees.csv":"khx3"}]},{},["epOZ"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-oscar-nominations/top10-bar.50f2fb90.js.map