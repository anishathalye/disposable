'use strict';

var API_REGISTER = 'https://www.reddit.com/api/register';
var TIMEOUT = 5000; // milliseconds
var POOL = 'abcdefghijklmnopqrstuvwxyz_0123456789';
var PREFIX = 'anon-';
var LIMIT = 20;

createNewAccount();

function createNewAccount() {
  var req = new XMLHttpRequest();
  req.timeout = TIMEOUT;
  req.onreadystatechange=function() {
    if (req.readyState == 4) {
      var err = errors(req);
      if (err.length === 0) {
        success();
      } else {
        failure(err);
      }
    }
  }
  var user = genUsername();
  var password = genPassword();
  var url = API_REGISTER + '?user=' + user + '&passwd=' + password +
    '&passwd2=' + password + '&api_type=json';
  req.open('POST', url);
  req.send();
}

function errors(req) {
  if (req.status !== 200) {
    return ['http error'];
  }
  try {
    var obj = JSON.parse(req.response);
    var errors = obj.json.errors;
    var ret = [];
    for (var i = 0; i < errors.length; i++) {
      ret.push(errors[i][1]);
    }
    return ret;
  } catch (err) {
    console.log(err);
    return ['parse error'];
  }
  return ['internal error'];
}

function genUsername() {
  return PREFIX + randomString(LIMIT - PREFIX.length);
}

function genPassword() {
  return randomString(LIMIT);
}

function randomLetter() {
  return POOL[Math.floor(Math.random() * POOL.length)];
}

function randomString(length) {
  var s = '';
  for (var i = 0; i < length; i++) {
    s += randomLetter();
  }
  return s;
}

function get(id) {
  return document.getElementById(id);
}

function failure(errors) {
  get('icon').className = 'red circle';
  get('log').className = 'fixed';
  var errorParas = [];
  for (var i = 0; i < errors.length; i++) {
    errorParas.push('<p>' + errors[i] + '</p>');
  }
  get('log').innerHTML = errorParas.join('');
}

function success() {
  get('icon').className = 'green circle';
}
