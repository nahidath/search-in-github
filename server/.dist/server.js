"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.launch = launch;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function launch(port) {
  var application = (0, _express["default"])();
  application.listen(port, function () {
    console.log('server started at http://localhost:' + port);
  });
}

module.exports = {
  launch: launch
};