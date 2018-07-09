/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "4c27f79723287feae7b2"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
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
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
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
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "http://localhost:3000/app/themes/stone-roberts-anew/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(30)(__webpack_require__.s = 30);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*********************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/html-entities/lib/html5-entities.js ***!
  \*********************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 1 */
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 2 */
/*!******************************!*\
  !*** ./scripts/utilities.js ***!
  \******************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var utilities = {
	windowHeight: null,
	windowWidth: null,
	windowRatioWidth: null,
	windowRatioHeight: null,
	windowHalfHeight: null,
	browserOrientation: null,
	bodyOverlay: document.getElementById('body-overlay'),
	init: function () {
		this.setViewportDimensions();

		// throw in closest polyfill
		// https://developer.mozilla.org/en-US/docs/Web/API/Element/closest
		if (!Element.prototype.matches) { Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector; }

		if (!Element.prototype.closest)
			{ Element.prototype.closest = function (s) {
				var el = this;
				if (!document.documentElement.contains(el)) { return null; }
				do {
					if (el.matches(s)) { return el; }
					el = el.parentElement || el.parentNode;
				} while (el !== null && el.nodeType === 1);
				return null;
			}; }
	},
	reset: function () {
		this.windowHeight = null;
		this.windowRatioHeight = null;
		this.windowWidth = null;
		this.windowRatioWidth = null;
		this.windowHalfHeight = null;
		this.browserOrientation = null;
	},
	getViewportDimensions: function () {
		// TODO: will this work with fullscreen?
		var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName("body")[0],
			x = w.innerWidth || e.clientWidth || g.clientWidth,
			y = w.innerHeight || e.clientHeight || g.clientHeight;

		return {width: x, height: y};
	},
	setViewportDimensions: function () {
		var viewportDimensions = this.getViewportDimensions();
		this.windowHeight = viewportDimensions.height;
		this.windowWidth = viewportDimensions.width;
		this.windowRatioWidth = this.windowWidth / this.windowHeight;
		this.windowRatioHeight = this.windowHeight / this.windowWidth;
		this.windowHalfHeight = this.windowHeight / 2;
		this.browserOrientation = this.getBrowserOrientation();
	},
	isElementVerticallyInViewport: function (el) {
		var bounding = el.getBoundingClientRect();

		return (
			bounding.top >= 0 &&
			bounding.top <= (window.innerHeight || document.documentElement.clientHeight)
			||
			bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
			bounding.bottom >= 0
		);
	},
	isTouchDevice: function () {
		return "ontouchstart" in document.documentElement;
	},
	getElementOffsetFromDoc: function (el) {
		// https://stanko.github.io/javascript-get-element-offset/
		var rect = el.getBoundingClientRect();

		return {
			top: rect.top + window.pageYOffset,
			left: rect.left + window.pageXOffset,
		};
	},
	getSiblingsWithClass: function (child, skipMe, elementClass) {
		var r = [];
		for (; child; child = child.nextSibling) {
			if (child.nodeType == 1 && child != skipMe && child.classList.contains(elementClass)) {
				r.push(child);
			}
		}
		return r;
	},

	// return the first element which has class
	getSiblingByClass: function (element, elementClass) {
		return this.getSiblingsWithClass(element.parentNode.firstChild, element, elementClass)[0];
	},

	getImageSizeChangeTechnique: function (image, container, xPadding, yPadding) {
		container = typeof container != 'undefined'
			?
			container
			:
			null;
		xPadding = typeof xPadding != 'undefined'
			?
			xPadding
			:
			0;
		yPadding = typeof yPadding != 'undefined'
			?
			yPadding
			:
			0;
		var containerRatioWidth = null;
		var containerRatioHeight = null;
		if (container != null) {
			containerRatioWidth = (container.clientWidth - xPadding) / (container.clientHeight - yPadding);
		} else {
			containerRatioWidth = this.windowRatioWidth;
			containerRatioHeight = this.windowRatioHeight;

		}

		// figure out which way to change image size
		var imageRatioWidth = image.naturalWidth / image.naturalHeight;
		var imageRatioHeight = image.naturalHeight / image.naturalWidth;

		if (imageRatioWidth > containerRatioWidth) {
			return "width";
		} else if (imageRatioHeight > containerRatioHeight) {
			return "height";
		}

	},

	getBrowserOrientation: function () {
		return this.windowHeight > this.windowWidth
			?
			"portrait"
			:
			"landscape";
	},

	showOverlay: function () {
		document.body.classList.add('show-body-overlay');
	},

	hideOverlay: function () {
		document.body.classList.remove('show-body-overlay');
	},

	addCssToPage: function (styles, id) {
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = styles;
		style.setAttribute('id', id);
		document.getElementsByTagName('head')[0].appendChild(style);
	},
	removeCssFromPage: function (ids) {
		ids.forEach(function (id) {
			var el = document.getElementById(id);
			el.parentNode.removeChild(el);
		});
	},
};

utilities.init();

module.exports = utilities;

/***/ }),
/* 3 */
/*!*******************************!*\
  !*** ./scripts/nakasentro.js ***!
  \*******************************/
/*! exports provided: nakasentro */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "nakasentro", function() { return nakasentro; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities__ = __webpack_require__(/*! ./utilities */ 2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__utilities__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_underscore__ = __webpack_require__(/*! underscore */ 28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_underscore__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__center_scroll_to__ = __webpack_require__(/*! ./center-scroll-to */ 20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__thumbnail_nav__ = __webpack_require__(/*! ./thumbnail-nav */ 21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__zoomy__ = __webpack_require__(/*! ./zoomy */ 19);






var nakasentro = {
	fullscreen: document.querySelector('.fullscreen'),
	fullscreenWrapper: document.querySelector('.fullscreen-wrapper'),
	artworks_elements: document.querySelectorAll('.artwork_piece'),
	artworks: Array(),
	mainContentWidth: null,
	mainContentWrap: document.querySelector('.content>.main'),
	imageCentered: false,
	imageCenteredTrue: false, // tracks when image has gone fulldimension and get's toggled out of fulldimension but is still within the considered centered range
	imageCenteredElement: null,
	scrollBeingThrottled: false,
	isTouchDevice: false,
	// helps us not process items in the midst of resizing
	isResizing: false,
	consideredCenteredPercentage: 10,
	recentlyAddedCenteredClasses: false,
	recentlyRemovedCenteredClasses: false,
	fixedImageScrollReleaseCount: 0,
	imagesProcessed: false,
	mouse_map_less_percentage: .3,
	delayedTransitionInProgress: false,

	init: function () {
		//reset values
		this.reset();

		this.isTouchDevice = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.isTouchDevice();

		if (this.isTouchDevice === false) {

			// setup values
			this.setupValues(true);

			// init-center-scroll-to

			// nakasentro.checkArtworks(true);
			// for when not in fullscreen
			window.addEventListener('scroll', function () {
					if (!this.isResizing && nakasentro.imagesProcessed === true) {
						nakasentro.checkArtworks();
					}
				}.bind(this)
			);
			window.addEventListener('scroll', function () {
					if (!nakasentro.isResizing && nakasentro.imagesProcessed === true) {
						nakasentro.checkArtworks();
					}
				}
			);

			// for when in fullscreen
			nakasentro.fullscreen.addEventListener('scroll', function () {
				if (!this.isResizing && nakasentro.imagesProcessed === true) {
					nakasentro.checkArtworks();
				}
			});

			// add event to handle any code needed when there is a fullscreen change event
			document.addEventListener('barbaFullscreenOnChange', this.fullScreenOnChangeEvent.bind(this), false);
		} else {
			this.mobileSetup(true);
		}

	},
	mobileSetup: function (isInit) {
		this.mainContentWidth = this.mainContentWrap.clientWidth;

		this.setBodyClasses('orientation-' + __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.browserOrientation);
		nakasentro.artworks_elements.forEach(function (artwork, index) {
			var artworkElements = this.getArtworkElements(artwork, index);
			if (isInit === false) {
				this.resetImageValues(artworkElements);
			}
			__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.setViewportDimensions();
			var imageSizeChangeTechnique = this.setArtworkSizeChangeTechnique(artworkElements.artworkImage, artworkElements.artworkWrap);

			window.addEventListener('resize', this.mobileResize.bind(artworkElements));

			nakasentro.artworks.push({
				artworksIndex: nakasentro.artworks.length,
				element: artwork,
				artworkImage: artworkElements.artworkImage,
				imageSizeChangeTechnique: imageSizeChangeTechnique,
				artworkWrap: artworkElements.artworkWrap,
				artworkImageWrap: artworkElements.artworkImageWrap,
				centerImageWrap: artworkElements.centerImageWrap,
				artworkMetaWrap: artworkElements.artworkMetaWrap,
				zoomyWrap: artworkElements.zoomyWrap,
				imageSpacePlaceholder: artworkElements.imageSpacePlaceholder,
				artworkUniqueId: artworkElements.artworkUniqueId,
				imageCentered: false,
				fullscreenImageCentered: false,
				isInViewport: false,
				imgSrc: artworkElements.imgSrc,
			});

			Object(__WEBPACK_IMPORTED_MODULE_3__thumbnail_nav__["addThumbnail"])(artworkElements.imgSrc, artworkElements.artworkImageWrap);
		}, this);

		// add to thumbnails
	},
	mobileResize: __WEBPACK_IMPORTED_MODULE_1_underscore___default.a.debounce(function () {
		// utilities.setViewportDimensions();
		// nakasentro.setArtworkSizeChangeTechnique(this.artworkImage, this.artworkWrap);
		nakasentro.artworks = [];
		nakasentro.mobileSetup(false);
	}, 250),
	fullScreenOnChangeEvent: function () {
		// if in fullscreen we want to add remved events which handle scroll when centered and scroll events is not triggered due to fixed elements
		/* eslint-disable */
		if (Barba.FullScreen.isFullscreen === false) {
			/* eslint-enable */
			nakasentro.removeFullDimensionsCenteredImageScrollEvents.call(this, true);
		}
	},
	removeFullDimensionsCenteredImageScrollEvents: function (removeAllWheel) {
		removeAllWheel = typeof removeAllWheel === 'boolean'
			? removeAllWheel
			: false;
		window.removeEventListener('keydown', this.keydownEvent);
		if (removeAllWheel === false) {
			// 'this' is the artwork
			this.zoomyWrap.removeEventListener('wheel', this.wheelEvent);
		} else {
			// 'this' is nakasentro
			this.artworks.forEach(function (artwork) {
				artwork.zoomyWrap.removeEventListener('wheel', artwork.wheelEvent);
			})
		}
	},
	reset: function () {
		// set values back to initial setup
		this.fullscreen = document.querySelector('.fullscreen');
		this.artworks_elements = document.querySelectorAll('.artwork_piece');
		this.artworks = Array();
		// this.windowHeight = null;
		// this.windowWidth = null;
		// this.windowRatioWidth = null;
		this.mainContentWidth = null;
		this.mainContentWrap = document.querySelector('.content>.main');
		this.imageCentered = false;
		this.imageCenteredTrue = false;
		this.imageCenteredElement = null;
		this.scrollBeingThrottled = false;
		document.body.classList.remove('orientation-portrait', 'orientation-landscape', 'centered-image');
		document.querySelectorAll('.artwork_piece').forEach(function (artworkPiece) {
			this.removeArtworkPieceCentered(artworkPiece);
		}, this);
	},

	resetAllCenteredSettings: function () {
		document.querySelectorAll('.artwork_piece').forEach(function (artworkPiece) {
			this.removeArtworkPieceCentered(artworkPiece);
		}, this);
		this.removeBodyImageCenteredClasses();
	},

	removeArtworkPieceCentered: function (artworkPiece) {
		// console.log('artwork classlist removing centered');
		artworkPiece.classList.remove('centered'/*, 'centered-image-transition-duration'*/);
		// console.log('global removing imageCentered');
		// nakasentro.imageCentered = false;
		// nakasentro.imageCenteredElement = null;
	},
	removeBodyImageCenteredClasses: function () {
		document.body.classList.remove('centered-image');
		window.setTimeout(function () {
			// here we delay removing a class to allow some css transitions to happen
			nakasentro.imageCenteredElement.classList.remove('centered-image-transition-duration');
		}, 400);
	},
	// setViewportDimensions: function() {
	//   let viewportDimensions = this.getViewportDimensions();
	//   this.windowHeight = viewportDimensions.height;
	//   this.windowWidth = viewportDimensions.width;
	//   this.windowRatioWidth = this.windowWidth / this.windowHeight;
	// },
	// resetImageValues: function (artworkImage, artworkImageWrap) {
	// 	artworkImage.setAttribute('style', '');
	// },
	resetImageValues: function (artwork) {
		artwork.artworkImage.setAttribute('style', '');
		artwork.zoomyWrap.setAttribute('style', '');
		artwork.imageRatioHolder.setAttribute('style', '');
	},
	getArtworkElements: function (artwork, index) {
		var artworkWrap = artwork;
		artworkWrap.setAttribute('artworks-index', index);
		var artworkUniqueId = artwork.getAttribute('id');
		var artworkImageWrap = artwork.querySelector('.image-wrap');
		var centerImageWrap = artworkImageWrap.querySelector('.center-image-wrap');
		var artworkImage = artworkImageWrap.querySelector('.main-img');
		var zoomyWrap = artworkImageWrap.querySelector('.zoomy-wrap');
		var imageSpacePlaceholder = artworkImageWrap.querySelector('.image-space-placeholder');
		var imageRatioHolder = artworkImageWrap.querySelector('.image-ratio-holder');
		var mouseMapWrap = zoomyWrap.querySelector('.mouse-map-wrap');
		var mouseMapImage = mouseMapWrap.querySelector('.mouse-map');
		var artworkMetaWrap = artworkImageWrap.querySelector('.artwork-meta');
		var imgSrc = artworkImage.getAttribute('src');
		return {
			artworkWrap: artworkWrap,
			artworkUniqueId: artworkUniqueId,
			artworkImageWrap: artworkImageWrap,
			centerImageWrap: centerImageWrap,
			artworkImage: artworkImage,
			zoomyWrap: zoomyWrap,
			imageSpacePlaceholder: imageSpacePlaceholder,
			imageRatioHolder: imageRatioHolder,
			mouseMapWrap: mouseMapWrap,
			mouseMapImage: mouseMapImage,
			artworkMetaWrap: artworkMetaWrap,
			imgSrc: imgSrc,
		};
	},
	setArtworkSizeChangeTechnique: function (artworkImage, artworkWrap) {
		var imageSizeChangeTechnique = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getImageSizeChangeTechnique(artworkImage);
		artworkWrap.classList.remove('width', 'height');
		artworkWrap.classList.add(imageSizeChangeTechnique);
		return imageSizeChangeTechnique;
	},
	setupValues: function (isInit) {
		nakasentro.imagesProcessed = false;
		isInit = typeof isInit === 'boolean'
			? isInit
			: false;
		this.reset();

		this.mainContentWidth = this.mainContentWrap.clientWidth;

		this.setBodyClasses('orientation-' + __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.browserOrientation);

		nakasentro.artworks_elements.forEach(function (artwork, index) {
			// let zoomWrap = artwork.querySelector('.zoom-wrap');
			var artworkElements = this.getArtworkElements(artwork, index);

			var styleBlockId = artworkElements.artworkUniqueId + '-artwork-centered-style';

			if (isInit === false) {
				this.resetImageValues(artworkElements);
				__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.removeCssFromPage([styleBlockId]);
			}


			// document.body.classLifst.remove('artworks-processed');

			// we need to compare the ratio of the viewport to the ratio of the image.
			// debugger;
			// console.log(artworkElements.artworkImage.clientWidth, artworkElements.artworkImage.clientHeight);

			// temporarily set maxHeight for processing
			artworkElements.artworkImage.style.maxHeight = '100vh';

			artworkElements.artworkImage.style.minHeight = artworkElements.artworkImage.clientHeight + 'px';
			artworkElements.artworkImage.style.minWidth = artworkElements.artworkImage.clientWidth + 'px';

			var imageVhValue = artworkElements.artworkImage.clientHeight / __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight * 100;
			var imageVwValue = artworkElements.artworkImage.clientWidth / __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowWidth * 100;
			if (imageVhValue === 0) {
				// debugger;
				// console.log('———————————image values are zero on init!!!!');
			}
			var imageVhValueToFull = 100 - imageVhValue;

			// let imageSizeChangeTechnique = this.setArtworkSizeChangeTechnique(artworkElements.artworkImage, artworkWrap);
			var imageSizeChangeTechnique = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getImageSizeChangeTechnique(artworkElements.artworkImage);
			artworkElements.artworkWrap.classList.remove('width', 'height');
			artworkElements.artworkWrap.classList.add(imageSizeChangeTechnique);


			var imageRatioWidth = artworkElements.artworkImage.clientWidth / artworkElements.artworkImage.clientHeight;
			var imageRatioHeight = artworkElements.artworkImage.clientHeight / artworkElements.artworkImage.clientWidth;

			if (artworkElements.artworkImage.clientHeight >= __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight) {
				artworkElements.imageRatioHolder.style.height = artworkElements.artworkImage.clientHeight + 'px';
				artworkElements.imageRatioHolder.style.width = artworkElements.artworkImage.clientWidth + 'px';
			} else {
				artworkElements.imageRatioHolder.style.paddingBottom = 100 * imageRatioHeight + '%';
			}


			var imageViewportWidthRatio = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowWidth / artworkElements.artworkImage.clientWidth;
			var imageViewportHeightRatio = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight / artworkElements.artworkImage.clientHeight;

			artworkElements.mouseMapImage.setAttribute('scaleWidth', imageViewportWidthRatio);
			artworkElements.mouseMapImage.setAttribute('scaleHeight', imageViewportHeightRatio);


			var imageMaxHeight = null;
			// get image max height
			if (imageSizeChangeTechnique === 'width') {
				// if imageSizeChangeTechnique is width we want to multiply the viewport width in px by the height/width ratio of the image
				imageMaxHeight = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight * (artworkElements.artworkImage.clientHeight / artworkElements.artworkImage.clientWidth);
			} else {
				// if imageSizeChangeTechnique is height we want to just use the viewport height amount.
				imageMaxHeight = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight;
			}

			// get image max height
			// if (imageSizeChangeTechnique === 'height') {
			// 	// if imageSizeChangeTechnique is width we want to multiply the viewport width in px by the height/width ratio of the image
			// 	const imageMaxWidth = utilities.windowWidth * (artworkElements.artworkImage.clientHeight / artworkElements.artworkImage.clientWidth);
			// } else {
			// 	// if imageSizeChangeTechnique is height we want to just use the viewport height amount.
			// 	const imageMaxWidth = utilities.windowWidth;
			// }
			var imageOffsetFromDocTop = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getElementOffsetFromDoc(artworkElements.artworkImage).top;
			var imageMaxHeightCenterPointFromDocTop = imageMaxHeight / 2 + imageOffsetFromDocTop;

			nakasentro.artworks.push({
				artworksIndex: nakasentro.artworks.length,
				element: artwork,
				artworkImage: artworkElements.artworkImage,
				imageSizeChangeTechnique: imageSizeChangeTechnique,
				imageOffsetFromDocTop: imageOffsetFromDocTop,
				imageMaxHeight: imageMaxHeight,
				imageMaxHeightCenterPointFromDocTop: imageMaxHeightCenterPointFromDocTop,
				imageRatioHolder: artworkElements.imageRatioHolder,
				artworkWrap: artworkElements.artworkWrap,
				artworkImageWrap: artworkElements.artworkImageWrap,
				centerImageWrap: artworkElements.centerImageWrap,
				artworkMetaWrap: artworkElements.artworkMetaWrap,
				zoomyWrap: artworkElements.zoomyWrap,
				imageSpacePlaceholder: artworkElements.imageSpacePlaceholder,
				artworkUniqueId: artworkElements.artworkUniqueId,
				imageCentered: false,
				isInViewport: false,
				toCenterPixels: 0,
				imgSrc: artworkElements.imgSrc,
				// this allows us to track centered image when in fullscreen and we use the counted scroll events or keyboard events to trigger the image out of full width
				fullscreenImageCentered: false,
				// mouseMapImage: artworkElements.mouseMapImage,
				originalDimensions: {
					width: artworkElements.artworkImage.clientWidth,
					height: artworkElements.artworkImage.clientHeight,
					imageRatioWidth: imageRatioWidth,
					imageRatioHeight: imageRatioHeight,
					imageVwValue: imageVwValue,
					imageVhValue: imageVhValue,
					imageVhValueToFull: imageVhValueToFull,
					imageViewportWidthRatio: imageViewportWidthRatio,
					imageViewportHeightRatio: imageViewportHeightRatio,
				},
				dynamicImageValues: {
					toCenterPercentage: null,
					imageVhValueToFull: imageVhValueToFull,
					imageCurrentHeight: imageVhValue,
					imageCurrentWidth: imageVwValue,
				},
			});

			nakasentro.artworks[index].wheelEvent = nakasentro.fullscreenHandleZoomyDivScroll.bind(nakasentro.artworks[index]);
			nakasentro.artworks[index].keydownEvent = nakasentro.handlePossibleScrollKeyEvent.bind(nakasentro.artworks[index]);

			// let artworkStyles = '';
			// if (utilities.browserOrientation === 'portrait') {
			// 	artworkStyles = '#' + artworkElements.artworkUniqueId + ' .main-img, #' + artworkElements.artworkUniqueId + ' .zoomy-wrap, #' + artworkElements.artworkUniqueId + ' .image-space-placeholder, #' + artworkElements.artworkUniqueId + ' .image-center-wrap {width: ' + artworkImage.clientWidth + 'px; height: ' + artworkImage.clientHeight + 'px; }';

			// let artworkStyles = '#' + artworkElements.artworkUniqueId + '.centered.height .main-img, #' + artworkElements.artworkUniqueId + '.centered.height .zoomy-wrap {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';
			// artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img, #' + artworkElements.artworkUniqueId + '.centered.width .zoomy-wrap {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';

			var styleBlock = document.getElementById(styleBlockId);
			if (styleBlock !== null) {
				styleBlock.remove();
			}
			// console.log(artworkElements.artworkUniqueId, imageViewportHeightRatio, imageViewportWidthRatio);
			// let artworkStyles = '#' + artworkElements.artworkUniqueId + '.centered.height .main-img, #' + artworkElements.artworkUniqueId + '.centered.height .zoomy-wrap {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';
			// artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img, #' + artworkElements.artworkUniqueId + '.centered.width .zoomy-wrap {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';

			// create styles for .main-img and .mouse-map width and height

			var artworkStyles = '#' + artworkElements.artworkUniqueId + ' .main-img, #' + artworkElements.artworkUniqueId + ' .mouse-map-wrap {width: ' + artworkElements.artworkImage.clientWidth + 'px; height: ' + artworkElements.artworkImage.clientHeight + 'px;}';


			var mouseMapWidth = artworkElements.artworkImage.clientWidth - (nakasentro.mouse_map_less_percentage * artworkElements.artworkImage.clientWidth);
			var mouseMapHeight = artworkElements.artworkImage.clientHeight - (nakasentro.mouse_map_less_percentage * artworkElements.artworkImage.clientHeight);

			artworkStyles += '#' + artworkElements.artworkUniqueId + ' .mouse-map {width: ' + mouseMapWidth + 'px; height: ' + mouseMapHeight + 'px;}';

			// create styles for .main-img and .mouse-map scale amount when image dimension change is height
			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.height .main-img {transform: scale(' + imageViewportHeightRatio + ', ' + imageViewportHeightRatio + ')}';

			// create styles for .main-img and .mouse-map scale amount when image dimension change is width
			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .main-img {transform: scale(' + imageViewportWidthRatio + ', ' + imageViewportWidthRatio + ')}';

			// const baseZoomSetting = parseInt(artworkElements.mouseMapWrap.getAttribute('zoom-setting'));
			// pixel amounts for mousemap elements when image has width setting type
			var mouseMapZoomWidthPixelWidth = artworkElements.artworkImage.clientWidth * imageViewportWidthRatio;
			var mouseMapZoomWidthPixelHeight = artworkElements.artworkImage.clientHeight * imageViewportWidthRatio;

			// pizel amounts for mousemap elements when image has height setting type
			var mouseMapZoomHeightPixelHeight = artworkElements.artworkImage.clientHeight * imageViewportHeightRatio;
			var mouseMapZoomHeightPixelWidth = artworkElements.artworkImage.clientWidth * imageViewportHeightRatio;
			// const mouseMapWrapScaleWidth = imageViewportWidthRatio - 1;
			// const mouseMapWrapScaleHeight = imageViewportHeightRatio - 1;

			// const scaledZoomValueWidth =  baseZoomSetting - ((baseZoomSetting * imageViewportWidthRatio) - baseZoomSetting);
			// const scaledZoomValueHeight = baseZoomSetting - ((baseZoomSetting * imageViewportHeightRatio) - baseZoomSetting);


			// create zoom value style for when the image is scaled full width/height and therefor the original zoom value is scaled up also
			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .mouse-map-wrap { width: ' + mouseMapZoomWidthPixelWidth + 'px; height: ' + mouseMapZoomWidthPixelHeight + 'px;}';

			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.height .mouse-map-wrap { width: ' + mouseMapZoomHeightPixelWidth + 'px; height: ' + mouseMapZoomHeightPixelHeight + 'px;}';

			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.width .mouse-map { width: ' + (mouseMapZoomWidthPixelWidth - (nakasentro.mouse_map_less_percentage * mouseMapZoomWidthPixelWidth)) + 'px; height: ' + (mouseMapZoomWidthPixelHeight - (nakasentro.mouse_map_less_percentage * mouseMapZoomWidthPixelHeight)) + 'px;}';

			artworkStyles += '#' + artworkElements.artworkUniqueId + '.centered.height .mouse-map { width: ' + (mouseMapZoomHeightPixelWidth - (nakasentro.mouse_map_less_percentage * mouseMapZoomHeightPixelWidth)) + 'px; height: ' + (mouseMapZoomHeightPixelHeight - (nakasentro.mouse_map_less_percentage * mouseMapZoomHeightPixelHeight)) + 'px;}';


			// remove temporary max height for image after processing
			artworkElements.artworkImage.style.maxHeight = 'none';


			artworkElements.artworkImage.style.position = 'static';
			artworkElements.centerImageWrap.style.height = 0;

			__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.addCssToPage(artworkStyles, styleBlockId);

			// add to thumbnails
			Object(__WEBPACK_IMPORTED_MODULE_3__thumbnail_nav__["addThumbnail"])(artworkElements.imgSrc, artworkElements.artworkImageWrap);
		}, this);

		// init button scroll to script
		Object(__WEBPACK_IMPORTED_MODULE_2__center_scroll_to__["init"])();

		nakasentro.imagesProcessed = true;

		// document.body.classList.add('artworks-processed');
		window.addEventListener('resize', this.debounceWindowResize);
		window.addEventListener('resize', function () {
			if (nakasentro.isResizing === false) {
				document.body.classList.add('viewport-resizing');
				nakasentro.isResizing = true;
			}
		});
	},

	debounceWindowResize: __WEBPACK_IMPORTED_MODULE_1_underscore___default.a.debounce(function () {
		var currentViewportDimenstions = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getViewportDimensions();
		if (__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight !== currentViewportDimenstions.height || __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowWidth !== currentViewportDimenstions.width) {
			nakasentro.artworks = Array();
			__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.setViewportDimensions();
			nakasentro.setupValues();
		}
		document.body.classList.remove('viewport-resizing');
		nakasentro.isResizing = false;
	}, 250),

	windowResize: function () {
		var currentViewportDimenstions = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getViewportDimensions();
		if (__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight !== currentViewportDimenstions.height || __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowWidth !== currentViewportDimenstions.width) {
			nakasentro.artworks = Array();
			__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.setViewportDimensions();
			nakasentro.setupValues();
		}
	},

	setBodyClasses: function (classes) {
		document.querySelector('body').classList.add(classes);
	},

	getPixelsToCenter: function (distanceFromTopOfViewport) {
		var viewport_center = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHalfHeight;
		return viewport_center - distanceFromTopOfViewport;
	},

	getPercentageToCenter: function (toCenterPixels) {
		return (toCenterPixels / __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight * 100) * 1.39;
	},

	getVhToCenter: function (toCenterPixels) {
		return toCenterPixels / __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.windowHeight * 100;
	},

	getToCenterPixels: function (artwork) {
		var rect = artwork.imageSpacePlaceholder.getBoundingClientRect();
		var distanceFromTopOfViewport = rect.top + rect.height / 2;
		var toCenterPixels = nakasentro.getPixelsToCenter(distanceFromTopOfViewport);
		return toCenterPixels;
	},

	setArtworkToCenterPixels: function (artwork) {
		var toCenterPixels = this.getToCenterPixels(artwork);
		nakasentro.artworks[artwork.artworksIndex].toCenterPixels = toCenterPixels;
		return toCenterPixels;
	},

	centerImage: function (artwork) {
		/* eslint-disable */
		if (Barba.FullScreen.isFullscreen === true) {
			/* eslint-enable */
			artwork.fullscreenImageCentered = true;
		}

		// console.log('adding keydown/wheel event listeners to ', artwork);
		window.addEventListener('keydown', artwork.keydownEvent);
		artwork.zoomyWrap.addEventListener('wheel', artwork.wheelEvent, {passive: true});

		// console.log('body classlist adding centered-image');
		document.body.classList.add('centered-image');

		// overarching imageCentered toggle
		// console.log('global image Centered set true');
		this.imageCentered = true;
		this.imageCenteredTrue = true;
		nakasentro.imageCenteredElement = artwork.element;

		// console.log('artwork imageCentered set true');
		// speicific artwork iamgeCentered toggle
		artwork.imageCentered = true;

		// if (!artwork.artworkWrap.classList.contains('centered-image-transition-duration')) {
		// 	console.log('adding centered centered-image-transition-duration classes to artwork');
		// 	console.log('');
		artwork.artworkWrap.classList.add('centered', 'centered-image-transition-duration');
		// }
	},

	uncenterImage: function (artwork, fullDimensionEvent) {
		if ( fullDimensionEvent === void 0 ) fullDimensionEvent = false;

// if in fullscreen we want to add remved events which handle scroll when centered and scroll events is not triggered due to fixed elements

		nakasentro.removeFullDimensionsCenteredImageScrollEvents.call(artwork);

		// speicific artwork iamgeCentered toggle
		// console.log('artwork imageCentered setting false');
		// artwork.imageCentered = false;
		// console.log('body classlist removing centered-image');
		document.body.classList.remove('centered-image');
		// console.log('artowrk classlist removing centered');
		artwork.artworkWrap.classList.remove('centered');
		// console.log('global imageCentered setting false');

		// overarching imageCentered toggle
		if (fullDimensionEvent === false) {
			this.imageCenteredTrue = false;
			this.imageCentered = false;

			if (nakasentro.imageCenteredTrue === false) {
				artwork.imageCentered = false;
			}
		}
		// console.log('global imageCenteredElement set null');
		// console.log('');

		this.imageCenteredElement = null;
		this.possiblyRunDelayedTransition(artwork, fullDimensionEvent);
	},

	possiblyRunDelayedTransition: function possiblyRunDelayedTransition(artwork, fullDimensionEvent) {
		var this$1 = this;

		if (this.delayedTransitionInProgress === false) {
			this.delayedTransitionInProgress = true;
			window.setTimeout(function () {
				// last check
				if (nakasentro.imageCenteredTrue === true && fullDimensionEvent === true || this$1.imageCentered === false) {
					nakasentro.runDelayedTransition(artwork);
				} else {
					nakasentro.delayedTransitionInProgress = false;
				}
			}, 400);
		}
	},

	runDelayedTransition: function runDelayedTransition(artwork) {
		// here we delay removing a class to allow some css transiti
		// ons to happen
		// console.log('artwork classlist removing centered-image-transition-duration');
		artwork.artworkWrap.classList.remove('centered-image-transition-duration');
		// console.log('artwork imageCentered set false');
		// artwork.imageCentered = false;
		this.delayedTransitionInProgress = false;
	},

	possiblyCenterUncenterImage: function (artwork) {
		var toCenterPixels = this.setArtworkToCenterPixels(artwork);

		var toCenterPixelsAbsolute = Math.abs(toCenterPixels);

		var toCenterPercentage = nakasentro.getPercentageToCenter(toCenterPixelsAbsolute);
		// console.log(toCenterPercentage);
		artwork.artworkWrap.setAttribute('percent-to-center', toCenterPercentage);

		// if we're close to the centerpoint of an image, we trigger a scroll to
		if (toCenterPercentage < nakasentro.consideredCenteredPercentage) {
			// image is centered
			// console.log('this.imageCentered: ' + this.imageCentered);
			// console.log('artwork.fullscreenImageCentered: ' + artwork.fullscreenImageCentered);
			// console.log('artwork.imageCentered: ' + artwork.imageCentered);
			if (artwork.imageCentered === false && artwork.fullscreenImageCentered === false/* && this.recentlyAddedCenteredClasses === false*/) {
				// if in fullscreen we want to add these events to handle scroll when centered and scroll events is not triggered due to fixed elements

				this.centerImage(artwork);
			}

		} else if (artwork.fullscreenImageCentered === true) {
			// set false variable tracking fullwidth centered image when in fullscreen.
			// console.log('setting artwork.fullscreenImageCentered false, should only run when in fullscreen');
			artwork.fullscreenImageCentered = false;
		} else if (artwork.imageCentered === true) {
			// console.log(artwork);
			if (toCenterPercentage > nakasentro.consideredCenteredPercentage) {
				// image is not centered
				// if (this.imageCentered === true /*&& this.recentlyRemovedCenteredClasses === false*/) {
				this.uncenterImageBreakZoom.call(artwork);
				this.uncenterImage(artwork);
				// }
			}
		}
	},

	possiblyRemoveZoom: function () {
		if (this.artworkWrap.classList.contains('zoomed')) {
			__WEBPACK_IMPORTED_MODULE_4__zoomy__["zoomy"].removeArtworkZoomByPictureIndex(this.artworkWrap.getAttribute('zoomy-pictures-index'));
			return true;
		} else {
			return false;
		}
	},

	removeImageCentered: function (element) {
		nakasentro.removeBodyImageCenteredClasses.call(element.artworkWrap);
		nakasentro.removeArtworkPieceCentered(element.artworkWrap);
		nakasentro.removeFullDimensionsCenteredImageScrollEvents.call(element);
		// element.imageCentered = false;
	},

	processZoomRemoval: function () {
		// if (zoomRemoved === true) {
		// window.setTimeout(() => {
		__WEBPACK_IMPORTED_MODULE_4__zoomy__["zoomy"].removeZoomedDelayClass(this.artworkWrap);
		nakasentro.possiblyRemoveZoom.call(this);
		// }, 500);
		// } else {
		// 	nakasentro.removeImageCentered(this);
		// }
	},

	handlePossibleScrollKeyEvent: function (e) {
		//todo: if zoom enabled, disable and wait for animation to finish before continuing, needs to happen no matter what the keycode is
		nakasentro.processZoomRemoval.call(this);
		// nakasentro.removeImageCentered(this);
		nakasentro.uncenterImage.call(nakasentro, this, true);
		if (e.code === 'ArrowRight' && e.code === 'ArrowLeft') {
			e.preventDefault();
		}
	},

	uncenterImageBreakZoom: function () {
//todo: if zoom enabled, disable and wait for animation to finish before continuing
		nakasentro.processZoomRemoval.call(this);
		nakasentro.uncenterImage.call(nakasentro, this, true);
		// nakasentro.removeImageCentered(this);
		nakasentro.fixedImageScrollReleaseCount = 0;
	},

	fullscreenHandleZoomyDivScroll: function () {
		if (nakasentro.fixedImageScrollReleaseCount >= 20) {
			nakasentro.uncenterImageBreakZoom.call(this);
		} else {
			nakasentro.fixedImageScrollReleaseCount++;
		}
	},

	setNewWidthValues: function (toCenterPercentage, artwork) {
		var newWidthLength = this.getNewLength(toCenterPercentage, artwork.originalDimensions.imageVwValue);
		this.artworks[artwork.artworksIndex].dynamicImageValues.toCenterPercentage = toCenterPercentage;
		this.artworks[artwork.artworksIndex].dynamicImageValues.imageCurrentWidth = newWidthLength;
		this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull = this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull - newWidthLength;
		// console.log('newWidthLength: ' + newWidthLength);
		this.resizePortrait(artwork, newWidthLength);
	},
	setNewHeightValues: function (toCenterPercentage, artwork) {
		var newLength = this.getNewLength(toCenterPercentage, artwork.originalDimensions.imageVhValue);
		this.artworks[artwork.artworksIndex].dynamicImageValues.toCenterPercentage = toCenterPercentage;

		this.artworks[artwork.artworksIndex].dynamicImageValues.imageCurrentHeight = newLength;
		this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull = this.artworks[artwork.artworksIndex].dynamicImageValues.imageVhValueToFull - newLength;
		// console.log('toCenterPercentage: ' + toCenterPercentage);
		// console.log('newLength: ' + newLength);
		this.resizeLandscape(artwork, newLength);
	},

	getNewLength: function (toCenterPercentage, originalDimensionValue) {
		// console.log(toCenterPercentage);
		// @t is the current time (or position) of the tween. This can be seconds or frames, steps, seconds, ms, whatever – as long as the unit is the same as is used for the total time [3].
		// @b is the beginning value of the property.
		// @c is the change between the beginning and destination value of the property.
		// @d is the total time of the tween.
		// TODO: Figure out a better name for lengthValue
		// let lengthValue = this.browserOrientation === 'portrait' ? artwork.originalDimensions.imageVwValue : artwork.originalDimensions.imageVhValue;
		// lengthValue = lengthValue * .45;

		// let w = window,
		//   doc = document,
		//   e = doc.documentElement,
		//   g = doc.getElementsByTagName('body')[0],
		//   x = w.innerWidth || e.clientWidth || g.clientWidth,
		//   y = w.innerHeight || e.clientHeight || g.clientHeight;

		// let result = x * lengthValue / 100;
		// console.log('result: ' + result);
		// console.log('toCenterPercentage: ' + toCenterPercentage);
		var toCenterPercentagePassed = 100 - toCenterPercentage;
		// console.log('toCenterPercentagePassed: ' + toCenterPercentagePassed);
		var t = toCenterPercentagePassed;
		var b = originalDimensionValue;
		var c = 100 - originalDimensionValue;
		var d = 100;
		// console.log(t, b, c, d);
		var newLength = c * t / d + b;
		// console.log('newLength: ' + newLength);
		// if (newLength > 100) {
		//   newLength = 100;
		// }

		newLength = newLength < originalDimensionValue
			? originalDimensionValue
			: newLength;
		// console.log('newLength: ' + newLength);
		return newLength;
	},

	resizePortrait: function (artwork, imageNewWidth) {
		if (artwork.artworkImage.clientWidth >= artwork.originalDimensions.width) {
			var width = imageNewWidth + 'vw';
			var imageWidth = artwork.artworkImage.clientWidth;
			var imageHeight = artwork.artworkImage.clientHeight + 'px';
			artwork.artworkImage.style.width = width;
			artwork.zoomyWrap.style.height = imageHeight;
			artwork.zoomyWrap.style.width = width;
			artwork.artworkMetaWrap.style.width = imageWidth + 'px';

			//this helper div keeps the vertical space when the image is centered and the image itself is positioned 'fixed'
			// artwork.imageSpacePlaceholder.style.height = imageNewWidth / artwork.originalDimensions.imageRatioWidth + 'vh';
		}
	},

	resizeLandscape: function (artwork, imageNewHeight) {
		if (artwork.artworkImage.clientHeight >= artwork.originalDimensions.height) {
			var height = imageNewHeight + 'vh';
			var imageWidth = artwork.artworkImage.clientWidth + 'px';
			artwork.artworkImage.style.height = height;
			artwork.zoomyWrap.style.height = height;
			artwork.zoomyWrap.style.width = imageWidth;
			artwork.artworkMetaWrap.style.width = imageWidth;

			//this helper div keeps the vertical space when the image is centered and the image itself is positioned 'fixed'
			// artwork.imageSpacePlaceholder.style.height = height;
		}
	},

	checkArtworks: function () {
		nakasentro.artworks.forEach(function (artwork) {
			if (__WEBPACK_IMPORTED_MODULE_0__utilities___default.a.isElementVerticallyInViewport(artwork.artworkImage)) {
				artwork.isInViewport = true;
				nakasentro.possiblyCenterUncenterImage(artwork);
			} else {
				artwork.isInViewport = false;
				this.setArtworkToCenterPixels(artwork);
			}
		}, this);
	},
};



/***/ }),
/* 4 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 5 */
/*!*************************************!*\
  !*** ./build/helpers/hmr-client.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var hotMiddlewareScript = __webpack_require__(/*! webpack-hot-middleware/client?noInfo=true&timeout=20000&reload=true */ 6);

hotMiddlewareScript.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload();
  }
});


/***/ }),
/* 6 */
/*!********************************************************************************!*\
  !*** (webpack)-hot-middleware/client.js?noInfo=true&timeout=20000&reload=true ***!
  \********************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: '',
  autoConnect: true,
  overlayStyles: {},
  overlayWarnings: false,
  ansiColors: {}
};
if (true) {
  var querystring = __webpack_require__(/*! querystring */ 7);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  setOverrides(overrides);
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  if (options.autoConnect) {
    connect();
  }
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
  setOverrides(overrides);
  connect();
}

function setOverrides(overrides) {
  if (overrides.autoConnect) options.autoConnect = overrides.autoConnect == 'true';
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }

  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }

  if (overrides.ansiColors) options.ansiColors = JSON.parse(overrides.ansiColors);
  if (overrides.overlayStyles) options.overlayStyles = JSON.parse(overrides.overlayStyles);

  if (overrides.overlayWarnings) {
    options.overlayWarnings = overrides.overlayWarnings == 'true';
  }
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(/*! strip-ansi */ 10);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(/*! ./client-overlay */ 12)({
      ansiColors: options.ansiColors,
      overlayStyles: options.overlayStyles
    });
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay) {
        if (options.overlayWarnings || type === 'errors') {
          overlay.showProblems(type, obj[type]);
          return false;
        }
        overlay.clear();
      }
      return true;
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(/*! ./process-update */ 17);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      var applyUpdate = true;
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
        applyUpdate = false;
      } else if (obj.warnings.length > 0) {
        if (reporter) {
          var overlayShown = reporter.problems('warnings', obj);
          applyUpdate = overlayShown;
        }
      } else {
        if (reporter) {
          reporter.cleanProblemsCache();
          reporter.success();
        }
      }
      if (applyUpdate) {
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    },
    setOptionsAndConnect: setOptionsAndConnect
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?noInfo=true&timeout=20000&reload=true", __webpack_require__(/*! ./../webpack/buildin/module.js */ 1)(module)))

/***/ }),
/* 7 */
/*!**********************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/querystring-es3/index.js ***!
  \**********************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ 8);
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ 9);


/***/ }),
/* 8 */
/*!***********************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/querystring-es3/decode.js ***!
  \***********************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 9 */
/*!***********************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/querystring-es3/encode.js ***!
  \***********************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 10 */
/*!*****************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/strip-ansi/index.js ***!
  \*****************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(/*! ansi-regex */ 11)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 11 */
/*!*****************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/ansi-regex/index.js ***!
  \*****************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 12 */
/*!**************************************************!*\
  !*** (webpack)-hot-middleware/client-overlay.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};

var ansiHTML = __webpack_require__(/*! ansi-html */ 13);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};

var Entities = __webpack_require__(/*! html-entities */ 14).AllHtmlEntities;
var entities = new Entities();

function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
}

function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
}

function problemType (type) {
  var problemColors = {
    errors: colors.red,
    warnings: colors.yellow
  };
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}

module.exports = function(options) {
  for (var color in options.overlayColors) {
    if (color in colors) {
      colors[color] = options.overlayColors[color];
    }
    ansiHTML.setColors(colors);
  }

  for (var style in options.overlayStyles) {
    styles[style] = options.overlayStyles[style];
  }

  for (var key in styles) {
    clientOverlay.style[key] = styles[key];
  }

  return {
    showProblems: showProblems,
    clear: clear
  }
};

module.exports.clear = clear;
module.exports.showProblems = showProblems;


/***/ }),
/* 13 */
/*!****************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/ansi-html/index.js ***!
  \****************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 14 */
/*!********************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/html-entities/index.js ***!
  \********************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(/*! ./lib/xml-entities.js */ 15),
  Html4Entities: __webpack_require__(/*! ./lib/html4-entities.js */ 16),
  Html5Entities: __webpack_require__(/*! ./lib/html5-entities.js */ 0),
  AllHtmlEntities: __webpack_require__(/*! ./lib/html5-entities.js */ 0)
};


/***/ }),
/* 15 */
/*!*******************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/html-entities/lib/xml-entities.js ***!
  \*******************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 16 */
/*!*********************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/html-entities/lib/html4-entities.js ***!
  \*********************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 17 */
/*!**************************************************!*\
  !*** (webpack)-hot-middleware/process-update.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "https://webpack.js.org/concepts/hot-module-replacement/"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { 				
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: function(data) {
    console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
  },
  onDeclined: function(data) {
    console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
  },
  onErrored: function(data) {
    console.error(data.error);
    console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
  } 
}

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 18 */
/*!************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/body-scroll-lock/lib/bodyScrollLock.js ***!
  \************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: clearAllBodyScrollLocks, disableBodyScroll */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isIosDevice = typeof window !== 'undefined' && window.navigator && window.navigator.platform && /iPad|iPhone|iPod|(iPad Simulator)|(iPhone Simulator)|(iPod Simulator)/.test(window.navigator.platform);
// Adopted and modified solution from Bohdan Didukh (2017)
// https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

var firstTargetElement = null;
var allTargetElements = [];
var initialClientY = -1;
var previousBodyOverflowSetting = void 0;
var previousBodyPaddingRight = void 0;

var preventDefault = function preventDefault(rawEvent) {
  var e = rawEvent || window.event;
  if (e.preventDefault) e.preventDefault();

  return false;
};

var setOverflowHidden = function setOverflowHidden(options) {
  // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
  // the responsiveness for some reason. Setting within a setTimeout fixes this.
  setTimeout(function () {
    // If previousBodyPaddingRight is already set, don't set it again.
    if (previousBodyPaddingRight === undefined) {
      var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
      var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

      if (_reserveScrollBarGap && scrollBarGap > 0) {
        previousBodyPaddingRight = document.body.style.paddingRight;
        document.body.style.paddingRight = scrollBarGap + 'px';
      }
    }

    // If previousBodyOverflowSetting is already set, don't set it again.
    if (previousBodyOverflowSetting === undefined) {
      previousBodyOverflowSetting = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  });
};

var restoreOverflowSetting = function restoreOverflowSetting() {
  // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
  // the responsiveness for some reason. Setting within a setTimeout fixes this.
  setTimeout(function () {
    if (previousBodyPaddingRight !== undefined) {
      document.body.style.paddingRight = previousBodyPaddingRight;

      // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
      // can be set again.
      previousBodyPaddingRight = undefined;
    }

    if (previousBodyOverflowSetting !== undefined) {
      document.body.style.overflow = previousBodyOverflowSetting;

      // Restore previousBodyOverflowSetting to undefined
      // so setOverflowHidden knows it can be set again.
      previousBodyOverflowSetting = undefined;
    }
  });
};

// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
  return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
};

var handleScroll = function handleScroll(event, targetElement) {
  var clientY = event.targetTouches[0].clientY - initialClientY;

  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    // element is at the top of its scroll
    return preventDefault(event);
  }

  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    // element is at the top of its scroll
    return preventDefault(event);
  }

  return true;
};

var disableBodyScroll = exports.disableBodyScroll = function disableBodyScroll(targetElement, options) {
  if (isIosDevice) {
    // targetElement must be provided, and disableBodyScroll must not have been
    // called on this targetElement before.
    if (targetElement && !allTargetElements.includes(targetElement)) {
      allTargetElements = [].concat(_toConsumableArray(allTargetElements), [targetElement]);

      targetElement.ontouchstart = function (event) {
        if (event.targetTouches.length === 1) {
          // detect single touch
          initialClientY = event.targetTouches[0].clientY;
        }
      };
      targetElement.ontouchmove = function (event) {
        if (event.targetTouches.length === 1) {
          // detect single touch
          handleScroll(event, targetElement);
        }
      };
    }
  } else {
    setOverflowHidden(options);

    if (!firstTargetElement) firstTargetElement = targetElement;
  }
};

var clearAllBodyScrollLocks = exports.clearAllBodyScrollLocks = function clearAllBodyScrollLocks() {
  if (isIosDevice) {
    // Clear all allTargetElements ontouchstart/ontouchmove handlers, and the references
    allTargetElements.forEach(function (targetElement) {
      targetElement.ontouchstart = null;
      targetElement.ontouchmove = null;
    });

    allTargetElements = [];

    // Reset initial clientY
    initialClientY = -1;
  } else {
    restoreOverflowSetting();

    firstTargetElement = null;
  }
};

var enableBodyScroll = exports.enableBodyScroll = function enableBodyScroll(targetElement) {
  if (isIosDevice) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;

    allTargetElements = allTargetElements.filter(function (element) {
      return element !== targetElement;
    });
  } else if (firstTargetElement === targetElement) {
    restoreOverflowSetting();

    firstTargetElement = null;
  }
};

/***/ }),
/* 19 */
/*!**************************!*\
  !*** ./scripts/zoomy.js ***!
  \**************************/
/*! exports provided: zoomy */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "zoomy", function() { return zoomy; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities__ = __webpack_require__(/*! ./utilities */ 2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__utilities__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__ = __webpack_require__(/*! body-scroll-lock */ 18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_scroll_lock___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__mousePosition__ = __webpack_require__(/*! ./mousePosition */ 27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__nakasentro__ = __webpack_require__(/*! ./nakasentro */ 3);





var zoomy = {
	pictures: Array(),
	isTouchDevice: __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.isTouchDevice(),
	mouseMapEventsAdded: false,
	mouseMapLessPixelsHalf: __WEBPACK_IMPORTED_MODULE_3__nakasentro__["nakasentro"].mouse_map_less_percentage / 2,
	init: function () {
		this.reset();
		document.querySelectorAll(".artwork_piece[zoom-enabled] .actions .zoom").forEach(function (value, index) {
			var artworkPieceWrap = value.parentNode.parentNode.parentNode.parentNode;
			var zoomyWrap = artworkPieceWrap.querySelector(".zoomy-wrap");
			var mouseMapWrap = zoomyWrap.querySelector('.mouse-map-wrap');
			var mouseMapImage = zoomyWrap.querySelector(".mouse-map");
			var img = artworkPieceWrap.firstElementChild;

			// add zoomy pictures index value to artworkpiece wrap for reference in nakasentro
			artworkPieceWrap.setAttribute('zoomy-pictures-index', index);

			this.pictures.push({
				button: value,
				index: index,
				artworksIndex: artworkPieceWrap.getAttribute('artworks-index'),
				zoomyWrap: zoomyWrap,
				artworkPieceWrap: artworkPieceWrap,
				image: img,
				imageRotation: artworkPieceWrap.classList.contains('width')
					? 'width'
					: 'height',
				mouseMapWrap: mouseMapWrap,
				mouseMapImage: mouseMapImage,
				mouseMapImageHeight: mouseMapImage.clientHeight,
				mouseMapImageWidth: mouseMapImage.clientWidth,
				mouseMoveHandler: null,
				touchMoveHandler: null,
				isZoomed: false,
				scaleWidth: mouseMapImage.getAttribute('scaleWidth'),
				scaleHeight: mouseMapImage.getAttribute('scaleHeight'),
			});

			// here we bind the picture object to the move event handlers so that we can remove them later: https://kostasbariotis.com/removeeventlistener-and-this/
			this.pictures[index].mouseMoveHandler = this.mapMouseToImage.bind(this.pictures[index]);
			this.pictures[index].touchMoveHandler = this.mapMouseToImage.bind(this.pictures[index]);

			// set up the click event to toggle the magnifier for both button and image itself
			value.addEventListener("click", this.toggleZoom.bind(this.pictures[index]));
			mouseMapWrap.addEventListener("click", this.toggleZoom.bind(this.pictures[index]));
			if (this.isTouchDevice) {
				document.body.classList.add("is-touch");
			}
		}, zoomy);
	},

	reset: function () {
		this.pictures = Array();
	},

	possiblyImmediatelyRemoveZoom: function(){
		/* eslint-disable */
		if (Barba.FullScreen.isFullscreen === true) {
			/* eslint-enable */

		}
	},

	removeArtworkZoomByPictureIndex: function (index) {
		zoomy.pictures[index].artworkPieceWrap.classList.toggle("zoomed");
		zoomy.pictures[index].isZoomed = false;
		// mobile devices get body locked/unlocked
		if (zoomy.isTouchDevice) {
			Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["clearAllBodyScrollLocks"])(this.pictures[index].mouseMapImage);
		}

		zoomy.removeMouseMoveEvents.call(zoomy.pictures[index]);
	},

	addMouseMoveEvents: function () {
		zoomy.mouseMapEventsAdded = true;
		document.body.addEventListener("mousemove", this.mouseMoveHandler, {passive: true});
		document.body.addEventListener("touchmove", this.touchMoveHandler, {passive: true});
	},

	removeMouseMoveEvents: function () {
		zoomy.mouseMapEventsAdded = false;
		document.body.removeEventListener("mousemove", this.mouseMoveHandler, false);
		document.body.removeEventListener("touchmove", this.touchMoveHandler, false);
	},

	setTimeoutRemoveDelayClass: function (element) {
		var this$1 = this;

		// this delay needs to be associated with the $zoom-transition-duration variable found in _artwork-piece.scss
		window.setTimeout(function () {
			// todo make sure this is working
			this$1.removeZoomedDelayClass(element.artworkPieceWrap);
		}, 500);
	},

	removeZoomedDelayClass: function (element) {
		element.classList.remove('zoomed-delay');
	},

	toggleZoom: function (e) {

		//move zoom image to cursor/touch point
		if (e.currentTarget.classList.contains('mouse-map') || e.currentTarget.classList.contains('mouse-map-wrap')) {
			zoomy.mapMouseToImage.call(this, e);
		}

		this.artworkPieceWrap.classList.toggle("zoomed");
		// document.body.classList.toggle("zoomed");

		// toggle the picture aray element zoomed value
		this.isZoomed = !this.isZoomed;

		// mobile devices get body locked/unlocked
		if (zoomy.isTouchDevice) {
			if (this.isZoomed === true) {
				Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["disableBodyScroll"])(this.mouseMapImage);
			} else {
				Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["clearAllBodyScrollLocks"])(this.mouseMapImage);
			}
		}

		// add or remove the delay class used for animation
		if (this.isZoomed === false) {
			zoomy.setTimeoutRemoveDelayClass(this);
		} else {
			this.artworkPieceWrap.classList.add('zoomed-delay');
		}

		// add or remove touch/mousemove events
		if (this.isZoomed === true && zoomy.mouseMapEventsAdded === false) {
			zoomy.addMouseMoveEvents.call(this);
		} else if (zoomy.mouseMapEventsAdded) {
			zoomy.removeMouseMoveEvents.call(this);
		}
	},
	mapMouseToImage: function () {
		var mouseMap = this.mouseMapImage;
		var position = __WEBPACK_IMPORTED_MODULE_2__mousePosition__["mousePosition"].mousePositionElement(this.mouseMapImage);

		// if (position.x > 0) {
			var leftPercentage = 0;
			var topPercentage = 0;

			if (__WEBPACK_IMPORTED_MODULE_3__nakasentro__["nakasentro"].artworks[this.artworksIndex].imageCentered === true) {
				// image centered
				// adjust the percentage based on the scale amount (the transfoorm: scale() messes with the sizes somehow
				if (this.imageRotation === 'width') {
					leftPercentage = (position.x / mouseMap.clientWidth) * 100;
					topPercentage = (position.y / (mouseMap.clientWidth * __WEBPACK_IMPORTED_MODULE_3__nakasentro__["nakasentro"].artworks[this.artworksIndex].originalDimensions.imageRatioHeight)) * 100;
				} else {
					topPercentage = (position.y / mouseMap.clientHeight) * 100;
					leftPercentage = (position.x / ((mouseMap.clientHeight * __WEBPACK_IMPORTED_MODULE_3__nakasentro__["nakasentro"].artworks[this.artworksIndex].originalDimensions.imageRatioWidth) * this.scaleWidth)) * 100;
				}
			} else {
				// image not centered
				leftPercentage = (position.x / mouseMap.clientWidth) * 100;
				topPercentage = (position.y / mouseMap.clientHeight) * 100;
			}

			// set max and min values
			var minValue = -2;
			var maxValue = 102;
			topPercentage = topPercentage < minValue
				? minValue
				: topPercentage;
			topPercentage = topPercentage > maxValue
				? maxValue
				: topPercentage;
			leftPercentage = leftPercentage < minValue
				? minValue
				: leftPercentage;
			leftPercentage = leftPercentage > maxValue
				? maxValue
				: leftPercentage;

			// console.log('leftPercentage, topPercentage: ' + leftPercentage, topPercentage);
			this.mouseMapWrap.style.backgroundPosition = leftPercentage + "% " + topPercentage + "%";
		// }
	},
};

/***/ }),
/* 20 */
/*!*************************************!*\
  !*** ./scripts/center-scroll-to.js ***!
  \*************************************/
/*! exports provided: init, scrollToElement */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scrollToElement", function() { return scrollToElement; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__nakasentro__ = __webpack_require__(/*! ./nakasentro */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_smoothscroll_polyfill__ = __webpack_require__(/*! smoothscroll-polyfill */ 36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_smoothscroll_polyfill___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_smoothscroll_polyfill__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_underscore__ = __webpack_require__(/*! underscore */ 28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_underscore___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_underscore__);





var centerScrollDiv = null;
var fullscreen = document.querySelector('.fullscreen');

var scrollCheck = __WEBPACK_IMPORTED_MODULE_2_underscore___default.a.debounce(function () {
	var currentCentered = getCurrentCentered();
	checkButtonNavigationDisplay(currentCentered, 'scroll');
}, 100);

function init() {
	centerScrollDiv = document.querySelector('.center-scroll-arrows');

	if (centerScrollDiv === null) {


		__WEBPACK_IMPORTED_MODULE_1_smoothscroll_polyfill___default.a.polyfill();

		// add arrows
		var arrows = "\n\t\t<div class=\"center-scroll-arrows\"><div class=\"prev\"><svg viewBox=\"0 0 24 24\"><path d=\"M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z\"></path></svg></div><div class=\"next\"><svg viewBox=\"0 0 24 24\"><path d=\"M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z\"></path></svg></div>\n\t";
		document.querySelector('.fullscreen').insertAdjacentHTML('beforeend', arrows);

		centerScrollDiv = document.querySelector('.center-scroll-arrows');

		var prevButton = centerScrollDiv.querySelector('.center-scroll-arrows .prev');
		var nextButton = centerScrollDiv.querySelector('.center-scroll-arrows .next');

		prevButton.addEventListener('click', goPrevious);
		nextButton.addEventListener('click', goNext);

		// add keydown events
		document.addEventListener('keyup', function (e) {
			if (e.code === 'ArrowLeft') {
				e.preventDefault();
				goPrevious();
			} else if (e.code === 'ArrowRight') {
				e.preventDefault();
				goNext();
			}
		});

		window.addEventListener('scroll', scrollCheck);
		fullscreen.addEventListener('scroll', scrollCheck);

		var currentCentered = getCurrentCentered();
		checkButtonNavigationDisplay(currentCentered, 'scroll');
	}
}

function getCurrentCentered() {
	var closestToZero = 100000000;
	var currentCentered = null;
	Array.from(__WEBPACK_IMPORTED_MODULE_0__nakasentro__["nakasentro"].artworks).filter(function (artwork) {
		if (Math.abs(artwork.toCenterPixels) < closestToZero) {
			closestToZero = artwork.toCenterPixels;
			currentCentered = artwork.element;
			// console.log(artwork.element);
		}
	});

	return currentCentered;
}

function checkForPrevious(startingArtwork) {
	while (startingArtwork !== null && !startingArtwork.classList.contains('artwork_piece')) {
		startingArtwork = startingArtwork.previousElementSibling;
	}
	return startingArtwork;
}

function checkForNext(startingArtwork) {
	while (startingArtwork !== null && !startingArtwork.classList.contains('artwork_piece')) {
		startingArtwork = startingArtwork.nextElementSibling;
	}
	return startingArtwork;
}

function scrollToByPixels(scrollAmount) {
	/* eslint-disable */
	if (Barba.FullScreen.isFullscreen) {
		/* eslint-enable */
		fullscreen.scrollTo({top: scrollAmount, left: 0, behavior: 'smooth'});
	} else {
		window.scrollTo({top: scrollAmount, left: 0, behavior: 'smooth'});
	}
}

function goPrevious() {
	if (__WEBPACK_IMPORTED_MODULE_0__nakasentro__["nakasentro"].imageCentered === true) {
		// trigger centered removal
		__WEBPACK_IMPORTED_MODULE_0__nakasentro__["nakasentro"].resetAllCenteredSettings();
	}
	var artworkToCenter = checkForPrevious(getCurrentCentered().previousElementSibling);

	if (artworkToCenter !== null) {
		scrollToElement(artworkToCenter);
	}
}


function goNext() {
	if (__WEBPACK_IMPORTED_MODULE_0__nakasentro__["nakasentro"].imageCentered === true) {
		// trigger centered removal
		__WEBPACK_IMPORTED_MODULE_0__nakasentro__["nakasentro"].resetAllCenteredSettings();
	}
	var artworkToCenter = getCurrentCentered().nextElementSibling;

	artworkToCenter = checkForNext(artworkToCenter);

	if (artworkToCenter !== null) {
		scrollToElement(artworkToCenter);
	}

	checkButtonNavigationDisplay(artworkToCenter, 'next');
}

function processPrevCheck(artworkToCenter, direction) {
	if (artworkToCenter !== null) {
		if (direction !== 'scroll') {
			setNextVisibility('show');
		}
		// now check to see if there is one more
		var prevElement = checkForPrevious(artworkToCenter.previousElementSibling);
		if (prevElement === null || Object.is(artworkToCenter, prevElement)) {
			setPreviousVisibility('hide');
		} else {
			setPreviousVisibility('show');
		}
	} else {
		setPreviousVisibility('hide');
	}
}

function processNextCheck(artworkToCenter, direction) {
	if (artworkToCenter !== null) {
		// artworkToCenter.scrollIntoView({behavior: 'smooth'});
		if (direction !== 'scroll') {
			setPreviousVisibility('show');
		}
		// now check to see if there is one more
		var nextElement = checkForNext(artworkToCenter.nextElementSibling);
		if (nextElement === null || Object.is(artworkToCenter, nextElement)) {
			setNextVisibility('hide');
		} else {
			setNextVisibility('show');
		}
	} else {
		setNextVisibility('hide');
	}
}

function getElementTop(element) {
	var top = 0;
	do {
		top += element.offsetTop || 0;
		element = element.offsetParent;
	} while (element);
	return top;
}

function getElementMiddle(element) {

	var elementHeight = element.clientHeight;
	var top = getElementTop(element);

	var scrollingWrapHeight = null;
	/* eslint-disable */
	if(Barba.FullScreen.isFullscreen){
		/* eslint-enable */
		// use fullscreen
		scrollingWrapHeight = fullscreen.clientHeight;
	}else{
		// use window
		scrollingWrapHeight = window.innerHeight;
	}

	return top - ((scrollingWrapHeight - elementHeight) / 2);

}

function scrollToElement(artworkToCenter) {
	var scrollAmount = getElementMiddle(artworkToCenter);
	scrollToByPixels(scrollAmount);
}

function checkButtonNavigationDisplay(artworkToCenter, direction) {
	if ( direction === void 0 ) direction = 'scroll';

	if (direction === 'next') {
		processNextCheck(artworkToCenter, direction);
	} else if (direction === 'prev') {
		processPrevCheck(artworkToCenter, direction);
	} else if (direction === 'scroll') {
		processNextCheck(artworkToCenter, direction);
		processPrevCheck(artworkToCenter, direction);
	}
}


function setPreviousVisibility(value) {
	if (value === 'show') {
		centerScrollDiv.classList.remove('hide-previous');
	} else {
		centerScrollDiv.classList.add('hide-previous');
	}
}

function setNextVisibility(value) {
	if (value === 'show') {
		centerScrollDiv.classList.remove('hide-next');
	} else {
		centerScrollDiv.classList.add('hide-next');
	}
}




/***/ }),
/* 21 */
/*!**********************************!*\
  !*** ./scripts/thumbnail-nav.js ***!
  \**********************************/
/*! exports provided: init, addThumbnail, setInitFalse */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addThumbnail", function() { return addThumbnail; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setInitFalse", function() { return setInitFalse; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__center_scroll_to__ = __webpack_require__(/*! ./center-scroll-to */ 20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__ = __webpack_require__(/*! body-scroll-lock */ 18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_scroll_lock___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__);



var thumbnails = [];
var thumbnailCount = 0;
var thumbnailsTrigger = null;
var thumbnailsNav = null;
var thumbnailsWrap = null;
var initSetup = false;
var fullscreenWrapper = document.querySelector('.fullscreen-wrapper');

function init(parentElement) {
	if (initSetup === false) {
		initSetup = true;
		var pageHeader = document.querySelector('.main .page-header h1').outerHTML;
		// add thumbnails div
		var thumbnailsNavHtml = "\n\t\t<div id=\"thumbnails-nav\" class=\"hide\">\n\t\t\t" + pageHeader + "\n\t\t\t<div class=\"thumbnails-wrap\"></div>\n\t\t</div>\n\t";
		parentElement.insertAdjacentHTML('afterbegin', thumbnailsNavHtml);
		thumbnailsNav = document.getElementById('thumbnails-nav');
		thumbnailsWrap = thumbnailsNav.querySelector('.thumbnails-wrap');


		// add trigger divs
		var thumbnailTriggerHtml = "\n\t\t\t<div id=\"thumbnail-trigger\">\n\t\t\t\t<div></div>\n\t\t\t\t<div></div>\n\t\t\t\t<div></div>\n\t\t\t\t<div></div>\n\t\t\t\t<div></div>\n\t\t\t\t<div></div>\n\t\t\t</div>\n\t\t";

		document.querySelector('.fullscreen-wrapper').insertAdjacentHTML('afterbegin', thumbnailTriggerHtml);
		thumbnailsTrigger = document.getElementById('thumbnail-trigger');

		thumbnailsTrigger.addEventListener('click', function () {
			if (fullscreenWrapper.classList.contains('showing-thumbnails')) {
				window.setTimeout(function () {
					Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["clearAllBodyScrollLocks"])(thumbnailsNav);
				}, 100);
			} else {
				Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["disableBodyScroll"])(thumbnailsNav);
			}
			Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["disableBodyScroll"])(thumbnailsNav);
			thumbnailsNav.classList.toggle('hide');
			fullscreenWrapper.classList.toggle('showing-thumbnails');
		});
	}
}

function elementAdded(associatedDomElement) {
	return this === associatedDomElement;
}

function addThumbnail(imgSrc, associatedDomElement) {
	// don't add thumbnail if we already have
	if (!thumbnails.find(elementAdded, associatedDomElement)) {
		var thumbnailHtml = "\n\t\t\t<div class=\"thumbnail-wrap\" id=\"thumbnail-" + thumbnailCount + "\"><img class=\"thumbnail\" src=\"" + imgSrc + "\" /></div>\n\t\t";
		thumbnailsWrap.insertAdjacentHTML('beforeend', thumbnailHtml);

		document.getElementById(("thumbnail-" + thumbnailCount)).addEventListener('click', function () {
			thumbnailsNav.classList.add('hide');
			fullscreenWrapper.classList.remove('showing-thumbnails');

			// timeout time set to same amount of thumbnails-nav transition-duration
			window.setTimeout(function () {
				Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["clearAllBodyScrollLocks"])(thumbnailsNav);
				Object(__WEBPACK_IMPORTED_MODULE_0__center_scroll_to__["scrollToElement"])(associatedDomElement);
			}, 100);
		});

		thumbnailCount++;
		thumbnails.push(associatedDomElement);
	}

}

function setInitFalse(){
	initSetup = false;
}



/***/ }),
/* 22 */
/*!*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/cache-loader/dist/cjs.js!/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/css-loader?{"sourceMap":true}!/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/postcss-loader/lib?{"config":{"path":"/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/build","ctx":{"open":true,"copy":"images/**_/*","proxyUrl":"http://localhost:3000","cacheBusting":"[name]_[hash:8]","paths":{"root":"/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew","assets":"/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets","dist":"/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/dist"},"enabled":{"sourceMaps":true,"optimize":false,"cacheBusting":false,"watcher":true},"watch":["app/**_/*.php","config/**_/*.php","resources/views/**_/*.php"],"entry":{"main":["./scripts/splash-page.js","./scripts/utilities.js","./scripts/youtube.js","./scripts/artwork-info.js","./scripts/st-audio.js","./scripts/more-info.js","./scripts/mousePosition.js","./scripts/zoomy.js","./scripts/thumbnail-nav.js","./scripts/nakasentro.js","./scripts/center-scroll-to.js","./scripts/main.js","./styles/main.scss"],"customizer":["./scripts/customizer.js"]},"publicPath":"/app/themes/stone-roberts-anew/dist/","devUrl":"http://stoneroberts.localhost","headers":{"Access-Control-Allow-Origin":"*"},"env":{"production":false,"development":true},"manifest":{}}},"sourceMap":true}!/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/resolve-url-loader?{"sourceMap":true}!/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/sass-loader/lib/loader.js?{"sourceMap":true}!/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/import-glob!./styles/main.scss ***!
  \*********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ 57)(true);
// imports
exports.push([module.i, "@import url(https://cloud.typography.com/7063492/6582372/css/fonts.css);", ""]);

// module
exports.push([module.i, "/*********************\nBREAKPOINTS\n*********************/\n\n/** Import everything from autoload */\n\n/**\n * Import npm dependencies\n *\n * Prefix your imports with `~` to grab from node_modules/\n * @see https://github.com/webpack-contrib/sass-loader#imports\n */\n\n/** Import theme styles */\n\n/*! sanitize.css v5.0.0 | CC0 License | github.com/jonathantneal/sanitize.css */\n\n/* Document (https://html.spec.whatwg.org/multipage/semantics.html#semantics)\n   ========================================================================== */\n\n/**\n * 1. Remove repeating backgrounds in all browsers (opinionated).\n * 2. Add box sizing inheritence in all browsers (opinionated).\n */\n\n*,\n::before,\n::after {\n  background-repeat: no-repeat;\n  /* 1 */\n  -webkit-box-sizing: inherit;\n          box-sizing: inherit;\n  /* 2 */\n}\n\n/**\n * 1. Add text decoration inheritance in all browsers (opinionated).\n * 2. Add vertical alignment inheritence in all browsers (opinionated).\n */\n\n::before,\n::after {\n  text-decoration: inherit;\n  /* 1 */\n  vertical-align: inherit;\n  /* 2 */\n}\n\n/**\n * 1. Add border box sizing in all browsers (opinionated).\n * 2. Add the default cursor in all browsers (opinionated).\n * 3. Prevent font size adjustments after orientation changes in IE and iOS.\n */\n\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  cursor: default;\n  /* 2 */\n  -ms-text-size-adjust: 100%;\n  /* 3 */\n  -webkit-text-size-adjust: 100%;\n  /* 3 */\n}\n\n/* Sections (https://html.spec.whatwg.org/multipage/semantics.html#sections)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: .67em 0;\n}\n\n/* Grouping content (https://html.spec.whatwg.org/multipage/semantics.html#grouping-content)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain {\n  /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n\n/**\n * Remove the list style on navigation lists in all browsers (opinionated).\n */\n\nnav ol,\nnav ul {\n  list-style: none;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/* Text-level semantics (https://html.spec.whatwg.org/multipage/semantics.html#text-level-semantics)\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent;\n  /* 1 */\n  -webkit-text-decoration-skip: objects;\n  /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n  /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ffff00;\n  color: #000000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -.25em;\n}\n\nsup {\n  top: -.5em;\n}\n\n/*\n * Remove the text shadow on text selections (opinionated).\n * 1. Restore the coloring undone by defining the text shadow (opinionated).\n */\n\n::-moz-selection {\n  background-color: #b3d4fc;\n  /* 1 */\n  color: #000000;\n  /* 1 */\n  text-shadow: none;\n}\n\n::selection {\n  background-color: #b3d4fc;\n  /* 1 */\n  color: #000000;\n  /* 1 */\n  text-shadow: none;\n}\n\n/* Embedded content (https://html.spec.whatwg.org/multipage/embedded-content.html#embedded-content)\n   ========================================================================== */\n\n/*\n * Change the alignment on media elements in all browers (opinionated).\n */\n\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n  vertical-align: middle;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Change the fill color to match the text color in all browsers (opinionated).\n */\n\nsvg {\n  fill: currentColor;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Tabular data (https://html.spec.whatwg.org/multipage/tables.html#tables)\n   ========================================================================== */\n\n/**\n * Collapse border spacing\n */\n\ntable {\n  border-collapse: collapse;\n}\n\n/* Forms (https://html.spec.whatwg.org/multipage/forms.html#forms)\n   ========================================================================== */\n\n/**\n * Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  margin: 0;\n}\n\n/**\n * Inherit styling in all browsers (opinionated).\n */\n\nbutton,\ninput,\nselect,\ntextarea {\n  background-color: transparent;\n  color: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */\n}\n\n/**\n * 1. Remove the default vertical scrollbar in IE.\n * 2. Change the resize direction on textareas in all browsers (opinionated).\n */\n\ntextarea {\n  overflow: auto;\n  /* 1 */\n  resize: vertical;\n  /* 2 */\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/* Interactive elements (https://html.spec.whatwg.org/multipage/forms.html#interactive-elements)\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails,\nmenu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting (https://html.spec.whatwg.org/multipage/scripting.html#scripting-3)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* User interaction (https://html.spec.whatwg.org/multipage/interaction.html#editing)\n   ========================================================================== */\n\n/*\n * Remove the tapping delay on clickable elements (opinionated).\n * 1. Remove the tapping delay in IE 10.\n */\n\na,\narea,\nbutton,\ninput,\nlabel,\nselect,\nsummary,\ntextarea,\n[tabindex] {\n  -ms-touch-action: manipulation;\n  /* 1 */\n  touch-action: manipulation;\n}\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}\n\n/* ARIA (https://w3c.github.io/html-aria/)\n   ========================================================================== */\n\n/**\n * Change the cursor on busy elements (opinionated).\n */\n\n[aria-busy=\"true\"] {\n  cursor: progress;\n}\n\n/*\n * Change the cursor on control elements (opinionated).\n */\n\n[aria-controls] {\n  cursor: pointer;\n}\n\n/*\n * Change the display on visually hidden accessible elements (opinionated).\n */\n\n[aria-hidden=\"false\"][hidden]:not(:focus) {\n  clip: rect(0, 0, 0, 0);\n  display: inherit;\n  position: absolute;\n}\n\n/*\n * Change the cursor on disabled, not-editable, or otherwise\n * inoperable elements (opinionated).\n */\n\n[aria-disabled] {\n  cursor: default;\n}\n\n/* eslint-disable selector-pseudo-element-colon-notation */\n\n/**\n * For modern browsers\n * 1. The space content is one way to avoid an Opera bug when the\n *    contenteditable attribute is included anywhere else in the document.\n *    Otherwise it causes space to appear at the top and bottom of elements\n *    that are clearfixed.\n * 2. The use of `table` rather than `block` is only necessary if using\n *    `:before` to contain the top-margins of child elements.\n */\n\n.cf:before,\n.cf:after {\n  content: \" \";\n  /* 1 */\n  display: table;\n  /* 2 */\n}\n\n.cf:after {\n  clear: both;\n}\n\n/**\n * For IE 6/7 only\n * Include this rule to trigger hasLayout and contain floats.\n */\n\n.cf {\n  *zoom: 1;\n}\n\n/* Hide the text. */\n\n.hide-text {\n  display: block;\n  overflow: hidden;\n  text-indent: 100%;\n  white-space: nowrap;\n}\n\nimg {\n  max-height: 100%;\n  max-width: 100%;\n}\n\ntextarea,\ninput,\nbutton,\n.mobile-nav-link {\n  outline: none;\n}\n\n.container {\n  margin: 0 auto;\n  padding: 0;\n}\n\nhtml {\n  background: #262626;\n}\n\nbody.front {\n  background: #262626;\n  overflow: scroll;\n}\n\nbody.front.no-scroll {\n  overflow: hidden;\n}\n\nbody.front .fullscreen {\n  background-color: #262626;\n}\n\n@media screen and (max-width: 767px) {\n  body.front .fullscreen .fullscreen-wrapper {\n    overflow: hidden;\n  }\n}\n\nbody.front .fullscreen .fullscreen-wrapper .wrap.container {\n  max-width: 100%;\n  width: 100%;\n}\n\nbody.front .fullscreen .fullscreen-wrapper .wrap.container > .content {\n  margin: 0;\n}\n\nbody.front #body-overlay {\n  background: rgba(255, 255, 255, 0.5);\n  bottom: 0;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: -300;\n}\n\nbody.front.page-template-template-projects .main {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  margin: 0 auto;\n  max-width: 600px;\n  width: 50%;\n}\n\n@media screen and (max-width: 767px) {\n  body.front.page-template-template-projects .main {\n    width: 90%;\n  }\n}\n\nbody.front.page-template-template-projects .main > * {\n  -webkit-transition-duration: .25s;\n       -o-transition-duration: .25s;\n          transition-duration: .25s;\n  -webkit-transition-property: opacity;\n  -o-transition-property: opacity;\n  transition-property: opacity;\n}\n\nbody.front.page-template-template-projects .main.centered-image > *:not(.centered-image-transition-duration) {\n  opacity: 0;\n}\n\nbody.front.page-template-template-projects .main p {\n  margin-top: 0;\n}\n\nbody.front.centered-image #back-to-top {\n  opacity: 0;\n}\n\n/** Search form */\n\n/**\n * WordPress Generated Classes\n * @see http://codex.wordpress.org/CSS#WordPress_Generated_Classes\n */\n\n/** Media alignment */\n\n.alignnone {\n  margin-left: 0;\n  margin-right: 0;\n  max-width: 100%;\n  height: auto;\n}\n\n.aligncenter {\n  display: block;\n  margin: 0.5rem auto;\n  height: auto;\n}\n\n.alignleft,\n.alignright {\n  margin-bottom: 0.5rem;\n  height: auto;\n}\n\n@media (min-width: 30rem) {\n  .alignleft {\n    float: left;\n    margin-right: 0.5rem;\n  }\n\n  .alignright {\n    float: right;\n    margin-left: 0.5rem;\n  }\n}\n\n/** Captions */\n\n/** Text meant only for screen readers */\n\n.screen-reader-text {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n  color: #000;\n  background: #fff;\n}\n\n.modal {\n  max-width: 30000px;\n  width: 100vw;\n}\n\n.modal .modal-dialog {\n  max-width: 30000px;\n  height: 100vh;\n  width: 100vw;\n}\n\n.modal .modal-dialog .modal-content {\n  max-width: 100%;\n  height: 100vh;\n  top: 0 !important;\n  left: 0 !important;\n  -webkit-transform: translate(0, 0) !important;\n       -o-transform: translate(0, 0) !important;\n          transform: translate(0, 0) !important;\n}\n\n.modal .modal-dialog .modal-content .modal-body {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding-top: 39px;\n}\n\n.modal .modal-dialog .modal-content .modal-body .video-embed,\n.modal .modal-dialog .modal-content .modal-body .video-embed * {\n  max-height: calc(100vh - 27px);\n}\n\n.modal .modal-dialog .modal-content .modal-body button {\n  background: url(\"/app/themes/stone-roberts-anew/dist/images/closeout-icon-lightgrey.png\") no-repeat center center/contain transparent !important;\n  height: 17px;\n  padding: 0;\n  width: 17px;\n  text-align: left;\n  position: absolute;\n  left: 3px;\n  top: 10px;\n  z-index: 200;\n}\n\n.modal .modal-dialog .modal-content .modal-body iframe {\n  display: block;\n  margin: 0 auto;\n}\n\n.nav-primary {\n  background: #262626;\n  -webkit-transform: translateY(-100vh);\n       -o-transform: translateY(-100vh);\n          transform: translateY(-100vh);\n  position: fixed;\n  z-index: 19;\n  height: 100vh;\n  width: 100vw;\n  margin: 0 auto;\n  padding: 6vh;\n  max-height: 100vh;\n  max-width: none;\n  overflow: scroll;\n  top: 0;\n  -webkit-transition-duration: .25s;\n       -o-transition-duration: .25s;\n          transition-duration: .25s;\n  -webkit-transition-property: -webkit-transform;\n  transition-property: -webkit-transform;\n  -o-transition-property: -o-transform;\n  transition-property: transform;\n  transition-property: transform, -webkit-transform, -o-transform;\n}\n\n.custom-nav {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-gap: 3vw;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding: 0;\n}\n\n.custom-nav .list-item {\n  display: block;\n  height: auto;\n  margin: 0 0 1.8em;\n  max-height: none;\n  max-width: none;\n  width: auto;\n}\n\n.custom-nav .list-item:hover .nav-item-image,\n.custom-nav .list-item:active .nav-item-image {\n  -webkit-transform: scale(1.01);\n       -o-transform: scale(1.01);\n          transform: scale(1.01);\n  -webkit-transition-duration: .25s;\n       -o-transition-duration: .25s;\n          transition-duration: .25s;\n  -webkit-transition-property: -webkit-transform;\n  transition-property: -webkit-transform;\n  -o-transition-property: -o-transform;\n  transition-property: transform;\n  transition-property: transform, -webkit-transform, -o-transform;\n}\n\n.custom-nav .list-item .nav-item {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  height: 100%;\n}\n\n.custom-nav .list-item .nav-item-header {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  font-size: 18px;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  margin-bottom: 13px;\n  text-transform: uppercase;\n  letter-spacing: 1.1px;\n}\n\n.custom-nav .list-item .nav-item-image {\n  background-size: cover;\n  display: block;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  height: unset;\n  max-width: 100%;\n  padding-bottom: 100%;\n  width: 100%;\n}\n\n.custom-nav .list-item .nav-item-short-text {\n  display: block;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  margin-top: 0.4em;\n}\n\n.audio {\n  margin-top: 73px;\n  padding: 0 23px;\n  position: relative;\n}\n\n.audio .audio-piece .duration,\n.audio .audio-piece .timer {\n  background: rgba(0, 0, 0, 0.5);\n  bottom: 0;\n  color: #fff;\n  padding: .5em;\n  position: absolute;\n}\n\n.audio .audio-piece .duration.timer,\n.audio .audio-piece .timer.timer {\n  left: -2em;\n}\n\n.audio .audio-piece .duration.duration,\n.audio .audio-piece .timer.duration {\n  right: -2em;\n}\n\n.audio .audio-piece button {\n  background-color: gray;\n  border: 0 solid;\n  border-radius: .1em;\n  padding: 1.2em;\n  color: #fff;\n}\n\n.audio .audio-piece .span-value-wrap {\n  height: 50px;\n  position: relative;\n  width: 100%;\n}\n\n.audio .audio-piece .span-value-wrap .span-value {\n  background-color: #646464;\n  border-radius: 0;\n  display: block;\n  height: 100%;\n  overflow: visible;\n  width: 0;\n}\n\n.audio .audio-piece .span-value-wrap .span-value .span-value-jump {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  height: 100%;\n  width: 0;\n}\n\n.audio .audio-piece .span-value-wrap .span-value .span-value-jump div {\n  height: 100%;\n  width: 100%;\n}\n\n.audio .audio-piece .span-value-wrap:hover .span-value-jump div {\n  background-color: rgba(79, 105, 61, 0.5);\n}\n\n.video {\n  position: relative;\n  width: 100%;\n}\n\n.video .wrap {\n  overflow: hidden;\n  position: relative;\n}\n\n.video .wrap .video-play-screenshot {\n  overflow: hidden;\n  display: block;\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background-size: cover;\n  background-position: center;\n  z-index: 1;\n}\n\n.video .caption {\n  margin-top: 10px;\n}\n\n.video .caption p {\n  color: #bcbcbc;\n  font-size: 15px;\n  line-height: 19px;\n}\n\n.video .play-button {\n  background: url(\"/app/themes/stone-roberts-anew/dist/images/play.svg\") no-repeat 50%/28% transparent;\n  border: none;\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  z-index: 2;\n}\n\n@media screen and (max-width: 767px) {\n  .video {\n    background-size: 22%;\n  }\n}\n\n@media screen and (min-width: 768px) {\n  .video .play-button {\n    background-size: 20%;\n  }\n\n  .video .play-button:hover {\n    cursor: pointer;\n  }\n}\n\n.video.playing .play-button,\n.video.playing .video-play-screenshot {\n  display: none;\n}\n\n.carousel-wrap {\n  overflow: hidden;\n  position: relative;\n}\n\n.carousel-wrap .carousel {\n  width: 100%;\n}\n\n.carousel-wrap .carousel .carousel-cell {\n  max-width: 100vw;\n  width: 100%;\n}\n\n.carousel-wrap .carousel .carousel-cell figure {\n  margin-bottom: 0;\n  width: 100% !important;\n}\n\n.carousel-wrap .carousel .carousel-cell figure img {\n  width: 100%;\n}\n\n.carousel-wrap .carousel .carousel-cell .text {\n  background: rgba(0, 0, 0, 0.5);\n  bottom: 0;\n  color: #fff;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  text-align: left;\n  width: 100%;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button {\n  display: none;\n  width: 55px;\n  height: 77px;\n}\n\n@media screen and (min-width: 768px) {\n  .carousel-wrap .carousel .flickity-page-dots {\n    bottom: 45px;\n  }\n\n  .carousel-wrap .carousel .flickity-page-dots .dot {\n    height: 13px;\n    width: 13px;\n    background: #fff;\n  }\n}\n\n@media screen and (min-width: 1024px) {\n  .carousel-wrap .carousel .flickity-page-dots {\n    bottom: 59px;\n  }\n\n  .carousel-wrap .carousel .flickity-prev-next-button {\n    display: block;\n  }\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button {\n  background: transparent;\n  display: block;\n  top: 72%;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button path {\n  fill: #fff;\n  opacity: .4;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button {\n  top: 73.2%;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button.previous {\n  left: 31px;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button.next {\n  right: 20px;\n}\n\n.center-scroll-arrows {\n  position: fixed;\n  left: 0;\n  top: 50%;\n  z-index: 50;\n}\n\n.center-scroll-arrows div {\n  background: rgba(0, 0, 0, 0.8);\n  height: 20px;\n  width: 20px;\n}\n\n.center-scroll-arrows div.next {\n  -webkit-transform: rotate(180deg);\n       -o-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.center-scroll-arrows div:hover {\n  cursor: pointer;\n}\n\n.center-scroll-arrows.hide-next .next {\n  visibility: hidden;\n}\n\n.center-scroll-arrows.hide-previous .prev {\n  visibility: hidden;\n}\n\n#thumbnails-nav {\n  background-color: rgba(0, 0, 0, 0.9);\n  height: 100vh;\n  left: 0;\n  opacity: 1;\n  overflow: scroll;\n  padding: 0 4vw 8vw;\n  position: fixed;\n  top: 0;\n  -webkit-transition-duration: .1s;\n       -o-transition-duration: .1s;\n          transition-duration: .1s;\n  -webkit-transition-property: opacity, -webkit-transform;\n  transition-property: opacity, -webkit-transform;\n  -o-transition-property: opacity, -o-transform;\n  transition-property: transform, opacity;\n  transition-property: transform, opacity, -webkit-transform, -o-transform;\n  width: 100vw;\n  z-index: 300;\n}\n\n#thumbnails-nav h1 {\n  font-size: 18px;\n  letter-spacing: 3.7px;\n  height: 8vw;\n  width: 100%;\n  text-align: center;\n  margin: 0 0 -2vh 0 !important;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n#thumbnails-nav .thumbnails-wrap {\n  -ms-flex-line-pack: start;\n      align-content: flex-start;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n#thumbnails-nav .thumbnail-wrap {\n  height: 21vw;\n  padding: 2vh;\n  width: auto;\n}\n\n#thumbnails-nav .thumbnail {\n  height: 100%;\n  width: auto;\n}\n\n#thumbnails-nav .thumbnail:hover {\n  cursor: pointer;\n}\n\n#thumbnails-nav.hide {\n  opacity: 0;\n  -webkit-transform: translateX(-100vw);\n       -o-transform: translateX(-100vw);\n          transform: translateX(-100vw);\n}\n\n#thumbnail-trigger {\n  height: 26px;\n  left: 10px;\n  position: fixed;\n  bottom: 8px;\n  -webkit-transition-duration: .1s;\n       -o-transition-duration: .1s;\n          transition-duration: .1s;\n  -webkit-transition-property: top;\n  -o-transition-property: top;\n  transition-property: top;\n  width: 39px;\n  z-index: 301;\n}\n\n#thumbnail-trigger:hover {\n  cursor: pointer;\n}\n\n#thumbnail-trigger > div {\n  background-color: #fff;\n  float: left;\n  height: 10px;\n  margin: 0 3px 3px 0;\n  width: 10px;\n}\n\nbody:not(.template-projects) #thumbnail-trigger {\n  display: none;\n}\n\n.artwork_piece {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  max-width: 100vw !important;\n  min-width: 100%;\n  padding-top: 55px;\n  position: relative;\n  -webkit-transition-property: width, height;\n  -o-transition-property: width, height;\n  transition-property: width, height;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n}\n\n.artwork_piece h3 {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.artwork_piece .image-wrap {\n  display: inline-block;\n  max-height: 100%;\n  max-width: 100%;\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder {\n  margin: 0 auto;\n  position: relative;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n  width: 100%;\n  z-index: 2;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder .center-image-wrap,\n.artwork_piece .image-wrap .image-space-placeholder .zoomy-wrap {\n  -webkit-box-align: baseline;\n      -ms-flex-align: baseline;\n          align-items: baseline;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder .main-img {\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  max-height: 100vh;\n  position: static;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder .artwork-image-wrap {\n  margin: 0 auto;\n}\n\n.artwork_piece .image-wrap .caption {\n  display: inline-block;\n  margin-right: 1%;\n  width: 81%;\n}\n\n.artwork_piece .image-wrap .artwork-meta {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: static;\n  text-align: left;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .artwork-meta .caption p {\n  margin: 0;\n}\n\n.artwork_piece .image-wrap .artwork-meta .actions {\n  display: block;\n  position: absolute;\n  right: 0;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -webkit-transition-duration: .5s;\n       -o-transition-duration: .5s;\n          transition-duration: .5s;\n  z-index: 20;\n}\n\n.artwork_piece .image-wrap .artwork-meta .actions div {\n  display: inline-block;\n  height: 30px;\n  width: 30px;\n}\n\n.artwork_piece .image-wrap .artwork-meta .actions div:hover {\n  cursor: pointer;\n}\n\n.artwork_piece .image-wrap .piece-comparison {\n  background: #fff;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  -webkit-transform: translateY(110vh);\n       -o-transform: translateY(110vh);\n          transform: translateY(110vh);\n  -webkit-transition-duration: .5s;\n       -o-transition-duration: .5s;\n          transition-duration: .5s;\n  z-index: 400;\n  height: 100vh;\n}\n\n.artwork_piece .image-wrap .piece-comparison .piece-comparison-wrap {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  height: 100%;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin: 0 auto;\n  overflow: hidden;\n  padding: 0;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .piece-comparison .piece-comparison-wrap.piece-comparison-processed {\n  visibility: visible !important;\n}\n\n.artwork_piece .image-wrap .piece-comparison .comparison-image-wrap {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  margin-bottom: 29%;\n  max-height: 100%;\n  padding-bottom: 3vh;\n  position: absolute;\n  top: 4%;\n  z-index: 1;\n}\n\n.artwork_piece .image-wrap .piece-comparison .comparison-image-wrap .comparison-image {\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n  height: auto;\n  max-height: none;\n  max-width: none;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .piece-comparison .comparison-image-wrap .info-text p {\n  color: #0f0f0f;\n  display: inline;\n}\n\n.artwork_piece .image-wrap .piece-comparison .compared-to {\n  height: 100vh;\n  left: 0;\n  max-height: none;\n  max-width: none;\n  -o-object-fit: cover;\n     object-fit: cover;\n  position: absolute;\n  top: 0;\n  -webkit-transition-duration: 250ms;\n       -o-transition-duration: 250ms;\n          transition-duration: 250ms;\n  -webkit-transition-property: width, height;\n  -o-transition-property: width, height;\n  transition-property: width, height;\n  width: 100vw;\n}\n\n.artwork_piece .image-wrap .piece-comparison .close {\n  color: #0f0f0f;\n  position: absolute;\n  right: 20px;\n  top: 20px;\n  z-index: 5;\n}\n\n.artwork_piece .image-wrap .piece-comparison .close:hover {\n  cursor: pointer;\n}\n\n.artwork_piece.show-info .piece-comparison {\n  -webkit-transform: translateY(0vh);\n       -o-transform: translateY(0vh);\n          transform: translateY(0vh);\n}\n\n.artwork_piece .zoomy-wrap {\n  height: 100%;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 10;\n}\n\n.artwork_piece .zoomy-wrap .zoom-img {\n  background-color: #0f0f0f;\n  position: absolute;\n  max-height: none;\n  max-width: none;\n  padding: 10px;\n  width: 150%;\n  height: auto;\n}\n\n.artwork_piece .zoomy-wrap .mouse-map-wrap {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  background-color: #1c1c1c;\n  background-origin: border-box;\n  background-repeat: no-repeat;\n  background-size: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  height: 100%;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  overflow: hidden;\n  opacity: 0;\n  position: relative;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n  -webkit-transition-property: background-size, width, height, -webkit-transform;\n  transition-property: background-size, width, height, -webkit-transform;\n  -o-transition-property: background-size, width, height, -o-transform;\n  transition-property: transform, background-size, width, height;\n  transition-property: transform, background-size, width, height, -webkit-transform, -o-transform;\n  width: 100%;\n}\n\n.artwork_piece .zoomy-wrap .mouse-map-wrap[zoom-enabled]:hover {\n  cursor: -webkit-zoom-in;\n  cursor: zoom-in;\n}\n\n.artwork_piece .zoomy-wrap .mouse-map-wrap .mouse-map {\n  opacity: .4;\n  height: 100%;\n  width: 100%;\n  margin: 0 auto;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n  -webkit-transition-property: background-size, width, height, -webkit-transform;\n  transition-property: background-size, width, height, -webkit-transform;\n  -o-transition-property: background-size, width, height, -o-transform;\n  transition-property: transform, background-size, width, height;\n  transition-property: transform, background-size, width, height, -webkit-transform, -o-transform;\n}\n\n.artwork_piece.zoomed .mouse-map-wrap {\n  opacity: 1;\n}\n\n.artwork_piece.zoomed .mouse-map-wrap:hover {\n  cursor: -webkit-zoom-out !important;\n  cursor: zoom-out !important;\n}\n\n.artwork_piece.zoomed .main-img {\n  visibility: hidden;\n}\n\n.artwork_piece.centered .image-space-placeholder {\n  z-index: 50;\n}\n\n.artwork_piece.centered .center-image-wrap,\n.artwork_piece.centered .zoomy-wrap {\n  -webkit-box-align: center !important;\n      -ms-flex-align: center !important;\n          align-items: center !important;\n  bottom: 0;\n  height: auto !important;\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n}\n\n.artwork_piece.centered .artwork-meta {\n  background-color: #1a1a1a;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  bottom: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  left: calc(100vw - 40px);\n  padding: 0;\n  position: fixed;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n  -webkit-transition-property: left;\n  -o-transition-property: left;\n  transition-property: left;\n  width: 100vw;\n  z-index: 302;\n}\n\n.artwork_piece.centered .artwork-meta .artwork_piece {\n  width: auto;\n}\n\n.artwork_piece.centered .artwork-meta:before {\n  content: '';\n  height: 30px;\n  width: 30px;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  display: inline-block;\n  padding: 3px;\n  -webkit-transform: rotate(135deg);\n       -o-transform: rotate(135deg);\n          transform: rotate(135deg);\n  position: absolute;\n  left: 12px;\n  bottom: 14px;\n}\n\n.artwork_piece.centered .artwork-meta:hover {\n  left: 0;\n  padding-left: 1.2em;\n  padding-right: 1.2em;\n}\n\n.artwork_piece.centered .artwork-meta .caption {\n  padding: 20px 20px 20px 41px;\n  width: 81%;\n}\n\n.artwork_piece.centered .artwork-meta .caption p {\n  text-align: center;\n}\n\n.artwork_piece.centered .artwork-meta .actions {\n  position: static;\n}\n\n.artwork_piece.centered.width .image-space-placeholder,\n.artwork_piece.centered.width .image-ratio-holder {\n  width: 100%;\n}\n\n.artwork_piece.centered.height .image-wrap,\n.artwork_piece.centered.height .image-space-placeholder,\n.artwork_piece.centered.height .image-ratio-holder {\n  width: 100%;\n}\n\n.artwork_piece:not(.zoomed) .artwork-meta:hover {\n  bottom: 0;\n}\n\n.artwork_piece:not(.zoomed) .artwork-meta:hover .caption p {\n  opacity: 1;\n}\n\n.artwork_piece.centered-image-transition-duration .main-img {\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n}\n\n.artwork_piece.zoomed-delay .mouse-map-wrap {\n  opacity: 1 !important;\n}\n\n.artwork_piece .actions .zoom {\n  display: none !important;\n}\n\n.artwork_piece[zoom-enabled] .actions .zoom {\n  display: inline-block !important;\n}\n\nbody.artworks-processed .artwork_piece {\n  width: 100vw;\n}\n\nbody.centered-image .main > * {\n  opacity: 0;\n}\n\nbody.centered-image .main > *.centered {\n  opacity: 1 !important;\n}\n\nbody.centered-image .main > *.centered h3 {\n  opacity: 0;\n}\n\nbody.is-touch .artwork_piece .main-img {\n  max-width: 100vw;\n  max-height: none !important;\n  position: static !important;\n}\n\nbody.is-touch .artwork_piece .artwork-meta {\n  padding: 1.2em;\n}\n\nbody.is-touch .artwork_piece.width .main-img {\n  height: auto;\n  width: 100vw;\n}\n\nbody.is-touch .artwork_piece.height .main-img {\n  height: 100vh;\n  width: auto;\n}\n\nbody.is-touch.zoomed {\n  overflow: hidden;\n}\n\nbody.viewport-resizing .artwork_piece {\n  max-width: 100% !important;\n}\n\nbody.orientation-landscape.zoomed .artwork-meta {\n  z-index: 0;\n}\n\n@media screen and (max-width: 630px) {\n  body .artwork_piece .main-img {\n    max-width: 100vw;\n    max-height: none !important;\n    position: static !important;\n  }\n\n  body .artwork_piece .artwork-meta {\n    padding: 1.2em;\n  }\n\n  body .artwork_piece.width .main-img {\n    height: auto;\n    width: 100vw;\n  }\n\n  body .artwork_piece.height .main-img {\n    height: 100vh;\n    width: auto;\n  }\n}\n\nbody.template-projects header.banner {\n  margin-bottom: 121px;\n}\n\nbody.template-projects .page-header {\n  display: none;\n}\n\n.dev-share-buttons {\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  position: absolute;\n}\n\n.dev-share-buttons a {\n  display: inline-block;\n  padding: 10px;\n  margin: 0 5px;\n}\n\n.dev-share-buttons .link-input-wrap {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  left: 0;\n  position: absolute;\n  width: 100%;\n  top: 40%;\n}\n\n.dev-share-buttons .link-input-wrap input {\n  width: 50%;\n}\n\n.body_text p:last-child {\n  margin-bottom: 0;\n}\n\n#splash-modal {\n  display: block;\n  background-color: #262626;\n  background-size: cover;\n  background-position: center;\n  height: 100vh;\n  left: 0;\n  opacity: 0;\n  position: fixed;\n  top: 0;\n  -webkit-transition-duration: .25s;\n       -o-transition-duration: .25s;\n          transition-duration: .25s;\n  -webkit-transition-property: opacity;\n  -o-transition-property: opacity;\n  transition-property: opacity;\n  width: 100vw;\n  z-index: -1;\n}\n\n#splash-modal:hover {\n  cursor: pointer;\n}\n\n.show-splash #splash-modal {\n  opacity: 1;\n  z-index: 400;\n}\n\n.show-splash-transition #splash-modal {\n  z-index: 400;\n}\n\nheader.banner {\n  margin-bottom: 70px;\n}\n\nheader.banner .container {\n  overflow: auto;\n}\n\nheader.banner .container .brand {\n  background-color: #262626;\n  display: block;\n  height: 117px;\n  line-height: 1em;\n  margin: 0;\n  text-align: center;\n  padding: 4vh 0 9.5vh;\n  font-size: 30px;\n  font-weight: bold;\n  position: static;\n  top: 0;\n  left: 0;\n  width: 100%;\n}\n\nheader.banner .container .brand span {\n  display: block;\n  background: url(\"/app/themes/stone-roberts-anew/dist/images/logo.png\") no-repeat center transparent;\n  height: 88px;\n}\n\nheader.banner .container .nav-primary {\n  z-index: 300;\n}\n\nheader.banner .container .nav-primary .nav {\n  padding: 0;\n}\n\nheader.banner .container .nav-primary .nav li {\n  display: inline-block;\n  list-style-type: none;\n  margin: 0 .3em;\n}\n\n.hamburger {\n  z-index: 307 !important;\n}\n\n.home .hamburger,\n.home .nav-primary {\n  display: none;\n}\n\n.post-main-content figure {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\nbody#tinymce {\n  margin: 12px !important;\n}\n\nbody.front {\n  color: #fff;\n  font-family: \"Whitney SSm A\", \"Whitney SSm B\";\n  font-weight: 400;\n  font-style: normal;\n  line-height: 23px;\n}\n\nbody.front a {\n  color: #fff;\n  text-decoration: none;\n}\n\nbody.front .fullscreen {\n  background: #262626;\n}\n\nbody.front .fullscreen .fullscreen-modal {\n  background-color: rgba(0, 0, 0, 0.8);\n}\n\nbody.front .fullscreen .main > * {\n  margin-bottom: 33px;\n}\n\nbody.front .fullscreen .main .page-header {\n  margin-top: 40px;\n  margin-bottom: 60px;\n}\n\nbody.front .fullscreen .main .page-header h1 {\n  font-size: 18px;\n  letter-spacing: 3.7px;\n}\n\nbody.front .fullscreen .main h1,\nbody.front .fullscreen .main h2,\nbody.front .fullscreen .main h3,\nbody.front .fullscreen .main h4,\nbody.front .fullscreen .main h5 {\n  font-weight: 100;\n  font-size: 14px;\n  letter-spacing: 0.21em;\n  text-transform: uppercase;\n}\n\nbody.front .fullscreen .main .artwork_piece .artwork-meta {\n  margin-top: 10px;\n}\n\nbody.front .fullscreen .main .artwork_piece .artwork-meta .caption p {\n  color: #bcbcbc;\n  font-size: 15px;\n  line-height: 19px;\n}\n\n", "", {"version":3,"sources":["/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/common/_variables.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/main.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/main.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/node_modules/sanitize.css/sanitize.css","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/common/_global.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/main.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_forms.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_wp-classes.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_modal.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_custom-main-navigation.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_audio.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_embed.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_flickity.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_center-scroll-to.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_thumbnails-nav.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_artwork-piece.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_share.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_body-text.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/components/_splash.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/layouts/_header.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/layouts/_posts.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/layouts/_tinymce.scss","/Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/styles/resources/assets/styles/common/_custom-client.scss"],"names":[],"mappings":"AAkBA;;sBChBsB;;ACAtB,sCAAA;;AAGA;;;;;GDMG;;ACEH,0BAAA;;ACbA,gFAAA;;AAEA;gFFkBgF;;AEfhF;;;GFoBG;;AEfH;;;EAGC,6BAAA;EAA8B,OAAA;EAC9B,4BAAA;UAAA,oBAAA;EAAqB,OAAA;CFoBrB;;AEjBD;;;GFsBG;;AEjBH;;EAEC,yBAAA;EAA0B,OAAA;EAC1B,wBAAA;EAAyB,OAAA;CFsBzB;;AEnBD;;;;GFyBG;;AEnBH;EACC,+BAAA;UAAA,uBAAA;EAAwB,OAAA;EACxB,gBAAA;EAAiB,OAAA;EACjB,2BAAA;EAA4B,OAAA;EAC5B,+BAAA;EAAgC,OAAA;CF0BhC;;AEvBD;gFF0BgF;;AEvBhF;;GF2BG;;AEvBH;;;;;;EAMC,eAAA;CF0BA;;AEvBD;;GF2BG;;AEvBH;EACC,UAAA;CF0BA;;AEvBD;;;GF4BG;;AEvBH;EACC,eAAA;EACA,gBAAA;CF0BA;;AEvBD;gFF0BgF;;AEvBhF;;;GF4BG;;AEvBH;;;EAEO,OAAA;EACN,eAAA;CF2BA;;AExBD;;GF4BG;;AExBH;EACC,iBAAA;CF2BA;;AExBD;;;GF6BG;;AExBH;EACC,gCAAA;UAAA,wBAAA;EAAyB,OAAA;EACzB,UAAA;EAAW,OAAA;EACX,kBAAA;EAAmB,OAAA;CF8BnB;;AE3BD;;GF+BG;;AE3BH;;EAEC,iBAAA;CF8BA;;AE3BD;;;GFgCG;;AE3BH;EACC,kCAAA;EAAmC,OAAA;EACnC,eAAA;EAAgB,OAAA;CFgChB;;AE7BD;gFFgCgF;;AE7BhF;;;GFkCG;;AE7BH;EACC,8BAAA;EAA+B,OAAA;EAC/B,sCAAA;EAAuC,OAAA;CFkCvC;;AE/BD;;;GFoCG;;AE/BH;EACC,oBAAA;EAAqB,OAAA;EACrB,2BAAA;EAA4B,OAAA;EAC5B,0CAAA;UAAA,kCAAA;EAAmC,OAAA;CFqCnC;;AElCD;;GFsCG;;AElCH;;EAEC,qBAAA;CFqCA;;AElCD;;GFsCG;;AElCH;;EAEC,oBAAA;CFqCA;;AElCD;;;GFuCG;;AElCH;;;EAGC,kCAAA;EAAmC,OAAA;EACnC,eAAA;EAAgB,OAAA;CFuChB;;AEpCD;;GFwCG;;AEpCH;EACC,mBAAA;CFuCA;;AEpCD;;GFwCG;;AEpCH;EACC,0BAAA;EACA,eAAA;CFuCA;;AEpCD;;GFwCG;;AEpCH;EACC,eAAA;CFuCA;;AEpCD;;;GFyCG;;AEpCH;;EAEC,eAAA;EACA,eAAA;EACA,mBAAA;EACA,yBAAA;CFuCA;;AEpCD;EACC,eAAA;CFuCA;;AEpCD;EACC,WAAA;CFuCA;;AEpCD;;;GFyCG;;AEpCH;EACC,0BAAA;EAA2B,OAAA;EAC3B,eAAA;EAAgB,OAAA;EAChB,kBAAA;CFyCA;;AEtCD;EACC,0BAAA;EAA2B,OAAA;EAC3B,eAAA;EAAgB,OAAA;EAChB,kBAAA;CF2CA;;AExCD;gFF2CgF;;AExChF;;GF4CG;;AExCH;;;;;;EAMC,uBAAA;CF2CA;;AExCD;;GF4CG;;AExCH;;EAEC,sBAAA;CF2CA;;AExCD;;GF4CG;;AExCH;EACC,cAAA;EACA,UAAA;CF2CA;;AExCD;;GF4CG;;AExCH;EACC,mBAAA;CF2CA;;AExCD;;GF4CG;;AExCH;EACC,mBAAA;CF2CA;;AExCD;;GF4CG;;AExCH;EACC,iBAAA;CF2CA;;AExCD;gFF2CgF;;AExChF;;GF4CG;;AExCH;EACC,0BAAA;CF2CA;;AExCD;gFF2CgF;;AExChF;;GF4CG;;AExCH;;;;;EAKC,UAAA;CF2CA;;AExCD;;GF4CG;;AExCH;;;;EAIC,8BAAA;EACA,eAAA;EACA,mBAAA;EACA,qBAAA;CF2CA;;AExCD;;;GF6CG;;AExCH;;EACQ,OAAA;EACP,kBAAA;CF4CA;;AEzCD;;;GF8CG;;AEzCH;;EACS,OAAA;EACR,qBAAA;CF6CA;;AE1CD;;;;GFgDG;;AE1CH;;;;EAIC,2BAAA;EAA4B,OAAA;CF8C5B;;AE3CD;;GF+CG;;AE3CH;;;;EAIC,mBAAA;EACA,WAAA;CF8CA;;AE3CD;;GF+CG;;AE3CH;;;;EAIC,+BAAA;CF8CA;;AE3CD;;;;;GFkDG;;AE3CH;EACC,+BAAA;UAAA,uBAAA;EAAwB,OAAA;EACxB,eAAA;EAAgB,OAAA;EAChB,eAAA;EAAgB,OAAA;EAChB,gBAAA;EAAiB,OAAA;EACjB,WAAA;EAAY,OAAA;EACZ,oBAAA;EAAqB,OAAA;CFoDrB;;AEjDD;;;GFsDG;;AEjDH;EACC,sBAAA;EAAuB,OAAA;EACvB,yBAAA;EAA0B,OAAA;CFsD1B;;AEnDD;;;GFwDG;;AEnDH;EACC,eAAA;EAAgB,OAAA;EAChB,iBAAA;EAAkB,OAAA;CFwDlB;;AErDD;;;GF0DG;;AA3FH;;EEwCC,+BAAA;UAAA,uBAAA;EAAwB,OAAA;EACxB,WAAA;EAAY,OAAA;CF0DZ;;AEvDD;;GF2DG;;AA7FH;;EEwCC,aAAA;CF0DA;;AEvDD;;;GF4DG;;AA/FH;EEyCC,8BAAA;EAA+B,OAAA;EAC/B,qBAAA;EAAsB,OAAA;CF4DtB;;AEzDD;;GF6DG;;AAjGH;;EE0CC,yBAAA;CF4DA;;AEzDD;;;GF8DG;;AEzDH;EACC,2BAAA;EAA4B,OAAA;EAC5B,cAAA;EAAe,OAAA;CF8Df;;AE3DD;gFF8DgF;;AE3DhF;;;GFgEG;;AE3DH;;EAEC,eAAA;CF8DA;;AE3DD;;GF+DG;;AE3DH;EACC,mBAAA;CF8DA;;AE3DD;gFF8DgF;;AE3DhF;;GF+DG;;AE3DH;EACC,sBAAA;CF8DA;;AE3DD;;GF+DG;;AE3DH;EACC,cAAA;CF8DA;;AE3DD;gFF8DgF;;AE3DhF;;;GFgEG;;AE3DH;;;;;;;;;EASC,+BAAA;EAAgC,OAAA;EAChC,2BAAA;CF+DA;;AE5DD;;GFgEG;;AAlHH;EEuDC,cAAA;CF+DA;;AE5DD;gFF+DgF;;AE5DhF;;GFgEG;;AArHH;EE0DC,iBAAA;CF+DA;;AE5DD;;GFgEG;;AAvHH;EE4DC,gBAAA;CF+DA;;AE5DD;;GFgEG;;AAzHH;EE8DC,uBAAA;EACA,iBAAA;EACA,mBAAA;CF+DA;;AE5DD;;;GFiEG;;AA3HH;EEgEC,gBAAA;CF+DA;;AG1oBD,2DAAA;;AACA;;;;;;;;GHqpBG;;AG5oBH;;EAEE,aAAA;EAAc,OAAA;EACd,eAAA;EAAgB,OAAA;CHipBjB;;AG9oBD;EACE,YAAA;CHipBD;;AG9oBD;;;GHmpBG;;AG/oBH;GCwpBE,QDvpBA;CHkpBD;;AG/oBD,oBAAA;;AACA;EACE,eAAA;EACA,iBAAA;EACA,kBAAA;EACA,oBAAA;CHmpBD;;AGhpBD;EACE,iBAAA;EACA,gBAAA;CHmpBD;;AGhpBD;;;;EACE,cAAA;CHspBD;;AGnpBD;EACE,eAAA;EACA,WAAA;CHspBD;;AGppBD;EACE,oBAAA;CHupBD;;AGrpBD;EACE,oBAAA;EACA,iBAAA;CHwpBD;;AG1pBD;EAKI,iBAAA;CHypBH;;AGtpBC;EAEE,0BAAA;CHwpBH;;AD7qBC;EIWF;IAeQ,iBAAA;GHwpBL;CACF;;AGtpBK;EACE,gBAAA;EACA,YAAA;CHypBP;;AG7qBD;EAuBU,UAAA;CH0pBT;;AGhpBC;EACE,qCAAA;EACA,UAAA;EACA,QAAA;EACA,gBAAA;EACA,SAAA;EACA,OAAA;EACA,cAAA;CHmpBH;;AG3rBD;EA6CM,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,6BAAA;EAAA,8BAAA;MAAA,2BAAA;UAAA,uBAAA;EACA,wBAAA;MAAA,qBAAA;UAAA,4BAAA;EACA,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EACA,eAAA;EACA,iBAAA;EACA,WAAA;CHkpBL;;ADhtBC;EIuDE;IAUI,WAAA;GHopBL;CACF;;AG3sBD;EA0DQ,kCAAA;OAAA,6BAAA;UAAA,0BAAA;EACA,qCAAA;EAAA,gCAAA;EAAA,6BAAA;CHqpBP;;AGlpBK;EACE,WAAA;CHqpBP;;AGptBD;EAmEQ,cAAA;CHqpBP;;AG/oBG;EACE,WAAA;CHkpBL;;AKhxBD,kBAAA;;ACAA;;;GNuxBG;;AMlxBH,sBAAA;;AACA;EACE,eAAA;EACA,gBAAA;EACA,gBAAA;EACA,aAAA;CNsxBD;;AMnxBD;EACE,eAAA;EACA,oBAAA;EACA,aAAA;CNsxBD;;AMnxBD;;EAEE,sBAAA;EACA,aAAA;CNsxBD;;AMnxBD;EACE;IACE,YAAA;IACA,qBAAA;GNsxBD;;EMnxBD;IACE,aAAA;IACA,oBAAA;GNsxBD;CACF;;AMnxBD,eAAA;;AAMA,yCAAA;;AACA;EACE,mBAAA;EACA,WAAA;EACA,YAAA;EACA,WAAA;EACA,aAAA;EACA,iBAAA;EACA,uBAAA;EACA,UAAA;EACA,YAAA;EACA,iBAAA;CNmxBD;;AOz0BD;EACE,mBAAA;EACA,aAAA;CP40BD;;AO10BC;EACE,mBAAA;EACA,cAAA;EACA,aAAA;CP60BH;;AO30BG;EACE,gBAAA;EACA,cAAA;EACA,kBAAA;EACA,mBAAA;EACA,8CAAA;OAAA,yCAAA;UAAA,sCAAA;CP80BL;;AO51BD;EAiBQ,mBAAA;EACA,YAAA;EACA,aAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,6BAAA;EAAA,8BAAA;MAAA,2BAAA;UAAA,uBAAA;EACA,yBAAA;MAAA,sBAAA;UAAA,wBAAA;EACA,kBAAA;CP+0BP;;AO70BO;;EACE,+BAAA;CPi1BT;;AO32BD;EA8BU,iJAAA;EACA,aAAA;EACA,WAAA;EACA,YAAA;EACA,iBAAA;EACA,mBAAA;EACA,UAAA;EACA,UAAA;EACA,aAAA;CPi1BT;;AOv3BD;EA0CU,eAAA;EACA,eAAA;CPi1BT;;AQ53BD;EACE,oBAAA;EACA,sCAAA;OAAA,iCAAA;UAAA,8BAAA;EACA,gBAAA;EACA,YAAA;EACA,cAAA;EACA,aAAA;EACA,eAAA;EACA,aAAA;EACA,kBAAA;EACA,gBAAA;EACA,iBAAA;EACA,OAAA;EACA,kCAAA;OAAA,6BAAA;UAAA,0BAAA;EACA,+CAAA;EAAA,uCAAA;EAAA,qCAAA;EAAA,+BAAA;EAAA,gEAAA;CR+3BD;;AQ53BD;EAKE,cAAA;EACA,mCAAA;EACA,cAAA;EACA,eAAA;EACA,kBAAA;EACA,WAAA;CR23BD;;AQz3BC;EACE,eAAA;EACA,aAAA;EACA,kBAAA;EACA,iBAAA;EACA,gBAAA;EACA,YAAA;CR43BH;;AQ94BD;;EAsBM,+BAAA;OAAA,0BAAA;UAAA,uBAAA;EACA,kCAAA;OAAA,6BAAA;UAAA,0BAAA;EACA,+CAAA;EAAA,uCAAA;EAAA,qCAAA;EAAA,+BAAA;EAAA,gEAAA;CR63BL;;AQr5BD;EA4BM,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,6BAAA;EAAA,8BAAA;MAAA,2BAAA;UAAA,uBAAA;EACA,aAAA;CR63BL;;AQ13BG;EACE,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,6BAAA;EAAA,8BAAA;MAAA,2BAAA;UAAA,uBAAA;EACA,oBAAA;MAAA,qBAAA;UAAA,aAAA;EACA,gBAAA;EACA,sBAAA;MAAA,mBAAA;UAAA,0BAAA;EACA,oBAAA;EACA,0BAAA;EACA,sBAAA;CR63BL;;AQt6BD;EA6CM,uBAAA;EACA,eAAA;EACA,oBAAA;MAAA,qBAAA;UAAA,aAAA;EACA,cAAA;EACA,gBAAA;EACA,qBAAA;EACA,YAAA;CR63BL;;AQ13BG;EACE,eAAA;EACA,oBAAA;MAAA,qBAAA;UAAA,aAAA;EACA,kBAAA;CR63BL;;ASv8BD;EACE,iBAAA;EACA,gBAAA;EACA,mBAAA;CT08BD;;AS78BD;;EAOM,+BAAA;EACA,UAAA;EACA,YAAA;EACA,cAAA;EACA,mBAAA;CT28BL;;ASt9BD;;EAcQ,WAAA;CT68BP;;AS18BK;;EACE,YAAA;CT88BP;;ASh+BD;EAuBM,uBAAA;EACA,gBAAA;EACA,oBAAA;EACA,eAAA;EACA,YAAA;CT68BL;;ASx+BD;EAwCM,aAAA;EACA,mBAAA;EACA,YAAA;CTo8BL;;ASl8BK;EACE,0BAAA;EACA,iBAAA;EACA,eAAA;EACA,aAAA;EACA,kBAAA;EACA,SAAA;CTq8BP;;ASv/BD;EAqDU,gCAAA;UAAA,wBAAA;EACA,aAAA;EACA,SAAA;CTs8BT;;ASp8BS;EACE,aAAA;EACA,YAAA;CTu8BX;;ASlgCD;EAkEQ,yCAAA;CTo8BP;;AUtgCD;EACE,mBAAA;EACA,YAAA;CVygCD;;AUvgCC;EACE,iBAAA;EACA,mBAAA;CV0gCH;;AUhhCD;EASM,iBAAA;EACA,eAAA;EACA,aAAA;EACA,YAAA;EACA,mBAAA;EACA,OAAA;EACA,QAAA;EACA,uBAAA;EACA,4BAAA;EACA,WAAA;CV2gCL;;AU7hCD;EAuBI,iBAAA;CV0gCH;;AUjiCD;EA0BM,eAAA;EACA,gBAAA;EACA,kBAAA;CV2gCL;;AUvgCC;EACE,qGAAA;EACA,aAAA;EACA,eAAA;EACA,mBAAA;EACA,YAAA;EACA,aAAA;EACA,OAAA;EACA,QAAA;EACA,WAAA;CV0gCH;;AUvgCC;EA5CF;IA6CI,qBAAA;GV2gCD;CACF;;AUzgCC;EACE;IACE,qBAAA;GV4gCH;;EU1gCG;IACE,gBAAA;GV6gCL;CACF;;AUpgCG;;EACE,cAAA;CVwgCL;;AWxkCD;EACE,iBAAA;EACA,mBAAA;CX2kCD;;AWzkCC;EACE,YAAA;CX4kCH;;AW1kCG;EACE,iBAAA;EACA,YAAA;CX6kCL;;AW3kCK;EACE,iBAAA;EACA,uBAAA;CX8kCP;;AW5kCO;EACE,YAAA;CX+kCT;;AW3kCK;EACE,+BAAA;EACA,UAAA;EACA,YAAA;EACA,UAAA;EACA,WAAA;EACA,mBAAA;EACA,iBAAA;EACA,YAAA;CX8kCP;;AW1mCD;EAqCM,cAAA;EACA,YAAA;EACA,aAAA;CXykCL;;AWrkCG;EA3CJ;IAqDQ,aAAA;GXgkCL;;EWrnCH;IAwDU,aAAA;IACA,YAAA;IACA,iBAAA;GXikCP;CACF;;AW7jCG;EA/DJ;IA6EQ,aAAA;GXojCL;;EWjoCH;IAqFQ,eAAA;GXgjCL;CACF;;AW7iCG;EACE,wBAAA;EACA,eAAA;EACA,SAAA;CXgjCL;;AW5oCD;EA+FQ,WAAA;EACA,YAAA;CXijCP;;AW7iCG;EACE,WAAA;CXgjCL;;AWrpCD;EAwGQ,WAAA;CXijCP;;AWzpCD;EA4GQ,YAAA;CXijCP;;AY7pCD;EACE,gBAAA;EACA,QAAA;EACA,SAAA;EACA,YAAA;CZgqCD;;AYpqCD;EAOI,+BAAA;EACA,aAAA;EACA,YAAA;CZiqCH;;AY1qCD;EAYM,kCAAA;OAAA,6BAAA;UAAA,0BAAA;CZkqCL;;AY9qCD;EAgBM,gBAAA;CZkqCL;;AY7pCG;EACE,mBAAA;CZgqCL;;AYtrCD;EA4BM,mBAAA;CZ8pCL;;Aa1rCD;EACE,qCAAA;EACA,cAAA;EACA,QAAA;EACA,WAAA;EACA,iBAAA;EACA,mBAAA;EACA,gBAAA;EACA,OAAA;EACA,iCAAA;OAAA,4BAAA;UAAA,yBAAA;EACA,wDAAA;EAAA,gDAAA;EAAA,8CAAA;EAAA,wCAAA;EAAA,yEAAA;EACA,aAAA;EACA,aAAA;Cb6rCD;;AazsCD;EAeI,gBAAA;EACA,sBAAA;EACA,YAAA;EACA,YAAA;EACA,mBAAA;EACA,8BAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,yBAAA;MAAA,sBAAA;UAAA,wBAAA;EACA,0BAAA;MAAA,uBAAA;UAAA,oBAAA;Cb8rCH;;AartCD;EA2BI,0BAAA;MAAA,0BAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,oBAAA;MAAA,gBAAA;EACA,yBAAA;MAAA,sBAAA;UAAA,wBAAA;Cb8rCH;;Aa3rCC;EACE,aAAA;EACA,aAAA;EACA,YAAA;Cb8rCH;;Aa3rCC;EACE,aAAA;EACA,YAAA;Cb8rCH;;AavuCD;EA4CM,gBAAA;Cb+rCL;;Aa3uCD;EAiDI,WAAA;EACA,sCAAA;OAAA,iCAAA;UAAA,8BAAA;Cb8rCH;;Aa1rCD;EAME,aAAA;EACA,WAAA;EACA,gBAAA;EACA,YAAA;EACA,iCAAA;OAAA,4BAAA;UAAA,yBAAA;EACA,iCAAA;EAAA,4BAAA;EAAA,yBAAA;EACA,YAAA;EACA,aAAA;CbwrCD;;AarsCD;EAgBI,gBAAA;CbyrCH;;AazsCD;EAqBI,uBAAA;EACA,YAAA;EACA,aAAA;EACA,oBAAA;EACA,YAAA;CbwrCH;;AaprCD;EACE,cAAA;CburCD;;Ac3wCD;EAEE,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,yBAAA;MAAA,sBAAA;UAAA,wBAAA;EACA,4BAAA;EACA,gBAAA;EACA,kBAAA;EACA,mBAAA;EACA,2CAAA;EAAA,sCAAA;EAAA,mCAAA;EACA,kCAAA;OAAA,6BAAA;UAAA,0BAAA;Cd6wCD;;ActxCD;EAkBI,mBAAA;EACA,OAAA;EACA,QAAA;CdwwCH;;Ac5xCD;EAwBI,sBAAA;EACA,iBAAA;EACA,gBAAA;EACA,mBAAA;EACA,mBAAA;EACA,YAAA;CdwwCH;;ActwCG;EACE,eAAA;EACA,mBAAA;EACA,kCAAA;OAAA,6BAAA;UAAA,0BAAA;EACA,YAAA;EACA,WAAA;CdywCL;;Ac7yCD;;EAuCQ,4BAAA;MAAA,yBAAA;UAAA,sBAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,yBAAA;MAAA,sBAAA;UAAA,wBAAA;Cd2wCP;;AcpzCD;EA6CQ,oBAAA;MAAA,qBAAA;UAAA,aAAA;EACA,qBAAA;MAAA,eAAA;EAEA,kBAAA;EAEA,iBAAA;EAEA,kCAAA;OAAA,6BAAA;UAAA,0BAAA;CdwwCP;;AcnwCK;EACE,eAAA;CdswCP;;Ac7vCG;EACE,sBAAA;EACA,iBAAA;EAEA,WAAA;Cd+vCL;;Act0CD;EA0EM,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,iBAAA;EACA,iBAAA;EACA,YAAA;CdgwCL;;Ac70CD;EAgFQ,UAAA;CdiwCP;;Acj1CD;EAoFQ,eAAA;EACA,mBAAA;EACA,SAAA;EACA,oBAAA;MAAA,qBAAA;UAAA,aAAA;EACA,qBAAA;MAAA,eAAA;EACA,iCAAA;OAAA,4BAAA;UAAA,yBAAA;EACA,YAAA;CdiwCP;;Ac31CD;EA4FU,sBAAA;EACA,aAAA;EACA,YAAA;CdmwCT;;Acj2CD;EAgGY,gBAAA;CdqwCX;;Acr2CD;EA0GM,iBAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,QAAA;EACA,UAAA;EACA,WAAA;EACA,gBAAA;EACA,SAAA;EACA,OAAA;EACA,qCAAA;OAAA,gCAAA;UAAA,6BAAA;EACA,iCAAA;OAAA,4BAAA;UAAA,yBAAA;EACA,aAAA;EACA,cAAA;Cd+vCL;;Acp3CD;EAwHQ,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,aAAA;EACA,yBAAA;MAAA,sBAAA;UAAA,wBAAA;EAEA,eAAA;EACA,iBAAA;EACA,WAAA;EACA,YAAA;Cd+vCP;;Ac7vCO;EACE,+BAAA;CdgwCT;;Acn4CD;EAwIQ,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EACA,6BAAA;EAAA,8BAAA;MAAA,2BAAA;UAAA,uBAAA;EACA,oBAAA;MAAA,qBAAA;UAAA,aAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,sBAAA;MAAA,mBAAA;UAAA,0BAAA;EACA,mBAAA;EACA,iBAAA;EAEA,oBAAA;EACA,mBAAA;EACA,QAAA;EACA,WAAA;Cd8vCP;;Acj5CD;EAsJU,qBAAA;MAAA,eAAA;EACA,aAAA;EACA,iBAAA;EACA,gBAAA;EACA,YAAA;Cd+vCT;;Acz5CD;EA8JY,eAAA;EACA,gBAAA;Cd+vCX;;Ac3vCK;EACE,cAAA;EACA,QAAA;EACA,iBAAA;EACA,gBAAA;EACA,qBAAA;KAAA,kBAAA;EACA,mBAAA;EACA,OAAA;EACA,mCAAA;OAAA,8BAAA;UAAA,2BAAA;EACA,2CAAA;EAAA,sCAAA;EAAA,mCAAA;EACA,aAAA;Cd8vCP;;Ac36CD;EAgLQ,eAAA;EACA,mBAAA;EACA,YAAA;EACA,UAAA;EACA,WAAA;Cd+vCP;;Ac7vCO;EACE,gBAAA;CdgwCT;;Acv7CD;EA8LM,mCAAA;OAAA,8BAAA;UAAA,2BAAA;Cd6vCL;;Ac9uCC;EACE,aAAA;EACA,mBAAA;EACA,OAAA;EACA,YAAA;EACA,YAAA;CdivCH;;Ac/uCG;EACE,0BAAA;EACA,mBAAA;EAEA,iBAAA;EACA,gBAAA;EACA,cAAA;EAEA,YAAA;EACA,aAAA;CdgvCL;;Ac78CD;EAiOM,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EACA,0BAAA;EACA,8BAAA;EACA,6BAAA;EACA,sBAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,aAAA;EACA,yBAAA;MAAA,sBAAA;UAAA,wBAAA;EACA,iBAAA;EACA,WAAA;EACA,mBAAA;EACA,kCAAA;OAAA,6BAAA;UAAA,0BAAA;EACA,+EAAA;EAAA,uEAAA;EAAA,qEAAA;EAAA,+DAAA;EAAA,gGAAA;EACA,YAAA;CdgvCL;;Ac99CD;EAgPQ,wBAAA;EAAA,gBAAA;CdkvCP;;Acl+CD;EAoPQ,YAAA;EACA,aAAA;EACA,YAAA;EACA,eAAA;EACA,kCAAA;OAAA,6BAAA;UAAA,0BAAA;EACA,+EAAA;EAAA,uEAAA;EAAA,qEAAA;EAAA,+DAAA;EAAA,gGAAA;CdkvCP;;Ac7uCG;EACE,WAAA;CdgvCL;;Ac/+CD;EAkQQ,oCAAA;EAAA,4BAAA;CdivCP;;Acn/CD;EAsQM,mBAAA;CdivCL;;Acv/CD;EA+QM,YAAA;Cd4uCL;;AczuCG;;EACE,qCAAA;MAAA,kCAAA;UAAA,+BAAA;EACA,UAAA;EACA,wBAAA;EACA,gBAAA;EACA,QAAA;EACA,SAAA;EACA,OAAA;Cd6uCL;;ActgDD;EAqTM,0BAAA;EACA,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EACA,UAAA;EACA,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,0BAAA;MAAA,uBAAA;UAAA,+BAAA;EACA,yBAAA;EACA,WAAA;EACA,gBAAA;EACA,kCAAA;OAAA,6BAAA;UAAA,0BAAA;EACA,kCAAA;EAAA,6BAAA;EAAA,0BAAA;EACA,aAAA;EACA,aAAA;CdqtCL;;AcrhDD;EAmUQ,YAAA;CdstCP;;AcntCK;EACE,YAAA;EACA,aAAA;EACA,YAAA;EACA,oBAAA;EACA,0BAAA;EACA,sBAAA;EACA,aAAA;EACA,kCAAA;OAAA,6BAAA;UAAA,0BAAA;EACA,mBAAA;EACA,WAAA;EACA,aAAA;CdstCP;;AcviDD;EAqVQ,QAAA;EACA,oBAAA;EACA,qBAAA;CdstCP;;AcltCK;EACE,6BAAA;EACA,WAAA;CdqtCP;;AcljDD;EAgWU,mBAAA;CdstCT;;AcltCK;EACE,iBAAA;CdqtCP;;Ac1jDD;;EA2WQ,YAAA;CdotCP;;Ac/jDD;;;EAiXQ,YAAA;CdotCP;;AcrsCK;EACE,UAAA;CdwsCP;;AczkDD;EAmYU,WAAA;Cd0sCT;;Ac7kDD;EA2YM,kCAAA;OAAA,6BAAA;UAAA,0BAAA;CdssCL;;AcvrCG;EACE,sBAAA;Cd0rCL;;AcrlDD;EAgaI,yBAAA;CdyrCH;;AczlDD;EAqaM,iCAAA;CdwrCL;;Ac1qCD;EAEI,aAAA;Cd4qCH;;AcxqCD;EAiBM,WAAA;Cd2pCL;;Ac1pCK;EACE,sBAAA;Cd6pCP;;AchrCD;EAsBU,WAAA;Cd8pCT;;AD5jDG;EACE,iBAAA;EACA,4BAAA;EACA,4BAAA;CC+jDL;;AD7jDG;EACE,eAAA;CCgkDL;;AD7jDK;EACE,aAAA;EACA,aAAA;CCgkDP;;AcnsCD;EfvXQ,cAAA;EACA,YAAA;CC8jDP;;AcxsCD;EA8BM,iBAAA;Cd8qCL;;Ac5sCD;EAmCM,2BAAA;Cd6qCL;;AcrqCK;EACE,WAAA;CdwqCP;;AcjqCC;Ef3bE;IACE,iBAAA;IACA,4BAAA;IACA,4BAAA;GCgmDH;;Ec3tCH;IflYM,eAAA;GCimDH;;Ec/tCH;If9XQ,aAAA;IACA,aAAA;GCimDL;;ED5lDG;IACE,cAAA;IACA,YAAA;GC+lDL;CACF;;AclrCD;EAEI,qBAAA;CdorCH;;ActrCD;EAMI,cAAA;CdorCH;;Ae3qDD;EACE,+BAAA;EAAA,8BAAA;MAAA,wBAAA;UAAA,oBAAA;EACA,yBAAA;MAAA,sBAAA;UAAA,wBAAA;EACA,0BAAA;MAAA,uBAAA;UAAA,oBAAA;EACA,mBAAA;Cf8qDD;;Ae5qDC;EACE,sBAAA;EACA,cAAA;EACA,cAAA;Cf+qDH;;AexrDD;EAaI,qBAAA;EAAA,qBAAA;EAAA,cAAA;EACA,yBAAA;MAAA,sBAAA;UAAA,wBAAA;EACA,QAAA;EACA,mBAAA;EACA,YAAA;EACA,SAAA;Cf+qDH;;AejsDD;EAqBM,WAAA;CfgrDL;;AgBnsDG;EACE,iBAAA;ChBssDL;;AiBzsDD;EACE,eAAA;EACA,0BAAA;EACA,uBAAA;EACA,4BAAA;EACA,cAAA;EACA,QAAA;EACA,WAAA;EACA,gBAAA;EACA,OAAA;EACA,kCAAA;OAAA,6BAAA;UAAA,0BAAA;EACA,qCAAA;EAAA,gCAAA;EAAA,6BAAA;EACA,aAAA;EACA,YAAA;CjB4sDD;;AiBztDD;EAgBI,gBAAA;CjB6sDH;;AiBxsDC;EACE,WAAA;EACA,aAAA;CjB2sDH;;AiBvsDD;EAEI,aAAA;CjBysDH;;AkBpuDD;EACE,oBAAA;ClBuuDD;;AkBxuDD;EAII,eAAA;ClBwuDH;;AkBtuDG;EACE,0BAAA;EACA,eAAA;EACA,cAAA;EACA,iBAAA;EACA,UAAA;EACA,mBAAA;EACA,qBAAA;EACA,gBAAA;EACA,kBAAA;EACA,iBAAA;EACA,OAAA;EACA,QAAA;EACA,YAAA;ClByuDL;;AkBvuDK;EACE,eAAA;EACA,oGAAA;EACA,aAAA;ClB0uDP;;AkBlwDD;EA4BM,aAAA;ClB0uDL;;AkBtwDD;EA8BQ,WAAA;ClB4uDP;;AkB1wDD;EAgCU,sBAAA;EACA,sBAAA;EACA,eAAA;ClB8uDT;;AkBvuDD;EACE,wBAAA;ClB0uDD;;AkBvuDD;;EAEI,cAAA;ClB0uDH;;AmB/wDD;EACE,eAAA;EACA,kBAAA;EACA,mBAAA;CnBkxDD;;AoBjyDD;EACE,wBAAA;CpBoyDD;;AqBpyDD;EACE,YAAA;EACA,8CAAA;EACA,iBAAA;EACA,mBAAA;EACA,kBAAA;CrBuyDD;;AqB5yDD;EAQI,YAAA;EACA,sBAAA;CrBwyDH;;AqBjzDD;EAaI,oBAAA;CrBwyDH;;AqBrzDD;EAgBM,qCAAA;CrByyDL;;AqBzzDD;EAqBQ,oBAAA;CrBwyDP;;AqB7zDD;EAyBQ,iBAAA;EACA,oBAAA;CrBwyDP;;AqBtyDO;EACE,gBAAA;EACA,sBAAA;CrByyDT;;AqBv0DD;;;;;EAmCQ,iBAAA;EACA,gBAAA;EACA,uBAAA;EACA,0BAAA;CrB4yDP;;AqBl1DD;EA2CU,iBAAA;CrB2yDT;;AqBt1DD;EA+Cc,eAAA;EACA,gBAAA;EACA,kBAAA;CrB2yDb","file":"main.scss","sourcesContent":["// Grid settings\n$main-sm-columns: 12;\n$sidebar-sm-columns: 4;\n\n$spacer: 1rem;\n\n// Colors\n$background: #262626;\n$brand-primary: #27ae60;\n\n// Widths\n$mobile-max-width: 767px;\n$desktop-min-width: 768px;\n$main-content-max-width: 600px;\n\n$theme-path: '/app/themes/stone-roberts-anew/dist/';\n$image-path: $theme-path + 'images/';\n\n/*********************\nBREAKPOINTS\n*********************/\n\n$xs: (max: 767px);\n$sm: (min: 768px);\n$md: (min: 992px);\n$lg: (min: 1200px);\n$sm-only: (min: map-get($sm, min), max: map-get($md, min) - 1);\n$md-only: (min: map-get($md, min), max: map-get($lg, min) - 1);\n$lg-only: (min: map-get($lg, min), max: 100000px);\n\n@mixin breakpoint($map) {\n  $query: \"\";\n  @if map-has-key($map, min) {\n    $query: append($query, \"(min-width: #{map-get($map, min)})\")\n  }\n  @if map-has-key($map, min) and map-has-key($map, max) {\n    $query: append($query, \"and\")\n  }\n  @if map-has-key($map, max) {\n    $query: append($query, \"(max-width: #{map-get($map, max)})\")\n  }\n  @media screen and #{$query} {\n    @content;\n  }\n}\n\n// Mixins\n@mixin nonAnimatingMobile {\n  .artwork_piece {\n    .main-img {\n      max-width: 100vw;\n      max-height: none !important;\n      position: static !important;\n    }\n    .artwork-meta{\n      padding: 1.2em;\n    }\n    &.width {\n      .main-img {\n        height: auto;\n        width: 100vw;\n      }\n    }\n\n    &.height {\n      .main-img {\n        height: 100vh;\n        width: auto;\n      }\n    }\n\n  }\n}","/*********************\nBREAKPOINTS\n*********************/\n\n/** Import everything from autoload */\n\n/**\n * Import npm dependencies\n *\n * Prefix your imports with `~` to grab from node_modules/\n * @see https://github.com/webpack-contrib/sass-loader#imports\n */\n\n/** Import theme styles */\n\n@import url(\"https://cloud.typography.com/7063492/6582372/css/fonts.css\");\n\n/*! sanitize.css v5.0.0 | CC0 License | github.com/jonathantneal/sanitize.css */\n\n/* Document (https://html.spec.whatwg.org/multipage/semantics.html#semantics)\n   ========================================================================== */\n\n/**\n * 1. Remove repeating backgrounds in all browsers (opinionated).\n * 2. Add box sizing inheritence in all browsers (opinionated).\n */\n\n*,\n::before,\n::after {\n  background-repeat: no-repeat;\n  /* 1 */\n  box-sizing: inherit;\n  /* 2 */\n}\n\n/**\n * 1. Add text decoration inheritance in all browsers (opinionated).\n * 2. Add vertical alignment inheritence in all browsers (opinionated).\n */\n\n::before,\n::after {\n  text-decoration: inherit;\n  /* 1 */\n  vertical-align: inherit;\n  /* 2 */\n}\n\n/**\n * 1. Add border box sizing in all browsers (opinionated).\n * 2. Add the default cursor in all browsers (opinionated).\n * 3. Prevent font size adjustments after orientation changes in IE and iOS.\n */\n\nhtml {\n  box-sizing: border-box;\n  /* 1 */\n  cursor: default;\n  /* 2 */\n  -ms-text-size-adjust: 100%;\n  /* 3 */\n  -webkit-text-size-adjust: 100%;\n  /* 3 */\n}\n\n/* Sections (https://html.spec.whatwg.org/multipage/semantics.html#sections)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: .67em 0;\n}\n\n/* Grouping content (https://html.spec.whatwg.org/multipage/semantics.html#grouping-content)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain {\n  /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n\n/**\n * Remove the list style on navigation lists in all browsers (opinionated).\n */\n\nnav ol,\nnav ul {\n  list-style: none;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/* Text-level semantics (https://html.spec.whatwg.org/multipage/semantics.html#text-level-semantics)\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent;\n  /* 1 */\n  -webkit-text-decoration-skip: objects;\n  /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  text-decoration: underline dotted;\n  /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ffff00;\n  color: #000000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -.25em;\n}\n\nsup {\n  top: -.5em;\n}\n\n/*\n * Remove the text shadow on text selections (opinionated).\n * 1. Restore the coloring undone by defining the text shadow (opinionated).\n */\n\n::-moz-selection {\n  background-color: #b3d4fc;\n  /* 1 */\n  color: #000000;\n  /* 1 */\n  text-shadow: none;\n}\n\n::selection {\n  background-color: #b3d4fc;\n  /* 1 */\n  color: #000000;\n  /* 1 */\n  text-shadow: none;\n}\n\n/* Embedded content (https://html.spec.whatwg.org/multipage/embedded-content.html#embedded-content)\n   ========================================================================== */\n\n/*\n * Change the alignment on media elements in all browers (opinionated).\n */\n\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n  vertical-align: middle;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Change the fill color to match the text color in all browsers (opinionated).\n */\n\nsvg {\n  fill: currentColor;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Tabular data (https://html.spec.whatwg.org/multipage/tables.html#tables)\n   ========================================================================== */\n\n/**\n * Collapse border spacing\n */\n\ntable {\n  border-collapse: collapse;\n}\n\n/* Forms (https://html.spec.whatwg.org/multipage/forms.html#forms)\n   ========================================================================== */\n\n/**\n * Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  margin: 0;\n}\n\n/**\n * Inherit styling in all browsers (opinionated).\n */\n\nbutton,\ninput,\nselect,\ntextarea {\n  background-color: transparent;\n  color: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */\n}\n\n/**\n * 1. Remove the default vertical scrollbar in IE.\n * 2. Change the resize direction on textareas in all browsers (opinionated).\n */\n\ntextarea {\n  overflow: auto;\n  /* 1 */\n  resize: vertical;\n  /* 2 */\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/* Interactive elements (https://html.spec.whatwg.org/multipage/forms.html#interactive-elements)\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails,\nmenu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting (https://html.spec.whatwg.org/multipage/scripting.html#scripting-3)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* User interaction (https://html.spec.whatwg.org/multipage/interaction.html#editing)\n   ========================================================================== */\n\n/*\n * Remove the tapping delay on clickable elements (opinionated).\n * 1. Remove the tapping delay in IE 10.\n */\n\na,\narea,\nbutton,\ninput,\nlabel,\nselect,\nsummary,\ntextarea,\n[tabindex] {\n  -ms-touch-action: manipulation;\n  /* 1 */\n  touch-action: manipulation;\n}\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}\n\n/* ARIA (https://w3c.github.io/html-aria/)\n   ========================================================================== */\n\n/**\n * Change the cursor on busy elements (opinionated).\n */\n\n[aria-busy=\"true\"] {\n  cursor: progress;\n}\n\n/*\n * Change the cursor on control elements (opinionated).\n */\n\n[aria-controls] {\n  cursor: pointer;\n}\n\n/*\n * Change the display on visually hidden accessible elements (opinionated).\n */\n\n[aria-hidden=\"false\"][hidden]:not(:focus) {\n  clip: rect(0, 0, 0, 0);\n  display: inherit;\n  position: absolute;\n}\n\n/*\n * Change the cursor on disabled, not-editable, or otherwise\n * inoperable elements (opinionated).\n */\n\n[aria-disabled] {\n  cursor: default;\n}\n\n/* eslint-disable selector-pseudo-element-colon-notation */\n\n/**\n * For modern browsers\n * 1. The space content is one way to avoid an Opera bug when the\n *    contenteditable attribute is included anywhere else in the document.\n *    Otherwise it causes space to appear at the top and bottom of elements\n *    that are clearfixed.\n * 2. The use of `table` rather than `block` is only necessary if using\n *    `:before` to contain the top-margins of child elements.\n */\n\n.cf:before,\n.cf:after {\n  content: \" \";\n  /* 1 */\n  display: table;\n  /* 2 */\n}\n\n.cf:after {\n  clear: both;\n}\n\n/**\n * For IE 6/7 only\n * Include this rule to trigger hasLayout and contain floats.\n */\n\n.cf {\n  *zoom: 1;\n}\n\n/* Hide the text. */\n\n.hide-text {\n  display: block;\n  overflow: hidden;\n  text-indent: 100%;\n  white-space: nowrap;\n}\n\nimg {\n  max-height: 100%;\n  max-width: 100%;\n}\n\ntextarea,\ninput,\nbutton,\n.mobile-nav-link {\n  outline: none;\n}\n\n.container {\n  margin: 0 auto;\n  padding: 0;\n}\n\nhtml {\n  background: #262626;\n}\n\nbody.front {\n  background: #262626;\n  overflow: scroll;\n}\n\nbody.front.no-scroll {\n  overflow: hidden;\n}\n\nbody.front .fullscreen {\n  background-color: #262626;\n}\n\n@media screen and (max-width: 767px) {\n  body.front .fullscreen .fullscreen-wrapper {\n    overflow: hidden;\n  }\n}\n\nbody.front .fullscreen .fullscreen-wrapper .wrap.container {\n  max-width: 100%;\n  width: 100%;\n}\n\nbody.front .fullscreen .fullscreen-wrapper .wrap.container > .content {\n  margin: 0;\n}\n\nbody.front #body-overlay {\n  background: rgba(255, 255, 255, 0.5);\n  bottom: 0;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: -300;\n}\n\nbody.front.page-template-template-projects .main {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: center;\n  margin: 0 auto;\n  max-width: 600px;\n  width: 50%;\n}\n\n@media screen and (max-width: 767px) {\n  body.front.page-template-template-projects .main {\n    width: 90%;\n  }\n}\n\nbody.front.page-template-template-projects .main > * {\n  transition-duration: .25s;\n  transition-property: opacity;\n}\n\nbody.front.page-template-template-projects .main.centered-image > *:not(.centered-image-transition-duration) {\n  opacity: 0;\n}\n\nbody.front.page-template-template-projects .main p {\n  margin-top: 0;\n}\n\nbody.front.centered-image #back-to-top {\n  opacity: 0;\n}\n\n/** Search form */\n\n/**\n * WordPress Generated Classes\n * @see http://codex.wordpress.org/CSS#WordPress_Generated_Classes\n */\n\n/** Media alignment */\n\n.alignnone {\n  margin-left: 0;\n  margin-right: 0;\n  max-width: 100%;\n  height: auto;\n}\n\n.aligncenter {\n  display: block;\n  margin: 0.5rem auto;\n  height: auto;\n}\n\n.alignleft,\n.alignright {\n  margin-bottom: 0.5rem;\n  height: auto;\n}\n\n@media (min-width: 30rem) {\n  .alignleft {\n    float: left;\n    margin-right: 0.5rem;\n  }\n\n  .alignright {\n    float: right;\n    margin-left: 0.5rem;\n  }\n}\n\n/** Captions */\n\n/** Text meant only for screen readers */\n\n.screen-reader-text {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n  color: #000;\n  background: #fff;\n}\n\n.modal {\n  max-width: 30000px;\n  width: 100vw;\n}\n\n.modal .modal-dialog {\n  max-width: 30000px;\n  height: 100vh;\n  width: 100vw;\n}\n\n.modal .modal-dialog .modal-content {\n  max-width: 100%;\n  height: 100vh;\n  top: 0 !important;\n  left: 0 !important;\n  transform: translate(0, 0) !important;\n}\n\n.modal .modal-dialog .modal-content .modal-body {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  padding-top: 39px;\n}\n\n.modal .modal-dialog .modal-content .modal-body .video-embed,\n.modal .modal-dialog .modal-content .modal-body .video-embed * {\n  max-height: calc(100vh - 27px);\n}\n\n.modal .modal-dialog .modal-content .modal-body button {\n  background: url(\"/app/themes/stone-roberts-anew/dist/images/closeout-icon-lightgrey.png\") no-repeat center center/contain transparent !important;\n  height: 17px;\n  padding: 0;\n  width: 17px;\n  text-align: left;\n  position: absolute;\n  left: 3px;\n  top: 10px;\n  z-index: 200;\n}\n\n.modal .modal-dialog .modal-content .modal-body iframe {\n  display: block;\n  margin: 0 auto;\n}\n\n.nav-primary {\n  background: #262626;\n  transform: translateY(-100vh);\n  position: fixed;\n  z-index: 19;\n  height: 100vh;\n  width: 100vw;\n  margin: 0 auto;\n  padding: 6vh;\n  max-height: 100vh;\n  max-width: none;\n  overflow: scroll;\n  top: 0;\n  transition-duration: .25s;\n  transition-property: transform;\n}\n\n.custom-nav {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-gap: 3vw;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding: 0;\n}\n\n.custom-nav .list-item {\n  display: block;\n  height: auto;\n  margin: 0 0 1.8em;\n  max-height: none;\n  max-width: none;\n  width: auto;\n}\n\n.custom-nav .list-item:hover .nav-item-image,\n.custom-nav .list-item:active .nav-item-image {\n  transform: scale(1.01);\n  transition-duration: .25s;\n  transition-property: transform;\n}\n\n.custom-nav .list-item .nav-item {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n\n.custom-nav .list-item .nav-item-header {\n  display: flex;\n  flex-direction: column;\n  flex-grow: 1;\n  font-size: 18px;\n  justify-content: flex-end;\n  margin-bottom: 13px;\n  text-transform: uppercase;\n  letter-spacing: 1.1px;\n}\n\n.custom-nav .list-item .nav-item-image {\n  background-size: cover;\n  display: block;\n  flex-grow: 0;\n  height: unset;\n  max-width: 100%;\n  padding-bottom: 100%;\n  width: 100%;\n}\n\n.custom-nav .list-item .nav-item-short-text {\n  display: block;\n  flex-grow: 0;\n  margin-top: 0.4em;\n}\n\n.audio {\n  margin-top: 73px;\n  padding: 0 23px;\n  position: relative;\n}\n\n.audio .audio-piece .duration,\n.audio .audio-piece .timer {\n  background: rgba(0, 0, 0, 0.5);\n  bottom: 0;\n  color: #fff;\n  padding: .5em;\n  position: absolute;\n}\n\n.audio .audio-piece .duration.timer,\n.audio .audio-piece .timer.timer {\n  left: -2em;\n}\n\n.audio .audio-piece .duration.duration,\n.audio .audio-piece .timer.duration {\n  right: -2em;\n}\n\n.audio .audio-piece button {\n  background-color: gray;\n  border: 0 solid;\n  border-radius: .1em;\n  padding: 1.2em;\n  color: #fff;\n}\n\n.audio .audio-piece .span-value-wrap {\n  height: 50px;\n  position: relative;\n  width: 100%;\n}\n\n.audio .audio-piece .span-value-wrap .span-value {\n  background-color: #646464;\n  border-radius: 0;\n  display: block;\n  height: 100%;\n  overflow: visible;\n  width: 0;\n}\n\n.audio .audio-piece .span-value-wrap .span-value .span-value-jump {\n  box-sizing: content-box;\n  height: 100%;\n  width: 0;\n}\n\n.audio .audio-piece .span-value-wrap .span-value .span-value-jump div {\n  height: 100%;\n  width: 100%;\n}\n\n.audio .audio-piece .span-value-wrap:hover .span-value-jump div {\n  background-color: rgba(79, 105, 61, 0.5);\n}\n\n.video {\n  position: relative;\n  width: 100%;\n}\n\n.video .wrap {\n  overflow: hidden;\n  position: relative;\n}\n\n.video .wrap .video-play-screenshot {\n  overflow: hidden;\n  display: block;\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background-size: cover;\n  background-position: center;\n  z-index: 1;\n}\n\n.video .caption {\n  margin-top: 10px;\n}\n\n.video .caption p {\n  color: #bcbcbc;\n  font-size: 15px;\n  line-height: 19px;\n}\n\n.video .play-button {\n  background: url(\"/app/themes/stone-roberts-anew/dist/images/play.svg\") no-repeat 50%/28% transparent;\n  border: none;\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  z-index: 2;\n}\n\n@media screen and (max-width: 767px) {\n  .video {\n    background-size: 22%;\n  }\n}\n\n@media screen and (min-width: 768px) {\n  .video .play-button {\n    background-size: 20%;\n  }\n\n  .video .play-button:hover {\n    cursor: pointer;\n  }\n}\n\n.video.playing .play-button,\n.video.playing .video-play-screenshot {\n  display: none;\n}\n\n.carousel-wrap {\n  overflow: hidden;\n  position: relative;\n}\n\n.carousel-wrap .carousel {\n  width: 100%;\n}\n\n.carousel-wrap .carousel .carousel-cell {\n  max-width: 100vw;\n  width: 100%;\n}\n\n.carousel-wrap .carousel .carousel-cell figure {\n  margin-bottom: 0;\n  width: 100% !important;\n}\n\n.carousel-wrap .carousel .carousel-cell figure img {\n  width: 100%;\n}\n\n.carousel-wrap .carousel .carousel-cell .text {\n  background: rgba(0, 0, 0, 0.5);\n  bottom: 0;\n  color: #fff;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  text-align: left;\n  width: 100%;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button {\n  display: none;\n  width: 55px;\n  height: 77px;\n}\n\n@media screen and (min-width: 768px) {\n  .carousel-wrap .carousel .flickity-page-dots {\n    bottom: 45px;\n  }\n\n  .carousel-wrap .carousel .flickity-page-dots .dot {\n    height: 13px;\n    width: 13px;\n    background: #fff;\n  }\n}\n\n@media screen and (min-width: 1024px) {\n  .carousel-wrap .carousel .flickity-page-dots {\n    bottom: 59px;\n  }\n\n  .carousel-wrap .carousel .flickity-prev-next-button {\n    display: block;\n  }\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button {\n  background: transparent;\n  display: block;\n  top: 72%;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button path {\n  fill: #fff;\n  opacity: .4;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button {\n  top: 73.2%;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button.previous {\n  left: 31px;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button.next {\n  right: 20px;\n}\n\n.center-scroll-arrows {\n  position: fixed;\n  left: 0;\n  top: 50%;\n  z-index: 50;\n}\n\n.center-scroll-arrows div {\n  background: rgba(0, 0, 0, 0.8);\n  height: 20px;\n  width: 20px;\n}\n\n.center-scroll-arrows div.next {\n  transform: rotate(180deg);\n}\n\n.center-scroll-arrows div:hover {\n  cursor: pointer;\n}\n\n.center-scroll-arrows.hide-next .next {\n  visibility: hidden;\n}\n\n.center-scroll-arrows.hide-previous .prev {\n  visibility: hidden;\n}\n\n#thumbnails-nav {\n  background-color: rgba(0, 0, 0, 0.9);\n  height: 100vh;\n  left: 0;\n  opacity: 1;\n  overflow: scroll;\n  padding: 0 4vw 8vw;\n  position: fixed;\n  top: 0;\n  transition-duration: .1s;\n  transition-property: transform, opacity;\n  width: 100vw;\n  z-index: 300;\n}\n\n#thumbnails-nav h1 {\n  font-size: 18px;\n  letter-spacing: 3.7px;\n  height: 8vw;\n  width: 100%;\n  text-align: center;\n  margin: 0 0 -2vh 0 !important;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n#thumbnails-nav .thumbnails-wrap {\n  align-content: flex-start;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n}\n\n#thumbnails-nav .thumbnail-wrap {\n  height: 21vw;\n  padding: 2vh;\n  width: auto;\n}\n\n#thumbnails-nav .thumbnail {\n  height: 100%;\n  width: auto;\n}\n\n#thumbnails-nav .thumbnail:hover {\n  cursor: pointer;\n}\n\n#thumbnails-nav.hide {\n  opacity: 0;\n  transform: translateX(-100vw);\n}\n\n#thumbnail-trigger {\n  height: 26px;\n  left: 10px;\n  position: fixed;\n  bottom: 8px;\n  transition-duration: .1s;\n  transition-property: top;\n  width: 39px;\n  z-index: 301;\n}\n\n#thumbnail-trigger:hover {\n  cursor: pointer;\n}\n\n#thumbnail-trigger > div {\n  background-color: #fff;\n  float: left;\n  height: 10px;\n  margin: 0 3px 3px 0;\n  width: 10px;\n}\n\nbody:not(.template-projects) #thumbnail-trigger {\n  display: none;\n}\n\n.artwork_piece {\n  display: flex;\n  justify-content: center;\n  max-width: 100vw !important;\n  min-width: 100%;\n  padding-top: 55px;\n  position: relative;\n  transition-property: width, height;\n  transition-duration: 0.5s;\n}\n\n.artwork_piece h3 {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.artwork_piece .image-wrap {\n  display: inline-block;\n  max-height: 100%;\n  max-width: 100%;\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder {\n  margin: 0 auto;\n  position: relative;\n  transition-duration: 0.5s;\n  width: 100%;\n  z-index: 2;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder .center-image-wrap,\n.artwork_piece .image-wrap .image-space-placeholder .zoomy-wrap {\n  align-items: baseline;\n  display: flex;\n  justify-content: center;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder .main-img {\n  flex-grow: 0;\n  flex-shrink: 0;\n  max-height: 100vh;\n  position: static;\n  transition-duration: 0.5s;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder .artwork-image-wrap {\n  margin: 0 auto;\n}\n\n.artwork_piece .image-wrap .caption {\n  display: inline-block;\n  margin-right: 1%;\n  width: 81%;\n}\n\n.artwork_piece .image-wrap .artwork-meta {\n  display: flex;\n  position: static;\n  text-align: left;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .artwork-meta .caption p {\n  margin: 0;\n}\n\n.artwork_piece .image-wrap .artwork-meta .actions {\n  display: block;\n  position: absolute;\n  right: 0;\n  flex-grow: 0;\n  flex-shrink: 0;\n  transition-duration: .5s;\n  z-index: 20;\n}\n\n.artwork_piece .image-wrap .artwork-meta .actions div {\n  display: inline-block;\n  height: 30px;\n  width: 30px;\n}\n\n.artwork_piece .image-wrap .artwork-meta .actions div:hover {\n  cursor: pointer;\n}\n\n.artwork_piece .image-wrap .piece-comparison {\n  background: #fff;\n  display: flex;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  transform: translateY(110vh);\n  transition-duration: .5s;\n  z-index: 400;\n  height: 100vh;\n}\n\n.artwork_piece .image-wrap .piece-comparison .piece-comparison-wrap {\n  align-items: center;\n  display: flex;\n  height: 100%;\n  justify-content: center;\n  margin: 0 auto;\n  overflow: hidden;\n  padding: 0;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .piece-comparison .piece-comparison-wrap.piece-comparison-processed {\n  visibility: visible !important;\n}\n\n.artwork_piece .image-wrap .piece-comparison .comparison-image-wrap {\n  align-items: center;\n  flex-direction: column;\n  flex-grow: 0;\n  display: flex;\n  justify-content: flex-end;\n  margin-bottom: 29%;\n  max-height: 100%;\n  padding-bottom: 3vh;\n  position: absolute;\n  top: 4%;\n  z-index: 1;\n}\n\n.artwork_piece .image-wrap .piece-comparison .comparison-image-wrap .comparison-image {\n  flex-shrink: 1;\n  height: auto;\n  max-height: none;\n  max-width: none;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .piece-comparison .comparison-image-wrap .info-text p {\n  color: #0f0f0f;\n  display: inline;\n}\n\n.artwork_piece .image-wrap .piece-comparison .compared-to {\n  height: 100vh;\n  left: 0;\n  max-height: none;\n  max-width: none;\n  object-fit: cover;\n  position: absolute;\n  top: 0;\n  transition-duration: 250ms;\n  transition-property: width, height;\n  width: 100vw;\n}\n\n.artwork_piece .image-wrap .piece-comparison .close {\n  color: #0f0f0f;\n  position: absolute;\n  right: 20px;\n  top: 20px;\n  z-index: 5;\n}\n\n.artwork_piece .image-wrap .piece-comparison .close:hover {\n  cursor: pointer;\n}\n\n.artwork_piece.show-info .piece-comparison {\n  transform: translateY(0vh);\n}\n\n.artwork_piece .zoomy-wrap {\n  height: 100%;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 10;\n}\n\n.artwork_piece .zoomy-wrap .zoom-img {\n  background-color: #0f0f0f;\n  position: absolute;\n  max-height: none;\n  max-width: none;\n  padding: 10px;\n  width: 150%;\n  height: auto;\n}\n\n.artwork_piece .zoomy-wrap .mouse-map-wrap {\n  align-items: center;\n  background-color: #1c1c1c;\n  background-origin: border-box;\n  background-repeat: no-repeat;\n  background-size: 100%;\n  display: flex;\n  height: 100%;\n  justify-content: center;\n  overflow: hidden;\n  opacity: 0;\n  position: relative;\n  transition-duration: 0.5s;\n  transition-property: transform, background-size, width, height;\n  width: 100%;\n}\n\n.artwork_piece .zoomy-wrap .mouse-map-wrap[zoom-enabled]:hover {\n  cursor: zoom-in;\n}\n\n.artwork_piece .zoomy-wrap .mouse-map-wrap .mouse-map {\n  opacity: .4;\n  height: 100%;\n  width: 100%;\n  margin: 0 auto;\n  transition-duration: 0.5s;\n  transition-property: transform, background-size, width, height;\n}\n\n.artwork_piece.zoomed .mouse-map-wrap {\n  opacity: 1;\n}\n\n.artwork_piece.zoomed .mouse-map-wrap:hover {\n  cursor: zoom-out !important;\n}\n\n.artwork_piece.zoomed .main-img {\n  visibility: hidden;\n}\n\n.artwork_piece.centered .image-space-placeholder {\n  z-index: 50;\n}\n\n.artwork_piece.centered .center-image-wrap,\n.artwork_piece.centered .zoomy-wrap {\n  align-items: center !important;\n  bottom: 0;\n  height: auto !important;\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n}\n\n.artwork_piece.centered .artwork-meta {\n  background-color: #1a1a1a;\n  align-items: center;\n  bottom: 0;\n  display: flex;\n  justify-content: space-between;\n  left: calc(100vw - 40px);\n  padding: 0;\n  position: fixed;\n  transition-duration: 0.5s;\n  transition-property: left;\n  width: 100vw;\n  z-index: 302;\n}\n\n.artwork_piece.centered .artwork-meta .artwork_piece {\n  width: auto;\n}\n\n.artwork_piece.centered .artwork-meta:before {\n  content: '';\n  height: 30px;\n  width: 30px;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  display: inline-block;\n  padding: 3px;\n  transform: rotate(135deg);\n  position: absolute;\n  left: 12px;\n  bottom: 14px;\n}\n\n.artwork_piece.centered .artwork-meta:hover {\n  left: 0;\n  padding-left: 1.2em;\n  padding-right: 1.2em;\n}\n\n.artwork_piece.centered .artwork-meta .caption {\n  padding: 20px 20px 20px 41px;\n  width: 81%;\n}\n\n.artwork_piece.centered .artwork-meta .caption p {\n  text-align: center;\n}\n\n.artwork_piece.centered .artwork-meta .actions {\n  position: static;\n}\n\n.artwork_piece.centered.width .image-space-placeholder,\n.artwork_piece.centered.width .image-ratio-holder {\n  width: 100%;\n}\n\n.artwork_piece.centered.height .image-wrap,\n.artwork_piece.centered.height .image-space-placeholder,\n.artwork_piece.centered.height .image-ratio-holder {\n  width: 100%;\n}\n\n.artwork_piece:not(.zoomed) .artwork-meta:hover {\n  bottom: 0;\n}\n\n.artwork_piece:not(.zoomed) .artwork-meta:hover .caption p {\n  opacity: 1;\n}\n\n.artwork_piece.centered-image-transition-duration .main-img {\n  transition-duration: 0.5s;\n}\n\n.artwork_piece.zoomed-delay .mouse-map-wrap {\n  opacity: 1 !important;\n}\n\n.artwork_piece .actions .zoom {\n  display: none !important;\n}\n\n.artwork_piece[zoom-enabled] .actions .zoom {\n  display: inline-block !important;\n}\n\nbody.artworks-processed .artwork_piece {\n  width: 100vw;\n}\n\nbody.centered-image .main > * {\n  opacity: 0;\n}\n\nbody.centered-image .main > *.centered {\n  opacity: 1 !important;\n}\n\nbody.centered-image .main > *.centered h3 {\n  opacity: 0;\n}\n\nbody.is-touch .artwork_piece .main-img {\n  max-width: 100vw;\n  max-height: none !important;\n  position: static !important;\n}\n\nbody.is-touch .artwork_piece .artwork-meta {\n  padding: 1.2em;\n}\n\nbody.is-touch .artwork_piece.width .main-img {\n  height: auto;\n  width: 100vw;\n}\n\nbody.is-touch .artwork_piece.height .main-img {\n  height: 100vh;\n  width: auto;\n}\n\nbody.is-touch.zoomed {\n  overflow: hidden;\n}\n\nbody.viewport-resizing .artwork_piece {\n  max-width: 100% !important;\n}\n\nbody.orientation-landscape.zoomed .artwork-meta {\n  z-index: 0;\n}\n\n@media screen and (max-width: 630px) {\n  body .artwork_piece .main-img {\n    max-width: 100vw;\n    max-height: none !important;\n    position: static !important;\n  }\n\n  body .artwork_piece .artwork-meta {\n    padding: 1.2em;\n  }\n\n  body .artwork_piece.width .main-img {\n    height: auto;\n    width: 100vw;\n  }\n\n  body .artwork_piece.height .main-img {\n    height: 100vh;\n    width: auto;\n  }\n}\n\nbody.template-projects header.banner {\n  margin-bottom: 121px;\n}\n\nbody.template-projects .page-header {\n  display: none;\n}\n\n.dev-share-buttons {\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n}\n\n.dev-share-buttons a {\n  display: inline-block;\n  padding: 10px;\n  margin: 0 5px;\n}\n\n.dev-share-buttons .link-input-wrap {\n  display: flex;\n  justify-content: center;\n  left: 0;\n  position: absolute;\n  width: 100%;\n  top: 40%;\n}\n\n.dev-share-buttons .link-input-wrap input {\n  width: 50%;\n}\n\n.body_text p:last-child {\n  margin-bottom: 0;\n}\n\n#splash-modal {\n  display: block;\n  background-color: #262626;\n  background-size: cover;\n  background-position: center;\n  height: 100vh;\n  left: 0;\n  opacity: 0;\n  position: fixed;\n  top: 0;\n  transition-duration: .25s;\n  transition-property: opacity;\n  width: 100vw;\n  z-index: -1;\n}\n\n#splash-modal:hover {\n  cursor: pointer;\n}\n\n.show-splash #splash-modal {\n  opacity: 1;\n  z-index: 400;\n}\n\n.show-splash-transition #splash-modal {\n  z-index: 400;\n}\n\nheader.banner {\n  margin-bottom: 70px;\n}\n\nheader.banner .container {\n  overflow: auto;\n}\n\nheader.banner .container .brand {\n  background-color: #262626;\n  display: block;\n  height: 117px;\n  line-height: 1em;\n  margin: 0;\n  text-align: center;\n  padding: 4vh 0 9.5vh;\n  font-size: 30px;\n  font-weight: bold;\n  position: static;\n  top: 0;\n  left: 0;\n  width: 100%;\n}\n\nheader.banner .container .brand span {\n  display: block;\n  background: url(\"/app/themes/stone-roberts-anew/dist/images/logo.png\") no-repeat center transparent;\n  height: 88px;\n}\n\nheader.banner .container .nav-primary {\n  z-index: 300;\n}\n\nheader.banner .container .nav-primary .nav {\n  padding: 0;\n}\n\nheader.banner .container .nav-primary .nav li {\n  display: inline-block;\n  list-style-type: none;\n  margin: 0 .3em;\n}\n\n.hamburger {\n  z-index: 307 !important;\n}\n\n.home .hamburger,\n.home .nav-primary {\n  display: none;\n}\n\n.post-main-content figure {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\nbody#tinymce {\n  margin: 12px !important;\n}\n\nbody.front {\n  color: #fff;\n  font-family: \"Whitney SSm A\", \"Whitney SSm B\";\n  font-weight: 400;\n  font-style: normal;\n  line-height: 23px;\n}\n\nbody.front a {\n  color: #fff;\n  text-decoration: none;\n}\n\nbody.front .fullscreen {\n  background: #262626;\n}\n\nbody.front .fullscreen .fullscreen-modal {\n  background-color: rgba(0, 0, 0, 0.8);\n}\n\nbody.front .fullscreen .main > * {\n  margin-bottom: 33px;\n}\n\nbody.front .fullscreen .main .page-header {\n  margin-top: 40px;\n  margin-bottom: 60px;\n}\n\nbody.front .fullscreen .main .page-header h1 {\n  font-size: 18px;\n  letter-spacing: 3.7px;\n}\n\nbody.front .fullscreen .main h1,\nbody.front .fullscreen .main h2,\nbody.front .fullscreen .main h3,\nbody.front .fullscreen .main h4,\nbody.front .fullscreen .main h5 {\n  font-weight: 100;\n  font-size: 14px;\n  letter-spacing: 0.21em;\n  text-transform: uppercase;\n}\n\nbody.front .fullscreen .main .artwork_piece .artwork-meta {\n  margin-top: 10px;\n}\n\nbody.front .fullscreen .main .artwork_piece .artwork-meta .caption p {\n  color: #bcbcbc;\n  font-size: 15px;\n  line-height: 19px;\n}\n\n","@import \"common/variables\";\n\n/** Import everything from autoload */\n;\n\n/**\n * Import npm dependencies\n *\n * Prefix your imports with `~` to grab from node_modules/\n * @see https://github.com/webpack-contrib/sass-loader#imports\n */\n// @import \"~some-node-module\";\n\n/** Import theme styles */\n@import url('https://cloud.typography.com/7063492/6582372/css/fonts.css');\n@import \"~sanitize.css\";\n@import \"common/global\";\n@import \"components/buttons\";\n@import \"components/comments\";\n@import \"components/forms\";\n@import \"components/wp-classes\";\n@import \"components/modal\";\n@import \"components/custom-main-navigation\";\n@import \"components/audio\";\n@import \"components/embed\";\n@import \"components/flickity\";\n@import \"components/center-scroll-to\";\n@import \"components/thumbnails-nav\";\n@import \"components/artwork-piece\";\n@import \"components/share\";\n@import \"components/body-text\";\n@import \"components/splash\";\n@import \"layouts/header\";\n@import \"layouts/sidebar\";\n@import \"layouts/footer\";\n@import \"layouts/pages\";\n@import \"layouts/posts\";\n@import \"layouts/tinymce\";\n@import \"common/custom-client\";","/*! sanitize.css v5.0.0 | CC0 License | github.com/jonathantneal/sanitize.css */\n\n/* Document (https://html.spec.whatwg.org/multipage/semantics.html#semantics)\n   ========================================================================== */\n\n/**\n * 1. Remove repeating backgrounds in all browsers (opinionated).\n * 2. Add box sizing inheritence in all browsers (opinionated).\n */\n\n*,\n::before,\n::after {\n\tbackground-repeat: no-repeat; /* 1 */\n\tbox-sizing: inherit; /* 2 */\n}\n\n/**\n * 1. Add text decoration inheritance in all browsers (opinionated).\n * 2. Add vertical alignment inheritence in all browsers (opinionated).\n */\n\n::before,\n::after {\n\ttext-decoration: inherit; /* 1 */\n\tvertical-align: inherit; /* 2 */\n}\n\n/**\n * 1. Add border box sizing in all browsers (opinionated).\n * 2. Add the default cursor in all browsers (opinionated).\n * 3. Prevent font size adjustments after orientation changes in IE and iOS.\n */\n\nhtml {\n\tbox-sizing: border-box; /* 1 */\n\tcursor: default; /* 2 */\n\t-ms-text-size-adjust: 100%; /* 3 */\n\t-webkit-text-size-adjust: 100%; /* 3 */\n}\n\n/* Sections (https://html.spec.whatwg.org/multipage/semantics.html#sections)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n\tdisplay: block;\n}\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n\tmargin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n\tfont-size: 2em;\n\tmargin: .67em 0;\n}\n\n/* Grouping content (https://html.spec.whatwg.org/multipage/semantics.html#grouping-content)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain { /* 1 */\n\tdisplay: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n\tmargin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n\tbox-sizing: content-box; /* 1 */\n\theight: 0; /* 1 */\n\toverflow: visible; /* 2 */\n}\n\n/**\n * Remove the list style on navigation lists in all browsers (opinionated).\n */\n\nnav ol,\nnav ul {\n\tlist-style: none;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n\tfont-family: monospace, monospace; /* 1 */\n\tfont-size: 1em; /* 2 */\n}\n\n/* Text-level semantics (https://html.spec.whatwg.org/multipage/semantics.html#text-level-semantics)\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n\tbackground-color: transparent; /* 1 */\n\t-webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n\tborder-bottom: none; /* 1 */\n\ttext-decoration: underline; /* 2 */\n\ttext-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n\tfont-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n\tfont-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n\tfont-family: monospace, monospace; /* 1 */\n\tfont-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n\tfont-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n\tbackground-color: #ffff00;\n\tcolor: #000000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n\tfont-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n\tfont-size: 75%;\n\tline-height: 0;\n\tposition: relative;\n\tvertical-align: baseline;\n}\n\nsub {\n\tbottom: -.25em;\n}\n\nsup {\n\ttop: -.5em;\n}\n\n/*\n * Remove the text shadow on text selections (opinionated).\n * 1. Restore the coloring undone by defining the text shadow (opinionated).\n */\n\n::-moz-selection {\n\tbackground-color: #b3d4fc; /* 1 */\n\tcolor: #000000; /* 1 */\n\ttext-shadow: none;\n}\n\n::selection {\n\tbackground-color: #b3d4fc; /* 1 */\n\tcolor: #000000; /* 1 */\n\ttext-shadow: none;\n}\n\n/* Embedded content (https://html.spec.whatwg.org/multipage/embedded-content.html#embedded-content)\n   ========================================================================== */\n\n/*\n * Change the alignment on media elements in all browers (opinionated).\n */\n\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n\tvertical-align: middle;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n\tdisplay: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n\tdisplay: none;\n\theight: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n\tborder-style: none;\n}\n\n/**\n * Change the fill color to match the text color in all browsers (opinionated).\n */\n\nsvg {\n\tfill: currentColor;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n\toverflow: hidden;\n}\n\n/* Tabular data (https://html.spec.whatwg.org/multipage/tables.html#tables)\n   ========================================================================== */\n\n/**\n * Collapse border spacing\n */\n\ntable {\n\tborder-collapse: collapse;\n}\n\n/* Forms (https://html.spec.whatwg.org/multipage/forms.html#forms)\n   ========================================================================== */\n\n/**\n * Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n\tmargin: 0;\n}\n\n/**\n * Inherit styling in all browsers (opinionated).\n */\n\nbutton,\ninput,\nselect,\ntextarea {\n\tbackground-color: transparent;\n\tcolor: inherit;\n\tfont-size: inherit;\n\tline-height: inherit;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n\toverflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n\ttext-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"], /* 1 */\n[type=\"reset\"],\n[type=\"submit\"] {\n\t-webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n\tborder-style: none;\n\tpadding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n\toutline: 1px dotted ButtonText;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n\tbox-sizing: border-box; /* 1 */\n\tcolor: inherit; /* 2 */\n\tdisplay: table; /* 1 */\n\tmax-width: 100%; /* 1 */\n\tpadding: 0; /* 3 */\n\twhite-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n\tdisplay: inline-block; /* 1 */\n\tvertical-align: baseline; /* 2 */\n}\n\n/**\n * 1. Remove the default vertical scrollbar in IE.\n * 2. Change the resize direction on textareas in all browsers (opinionated).\n */\n\ntextarea {\n\toverflow: auto; /* 1 */\n\tresize: vertical; /* 2 */\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n\tbox-sizing: border-box; /* 1 */\n\tpadding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n\theight: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n\t-webkit-appearance: textfield; /* 1 */\n\toutline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n\t-webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n\t-webkit-appearance: button; /* 1 */\n\tfont: inherit; /* 2 */\n}\n\n/* Interactive elements (https://html.spec.whatwg.org/multipage/forms.html#interactive-elements)\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails, /* 1 */\nmenu {\n\tdisplay: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n\tdisplay: list-item;\n}\n\n/* Scripting (https://html.spec.whatwg.org/multipage/scripting.html#scripting-3)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n\tdisplay: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n\tdisplay: none;\n}\n\n/* User interaction (https://html.spec.whatwg.org/multipage/interaction.html#editing)\n   ========================================================================== */\n\n/*\n * Remove the tapping delay on clickable elements (opinionated).\n * 1. Remove the tapping delay in IE 10.\n */\n\na,\narea,\nbutton,\ninput,\nlabel,\nselect,\nsummary,\ntextarea,\n[tabindex] {\n\t-ms-touch-action: manipulation; /* 1 */\n\ttouch-action: manipulation;\n}\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n\tdisplay: none;\n}\n\n/* ARIA (https://w3c.github.io/html-aria/)\n   ========================================================================== */\n\n/**\n * Change the cursor on busy elements (opinionated).\n */\n\n[aria-busy=\"true\"] {\n\tcursor: progress;\n}\n\n/*\n * Change the cursor on control elements (opinionated).\n */\n\n[aria-controls] {\n\tcursor: pointer;\n}\n\n/*\n * Change the display on visually hidden accessible elements (opinionated).\n */\n\n[aria-hidden=\"false\"][hidden]:not(:focus) {\n\tclip: rect(0, 0, 0, 0);\n\tdisplay: inherit;\n\tposition: absolute;\n}\n\n/*\n * Change the cursor on disabled, not-editable, or otherwise\n * inoperable elements (opinionated).\n */\n\n[aria-disabled] {\n\tcursor: default;\n}\n","/* eslint-disable selector-pseudo-element-colon-notation */\n/**\n * For modern browsers\n * 1. The space content is one way to avoid an Opera bug when the\n *    contenteditable attribute is included anywhere else in the document.\n *    Otherwise it causes space to appear at the top and bottom of elements\n *    that are clearfixed.\n * 2. The use of `table` rather than `block` is only necessary if using\n *    `:before` to contain the top-margins of child elements.\n */\n.cf:before,\n.cf:after {\n  content: \" \"; /* 1 */\n  display: table; /* 2 */\n}\n\n.cf:after {\n  clear: both;\n}\n\n/**\n * For IE 6/7 only\n * Include this rule to trigger hasLayout and contain floats.\n */\n.cf {\n  *zoom: 1;\n}\n\n/* Hide the text. */\n.hide-text {\n  display: block;\n  overflow: hidden;\n  text-indent: 100%;\n  white-space: nowrap;\n}\n\nimg {\n  max-height: 100%;\n  max-width: 100%;\n}\n\ntextarea, input, button, .mobile-nav-link {\n  outline: none;\n}\n\n.container {\n  margin: 0 auto;\n  padding: 0;\n}\nhtml{\n  background: $background;\n}\nbody.front {\n  background: $background;\n  overflow: scroll;\n\n  &.no-scroll {\n    overflow: hidden;\n  }\n\n  .fullscreen {\n    //background: transparent;\n    background-color: $background;\n    //transition-duration: .75s;\n\n    .fullscreen-wrapper {\n      @include breakpoint($xs) {\n        overflow: hidden;\n      }\n\n      .wrap.container {\n        max-width: 100%;\n        width: 100%;\n\n        > .content {\n          margin: 0;\n\n          .main {\n\n          }\n        }\n      }\n    }\n  }\n\n  #body-overlay {\n    background: rgba(255, 255, 255, .5);\n    bottom: 0;\n    left: 0;\n    position: fixed;\n    right: 0;\n    top: 0;\n    z-index: -300\n  }\n\n  &.page-template-template-projects {\n    .main {\n      display: flex;\n      flex-direction: column;\n      justify-content: flex-start;\n      align-items: center;\n      margin: 0 auto;\n      max-width: $main-content-max-width;\n      width: 50%;\n\n      @include breakpoint($xs) {\n        width: 90%;\n      }\n\n      > * {\n        transition-duration: .25s;\n        transition-property: opacity;\n      }\n\n      &.centered-image > *:not(.centered-image-transition-duration) {\n        opacity: 0;\n      }\n\n      p {\n        margin-top: 0;\n      }\n    }\n  }\n\n  &.centered-image {\n    #back-to-top {\n      opacity: 0;\n    }\n  }\n}\n","/*********************\nBREAKPOINTS\n*********************/\n\n/** Import everything from autoload */\n\n/**\n * Import npm dependencies\n *\n * Prefix your imports with `~` to grab from node_modules/\n * @see https://github.com/webpack-contrib/sass-loader#imports\n */\n\n/** Import theme styles */\n\n@import url(\"https://cloud.typography.com/7063492/6582372/css/fonts.css\");\n\n/*! sanitize.css v5.0.0 | CC0 License | github.com/jonathantneal/sanitize.css */\n\n/* Document (https://html.spec.whatwg.org/multipage/semantics.html#semantics)\n   ========================================================================== */\n\n/**\n * 1. Remove repeating backgrounds in all browsers (opinionated).\n * 2. Add box sizing inheritence in all browsers (opinionated).\n */\n\n*,\n::before,\n::after {\n  background-repeat: no-repeat;\n  /* 1 */\n  -webkit-box-sizing: inherit;\n          box-sizing: inherit;\n  /* 2 */\n}\n\n/**\n * 1. Add text decoration inheritance in all browsers (opinionated).\n * 2. Add vertical alignment inheritence in all browsers (opinionated).\n */\n\n::before,\n::after {\n  text-decoration: inherit;\n  /* 1 */\n  vertical-align: inherit;\n  /* 2 */\n}\n\n/**\n * 1. Add border box sizing in all browsers (opinionated).\n * 2. Add the default cursor in all browsers (opinionated).\n * 3. Prevent font size adjustments after orientation changes in IE and iOS.\n */\n\nhtml {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  cursor: default;\n  /* 2 */\n  -ms-text-size-adjust: 100%;\n  /* 3 */\n  -webkit-text-size-adjust: 100%;\n  /* 3 */\n}\n\n/* Sections (https://html.spec.whatwg.org/multipage/semantics.html#sections)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle,\naside,\nfooter,\nheader,\nnav,\nsection {\n  display: block;\n}\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: .67em 0;\n}\n\n/* Grouping content (https://html.spec.whatwg.org/multipage/semantics.html#grouping-content)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption,\nfigure,\nmain {\n  /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  /* 1 */\n  height: 0;\n  /* 1 */\n  overflow: visible;\n  /* 2 */\n}\n\n/**\n * Remove the list style on navigation lists in all browsers (opinionated).\n */\n\nnav ol,\nnav ul {\n  list-style: none;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/* Text-level semantics (https://html.spec.whatwg.org/multipage/semantics.html#text-level-semantics)\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent;\n  /* 1 */\n  -webkit-text-decoration-skip: objects;\n  /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none;\n  /* 1 */\n  text-decoration: underline;\n  /* 2 */\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n  /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb,\nstrong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace;\n  /* 1 */\n  font-size: 1em;\n  /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ffff00;\n  color: #000000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -.25em;\n}\n\nsup {\n  top: -.5em;\n}\n\n/*\n * Remove the text shadow on text selections (opinionated).\n * 1. Restore the coloring undone by defining the text shadow (opinionated).\n */\n\n::-moz-selection {\n  background-color: #b3d4fc;\n  /* 1 */\n  color: #000000;\n  /* 1 */\n  text-shadow: none;\n}\n\n::selection {\n  background-color: #b3d4fc;\n  /* 1 */\n  color: #000000;\n  /* 1 */\n  text-shadow: none;\n}\n\n/* Embedded content (https://html.spec.whatwg.org/multipage/embedded-content.html#embedded-content)\n   ========================================================================== */\n\n/*\n * Change the alignment on media elements in all browers (opinionated).\n */\n\naudio,\ncanvas,\niframe,\nimg,\nsvg,\nvideo {\n  vertical-align: middle;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio,\nvideo {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Change the fill color to match the text color in all browsers (opinionated).\n */\n\nsvg {\n  fill: currentColor;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Tabular data (https://html.spec.whatwg.org/multipage/tables.html#tables)\n   ========================================================================== */\n\n/**\n * Collapse border spacing\n */\n\ntable {\n  border-collapse: collapse;\n}\n\n/* Forms (https://html.spec.whatwg.org/multipage/forms.html#forms)\n   ========================================================================== */\n\n/**\n * Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  margin: 0;\n}\n\n/**\n * Inherit styling in all browsers (opinionated).\n */\n\nbutton,\ninput,\nselect,\ntextarea {\n  background-color: transparent;\n  color: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput {\n  /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect {\n  /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\nhtml [type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n  /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  color: inherit;\n  /* 2 */\n  display: table;\n  /* 1 */\n  max-width: 100%;\n  /* 1 */\n  padding: 0;\n  /* 3 */\n  white-space: normal;\n  /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block;\n  /* 1 */\n  vertical-align: baseline;\n  /* 2 */\n}\n\n/**\n * 1. Remove the default vertical scrollbar in IE.\n * 2. Change the resize direction on textareas in all browsers (opinionated).\n */\n\ntextarea {\n  overflow: auto;\n  /* 1 */\n  resize: vertical;\n  /* 2 */\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  /* 1 */\n  padding: 0;\n  /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield;\n  /* 1 */\n  outline-offset: -2px;\n  /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button,\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button;\n  /* 1 */\n  font: inherit;\n  /* 2 */\n}\n\n/* Interactive elements (https://html.spec.whatwg.org/multipage/forms.html#interactive-elements)\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails,\nmenu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting (https://html.spec.whatwg.org/multipage/scripting.html#scripting-3)\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* User interaction (https://html.spec.whatwg.org/multipage/interaction.html#editing)\n   ========================================================================== */\n\n/*\n * Remove the tapping delay on clickable elements (opinionated).\n * 1. Remove the tapping delay in IE 10.\n */\n\na,\narea,\nbutton,\ninput,\nlabel,\nselect,\nsummary,\ntextarea,\n[tabindex] {\n  -ms-touch-action: manipulation;\n  /* 1 */\n  touch-action: manipulation;\n}\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}\n\n/* ARIA (https://w3c.github.io/html-aria/)\n   ========================================================================== */\n\n/**\n * Change the cursor on busy elements (opinionated).\n */\n\n[aria-busy=\"true\"] {\n  cursor: progress;\n}\n\n/*\n * Change the cursor on control elements (opinionated).\n */\n\n[aria-controls] {\n  cursor: pointer;\n}\n\n/*\n * Change the display on visually hidden accessible elements (opinionated).\n */\n\n[aria-hidden=\"false\"][hidden]:not(:focus) {\n  clip: rect(0, 0, 0, 0);\n  display: inherit;\n  position: absolute;\n}\n\n/*\n * Change the cursor on disabled, not-editable, or otherwise\n * inoperable elements (opinionated).\n */\n\n[aria-disabled] {\n  cursor: default;\n}\n\n/* eslint-disable selector-pseudo-element-colon-notation */\n\n/**\n * For modern browsers\n * 1. The space content is one way to avoid an Opera bug when the\n *    contenteditable attribute is included anywhere else in the document.\n *    Otherwise it causes space to appear at the top and bottom of elements\n *    that are clearfixed.\n * 2. The use of `table` rather than `block` is only necessary if using\n *    `:before` to contain the top-margins of child elements.\n */\n\n.cf:before,\n.cf:after {\n  content: \" \";\n  /* 1 */\n  display: table;\n  /* 2 */\n}\n\n.cf:after {\n  clear: both;\n}\n\n/**\n * For IE 6/7 only\n * Include this rule to trigger hasLayout and contain floats.\n */\n\n.cf {\n  *zoom: 1;\n}\n\n/* Hide the text. */\n\n.hide-text {\n  display: block;\n  overflow: hidden;\n  text-indent: 100%;\n  white-space: nowrap;\n}\n\nimg {\n  max-height: 100%;\n  max-width: 100%;\n}\n\ntextarea,\ninput,\nbutton,\n.mobile-nav-link {\n  outline: none;\n}\n\n.container {\n  margin: 0 auto;\n  padding: 0;\n}\n\nhtml {\n  background: #262626;\n}\n\nbody.front {\n  background: #262626;\n  overflow: scroll;\n}\n\nbody.front.no-scroll {\n  overflow: hidden;\n}\n\nbody.front .fullscreen {\n  background-color: #262626;\n}\n\n@media screen and (max-width: 767px) {\n  body.front .fullscreen .fullscreen-wrapper {\n    overflow: hidden;\n  }\n}\n\nbody.front .fullscreen .fullscreen-wrapper .wrap.container {\n  max-width: 100%;\n  width: 100%;\n}\n\nbody.front .fullscreen .fullscreen-wrapper .wrap.container > .content {\n  margin: 0;\n}\n\nbody.front #body-overlay {\n  background: rgba(255, 255, 255, 0.5);\n  bottom: 0;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: -300;\n}\n\nbody.front.page-template-template-projects .main {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: start;\n      -ms-flex-pack: start;\n          justify-content: flex-start;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  margin: 0 auto;\n  max-width: 600px;\n  width: 50%;\n}\n\n@media screen and (max-width: 767px) {\n  body.front.page-template-template-projects .main {\n    width: 90%;\n  }\n}\n\nbody.front.page-template-template-projects .main > * {\n  -webkit-transition-duration: .25s;\n       -o-transition-duration: .25s;\n          transition-duration: .25s;\n  -webkit-transition-property: opacity;\n  -o-transition-property: opacity;\n  transition-property: opacity;\n}\n\nbody.front.page-template-template-projects .main.centered-image > *:not(.centered-image-transition-duration) {\n  opacity: 0;\n}\n\nbody.front.page-template-template-projects .main p {\n  margin-top: 0;\n}\n\nbody.front.centered-image #back-to-top {\n  opacity: 0;\n}\n\n/** Search form */\n\n/**\n * WordPress Generated Classes\n * @see http://codex.wordpress.org/CSS#WordPress_Generated_Classes\n */\n\n/** Media alignment */\n\n.alignnone {\n  margin-left: 0;\n  margin-right: 0;\n  max-width: 100%;\n  height: auto;\n}\n\n.aligncenter {\n  display: block;\n  margin: 0.5rem auto;\n  height: auto;\n}\n\n.alignleft,\n.alignright {\n  margin-bottom: 0.5rem;\n  height: auto;\n}\n\n@media (min-width: 30rem) {\n  .alignleft {\n    float: left;\n    margin-right: 0.5rem;\n  }\n\n  .alignright {\n    float: right;\n    margin-left: 0.5rem;\n  }\n}\n\n/** Captions */\n\n/** Text meant only for screen readers */\n\n.screen-reader-text {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n  color: #000;\n  background: #fff;\n}\n\n.modal {\n  max-width: 30000px;\n  width: 100vw;\n}\n\n.modal .modal-dialog {\n  max-width: 30000px;\n  height: 100vh;\n  width: 100vw;\n}\n\n.modal .modal-dialog .modal-content {\n  max-width: 100%;\n  height: 100vh;\n  top: 0 !important;\n  left: 0 !important;\n  -webkit-transform: translate(0, 0) !important;\n       -o-transform: translate(0, 0) !important;\n          transform: translate(0, 0) !important;\n}\n\n.modal .modal-dialog .modal-content .modal-body {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  padding-top: 39px;\n}\n\n.modal .modal-dialog .modal-content .modal-body .video-embed,\n.modal .modal-dialog .modal-content .modal-body .video-embed * {\n  max-height: calc(100vh - 27px);\n}\n\n.modal .modal-dialog .modal-content .modal-body button {\n  background: url(\"/app/themes/stone-roberts-anew/dist/images/closeout-icon-lightgrey.png\") no-repeat center center/contain transparent !important;\n  height: 17px;\n  padding: 0;\n  width: 17px;\n  text-align: left;\n  position: absolute;\n  left: 3px;\n  top: 10px;\n  z-index: 200;\n}\n\n.modal .modal-dialog .modal-content .modal-body iframe {\n  display: block;\n  margin: 0 auto;\n}\n\n.nav-primary {\n  background: #262626;\n  -webkit-transform: translateY(-100vh);\n       -o-transform: translateY(-100vh);\n          transform: translateY(-100vh);\n  position: fixed;\n  z-index: 19;\n  height: 100vh;\n  width: 100vw;\n  margin: 0 auto;\n  padding: 6vh;\n  max-height: 100vh;\n  max-width: none;\n  overflow: scroll;\n  top: 0;\n  -webkit-transition-duration: .25s;\n       -o-transition-duration: .25s;\n          transition-duration: .25s;\n  -webkit-transition-property: -webkit-transform;\n  transition-property: -webkit-transform;\n  -o-transition-property: -o-transform;\n  transition-property: transform;\n  transition-property: transform, -webkit-transform, -o-transform;\n}\n\n.custom-nav {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-gap: 3vw;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding: 0;\n}\n\n.custom-nav .list-item {\n  display: block;\n  height: auto;\n  margin: 0 0 1.8em;\n  max-height: none;\n  max-width: none;\n  width: auto;\n}\n\n.custom-nav .list-item:hover .nav-item-image,\n.custom-nav .list-item:active .nav-item-image {\n  -webkit-transform: scale(1.01);\n       -o-transform: scale(1.01);\n          transform: scale(1.01);\n  -webkit-transition-duration: .25s;\n       -o-transition-duration: .25s;\n          transition-duration: .25s;\n  -webkit-transition-property: -webkit-transform;\n  transition-property: -webkit-transform;\n  -o-transition-property: -o-transform;\n  transition-property: transform;\n  transition-property: transform, -webkit-transform, -o-transform;\n}\n\n.custom-nav .list-item .nav-item {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  height: 100%;\n}\n\n.custom-nav .list-item .nav-item-header {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-flex: 1;\n      -ms-flex-positive: 1;\n          flex-grow: 1;\n  font-size: 18px;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  margin-bottom: 13px;\n  text-transform: uppercase;\n  letter-spacing: 1.1px;\n}\n\n.custom-nav .list-item .nav-item-image {\n  background-size: cover;\n  display: block;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  height: unset;\n  max-width: 100%;\n  padding-bottom: 100%;\n  width: 100%;\n}\n\n.custom-nav .list-item .nav-item-short-text {\n  display: block;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  margin-top: 0.4em;\n}\n\n.audio {\n  margin-top: 73px;\n  padding: 0 23px;\n  position: relative;\n}\n\n.audio .audio-piece .duration,\n.audio .audio-piece .timer {\n  background: rgba(0, 0, 0, 0.5);\n  bottom: 0;\n  color: #fff;\n  padding: .5em;\n  position: absolute;\n}\n\n.audio .audio-piece .duration.timer,\n.audio .audio-piece .timer.timer {\n  left: -2em;\n}\n\n.audio .audio-piece .duration.duration,\n.audio .audio-piece .timer.duration {\n  right: -2em;\n}\n\n.audio .audio-piece button {\n  background-color: gray;\n  border: 0 solid;\n  border-radius: .1em;\n  padding: 1.2em;\n  color: #fff;\n}\n\n.audio .audio-piece .span-value-wrap {\n  height: 50px;\n  position: relative;\n  width: 100%;\n}\n\n.audio .audio-piece .span-value-wrap .span-value {\n  background-color: #646464;\n  border-radius: 0;\n  display: block;\n  height: 100%;\n  overflow: visible;\n  width: 0;\n}\n\n.audio .audio-piece .span-value-wrap .span-value .span-value-jump {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n  height: 100%;\n  width: 0;\n}\n\n.audio .audio-piece .span-value-wrap .span-value .span-value-jump div {\n  height: 100%;\n  width: 100%;\n}\n\n.audio .audio-piece .span-value-wrap:hover .span-value-jump div {\n  background-color: rgba(79, 105, 61, 0.5);\n}\n\n.video {\n  position: relative;\n  width: 100%;\n}\n\n.video .wrap {\n  overflow: hidden;\n  position: relative;\n}\n\n.video .wrap .video-play-screenshot {\n  overflow: hidden;\n  display: block;\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  background-size: cover;\n  background-position: center;\n  z-index: 1;\n}\n\n.video .caption {\n  margin-top: 10px;\n}\n\n.video .caption p {\n  color: #bcbcbc;\n  font-size: 15px;\n  line-height: 19px;\n}\n\n.video .play-button {\n  background: url(\"/app/themes/stone-roberts-anew/dist/images/play.svg\") no-repeat 50%/28% transparent;\n  border: none;\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  z-index: 2;\n}\n\n@media screen and (max-width: 767px) {\n  .video {\n    background-size: 22%;\n  }\n}\n\n@media screen and (min-width: 768px) {\n  .video .play-button {\n    background-size: 20%;\n  }\n\n  .video .play-button:hover {\n    cursor: pointer;\n  }\n}\n\n.video.playing .play-button,\n.video.playing .video-play-screenshot {\n  display: none;\n}\n\n.carousel-wrap {\n  overflow: hidden;\n  position: relative;\n}\n\n.carousel-wrap .carousel {\n  width: 100%;\n}\n\n.carousel-wrap .carousel .carousel-cell {\n  max-width: 100vw;\n  width: 100%;\n}\n\n.carousel-wrap .carousel .carousel-cell figure {\n  margin-bottom: 0;\n  width: 100% !important;\n}\n\n.carousel-wrap .carousel .carousel-cell figure img {\n  width: 100%;\n}\n\n.carousel-wrap .carousel .carousel-cell .text {\n  background: rgba(0, 0, 0, 0.5);\n  bottom: 0;\n  color: #fff;\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  text-align: left;\n  width: 100%;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button {\n  display: none;\n  width: 55px;\n  height: 77px;\n}\n\n@media screen and (min-width: 768px) {\n  .carousel-wrap .carousel .flickity-page-dots {\n    bottom: 45px;\n  }\n\n  .carousel-wrap .carousel .flickity-page-dots .dot {\n    height: 13px;\n    width: 13px;\n    background: #fff;\n  }\n}\n\n@media screen and (min-width: 1024px) {\n  .carousel-wrap .carousel .flickity-page-dots {\n    bottom: 59px;\n  }\n\n  .carousel-wrap .carousel .flickity-prev-next-button {\n    display: block;\n  }\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button {\n  background: transparent;\n  display: block;\n  top: 72%;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button path {\n  fill: #fff;\n  opacity: .4;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button {\n  top: 73.2%;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button.previous {\n  left: 31px;\n}\n\n.carousel-wrap .carousel .flickity-prev-next-button.next {\n  right: 20px;\n}\n\n.center-scroll-arrows {\n  position: fixed;\n  left: 0;\n  top: 50%;\n  z-index: 50;\n}\n\n.center-scroll-arrows div {\n  background: rgba(0, 0, 0, 0.8);\n  height: 20px;\n  width: 20px;\n}\n\n.center-scroll-arrows div.next {\n  -webkit-transform: rotate(180deg);\n       -o-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.center-scroll-arrows div:hover {\n  cursor: pointer;\n}\n\n.center-scroll-arrows.hide-next .next {\n  visibility: hidden;\n}\n\n.center-scroll-arrows.hide-previous .prev {\n  visibility: hidden;\n}\n\n#thumbnails-nav {\n  background-color: rgba(0, 0, 0, 0.9);\n  height: 100vh;\n  left: 0;\n  opacity: 1;\n  overflow: scroll;\n  padding: 0 4vw 8vw;\n  position: fixed;\n  top: 0;\n  -webkit-transition-duration: .1s;\n       -o-transition-duration: .1s;\n          transition-duration: .1s;\n  -webkit-transition-property: opacity, -webkit-transform;\n  transition-property: opacity, -webkit-transform;\n  -o-transition-property: opacity, -o-transform;\n  transition-property: transform, opacity;\n  transition-property: transform, opacity, -webkit-transform, -o-transform;\n  width: 100vw;\n  z-index: 300;\n}\n\n#thumbnails-nav h1 {\n  font-size: 18px;\n  letter-spacing: 3.7px;\n  height: 8vw;\n  width: 100%;\n  text-align: center;\n  margin: 0 0 -2vh 0 !important;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n}\n\n#thumbnails-nav .thumbnails-wrap {\n  -ms-flex-line-pack: start;\n      align-content: flex-start;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-wrap: wrap;\n      flex-wrap: wrap;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n#thumbnails-nav .thumbnail-wrap {\n  height: 21vw;\n  padding: 2vh;\n  width: auto;\n}\n\n#thumbnails-nav .thumbnail {\n  height: 100%;\n  width: auto;\n}\n\n#thumbnails-nav .thumbnail:hover {\n  cursor: pointer;\n}\n\n#thumbnails-nav.hide {\n  opacity: 0;\n  -webkit-transform: translateX(-100vw);\n       -o-transform: translateX(-100vw);\n          transform: translateX(-100vw);\n}\n\n#thumbnail-trigger {\n  height: 26px;\n  left: 10px;\n  position: fixed;\n  bottom: 8px;\n  -webkit-transition-duration: .1s;\n       -o-transition-duration: .1s;\n          transition-duration: .1s;\n  -webkit-transition-property: top;\n  -o-transition-property: top;\n  transition-property: top;\n  width: 39px;\n  z-index: 301;\n}\n\n#thumbnail-trigger:hover {\n  cursor: pointer;\n}\n\n#thumbnail-trigger > div {\n  background-color: #fff;\n  float: left;\n  height: 10px;\n  margin: 0 3px 3px 0;\n  width: 10px;\n}\n\nbody:not(.template-projects) #thumbnail-trigger {\n  display: none;\n}\n\n.artwork_piece {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  max-width: 100vw !important;\n  min-width: 100%;\n  padding-top: 55px;\n  position: relative;\n  -webkit-transition-property: width, height;\n  -o-transition-property: width, height;\n  transition-property: width, height;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n}\n\n.artwork_piece h3 {\n  position: absolute;\n  top: 0;\n  left: 0;\n}\n\n.artwork_piece .image-wrap {\n  display: inline-block;\n  max-height: 100%;\n  max-width: 100%;\n  position: relative;\n  text-align: center;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder {\n  margin: 0 auto;\n  position: relative;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n  width: 100%;\n  z-index: 2;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder .center-image-wrap,\n.artwork_piece .image-wrap .image-space-placeholder .zoomy-wrap {\n  -webkit-box-align: baseline;\n      -ms-flex-align: baseline;\n          align-items: baseline;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder .main-img {\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  max-height: 100vh;\n  position: static;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n}\n\n.artwork_piece .image-wrap .image-space-placeholder .artwork-image-wrap {\n  margin: 0 auto;\n}\n\n.artwork_piece .image-wrap .caption {\n  display: inline-block;\n  margin-right: 1%;\n  width: 81%;\n}\n\n.artwork_piece .image-wrap .artwork-meta {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  position: static;\n  text-align: left;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .artwork-meta .caption p {\n  margin: 0;\n}\n\n.artwork_piece .image-wrap .artwork-meta .actions {\n  display: block;\n  position: absolute;\n  right: 0;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -webkit-transition-duration: .5s;\n       -o-transition-duration: .5s;\n          transition-duration: .5s;\n  z-index: 20;\n}\n\n.artwork_piece .image-wrap .artwork-meta .actions div {\n  display: inline-block;\n  height: 30px;\n  width: 30px;\n}\n\n.artwork_piece .image-wrap .artwork-meta .actions div:hover {\n  cursor: pointer;\n}\n\n.artwork_piece .image-wrap .piece-comparison {\n  background: #fff;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  left: 0;\n  margin: 0;\n  padding: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  -webkit-transform: translateY(110vh);\n       -o-transform: translateY(110vh);\n          transform: translateY(110vh);\n  -webkit-transition-duration: .5s;\n       -o-transition-duration: .5s;\n          transition-duration: .5s;\n  z-index: 400;\n  height: 100vh;\n}\n\n.artwork_piece .image-wrap .piece-comparison .piece-comparison-wrap {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  height: 100%;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  margin: 0 auto;\n  overflow: hidden;\n  padding: 0;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .piece-comparison .piece-comparison-wrap.piece-comparison-processed {\n  visibility: visible !important;\n}\n\n.artwork_piece .image-wrap .piece-comparison .comparison-image-wrap {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-flex: 0;\n      -ms-flex-positive: 0;\n          flex-grow: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: end;\n      -ms-flex-pack: end;\n          justify-content: flex-end;\n  margin-bottom: 29%;\n  max-height: 100%;\n  padding-bottom: 3vh;\n  position: absolute;\n  top: 4%;\n  z-index: 1;\n}\n\n.artwork_piece .image-wrap .piece-comparison .comparison-image-wrap .comparison-image {\n  -ms-flex-negative: 1;\n      flex-shrink: 1;\n  height: auto;\n  max-height: none;\n  max-width: none;\n  width: 100%;\n}\n\n.artwork_piece .image-wrap .piece-comparison .comparison-image-wrap .info-text p {\n  color: #0f0f0f;\n  display: inline;\n}\n\n.artwork_piece .image-wrap .piece-comparison .compared-to {\n  height: 100vh;\n  left: 0;\n  max-height: none;\n  max-width: none;\n  -o-object-fit: cover;\n     object-fit: cover;\n  position: absolute;\n  top: 0;\n  -webkit-transition-duration: 250ms;\n       -o-transition-duration: 250ms;\n          transition-duration: 250ms;\n  -webkit-transition-property: width, height;\n  -o-transition-property: width, height;\n  transition-property: width, height;\n  width: 100vw;\n}\n\n.artwork_piece .image-wrap .piece-comparison .close {\n  color: #0f0f0f;\n  position: absolute;\n  right: 20px;\n  top: 20px;\n  z-index: 5;\n}\n\n.artwork_piece .image-wrap .piece-comparison .close:hover {\n  cursor: pointer;\n}\n\n.artwork_piece.show-info .piece-comparison {\n  -webkit-transform: translateY(0vh);\n       -o-transform: translateY(0vh);\n          transform: translateY(0vh);\n}\n\n.artwork_piece .zoomy-wrap {\n  height: 100%;\n  position: absolute;\n  top: 0;\n  width: 100%;\n  z-index: 10;\n}\n\n.artwork_piece .zoomy-wrap .zoom-img {\n  background-color: #0f0f0f;\n  position: absolute;\n  max-height: none;\n  max-width: none;\n  padding: 10px;\n  width: 150%;\n  height: auto;\n}\n\n.artwork_piece .zoomy-wrap .mouse-map-wrap {\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  background-color: #1c1c1c;\n  background-origin: border-box;\n  background-repeat: no-repeat;\n  background-size: 100%;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  height: 100%;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  overflow: hidden;\n  opacity: 0;\n  position: relative;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n  -webkit-transition-property: background-size, width, height, -webkit-transform;\n  transition-property: background-size, width, height, -webkit-transform;\n  -o-transition-property: background-size, width, height, -o-transform;\n  transition-property: transform, background-size, width, height;\n  transition-property: transform, background-size, width, height, -webkit-transform, -o-transform;\n  width: 100%;\n}\n\n.artwork_piece .zoomy-wrap .mouse-map-wrap[zoom-enabled]:hover {\n  cursor: -webkit-zoom-in;\n  cursor: zoom-in;\n}\n\n.artwork_piece .zoomy-wrap .mouse-map-wrap .mouse-map {\n  opacity: .4;\n  height: 100%;\n  width: 100%;\n  margin: 0 auto;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n  -webkit-transition-property: background-size, width, height, -webkit-transform;\n  transition-property: background-size, width, height, -webkit-transform;\n  -o-transition-property: background-size, width, height, -o-transform;\n  transition-property: transform, background-size, width, height;\n  transition-property: transform, background-size, width, height, -webkit-transform, -o-transform;\n}\n\n.artwork_piece.zoomed .mouse-map-wrap {\n  opacity: 1;\n}\n\n.artwork_piece.zoomed .mouse-map-wrap:hover {\n  cursor: -webkit-zoom-out !important;\n  cursor: zoom-out !important;\n}\n\n.artwork_piece.zoomed .main-img {\n  visibility: hidden;\n}\n\n.artwork_piece.centered .image-space-placeholder {\n  z-index: 50;\n}\n\n.artwork_piece.centered .center-image-wrap,\n.artwork_piece.centered .zoomy-wrap {\n  -webkit-box-align: center !important;\n      -ms-flex-align: center !important;\n          align-items: center !important;\n  bottom: 0;\n  height: auto !important;\n  position: fixed;\n  left: 0;\n  right: 0;\n  top: 0;\n}\n\n.artwork_piece.centered .artwork-meta {\n  background-color: #1a1a1a;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  bottom: 0;\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: justify;\n      -ms-flex-pack: justify;\n          justify-content: space-between;\n  left: calc(100vw - 40px);\n  padding: 0;\n  position: fixed;\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n  -webkit-transition-property: left;\n  -o-transition-property: left;\n  transition-property: left;\n  width: 100vw;\n  z-index: 302;\n}\n\n.artwork_piece.centered .artwork-meta .artwork_piece {\n  width: auto;\n}\n\n.artwork_piece.centered .artwork-meta:before {\n  content: '';\n  height: 30px;\n  width: 30px;\n  border: solid white;\n  border-width: 0 3px 3px 0;\n  display: inline-block;\n  padding: 3px;\n  -webkit-transform: rotate(135deg);\n       -o-transform: rotate(135deg);\n          transform: rotate(135deg);\n  position: absolute;\n  left: 12px;\n  bottom: 14px;\n}\n\n.artwork_piece.centered .artwork-meta:hover {\n  left: 0;\n  padding-left: 1.2em;\n  padding-right: 1.2em;\n}\n\n.artwork_piece.centered .artwork-meta .caption {\n  padding: 20px 20px 20px 41px;\n  width: 81%;\n}\n\n.artwork_piece.centered .artwork-meta .caption p {\n  text-align: center;\n}\n\n.artwork_piece.centered .artwork-meta .actions {\n  position: static;\n}\n\n.artwork_piece.centered.width .image-space-placeholder,\n.artwork_piece.centered.width .image-ratio-holder {\n  width: 100%;\n}\n\n.artwork_piece.centered.height .image-wrap,\n.artwork_piece.centered.height .image-space-placeholder,\n.artwork_piece.centered.height .image-ratio-holder {\n  width: 100%;\n}\n\n.artwork_piece:not(.zoomed) .artwork-meta:hover {\n  bottom: 0;\n}\n\n.artwork_piece:not(.zoomed) .artwork-meta:hover .caption p {\n  opacity: 1;\n}\n\n.artwork_piece.centered-image-transition-duration .main-img {\n  -webkit-transition-duration: 0.5s;\n       -o-transition-duration: 0.5s;\n          transition-duration: 0.5s;\n}\n\n.artwork_piece.zoomed-delay .mouse-map-wrap {\n  opacity: 1 !important;\n}\n\n.artwork_piece .actions .zoom {\n  display: none !important;\n}\n\n.artwork_piece[zoom-enabled] .actions .zoom {\n  display: inline-block !important;\n}\n\nbody.artworks-processed .artwork_piece {\n  width: 100vw;\n}\n\nbody.centered-image .main > * {\n  opacity: 0;\n}\n\nbody.centered-image .main > *.centered {\n  opacity: 1 !important;\n}\n\nbody.centered-image .main > *.centered h3 {\n  opacity: 0;\n}\n\nbody.is-touch .artwork_piece .main-img {\n  max-width: 100vw;\n  max-height: none !important;\n  position: static !important;\n}\n\nbody.is-touch .artwork_piece .artwork-meta {\n  padding: 1.2em;\n}\n\nbody.is-touch .artwork_piece.width .main-img {\n  height: auto;\n  width: 100vw;\n}\n\nbody.is-touch .artwork_piece.height .main-img {\n  height: 100vh;\n  width: auto;\n}\n\nbody.is-touch.zoomed {\n  overflow: hidden;\n}\n\nbody.viewport-resizing .artwork_piece {\n  max-width: 100% !important;\n}\n\nbody.orientation-landscape.zoomed .artwork-meta {\n  z-index: 0;\n}\n\n@media screen and (max-width: 630px) {\n  body .artwork_piece .main-img {\n    max-width: 100vw;\n    max-height: none !important;\n    position: static !important;\n  }\n\n  body .artwork_piece .artwork-meta {\n    padding: 1.2em;\n  }\n\n  body .artwork_piece.width .main-img {\n    height: auto;\n    width: 100vw;\n  }\n\n  body .artwork_piece.height .main-img {\n    height: 100vh;\n    width: auto;\n  }\n}\n\nbody.template-projects header.banner {\n  margin-bottom: 121px;\n}\n\nbody.template-projects .page-header {\n  display: none;\n}\n\n.dev-share-buttons {\n  -webkit-box-orient: horizontal;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: row;\n          flex-direction: row;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  position: absolute;\n}\n\n.dev-share-buttons a {\n  display: inline-block;\n  padding: 10px;\n  margin: 0 5px;\n}\n\n.dev-share-buttons .link-input-wrap {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n  left: 0;\n  position: absolute;\n  width: 100%;\n  top: 40%;\n}\n\n.dev-share-buttons .link-input-wrap input {\n  width: 50%;\n}\n\n.body_text p:last-child {\n  margin-bottom: 0;\n}\n\n#splash-modal {\n  display: block;\n  background-color: #262626;\n  background-size: cover;\n  background-position: center;\n  height: 100vh;\n  left: 0;\n  opacity: 0;\n  position: fixed;\n  top: 0;\n  -webkit-transition-duration: .25s;\n       -o-transition-duration: .25s;\n          transition-duration: .25s;\n  -webkit-transition-property: opacity;\n  -o-transition-property: opacity;\n  transition-property: opacity;\n  width: 100vw;\n  z-index: -1;\n}\n\n#splash-modal:hover {\n  cursor: pointer;\n}\n\n.show-splash #splash-modal {\n  opacity: 1;\n  z-index: 400;\n}\n\n.show-splash-transition #splash-modal {\n  z-index: 400;\n}\n\nheader.banner {\n  margin-bottom: 70px;\n}\n\nheader.banner .container {\n  overflow: auto;\n}\n\nheader.banner .container .brand {\n  background-color: #262626;\n  display: block;\n  height: 117px;\n  line-height: 1em;\n  margin: 0;\n  text-align: center;\n  padding: 4vh 0 9.5vh;\n  font-size: 30px;\n  font-weight: bold;\n  position: static;\n  top: 0;\n  left: 0;\n  width: 100%;\n}\n\nheader.banner .container .brand span {\n  display: block;\n  background: url(\"/app/themes/stone-roberts-anew/dist/images/logo.png\") no-repeat center transparent;\n  height: 88px;\n}\n\nheader.banner .container .nav-primary {\n  z-index: 300;\n}\n\nheader.banner .container .nav-primary .nav {\n  padding: 0;\n}\n\nheader.banner .container .nav-primary .nav li {\n  display: inline-block;\n  list-style-type: none;\n  margin: 0 .3em;\n}\n\n.hamburger {\n  z-index: 307 !important;\n}\n\n.home .hamburger,\n.home .nav-primary {\n  display: none;\n}\n\n.post-main-content figure {\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}\n\nbody#tinymce {\n  margin: 12px !important;\n}\n\nbody.front {\n  color: #fff;\n  font-family: \"Whitney SSm A\", \"Whitney SSm B\";\n  font-weight: 400;\n  font-style: normal;\n  line-height: 23px;\n}\n\nbody.front a {\n  color: #fff;\n  text-decoration: none;\n}\n\nbody.front .fullscreen {\n  background: #262626;\n}\n\nbody.front .fullscreen .fullscreen-modal {\n  background-color: rgba(0, 0, 0, 0.8);\n}\n\nbody.front .fullscreen .main > * {\n  margin-bottom: 33px;\n}\n\nbody.front .fullscreen .main .page-header {\n  margin-top: 40px;\n  margin-bottom: 60px;\n}\n\nbody.front .fullscreen .main .page-header h1 {\n  font-size: 18px;\n  letter-spacing: 3.7px;\n}\n\nbody.front .fullscreen .main h1,\nbody.front .fullscreen .main h2,\nbody.front .fullscreen .main h3,\nbody.front .fullscreen .main h4,\nbody.front .fullscreen .main h5 {\n  font-weight: 100;\n  font-size: 14px;\n  letter-spacing: 0.21em;\n  text-transform: uppercase;\n}\n\nbody.front .fullscreen .main .artwork_piece .artwork-meta {\n  margin-top: 10px;\n}\n\nbody.front .fullscreen .main .artwork_piece .artwork-meta .caption p {\n  color: #bcbcbc;\n  font-size: 15px;\n  line-height: 19px;\n}\n\n","/** Search form */\n// TODO: .search-form {}\n// TODO: .search-form label {}\n// TODO: .search-form .search-field {}\n// TODO: .search-form .search-submit {}\n","/**\n * WordPress Generated Classes\n * @see http://codex.wordpress.org/CSS#WordPress_Generated_Classes\n */\n\n/** Media alignment */\n.alignnone {\n  margin-left: 0;\n  margin-right: 0;\n  max-width: 100%;\n  height: auto;\n}\n\n.aligncenter {\n  display: block;\n  margin: ($spacer / 2) auto;\n  height: auto;\n}\n\n.alignleft,\n.alignright {\n  margin-bottom: ($spacer / 2);\n  height: auto;\n}\n\n@media (min-width: 30rem) {\n  .alignleft {\n    float: left;\n    margin-right: ($spacer / 2);\n  }\n\n  .alignright {\n    float: right;\n    margin-left: ($spacer / 2);\n  }\n}\n\n/** Captions */\n\n// TODO: .wp-caption {}\n// TODO: .wp-caption img {}\n// TODO: .wp-caption-text {}\n\n/** Text meant only for screen readers */\n.screen-reader-text {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0;\n  color: #000;\n  background: #fff;\n}\n",".modal {\n  max-width: 30000px;\n  width: 100vw;\n\n  .modal-dialog {\n    max-width: 30000px;\n    height: 100vh;\n    width: 100vw;\n\n    .modal-content {\n      max-width: 100%;\n      height: 100vh;\n      top: 0 !important;\n      left: 0 !important;\n      transform: translate(0, 0) !important;\n\n      .modal-body {\n        position: absolute;\n        width: 100%;\n        height: 100%;\n        display: flex;\n        flex-direction: column;\n        justify-content: center;\n        padding-top: 39px;\n\n        .video-embed, .video-embed * {\n          max-height: calc(100vh - 27px);\n        }\n\n        button {\n          background: url($image-path + 'closeout-icon-lightgrey.png') no-repeat center center/contain transparent !important;\n          height: 17px;\n          padding: 0;\n          width: 17px;\n          text-align: left;\n          position: absolute;\n          left: 3px;\n          top: 10px;\n          z-index: 200;\n        }\n\n        iframe {\n          display: block;\n          margin: 0 auto;\n        }\n      }\n    }\n  }\n}\n",".nav-primary {\n  background: $background;\n  transform: translateY(-100vh);\n  position: fixed;\n  z-index: 19;\n  height: 100vh;\n  width: 100vw;\n  margin: 0 auto;\n  padding: 6vh;\n  max-height: 100vh;\n  max-width: none;\n  overflow: scroll;\n  top: 0;\n  transition-duration: .25s;\n  transition-property: transform;\n}\n\n.custom-nav {\n  //display: flex;\n  //flex-wrap: wrap;\n  //justify-content: flex-start;\n\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-gap: 3vw;\n  margin: 0 auto;\n  max-width: 1200px;\n  padding: 0;\n\n  .list-item {\n    display: block;\n    height: auto;\n    margin: 0 0 1.8em;\n    max-height: none;\n    max-width: none;\n    width: auto;\n\n\n    &:hover .nav-item-image, &:active .nav-item-image{\n      transform: scale(1.01);\n      transition-duration: .25s;\n      transition-property: transform;\n    }\n\n    .nav-item {\n      display: flex;\n      flex-direction: column;\n      height: 100%;\n    }\n\n    .nav-item-header {\n      display: flex;\n      flex-direction: column;\n      flex-grow: 1;\n      font-size: 18px;\n      justify-content: flex-end;\n      margin-bottom: 13px;\n      text-transform: uppercase;\n      letter-spacing: 1.1px;\n    }\n\n    .nav-item-image {\n      background-size: cover;\n      display: block;\n      flex-grow: 0;\n      height: unset;\n      max-width: 100%;\n      padding-bottom: 100%;\n      width: 100%;\n    }\n\n    .nav-item-short-text {\n      display: block;\n      flex-grow: 0;\n      margin-top: 0.4em;\n    }\n  }\n\n}",".audio {\n  margin-top: 73px;\n  padding: 0 23px;\n  position: relative;\n\n  .audio-piece {\n    .duration, .timer{\n      background: rgba(0,0,0,.5);\n      bottom: 0;\n      color: #fff;\n      padding: .5em;\n      position: absolute;\n      \n      &.timer{\n        left: -2em;\n      }\n\n      &.duration{\n        right: -2em;\n      }\n    }\n    \n    button{\n      background-color: gray;\n      border: 0 solid;\n      border-radius: .1em;\n      padding: 1.2em;\n      color: #fff;\n      // position: absolute;\n\n    }\n    .play{\n      \n    }\n\n    .pause{\n\n    }\n\n    .span-value-wrap{\n      height: 50px;\n      position: relative;\n      width: 100%;\n\n      .span-value{\n        background-color:#646464;\n        border-radius: 0;\n        display: block;\n        height: 100%;\n        overflow: visible;\n        width: 0;\n\n        .span-value-jump{\n          box-sizing: content-box;\n          height: 100%;\n          width: 0;\n\n          div{\n            height: 100%;\n            width: 100%;\n\n          }\n          \n        }\n      }\n      &:hover .span-value-jump div{\n        background-color: rgba(79, 105, 61, 0.5);\n        \n      }\n    }\n  }\n}",".video {\n  position: relative;\n  width: 100%;\n\n  .wrap {\n    overflow: hidden;\n    position: relative;\n\n    .video-play-screenshot {\n      overflow: hidden;\n      display: block;\n      height: 100%;\n      width: 100%;\n      position: absolute;\n      top: 0;\n      left: 0;\n      background-size: cover;\n      background-position: center;\n      z-index: 1;\n    }\n  }\n\n  .caption {\n    margin-top: 10px;\n\n    p {\n      color: #bcbcbc;\n      font-size: 15px;\n      line-height: 19px;\n    }\n  }\n\n  .play-button {\n    background: url($image-path + 'play.svg') no-repeat 50%/28% transparent;\n    border: none;\n    display: block;\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    top: 0;\n    left: 0;\n    z-index: 2 ;\n  }\n\n  @media screen and (max-width: $mobile-max-width) {\n    background-size: 22%;\n  }\n\n  @media screen and (min-width: $desktop-min-width) {\n    .play-button {\n      background-size: 20%;\n\n      &:hover {\n        cursor: pointer;\n      }\n    }\n\n    .video-play-screenshot {\n\n    }\n  }\n  \n  &.playing{\n    .play-button, .video-play-screenshot{\n      display: none;\n    }\n  }\n}\n",".carousel-wrap {\n  overflow: hidden;\n  position: relative;\n\n  .carousel {\n    width: 100%;\n\n    .carousel-cell {\n      max-width: 100vw;\n      width: 100%;\n\n      figure {\n        margin-bottom: 0;\n        width: 100% !important;\n\n        img {\n          width: 100%;\n        }\n      }\n\n      .text {\n        background: rgba(0, 0, 0, .5);\n        bottom: 0;\n        color: #fff;\n        margin: 0;\n        padding: 0;\n        position: absolute;\n        text-align: left;\n        width: 100%;\n\n        p {\n\n        }\n      }\n    }\n\n    .flickity-prev-next-button {\n      display: none;\n      width: 55px;\n      height: 77px;\n\n    }\n\n    @media screen and (min-width: 768px) {\n      .carousel-cell {\n        .text {\n\n          p {\n          }\n        }\n      }\n\n      .flickity-page-dots {\n        bottom: 45px;\n\n        .dot {\n          height: 13px;\n          width: 13px;\n          background: #fff;\n        }\n      }\n    }\n\n    @media screen and (min-width: 1024px) {\n      .carousel-cell {\n        .text {\n\n          p {\n\n          }\n\n          h5 {\n          }\n        }\n      }\n\n      .flickity-page-dots {\n        bottom: 59px;\n\n        .dot {\n\n        }\n      }\n\n      .flickity-prev-next-button {\n        display: block;\n      }\n    }\n\n    .flickity-prev-next-button {\n      background: transparent;\n      display: block;\n      top: 72%;\n\n      path {\n        fill: #fff;\n        opacity: .4;\n      }\n    }\n\n    .flickity-prev-next-button {\n      top: 73.2%;\n\n      &.previous {\n        left: 31px;\n      }\n\n      &.next {\n        right: 20px;\n      }\n    }\n  }\n}\n\n\n",".center-scroll-arrows {\n  position: fixed;\n  left: 0;\n  top: 50%;\n  z-index: 50;\n\n  div {\n    background: rgba(0, 0, 0, .8);\n    height: 20px;\n    width: 20px;\n\n    &.next {\n      transform: rotate(180deg);\n    }\n\n    &:hover{\n      cursor: pointer;\n    }\n  }\n\n  &.hide-next {\n    .next {\n      visibility: hidden;\n    }\n  }\n\n  &.hide-previous {\n    .prev {\n      visibility: hidden;\n    }\n  }\n\n}","#thumbnails-nav{\n  background-color: rgba(0,0,0,.9);\n  height: 100vh;\n  left: 0;\n  opacity: 1;\n  overflow: scroll;\n  padding: 0 4vw 8vw;\n  position: fixed;\n  top: 0;\n  transition-duration: .1s;\n  transition-property: transform, opacity;\n  width: 100vw;\n  z-index: 300;\n\n  h1{\n    font-size: 18px;\n    letter-spacing: 3.7px;\n    height: 8vw;\n    width: 100%;\n    text-align: center;\n    margin: 0 0 -2vh 0 !important;\n    display: flex;\n    justify-content: center;\n    align-items: center;\n  }\n\n  .thumbnails-wrap{\n    align-content: flex-start;\n    display: flex;\n    flex-wrap: wrap;\n    justify-content: center;\n  }\n\n  .thumbnail-wrap{\n    height: 21vw;\n    padding: 2vh;\n    width: auto;\n  }\n\n  .thumbnail{\n    height: 100%;\n    width: auto;\n\n    &:hover{\n      cursor: pointer;\n    }\n  }\n\n  &.hide{\n    opacity: 0;\n    transform: translateX(-100vw);\n  }\n}\n\n#thumbnail-trigger{\n  $square-side-length: 10;\n  $square-margin-right: 3;\n  $square-margin-bottom: 3;\n  $wrap-width: ($square-margin-right + $square-side-length) * 3;\n  $wrap-height: ($square-margin-bottom + $square-side-length) * 2;\n  height: $wrap-height + px;\n  left: 10px;\n  position: fixed;\n  bottom: 8px;\n  transition-duration: .1s;\n  transition-property: top;\n  width: $wrap-width + px;\n  z-index: 301;\n\n  &:hover{\n    cursor: pointer;\n  }\n\n\n  >div{\n    background-color: #fff;\n    float: left;\n    height: $square-side-length + px;\n    margin: 0 $square-margin-right + px $square-margin-bottom + px 0;\n    width: $square-side-length + px;\n  }\n}\n\nbody:not(.template-projects) #thumbnail-trigger{\n  display: none;\n}",".artwork_piece {\n  $zoom-transition-duration: .5s;\n  display: flex;\n  justify-content: center; // max-height: 100vh !important;\n  max-width: 100vw !important;\n  min-width: 100%;\n  padding-top: 55px;\n  position: relative;\n  transition-property: width, height;\n  transition-duration: $zoom-transition-duration;\n  //width: 100vw;\n  // .zoom-wrap {\n  //     display: inline-block;\n  //     max-height: 100%;\n  //     position: relative;\n  //     text-align: center;\n\n  h3 {\n    position: absolute;\n    top: 0;\n    left: 0;\n  }\n\n  .image-wrap {\n    display: inline-block;\n    max-height: 100%;\n    max-width: 100%; // overflow: hidden;\n    position: relative;\n    text-align: center;\n    width: 100%;\n\n    .image-space-placeholder {\n      margin: 0 auto;\n      position: relative;\n      transition-duration: $zoom-transition-duration;\n      width: 100%;\n      z-index: 2;\n\n      .center-image-wrap, .zoomy-wrap {\n        align-items: baseline;\n        display: flex;\n        justify-content: center;\n      }\n\n      .main-img {\n        flex-grow: 0;\n        flex-shrink: 0;\n        //left: 0;\n        max-height: 100vh;\n        //max-width: 100vw;\n        position: static;\n        //top: 0;\n        transition-duration: $zoom-transition-duration;\n        //transition-duration: $zoom-transition-duration;\n        //transition-property: width, height, opacity;\n      }\n\n      .artwork-image-wrap {\n        margin: 0 auto;\n      }\n\n    }\n    // .zoomy-wrap {\n    //     display: block;\n    //     position: relative;\n    //     margin: 0 auto;\n    // }\n    .caption {\n      display: inline-block;\n      margin-right: 1%;\n      //width: calc(100% - 131px);\n      width: 81%;\n    }\n    .artwork-meta {\n      display: flex; // position: absolute;\n      position: static;\n      text-align: left; // top: 100%;\n      width: 100%;\n\n      .caption p {\n        margin: 0;\n      }\n\n      .actions {\n        display: block;\n        position: absolute;\n        right: 0;\n        flex-grow: 0;\n        flex-shrink: 0;\n        transition-duration: .5s;\n        z-index: 20;\n        div {\n          display: inline-block;\n          height: 30px;\n          width: 30px;\n          &:hover {\n            cursor: pointer;\n          }\n        }\n      }\n    }\n    //@media screen and (min-width: $main-content-max-width) {\n    //  min-width: $main-content-max-width;\n    //}\n    .piece-comparison {\n      $piece-comparison-padding: 3vh;\n      background: #fff;\n      display: flex;\n      left: 0;\n      margin: 0;\n      padding: 0;\n      position: fixed;\n      right: 0;\n      top: 0;\n      transform: translateY(110vh);\n      transition-duration: .5s;\n      z-index: 400;\n      height: 100vh;\n\n      .piece-comparison-wrap {\n        align-items: center;\n        display: flex;\n        height: 100%;\n        justify-content: center;\n        //margin: $piece-comparison-padding $piece-comparison-padding 0 $piece-comparison-padding;\n        margin: 0 auto;\n        overflow: hidden;\n        padding: 0;\n        width: 100%;\n\n        &.piece-comparison-processed{\n          visibility: visible !important;\n        }\n      }\n\n      .comparison-image-wrap {\n        align-items: center;\n        flex-direction: column;\n        flex-grow: 0;\n        display: flex;\n        justify-content: flex-end;\n        margin-bottom: 29%;\n        max-height: 100%;\n        //overflow: hidden;\n        padding-bottom: $piece-comparison-padding;\n        position: absolute;\n        top: 4%;\n        z-index: 1;\n\n        .comparison-image {\n          flex-shrink: 1;\n          height: auto;\n          max-height: none;\n          max-width: none;\n          width: 100%;\n        }\n        .info-text {\n          p {\n            color: #0f0f0f;\n            display: inline;\n          }\n        }\n      }\n      .compared-to {\n        height: 100vh;\n        left: 0;\n        max-height: none;\n        max-width: none;\n        object-fit: cover;\n        position: absolute;\n        top: 0;\n        transition-duration: 250ms;\n        transition-property: width, height;\n        width: 100vw;\n      }\n      .close {\n        color: #0f0f0f;\n        position: absolute;\n        right: 20px;\n        top: 20px;\n        z-index: 5;\n\n        &:hover{\n          cursor: pointer;\n        }\n      }\n    }\n  }\n  &.show-info {\n    .piece-comparison {\n      transform: translateY(0vh);\n    }\n  }\n  //.image-centered-background {\n  //  background: rgba(0, 0, 0, .9);\n  //  bottom: 0;\n  //  left: 0;\n  //  right: 0;\n  //  top: 0;\n  //  opacity: 0;\n  //  position: relative;\n  //  //transition-duration: .100s;\n  //  //transition-property: opacity;\n  //  z-index: 1;\n  //}\n  .zoomy-wrap {\n    height: 100%;\n    position: absolute;\n    top: 0;\n    width: 100%;\n    z-index: 10;\n\n    .zoom-img {\n      background-color: hsla(0, 0%, 6%, 1.0);\n      position: absolute;\n      //left: 0;\n      max-height: none;\n      max-width: none;\n      padding: 10px;\n      //top: 0;\n      width: 150%;\n      height: auto;\n    }\n\n    .mouse-map-wrap {\n      align-items: center;\n      background-color: hsla(0,0,11%,1);\n      background-origin: border-box;\n      background-repeat: no-repeat;\n      background-size: 100%;\n      display: flex;\n      height: 100%;\n      justify-content: center;\n      overflow: hidden;\n      opacity: 0;\n      position: relative;\n      transition-duration: $zoom-transition-duration;\n      transition-property: transform, background-size, width, height;\n      width: 100%;\n      &[zoom-enabled]:hover {\n        cursor: zoom-in;\n      }\n\n      .mouse-map {\n        opacity: .4;\n        height: 100%;\n        width: 100%;\n        margin: 0 auto;\n        transition-duration: $zoom-transition-duration;\n        transition-property: transform, background-size, width, height;\n      }\n    }\n  }\n  &.zoomed {\n    .mouse-map-wrap {\n      opacity: 1;\n\n      &:hover {\n        cursor: zoom-out !important;\n      }\n    }\n    .main-img {\n      visibility: hidden;\n    }\n  }\n\n  &.centered {\n    //height: 100vh;\n    //width: 100vw;\n\n    .image-space-placeholder {\n      z-index: 50;\n    }\n\n    .center-image-wrap, .zoomy-wrap {\n      align-items: center !important;\n      bottom: 0;\n      height: auto !important;\n      position: fixed;\n      left: 0;\n      right: 0;\n      top: 0;\n    }\n\n    &.height {\n\n      .main-img {\n        //height: 100vh !important;\n        //max-width: 100vw !important;\n        //width: auto !important;\n      }\n    }\n\n    &.width {\n      //height: 100vh !important;\n      //left: 0;\n      //position: fixed;\n      //top: 0;\n      //width: 100vw !important;\n\n      .main-img {\n        //height: auto !important;\n        //width: 100vw !important;\n        //max-width: 100vw !important;\n      }\n    }\n\n    .artwork-meta {\n      $width-displayed: 40px;\n      background-color: hsla(0, 0%, 10%, 1);\n      align-items: center;\n      bottom: 0;\n      display: flex;\n      justify-content: space-between;\n      left: calc(100vw - #{$width-displayed});\n      padding: 0;\n      position: fixed;\n      transition-duration: $zoom-transition-duration;\n      transition-property: left;\n      width: 100vw;\n      z-index: 302;\n\n      .artwork_piece {\n        width: auto;\n      }\n\n      &:before {\n        content: '';\n        height: 30px;\n        width: 30px;\n        border: solid white;\n        border-width: 0 3px 3px 0;\n        display: inline-block;\n        padding: 3px;\n        transform: rotate(135deg);\n        position: absolute;\n        left: 12px;\n        bottom: 14px;\n      }\n\n      &:hover {\n        left: 0;\n        padding-left: 1.2em;\n        padding-right: 1.2em;\n\n      }\n\n      .caption {\n        padding: 20px 20px 20px 41px;\n        width: 81%;\n\n        p {\n          text-align: center;\n        }\n      }\n\n      .actions {\n        position: static;\n      }\n    }\n\n    &.width {\n      .image-space-placeholder, .image-ratio-holder {\n        width: 100%;\n      }\n    }\n\n    &.height {\n      .image-wrap, .image-space-placeholder, .image-ratio-holder {\n        width: 100%;\n      }\n    }\n  }\n\n  //&.width{\n  //}\n  //\n  //&.height{\n  //  .main-img{\n  //    max-height: 95vh;\n  //  }\n  //}\n  &:not(.zoomed) {\n    .artwork-meta {\n      &:hover {\n        bottom: 0;\n        .caption p {\n          opacity: 1;\n        }\n      }\n    }\n  }\n  &.centered-image-transition-duration {\n\n    .main-img {\n      transition-duration: $zoom-transition-duration;\n    }\n\n    .zoomy-wrap{\n      //align-items: center !important;\n      //bottom: 0;\n      //height: auto !important;\n      //position: fixed;\n      //left: 0;\n      //right: 0;\n      //top: 0;\n    }\n  }\n\n  &.zoomed-delay {\n    .mouse-map-wrap {\n      opacity: 1 !important;\n    }\n  }\n  \n  .actions .zoom{\n    display: none !important;\n  }\n\n  &[zoom-enabled]{\n    .actions .zoom{\n      display: inline-block !important;\n    }\n  }\n}\n\nbody.orientation-landscape {\n  .artwork_piece {\n    .zoom-wrap {\n      img {\n      }\n    }\n  }\n}\n\nbody.artworks-processed {\n  .artwork_piece {\n    width: 100vw;\n  }\n}\n\nbody {\n  //&.centered-image-background-show {\n  //  .main > div {\n  //    transition-duration: .25s;\n  //  }\n  //  .image-centered-background {\n  //    position: fixed !important;\n  //  }\n  //  .main-img {\n  //    z-index: 2;\n  //  }\n  //  .mouse-map {\n  //    z-index: 2;\n  //  }\n  //}\n  &.centered-image {\n    .main > * {\n      opacity: 0;\n      &.centered {\n        opacity: 1 !important;\n\n        h3{\n          opacity: 0;\n        }\n      }\n    }\n  }\n  &.is-touch {\n    @include nonAnimatingMobile;\n    &.zoomed {\n      overflow: hidden;\n    }\n  }\n  &.viewport-resizing {\n    .artwork_piece {\n      max-width: 100% !important;\n    }\n  }\n  &.orientation-landscape {\n    .centered {\n\n    }\n    &.zoomed {\n      .artwork-meta {\n        z-index: 0;\n      }\n    }\n  }\n  &.orientation-portrait {\n  }\n\n  @media screen and (max-width: $main-content-max-width + 30px) {\n    @include nonAnimatingMobile;\n  }\n}\n\nbody.template-projects {\n  header.banner {\n    margin-bottom: 121px;\n  }\n\n  .page-header {\n    display: none;\n  }\n}",".dev-share-buttons{\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  position: absolute;\n\n  a{\n    display: inline-block;\n    padding: 10px;\n    margin: 0 5px;\n  }\n\n  .link-input-wrap{\n    display: flex;\n    justify-content: center;\n    left: 0;\n    position: absolute;\n    width: 100%;\n    top: 40%;\n\n    input{\n      width: 50%;\n    }\n  }\n}\n",".body_text{\n  p{\n    &:last-child{\n      margin-bottom: 0;\n    }\n  }\n}\n","#splash-modal{\n  display: block;\n  background-color: $background;\n  background-size: cover;\n  background-position: center;\n  height: 100vh;\n  left: 0;\n  opacity: 0;\n  position: fixed;\n  top: 0;\n  transition-duration: .25s;\n  transition-property: opacity;\n  width: 100vw;\n  z-index: -1;\n\n  &:hover{\n    cursor: pointer;\n  }\n}\n\n.show-splash{\n  #splash-modal{\n    opacity: 1;\n    z-index: 400;\n  }\n}\n\n.show-splash-transition{\n  #splash-modal{\n    z-index: 400;\n  }\n}\n","// TODO: .banner .nav li {}\n// TODO: .banner .nav a {}\nheader.banner {\n  margin-bottom: 70px;\n\n  .container {\n    overflow: auto;\n\n    .brand {\n      background-color: $background;\n      display: block;\n      height: 117px;\n      line-height: 1em;\n      margin: 0;\n      text-align: center;\n      padding: 4vh 0 9.5vh;\n      font-size: 30px;\n      font-weight: bold;\n      position: static;\n      top: 0;\n      left: 0;\n      width: 100%;\n\n      span{\n        display: block;\n        background: url($image-path + 'logo.png') no-repeat center transparent;\n        height: 88px;\n      }\n    }\n    .nav-primary {\n      z-index: 300;\n      .nav {\n        padding: 0;\n        li {\n          display: inline-block;\n          list-style-type: none;\n          margin: 0 .3em;\n        }\n      }\n    }\n  }\n}\n\n.hamburger{\n  z-index: 307 !important;\n}\n\n.home {\n  .hamburger, .nav-primary {\n    display: none;\n  }\n}",".blog{\n\n  .main{\n    //margin: 0 auto;\n    //max-width: 470px;\n    //width: 100% !important;\n\n    .posts-main{\n\n    }\n  }\n}\n.post-main-content figure{\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n}","body#tinymce {\n  margin: 12px !important;\n}\n","$whitney-regular: \"Whitney SSm A\", \"Whitney SSm B\";\nbody.front {\n  color: #fff;\n  font-family: $whitney-regular;\n  font-weight: 400;\n  font-style: normal;\n  line-height: 23px;\n\n  a{\n    color: #fff;\n    text-decoration: none;\n  }\n\n  .fullscreen {\n    background: rgba(38, 38, 38, 1.0);\n\n    .fullscreen-modal{\n      background-color: rgba(0,0,0,.8);\n    }\n\n    .main {\n      > * {\n        margin-bottom: 33px;\n      }\n\n      .page-header {\n        margin-top: 40px;\n        margin-bottom: 60px;\n\n        h1 {\n          font-size: 18px;\n          letter-spacing: 3.7px;\n        }\n      }\n\n      h1, h2, h3, h4, h5 {\n        font-weight: 100;\n        font-size: 14px;\n        letter-spacing: 0.21em;\n        text-transform: uppercase;\n      }\n\n      .artwork_piece {\n        .artwork-meta {\n          margin-top: 10px;\n\n          .caption {\n            p {\n              color: rgba(188, 188, 188, 1.0);\n              font-size: 15px;\n              line-height: 19px;\n            }\n          }\n        }\n      }\n    }\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 23 */
/*!*********************************!*\
  !*** ./scripts/artwork-info.js ***!
  \*********************************/
/*! exports provided: artworkInfo */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "artworkInfo", function() { return artworkInfo; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_body_scroll_lock__ = __webpack_require__(/*! body-scroll-lock */ 18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_body_scroll_lock___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_body_scroll_lock__);

var artworkInfo = {
	showing: false,
	buttons: null,
	init: function () {
		var buttons = document.querySelectorAll(".artwork_piece .actions .info");
		buttons.forEach(function (button) {
			var artworkWrap = button.closest(".artwork_piece");

			var infoData = {
				button: button,
				artworkWrap: artworkWrap,
				close: artworkWrap.querySelector(".close"),
			};

			// this.buttons.push(infoData);

			infoData.close.addEventListener("click", this.toggleInfo.bind(infoData));
			button.addEventListener("click", this.toggleInfo.bind(infoData));
		}, this);
	},
	// reset: function(){
	// 	this.buttons.forEach(function(button) {
	// 		infoData.close.removeEventListener("click", this.toggleInfo.bind(infoData));
	// 		button.removeEventListener("click", this.toggleInfo.bind(infoData));
	// 	}, this);
	// },
	toggleInfo: function () {
		var infoData = this;
		// setTimeout(function () {
		// 	window.scrollBy({
		// 		top: -30,
		// 		left: 0,
		// 		behavior: 'auto'
		// 	});
		// }, 0);
		// disable or enbale scrolling
		// console.log(window.innerHeight);
		if (artworkInfo.showing) {
			Object(__WEBPACK_IMPORTED_MODULE_0_body_scroll_lock__["clearAllBodyScrollLocks"])();
		} else {
			Object(__WEBPACK_IMPORTED_MODULE_0_body_scroll_lock__["disableBodyScroll"])();
		}
		infoData.artworkWrap.classList.toggle("show-info");



		//toggle artwork info showing variable
		artworkInfo.showing = !artworkInfo.showing;
	},
};

/***/ }),
/* 24 */
/*!*****************************!*\
  !*** ./scripts/st-audio.js ***!
  \*****************************/
/*! exports provided: stAudio */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "stAudio", function() { return stAudio; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_howler__ = __webpack_require__(/*! howler */ 35);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_howler___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_howler__);


var audio = {
  players: Array(),
  init: function() {
    this.reset();
    var playerDoms = document.querySelectorAll(".audio-piece");
    playerDoms.forEach(function(player) {
      this.initPlayer(player);
    }, this);
  },
  reset: function() {
    this.players = Array();
  },
  formatTime: function(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = secs - minutes * 60 || 0;

    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  },

  setElementWidth: function(element, width) {
    element.style.width = width + "px";
  },

  setSeek: function(player, percent) {
    player.seek(player.duration() * percent);
  },

  seekClick: function(e) {
    // e = Mouse click event.
    var rect = e.currentTarget.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    var percent = x / rect.width;
    stAudio.setSeek(this, percent);
    if (!this.playing()) {
      stAudio.setElementWidth(e.currentTarget.querySelector(".span-value"), x);
      //set timer
      e.currentTarget.querySelector(".timer").innerHTML = stAudio.formatTime(Math.round(this.seek()));
    }
    // console.log(x);
  },

  seekHover: function(e) {
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left; //x position within the element.
    // var y = e.clientY - rect.top; //y position within the element.
    stAudio.setElementWidth(this, x);
  },

  step: function() {
    // Determine our current seek position.
    var seek = this.this.seek() || 0;
    this.timer.innerHTML = stAudio.formatTime(Math.round(seek));
    this.progress.style.width = (seek / this.this.duration() * 100 || 0) + "%";

    // If the sound is still playing, continue stepping.
    if (this.this.playing()) {
      requestAnimationFrame(stAudio.step.bind(this));
    }
  },

  pauseAllPlayers: function() {
    this.players.forEach(function(player) {
      if (player.playing()) {
        player.pause();
      }
    });
  },

  play: function() {
    // only play if not already playing
    if (!this.playing()) {
      stAudio.pauseAllPlayers();
      this.play();
    }
  },

  setAudioEvents: function(audio, player, progress, progressHover, progressWrap) {

    audio.querySelector(".play").addEventListener("click", this.play.bind(player));

    audio.querySelector(".pause").addEventListener("click", function() {
      if (player.playing()) {
        player.pause();
      }
    });

    progressWrap.addEventListener("mousemove", this.seekHover.bind(progressHover));
    progressWrap.addEventListener("click", this.seekClick.bind(player));
  },

  //spin up audio
  initPlayer: function(audio) {
    var url = audio.getAttribute("data-url");
    var duration = audio.querySelector(".duration");
    var timer = audio.querySelector(".timer");
    var progressWrap = audio.querySelector(".progress.span-value-wrap");
    var progress = progressWrap.querySelector(".span-value");
    var progressHover = progress.querySelector(".span-value-jump");
    var player = new __WEBPACK_IMPORTED_MODULE_0_howler__["Howl"]({
      src: url,
      loop: false,
      volume: 1,
      preload: true,
			onload: function(){
				// Display the duration.
				duration.innerHTML = stAudio.formatTime(Math.round(player.duration()));
			},
      onplay: function() {
        var data = { this: this, timer: timer, progress: progress };
        // Start upating the progress of the track.
        window.requestAnimationFrame(stAudio.step.bind(data));
      },
    });


    this.players.push(player);

    this.setAudioEvents(audio, player, progress, progressHover, progressWrap);
  },

  stopAllPlayers: function() {
    __WEBPACK_IMPORTED_MODULE_0_howler__["Howler"].unload();
  },
};

var stAudio = audio;

/***/ }),
/* 25 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 26 */
/*!******************************!*\
  !*** ./scripts/more-info.js ***!
  \******************************/
/*! exports provided: moreInfo */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "moreInfo", function() { return moreInfo; });
// import utilities from './utilities';
var info = {
	infoButtons: null,
	init: function () {
		this.infoButtons = document.querySelectorAll(".actions .info");
			// console.log('begin');
		this.infoButtons.forEach(function (button) {
			var imageWrap = button.closest(".image-wrap");
			var pieceComparisonWrap = imageWrap.querySelector(".piece-comparison-wrap");
			pieceComparisonWrap.style.width = '';

			// var pieceComparisonWrapWidthPixels = pieceComparisonWrap.clientWidth;
			// var pieceComparisonWrapHeightPixels = pieceComparisonWrap.clientHeight;

			// piece image
			// var {piece, pieceImageNaturalWidth, pieceImageNaturalHeight, pieceWidthInches, pieceHeightInches, pieceHeightImageRatio, pieceWidthImageRatio} = this.getImageDimensions(pieceComparisonWrap, button);
			var piece = pieceComparisonWrap.querySelector(".comparison-image");
			var pieceWidthInches = button.getAttribute("data-width");
			var pieceImageDimensions = this.getImageDimensions(piece, pieceWidthInches);
			// console.log(pieceImageDimensions);
			// console.log('pieceComparisonWrapHeightPixels > window.innerHeight: ' + pieceComparisonWrapHeightPixels, window.innerHeight);
			// if(pieceComparisonWrapHeightPixels > window.innerHeight){
			// 	pieceComparisonWrapHeightPixels = window.innerHeight;
			// }
			//
			// console.log(pieceComparisonWrapHeightPixels);

			// forscale image
			var forScale = pieceComparisonWrap.querySelector(".compared-to");
			var forScaleScaleWidthInches = button.getAttribute("data-compare-width-inches");
			var forScaleDimensions = this.getImageDimensions(forScale, forScaleScaleWidthInches, 'forscale');


			// get the new dimensions
			// var dimensionValues = this.calculateNewDimensions(pieceWidthInches, pieceImageNaturalWidth, pieceImageNaturalHeight, forScaleWidthInches, pieceHeightInches, forScaleHeightInches, pieceComparisonWrapWidthPixels, pieceComparisonWrapHeightPixels, pieceHeightImageRatio, pieceWidthImageRatio, forScaleHeightImageRatio, piece, forScale, pieceComparisonWrap);
			var dimensionValues = this.calculateNewDimensions(pieceImageDimensions, forScaleDimensions);
			//console.log('dimensionValues: ', JSON.stringify(dimensionValues));

			piece.style.width = dimensionValues.width + "px";
			piece.style.height = dimensionValues.height + "px";
			// forScale.style.width = dimensionValues.forScaleWidthPixels + "px";
			// forScale.style.height = dimensionValues.forScaleHeightPixels + "px";

			// add processed class, toggles visibility
			pieceComparisonWrap.classList.add('piece-comparison-processed');
		}, this);

	},
	getImageDimensions: function (element, widthInches, type) {
		if ( type === void 0 ) type = 'piece';

		var fileNaturalWidth = 0;
		var fileNaturalHeight = 0;
		if (type === 'piece') {
			fileNaturalWidth = element.naturalWidth;
			fileNaturalHeight = element.naturalHeight;
		} else {
			fileNaturalWidth = element.getAttribute('data-file-width');
			fileNaturalHeight = element.getAttribute('data-file-height');
		}
		var naturalFileRatio = fileNaturalWidth / fileNaturalHeight;
		// var heightInches = button.getAttribute("data-height");
		var heightInches = widthInches / naturalFileRatio;
		var heightRatioInches = heightInches / widthInches;
		var widthRatioInches = widthInches / heightInches;
		return {
			image: element,
			fileNaturalWidth: fileNaturalWidth,
			fileNaturalHeight: fileNaturalHeight,
			heightInches: heightInches,
			heightRatioInches: heightRatioInches,
			widthInches: widthInches,
			widthRatioInches: widthRatioInches,
		};
	},
	getNewValue: function (value) {
		// return value - 1;
		return value * .997531;
	},
	recalculateNewDimensions: function (dimensionValues) {
		var this$1 = this;

		// var originalHeightRatio = dimensionValues.pieceHeightPixels / dimensionValues.forScaleHeightPixels;
		// var originalWidthRatio = dimensionValues.pieceWidthPixels / dimensionValues.forScaleWidthPixels;

		do {
			// todo: this may only work with wider than tall images, may need to add alternate
			// get a slightly smaller width value
			dimensionValues.pieceWidthPixels = this$1.getNewValue(dimensionValues.pieceWidthPixels);
			// dimensionValues.pieceHeightPixels = this.getNewValue(dimensionValues.pieceHeightPixels);

			// get the new height value the piece based on the newly found width
			dimensionValues.pieceHeightPixels = this$1.getImageHeightPixels(dimensionValues.pieceWidthPixels, dimensionValues.pieceHeightImageRatio);

			// get a slightly smaller width for the forscale image
			dimensionValues.forScaleWidthPixels = this$1.getNewValue(dimensionValues.forScaleWidthPixels);
			// dimensionValues.forScaleHeightPixels = this.getNewValue(dimensionValues.forScaleHeightPixels);

			// get forsacle height value based on newly found forscale width value
			dimensionValues.forScaleHeightPixels = this$1.getImageHeightPixels(dimensionValues.forScaleWidthPixels, dimensionValues.forScaleHeightImageRatio);
		} while (
			//make sure piece height is shorter than piece comparison wrap height
		dimensionValues.pieceHeightPixels > dimensionValues.pieceComparisonWrapHeightPixels ||
		//make sure forscale height is shorter than piece comparison wrap height
		dimensionValues.forScaleHeightPixels > dimensionValues.pieceComparisonWrapHeightPixels ||
		(dimensionValues.pieceWidthPixels + dimensionValues.forScaleWidthPixels) > dimensionValues.pieceComparisonWrapWidthPixels);
		return {
			pieceWidthPixels: dimensionValues.pieceWidthPixels,
			pieceHeightPixels: dimensionValues.pieceHeightPixels,
			forScaleWidthPixels: dimensionValues.forScaleWidthPixels,
			forScaleHeightPixels: dimensionValues.forScaleHeightPixels,
		};
	},
	getImageHeightPixels: function (imageWidthPixels, imageHeightRatio) {
		return imageWidthPixels * imageHeightRatio;
	},
	getImageWidthPixels: function (imageHeightPixels, imageWidthRatio) {
		return Math.floor(imageHeightPixels * imageWidthRatio);
	},
	calculateNewDimensions: function (pieceDimensions, forScaleDimensions) {

		// if the image rotation is portrait we find who is the widest, if landscape then we find who is tallest
		// we then set the baseline height or width to the spacing we have from pieceComparisonWrapHeightPixels or pieceComparisonWrapWidthPixels
		// var widthBaseline = null;
		// var heightBaseline = null;
		//
		// var pieceImageRotation = utilities.getImageSizeChangeTechnique(pieceDimensions.image, pieceComparisonWrap);
		// // var forScaleImageRotation = utilities.getImageSizeChangeTechnique(forScaleDimensions.image, pieceComparisonWrap);
		//
		// var pieceWidthPixels = null;
		// var pieceHeightPixels = null;

		// TODO: get if window is wider than tall or taller than wide.
		//
		// console.log('forScaleDimensions.image.clientHeight, forScaleDimensions.image.clientWidth: ' + forScaleDimensions.image.clientHeight, forScaleDimensions.image.clientWidth);
		// get actual pixel width of what forscale image should be based on it's current height
		var forScaleWidth = forScaleDimensions.image.clientHeight * (forScaleDimensions.fileNaturalWidth / forScaleDimensions.fileNaturalHeight);
		var forScaleHeight = forScaleDimensions.image.clientWidth * (forScaleDimensions.fileNaturalHeight / forScaleDimensions.fileNaturalWidth);

		var pieceHeight = 0;
		var pieceWidth = 0;
		// scale the piece to fit based on it's width/height height/width ratio to the for scale image.
		// this is the ratio of piece width to forscale width
		var pieceToScaleWidthRatio = pieceDimensions.widthInches / forScaleDimensions.widthInches;
		var pieceToScaleHeightRatio = pieceDimensions.heightInches / forScaleDimensions.heightInches;

		if (forScaleHeight < forScaleWidth) {
			pieceHeight = pieceToScaleHeightRatio * forScaleDimensions.image.clientHeight;
			pieceWidth = pieceToScaleWidthRatio * forScaleWidth;
		} else {
			pieceHeight = pieceToScaleHeightRatio * forScaleHeight;
			pieceWidth = pieceToScaleWidthRatio * forScaleDimensions.image.clientWidth;
		}
		// set and go?

		// pieceDimensions.image.style.height = pieceHeight + 'px';
		// pieceDimensions.image.style.width = pieceWidth + 'px';
		// console.log(pieceWidth, pieceHeight);

		return {width: pieceWidth, height: pieceHeight};


		// if (pieceImageRotation === 'width') {
		// 	widthBaseline = pieceComparisonWrapWidthPixels;
		//
		// 	// calculate the pixel amounts based off of the baseline
		//
		// 	// piece values
		// 	pieceWidthPixels = widthBaseline;
		// 	pieceHeightPixels = this.getImageHeightPixels(pieceWidthPixels, pieceDimensions.heightRatioInches);
		// } else {
		// 	heightBaseline = pieceComparisonWrapHeightPixels;
		// 	// calculate the pixel amounts based off of the baseline
		//
		// 	// piece values
		// 	pieceHeightPixels = heightBaseline;
		// 	pieceWidthPixels = this.getImageWidthPixels(pieceHeightPixels, pieceDimensions.widthRatioInches);
		//
		// }
		//
		// // this is the ratio of piece width to forscale width
		// var pieceToScaleWidthRatio = pieceDimensions.widthInches / forScaleDimensions.widthInches;
		// var pieceToScaleHeightRatio = pieceDimensions.heightInches / forScaleDimensions.heightInches;
		//
		//
		// // get forscale pixel dimensions based of piecetoscale ratios
		// var forScaleWidthPixels = Math.floor(pieceWidthPixels / pieceToScaleWidthRatio);
		// var forScaleHeightPixels = Math.floor(pieceHeightPixels / pieceToScaleHeightRatio);
		//
		// var dimensionValues = {
		// 	pieceWidthPixels: Math.floor(pieceWidthPixels),
		// 	pieceHeightPixels: pieceHeightPixels,
		// 	forScaleWidthPixels: forScaleWidthPixels,
		// 	forScaleHeightPixels: forScaleHeightPixels,
		// 	forScaleHeightImageRatio: forScaleDimensions.heightRatioInches,
		// 	pieceHeightImageRatio: pieceDimensions.heightRatioInches,
		// 	pieceComparisonWrapWidthPixels: pieceComparisonWrapWidthPixels,
		// 	pieceComparisonWrapHeightPixels: pieceComparisonWrapHeightPixels,
		// 	pieceToScaleWidthRatio: pieceToScaleWidthRatio,
		// 	pieceToScaleHeightRatio: pieceToScaleHeightRatio,
		// };
		//
		//
		// dimensionValues = Object.assign(this.recalculateNewDimensions(dimensionValues), dimensionValues);
		//
		// // let's put some space between the images
		// var betweenImageMarginPixels = pieceComparisonWrapWidthPixels * .03;
		//
		// var totalWidth = dimensionValues.pieceWidthPixels + dimensionValues.forScaleWidthPixels;
		// pieceComparisonWrap.style.width = totalWidth + 'px';
		// dimensionValues.pieceWidthPixels = dimensionValues.pieceWidthPixels - betweenImageMarginPixels;
		// dimensionValues.forScaleWidthPixels = dimensionValues.forScaleWidthPixels - betweenImageMarginPixels;
		//
		// // do the heights
		// dimensionValues.forScaleHeightPixels = this.getImageHeightPixels(dimensionValues.forScaleWidthPixels, dimensionValues.forScaleHeightImageRatio);
		// dimensionValues.pieceHeightPixels = this.getImageHeightPixels(dimensionValues.pieceWidthPixels, dimensionValues.pieceHeightImageRatio);
		//
		// return dimensionValues;
	},
};

var moreInfo = info;

/***/ }),
/* 27 */
/*!**********************************!*\
  !*** ./scripts/mousePosition.js ***!
  \**********************************/
/*! exports provided: mousePosition */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mousePosition", function() { return mousePosition; });
var mousePosition = {
	// Mouse position relative to the document
	// From http://www.quirksmode.org/js/events_properties.html
	mousePositionDocument: function (e) {
		var posx = 0;
		var posy = 0;
		if (!e) {
			/* eslint-disable */
			var e = window.event;
			/* eslint-enable */
		}
		if (e.pageX || e.pageY) {
			posx = e.pageX;
			posy = e.pageY;
		} else if (e.clientX || e.clientY) {
			posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
			posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
		}
		return {
			x: posx,
			y: posy,
		};
	},

	// Find out where an element is on the page
	findPos: function (obj) {
		var rect = obj.getBoundingClientRect();
		return {top: rect.top + window.scrollY, left: rect.left + window.scrollX}
	},

	// Mouse position relative to the element
	mousePositionElement: function (target) {
		var mousePosDoc = this.mousePositionDocument.call(this);
		var targetPos = this.findPos(target);
		var posx = mousePosDoc.x - targetPos.left;
		var posy = mousePosDoc.y - targetPos.top;
		return {
			x: posx,
			y: posy,
		};
	},
};

/***/ }),
/* 28 */
/*!**********************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/underscore/underscore.js ***!
  \**********************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, module) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;//     Underscore.js 1.9.1
//     http://underscorejs.org
//     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self == 'object' && self.self === self && self ||
            typeof global == 'object' && global.global === global && global ||
            this ||
            {};

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for their old module API. If we're in
  // the browser, add `_` as a global object.
  // (`nodeType` is checked to ensure that `module`
  // and `exports` are not HTML elements.)
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.9.1';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  var builtinIteratee;

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
    return _.property(value);
  };

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only argCount argument.
  _.iteratee = builtinIteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  var restArguments = function(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var shallowProperty = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  var has = function(obj, path) {
    return obj != null && hasOwnProperty.call(obj, path);
  }

  var deepGet = function(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = shallowProperty('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  var createReduce = function(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  };

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (_.isFunction(path)) {
      func = path;
    } else if (_.isArray(path)) {
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return _.map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection.
  _.shuffle = function(obj) {
    return _.sample(obj, Infinity);
  };

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = _.random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (has(result, key)) result[key]++; else result[key] = 1;
  });

  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (_.isString(obj)) {
      // Keep surrogate pair characters together
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null || array.length < 1) return n == null ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, Boolean);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    output = output || [];
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        // Flatten current level of array or arguments object.
        if (shallow) {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        } else {
          flatten(value, shallow, strict, output);
          idx = output.length;
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = restArguments(function(array, otherArrays) {
    return _.difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = restArguments(function(arrays) {
    return _.uniq(flatten(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = restArguments(function(array, rest) {
    rest = flatten(rest, true, true);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  });

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = restArguments(_.unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of _.pairs.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions.
  var createPredicateIndexFinder = function(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  };

  // Returns the first index on an array-like that passes a predicate test.
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions.
  var createIndexFinder = function(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  _.chunk = function(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments.
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = restArguments(function(func, context, args) {
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  _.partial = restArguments(function(func, boundArgs) {
    var placeholder = _.partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  _.partial.placeholder = _;

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = restArguments(function(obj, keys) {
    keys = flatten(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = _.bind(obj[key], obj);
    }
  });

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, result;

    var later = function(context, args) {
      timeout = null;
      if (args) result = func.apply(context, args);
    };

    var debounced = restArguments(function(args) {
      if (timeout) clearTimeout(timeout);
      if (immediate) {
        var callNow = !timeout;
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(this, args);
      } else {
        timeout = _.delay(later, wait, this, args);
      }

      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };

    return debounced;
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  _.restArguments = restArguments;

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  var collectNonEnumProps = function(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  };

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object.
  // In contrast to _.map it returns an object.
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = _.keys(obj),
        length = keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of _.object.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`.
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test.
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Internal pick helper function to determine if `obj` has key `key`.
  var keyInObj = function(value, key, obj) {
    return key in obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = _.allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the blacklisted properties.
  _.omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = _.map(flatten(keys, false, false), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  });

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq, deepEq;
  eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  };

  // Internal recursive comparison function for `isEqual`.
  deepEq = function(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`?
  _.isNaN = function(obj) {
    return _.isNumber(obj) && isNaN(obj);
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, path) {
    if (!_.isArray(path)) {
      return has(obj, path);
    }
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (obj == null || !hasOwnProperty.call(obj, key)) {
        return false;
      }
      obj = obj[key];
    }
    return !!length;
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indexes.
  _.property = function(path) {
    if (!_.isArray(path)) {
      return shallowProperty(path);
    }
    return function(obj) {
      return deepGet(obj, path);
    };
  };

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    if (obj == null) {
      return function(){};
    }
    return function(path) {
      return !_.isArray(path) ? obj[path] : deepGet(obj, path);
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

  // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  _.result = function(obj, path, fallback) {
    if (!_.isArray(path)) path = [path];
    var length = path.length;
    if (!length) {
      return _.isFunction(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = _.isFunction(prop) ? prop.call(obj) : prop;
    }
    return obj;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var chainResult = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_, args));
      };
    });
    return _;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return chainResult(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return chainResult(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return String(this._wrapped);
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return _;
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }
}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 25), __webpack_require__(/*! ./../webpack/buildin/module.js */ 1)(module)))

/***/ }),
/* 29 */
/*!****************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/process/browser.js ***!
  \****************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 30 */
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** multi ./build/util/../helpers/hmr-client.js ./scripts/splash-page.js ./scripts/utilities.js ./scripts/youtube.js ./scripts/artwork-info.js ./scripts/st-audio.js ./scripts/more-info.js ./scripts/mousePosition.js ./scripts/zoomy.js ./scripts/thumbnail-nav.js ./scripts/nakasentro.js ./scripts/center-scroll-to.js ./scripts/main.js ./styles/main.scss ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/resources/assets/build/util/../helpers/hmr-client.js */5);
__webpack_require__(/*! ./scripts/splash-page.js */31);
__webpack_require__(/*! ./scripts/utilities.js */2);
__webpack_require__(/*! ./scripts/youtube.js */33);
__webpack_require__(/*! ./scripts/artwork-info.js */23);
__webpack_require__(/*! ./scripts/st-audio.js */24);
__webpack_require__(/*! ./scripts/more-info.js */26);
__webpack_require__(/*! ./scripts/mousePosition.js */27);
__webpack_require__(/*! ./scripts/zoomy.js */19);
__webpack_require__(/*! ./scripts/thumbnail-nav.js */21);
__webpack_require__(/*! ./scripts/nakasentro.js */3);
__webpack_require__(/*! ./scripts/center-scroll-to.js */20);
__webpack_require__(/*! ./scripts/main.js */37);
module.exports = __webpack_require__(/*! ./styles/main.scss */56);


/***/ }),
/* 31 */
/*!********************************!*\
  !*** ./scripts/splash-page.js ***!
  \********************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_cookie__ = __webpack_require__(/*! js-cookie */ 32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_js_cookie___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_js_cookie__);


var modal = document.getElementById('splash-modal');
if (__WEBPACK_IMPORTED_MODULE_0_js_cookie___default.a.get('splashseen') === undefined) {
	document.body.classList.add('show-splash', 'show-splash-transition');
	modal.addEventListener('click', function () {

			/* eslint-disable */
			Barba.FullScreen.goFullScreen();
			/* eslint-enable */
		window.setTimeout(function () {
			document.body.classList.remove('show-splash');
			window.setTimeout(function () {
				document.body.classList.remove('show-splash-transition');
			}, 250);
		}, 1000);
		__WEBPACK_IMPORTED_MODULE_0_js_cookie___default.a.set('splashseen', 'true', {expires: 365});
	});
}

/***/ }),
/* 32 */
/*!************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/js-cookie/src/js.cookie.js ***!
  \************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * JavaScript Cookie v2.2.0
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
		registeredInModuleLoader = true;
	}
	if (true) {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				// We're using "expires" because "max-age" is not supported by IE
				attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				var stringifiedAttributes = '';

				for (var attributeName in attributes) {
					if (!attributes[attributeName]) {
						continue;
					}
					stringifiedAttributes += '; ' + attributeName;
					if (attributes[attributeName] === true) {
						continue;
					}
					stringifiedAttributes += '=' + attributes[attributeName];
				}
				return (document.cookie = key + '=' + value + stringifiedAttributes);
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!this.json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));


/***/ }),
/* 33 */
/*!****************************!*\
  !*** ./scripts/youtube.js ***!
  \****************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities__ = __webpack_require__(/*! ./utilities */ 2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utilities___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__utilities__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_reframe_js__ = __webpack_require__(/*! reframe.js */ 34);



// add youtube api script to the page
var tag = document.createElement('script');
tag.id = 'iframe-demo';
tag.src = 'http://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


/* eslint-disable */
var players = {};

window.onYouTubeIframeAPIReady = function () {

	// get all iframes where source contains youtube
	var iframes = Array.prototype.slice.call(document.querySelectorAll('.video iframe[src*="youtube"]'));
	iframes.map(function(iframe){
		var iframeWrap = iframe.closest('.iframe-wrap');
		var uniqueId = iframe.getAttribute('id');
		var button = __WEBPACK_IMPORTED_MODULE_0__utilities___default.a.getSiblingByClass(iframeWrap, 'play-button');
		players[uniqueId] = new YT.Player(uniqueId, {});

		button.addEventListener('click', function(){
			players[uniqueId].playVideo();
		});

		Object(__WEBPACK_IMPORTED_MODULE_1_reframe_js__["a" /* default */])(button.parentNode.querySelector("iframe"));
	});
};
/* eslint-enable */

/***/ }),
/* 34 */
/*!***************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/reframe.js/dist/reframe.es.js ***!
  \***************************************************************************************************************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
function reframe(target, cName) {
  var frames = typeof target === 'string' ? document.querySelectorAll(target) : target;
  var c = cName || 'js-reframe';
  if (!('length' in frames)) frames = [frames];
  for (var i = 0; i < frames.length; i += 1) {
    var frame = frames[i];
    var hasClass = frame.className.split(' ').indexOf(c) !== -1;
    if (hasClass) return;
    var hAttr = frame.getAttribute('height');
    var wAttr = frame.getAttribute('width');
    if (wAttr.indexOf('%') > -1 || frame.style.width.indexOf('%') > -1) return;
    var h = hAttr ? hAttr : frame.offsetHeight;
    var w = wAttr ? wAttr : frame.offsetWidth;
    var padding = h / w * 100;
    var div = document.createElement('div');
    div.className = c;
    var divStyles = div.style;
    divStyles.position = 'relative';
    divStyles.width = '100%';
    divStyles.paddingTop = padding + '%';
    var frameStyle = frame.style;
    frameStyle.position = 'absolute';
    frameStyle.width = '100%';
    frameStyle.height = '100%';
    frameStyle.left = '0';
    frameStyle.top = '0';
    frame.parentNode.insertBefore(div, frame);
    frame.parentNode.removeChild(frame);
    div.appendChild(frame);
  }
}

/* harmony default export */ __webpack_exports__["a"] = (reframe);


/***/ }),
/* 35 */
/*!*******************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/howler/dist/howler.js ***!
  \*******************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: Howl, Howler */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 *  howler.js v2.0.12
 *  howlerjs.com
 *
 *  (c) 2013-2018, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Create the global controller. All contained methods and properties apply
   * to all sounds that are currently playing or will be in the future.
   */
  var HowlerGlobal = function() {
    this.init();
  };
  HowlerGlobal.prototype = {
    /**
     * Initialize the global Howler object.
     * @return {Howler}
     */
    init: function() {
      var self = this || Howler;

      // Create a global ID counter.
      self._counter = 1000;

      // Internal properties.
      self._codecs = {};
      self._howls = [];
      self._muted = false;
      self._volume = 1;
      self._canPlayEvent = 'canplaythrough';
      self._navigator = (typeof window !== 'undefined' && window.navigator) ? window.navigator : null;

      // Public properties.
      self.masterGain = null;
      self.noAudio = false;
      self.usingWebAudio = true;
      self.autoSuspend = true;
      self.ctx = null;

      // Set to false to disable the auto iOS enabler.
      self.mobileAutoEnable = true;

      // Setup the various state values for global tracking.
      self._setup();

      return self;
    },

    /**
     * Get/set the global volume for all sounds.
     * @param  {Float} vol Volume from 0.0 to 1.0.
     * @return {Howler/Float}     Returns self or current volume.
     */
    volume: function(vol) {
      var self = this || Howler;
      vol = parseFloat(vol);

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        self._volume = vol;

        // Don't update any of the nodes if we are muted.
        if (self._muted) {
          return self;
        }

        // When using Web Audio, we just need to adjust the master gain.
        if (self.usingWebAudio) {
          self.masterGain.gain.setValueAtTime(vol, Howler.ctx.currentTime);
        }

        // Loop through and change volume for all HTML5 audio nodes.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and change the volumes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node) {
                sound._node.volume = sound._volume * vol;
              }
            }
          }
        }

        return self;
      }

      return self._volume;
    },

    /**
     * Handle muting and unmuting globally.
     * @param  {Boolean} muted Is muted or not.
     */
    mute: function(muted) {
      var self = this || Howler;

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      self._muted = muted;

      // With Web Audio, we just need to mute the master gain.
      if (self.usingWebAudio) {
        self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler.ctx.currentTime);
      }

      // Loop through and mute all HTML5 Audio nodes.
      for (var i=0; i<self._howls.length; i++) {
        if (!self._howls[i]._webAudio) {
          // Get all of the sounds in this Howl group.
          var ids = self._howls[i]._getSoundIds();

          // Loop through all sounds and mark the audio node as muted.
          for (var j=0; j<ids.length; j++) {
            var sound = self._howls[i]._soundById(ids[j]);

            if (sound && sound._node) {
              sound._node.muted = (muted) ? true : sound._muted;
            }
          }
        }
      }

      return self;
    },

    /**
     * Unload and destroy all currently loaded Howl objects.
     * @return {Howler}
     */
    unload: function() {
      var self = this || Howler;

      for (var i=self._howls.length-1; i>=0; i--) {
        self._howls[i].unload();
      }

      // Create a new AudioContext to make sure it is fully reset.
      if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== 'undefined') {
        self.ctx.close();
        self.ctx = null;
        setupAudioContext();
      }

      return self;
    },

    /**
     * Check for codec support of specific extension.
     * @param  {String} ext Audio file extention.
     * @return {Boolean}
     */
    codecs: function(ext) {
      return (this || Howler)._codecs[ext.replace(/^x-/, '')];
    },

    /**
     * Setup various state values for global tracking.
     * @return {Howler}
     */
    _setup: function() {
      var self = this || Howler;

      // Keeps track of the suspend/resume state of the AudioContext.
      self.state = self.ctx ? self.ctx.state || 'running' : 'running';

      // Automatically begin the 30-second suspend process
      self._autoSuspend();

      // Check if audio is available.
      if (!self.usingWebAudio) {
        // No audio is available on this system if noAudio is set to true.
        if (typeof Audio !== 'undefined') {
          try {
            var test = new Audio();

            // Check if the canplaythrough event is available.
            if (typeof test.oncanplaythrough === 'undefined') {
              self._canPlayEvent = 'canplay';
            }
          } catch(e) {
            self.noAudio = true;
          }
        } else {
          self.noAudio = true;
        }
      }

      // Test to make sure audio isn't disabled in Internet Explorer.
      try {
        var test = new Audio();
        if (test.muted) {
          self.noAudio = true;
        }
      } catch (e) {}

      // Check for supported codecs.
      if (!self.noAudio) {
        self._setupCodecs();
      }

      return self;
    },

    /**
     * Check for browser support for various codecs and cache the results.
     * @return {Howler}
     */
    _setupCodecs: function() {
      var self = this || Howler;
      var audioTest = null;

      // Must wrap in a try/catch because IE11 in server mode throws an error.
      try {
        audioTest = (typeof Audio !== 'undefined') ? new Audio() : null;
      } catch (err) {
        return self;
      }

      if (!audioTest || typeof audioTest.canPlayType !== 'function') {
        return self;
      }

      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

      // Opera version <33 has mixed MP3 support, so we need to check for and block it.
      var checkOpera = self._navigator && self._navigator.userAgent.match(/OPR\/([0-6].)/g);
      var isOldOpera = (checkOpera && parseInt(checkOpera[0].split('/')[1], 10) < 33);

      self._codecs = {
        mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
        mpeg: !!mpegTest,
        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        webm: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
        flac: !!(audioTest.canPlayType('audio/x-flac;') || audioTest.canPlayType('audio/flac;')).replace(/^no$/, '')
      };

      return self;
    },

    /**
     * Mobile browsers will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * @return {Howler}
     */
    _enableMobileAudio: function() {
      var self = this || Howler;

      // Only run this on mobile devices if audio isn't already eanbled.
      var isMobile = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(self._navigator && self._navigator.userAgent);
      var isTouch = !!(('ontouchend' in window) || (self._navigator && self._navigator.maxTouchPoints > 0) || (self._navigator && self._navigator.msMaxTouchPoints > 0));
      if (self._mobileEnabled || !self.ctx || (!isMobile && !isTouch)) {
        return;
      }

      self._mobileEnabled = false;

      // Some mobile devices/platforms have distortion issues when opening/closing tabs and/or web views.
      // Bugs in the browser (especially Mobile Safari) can cause the sampleRate to change from 44100 to 48000.
      // By calling Howler.unload(), we create a new AudioContext with the correct sampleRate.
      if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
        self._mobileUnloaded = true;
        self.unload();
      }

      // Scratch buffer for enabling iOS to dispose of web audio buffers correctly, as per:
      // http://stackoverflow.com/questions/24119684
      self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);

      // Call this method on touch start to create and play a buffer,
      // then check if the audio actually played to determine if
      // audio has now been unlocked on iOS, Android, etc.
      var unlock = function() {
        // Fix Android can not play in suspend state.
        Howler._autoResume();

        // Create an empty buffer.
        var source = self.ctx.createBufferSource();
        source.buffer = self._scratchBuffer;
        source.connect(self.ctx.destination);

        // Play the empty buffer.
        if (typeof source.start === 'undefined') {
          source.noteOn(0);
        } else {
          source.start(0);
        }

        // Calling resume() on a stack initiated by user gesture is what actually unlocks the audio on Android Chrome >= 55.
        if (typeof self.ctx.resume === 'function') {
          self.ctx.resume();
        }

        // Setup a timeout to check that we are unlocked on the next event loop.
        source.onended = function() {
          source.disconnect(0);

          // Update the unlocked state and prevent this check from happening again.
          self._mobileEnabled = true;
          self.mobileAutoEnable = false;

          // Remove the touch start listener.
          document.removeEventListener('touchstart', unlock, true);
          document.removeEventListener('touchend', unlock, true);
        };
      };

      // Setup a touch start listener to attempt an unlock in.
      document.addEventListener('touchstart', unlock, true);
      document.addEventListener('touchend', unlock, true);

      return self;
    },

    /**
     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
     * @return {Howler}
     */
    _autoSuspend: function() {
      var self = this;

      if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      // Check if any sounds are playing.
      for (var i=0; i<self._howls.length; i++) {
        if (self._howls[i]._webAudio) {
          for (var j=0; j<self._howls[i]._sounds.length; j++) {
            if (!self._howls[i]._sounds[j]._paused) {
              return self;
            }
          }
        }
      }

      if (self._suspendTimer) {
        clearTimeout(self._suspendTimer);
      }

      // If no sound has played after 30 seconds, suspend the context.
      self._suspendTimer = setTimeout(function() {
        if (!self.autoSuspend) {
          return;
        }

        self._suspendTimer = null;
        self.state = 'suspending';
        self.ctx.suspend().then(function() {
          self.state = 'suspended';

          if (self._resumeAfterSuspend) {
            delete self._resumeAfterSuspend;
            self._autoResume();
          }
        });
      }, 30000);

      return self;
    },

    /**
     * Automatically resume the Web Audio AudioContext when a new sound is played.
     * @return {Howler}
     */
    _autoResume: function() {
      var self = this;

      if (!self.ctx || typeof self.ctx.resume === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      if (self.state === 'running' && self._suspendTimer) {
        clearTimeout(self._suspendTimer);
        self._suspendTimer = null;
      } else if (self.state === 'suspended') {
        self.ctx.resume().then(function() {
          self.state = 'running';

          // Emit to all Howls that the audio has resumed.
          for (var i=0; i<self._howls.length; i++) {
            self._howls[i]._emit('resume');
          }
        });

        if (self._suspendTimer) {
          clearTimeout(self._suspendTimer);
          self._suspendTimer = null;
        }
      } else if (self.state === 'suspending') {
        self._resumeAfterSuspend = true;
      }

      return self;
    }
  };

  // Setup the global audio controller.
  var Howler = new HowlerGlobal();

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Create an audio group controller.
   * @param {Object} o Passed in properties for this group.
   */
  var Howl = function(o) {
    var self = this;

    // Throw an error if no source is provided.
    if (!o.src || o.src.length === 0) {
      console.error('An array of source files must be passed with any new Howl.');
      return;
    }

    self.init(o);
  };
  Howl.prototype = {
    /**
     * Initialize a new Howl group object.
     * @param  {Object} o Passed in properties for this group.
     * @return {Howl}
     */
    init: function(o) {
      var self = this;

      // If we don't have an AudioContext created yet, run the setup.
      if (!Howler.ctx) {
        setupAudioContext();
      }

      // Setup user-defined default properties.
      self._autoplay = o.autoplay || false;
      self._format = (typeof o.format !== 'string') ? o.format : [o.format];
      self._html5 = o.html5 || false;
      self._muted = o.mute || false;
      self._loop = o.loop || false;
      self._pool = o.pool || 5;
      self._preload = (typeof o.preload === 'boolean') ? o.preload : true;
      self._rate = o.rate || 1;
      self._sprite = o.sprite || {};
      self._src = (typeof o.src !== 'string') ? o.src : [o.src];
      self._volume = o.volume !== undefined ? o.volume : 1;
      self._xhrWithCredentials = o.xhrWithCredentials || false;

      // Setup all other default properties.
      self._duration = 0;
      self._state = 'unloaded';
      self._sounds = [];
      self._endTimers = {};
      self._queue = [];
      self._playLock = false;

      // Setup event listeners.
      self._onend = o.onend ? [{fn: o.onend}] : [];
      self._onfade = o.onfade ? [{fn: o.onfade}] : [];
      self._onload = o.onload ? [{fn: o.onload}] : [];
      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
      self._onplayerror = o.onplayerror ? [{fn: o.onplayerror}] : [];
      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
      self._onplay = o.onplay ? [{fn: o.onplay}] : [];
      self._onstop = o.onstop ? [{fn: o.onstop}] : [];
      self._onmute = o.onmute ? [{fn: o.onmute}] : [];
      self._onvolume = o.onvolume ? [{fn: o.onvolume}] : [];
      self._onrate = o.onrate ? [{fn: o.onrate}] : [];
      self._onseek = o.onseek ? [{fn: o.onseek}] : [];
      self._onresume = [];

      // Web Audio or HTML5 Audio?
      self._webAudio = Howler.usingWebAudio && !self._html5;

      // Automatically try to enable audio on iOS.
      if (typeof Howler.ctx !== 'undefined' && Howler.ctx && Howler.mobileAutoEnable) {
        Howler._enableMobileAudio();
      }

      // Keep track of this Howl group in the global controller.
      Howler._howls.push(self);

      // If they selected autoplay, add a play event to the load queue.
      if (self._autoplay) {
        self._queue.push({
          event: 'play',
          action: function() {
            self.play();
          }
        });
      }

      // Load the source file unless otherwise specified.
      if (self._preload) {
        self.load();
      }

      return self;
    },

    /**
     * Load the audio file.
     * @return {Howler}
     */
    load: function() {
      var self = this;
      var url = null;

      // If no audio is available, quit immediately.
      if (Howler.noAudio) {
        self._emit('loaderror', null, 'No audio support.');
        return;
      }

      // Make sure our source is in an array.
      if (typeof self._src === 'string') {
        self._src = [self._src];
      }

      // Loop through the sources and pick the first one that is compatible.
      for (var i=0; i<self._src.length; i++) {
        var ext, str;

        if (self._format && self._format[i]) {
          // If an extension was specified, use that instead.
          ext = self._format[i];
        } else {
          // Make sure the source is a string.
          str = self._src[i];
          if (typeof str !== 'string') {
            self._emit('loaderror', null, 'Non-string found in selected audio sources - ignoring.');
            continue;
          }

          // Extract the file extension from the URL or base64 data URI.
          ext = /^data:audio\/([^;,]+);/i.exec(str);
          if (!ext) {
            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
          }

          if (ext) {
            ext = ext[1].toLowerCase();
          }
        }

        // Log a warning if no extension was found.
        if (!ext) {
          console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
        }

        // Check if this extension is available.
        if (ext && Howler.codecs(ext)) {
          url = self._src[i];
          break;
        }
      }

      if (!url) {
        self._emit('loaderror', null, 'No codec support for selected audio sources.');
        return;
      }

      self._src = url;
      self._state = 'loading';

      // If the hosting page is HTTPS and the source isn't,
      // drop down to HTML5 Audio to avoid Mixed Content errors.
      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
        self._html5 = true;
        self._webAudio = false;
      }

      // Create a new sound object and add it to the pool.
      new Sound(self);

      // Load and decode the audio data for playback.
      if (self._webAudio) {
        loadBuffer(self);
      }

      return self;
    },

    /**
     * Play a sound or resume previous playback.
     * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Number}          Sound ID.
     */
    play: function(sprite, internal) {
      var self = this;
      var id = null;

      // Determine if a sprite, sound id or nothing was passed
      if (typeof sprite === 'number') {
        id = sprite;
        sprite = null;
      } else if (typeof sprite === 'string' && self._state === 'loaded' && !self._sprite[sprite]) {
        // If the passed sprite doesn't exist, do nothing.
        return null;
      } else if (typeof sprite === 'undefined') {
        // Use the default sound sprite (plays the full audio length).
        sprite = '__default';

        // Check if there is a single paused sound that isn't ended.
        // If there is, play that sound. If not, continue as usual.
        var num = 0;
        for (var i=0; i<self._sounds.length; i++) {
          if (self._sounds[i]._paused && !self._sounds[i]._ended) {
            num++;
            id = self._sounds[i]._id;
          }
        }

        if (num === 1) {
          sprite = null;
        } else {
          id = null;
        }
      }

      // Get the selected node, or get one from the pool.
      var sound = id ? self._soundById(id) : self._inactiveSound();

      // If the sound doesn't exist, do nothing.
      if (!sound) {
        return null;
      }

      // Select the sprite definition.
      if (id && !sprite) {
        sprite = sound._sprite || '__default';
      }

      // If the sound hasn't loaded, we must wait to get the audio's duration.
      // We also need to wait to make sure we don't run into race conditions with
      // the order of function calls.
      if (self._state !== 'loaded') {
        // Set the sprite value on this sound.
        sound._sprite = sprite;

        // Makr this sounded as not ended in case another sound is played before this one loads.
        sound._ended = false;

        // Add the sound to the queue to be played on load.
        var soundId = sound._id;
        self._queue.push({
          event: 'play',
          action: function() {
            self.play(soundId);
          }
        });

        return soundId;
      }

      // Don't play the sound if an id was passed and it is already playing.
      if (id && !sound._paused) {
        // Trigger the play event, in order to keep iterating through queue.
        if (!internal) {
          self._loadQueue('play');
        }

        return sound._id;
      }

      // Make sure the AudioContext isn't suspended, and resume it if it is.
      if (self._webAudio) {
        Howler._autoResume();
      }

      // Determine how long to play for and where to start playing.
      var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000);
      var duration = Math.max(0, ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek);
      var timeout = (duration * 1000) / Math.abs(sound._rate);

      // Update the parameters of the sound
      sound._paused = false;
      sound._ended = false;
      sound._sprite = sprite;
      sound._seek = seek;
      sound._start = self._sprite[sprite][0] / 1000;
      sound._stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
      sound._loop = !!(sound._loop || self._sprite[sprite][2]);

      // Begin the actual playback.
      var node = sound._node;
      if (self._webAudio) {
        // Fire this when the sound is ready to play to begin Web Audio playback.
        var playWebAudio = function() {
          self._refreshBuffer(sound);

          // Setup the playback params.
          var vol = (sound._muted || self._muted) ? 0 : sound._volume;
          node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
          sound._playStart = Howler.ctx.currentTime;

          // Play the sound using the supported method.
          if (typeof node.bufferSource.start === 'undefined') {
            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
          } else {
            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
          }

          // Start a new timer if none is present.
          if (timeout !== Infinity) {
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }

          if (!internal) {
            setTimeout(function() {
              self._emit('play', sound._id);
            }, 0);
          }
        };

        if (Howler.state === 'running') {
          playWebAudio();
        } else {
          self.once('resume', playWebAudio);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      } else {
        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
        var playHtml5 = function() {
          node.currentTime = seek;
          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
          node.volume = sound._volume * Howler.volume();
          node.playbackRate = sound._rate;

          // Mobile browsers will throw an error if this is called without user interaction.
          try {
            var play = node.play();

            // Support older browsers that don't support promises, and thus don't have this issue.
            if (typeof Promise !== 'undefined' && play instanceof Promise) {
              // Implements a lock to prevent DOMException: The play() request was interrupted by a call to pause().
              self._playLock = true;

              // Releases the lock and executes queued actions.
              var runLoadQueue = function() {
                self._playLock = false;
                if (!internal) {
                  self._emit('play', sound._id);
                }
              };
              play.then(runLoadQueue, runLoadQueue);
            } else if (!internal) {
              self._emit('play', sound._id);
            }

            // Setting rate before playing won't work in IE, so we set it again here.
            node.playbackRate = sound._rate;

            // If the node is still paused, then we can assume there was a playback issue.
            if (node.paused) {
              self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' +
                'on mobile devices where playback was not within a user interaction.');
              return;
            }

            // Setup the end timer on sprites or listen for the ended event.
            if (sprite !== '__default' || sound._loop) {
              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
            } else {
              self._endTimers[sound._id] = function() {
                // Fire ended on this audio node.
                self._ended(sound);

                // Clear this listener.
                node.removeEventListener('ended', self._endTimers[sound._id], false);
              };
              node.addEventListener('ended', self._endTimers[sound._id], false);
            }
          } catch (err) {
            self._emit('playerror', sound._id, err);
          }
        };

        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
        var loadedNoReadyState = (window && window.ejecta) || (!node.readyState && Howler._navigator.isCocoonJS);
        if (node.readyState >= 3 || loadedNoReadyState) {
          playHtml5();
        } else {
          var listener = function() {
            // Begin playback.
            playHtml5();

            // Clear this listener.
            node.removeEventListener(Howler._canPlayEvent, listener, false);
          };
          node.addEventListener(Howler._canPlayEvent, listener, false);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      }

      return sound._id;
    },

    /**
     * Pause playback and save current position.
     * @param  {Number} id The sound ID (empty to pause all in group).
     * @return {Howl}
     */
    pause: function(id) {
      var self = this;

      // If the sound hasn't loaded or a play() promise is pending, add it to the load queue to pause when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'pause',
          action: function() {
            self.pause(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be paused.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound && !sound._paused) {
          // Reset the seek position.
          sound._seek = self.seek(ids[i]);
          sound._rateSeek = 0;
          sound._paused = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound has been created.
              if (!sound._node.bufferSource) {
                continue;
              }

              if (typeof sound._node.bufferSource.stop === 'undefined') {
                sound._node.bufferSource.noteOff(0);
              } else {
                sound._node.bufferSource.stop(0);
              }

              // Clean up the buffer source.
              self._cleanBuffer(sound._node);
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.pause();
            }
          }
        }

        // Fire the pause event, unless `true` is passed as the 2nd argument.
        if (!arguments[1]) {
          self._emit('pause', sound ? sound._id : null);
        }
      }

      return self;
    },

    /**
     * Stop playback and reset to start.
     * @param  {Number} id The sound ID (empty to stop all in group).
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Howl}
     */
    stop: function(id, internal) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to stop when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'stop',
          action: function() {
            self.stop(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be stopped.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          // Reset the seek position.
          sound._seek = sound._start || 0;
          sound._rateSeek = 0;
          sound._paused = true;
          sound._ended = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound's AudioBufferSourceNode has been created.
              if (sound._node.bufferSource) {
                if (typeof sound._node.bufferSource.stop === 'undefined') {
                  sound._node.bufferSource.noteOff(0);
                } else {
                  sound._node.bufferSource.stop(0);
                }

                // Clean up the buffer source.
                self._cleanBuffer(sound._node);
              }
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.currentTime = sound._start || 0;
              sound._node.pause();
            }
          }

          if (!internal) {
            self._emit('stop', sound._id);
          }
        }
      }

      return self;
    },

    /**
     * Mute/unmute a single sound or all sounds in this Howl group.
     * @param  {Boolean} muted Set to true to mute and false to unmute.
     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
     * @return {Howl}
     */
    mute: function(muted, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to mute when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'mute',
          action: function() {
            self.mute(muted, id);
          }
        });

        return self;
      }

      // If applying mute/unmute to all sounds, update the group's value.
      if (typeof id === 'undefined') {
        if (typeof muted === 'boolean') {
          self._muted = muted;
        } else {
          return self._muted;
        }
      }

      // If no id is passed, get all ID's to be muted.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          sound._muted = muted;

          // Cancel active fade and set the volume to the end value.
          if (sound._interval) {
            self._stopFade(sound._id);
          }

          if (self._webAudio && sound._node) {
            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler.ctx.currentTime);
          } else if (sound._node) {
            sound._node.muted = Howler._muted ? true : muted;
          }

          self._emit('mute', sound._id);
        }
      }

      return self;
    },

    /**
     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
     *   volume() -> Returns the group's volume value.
     *   volume(id) -> Returns the sound id's current volume.
     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
     *   volume(vol, id) -> Sets the volume of passed sound id.
     * @return {Howl/Number} Returns self or current volume.
     */
    volume: function() {
      var self = this;
      var args = arguments;
      var vol, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // Return the value of the groups' volume.
        return self._volume;
      } else if (args.length === 1 || args.length === 2 && typeof args[1] === 'undefined') {
        // First check if this is an ID, and if not, assume it is a new volume.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          vol = parseFloat(args[0]);
        }
      } else if (args.length >= 2) {
        vol = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the volume or return the current volume.
      var sound;
      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'volume',
            action: function() {
              self.volume.apply(self, args);
            }
          });

          return self;
        }

        // Set the group volume.
        if (typeof id === 'undefined') {
          self._volume = vol;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            sound._volume = vol;

            // Stop currently running fades.
            if (!args[2]) {
              self._stopFade(id[i]);
            }

            if (self._webAudio && sound._node && !sound._muted) {
              sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
            } else if (sound._node && !sound._muted) {
              sound._node.volume = vol * Howler.volume();
            }

            self._emit('volume', sound._id);
          }
        }
      } else {
        sound = id ? self._soundById(id) : self._sounds[0];
        return sound ? sound._volume : 0;
      }

      return self;
    },

    /**
     * Fade a currently playing sound between two volumes (if no id is passsed, all sounds will fade).
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id (omit to fade all sounds).
     * @return {Howl}
     */
    fade: function(from, to, len, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to fade when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'fade',
          action: function() {
            self.fade(from, to, len, id);
          }
        });

        return self;
      }

      // Set the volume to the start position.
      self.volume(from, id);

      // Fade the volume of one or all sounds.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        // Create a linear fade or fall back to timeouts with HTML5 Audio.
        if (sound) {
          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
          if (!id) {
            self._stopFade(ids[i]);
          }

          // If we are using Web Audio, let the native methods do the actual fade.
          if (self._webAudio && !sound._muted) {
            var currentTime = Howler.ctx.currentTime;
            var end = currentTime + (len / 1000);
            sound._volume = from;
            sound._node.gain.setValueAtTime(from, currentTime);
            sound._node.gain.linearRampToValueAtTime(to, end);
          }

          self._startFadeInterval(sound, from, to, len, ids[i], typeof id === 'undefined');
        }
      }

      return self;
    },

    /**
     * Starts the internal interval to fade a sound.
     * @param  {Object} sound Reference to sound to fade.
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id to fade.
     * @param  {Boolean} isGroup   If true, set the volume on the group.
     */
    _startFadeInterval: function(sound, from, to, len, id, isGroup) {
      var self = this;
      var vol = from;
      var diff = to - from;
      var steps = Math.abs(diff / 0.01);
      var stepLen = Math.max(4, (steps > 0) ? len / steps : len);
      var lastTick = Date.now();

      // Store the value being faded to.
      sound._fadeTo = to;

      // Update the volume value on each interval tick.
      sound._interval = setInterval(function() {
        // Update the volume based on the time since the last tick.
        var tick = (Date.now() - lastTick) / len;
        lastTick = Date.now();
        vol += diff * tick;

        // Make sure the volume is in the right bounds.
        vol = Math.max(0, vol);
        vol = Math.min(1, vol);

        // Round to within 2 decimal points.
        vol = Math.round(vol * 100) / 100;

        // Change the volume.
        if (self._webAudio) {
          sound._volume = vol;
        } else {
          self.volume(vol, sound._id, true);
        }

        // Set the group's volume.
        if (isGroup) {
          self._volume = vol;
        }

        // When the fade is complete, stop it and fire event.
        if ((to < from && vol <= to) || (to > from && vol >= to)) {
          clearInterval(sound._interval);
          sound._interval = null;
          sound._fadeTo = null;
          self.volume(to, sound._id);
          self._emit('fade', sound._id);
        }
      }, stepLen);
    },

    /**
     * Internal method that stops the currently playing fade when
     * a new fade starts, volume is changed or the sound is stopped.
     * @param  {Number} id The sound id.
     * @return {Howl}
     */
    _stopFade: function(id) {
      var self = this;
      var sound = self._soundById(id);

      if (sound && sound._interval) {
        if (self._webAudio) {
          sound._node.gain.cancelScheduledValues(Howler.ctx.currentTime);
        }

        clearInterval(sound._interval);
        sound._interval = null;
        self.volume(sound._fadeTo, id);
        sound._fadeTo = null;
        self._emit('fade', id);
      }

      return self;
    },

    /**
     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
     *   loop() -> Returns the group's loop value.
     *   loop(id) -> Returns the sound id's loop value.
     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
     *   loop(loop, id) -> Sets the loop value of passed sound id.
     * @return {Howl/Boolean} Returns self or current loop value.
     */
    loop: function() {
      var self = this;
      var args = arguments;
      var loop, id, sound;

      // Determine the values for loop and id.
      if (args.length === 0) {
        // Return the grou's loop value.
        return self._loop;
      } else if (args.length === 1) {
        if (typeof args[0] === 'boolean') {
          loop = args[0];
          self._loop = loop;
        } else {
          // Return this sound's loop value.
          sound = self._soundById(parseInt(args[0], 10));
          return sound ? sound._loop : false;
        }
      } else if (args.length === 2) {
        loop = args[0];
        id = parseInt(args[1], 10);
      }

      // If no id is passed, get all ID's to be looped.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        sound = self._soundById(ids[i]);

        if (sound) {
          sound._loop = loop;
          if (self._webAudio && sound._node && sound._node.bufferSource) {
            sound._node.bufferSource.loop = loop;
            if (loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop;
            }
          }
        }
      }

      return self;
    },

    /**
     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   rate() -> Returns the first sound node's current playback rate.
     *   rate(id) -> Returns the sound id's current playback rate.
     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
     *   rate(rate, id) -> Sets the playback rate of passed sound id.
     * @return {Howl/Number} Returns self or the current playback rate.
     */
    rate: function() {
      var self = this;
      var args = arguments;
      var rate, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current rate of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new rate value.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          rate = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        rate = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the playback rate or return the current value.
      var sound;
      if (typeof rate === 'number') {
        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'rate',
            action: function() {
              self.rate.apply(self, args);
            }
          });

          return self;
        }

        // Set the group rate.
        if (typeof id === 'undefined') {
          self._rate = rate;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            // Keep track of our position when the rate changed and update the playback
            // start position so we can properly adjust the seek position for time elapsed.
            sound._rateSeek = self.seek(id[i]);
            sound._playStart = self._webAudio ? Howler.ctx.currentTime : sound._playStart;
            sound._rate = rate;

            // Change the playback rate.
            if (self._webAudio && sound._node && sound._node.bufferSource) {
              sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler.ctx.currentTime);
            } else if (sound._node) {
              sound._node.playbackRate = rate;
            }

            // Reset the timers.
            var seek = self.seek(id[i]);
            var duration = ((self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000) - seek;
            var timeout = (duration * 1000) / Math.abs(sound._rate);

            // Start a new end timer if sound is already playing.
            if (self._endTimers[id[i]] || !sound._paused) {
              self._clearTimer(id[i]);
              self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
            }

            self._emit('rate', sound._id);
          }
        }
      } else {
        sound = self._soundById(id);
        return sound ? sound._rate : self._rate;
      }

      return self;
    },

    /**
     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   seek() -> Returns the first sound node's current seek position.
     *   seek(id) -> Returns the sound id's current seek position.
     *   seek(seek) -> Sets the seek position of the first sound node.
     *   seek(seek, id) -> Sets the seek position of passed sound id.
     * @return {Howl/Number} Returns self or the current seek position.
     */
    seek: function() {
      var self = this;
      var args = arguments;
      var seek, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current position of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new seek position.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else if (self._sounds.length) {
          id = self._sounds[0]._id;
          seek = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        seek = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // If there is no ID, bail out.
      if (typeof id === 'undefined') {
        return self;
      }

      // If the sound hasn't loaded, add it to the load queue to seek when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'seek',
          action: function() {
            self.seek.apply(self, args);
          }
        });

        return self;
      }

      // Get the sound.
      var sound = self._soundById(id);

      if (sound) {
        if (typeof seek === 'number' && seek >= 0) {
          // Pause the sound and update position for restarting playback.
          var playing = self.playing(id);
          if (playing) {
            self.pause(id, true);
          }

          // Move the position of the track and cancel timer.
          sound._seek = seek;
          sound._ended = false;
          self._clearTimer(id);

          // Restart the playback if the sound was playing.
          if (playing) {
            self.play(id, true);
          }

          // Update the seek position for HTML5 Audio.
          if (!self._webAudio && sound._node) {
            sound._node.currentTime = seek;
          }

          // Wait for the play lock to be unset before emitting (HTML5 Audio).
          if (playing && !self._webAudio) {
            var emitSeek = function() {
              if (!self._playLock) {
                self._emit('seek', id);
              } else {
                setTimeout(emitSeek, 0);
              }
            };
            setTimeout(emitSeek, 0);
          } else {
            self._emit('seek', id);
          }
        } else {
          if (self._webAudio) {
            var realTime = self.playing(id) ? Howler.ctx.currentTime - sound._playStart : 0;
            var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
            return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
          } else {
            return sound._node.currentTime;
          }
        }
      }

      return self;
    },

    /**
     * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
     * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
     * @return {Boolean} True if playing and false if not.
     */
    playing: function(id) {
      var self = this;

      // Check the passed sound ID (if any).
      if (typeof id === 'number') {
        var sound = self._soundById(id);
        return sound ? !sound._paused : false;
      }

      // Otherwise, loop through all sounds and check if any are playing.
      for (var i=0; i<self._sounds.length; i++) {
        if (!self._sounds[i]._paused) {
          return true;
        }
      }

      return false;
    },

    /**
     * Get the duration of this sound. Passing a sound id will return the sprite duration.
     * @param  {Number} id The sound id to check. If none is passed, return full source duration.
     * @return {Number} Audio duration in seconds.
     */
    duration: function(id) {
      var self = this;
      var duration = self._duration;

      // If we pass an ID, get the sound and return the sprite length.
      var sound = self._soundById(id);
      if (sound) {
        duration = self._sprite[sound._sprite][1] / 1000;
      }

      return duration;
    },

    /**
     * Returns the current loaded state of this Howl.
     * @return {String} 'unloaded', 'loading', 'loaded'
     */
    state: function() {
      return this._state;
    },

    /**
     * Unload and destroy the current Howl object.
     * This will immediately stop all sound instances attached to this group.
     */
    unload: function() {
      var self = this;

      // Stop playing any active sounds.
      var sounds = self._sounds;
      for (var i=0; i<sounds.length; i++) {
        // Stop the sound if it is currently playing.
        if (!sounds[i]._paused) {
          self.stop(sounds[i]._id);
        }

        // Remove the source or disconnect.
        if (!self._webAudio) {
          // Set the source to 0-second silence to stop any downloading (except in IE).
          var checkIE = /MSIE |Trident\//.test(Howler._navigator && Howler._navigator.userAgent);
          if (!checkIE) {
            sounds[i]._node.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
          }

          // Remove any event listeners.
          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
          sounds[i]._node.removeEventListener(Howler._canPlayEvent, sounds[i]._loadFn, false);
        }

        // Empty out all of the nodes.
        delete sounds[i]._node;

        // Make sure all timers are cleared out.
        self._clearTimer(sounds[i]._id);

        // Remove the references in the global Howler object.
        var index = Howler._howls.indexOf(self);
        if (index >= 0) {
          Howler._howls.splice(index, 1);
        }
      }

      // Delete this sound from the cache (if no other Howl is using it).
      var remCache = true;
      for (i=0; i<Howler._howls.length; i++) {
        if (Howler._howls[i]._src === self._src) {
          remCache = false;
          break;
        }
      }

      if (cache && remCache) {
        delete cache[self._src];
      }

      // Clear global errors.
      Howler.noAudio = false;

      // Clear out `self`.
      self._state = 'unloaded';
      self._sounds = [];
      self = null;

      return null;
    },

    /**
     * Listen to a custom event.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
     * @return {Howl}
     */
    on: function(event, fn, id, once) {
      var self = this;
      var events = self['_on' + event];

      if (typeof fn === 'function') {
        events.push(once ? {id: id, fn: fn, once: once} : {id: id, fn: fn});
      }

      return self;
    },

    /**
     * Remove a custom event. Call without parameters to remove all events.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
     * @param  {Number}   id    (optional) Only remove events for this sound.
     * @return {Howl}
     */
    off: function(event, fn, id) {
      var self = this;
      var events = self['_on' + event];
      var i = 0;

      // Allow passing just an event and ID.
      if (typeof fn === 'number') {
        id = fn;
        fn = null;
      }

      if (fn || id) {
        // Loop through event store and remove the passed function.
        for (i=0; i<events.length; i++) {
          var isId = (id === events[i].id);
          if (fn === events[i].fn && isId || !fn && isId) {
            events.splice(i, 1);
            break;
          }
        }
      } else if (event) {
        // Clear out all events of this type.
        self['_on' + event] = [];
      } else {
        // Clear out all events of every type.
        var keys = Object.keys(self);
        for (i=0; i<keys.length; i++) {
          if ((keys[i].indexOf('_on') === 0) && Array.isArray(self[keys[i]])) {
            self[keys[i]] = [];
          }
        }
      }

      return self;
    },

    /**
     * Listen to a custom event and remove it once fired.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @return {Howl}
     */
    once: function(event, fn, id) {
      var self = this;

      // Setup the event listener.
      self.on(event, fn, id, 1);

      return self;
    },

    /**
     * Emit all events of a specific type and pass the sound id.
     * @param  {String} event Event name.
     * @param  {Number} id    Sound ID.
     * @param  {Number} msg   Message to go with event.
     * @return {Howl}
     */
    _emit: function(event, id, msg) {
      var self = this;
      var events = self['_on' + event];

      // Loop through event store and fire all functions.
      for (var i=events.length-1; i>=0; i--) {
        // Only fire the listener if the correct ID is used.
        if (!events[i].id || events[i].id === id || event === 'load') {
          setTimeout(function(fn) {
            fn.call(this, id, msg);
          }.bind(self, events[i].fn), 0);

          // If this event was setup with `once`, remove it.
          if (events[i].once) {
            self.off(event, events[i].fn, events[i].id);
          }
        }
      }

      // Pass the event type into load queue so that it can continue stepping.
      self._loadQueue(event);

      return self;
    },

    /**
     * Queue of actions initiated before the sound has loaded.
     * These will be called in sequence, with the next only firing
     * after the previous has finished executing (even if async like play).
     * @return {Howl}
     */
    _loadQueue: function(event) {
      var self = this;

      if (self._queue.length > 0) {
        var task = self._queue[0];

        // Remove this task if a matching event was passed.
        if (task.event === event) {
          self._queue.shift();
          self._loadQueue();
        }

        // Run the task if no event type is passed.
        if (!event) {
          task.action();
        }
      }

      return self;
    },

    /**
     * Fired when playback ends at the end of the duration.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _ended: function(sound) {
      var self = this;
      var sprite = sound._sprite;

      // If we are using IE and there was network latency we may be clipping
      // audio before it completes playing. Lets check the node to make sure it
      // believes it has completed, before ending the playback.
      if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
        setTimeout(self._ended.bind(self, sound), 100);
        return self;
      }

      // Should this sound loop?
      var loop = !!(sound._loop || self._sprite[sprite][2]);

      // Fire the ended event.
      self._emit('end', sound._id);

      // Restart the playback for HTML5 Audio loop.
      if (!self._webAudio && loop) {
        self.stop(sound._id, true).play(sound._id);
      }

      // Restart this timer if on a Web Audio loop.
      if (self._webAudio && loop) {
        self._emit('play', sound._id);
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        sound._playStart = Howler.ctx.currentTime;

        var timeout = ((sound._stop - sound._start) * 1000) / Math.abs(sound._rate);
        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
      }

      // Mark the node as paused.
      if (self._webAudio && !loop) {
        sound._paused = true;
        sound._ended = true;
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        self._clearTimer(sound._id);

        // Clean up the buffer source.
        self._cleanBuffer(sound._node);

        // Attempt to auto-suspend AudioContext if no sounds are still playing.
        Howler._autoSuspend();
      }

      // When using a sprite, end the track.
      if (!self._webAudio && !loop) {
        self.stop(sound._id);
      }

      return self;
    },

    /**
     * Clear the end timer for a sound playback.
     * @param  {Number} id The sound ID.
     * @return {Howl}
     */
    _clearTimer: function(id) {
      var self = this;

      if (self._endTimers[id]) {
        // Clear the timeout or remove the ended listener.
        if (typeof self._endTimers[id] !== 'function') {
          clearTimeout(self._endTimers[id]);
        } else {
          var sound = self._soundById(id);
          if (sound && sound._node) {
            sound._node.removeEventListener('ended', self._endTimers[id], false);
          }
        }

        delete self._endTimers[id];
      }

      return self;
    },

    /**
     * Return the sound identified by this ID, or return null.
     * @param  {Number} id Sound ID
     * @return {Object}    Sound object or null.
     */
    _soundById: function(id) {
      var self = this;

      // Loop through all sounds and find the one with this ID.
      for (var i=0; i<self._sounds.length; i++) {
        if (id === self._sounds[i]._id) {
          return self._sounds[i];
        }
      }

      return null;
    },

    /**
     * Return an inactive sound from the pool or create a new one.
     * @return {Sound} Sound playback object.
     */
    _inactiveSound: function() {
      var self = this;

      self._drain();

      // Find the first inactive node to recycle.
      for (var i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          return self._sounds[i].reset();
        }
      }

      // If no inactive node was found, create a new one.
      return new Sound(self);
    },

    /**
     * Drain excess inactive sounds from the pool.
     */
    _drain: function() {
      var self = this;
      var limit = self._pool;
      var cnt = 0;
      var i = 0;

      // If there are less sounds than the max pool size, we are done.
      if (self._sounds.length < limit) {
        return;
      }

      // Count the number of inactive sounds.
      for (i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          cnt++;
        }
      }

      // Remove excess inactive sounds, going in reverse order.
      for (i=self._sounds.length - 1; i>=0; i--) {
        if (cnt <= limit) {
          return;
        }

        if (self._sounds[i]._ended) {
          // Disconnect the audio source when using Web Audio.
          if (self._webAudio && self._sounds[i]._node) {
            self._sounds[i]._node.disconnect(0);
          }

          // Remove sounds until we have the pool size.
          self._sounds.splice(i, 1);
          cnt--;
        }
      }
    },

    /**
     * Get all ID's from the sounds pool.
     * @param  {Number} id Only return one ID if one is passed.
     * @return {Array}    Array of IDs.
     */
    _getSoundIds: function(id) {
      var self = this;

      if (typeof id === 'undefined') {
        var ids = [];
        for (var i=0; i<self._sounds.length; i++) {
          ids.push(self._sounds[i]._id);
        }

        return ids;
      } else {
        return [id];
      }
    },

    /**
     * Load the sound back into the buffer source.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _refreshBuffer: function(sound) {
      var self = this;

      // Setup the buffer source for playback.
      sound._node.bufferSource = Howler.ctx.createBufferSource();
      sound._node.bufferSource.buffer = cache[self._src];

      // Connect to the correct node.
      if (sound._panner) {
        sound._node.bufferSource.connect(sound._panner);
      } else {
        sound._node.bufferSource.connect(sound._node);
      }

      // Setup looping and playback rate.
      sound._node.bufferSource.loop = sound._loop;
      if (sound._loop) {
        sound._node.bufferSource.loopStart = sound._start || 0;
        sound._node.bufferSource.loopEnd = sound._stop;
      }
      sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler.ctx.currentTime);

      return self;
    },

    /**
     * Prevent memory leaks by cleaning up the buffer source after playback.
     * @param  {Object} node Sound's audio node containing the buffer source.
     * @return {Howl}
     */
    _cleanBuffer: function(node) {
      var self = this;

      if (Howler._scratchBuffer) {
        node.bufferSource.onended = null;
        node.bufferSource.disconnect(0);
        try { node.bufferSource.buffer = Howler._scratchBuffer; } catch(e) {}
      }
      node.bufferSource = null;

      return self;
    }
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Setup the sound object, which each node attached to a Howl group is contained in.
   * @param {Object} howl The Howl parent group.
   */
  var Sound = function(howl) {
    this._parent = howl;
    this.init();
  };
  Sound.prototype = {
    /**
     * Initialize a new Sound object.
     * @return {Sound}
     */
    init: function() {
      var self = this;
      var parent = self._parent;

      // Setup the default parameters.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a unique ID for this sound.
      self._id = ++Howler._counter;

      // Add itself to the parent's pool.
      parent._sounds.push(self);

      // Create the new node.
      self.create();

      return self;
    },

    /**
     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
     * @return {Sound}
     */
    create: function() {
      var self = this;
      var parent = self._parent;
      var volume = (Howler._muted || self._muted || self._parent._muted) ? 0 : self._volume;

      if (parent._webAudio) {
        // Create the gain node for controlling volume (the source will connect to this).
        self._node = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
        self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
        self._node.paused = true;
        self._node.connect(Howler.masterGain);
      } else {
        self._node = new Audio();

        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
        self._errorFn = self._errorListener.bind(self);
        self._node.addEventListener('error', self._errorFn, false);

        // Listen for 'canplaythrough' event to let us know the sound is ready.
        self._loadFn = self._loadListener.bind(self);
        self._node.addEventListener(Howler._canPlayEvent, self._loadFn, false);

        // Setup the new audio node.
        self._node.src = parent._src;
        self._node.preload = 'auto';
        self._node.volume = volume * Howler.volume();

        // Begin loading the source.
        self._node.load();
      }

      return self;
    },

    /**
     * Reset the parameters of this sound to the original state (for recycle).
     * @return {Sound}
     */
    reset: function() {
      var self = this;
      var parent = self._parent;

      // Reset all of the parameters of this sound.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._rateSeek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a new ID so that it isn't confused with the previous sound.
      self._id = ++Howler._counter;

      return self;
    },

    /**
     * HTML5 Audio error listener callback.
     */
    _errorListener: function() {
      var self = this;

      // Fire an error event and pass back the code.
      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

      // Clear the event listener.
      self._node.removeEventListener('error', self._errorFn, false);
    },

    /**
     * HTML5 Audio canplaythrough listener callback.
     */
    _loadListener: function() {
      var self = this;
      var parent = self._parent;

      // Round up the duration to account for the lower precision in HTML5 Audio.
      parent._duration = Math.ceil(self._node.duration * 10) / 10;

      // Setup a sprite if none is defined.
      if (Object.keys(parent._sprite).length === 0) {
        parent._sprite = {__default: [0, parent._duration * 1000]};
      }

      if (parent._state !== 'loaded') {
        parent._state = 'loaded';
        parent._emit('load');
        parent._loadQueue();
      }

      // Clear the event listener.
      self._node.removeEventListener(Howler._canPlayEvent, self._loadFn, false);
    }
  };

  /** Helper Methods **/
  /***************************************************************************/

  var cache = {};

  /**
   * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
   * @param  {Howl} self
   */
  var loadBuffer = function(self) {
    var url = self._src;

    // Check if the buffer has already been cached and use it instead.
    if (cache[url]) {
      // Set the duration from the cache.
      self._duration = cache[url].duration;

      // Load the sound into this Howl.
      loadSound(self);

      return;
    }

    if (/^data:[^;]+;base64,/.test(url)) {
      // Decode the base64 data URI without XHR, since some browsers don't support it.
      var data = atob(url.split(',')[1]);
      var dataView = new Uint8Array(data.length);
      for (var i=0; i<data.length; ++i) {
        dataView[i] = data.charCodeAt(i);
      }

      decodeAudioData(dataView.buffer, self);
    } else {
      // Load the buffer from the URL.
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.withCredentials = self._xhrWithCredentials;
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        // Make sure we get a successful response back.
        var code = (xhr.status + '')[0];
        if (code !== '0' && code !== '2' && code !== '3') {
          self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
          return;
        }

        decodeAudioData(xhr.response, self);
      };
      xhr.onerror = function() {
        // If there is an error, switch to HTML5 Audio.
        if (self._webAudio) {
          self._html5 = true;
          self._webAudio = false;
          self._sounds = [];
          delete cache[url];
          self.load();
        }
      };
      safeXhrSend(xhr);
    }
  };

  /**
   * Send the XHR request wrapped in a try/catch.
   * @param  {Object} xhr XHR to send.
   */
  var safeXhrSend = function(xhr) {
    try {
      xhr.send();
    } catch (e) {
      xhr.onerror();
    }
  };

  /**
   * Decode audio data from an array buffer.
   * @param  {ArrayBuffer} arraybuffer The audio data.
   * @param  {Howl}        self
   */
  var decodeAudioData = function(arraybuffer, self) {
    // Decode the buffer into an audio source.
    Howler.ctx.decodeAudioData(arraybuffer, function(buffer) {
      if (buffer && self._sounds.length > 0) {
        cache[self._src] = buffer;
        loadSound(self, buffer);
      }
    }, function() {
      self._emit('loaderror', null, 'Decoding audio data failed.');
    });
  };

  /**
   * Sound is now loaded, so finish setting everything up and fire the loaded event.
   * @param  {Howl} self
   * @param  {Object} buffer The decoded buffer sound source.
   */
  var loadSound = function(self, buffer) {
    // Set the duration.
    if (buffer && !self._duration) {
      self._duration = buffer.duration;
    }

    // Setup a sprite if none is defined.
    if (Object.keys(self._sprite).length === 0) {
      self._sprite = {__default: [0, self._duration * 1000]};
    }

    // Fire the loaded event.
    if (self._state !== 'loaded') {
      self._state = 'loaded';
      self._emit('load');
      self._loadQueue();
    }
  };

  /**
   * Setup the audio context when available, or switch to HTML5 Audio mode.
   */
  var setupAudioContext = function() {
    // Check if we are using Web Audio and setup the AudioContext if we are.
    try {
      if (typeof AudioContext !== 'undefined') {
        Howler.ctx = new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        Howler.ctx = new webkitAudioContext();
      } else {
        Howler.usingWebAudio = false;
      }
    } catch(e) {
      Howler.usingWebAudio = false;
    }

    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
    // If it is, disable Web Audio as it causes crashing.
    var iOS = (/iP(hone|od|ad)/.test(Howler._navigator && Howler._navigator.platform));
    var appVersion = Howler._navigator && Howler._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    var version = appVersion ? parseInt(appVersion[1], 10) : null;
    if (iOS && version && version < 9) {
      var safari = /safari/.test(Howler._navigator && Howler._navigator.userAgent.toLowerCase());
      if (Howler._navigator && Howler._navigator.standalone && !safari || Howler._navigator && !Howler._navigator.standalone && !safari) {
        Howler.usingWebAudio = false;
      }
    }

    // Create and expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
    if (Howler.usingWebAudio) {
      Howler.masterGain = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
      Howler.masterGain.gain.setValueAtTime(Howler._muted ? 0 : 1, Howler.ctx.currentTime);
      Howler.masterGain.connect(Howler.ctx.destination);
    }

    // Re-run the setup on Howler.
    Howler._setup();
  };

  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return {
        Howler: Howler,
        Howl: Howl
      };
    }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }

  // Add support for CommonJS libraries such as browserify.
  if (true) {
    exports.Howler = Howler;
    exports.Howl = Howl;
  }

  // Define globally in case AMD is not available or unused.
  if (typeof window !== 'undefined') {
    window.HowlerGlobal = HowlerGlobal;
    window.Howler = Howler;
    window.Howl = Howl;
    window.Sound = Sound;
  } else if (typeof global !== 'undefined') { // Add to global in Node.js (for testing, etc).
    global.HowlerGlobal = HowlerGlobal;
    global.Howler = Howler;
    global.Howl = Howl;
    global.Sound = Sound;
  }
})();


/*!
 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.0.12
 *  howlerjs.com
 *
 *  (c) 2013-2018, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  // Setup default properties.
  HowlerGlobal.prototype._pos = [0, 0, 0];
  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Helper method to update the stereo panning position of all current Howls.
   * Future Howls will not use this value unless explicitly set.
   * @param  {Number} pan A value of -1.0 is all the way left and 1.0 is all the way right.
   * @return {Howler/Number}     Self or current stereo panning value.
   */
  HowlerGlobal.prototype.stereo = function(pan) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Loop through all Howls and update their stereo panning.
    for (var i=self._howls.length-1; i>=0; i--) {
      self._howls[i].stereo(pan);
    }

    return self;
  };

  /**
   * Get/set the position of the listener in 3D cartesian space. Sounds using
   * 3D position will be relative to the listener's position.
   * @param  {Number} x The x-position of the listener.
   * @param  {Number} y The y-position of the listener.
   * @param  {Number} z The z-position of the listener.
   * @return {Howler/Array}   Self or current listener position.
   */
  HowlerGlobal.prototype.pos = function(x, y, z) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._pos[1] : y;
    z = (typeof z !== 'number') ? self._pos[2] : z;

    if (typeof x === 'number') {
      self._pos = [x, y, z];

      if (typeof self.ctx.listener.positionX !== 'undefined') {
        self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
        self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
      }
    } else {
      return self._pos;
    }

    return self;
  };

  /**
   * Get/set the direction the listener is pointing in the 3D cartesian space.
   * A front and up vector must be provided. The front is the direction the
   * face of the listener is pointing, and up is the direction the top of the
   * listener is pointing. Thus, these values are expected to be at right angles
   * from each other.
   * @param  {Number} x   The x-orientation of the listener.
   * @param  {Number} y   The y-orientation of the listener.
   * @param  {Number} z   The z-orientation of the listener.
   * @param  {Number} xUp The x-orientation of the top of the listener.
   * @param  {Number} yUp The y-orientation of the top of the listener.
   * @param  {Number} zUp The z-orientation of the top of the listener.
   * @return {Howler/Array}     Returns self or the current orientation vectors.
   */
  HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    var or = self._orientation;
    y = (typeof y !== 'number') ? or[1] : y;
    z = (typeof z !== 'number') ? or[2] : z;
    xUp = (typeof xUp !== 'number') ? or[3] : xUp;
    yUp = (typeof yUp !== 'number') ? or[4] : yUp;
    zUp = (typeof zUp !== 'number') ? or[5] : zUp;

    if (typeof x === 'number') {
      self._orientation = [x, y, z, xUp, yUp, zUp];

      if (typeof self.ctx.listener.forwardX !== 'undefined') {
        self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
        self.ctx.listener.upZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
      } else {
        self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
      }
    } else {
      return or;
    }

    return self;
  };

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core init.
   * @param  {Function} _super Core init method.
   * @return {Howl}
   */
  Howl.prototype.init = (function(_super) {
    return function(o) {
      var self = this;

      // Setup user-defined default properties.
      self._orientation = o.orientation || [1, 0, 0];
      self._stereo = o.stereo || null;
      self._pos = o.pos || null;
      self._pannerAttr = {
        coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : 360,
        coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : 360,
        coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : 0,
        distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : 'inverse',
        maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : 10000,
        panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : 'HRTF',
        refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : 1,
        rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : 1
      };

      // Setup event listeners.
      self._onstereo = o.onstereo ? [{fn: o.onstereo}] : [];
      self._onpos = o.onpos ? [{fn: o.onpos}] : [];
      self._onorientation = o.onorientation ? [{fn: o.onorientation}] : [];

      // Complete initilization with howler.js core's init function.
      return _super.call(this, o);
    };
  })(Howl.prototype.init);

  /**
   * Get/set the stereo panning of the audio source for this sound or all in the group.
   * @param  {Number} pan  A value of -1.0 is all the way left and 1.0 is all the way right.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Number}    Returns self or the current stereo panning value.
   */
  Howl.prototype.stereo = function(pan, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change stereo pan when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'stereo',
        action: function() {
          self.stereo(pan, id);
        }
      });

      return self;
    }

    // Check for PannerStereoNode support and fallback to PannerNode if it doesn't exist.
    var pannerType = (typeof Howler.ctx.createStereoPanner === 'undefined') ? 'spatial' : 'stereo';

    // Setup the group's stereo panning if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's stereo panning if no parameters are passed.
      if (typeof pan === 'number') {
        self._stereo = pan;
        self._pos = [pan, 0, 0];
      } else {
        return self._stereo;
      }
    }

    // Change the streo panning of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof pan === 'number') {
          sound._stereo = pan;
          sound._pos = [pan, 0, 0];

          if (sound._node) {
            // If we are falling back, make sure the panningModel is equalpower.
            sound._pannerAttr.panningModel = 'equalpower';

            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || !sound._panner.pan) {
              setupPanner(sound, pannerType);
            }

            if (pannerType === 'spatial') {
              if (typeof sound._panner.positionX !== 'undefined') {
                sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
              } else {
                sound._panner.setPosition(pan, 0, 0);
              }
            } else {
              sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
            }
          }

          self._emit('stereo', sound._id);
        } else {
          return sound._stereo;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the 3D spatial position of the audio source for this sound or group relative to the global listener.
   * @param  {Number} x  The x-position of the audio source.
   * @param  {Number} y  The y-position of the audio source.
   * @param  {Number} z  The z-position of the audio source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial position: [x, y, z].
   */
  Howl.prototype.pos = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change position when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'pos',
        action: function() {
          self.pos(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? 0 : y;
    z = (typeof z !== 'number') ? -0.5 : z;

    // Setup the group's spatial position if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial position if no parameters are passed.
      if (typeof x === 'number') {
        self._pos = [x, y, z];
      } else {
        return self._pos;
      }
    }

    // Change the spatial position of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._pos = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || sound._panner.pan) {
              setupPanner(sound, 'spatial');
            }

            if (typeof sound._panner.positionX !== 'undefined') {
              sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
              sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
              sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
            } else {
              sound._panner.setOrientation(x, y, z);
            }
          }

          self._emit('pos', sound._id);
        } else {
          return sound._pos;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the direction the audio source is pointing in the 3D cartesian coordinate
   * space. Depending on how direction the sound is, based on the `cone` attributes,
   * a sound pointing away from the listener can be quiet or silent.
   * @param  {Number} x  The x-orientation of the source.
   * @param  {Number} y  The y-orientation of the source.
   * @param  {Number} z  The z-orientation of the source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial orientation: [x, y, z].
   */
  Howl.prototype.orientation = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change orientation when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'orientation',
        action: function() {
          self.orientation(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._orientation[1] : y;
    z = (typeof z !== 'number') ? self._orientation[2] : z;

    // Setup the group's spatial orientation if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial orientation if no parameters are passed.
      if (typeof x === 'number') {
        self._orientation = [x, y, z];
      } else {
        return self._orientation;
      }
    }

    // Change the spatial orientation of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._orientation = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner) {
              // Make sure we have a position to setup the node with.
              if (!sound._pos) {
                sound._pos = self._pos || [0, 0, -0.5];
              }

              setupPanner(sound, 'spatial');
            }

            sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
            sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
            sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
          }

          self._emit('orientation', sound._id);
        } else {
          return sound._orientation;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the panner node's attributes for a sound or group of sounds.
   * This method can optionall take 0, 1 or 2 arguments.
   *   pannerAttr() -> Returns the group's values.
   *   pannerAttr(id) -> Returns the sound id's values.
   *   pannerAttr(o) -> Set's the values of all sounds in this Howl group.
   *   pannerAttr(o, id) -> Set's the values of passed sound id.
   *
   *   Attributes:
   *     coneInnerAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      inside of which there will be no volume reduction.
   *     coneOuterAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      outside of which the volume will be reduced to a constant value of `coneOuterGain`.
   *     coneOuterGain - (0 by default) A parameter for directional audio sources, this is the gain outside of the
   *                     `coneOuterAngle`. It is a linear value in the range `[0, 1]`.
   *     distanceModel - ('inverse' by default) Determines algorithm used to reduce volume as audio moves away from
   *                     listener. Can be `linear`, `inverse` or `exponential.
   *     maxDistance - (10000 by default) The maximum distance between source and listener, after which the volume
   *                   will not be reduced any further.
   *     refDistance - (1 by default) A reference distance for reducing volume as source moves further from the listener.
   *                   This is simply a variable of the distance model and has a different effect depending on which model
   *                   is used and the scale of your coordinates. Generally, volume will be equal to 1 at this distance.
   *     rolloffFactor - (1 by default) How quickly the volume reduces as source moves from listener. This is simply a
   *                     variable of the distance model and can be in the range of `[0, 1]` with `linear` and `[0, ∞]`
   *                     with `inverse` and `exponential`.
   *     panningModel - ('HRTF' by default) Determines which spatialization algorithm is used to position audio.
   *                     Can be `HRTF` or `equalpower`.
   *
   * @return {Howl/Object} Returns self or current panner attributes.
   */
  Howl.prototype.pannerAttr = function() {
    var self = this;
    var args = arguments;
    var o, id, sound;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // Determine the values based on arguments.
    if (args.length === 0) {
      // Return the group's panner attribute values.
      return self._pannerAttr;
    } else if (args.length === 1) {
      if (typeof args[0] === 'object') {
        o = args[0];

        // Set the grou's panner attribute values.
        if (typeof id === 'undefined') {
          if (!o.pannerAttr) {
            o.pannerAttr = {
              coneInnerAngle: o.coneInnerAngle,
              coneOuterAngle: o.coneOuterAngle,
              coneOuterGain: o.coneOuterGain,
              distanceModel: o.distanceModel,
              maxDistance: o.maxDistance,
              refDistance: o.refDistance,
              rolloffFactor: o.rolloffFactor,
              panningModel: o.panningModel
            };
          }

          self._pannerAttr = {
            coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== 'undefined' ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
            coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== 'undefined' ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
            coneOuterGain: typeof o.pannerAttr.coneOuterGain !== 'undefined' ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
            distanceModel: typeof o.pannerAttr.distanceModel !== 'undefined' ? o.pannerAttr.distanceModel : self._distanceModel,
            maxDistance: typeof o.pannerAttr.maxDistance !== 'undefined' ? o.pannerAttr.maxDistance : self._maxDistance,
            refDistance: typeof o.pannerAttr.refDistance !== 'undefined' ? o.pannerAttr.refDistance : self._refDistance,
            rolloffFactor: typeof o.pannerAttr.rolloffFactor !== 'undefined' ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
            panningModel: typeof o.pannerAttr.panningModel !== 'undefined' ? o.pannerAttr.panningModel : self._panningModel
          };
        }
      } else {
        // Return this sound's panner attribute values.
        sound = self._soundById(parseInt(args[0], 10));
        return sound ? sound._pannerAttr : self._pannerAttr;
      }
    } else if (args.length === 2) {
      o = args[0];
      id = parseInt(args[1], 10);
    }

    // Update the values of the specified sounds.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      sound = self._soundById(ids[i]);

      if (sound) {
        // Merge the new values into the sound.
        var pa = sound._pannerAttr;
        pa = {
          coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : pa.coneInnerAngle,
          coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : pa.coneOuterAngle,
          coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : pa.coneOuterGain,
          distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : pa.distanceModel,
          maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : pa.maxDistance,
          refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : pa.refDistance,
          rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : pa.rolloffFactor,
          panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : pa.panningModel
        };

        // Update the panner values or create a new panner if none exists.
        var panner = sound._panner;
        if (panner) {
          panner.coneInnerAngle = pa.coneInnerAngle;
          panner.coneOuterAngle = pa.coneOuterAngle;
          panner.coneOuterGain = pa.coneOuterGain;
          panner.distanceModel = pa.distanceModel;
          panner.maxDistance = pa.maxDistance;
          panner.refDistance = pa.refDistance;
          panner.rolloffFactor = pa.rolloffFactor;
          panner.panningModel = pa.panningModel;
        } else {
          // Make sure we have a position to setup the node with.
          if (!sound._pos) {
            sound._pos = self._pos || [0, 0, -0.5];
          }

          // Create a new panner node.
          setupPanner(sound, 'spatial');
        }
      }
    }

    return self;
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core Sound init.
   * @param  {Function} _super Core Sound init method.
   * @return {Sound}
   */
  Sound.prototype.init = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Setup user-defined default properties.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete initilization with howler.js core Sound's init function.
      _super.call(this);

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      }
    };
  })(Sound.prototype.init);

  /**
   * Override the Sound.reset method to clean up properties from the spatial plugin.
   * @param  {Function} _super Sound reset method.
   * @return {Sound}
   */
  Sound.prototype.reset = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Reset all spatial plugin properties on this sound.
      self._orientation = parent._orientation;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete resetting of the sound.
      return _super.call(this);
    };
  })(Sound.prototype.reset);

  /** Helper Methods **/
  /***************************************************************************/

  /**
   * Create a new panner node and save it on the sound.
   * @param  {Sound} sound Specific sound to setup panning on.
   * @param {String} type Type of panner to create: 'stereo' or 'spatial'.
   */
  var setupPanner = function(sound, type) {
    type = type || 'spatial';

    // Create the new panner node.
    if (type === 'spatial') {
      sound._panner = Howler.ctx.createPanner();
      sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
      sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
      sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
      sound._panner.distanceModel = sound._pannerAttr.distanceModel;
      sound._panner.maxDistance = sound._pannerAttr.maxDistance;
      sound._panner.refDistance = sound._pannerAttr.refDistance;
      sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
      sound._panner.panningModel = sound._pannerAttr.panningModel;

      if (typeof sound._panner.positionX !== 'undefined') {
        sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
        sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
        sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
      }

      if (typeof sound._panner.orientationX !== 'undefined') {
        sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
        sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
        sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
      } else {
        sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
      }
    } else {
      sound._panner = Howler.ctx.createStereoPanner();
      sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
    }

    sound._panner.connect(sound._node);

    // Update the connections.
    if (!sound._paused) {
      sound._parent.pause(sound._id, true).play(sound._id, true);
    }
  };
})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../../webpack/buildin/global.js */ 25)))

/***/ }),
/* 36 */
/*!****************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/smoothscroll-polyfill/dist/smoothscroll.js ***!
  \****************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

/* smoothscroll v0.4.0 - 2018 - Dustan Kasten, Jeremias Menichelli - MIT License */
(function () {
  'use strict';

  // polyfill
  function polyfill() {
    // aliases
    var w = window;
    var d = document;

    // return if scroll behavior is supported and polyfill is not forced
    if (
      'scrollBehavior' in d.documentElement.style &&
      w.__forceSmoothScrollPolyfill__ !== true
    ) {
      return;
    }

    // globals
    var Element = w.HTMLElement || w.Element;
    var SCROLL_TIME = 468;

    // object gathering original scroll methods
    var original = {
      scroll: w.scroll || w.scrollTo,
      scrollBy: w.scrollBy,
      elementScroll: Element.prototype.scroll || scrollElement,
      scrollIntoView: Element.prototype.scrollIntoView
    };

    // define timing method
    var now =
      w.performance && w.performance.now
        ? w.performance.now.bind(w.performance)
        : Date.now;

    /**
     * indicates if a the current browser is made by Microsoft
     * @method isMicrosoftBrowser
     * @param {String} userAgent
     * @returns {Boolean}
     */
    function isMicrosoftBrowser(userAgent) {
      var userAgentPatterns = ['MSIE ', 'Trident/', 'Edge/'];

      return new RegExp(userAgentPatterns.join('|')).test(userAgent);
    }

    /*
     * IE has rounding bug rounding down clientHeight and clientWidth and
     * rounding up scrollHeight and scrollWidth causing false positives
     * on hasScrollableSpace
     */
    var ROUNDING_TOLERANCE = isMicrosoftBrowser(w.navigator.userAgent) ? 1 : 0;

    /**
     * changes scroll position inside an element
     * @method scrollElement
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function scrollElement(x, y) {
      this.scrollLeft = x;
      this.scrollTop = y;
    }

    /**
     * returns result of applying ease math function to a number
     * @method ease
     * @param {Number} k
     * @returns {Number}
     */
    function ease(k) {
      return 0.5 * (1 - Math.cos(Math.PI * k));
    }

    /**
     * indicates if a smooth behavior should be applied
     * @method shouldBailOut
     * @param {Number|Object} firstArg
     * @returns {Boolean}
     */
    function shouldBailOut(firstArg) {
      if (
        firstArg === null ||
        typeof firstArg !== 'object' ||
        firstArg.behavior === undefined ||
        firstArg.behavior === 'auto' ||
        firstArg.behavior === 'instant'
      ) {
        // first argument is not an object/null
        // or behavior is auto, instant or undefined
        return true;
      }

      if (typeof firstArg === 'object' && firstArg.behavior === 'smooth') {
        // first argument is an object and behavior is smooth
        return false;
      }

      // throw error when behavior is not supported
      throw new TypeError(
        'behavior member of ScrollOptions ' +
          firstArg.behavior +
          ' is not a valid value for enumeration ScrollBehavior.'
      );
    }

    /**
     * indicates if an element has scrollable space in the provided axis
     * @method hasScrollableSpace
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function hasScrollableSpace(el, axis) {
      if (axis === 'Y') {
        return el.clientHeight + ROUNDING_TOLERANCE < el.scrollHeight;
      }

      if (axis === 'X') {
        return el.clientWidth + ROUNDING_TOLERANCE < el.scrollWidth;
      }
    }

    /**
     * indicates if an element has a scrollable overflow property in the axis
     * @method canOverflow
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function canOverflow(el, axis) {
      var overflowValue = w.getComputedStyle(el, null)['overflow' + axis];

      return overflowValue === 'auto' || overflowValue === 'scroll';
    }

    /**
     * indicates if an element can be scrolled in either axis
     * @method isScrollable
     * @param {Node} el
     * @param {String} axis
     * @returns {Boolean}
     */
    function isScrollable(el) {
      var isScrollableY = hasScrollableSpace(el, 'Y') && canOverflow(el, 'Y');
      var isScrollableX = hasScrollableSpace(el, 'X') && canOverflow(el, 'X');

      return isScrollableY || isScrollableX;
    }

    /**
     * finds scrollable parent of an element
     * @method findScrollableParent
     * @param {Node} el
     * @returns {Node} el
     */
    function findScrollableParent(el) {
      var isBody;

      do {
        el = el.parentNode;

        isBody = el === d.body;
      } while (isBody === false && isScrollable(el) === false);

      isBody = null;

      return el;
    }

    /**
     * self invoked function that, given a context, steps through scrolling
     * @method step
     * @param {Object} context
     * @returns {undefined}
     */
    function step(context) {
      var time = now();
      var value;
      var currentX;
      var currentY;
      var elapsed = (time - context.startTime) / SCROLL_TIME;

      // avoid elapsed times higher than one
      elapsed = elapsed > 1 ? 1 : elapsed;

      // apply easing to elapsed time
      value = ease(elapsed);

      currentX = context.startX + (context.x - context.startX) * value;
      currentY = context.startY + (context.y - context.startY) * value;

      context.method.call(context.scrollable, currentX, currentY);

      // scroll more if we have not reached our destination
      if (currentX !== context.x || currentY !== context.y) {
        w.requestAnimationFrame(step.bind(w, context));
      }
    }

    /**
     * scrolls window or element with a smooth behavior
     * @method smoothScroll
     * @param {Object|Node} el
     * @param {Number} x
     * @param {Number} y
     * @returns {undefined}
     */
    function smoothScroll(el, x, y) {
      var scrollable;
      var startX;
      var startY;
      var method;
      var startTime = now();

      // define scroll context
      if (el === d.body) {
        scrollable = w;
        startX = w.scrollX || w.pageXOffset;
        startY = w.scrollY || w.pageYOffset;
        method = original.scroll;
      } else {
        scrollable = el;
        startX = el.scrollLeft;
        startY = el.scrollTop;
        method = scrollElement;
      }

      // scroll looping over a frame
      step({
        scrollable: scrollable,
        method: method,
        startTime: startTime,
        startX: startX,
        startY: startY,
        x: x,
        y: y
      });
    }

    // ORIGINAL METHODS OVERRIDES
    // w.scroll and w.scrollTo
    w.scroll = w.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scroll.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object'
              ? arguments[0]
              : w.scrollX || w.pageXOffset,
          // use top prop, second argument if present or fallback to scrollY
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined
              ? arguments[1]
              : w.scrollY || w.pageYOffset
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        arguments[0].left !== undefined
          ? ~~arguments[0].left
          : w.scrollX || w.pageXOffset,
        arguments[0].top !== undefined
          ? ~~arguments[0].top
          : w.scrollY || w.pageYOffset
      );
    };

    // w.scrollBy
    w.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0])) {
        original.scrollBy.call(
          w,
          arguments[0].left !== undefined
            ? arguments[0].left
            : typeof arguments[0] !== 'object' ? arguments[0] : 0,
          arguments[0].top !== undefined
            ? arguments[0].top
            : arguments[1] !== undefined ? arguments[1] : 0
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        w,
        d.body,
        ~~arguments[0].left + (w.scrollX || w.pageXOffset),
        ~~arguments[0].top + (w.scrollY || w.pageYOffset)
      );
    };

    // Element.prototype.scroll and Element.prototype.scrollTo
    Element.prototype.scroll = Element.prototype.scrollTo = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        // if one number is passed, throw error to match Firefox implementation
        if (typeof arguments[0] === 'number' && arguments[1] === undefined) {
          throw new SyntaxError('Value could not be converted');
        }

        original.elementScroll.call(
          this,
          // use left prop, first number argument or fallback to scrollLeft
          arguments[0].left !== undefined
            ? ~~arguments[0].left
            : typeof arguments[0] !== 'object' ? ~~arguments[0] : this.scrollLeft,
          // use top prop, second argument or fallback to scrollTop
          arguments[0].top !== undefined
            ? ~~arguments[0].top
            : arguments[1] !== undefined ? ~~arguments[1] : this.scrollTop
        );

        return;
      }

      var left = arguments[0].left;
      var top = arguments[0].top;

      // LET THE SMOOTHNESS BEGIN!
      smoothScroll.call(
        this,
        this,
        typeof left === 'undefined' ? this.scrollLeft : ~~left,
        typeof top === 'undefined' ? this.scrollTop : ~~top
      );
    };

    // Element.prototype.scrollBy
    Element.prototype.scrollBy = function() {
      // avoid action when no arguments are passed
      if (arguments[0] === undefined) {
        return;
      }

      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.elementScroll.call(
          this,
          arguments[0].left !== undefined
            ? ~~arguments[0].left + this.scrollLeft
            : ~~arguments[0] + this.scrollLeft,
          arguments[0].top !== undefined
            ? ~~arguments[0].top + this.scrollTop
            : ~~arguments[1] + this.scrollTop
        );

        return;
      }

      this.scroll({
        left: ~~arguments[0].left + this.scrollLeft,
        top: ~~arguments[0].top + this.scrollTop,
        behavior: arguments[0].behavior
      });
    };

    // Element.prototype.scrollIntoView
    Element.prototype.scrollIntoView = function() {
      // avoid smooth behavior if not required
      if (shouldBailOut(arguments[0]) === true) {
        original.scrollIntoView.call(
          this,
          arguments[0] === undefined ? true : arguments[0]
        );

        return;
      }

      // LET THE SMOOTHNESS BEGIN!
      var scrollableParent = findScrollableParent(this);
      var parentRects = scrollableParent.getBoundingClientRect();
      var clientRects = this.getBoundingClientRect();

      if (scrollableParent !== d.body) {
        // reveal element inside parent
        smoothScroll.call(
          this,
          scrollableParent,
          scrollableParent.scrollLeft + clientRects.left - parentRects.left,
          scrollableParent.scrollTop + clientRects.top - parentRects.top
        );

        // reveal parent in viewport unless is fixed
        if (w.getComputedStyle(scrollableParent).position !== 'fixed') {
          w.scrollBy({
            left: parentRects.left,
            top: parentRects.top,
            behavior: 'smooth'
          });
        }
      } else {
        // reveal element in viewport
        w.scrollBy({
          left: clientRects.left,
          top: clientRects.top,
          behavior: 'smooth'
        });
      }
    };
  }

  if (true) {
    // commonjs
    module.exports = { polyfill: polyfill };
  } else {
    // global
    polyfill();
  }

}());


/***/ }),
/* 37 */
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__util_Router__ = __webpack_require__(/*! ./util/Router */ 38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__routes_common__ = __webpack_require__(/*! ./routes/common */ 40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__routes_home__ = __webpack_require__(/*! ./routes/home */ 45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__routes_about__ = __webpack_require__(/*! ./routes/about */ 46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__fortawesome_fontawesome__ = __webpack_require__(/*! @fortawesome/fontawesome */ 47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__fortawesome_fontawesome_free_solid_faSearchPlus__ = __webpack_require__(/*! @fortawesome/fontawesome-free-solid/faSearchPlus */ 48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__fortawesome_fontawesome_free_solid_faSearchPlus___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__fortawesome_fontawesome_free_solid_faSearchPlus__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__fortawesome_fontawesome_free_solid_faInfoCircle__ = __webpack_require__(/*! @fortawesome/fontawesome-free-solid/faInfoCircle */ 49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__fortawesome_fontawesome_free_solid_faInfoCircle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__fortawesome_fontawesome_free_solid_faInfoCircle__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__fortawesome_fontawesome_free_solid_faShareSquare__ = __webpack_require__(/*! @fortawesome/fontawesome-free-solid/faShareSquare */ 50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__fortawesome_fontawesome_free_solid_faShareSquare___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__fortawesome_fontawesome_free_solid_faShareSquare__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__fortawesome_fontawesome_free_solid_faTimesCircle__ = __webpack_require__(/*! @fortawesome/fontawesome-free-solid/faTimesCircle */ 51);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__fortawesome_fontawesome_free_solid_faTimesCircle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__fortawesome_fontawesome_free_solid_faTimesCircle__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__fortawesome_fontawesome_free_brands_faFacebook__ = __webpack_require__(/*! @fortawesome/fontawesome-free-brands/faFacebook */ 52);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__fortawesome_fontawesome_free_brands_faFacebook___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__fortawesome_fontawesome_free_brands_faFacebook__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__fortawesome_fontawesome_free_brands_faTwitter__ = __webpack_require__(/*! @fortawesome/fontawesome-free-brands/faTwitter */ 53);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__fortawesome_fontawesome_free_brands_faTwitter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__fortawesome_fontawesome_free_brands_faTwitter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__fortawesome_fontawesome_free_solid_faEnvelope__ = __webpack_require__(/*! @fortawesome/fontawesome-free-solid/faEnvelope */ 54);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__fortawesome_fontawesome_free_solid_faEnvelope___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__fortawesome_fontawesome_free_solid_faEnvelope__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__fortawesome_fontawesome_free_solid_faCopy__ = __webpack_require__(/*! @fortawesome/fontawesome-free-solid/faCopy */ 55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__fortawesome_fontawesome_free_solid_faCopy___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__fortawesome_fontawesome_free_solid_faCopy__);
// import external dependencies
// import 'jquery';

// Import everything from autoload


// import local dependencies





// fontawesome
// base package






//TODO: these should be moved to Developer Share Buttons Plugin






__WEBPACK_IMPORTED_MODULE_4__fortawesome_fontawesome__["a" /* default */].library.add(__WEBPACK_IMPORTED_MODULE_5__fortawesome_fontawesome_free_solid_faSearchPlus___default.a, __WEBPACK_IMPORTED_MODULE_6__fortawesome_fontawesome_free_solid_faInfoCircle___default.a, __WEBPACK_IMPORTED_MODULE_7__fortawesome_fontawesome_free_solid_faShareSquare___default.a, __WEBPACK_IMPORTED_MODULE_8__fortawesome_fontawesome_free_solid_faTimesCircle___default.a, __WEBPACK_IMPORTED_MODULE_9__fortawesome_fontawesome_free_brands_faFacebook___default.a, __WEBPACK_IMPORTED_MODULE_10__fortawesome_fontawesome_free_brands_faTwitter___default.a, __WEBPACK_IMPORTED_MODULE_11__fortawesome_fontawesome_free_solid_faEnvelope___default.a, __WEBPACK_IMPORTED_MODULE_12__fortawesome_fontawesome_free_solid_faCopy___default.a);

/** Populate Router instance with DOM routes */
var routes = new __WEBPACK_IMPORTED_MODULE_0__util_Router__["a" /* default */]({
  // All pages
  common: __WEBPACK_IMPORTED_MODULE_1__routes_common__["a" /* default */],
  // Home page
  home: __WEBPACK_IMPORTED_MODULE_2__routes_home__["a" /* default */],
  // About Us page, note the change from about-us to aboutUs.
  aboutUs: __WEBPACK_IMPORTED_MODULE_3__routes_about__["a" /* default */],
});

// Load Events
jQuery(document).ready(function () { return routes.loadEvents(); });

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 4)))

/***/ }),
/* 38 */
/*!********************************!*\
  !*** ./scripts/util/Router.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__camelCase__ = __webpack_require__(/*! ./camelCase */ 39);


/**
 * DOM-based Routing
 *
 * Based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 *
 * The routing fires all common scripts, followed by the page specific scripts.
 * Add additional events for more control over timing e.g. a finalize event
 */
var Router = function Router(routes) {
  this.routes = routes;
};

/**
 * Fire Router events
 * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
 * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
 * @param {string} [arg] Any custom argument to be passed to the event.
 */
Router.prototype.fire = function fire (route, event, arg) {
    if ( event === void 0 ) event = 'init';

  var fire = route !== '' && this.routes[route] && typeof this.routes[route][event] === 'function';
  if (fire) {
    this.routes[route][event](arg);
  }
};

/**
 * Automatically load and fire Router events
 *
 * Events are fired in the following order:
 ** common init
 ** page-specific init
 ** page-specific finalize
 ** common finalize
 */
Router.prototype.loadEvents = function loadEvents () {
    var this$1 = this;

  // Fire common init JS
  this.fire('common');

  // Fire page-specific init JS, and then finalize JS
  document.body.className
    .toLowerCase()
    .replace(/-/g, '_')
    .split(/\s+/)
    .map(__WEBPACK_IMPORTED_MODULE_0__camelCase__["a" /* default */])
    .forEach(function (className) {
      this$1.fire(className);
      this$1.fire(className, 'finalize');
    });

  // Fire common finalize JS
  this.fire('common', 'finalize');
};

/* harmony default export */ __webpack_exports__["a"] = (Router);


/***/ }),
/* 39 */
/*!***********************************!*\
  !*** ./scripts/util/camelCase.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * the most terrible camelizer on the internet, guaranteed!
 * @param {string} str String that isn't camel-case, e.g., CAMeL_CaSEiS-harD
 * @return {string} String converted to camel-case, e.g., camelCaseIsHard
 */
/* harmony default export */ __webpack_exports__["a"] = (function (str) { return ("" + (str.charAt(0).toLowerCase()) + (str.replace(/[\W_]/g, '|').split('|')
  .map(function (part) { return ("" + (part.charAt(0).toUpperCase()) + (part.slice(1))); })
  .join('')
  .slice(1))); });;


/***/ }),
/* 40 */
/*!**********************************!*\
  !*** ./scripts/routes/common.js ***!
  \**********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function($) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__more_info__ = __webpack_require__(/*! ../more-info */ 26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__st_audio__ = __webpack_require__(/*! ../st-audio */ 24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__zoomy__ = __webpack_require__(/*! ../zoomy */ 19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__nakasentro__ = __webpack_require__(/*! ../nakasentro */ 3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__artwork_info__ = __webpack_require__(/*! ../artwork-info */ 23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mu_plugins_menu_vertical_push_menu_vertical_push__ = __webpack_require__(/*! ../../../../../../mu-plugins/menu-vertical-push/menu-vertical-push */ 41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__thumbnail_nav__ = __webpack_require__(/*! ../thumbnail-nav */ 21);






// import {addBackToTop} from 'vanilla-back-to-top';

// import Cookies from 'js-cookie';

/* harmony default export */ __webpack_exports__["a"] = ({
	init: function init() {
		// JavaScript to be fired on all pages

		window.onload = function () {
			// init menu-vertical-push
			__WEBPACK_IMPORTED_MODULE_5__mu_plugins_menu_vertical_push_menu_vertical_push__["a" /* init */]();
			// addBackToTop({zIndex: 2});

			// Detects if device is on iOS
			var isIos = function () {
				var userAgent = window.navigator.userAgent.toLowerCase();
				return /iphone|ipad|ipod/.test(userAgent);
			};
// Detects if device is in standalone mode
			var isInStandaloneMode = function () { return ('standalone' in window.navigator) && (window.navigator.standalone); };

// Checks if should display install popup notification:
			if (isIos() && !isInStandaloneMode()) {
				this.setState({showInstallMessage: true});
			}
		};

		var playVideo = function () {
			this.closest('.video').classList.add('playing');

		};

		var playButtons = document.querySelectorAll(".video .play-button");
		playButtons.forEach(function (button) {
			button.addEventListener("click", playVideo.bind(button), {
				once: true,
			}, false);
		});

		function debounce(func, wait, immediate) {
			var timeout;
			return function () {
				var context = this,
					args = arguments;
				var later = function () {
					timeout = null;
					if (!immediate) {
						func.apply(context, args);
					}
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) {
					func.apply(context, args);
				}
			};
		}

		// setup resize event after user stops resizing
		var resize_event = debounce(function () {
			// things to run after resize
			__WEBPACK_IMPORTED_MODULE_0__more_info__["moreInfo"].init();
		}, 300);

		window.addEventListener("resize", resize_event);

		// add scroll to function
		// can be used like $('.banner').goTo();
		$.fn.goTo = function () {
			$("html, body").animate({
					scrollTop: $(this).offset().top + "px",
				},
				"fast"
			);
			return this;
		};

		// init fullscreen
		/* eslint-disable */
		var CommonView = Barba.BaseView.extend({
			/* eslint-enable */
			namespace: "common",
			onEnterCompleted: function () {
				// The Transition has just finished.

				// init thumbnails
				if (document.body.classList.contains('template-projects')) {
					Object(__WEBPACK_IMPORTED_MODULE_6__thumbnail_nav__["setInitFalse"])();
					Object(__WEBPACK_IMPORTED_MODULE_6__thumbnail_nav__["init"])(document.querySelector('.main'));
				}

				// spin up share
				/* eslint-disable */
				share.init();
				/* eslint-enable */

				//spin up audio
				__WEBPACK_IMPORTED_MODULE_1__st_audio__["stAudio"].init();

				// wait for images to load before spinning up the artwork animation
				var images = document.querySelectorAll('.main .artwork_piece .main-img');
				var imagesCount = images.length;
				images.forEach(function (img) {
					if (img.complete === true) {
						imagesCount--;
					} else {
						img.addEventListener('load', function () {
							imagesCount--;
							checkIfImagesLoaded(imagesCount);
						});
					}
					checkIfImagesLoaded(imagesCount);
				});


				function checkIfImagesLoaded(imagesCount) {
					if (imagesCount === 0) {
						initArtwork();

						//spin up zoomy, must be done after initArtwork
						__WEBPACK_IMPORTED_MODULE_2__zoomy__["zoomy"].init();
					}
				}

				function initArtwork() {
					// spin up artwork animation
					__WEBPACK_IMPORTED_MODULE_3__nakasentro__["nakasentro"].init();
					__WEBPACK_IMPORTED_MODULE_4__artwork_info__["artworkInfo"].init();
					__WEBPACK_IMPORTED_MODULE_0__more_info__["moreInfo"].init();
				}
			},
			onLeave: function () {
				__WEBPACK_IMPORTED_MODULE_1__st_audio__["stAudio"].stopAllPlayers();
			},
		});
		CommonView.init();

		/* eslint-disable */
		Barba.Pjax.start({
			/* eslint-enable */
			showFullscreenModal: true,
		});

	},
	finalize: function finalize() {
		// JavaScript to be fired on all pages, after page specific JS is fired
	},
});

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 4)))

/***/ }),
/* 41 */
/*!**********************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/mu-plugins/menu-vertical-push/menu-vertical-push.js ***!
  \**********************************************************************************************************************************/
/*! exports provided: init */
/*! exports used: init */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = init;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_hamburgers__ = __webpack_require__(/*! hamburgers */ 42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_hamburgers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_hamburgers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__ = __webpack_require__(/*! body-scroll-lock */ 44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_body_scroll_lock___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__);



var menuWrap = document.querySelector('header.banner');
var hamburger = null;
// let menuWrapHeight = null;
var ignoreHeightAmount = 0;

function init() {
	menuWrap.classList.add('menu-vertical-push');
	// menuWrapHeight = outerHeight(menuWrap);
	// ignoreHeightAmount = outerHeight(menuWrap.querySelector('.brand'));
	// console.log(ignoreHeightAmount);
	// console.log(menuWrapHeight);
	// menuWrap.style.marginTop = -(menuWrapHeight - ignoreHeightAmount) + 'px';
	var menuLinks = menuWrap.querySelectorAll('a:not(.brand)');
	menuLinks.forEach(function (link) {
		link.addEventListener('click', menuLinkClick);
	});
	var hamburgerHtml = getHamburgerHtml();
	menuWrap.insertAdjacentElement('beforebegin', hamburgerHtml);
	hamburger = document.querySelector('.hamburger');
	window.setTimeout(function () {
		menuWrap.classList.add();
	}, 100);


	hamburger.addEventListener('click', function () {
		toggleMenu();
		if (!this.classList.contains('is-active')) {
			Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["disableBodyScroll"])();
		} else {
			Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["clearAllBodyScrollLocks"])();
		}
		this.classList.toggle('is-active');
	}, false);

	menuWrap.classList.add('menu-vertical-push-processed');
}

var menuLinkClick = function () {
	toggleMenu();
	Object(__WEBPACK_IMPORTED_MODULE_1_body_scroll_lock__["clearAllBodyScrollLocks"])();
	hamburger.classList.remove('is-active');
};

var getHamburgerHtml = function () {
	var hamburgerHtmlString = "\n\t\t<button class=\"hamburger hamburger--collapse\" type=\"button\">\n\t\t  <span class=\"hamburger-box\">\n\t\t    <span class=\"hamburger-inner\"></span>\n\t\t  </span>\n\t\t</button>  \n\t";

	var div = document.createElement('div');
	div.innerHTML = hamburgerHtmlString;
	return div.firstElementChild;
};

var toggleMenu = function () {
	outerHeight(menuWrap);
	if (menuWrap.classList.contains('open')) {
		menuWrap.classList.remove('open');
	} else {
		menuWrap.classList.add('open');
	}
};

var outerHeight = function (el) {
	var height = el.offsetHeight;
	// const style = getComputedStyle(el);
	// height += parseInt(style.marginTop) + parseInt(style.marginBottom);
	return height;
};

/***/ }),
/* 42 */
/*!*********************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/mu-plugins/menu-vertical-push/node_modules/hamburgers/index.js ***!
  \*********************************************************************************************************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var path = __webpack_require__(/*! path */ 43);

module.exports = {
  includePaths: [
    path.join(__dirname, "_sass/hamburgers")
  ]
};

/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 43 */
/*!**********************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/path-browserify/index.js ***!
  \**********************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../process/browser.js */ 29)))

/***/ }),
/* 44 */
/*!****************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/mu-plugins/menu-vertical-push/node_modules/body-scroll-lock/lib/bodyScrollLock.js ***!
  \****************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: clearAllBodyScrollLocks, disableBodyScroll */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var isIosDevice = typeof window !== 'undefined' && window.navigator && window.navigator.platform && /iPad|iPhone|iPod|(iPad Simulator)|(iPhone Simulator)|(iPod Simulator)/.test(window.navigator.platform);
// Adopted and modified solution from Bohdan Didukh (2017)
// https://stackoverflow.com/questions/41594997/ios-10-safari-prevent-scrolling-behind-a-fixed-overlay-and-maintain-scroll-posi

var firstTargetElement = null;
var allTargetElements = [];
var initialClientY = -1;
var previousBodyOverflowSetting = void 0;
var previousBodyPaddingRight = void 0;

var preventDefault = function preventDefault(rawEvent) {
  var e = rawEvent || window.event;
  if (e.preventDefault) e.preventDefault();

  return false;
};

var setOverflowHidden = function setOverflowHidden(options) {
  // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
  // the responsiveness for some reason. Setting within a setTimeout fixes this.
  setTimeout(function () {
    // If previousBodyPaddingRight is already set, don't set it again.
    if (previousBodyPaddingRight === undefined) {
      var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
      var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;

      if (_reserveScrollBarGap && scrollBarGap > 0) {
        previousBodyPaddingRight = document.body.style.paddingRight;
        document.body.style.paddingRight = scrollBarGap + 'px';
      }
    }

    // If previousBodyOverflowSetting is already set, don't set it again.
    if (previousBodyOverflowSetting === undefined) {
      previousBodyOverflowSetting = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
  });
};

var restoreOverflowSetting = function restoreOverflowSetting() {
  // Setting overflow on body/documentElement synchronously in Desktop Safari slows down
  // the responsiveness for some reason. Setting within a setTimeout fixes this.
  setTimeout(function () {
    if (previousBodyPaddingRight !== undefined) {
      document.body.style.paddingRight = previousBodyPaddingRight;

      // Restore previousBodyPaddingRight to undefined so setOverflowHidden knows it
      // can be set again.
      previousBodyPaddingRight = undefined;
    }

    if (previousBodyOverflowSetting !== undefined) {
      document.body.style.overflow = previousBodyOverflowSetting;

      // Restore previousBodyOverflowSetting to undefined
      // so setOverflowHidden knows it can be set again.
      previousBodyOverflowSetting = undefined;
    }
  });
};

// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#Problems_and_solutions
var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled(targetElement) {
  return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
};

var handleScroll = function handleScroll(event, targetElement) {
  var clientY = event.targetTouches[0].clientY - initialClientY;

  if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
    // element is at the top of its scroll
    return preventDefault(event);
  }

  if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
    // element is at the top of its scroll
    return preventDefault(event);
  }

  return true;
};

var disableBodyScroll = exports.disableBodyScroll = function disableBodyScroll(targetElement, options) {
  if (isIosDevice) {
    // targetElement must be provided, and disableBodyScroll must not have been
    // called on this targetElement before.
    if (targetElement && !allTargetElements.includes(targetElement)) {
      allTargetElements = [].concat(_toConsumableArray(allTargetElements), [targetElement]);

      targetElement.ontouchstart = function (event) {
        if (event.targetTouches.length === 1) {
          // detect single touch
          initialClientY = event.targetTouches[0].clientY;
        }
      };
      targetElement.ontouchmove = function (event) {
        if (event.targetTouches.length === 1) {
          // detect single touch
          handleScroll(event, targetElement);
        }
      };
    }
  } else {
    setOverflowHidden(options);

    if (!firstTargetElement) firstTargetElement = targetElement;
  }
};

var clearAllBodyScrollLocks = exports.clearAllBodyScrollLocks = function clearAllBodyScrollLocks() {
  if (isIosDevice) {
    // Clear all allTargetElements ontouchstart/ontouchmove handlers, and the references
    allTargetElements.forEach(function (targetElement) {
      targetElement.ontouchstart = null;
      targetElement.ontouchmove = null;
    });

    allTargetElements = [];

    // Reset initial clientY
    initialClientY = -1;
  } else {
    restoreOverflowSetting();

    firstTargetElement = null;
  }
};

var enableBodyScroll = exports.enableBodyScroll = function enableBodyScroll(targetElement) {
  if (isIosDevice) {
    targetElement.ontouchstart = null;
    targetElement.ontouchmove = null;

    allTargetElements = allTargetElements.filter(function (element) {
      return element !== targetElement;
    });
  } else if (firstTargetElement === targetElement) {
    restoreOverflowSetting();

    firstTargetElement = null;
  }
};

/***/ }),
/* 45 */
/*!********************************!*\
  !*** ./scripts/routes/home.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on the home page
  },
  finalize: function finalize() {
    // JavaScript to be fired on the home page, after the init JS
  },
});


/***/ }),
/* 46 */
/*!*********************************!*\
  !*** ./scripts/routes/about.js ***!
  \*********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on the about us page
  },
});


/***/ }),
/* 47 */
/*!**********************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/@fortawesome/fontawesome/index.es.js ***!
  \**********************************************************************************************************************************************************/
/*! exports provided: config, icon, noAuto, layer, text, library, dom, parse, findIconDefinition, default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* unused harmony export config */
/* unused harmony export icon */
/* unused harmony export noAuto */
/* unused harmony export layer */
/* unused harmony export text */
/* unused harmony export library */
/* unused harmony export dom */
/* unused harmony export parse */
/* unused harmony export findIconDefinition */
/*!
 * Font Awesome Free 5.0.13 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 */
var noop = function noop() {};

var _WINDOW = {};
var _DOCUMENT = {};
var _MUTATION_OBSERVER$1 = null;
var _PERFORMANCE = { mark: noop, measure: noop };

try {
  if (typeof window !== 'undefined') _WINDOW = window;
  if (typeof document !== 'undefined') _DOCUMENT = document;
  if (typeof MutationObserver !== 'undefined') _MUTATION_OBSERVER$1 = MutationObserver;
  if (typeof performance !== 'undefined') _PERFORMANCE = performance;
} catch (e) {}

var _ref = _WINDOW.navigator || {};
var _ref$userAgent = _ref.userAgent;
var userAgent = _ref$userAgent === undefined ? '' : _ref$userAgent;

var WINDOW = _WINDOW;
var DOCUMENT = _DOCUMENT;
var MUTATION_OBSERVER = _MUTATION_OBSERVER$1;
var PERFORMANCE = _PERFORMANCE;
var IS_BROWSER = !!WINDOW.document;
var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
var IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
var UNITS_IN_GRID = 16;
var DEFAULT_FAMILY_PREFIX = 'fa';
var DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa';
var DATA_FA_I2SVG = 'data-fa-i2svg';
var DATA_FA_PSEUDO_ELEMENT = 'data-fa-pseudo-element';
var HTML_CLASS_I2SVG_BASE_CLASS = 'fontawesome-i2svg';

var PRODUCTION = function () {
  try {
    return process.env.NODE_ENV === 'production';
  } catch (e) {
    return false;
  }
}();

var oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);

var ATTRIBUTES_WATCHED_FOR_MUTATION = ['class', 'data-prefix', 'data-icon', 'data-fa-transform', 'data-fa-mask'];

var RESERVED_CLASSES = ['xs', 'sm', 'lg', 'fw', 'ul', 'li', 'border', 'pull-left', 'pull-right', 'spin', 'pulse', 'rotate-90', 'rotate-180', 'rotate-270', 'flip-horizontal', 'flip-vertical', 'stack', 'stack-1x', 'stack-2x', 'inverse', 'layers', 'layers-text', 'layers-counter'].concat(oneToTen.map(function (n) {
  return n + 'x';
})).concat(oneToTwenty.map(function (n) {
  return 'w-' + n;
}));

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();



var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};



var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var initial = WINDOW.FontAwesomeConfig || {};
var initialKeys = Object.keys(initial);

var _default = _extends({
  familyPrefix: DEFAULT_FAMILY_PREFIX,
  replacementClass: DEFAULT_REPLACEMENT_CLASS,
  autoReplaceSvg: true,
  autoAddCss: true,
  autoA11y: true,
  searchPseudoElements: false,
  observeMutations: true,
  keepOriginalSource: true,
  measurePerformance: false,
  showMissingIcons: true
}, initial);

if (!_default.autoReplaceSvg) _default.observeMutations = false;

var config$1 = _extends({}, _default);

WINDOW.FontAwesomeConfig = config$1;

function update(newConfig) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$asNewDefault = params.asNewDefault,
      asNewDefault = _params$asNewDefault === undefined ? false : _params$asNewDefault;

  var validKeys = Object.keys(config$1);
  var ok = asNewDefault ? function (k) {
    return ~validKeys.indexOf(k) && !~initialKeys.indexOf(k);
  } : function (k) {
    return ~validKeys.indexOf(k);
  };

  Object.keys(newConfig).forEach(function (configKey) {
    if (ok(configKey)) config$1[configKey] = newConfig[configKey];
  });
}

function auto(value) {
  update({
    autoReplaceSvg: value,
    observeMutations: value
  });
}

var w = WINDOW || {};

if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];

var namespace = w[NAMESPACE_IDENTIFIER];

var functions = [];
var listener = function listener() {
  DOCUMENT.removeEventListener('DOMContentLoaded', listener);
  loaded = 1;
  functions.map(function (fn) {
    return fn();
  });
};

var loaded = false;

if (IS_DOM) {
  loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);

  if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener);
}

var domready = function (fn) {
  if (!IS_DOM) return;
  loaded ? setTimeout(fn, 0) : functions.push(fn);
};

var d = UNITS_IN_GRID;

var meaninglessTransform = {
  size: 16,
  x: 0,
  y: 0,
  rotate: 0,
  flipX: false,
  flipY: false
};

function isReserved(name) {
  return ~RESERVED_CLASSES.indexOf(name);
}

function bunker(fn) {
  try {
    fn();
  } catch (e) {
    if (!PRODUCTION) {
      throw e;
    }
  }
}

function insertCss(css) {
  if (!css || !IS_DOM) {
    return;
  }

  var style = DOCUMENT.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;

  var headChildren = DOCUMENT.head.childNodes;
  var beforeChild = null;

  for (var i = headChildren.length - 1; i > -1; i--) {
    var child = headChildren[i];
    var tagName = (child.tagName || '').toUpperCase();
    if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }

  DOCUMENT.head.insertBefore(style, beforeChild);

  return css;
}

var _uniqueId = 0;

function nextUniqueId() {
  _uniqueId++;

  return _uniqueId;
}

function toArray(obj) {
  var array = [];

  for (var i = (obj || []).length >>> 0; i--;) {
    array[i] = obj[i];
  }

  return array;
}

function classArray(node) {
  if (node.classList) {
    return toArray(node.classList);
  } else {
    return (node.getAttribute('class') || '').split(' ').filter(function (i) {
      return i;
    });
  }
}

function getIconName(familyPrefix, cls) {
  var parts = cls.split('-');
  var prefix = parts[0];
  var iconName = parts.slice(1).join('-');

  if (prefix === familyPrefix && iconName !== '' && !isReserved(iconName)) {
    return iconName;
  } else {
    return null;
  }
}

function htmlEscape(str) {
  return ('' + str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function joinAttributes(attributes) {
  return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
    return acc + (attributeName + '="' + htmlEscape(attributes[attributeName]) + '" ');
  }, '').trim();
}

function joinStyles(styles) {
  return Object.keys(styles || {}).reduce(function (acc, styleName) {
    return acc + (styleName + ': ' + styles[styleName] + ';');
  }, '');
}

function transformIsMeaningful(transform) {
  return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
}

function transformForSvg(_ref) {
  var transform = _ref.transform,
      containerWidth = _ref.containerWidth,
      iconWidth = _ref.iconWidth;

  var outer = {
    transform: 'translate(' + containerWidth / 2 + ' 256)'
  };
  var innerTranslate = 'translate(' + transform.x * 32 + ', ' + transform.y * 32 + ') ';
  var innerScale = 'scale(' + transform.size / 16 * (transform.flipX ? -1 : 1) + ', ' + transform.size / 16 * (transform.flipY ? -1 : 1) + ') ';
  var innerRotate = 'rotate(' + transform.rotate + ' 0 0)';
  var inner = {
    transform: innerTranslate + ' ' + innerScale + ' ' + innerRotate
  };
  var path = {
    transform: 'translate(' + iconWidth / 2 * -1 + ' -256)'
  };
  return {
    outer: outer,
    inner: inner,
    path: path
  };
}

function transformForCss(_ref2) {
  var transform = _ref2.transform,
      _ref2$width = _ref2.width,
      width = _ref2$width === undefined ? UNITS_IN_GRID : _ref2$width,
      _ref2$height = _ref2.height,
      height = _ref2$height === undefined ? UNITS_IN_GRID : _ref2$height,
      _ref2$startCentered = _ref2.startCentered,
      startCentered = _ref2$startCentered === undefined ? false : _ref2$startCentered;

  var val = '';

  if (startCentered && IS_IE) {
    val += 'translate(' + (transform.x / d - width / 2) + 'em, ' + (transform.y / d - height / 2) + 'em) ';
  } else if (startCentered) {
    val += 'translate(calc(-50% + ' + transform.x / d + 'em), calc(-50% + ' + transform.y / d + 'em)) ';
  } else {
    val += 'translate(' + transform.x / d + 'em, ' + transform.y / d + 'em) ';
  }

  val += 'scale(' + transform.size / d * (transform.flipX ? -1 : 1) + ', ' + transform.size / d * (transform.flipY ? -1 : 1) + ') ';
  val += 'rotate(' + transform.rotate + 'deg) ';

  return val;
}

var ALL_SPACE = {
  x: 0,
  y: 0,
  width: '100%',
  height: '100%'
};

var makeIconMasking = function (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      mask = _ref.mask,
      transform = _ref.transform;
  var mainWidth = main.width,
      mainPath = main.icon;
  var maskWidth = mask.width,
      maskPath = mask.icon;


  var trans = transformForSvg({ transform: transform, containerWidth: maskWidth, iconWidth: mainWidth });

  var maskRect = {
    tag: 'rect',
    attributes: _extends({}, ALL_SPACE, {
      fill: 'white'
    })
  };
  var maskInnerGroup = {
    tag: 'g',
    attributes: _extends({}, trans.inner),
    children: [{ tag: 'path', attributes: _extends({}, mainPath.attributes, trans.path, { fill: 'black' }) }]
  };
  var maskOuterGroup = {
    tag: 'g',
    attributes: _extends({}, trans.outer),
    children: [maskInnerGroup]
  };
  var maskId = 'mask-' + nextUniqueId();
  var clipId = 'clip-' + nextUniqueId();
  var maskTag = {
    tag: 'mask',
    attributes: _extends({}, ALL_SPACE, {
      id: maskId,
      maskUnits: 'userSpaceOnUse',
      maskContentUnits: 'userSpaceOnUse'
    }),
    children: [maskRect, maskOuterGroup]
  };
  var defs = {
    tag: 'defs',
    children: [{ tag: 'clipPath', attributes: { id: clipId }, children: [maskPath] }, maskTag]
  };

  children.push(defs, { tag: 'rect', attributes: _extends({ fill: 'currentColor', 'clip-path': 'url(#' + clipId + ')', mask: 'url(#' + maskId + ')' }, ALL_SPACE) });

  return {
    children: children,
    attributes: attributes
  };
};

var makeIconStandard = function (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      transform = _ref.transform,
      styles = _ref.styles;

  var styleString = joinStyles(styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  if (transformIsMeaningful(transform)) {
    var trans = transformForSvg({ transform: transform, containerWidth: main.width, iconWidth: main.width });
    children.push({
      tag: 'g',
      attributes: _extends({}, trans.outer),
      children: [{
        tag: 'g',
        attributes: _extends({}, trans.inner),
        children: [{
          tag: main.icon.tag,
          children: main.icon.children,
          attributes: _extends({}, main.icon.attributes, trans.path)
        }]
      }]
    });
  } else {
    children.push(main.icon);
  }

  return {
    children: children,
    attributes: attributes
  };
};

var asIcon = function (_ref) {
  var children = _ref.children,
      main = _ref.main,
      mask = _ref.mask,
      attributes = _ref.attributes,
      styles = _ref.styles,
      transform = _ref.transform;

  if (transformIsMeaningful(transform) && main.found && !mask.found) {
    var width = main.width,
        height = main.height;

    var offset = {
      x: width / height / 2,
      y: 0.5
    };
    attributes['style'] = joinStyles(_extends({}, styles, {
      'transform-origin': offset.x + transform.x / 16 + 'em ' + (offset.y + transform.y / 16) + 'em'
    }));
  }

  return [{
    tag: 'svg',
    attributes: attributes,
    children: children
  }];
};

var asSymbol = function (_ref) {
  var prefix = _ref.prefix,
      iconName = _ref.iconName,
      children = _ref.children,
      attributes = _ref.attributes,
      symbol = _ref.symbol;

  var id = symbol === true ? prefix + '-' + config$1.familyPrefix + '-' + iconName : symbol;

  return [{
    tag: 'svg',
    attributes: {
      style: 'display: none;'
    },
    children: [{
      tag: 'symbol',
      attributes: _extends({}, attributes, { id: id }),
      children: children
    }]
  }];
};

function makeInlineSvgAbstract(params) {
  var _params$icons = params.icons,
      main = _params$icons.main,
      mask = _params$icons.mask,
      prefix = params.prefix,
      iconName = params.iconName,
      transform = params.transform,
      symbol = params.symbol,
      title = params.title,
      extra = params.extra,
      _params$watchable = params.watchable,
      watchable = _params$watchable === undefined ? false : _params$watchable;

  var _ref = mask.found ? mask : main,
      width = _ref.width,
      height = _ref.height;

  var widthClass = 'fa-w-' + Math.ceil(width / height * 16);
  var attrClass = [config$1.replacementClass, iconName ? config$1.familyPrefix + '-' + iconName : '', widthClass].concat(extra.classes).join(' ');

  var content = {
    children: [],
    attributes: _extends({}, extra.attributes, {
      'data-prefix': prefix,
      'data-icon': iconName,
      'class': attrClass,
      'role': 'img',
      'xmlns': 'http://www.w3.org/2000/svg',
      'viewBox': '0 0 ' + width + ' ' + height
    })
  };

  if (watchable) {
    content.attributes[DATA_FA_I2SVG] = '';
  }

  if (title) content.children.push({ tag: 'title', attributes: { id: content.attributes['aria-labelledby'] || 'title-' + nextUniqueId() }, children: [title] });

  var args = _extends({}, content, {
    prefix: prefix,
    iconName: iconName,
    main: main,
    mask: mask,
    transform: transform,
    symbol: symbol,
    styles: extra.styles
  });

  var _ref2 = mask.found && main.found ? makeIconMasking(args) : makeIconStandard(args),
      children = _ref2.children,
      attributes = _ref2.attributes;

  args.children = children;
  args.attributes = attributes;

  if (symbol) {
    return asSymbol(args);
  } else {
    return asIcon(args);
  }
}

function makeLayersTextAbstract(params) {
  var content = params.content,
      width = params.width,
      height = params.height,
      transform = params.transform,
      title = params.title,
      extra = params.extra,
      _params$watchable2 = params.watchable,
      watchable = _params$watchable2 === undefined ? false : _params$watchable2;


  var attributes = _extends({}, extra.attributes, title ? { 'title': title } : {}, {
    'class': extra.classes.join(' ')
  });

  if (watchable) {
    attributes[DATA_FA_I2SVG] = '';
  }

  var styles = _extends({}, extra.styles);

  if (transformIsMeaningful(transform)) {
    styles['transform'] = transformForCss({ transform: transform, startCentered: true, width: width, height: height });
    styles['-webkit-transform'] = styles['transform'];
  }

  var styleString = joinStyles(styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  var val = [];

  val.push({
    tag: 'span',
    attributes: attributes,
    children: [content]
  });

  if (title) {
    val.push({ tag: 'span', attributes: { class: 'sr-only' }, children: [title] });
  }

  return val;
}

var noop$2 = function noop() {};
var p = config$1.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : { mark: noop$2, measure: noop$2 };
var preamble = 'FA "5.0.13"';

var begin = function begin(name) {
  p.mark(preamble + ' ' + name + ' begins');
  return function () {
    return end(name);
  };
};

var end = function end(name) {
  p.mark(preamble + ' ' + name + ' ends');
  p.measure(preamble + ' ' + name, preamble + ' ' + name + ' begins', preamble + ' ' + name + ' ends');
};

var perf = { begin: begin, end: end };

'use strict';

/**
 * Internal helper to bind a function known to have 4 arguments
 * to a given context.
 */
var bindInternal4 = function bindInternal4 (func, thisContext) {
  return function (a, b, c, d) {
    return func.call(thisContext, a, b, c, d);
  };
};

'use strict';



/**
 * # Reduce
 *
 * A fast object `.reduce()` implementation.
 *
 * @param  {Object}   subject      The object to reduce over.
 * @param  {Function} fn           The reducer function.
 * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
 * @param  {Object}   thisContext  The context for the reducer.
 * @return {mixed}                 The final result.
 */
var reduce = function fastReduceObject (subject, fn, initialValue, thisContext) {
  var keys = Object.keys(subject),
      length = keys.length,
      iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
      i, key, result;

  if (initialValue === undefined) {
    i = 1;
    result = subject[keys[0]];
  }
  else {
    i = 0;
    result = initialValue;
  }

  for (; i < length; i++) {
    key = keys[i];
    result = iterator(result, subject[key], key, subject);
  }

  return result;
};

var styles$2 = namespace.styles;
var shims = namespace.shims;


var _byUnicode = {};
var _byLigature = {};
var _byOldName = {};

var build = function build() {
  var lookup = function lookup(reducer) {
    return reduce(styles$2, function (o, style, prefix) {
      o[prefix] = reduce(style, reducer, {});
      return o;
    }, {});
  };

  _byUnicode = lookup(function (acc, icon, iconName) {
    acc[icon[3]] = iconName;

    return acc;
  });

  _byLigature = lookup(function (acc, icon, iconName) {
    var ligatures = icon[2];

    acc[iconName] = iconName;

    ligatures.forEach(function (ligature) {
      acc[ligature] = iconName;
    });

    return acc;
  });

  var hasRegular = 'far' in styles$2;

  _byOldName = reduce(shims, function (acc, shim) {
    var oldName = shim[0];
    var prefix = shim[1];
    var iconName = shim[2];

    if (prefix === 'far' && !hasRegular) {
      prefix = 'fas';
    }

    acc[oldName] = { prefix: prefix, iconName: iconName };

    return acc;
  }, {});
};

build();

function byUnicode(prefix, unicode) {
  return _byUnicode[prefix][unicode];
}

function byLigature(prefix, ligature) {
  return _byLigature[prefix][ligature];
}

function byOldName(name) {
  return _byOldName[name] || { prefix: null, iconName: null };
}

var styles$1 = namespace.styles;


var emptyCanonicalIcon = function emptyCanonicalIcon() {
  return { prefix: null, iconName: null, rest: [] };
};

function getCanonicalIcon(values) {
  return values.reduce(function (acc, cls) {
    var iconName = getIconName(config$1.familyPrefix, cls);

    if (styles$1[cls]) {
      acc.prefix = cls;
    } else if (iconName) {
      var shim = acc.prefix === 'fa' ? byOldName(iconName) : {};

      acc.iconName = shim.iconName || iconName;
      acc.prefix = shim.prefix || acc.prefix;
    } else if (cls !== config$1.replacementClass && cls.indexOf('fa-w-') !== 0) {
      acc.rest.push(cls);
    }

    return acc;
  }, emptyCanonicalIcon());
}

function iconFromMapping(mapping, prefix, iconName) {
  if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
    return {
      prefix: prefix,
      iconName: iconName,
      icon: mapping[prefix][iconName]
    };
  }
}

function toHtml(abstractNodes) {
  var tag = abstractNodes.tag,
      _abstractNodes$attrib = abstractNodes.attributes,
      attributes = _abstractNodes$attrib === undefined ? {} : _abstractNodes$attrib,
      _abstractNodes$childr = abstractNodes.children,
      children = _abstractNodes$childr === undefined ? [] : _abstractNodes$childr;


  if (typeof abstractNodes === 'string') {
    return htmlEscape(abstractNodes);
  } else {
    return '<' + tag + ' ' + joinAttributes(attributes) + '>' + children.map(toHtml).join('') + '</' + tag + '>';
  }
}

var noop$1 = function noop() {};

function isWatched(node) {
  var i2svg = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null;

  return typeof i2svg === 'string';
}

function getMutator() {
  if (config$1.autoReplaceSvg === true) {
    return mutators.replace;
  }

  var mutator = mutators[config$1.autoReplaceSvg];

  return mutator || mutators.replace;
}

var mutators = {
  replace: function replace(mutation) {
    var node = mutation[0];
    var abstract = mutation[1];
    var newOuterHTML = abstract.map(function (a) {
      return toHtml(a);
    }).join('\n');

    if (node.parentNode && node.outerHTML) {
      node.outerHTML = newOuterHTML + (config$1.keepOriginalSource && node.tagName.toLowerCase() !== 'svg' ? '<!-- ' + node.outerHTML + ' -->' : '');
    } else if (node.parentNode) {
      var newNode = document.createElement('span');
      node.parentNode.replaceChild(newNode, node);
      newNode.outerHTML = newOuterHTML;
    }
  },
  nest: function nest(mutation) {
    var node = mutation[0];
    var abstract = mutation[1];

    // If we already have a replaced node we do not want to continue nesting within it.
    // Short-circuit to the standard replacement
    if (~classArray(node).indexOf(config$1.replacementClass)) {
      return mutators.replace(mutation);
    }

    var forSvg = new RegExp(config$1.familyPrefix + '-.*');

    delete abstract[0].attributes.style;

    var splitClasses = abstract[0].attributes.class.split(' ').reduce(function (acc, cls) {
      if (cls === config$1.replacementClass || cls.match(forSvg)) {
        acc.toSvg.push(cls);
      } else {
        acc.toNode.push(cls);
      }

      return acc;
    }, { toNode: [], toSvg: [] });

    abstract[0].attributes.class = splitClasses.toSvg.join(' ');

    var newInnerHTML = abstract.map(function (a) {
      return toHtml(a);
    }).join('\n');
    node.setAttribute('class', splitClasses.toNode.join(' '));
    node.setAttribute(DATA_FA_I2SVG, '');
    node.innerHTML = newInnerHTML;
  }
};

function perform(mutations, callback) {
  var callbackFunction = typeof callback === 'function' ? callback : noop$1;

  if (mutations.length === 0) {
    callbackFunction();
  } else {
    var frame = WINDOW.requestAnimationFrame || function (op) {
      return op();
    };

    frame(function () {
      var mutator = getMutator();
      var mark = perf.begin('mutate');

      mutations.map(mutator);

      mark();

      callbackFunction();
    });
  }
}

var disabled = false;

function disableObservation(operation) {
  disabled = true;
  operation();
  disabled = false;
}

var mo = null;

function observe(options) {
  if (!MUTATION_OBSERVER) return;

  var treeCallback = options.treeCallback,
      nodeCallback = options.nodeCallback,
      pseudoElementsCallback = options.pseudoElementsCallback;


  mo = new MUTATION_OBSERVER(function (objects) {
    if (disabled) return;

    toArray(objects).forEach(function (mutationRecord) {
      if (mutationRecord.type === 'childList' && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
        if (config$1.searchPseudoElements) {
          pseudoElementsCallback(mutationRecord.target);
        }

        treeCallback(mutationRecord.target);
      }

      if (mutationRecord.type === 'attributes' && mutationRecord.target.parentNode && config$1.searchPseudoElements) {
        pseudoElementsCallback(mutationRecord.target.parentNode);
      }

      if (mutationRecord.type === 'attributes' && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
        if (mutationRecord.attributeName === 'class') {
          var _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target)),
              prefix = _getCanonicalIcon.prefix,
              iconName = _getCanonicalIcon.iconName;

          if (prefix) mutationRecord.target.setAttribute('data-prefix', prefix);
          if (iconName) mutationRecord.target.setAttribute('data-icon', iconName);
        } else {
          nodeCallback(mutationRecord.target);
        }
      }
    });
  });

  if (!IS_DOM) return;

  mo.observe(DOCUMENT.getElementsByTagName('body')[0], {
    childList: true, attributes: true, characterData: true, subtree: true
  });
}

function disconnect() {
  if (!mo) return;

  mo.disconnect();
}

var styleParser = function (node) {
  var style = node.getAttribute('style');

  var val = [];

  if (style) {
    val = style.split(';').reduce(function (acc, style) {
      var styles = style.split(':');
      var prop = styles[0];
      var value = styles.slice(1);

      if (prop && value.length > 0) {
        acc[prop] = value.join(':').trim();
      }

      return acc;
    }, {});
  }

  return val;
};

function toHex(unicode) {
  var result = '';

  for (var i = 0; i < unicode.length; i++) {
    var hex = unicode.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }

  return result;
}

var classParser = function (node) {
  var existingPrefix = node.getAttribute('data-prefix');
  var existingIconName = node.getAttribute('data-icon');
  var innerText = node.innerText !== undefined ? node.innerText.trim() : '';

  var val = getCanonicalIcon(classArray(node));

  if (existingPrefix && existingIconName) {
    val.prefix = existingPrefix;
    val.iconName = existingIconName;
  }

  if (val.prefix && innerText.length > 1) {
    val.iconName = byLigature(val.prefix, node.innerText);
  } else if (val.prefix && innerText.length === 1) {
    val.iconName = byUnicode(val.prefix, toHex(node.innerText));
  }

  return val;
};

var parseTransformString = function parseTransformString(transformString) {
  var transform = {
    size: 16,
    x: 0,
    y: 0,
    flipX: false,
    flipY: false,
    rotate: 0
  };

  if (!transformString) {
    return transform;
  } else {
    return transformString.toLowerCase().split(' ').reduce(function (acc, n) {
      var parts = n.toLowerCase().split('-');
      var first = parts[0];
      var rest = parts.slice(1).join('-');

      if (first && rest === 'h') {
        acc.flipX = true;
        return acc;
      }

      if (first && rest === 'v') {
        acc.flipY = true;
        return acc;
      }

      rest = parseFloat(rest);

      if (isNaN(rest)) {
        return acc;
      }

      switch (first) {
        case 'grow':
          acc.size = acc.size + rest;
          break;
        case 'shrink':
          acc.size = acc.size - rest;
          break;
        case 'left':
          acc.x = acc.x - rest;
          break;
        case 'right':
          acc.x = acc.x + rest;
          break;
        case 'up':
          acc.y = acc.y - rest;
          break;
        case 'down':
          acc.y = acc.y + rest;
          break;
        case 'rotate':
          acc.rotate = acc.rotate + rest;
          break;
      }

      return acc;
    }, transform);
  }
};

var transformParser = function (node) {
  return parseTransformString(node.getAttribute('data-fa-transform'));
};

var symbolParser = function (node) {
  var symbol = node.getAttribute('data-fa-symbol');

  return symbol === null ? false : symbol === '' ? true : symbol;
};

var attributesParser = function (node) {
  var extraAttributes = toArray(node.attributes).reduce(function (acc, attr) {
    if (acc.name !== 'class' && acc.name !== 'style') {
      acc[attr.name] = attr.value;
    }
    return acc;
  }, {});

  var title = node.getAttribute('title');

  if (config$1.autoA11y) {
    if (title) {
      extraAttributes['aria-labelledby'] = config$1.replacementClass + '-title-' + nextUniqueId();
    } else {
      extraAttributes['aria-hidden'] = 'true';
    }
  }

  return extraAttributes;
};

var maskParser = function (node) {
  var mask = node.getAttribute('data-fa-mask');

  if (!mask) {
    return emptyCanonicalIcon();
  } else {
    return getCanonicalIcon(mask.split(' ').map(function (i) {
      return i.trim();
    }));
  }
};

function parseMeta(node) {
  var _classParser = classParser(node),
      iconName = _classParser.iconName,
      prefix = _classParser.prefix,
      extraClasses = _classParser.rest;

  var extraStyles = styleParser(node);
  var transform = transformParser(node);
  var symbol = symbolParser(node);
  var extraAttributes = attributesParser(node);
  var mask = maskParser(node);

  return {
    iconName: iconName,
    title: node.getAttribute('title'),
    prefix: prefix,
    transform: transform,
    symbol: symbol,
    mask: mask,
    extra: {
      classes: extraClasses,
      styles: extraStyles,
      attributes: extraAttributes
    }
  };
}

function MissingIcon(error) {
  this.name = 'MissingIcon';
  this.message = error || 'Icon unavailable';
  this.stack = new Error().stack;
}

MissingIcon.prototype = Object.create(Error.prototype);
MissingIcon.prototype.constructor = MissingIcon;

var FILL = { fill: 'currentColor' };
var ANIMATION_BASE = {
  attributeType: 'XML',
  repeatCount: 'indefinite',
  dur: '2s'
};
var RING = {
  tag: 'path',
  attributes: _extends({}, FILL, {
    d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
  })
};
var OPACITY_ANIMATE = _extends({}, ANIMATION_BASE, {
  attributeName: 'opacity'
});
var DOT = {
  tag: 'circle',
  attributes: _extends({}, FILL, {
    cx: '256',
    cy: '364',
    r: '28'
  }),
  children: [{ tag: 'animate', attributes: _extends({}, ANIMATION_BASE, { attributeName: 'r', values: '28;14;28;28;14;28;' }) }, { tag: 'animate', attributes: _extends({}, OPACITY_ANIMATE, { values: '1;0;1;1;0;1;' }) }]
};
var QUESTION = {
  tag: 'path',
  attributes: _extends({}, FILL, {
    opacity: '1',
    d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
  }),
  children: [{ tag: 'animate', attributes: _extends({}, OPACITY_ANIMATE, { values: '1;0;0;0;0;1;' }) }]
};
var EXCLAMATION = {
  tag: 'path',
  attributes: _extends({}, FILL, {
    opacity: '0',
    d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
  }),
  children: [{ tag: 'animate', attributes: _extends({}, OPACITY_ANIMATE, { values: '0;0;1;1;0;0;' }) }]
};

var missing = { tag: 'g', children: [RING, DOT, QUESTION, EXCLAMATION] };

var styles = namespace.styles;

var LAYERS_TEXT_CLASSNAME = 'fa-layers-text';
var FONT_FAMILY_PATTERN = /Font Awesome 5 (Solid|Regular|Light|Brands)/;
var STYLE_TO_PREFIX = {
  'Solid': 'fas',
  'Regular': 'far',
  'Light': 'fal',
  'Brands': 'fab'
};

function findIcon(iconName, prefix) {
  var val = {
    found: false,
    width: 512,
    height: 512,
    icon: missing
  };

  if (iconName && prefix && styles[prefix] && styles[prefix][iconName]) {
    var icon = styles[prefix][iconName];
    var width = icon[0];
    var height = icon[1];
    var vectorData = icon.slice(4);

    val = {
      found: true,
      width: width,
      height: height,
      icon: { tag: 'path', attributes: { fill: 'currentColor', d: vectorData[0] } }
    };
  } else if (iconName && prefix && !config$1.showMissingIcons) {
    throw new MissingIcon('Icon is missing for prefix ' + prefix + ' with icon name ' + iconName);
  }

  return val;
}

function generateSvgReplacementMutation(node, nodeMeta) {
  var iconName = nodeMeta.iconName,
      title = nodeMeta.title,
      prefix = nodeMeta.prefix,
      transform = nodeMeta.transform,
      symbol = nodeMeta.symbol,
      mask = nodeMeta.mask,
      extra = nodeMeta.extra;


  return [node, makeInlineSvgAbstract({
    icons: {
      main: findIcon(iconName, prefix),
      mask: findIcon(mask.iconName, mask.prefix)
    },
    prefix: prefix,
    iconName: iconName,
    transform: transform,
    symbol: symbol,
    mask: mask,
    title: title,
    extra: extra,
    watchable: true
  })];
}

function generateLayersText(node, nodeMeta) {
  var title = nodeMeta.title,
      transform = nodeMeta.transform,
      extra = nodeMeta.extra;


  var width = null;
  var height = null;

  if (IS_IE) {
    var computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
    var boundingClientRect = node.getBoundingClientRect();
    width = boundingClientRect.width / computedFontSize;
    height = boundingClientRect.height / computedFontSize;
  }

  if (config$1.autoA11y && !title) {
    extra.attributes['aria-hidden'] = 'true';
  }

  return [node, makeLayersTextAbstract({
    content: node.innerHTML,
    width: width,
    height: height,
    transform: transform,
    title: title,
    extra: extra,
    watchable: true
  })];
}

function generateMutation(node) {
  var nodeMeta = parseMeta(node);

  if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
    return generateLayersText(node, nodeMeta);
  } else {
    return generateSvgReplacementMutation(node, nodeMeta);
  }
}

function remove(node) {
  if (typeof node.remove === 'function') {
    node.remove();
  } else if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
}

function searchPseudoElements(root) {
  if (!IS_DOM) return;

  var end = perf.begin('searchPseudoElements');

  disableObservation(function () {
    toArray(root.querySelectorAll('*')).forEach(function (node) {
      [':before', ':after'].forEach(function (pos) {
        var styles = WINDOW.getComputedStyle(node, pos);
        var fontFamily = styles.getPropertyValue('font-family').match(FONT_FAMILY_PATTERN);
        var children = toArray(node.children);
        var pseudoElement = children.filter(function (c) {
          return c.getAttribute(DATA_FA_PSEUDO_ELEMENT) === pos;
        })[0];

        if (pseudoElement) {
          if (pseudoElement.nextSibling && pseudoElement.nextSibling.textContent.indexOf(DATA_FA_PSEUDO_ELEMENT) > -1) {
            remove(pseudoElement.nextSibling);
          }
          remove(pseudoElement);
          pseudoElement = null;
        }

        if (fontFamily && !pseudoElement) {
          var content = styles.getPropertyValue('content');
          var i = DOCUMENT.createElement('i');
          i.setAttribute('class', '' + STYLE_TO_PREFIX[fontFamily[1]]);
          i.setAttribute(DATA_FA_PSEUDO_ELEMENT, pos);
          i.innerText = content.length === 3 ? content.substr(1, 1) : content;
          if (pos === ':before') {
            node.insertBefore(i, node.firstChild);
          } else {
            node.appendChild(i);
          }
        }
      });
    });
  });

  end();
}

function onTree(root) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!IS_DOM) return;

  var htmlClassList = DOCUMENT.documentElement.classList;
  var hclAdd = function hclAdd(suffix) {
    return htmlClassList.add(HTML_CLASS_I2SVG_BASE_CLASS + '-' + suffix);
  };
  var hclRemove = function hclRemove(suffix) {
    return htmlClassList.remove(HTML_CLASS_I2SVG_BASE_CLASS + '-' + suffix);
  };
  var prefixes = Object.keys(styles);
  var prefixesDomQuery = ['.' + LAYERS_TEXT_CLASSNAME + ':not([' + DATA_FA_I2SVG + '])'].concat(prefixes.map(function (p) {
    return '.' + p + ':not([' + DATA_FA_I2SVG + '])';
  })).join(', ');

  if (prefixesDomQuery.length === 0) {
    return;
  }

  var candidates = toArray(root.querySelectorAll(prefixesDomQuery));

  if (candidates.length > 0) {
    hclAdd('pending');
    hclRemove('complete');
  } else {
    return;
  }

  var mark = perf.begin('onTree');

  var mutations = candidates.reduce(function (acc, node) {
    try {
      var mutation = generateMutation(node);

      if (mutation) {
        acc.push(mutation);
      }
    } catch (e) {
      if (!PRODUCTION) {
        if (e instanceof MissingIcon) {
          console.error(e);
        }
      }
    }

    return acc;
  }, []);

  mark();

  perform(mutations, function () {
    hclAdd('active');
    hclAdd('complete');
    hclRemove('pending');

    if (typeof callback === 'function') callback();
  });
}

function onNode(node) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  var mutation = generateMutation(node);

  if (mutation) {
    perform([mutation], callback);
  }
}

var baseStyles = "svg:not(:root).svg-inline--fa {\n  overflow: visible; }\n\n.svg-inline--fa {\n  display: inline-block;\n  font-size: inherit;\n  height: 1em;\n  overflow: visible;\n  vertical-align: -.125em; }\n  .svg-inline--fa.fa-lg {\n    vertical-align: -.225em; }\n  .svg-inline--fa.fa-w-1 {\n    width: 0.0625em; }\n  .svg-inline--fa.fa-w-2 {\n    width: 0.125em; }\n  .svg-inline--fa.fa-w-3 {\n    width: 0.1875em; }\n  .svg-inline--fa.fa-w-4 {\n    width: 0.25em; }\n  .svg-inline--fa.fa-w-5 {\n    width: 0.3125em; }\n  .svg-inline--fa.fa-w-6 {\n    width: 0.375em; }\n  .svg-inline--fa.fa-w-7 {\n    width: 0.4375em; }\n  .svg-inline--fa.fa-w-8 {\n    width: 0.5em; }\n  .svg-inline--fa.fa-w-9 {\n    width: 0.5625em; }\n  .svg-inline--fa.fa-w-10 {\n    width: 0.625em; }\n  .svg-inline--fa.fa-w-11 {\n    width: 0.6875em; }\n  .svg-inline--fa.fa-w-12 {\n    width: 0.75em; }\n  .svg-inline--fa.fa-w-13 {\n    width: 0.8125em; }\n  .svg-inline--fa.fa-w-14 {\n    width: 0.875em; }\n  .svg-inline--fa.fa-w-15 {\n    width: 0.9375em; }\n  .svg-inline--fa.fa-w-16 {\n    width: 1em; }\n  .svg-inline--fa.fa-w-17 {\n    width: 1.0625em; }\n  .svg-inline--fa.fa-w-18 {\n    width: 1.125em; }\n  .svg-inline--fa.fa-w-19 {\n    width: 1.1875em; }\n  .svg-inline--fa.fa-w-20 {\n    width: 1.25em; }\n  .svg-inline--fa.fa-pull-left {\n    margin-right: .3em;\n    width: auto; }\n  .svg-inline--fa.fa-pull-right {\n    margin-left: .3em;\n    width: auto; }\n  .svg-inline--fa.fa-border {\n    height: 1.5em; }\n  .svg-inline--fa.fa-li {\n    width: 2em; }\n  .svg-inline--fa.fa-fw {\n    width: 1.25em; }\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0; }\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -.125em;\n  width: 1em; }\n  .fa-layers svg.svg-inline--fa {\n    -webkit-transform-origin: center center;\n            transform-origin: center center; }\n\n.fa-layers-text, .fa-layers-counter {\n  display: inline-block;\n  position: absolute;\n  text-align: center; }\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center; }\n\n.fa-layers-counter {\n  background-color: #ff253a;\n  border-radius: 1em;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: #fff;\n  height: 1.5em;\n  line-height: 1;\n  max-width: 5em;\n  min-width: 1.5em;\n  overflow: hidden;\n  padding: .25em;\n  right: 0;\n  text-overflow: ellipsis;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right; }\n\n.fa-layers-bottom-right {\n  bottom: 0;\n  right: 0;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right; }\n\n.fa-layers-bottom-left {\n  bottom: 0;\n  left: 0;\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left; }\n\n.fa-layers-top-right {\n  right: 0;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right; }\n\n.fa-layers-top-left {\n  left: 0;\n  right: auto;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top left;\n          transform-origin: top left; }\n\n.fa-lg {\n  font-size: 1.33333em;\n  line-height: 0.75em;\n  vertical-align: -.0667em; }\n\n.fa-xs {\n  font-size: .75em; }\n\n.fa-sm {\n  font-size: .875em; }\n\n.fa-1x {\n  font-size: 1em; }\n\n.fa-2x {\n  font-size: 2em; }\n\n.fa-3x {\n  font-size: 3em; }\n\n.fa-4x {\n  font-size: 4em; }\n\n.fa-5x {\n  font-size: 5em; }\n\n.fa-6x {\n  font-size: 6em; }\n\n.fa-7x {\n  font-size: 7em; }\n\n.fa-8x {\n  font-size: 8em; }\n\n.fa-9x {\n  font-size: 9em; }\n\n.fa-10x {\n  font-size: 10em; }\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em; }\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: 2.5em;\n  padding-left: 0; }\n  .fa-ul > li {\n    position: relative; }\n\n.fa-li {\n  left: -2em;\n  position: absolute;\n  text-align: center;\n  width: 2em;\n  line-height: inherit; }\n\n.fa-border {\n  border: solid 0.08em #eee;\n  border-radius: .1em;\n  padding: .2em .25em .15em; }\n\n.fa-pull-left {\n  float: left; }\n\n.fa-pull-right {\n  float: right; }\n\n.fa.fa-pull-left,\n.fas.fa-pull-left,\n.far.fa-pull-left,\n.fal.fa-pull-left,\n.fab.fa-pull-left {\n  margin-right: .3em; }\n\n.fa.fa-pull-right,\n.fas.fa-pull-right,\n.far.fa-pull-right,\n.fal.fa-pull-right,\n.fab.fa-pull-right {\n  margin-left: .3em; }\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n          animation: fa-spin 2s infinite linear; }\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n          animation: fa-spin 1s infinite steps(8); }\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg); }\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg); }\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg); }\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1); }\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1); }\n\n.fa-flip-horizontal.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1); }\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical {\n  -webkit-filter: none;\n          filter: none; }\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  position: relative;\n  width: 2em; }\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0; }\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1em; }\n\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2em; }\n\n.fa-inverse {\n  color: #fff; }\n\n.sr-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px; }\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto; }\n";

var css = function () {
  var dfp = DEFAULT_FAMILY_PREFIX;
  var drc = DEFAULT_REPLACEMENT_CLASS;
  var fp = config$1.familyPrefix;
  var rc = config$1.replacementClass;
  var s = baseStyles;

  if (fp !== dfp || rc !== drc) {
    var dPatt = new RegExp('\\.' + dfp + '\\-', 'g');
    var rPatt = new RegExp('\\.' + drc, 'g');

    s = s.replace(dPatt, '.' + fp + '-').replace(rPatt, '.' + rc);
  }

  return s;
};

function define(prefix, icons) {
  var normalized = Object.keys(icons).reduce(function (acc, iconName) {
    var icon = icons[iconName];
    var expanded = !!icon.icon;

    if (expanded) {
      acc[icon.iconName] = icon.icon;
    } else {
      acc[iconName] = icon;
    }
    return acc;
  }, {});

  if (typeof namespace.hooks.addPack === 'function') {
    namespace.hooks.addPack(prefix, normalized);
  } else {
    namespace.styles[prefix] = _extends({}, namespace.styles[prefix] || {}, normalized);
  }

  /**
   * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
   * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
   * for `fas` so we'll easy the upgrade process for our users by automatically defining
   * this as well.
   */
  if (prefix === 'fas') {
    define('fa', icons);
  }
}

var Library = function () {
  function Library() {
    classCallCheck(this, Library);

    this.definitions = {};
  }

  createClass(Library, [{
    key: 'add',
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, definitions = Array(_len), _key = 0; _key < _len; _key++) {
        definitions[_key] = arguments[_key];
      }

      var additions = definitions.reduce(this._pullDefinitions, {});

      Object.keys(additions).forEach(function (key) {
        _this.definitions[key] = _extends({}, _this.definitions[key] || {}, additions[key]);
        define(key, additions[key]);
      });
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.definitions = {};
    }
  }, {
    key: '_pullDefinitions',
    value: function _pullDefinitions(additions, definition) {
      var normalized = definition.prefix && definition.iconName && definition.icon ? { 0: definition } : definition;

      Object.keys(normalized).map(function (key) {
        var _normalized$key = normalized[key],
            prefix = _normalized$key.prefix,
            iconName = _normalized$key.iconName,
            icon = _normalized$key.icon;


        if (!additions[prefix]) additions[prefix] = {};

        additions[prefix][iconName] = icon;
      });

      return additions;
    }
  }]);
  return Library;
}();

function prepIcon(icon) {
  var width = icon[0];
  var height = icon[1];
  var vectorData = icon.slice(4);

  return {
    found: true,
    width: width,
    height: height,
    icon: { tag: 'path', attributes: { fill: 'currentColor', d: vectorData[0] } }
  };
}

var _cssInserted = false;

function ensureCss() {
  if (!config$1.autoAddCss) {
    return;
  }

  if (!_cssInserted) {
    insertCss(css());
  }

  _cssInserted = true;
}

function apiObject(val, abstractCreator) {
  Object.defineProperty(val, 'abstract', {
    get: abstractCreator
  });

  Object.defineProperty(val, 'html', {
    get: function get() {
      return val.abstract.map(function (a) {
        return toHtml(a);
      });
    }
  });

  Object.defineProperty(val, 'node', {
    get: function get() {
      if (!IS_DOM) return;

      var container = DOCUMENT.createElement('div');
      container.innerHTML = val.html;
      return container.children;
    }
  });

  return val;
}

function findIconDefinition(params) {
  var _params$prefix = params.prefix,
      prefix = _params$prefix === undefined ? 'fa' : _params$prefix,
      iconName = params.iconName;


  if (!iconName) return;

  return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
}

function resolveIcons(next) {
  return function (maybeIconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});

    var mask = params.mask;


    if (mask) {
      mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
    }

    return next(iconDefinition, _extends({}, params, { mask: mask }));
  };
}

var library = new Library();

var noAuto = function noAuto() {
  auto(false);
  disconnect();
};

var dom = {
  i2svg: function i2svg() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (IS_DOM) {
      ensureCss();

      var _params$node = params.node,
          node = _params$node === undefined ? DOCUMENT : _params$node,
          _params$callback = params.callback,
          callback = _params$callback === undefined ? function () {} : _params$callback;


      if (config$1.searchPseudoElements) {
        searchPseudoElements(node);
      }

      onTree(node, callback);
    }
  },

  css: css,

  insertCss: function insertCss$$1() {
    insertCss(css());
  }
};

var parse = {
  transform: function transform(transformString) {
    return parseTransformString(transformString);
  }
};

var icon = resolveIcons(function (iconDefinition) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$transform = params.transform,
      transform = _params$transform === undefined ? meaninglessTransform : _params$transform,
      _params$symbol = params.symbol,
      symbol = _params$symbol === undefined ? false : _params$symbol,
      _params$mask = params.mask,
      mask = _params$mask === undefined ? null : _params$mask,
      _params$title = params.title,
      title = _params$title === undefined ? null : _params$title,
      _params$classes = params.classes,
      classes = _params$classes === undefined ? [] : _params$classes,
      _params$attributes = params.attributes,
      attributes = _params$attributes === undefined ? {} : _params$attributes,
      _params$styles = params.styles,
      styles = _params$styles === undefined ? {} : _params$styles;


  if (!iconDefinition) return;

  var prefix = iconDefinition.prefix,
      iconName = iconDefinition.iconName,
      icon = iconDefinition.icon;


  return apiObject(_extends({ type: 'icon' }, iconDefinition), function () {
    ensureCss();

    if (config$1.autoA11y) {
      if (title) {
        attributes['aria-labelledby'] = config$1.replacementClass + '-title-' + nextUniqueId();
      } else {
        attributes['aria-hidden'] = 'true';
      }
    }

    return makeInlineSvgAbstract({
      icons: {
        main: prepIcon(icon),
        mask: mask ? prepIcon(mask.icon) : { found: false, width: null, height: null, icon: {} }
      },
      prefix: prefix,
      iconName: iconName,
      transform: _extends({}, meaninglessTransform, transform),
      symbol: symbol,
      title: title,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: classes
      }
    });
  });
});

var text = function text(content) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$transform2 = params.transform,
      transform = _params$transform2 === undefined ? meaninglessTransform : _params$transform2,
      _params$title2 = params.title,
      title = _params$title2 === undefined ? null : _params$title2,
      _params$classes2 = params.classes,
      classes = _params$classes2 === undefined ? [] : _params$classes2,
      _params$attributes2 = params.attributes,
      attributes = _params$attributes2 === undefined ? {} : _params$attributes2,
      _params$styles2 = params.styles,
      styles = _params$styles2 === undefined ? {} : _params$styles2;


  return apiObject({ type: 'text', content: content }, function () {
    ensureCss();

    return makeLayersTextAbstract({
      content: content,
      transform: _extends({}, meaninglessTransform, transform),
      title: title,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: [config$1.familyPrefix + '-layers-text'].concat(toConsumableArray(classes))
      }
    });
  });
};

var layer = function layer(assembler) {
  return apiObject({ type: 'layer' }, function () {
    ensureCss();

    var children = [];

    assembler(function (args) {
      Array.isArray(args) ? args.map(function (a) {
        children = children.concat(a.abstract);
      }) : children = children.concat(args.abstract);
    });

    return [{
      tag: 'span',
      attributes: { class: config$1.familyPrefix + '-layers' },
      children: children
    }];
  });
};

var api$1 = {
  noAuto: noAuto,
  dom: dom,
  library: library,
  parse: parse,
  findIconDefinition: findIconDefinition,
  icon: icon,
  text: text,
  layer: layer
};

var autoReplace = function autoReplace() {
  if (IS_DOM && config$1.autoReplaceSvg) api$1.dom.i2svg({ node: DOCUMENT });
};

function bootstrap() {
  if (IS_BROWSER) {
    if (!WINDOW.FontAwesome) {
      WINDOW.FontAwesome = api$1;
    }

    domready(function () {
      if (Object.keys(namespace.styles).length > 0) {
        autoReplace();
      }

      if (config$1.observeMutations && typeof MutationObserver === 'function') {
        observe({
          treeCallback: onTree,
          nodeCallback: onNode,
          pseudoElementsCallback: searchPseudoElements
        });
      }
    });
  }

  namespace.hooks = _extends({}, namespace.hooks, {

    addPack: function addPack(prefix, icons) {
      namespace.styles[prefix] = _extends({}, namespace.styles[prefix] || {}, icons);

      build();
      autoReplace();
    },

    addShims: function addShims(shims) {
      var _namespace$shims;

      (_namespace$shims = namespace.shims).push.apply(_namespace$shims, toConsumableArray(shims));

      build();
      autoReplace();
    }
  });
}

Object.defineProperty(api$1, 'config', {
  get: function get() {
    return config$1;
  },

  set: function set(newConfig) {
    update(newConfig);
  }
});

if (IS_DOM) bunker(bootstrap);

var config = api$1.config;


/* harmony default export */ __webpack_exports__["a"] = (api$1);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! ./../../process/browser.js */ 29)))

/***/ }),
/* 48 */
/*!*************************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/@fortawesome/fontawesome-free-solid/faSearchPlus.js ***!
  \*************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'search-plus', icon: [512, 512, [], "f00e", "M304 192v32c0 6.6-5.4 12-12 12h-56v56c0 6.6-5.4 12-12 12h-32c-6.6 0-12-5.4-12-12v-56h-56c-6.6 0-12-5.4-12-12v-32c0-6.6 5.4-12 12-12h56v-56c0-6.6 5.4-12 12-12h32c6.6 0 12 5.4 12 12v56h56c6.6 0 12 5.4 12 12zm201 284.7L476.7 505c-9.4 9.4-24.6 9.4-33.9 0L343 405.3c-4.5-4.5-7-10.6-7-17V372c-35.3 27.6-79.7 44-128 44C93.1 416 0 322.9 0 208S93.1 0 208 0s208 93.1 208 208c0 48.3-16.4 92.7-44 128h16.3c6.4 0 12.5 2.5 17 7l99.7 99.7c9.3 9.4 9.3 24.6 0 34zM344 208c0-75.2-60.8-136-136-136S72 132.8 72 208s60.8 136 136 136 136-60.8 136-136z"] };

/***/ }),
/* 49 */
/*!*************************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/@fortawesome/fontawesome-free-solid/faInfoCircle.js ***!
  \*************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'info-circle', icon: [512, 512, [], "f05a", "M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"] };

/***/ }),
/* 50 */
/*!**************************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/@fortawesome/fontawesome-free-solid/faShareSquare.js ***!
  \**************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'share-square', icon: [576, 512, [], "f14d", "M568.482 177.448L424.479 313.433C409.3 327.768 384 317.14 384 295.985v-71.963c-144.575.97-205.566 35.113-164.775 171.353 4.483 14.973-12.846 26.567-25.006 17.33C155.252 383.105 120 326.488 120 269.339c0-143.937 117.599-172.5 264-173.312V24.012c0-21.174 25.317-31.768 40.479-17.448l144.003 135.988c10.02 9.463 10.028 25.425 0 34.896zM384 379.128V448H64V128h50.916a11.99 11.99 0 0 0 8.648-3.693c14.953-15.568 32.237-27.89 51.014-37.676C185.708 80.83 181.584 64 169.033 64H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48v-88.806c0-8.288-8.197-14.066-16.011-11.302a71.83 71.83 0 0 1-34.189 3.377c-7.27-1.046-13.8 4.514-13.8 11.859z"] };

/***/ }),
/* 51 */
/*!**************************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/@fortawesome/fontawesome-free-solid/faTimesCircle.js ***!
  \**************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'times-circle', icon: [512, 512, [], "f057", "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"] };

/***/ }),
/* 52 */
/*!************************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/@fortawesome/fontawesome-free-brands/faFacebook.js ***!
  \************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports) {

module.exports = { prefix: 'fab', iconName: 'facebook', icon: [448, 512, [], "f09a", "M448 56.7v398.5c0 13.7-11.1 24.7-24.7 24.7H309.1V306.5h58.2l8.7-67.6h-67v-43.2c0-19.6 5.4-32.9 33.5-32.9h35.8v-60.5c-6.2-.8-27.4-2.7-52.2-2.7-51.6 0-87 31.5-87 89.4v49.9h-58.4v67.6h58.4V480H24.7C11.1 480 0 468.9 0 455.3V56.7C0 43.1 11.1 32 24.7 32h398.5c13.7 0 24.8 11.1 24.8 24.7z"] };

/***/ }),
/* 53 */
/*!***********************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/@fortawesome/fontawesome-free-brands/faTwitter.js ***!
  \***********************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports) {

module.exports = { prefix: 'fab', iconName: 'twitter', icon: [512, 512, [], "f099", "M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"] };

/***/ }),
/* 54 */
/*!***********************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/@fortawesome/fontawesome-free-solid/faEnvelope.js ***!
  \***********************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'envelope', icon: [512, 512, [], "f0e0", "M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z"] };

/***/ }),
/* 55 */
/*!*******************************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/@fortawesome/fontawesome-free-solid/faCopy.js ***!
  \*******************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports) {

module.exports = { prefix: 'fas', iconName: 'copy', icon: [448, 512, [], "f0c5", "M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"] };

/***/ }),
/* 56 */
/*!**************************!*\
  !*** ./styles/main.scss ***!
  \**************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/cache-loader/dist/cjs.js!../../../node_modules/css-loader??ref--4-3!../../../node_modules/postcss-loader/lib??ref--4-4!../../../node_modules/resolve-url-loader??ref--4-5!../../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../../node_modules/import-glob!./main.scss */ 22);

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ 58)(content, options);

if(content.locals) module.exports = content.locals;

if(true) {
	module.hot.accept(/*! !../../../node_modules/cache-loader/dist/cjs.js!../../../node_modules/css-loader??ref--4-3!../../../node_modules/postcss-loader/lib??ref--4-4!../../../node_modules/resolve-url-loader??ref--4-5!../../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../../node_modules/import-glob!./main.scss */ 22, function() {
		var newContent = __webpack_require__(/*! !../../../node_modules/cache-loader/dist/cjs.js!../../../node_modules/css-loader??ref--4-3!../../../node_modules/postcss-loader/lib??ref--4-4!../../../node_modules/resolve-url-loader??ref--4-5!../../../node_modules/sass-loader/lib/loader.js??ref--4-6!../../../node_modules/import-glob!./main.scss */ 22);

		if(typeof newContent === 'string') newContent = [[module.i, newContent, '']];

		var locals = (function(a, b) {
			var key, idx = 0;

			for(key in a) {
				if(!b || a[key] !== b[key]) return false;
				idx++;
			}

			for(key in b) idx--;

			return idx === 0;
		}(content.locals, newContent.locals));

		if(!locals) throw new Error('Aborting CSS HMR due to changed css-modules locals.');

		update(newContent);
	});

	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 57 */
/*!************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/css-loader/lib/css-base.js ***!
  \************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 58 */
/*!***************************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/style-loader/lib/addStyles.js ***!
  \***************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target) {
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ 59);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 59 */
/*!**********************************************************************************************************************************************!*\
  !*** /Applications/MAMP/htdocs/roundhex/stone-roberts/stone-roberts/web/app/themes/stone-roberts-anew/node_modules/style-loader/lib/urls.js ***!
  \**********************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ })
/******/ ]);
//# sourceMappingURL=main.js.map