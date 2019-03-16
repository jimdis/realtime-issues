/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/client/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/client/UserData.js":
/*!********************************!*\
  !*** ./lib/client/UserData.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return UserData; });\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ \"./lib/client/api.js\");\n\n\nclass UserData {\n  async getUserData () {\n    let res = await _api__WEBPACK_IMPORTED_MODULE_0__[\"getData\"]('user')\n    this.avatar = res.avatar_url\n    this.name = res.name\n  }\n  async getRepos () {\n    let res = await _api__WEBPACK_IMPORTED_MODULE_0__[\"getData\"]('user/repos')\n    this.repos = []\n    res.forEach(repo => {\n      if (repo.open_issues_count > 0) {\n        let obj = {}\n        obj.id = repo.id\n        obj.full_name = repo.full_name\n        obj.description = repo.description\n        this.repos.push(obj)\n      }\n    })\n  }\n  async getIssues (repo) {\n    let res = await _api__WEBPACK_IMPORTED_MODULE_0__[\"getData\"](`repos/${repo.full_name}/issues`)\n    let issues = []\n    res.forEach(issue => {\n      let obj = {}\n      obj.id = issue.id\n      obj.title = issue.title\n      obj.username = issue.user.login\n      obj.avatar = issue.user.avatar_url\n      obj.body = issue.body\n      obj.url = issue.html_url\n      obj.comments = issue.comments\n      issues.push(obj)\n    })\n    repo.issues = issues\n  }\n}\n\n\n//# sourceURL=webpack:///./lib/client/UserData.js?");

/***/ }),

/***/ "./lib/client/api.js":
/*!***************************!*\
  !*** ./lib/client/api.js ***!
  \***************************/
/*! exports provided: getData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getData\", function() { return getData; });\nconst apiURI = '/api/'\n\nasync function getData (request) {\n  console.log('Getting Data from: ' + request)\n  let res = await window.fetch(apiURI + request)\n  res = await res.json()\n  console.log('Returning Data', res)\n  return res\n}\n\n\n//# sourceURL=webpack:///./lib/client/api.js?");

/***/ }),

/***/ "./lib/client/index.js":
/*!*****************************!*\
  !*** ./lib/client/index.js ***!
  \*****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _realtimeIssues__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./realtimeIssues */ \"./lib/client/realtimeIssues.js\");\n\n\n$(document).ready(() => Object(_realtimeIssues__WEBPACK_IMPORTED_MODULE_0__[\"default\"])())\n\n\n//# sourceURL=webpack:///./lib/client/index.js?");

/***/ }),

/***/ "./lib/client/realtimeIssues.js":
/*!**************************************!*\
  !*** ./lib/client/realtimeIssues.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return checkSession; });\n/* harmony import */ var _UserData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./UserData */ \"./lib/client/UserData.js\");\n/* harmony import */ var _webhooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./webhooks */ \"./lib/client/webhooks.js\");\n\n\n\nlet userData = new _UserData__WEBPACK_IMPORTED_MODULE_0__[\"default\"]()\nlet socket = io()\n\n// Listens to issues through websocket and calls function to render issue card.\nsocket.on('issue', async (msg) => {\n  console.log('From socket.io:', msg)\n  // Check if msg is related to an actual issue\n  if (msg.issue) {\n    renderIssueCard(msg)\n    let repo = userData.repos.find(repo => repo.id === msg.repository.id)\n    await userData.getIssues(repo)\n    // Re-render list of issues if currently visible\n    if (document.querySelector(`#issues-${repo.id}`)) renderIssues(repo.id)\n  }\n})\n\n// Renders list of repos\nasync function renderRepos () {\n  $('.fixed-action-btn').removeClass('hide')\n  $('.tooltipped').tooltip()\n  $('#issuesDiv').append($('#reposTemplate').html())\n  await userData.getUserData()\n  $('#issues-wrapper').removeClass('hide')\n  $('#reposHeader').addClass('rendered')\n  $('#user-preloader').remove()\n  $('#issuesDiv .collection').removeClass('hide')\n  $('#issuesDiv img.gh-avatar').attr('src', userData.avatar)\n  $('#gh-name-repos').text(`${userData.name}'s Repos with open issues`)\n  // $('#repo-preloader').toggleClass('hide')\n  await userData.getRepos()\n  $('#repo-preloader').remove()\n  userData.repos.forEach(repo => {\n    let temp = document.querySelector('#repoListTemplate').content.cloneNode(true)\n    temp.querySelector('.repo-title').textContent = `Repo: ${repo.full_name}`\n    temp.querySelector('.repo-description').textContent = repo.description\n    temp.querySelector('a').setAttribute('data-issues', repo.id)\n    $('#issuesDiv div.collection').append(temp)\n    _webhooks__WEBPACK_IMPORTED_MODULE_1__[\"getRepoHooks\"](repo)\n  })\n  // Event listeners to open issues-list\n  $('#issuesDiv div.collection a').click((e) => {\n    e.preventDefault()\n\n    $('a.collection-item').removeClass('active')\n    $(e.currentTarget).addClass('active')\n    renderIssues($(e.currentTarget).data('issues'))\n  })\n}\n\nasync function renderIssues (repoID) {\n  let repo = userData.repos.find(repo => repo.id === repoID)\n  $('#issues-wrapper .issuesCollection').remove()\n  $('#reposHeader').after($('#issuesTemplate').html())\n  $('#issues-wrapper .issuesCollection').attr('id', `issues-${repo.id}`)\n  $('#issues-wrapper .issuesCollection .title').text(`Issues in ${repo.full_name}`)\n  if (repo.hookID) _webhooks__WEBPACK_IMPORTED_MODULE_1__[\"renderHookBadge\"]('on')\n  if (!repo.issues) await userData.getIssues(repo)\n  $('#issues-preloader').remove()\n  repo.issues.forEach(issue => {\n    let li = document.querySelector('#issuesListTemplate').content.cloneNode(true)\n    li.querySelector('.title').textContent = issue.title\n    li.querySelector('.gh-avatar').src = issue.avatar\n    li.querySelector('.gh-avatar').title = issue.username\n    li.querySelector('.body').textContent = issue.body ? issue.body : 'No description provided :('\n    li.querySelector('a').href = issue.url\n    li.querySelector('.badge').textContent = issue.comments\n    $('#issues-wrapper .issuesCollection ul').append(li)\n  })\n\n  $('#issues-wrapper .tooltipped').tooltip()\n  $('#issues-wrapper .notificationIcon').click((e) => {\n    e.preventDefault()\n    _webhooks__WEBPACK_IMPORTED_MODULE_1__[\"toggleWebHook\"](repo)\n  })\n  $('#issues-wrapper .issueListClose').click((e) => {\n    e.preventDefault()\n    $('a.collection-item').removeClass('active')\n    $('#issues-wrapper .issuesCollection').remove()\n  })\n}\n\nfunction renderIssueCard (data) {\n  let temp = document.querySelector('#newIssueTemplate').content.cloneNode(true)\n  let id = `card-${Math.random().toString(36).replace('0.', '')}`\n  temp.firstElementChild.id = id\n  temp.querySelector('.newIssueTitle').textContent = `${data.comment ? 'Comment' : 'Issue'} ${data.action}`\n  temp.querySelector('.gh-avatar').src = data.sender.avatar_url\n  temp.querySelector('.newIssueBody').textContent = `${data.sender.login} just ${data.action} ${data.comment ? ' a Comment' : 'an Issue'} in ${data.repository.name}`\n  temp.querySelector('.newIssueGoto').href = data.comment ? data.comment.html_url : data.issue.html_url\n  $('#newIssuesDiv').append(temp)\n  $(`#${id} .newIssueDismiss`).click((e) => {\n    e.preventDefault()\n    $(`#${id}`).remove()\n  })\n}\n\n// Checks if client has valid oauth-token on GH.\nasync function checkAuthorization () {\n  let res = await window.fetch(`auth/status`)\n  res = await res.json()\n  $('#main-preloader').remove()\n  if (res.authorized) {\n    userData.username = res.username\n    $('#index-banner .badge span').text(userData.username)\n    $('#index-banner .badge').removeClass('hide')\n    $('#index-banner').addClass('logged-in')\n    renderRepos()\n  } else {\n    $('#index-banner .row').removeClass('hide')\n    $('#errorMessage').removeClass('hide')\n    $('#mainButton').text('Authorize again through GitHub»')\n  }\n}\n\n// Checks if client has a valid session.\nasync function checkSession () {\n  let res = await window.fetch(`auth/session`)\n  res = await res.json()\n  console.log()\n  if (!res.active) {\n    $('#index-banner .row, #subTitle').removeClass('hide')\n    $('#main-preloader').remove()\n  } else checkAuthorization()\n}\n\n\n//# sourceURL=webpack:///./lib/client/realtimeIssues.js?");

/***/ }),

/***/ "./lib/client/webhooks.js":
/*!********************************!*\
  !*** ./lib/client/webhooks.js ***!
  \********************************/
/*! exports provided: createWebHook, deleteWebHook, getRepoHooks, toggleWebHook, renderHookBadge */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"createWebHook\", function() { return createWebHook; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"deleteWebHook\", function() { return deleteWebHook; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getRepoHooks\", function() { return getRepoHooks; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"toggleWebHook\", function() { return toggleWebHook; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"renderHookBadge\", function() { return renderHookBadge; });\n/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./api */ \"./lib/client/api.js\");\n\n\nconst hookURL = __webpack_require__(/*! ../config */ \"./lib/config.js\").webHookURL\nconsole.log('HOOKURL:', hookURL)\nconsole.log('node env', \"development\")\n\nasync function createWebHook (repoFullName) {\n  let res = await window.fetch(`api/repo/?wh=true&path=${repoFullName}&action=create`)\n  res = await res.json()\n  if (res.active) return res\n}\n\nasync function deleteWebHook (repoFullName, hookID) {\n  let res = await window.fetch(`api/repo/?wh=true&path=${repoFullName}&action=delete&id=${hookID}`)\n  return res.status === 204\n}\n\nasync function getRepoHooks (repo) {\n  let res = await _api__WEBPACK_IMPORTED_MODULE_0__[\"getData\"](`repos/${repo.full_name}/hooks`)\n  let hook = res.find(hook => hook.config.url === hookURL)\n  if (hook) {\n    repo.hookID = hook.id\n    if (document.querySelector(`#issues-${repo.id}`)) renderHookBadge('on')\n  }\n}\n\nasync function toggleWebHook (repo) {\n  if (!repo.hookID) {\n    let res = await createWebHook(repo.full_name)\n    if (res) {\n      repo.hookID = res.id\n      renderHookBadge('on')\n      M.toast({ html: '<span class=\"green-text\">Alert created!</span>' })\n    } else {\n      M.toast({ html: '<span class=\"red-text\">There was a problem creating the alert</span>' })\n    }\n  } else {\n    let res = await deleteWebHook(repo.full_name, repo.hookID)\n    if (res) {\n      repo.hookID = null\n      renderHookBadge('off')\n      M.toast({ html: '<span class=\"green-text\">Alert removed!</span>' })\n    } else {\n      M.toast({ html: '<span class=\"red-text\">There was a problem removing the alert</span>' })\n    }\n  }\n}\n\nfunction renderHookBadge (action) {\n  if (action === 'on') {\n    $('#issues-wrapper .notificationIcon').removeClass('red')\n    $('#issues-wrapper .notificationIcon').addClass('green')\n    $('#issues-wrapper .notificationIcon').attr('data-badge-caption', 'on')\n    $('#issues-wrapper .notificationIcon').attr('data-tooltip', 'Remove issue notifications for this repo')\n  }\n  if (action === 'off') {\n    $('#issues-wrapper .notificationIcon ').removeClass('green')\n    $('#issues-wrapper .notificationIcon ').addClass('red')\n    $('#issues-wrapper .notificationIcon ').attr('data-badge-caption', 'off')\n    $('#issues-wrapper .notificationIcon').attr('data-tooltip', 'Remove issue notifications for this repo')\n  }\n}\n\n\n//# sourceURL=webpack:///./lib/client/webhooks.js?");

/***/ }),

/***/ "./lib/config.js":
/*!***********************!*\
  !*** ./lib/config.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("const WH_URL_DEV = 'https://caa8f02a.ngrok.io/api'\nconst WH_URL_PROD = 'https://cscloud417.lnu.se/api'\n\nconst OAUTH_URL_DEV = 'http://localhost:3000/auth/callback'\nconst OAUTH_URL_PROD = 'https://cscloud417.lnu.se/auth/callback'\n\nconst production = \"development\" === 'production'\n\nmodule.exports = {\n  webHookURL: production ? WH_URL_PROD : WH_URL_DEV,\n  redirect_uri: production ? OAUTH_URL_PROD : OAUTH_URL_DEV\n}\n\n\n//# sourceURL=webpack:///./lib/config.js?");

/***/ })

/******/ });