"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _merge = _interopRequireDefault(require("lodash/merge"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
/* global fetch */
function isFormData(obj) {
  return obj instanceof FormData;
}
var fetchJSON = function fetchJSON(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // The Content-Type header describes the type of the body so should be
  // omitted when there isn't one.
  var fetchOptions = typeof options.body === 'undefined' || isFormData(options.body) ? options : (0, _merge["default"])({
    headers: {
      'Content-Type': 'application/json'
    }
  }, options);
  return fetch(url, fetchOptions).then(function (response) {
    return getResponseBody(response).then(function (body) {
      return {
        response: response,
        body: body
      };
    });
  }).then(checkStatus);
};
var getResponseBody = function getResponseBody(response) {
  var contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('json') >= 0 ? response.clone().text().then(tryParseJSON) : response.clone().text();
};
var tryParseJSON = function tryParseJSON(json) {
  if (!json) {
    return null;
  }
  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error("Failed to parse unexpected JSON response: ".concat(json));
  }
};
function ResponseError(status, response, body) {
  this.name = 'ResponseError';
  this.status = status;
  this.response = response;
  this.body = body;
}

// $FlowIssue
ResponseError.prototype = Error.prototype;
var checkStatus = function checkStatus(_ref) {
  var response = _ref.response,
    body = _ref.body;
  if (response.ok) {
    return {
      response: response,
      body: body
    };
  } else {
    throw new ResponseError(response.status, response, body);
  }
};
var _default = exports["default"] = fetchJSON;