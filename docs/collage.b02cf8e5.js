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
})({"V2da":[function(require,module,exports) {
var window_width = $(window).width() - $('#collage2').width();
var document_height = $(document).height() - $(window).height();
var x = 1500;
$(function () {
  $(window).scroll(function () {
    var scroll_position = $(window).scrollTop();
    var bpTop = $('#parallax').offset().top;
    var bpBottom = bpTop + $('#parallax').height() - 100;
    var dist = bpTop - scroll_position; //appearance

    if (scroll_position < 100) {
      $('#oscarCircle').css({
        'top': scroll_position,
        'opacity': 1
      });
    }

    if (scroll_position > 100 && scroll_position < 300) {
      var object_position_left = window_width * (scroll_position / document_height) + 10;
      $('#bradpitt').css({
        'left': object_position_left,
        'opacity': 1
      });
      $('#joker').css({
        'left': object_position_left,
        'opacity': 1
      });
      $('#jojo').css({
        'right': 80 + object_position_left,
        'opacity': 1
      });
      $('#collage3').css({
        'left': 80 + object_position_left,
        'opacity': 1
      });
    }

    if (scroll_position > 100 && scroll_position < 1000) {
      var object_position_left = window_width * (scroll_position / document_height) + 200;
      $('#collage2').css({
        'left': object_position_left,
        'opacity': 1
      });
      $('#collage1').css({
        'left': object_position_left - 200,
        'opacity': 1
      });
    }

    if (scroll_position > 1300) {
      $('#collage2').css({
        //'position':'absolute',
        'animation': 'fade',
        'animation-duration': '1s',
        'opacity': 0
      });
      $('#titleContent').css({
        //'position':'absolute',
        'animation': 'fade',
        'animation-duration': '1s',
        'opacity': 0
      });
      $('#collage1').css({
        //'position':'absolute',
        'animation': 'fade',
        'animation-duration': '1s',
        'opacity': 0
      });
      $('#bradpitt').css({
        //'position':'absolute',
        'animation': 'fade',
        'animation-duration': '1s'
      });
      $('#joker').css({
        //'position':'absolute',
        'animation': 'fade',
        'animation-duration': '1s',
        'opacity': 0
      });
      $('#bradpitt').css({
        //'position':'absolute',
        'animation': 'fade',
        'animation-duration': '1s',
        'opacity': 0
      });
      $('#jojo').css({
        'animation': 'fade',
        'animation-duration': '1s',
        'opacity': 0
      });
      $('#oscarCircle').css({
        'animation': 'fade',
        'animation-duration': '1s',
        'opacity': 0
      });
      $('#collage3').css({
        'animation': 'fade',
        'animation-duration': '1s',
        'opacity': 0
      });
    }
  });
});
},{}]},{},["V2da"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/FP-oscar-nominations/collage.b02cf8e5.js.map