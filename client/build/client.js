var client = (function () {
	'use strict';

	function getAugmentedNamespace(n) {
	  if (n.__esModule) return n;
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
					var args = [null];
					args.push.apply(args, arguments);
					var Ctor = Function.bind.apply(f, args);
					return new Ctor();
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var src = {};

	const ports = {
	  '3002': `wss://${location.hostname}:3002/ws`,
	  '3001':  `ws://${location.hostname}:3001/ws`,
	  '5173':  `ws://${location.hostname}:3001/ws`
	};

	function initws() {
	  const url = ports[location.port];
	  const ws  = new WebSocket(url);
	  // Pending requests in a Map
	  ws.pendingRequests = new Map();
	  return ws 
	}
	var initWs = initws;

	function onmsgs$1(ws) {
	  const {pendingRequests}= ws;
	  ws.onmessage = message => {
	    const {data} = message;
	    const payload = JSON.parse(data);
	    const {id, result, error, broadcast} = payload;
	    try {
	      if (broadcast) {
	        const fnc = RPC._broadcast_[broadcast];
	        const any = RPC._broadcast_._any_;
	        let exany = true;
	        if (fnc) {
	          console.log(`${broadcast} RPC:`, payload);
	          if (fnc(payload)===false) {
	            exany = false;
	          }
	        }
	        if (exany) {
	          let executed = 0;
	          for (const f in any) {
	            if (any[f](payload)!==false) {
	              executed++;
	            }
	          }
	          executed && console.log('any RPC:', payload);
	        }
	      } else {
	        const { resolve, reject } = pendingRequests.get(id);
	        pendingRequests.delete(id);
	        error ? reject(error) : resolve(result);  
	      }
	    } catch (error) {
	      console.error(`Error parsing WebSocket message: ${error}`);
	    }
	  };  
	}
	var onmsgs_1 = onmsgs$1;

	// **Github:** https://github.com/teambition/jsonrpc-lite
	const hasOwnProperty = Object.prototype.hasOwnProperty;
	const isInteger = typeof Number.isSafeInteger === 'function'
	    ? Number.isSafeInteger // ECMAScript 2015
	    : function (num) {
	        return typeof num === 'number' && isFinite(num) && num === Math.floor(num) && Math.abs(num) <= 9007199254740991;
	    };
	class JsonRpc {
	    constructor() {
	        this.jsonrpc = '2.0';
	    }
	    serialize() {
	        return JSON.stringify(this);
	    }
	}
	JsonRpc.VERSION = '2.0';
	class RequestObject extends JsonRpc {
	    constructor(id, method, params) {
	        super();
	        this.id = id;
	        this.method = method;
	        if (params !== undefined) {
	            this.params = params;
	        }
	    }
	}
	class NotificationObject extends JsonRpc {
	    constructor(method, params) {
	        super();
	        this.method = method;
	        if (params !== undefined) {
	            this.params = params;
	        }
	    }
	}
	class SuccessObject extends JsonRpc {
	    constructor(id, result) {
	        super();
	        this.id = id;
	        this.result = result;
	    }
	}
	class ErrorObject extends JsonRpc {
	    // tslint:disable-next-line:no-shadowed-variable
	    constructor(id, error) {
	        super();
	        this.id = id;
	        this.error = error;
	        this.id = id;
	        this.error = error;
	    }
	}
	class JsonRpcParsed {
	    constructor(payload, type) {
	        this.payload = payload;
	        this.type = type;
	        this.payload = payload;
	        this.type = type;
	    }
	}
	/**
	 * JsonRpcError Class
	 *
	 * @param  {String} message
	 * @param  {Integer} code
	 * @return {String} name: optional
	 * @api public
	 */
	class JsonRpcError {
	    constructor(message, code, data) {
	        this.message = message;
	        this.code = isInteger(code) ? code : 0;
	        if (data != null) {
	            this.data = data;
	        }
	    }
	}
	JsonRpcError.invalidRequest = function (data) {
	    return new JsonRpcError('Invalid request', -32600, data);
	};
	JsonRpcError.methodNotFound = function (data) {
	    return new JsonRpcError('Method not found', -32601, data);
	};
	JsonRpcError.invalidParams = function (data) {
	    return new JsonRpcError('Invalid params', -32602, data);
	};
	JsonRpcError.internalError = function (data) {
	    return new JsonRpcError('Internal error', -32603, data);
	};
	JsonRpcError.parseError = function (data) {
	    return new JsonRpcError('Parse error', -32700, data);
	};
	/**
	 * Creates a JSON-RPC 2.0 request object
	 *
	 * @param  {String|Integer} id
	 * @param  {String} method
	 * @param  {Object|Array} [params]: optional
	 * @return {Object} JsonRpc object
	 * @api public
	 */
	function request(id, method, params) {
	    const object = new RequestObject(id, method, params);
	    validateMessage(object, true);
	    return object;
	}
	/**
	 * Creates a JSON-RPC 2.0 notification object
	 *
	 * @param  {String} method
	 * @param  {Object|Array} [params]: optional
	 * @return {Object} JsonRpc object
	 * @api public
	 */
	function notification(method, params) {
	    const object = new NotificationObject(method, params);
	    validateMessage(object, true);
	    return object;
	}
	/**
	 * Creates a JSON-RPC 2.0 success response object
	 *
	 * @param  {String|Integer} id
	 * @param  {Mixed} result
	 * @return {Object} JsonRpc object
	 * @api public
	 */
	function success(id, result) {
	    const object = new SuccessObject(id, result);
	    validateMessage(object, true);
	    return object;
	}
	/**
	 * Creates a JSON-RPC 2.0 error response object
	 *
	 * @param  {String|Integer} id
	 * @param  {Object} JsonRpcError error
	 * @return {Object} JsonRpc object
	 * @api public
	 */
	function error(id, err) {
	    const object = new ErrorObject(id, err);
	    validateMessage(object, true);
	    return object;
	}
	function parse(message) {
	    if (!isString(message)) {
	        return new JsonRpcParsed(JsonRpcError.invalidRequest(message), "invalid" /* invalid */);
	    }
	    let jsonrpcObj;
	    try {
	        jsonrpcObj = JSON.parse(message);
	    }
	    catch (err) {
	        return new JsonRpcParsed(JsonRpcError.parseError(message), "invalid" /* invalid */);
	    }
	    return parseJsonRpcObject(jsonrpcObj);
	}
	/**
	 * Takes a JSON-RPC 2.0 payload (Object) or batch (Object[]) and tries to parse it.
	 * If successful, determine what objects are inside (response, notification,
	 * success, error, or invalid), and return their types and properly formatted objects.
	 *
	 * @param  {Object|Array} jsonrpcObj
	 * @return {Object|Array} a single object or an array of `JsonRpcParsed` objects with `type` and `payload`:
	 *
	 *  {
	 *    type: <Enum, 'request'|'notification'|'success'|'error'|'invalid'>
	 *    payload: <JsonRpc|JsonRpcError>
	 *  }
	 *
	 * @api public
	 */
	function parseJsonRpcObject(jsonrpcObj) {
	    if (!Array.isArray(jsonrpcObj)) {
	        return parseObject(jsonrpcObj);
	    }
	    if (jsonrpcObj.length === 0) {
	        return new JsonRpcParsed(JsonRpcError.invalidRequest(jsonrpcObj), "invalid" /* invalid */);
	    }
	    const parsedObjectArray = [];
	    for (let i = 0, len = jsonrpcObj.length; i < len; i++) {
	        parsedObjectArray[i] = parseObject(jsonrpcObj[i]);
	    }
	    return parsedObjectArray;
	}
	/**
	 * Alias for `parse` method.
	 * Takes a JSON-RPC 2.0 payload (String) and tries to parse it into a JSON.
	 * @api public
	 */
	const parseJsonRpcString = parse;
	/**
	 * Takes a JSON-RPC 2.0 payload (Object) and tries to parse it into a JSON.
	 * If successful, determine what object is it (response, notification,
	 * success, error, or invalid), and return it's type and properly formatted object.
	 *
	 * @param  {Object} obj
	 * @return {Object} an `JsonRpcParsed` object with `type` and `payload`:
	 *
	 *  {
	 *    type: <Enum, 'request'|'notification'|'success'|'error'|'invalid'>
	 *    payload: <JsonRpc|JsonRpcError>
	 *  }
	 *
	 * @api public
	 */
	function parseObject(obj) {
	    let err = null;
	    let payload = null;
	    let payloadType = "invalid" /* invalid */;
	    if (obj == null || obj.jsonrpc !== JsonRpc.VERSION) {
	        err = JsonRpcError.invalidRequest(obj);
	        payloadType = "invalid" /* invalid */;
	    }
	    else if (!hasOwnProperty.call(obj, 'id')) {
	        const tmp = obj;
	        payload = new NotificationObject(tmp.method, tmp.params);
	        err = validateMessage(payload);
	        payloadType = "notification" /* notification */;
	    }
	    else if (hasOwnProperty.call(obj, 'method')) {
	        const tmp = obj;
	        payload = new RequestObject(tmp.id, tmp.method, tmp.params);
	        err = validateMessage(payload);
	        payloadType = "request" /* request */;
	    }
	    else if (hasOwnProperty.call(obj, 'result')) {
	        const tmp = obj;
	        payload = new SuccessObject(tmp.id, tmp.result);
	        err = validateMessage(payload);
	        payloadType = "success" /* success */;
	    }
	    else if (hasOwnProperty.call(obj, 'error')) {
	        const tmp = obj;
	        payloadType = "error" /* error */;
	        if (tmp.error == null) {
	            err = JsonRpcError.internalError(tmp);
	        }
	        else {
	            const errorObj = new JsonRpcError(tmp.error.message, tmp.error.code, tmp.error.data);
	            if (errorObj.message !== tmp.error.message || errorObj.code !== tmp.error.code) {
	                err = JsonRpcError.internalError(tmp);
	            }
	            else {
	                payload = new ErrorObject(tmp.id, errorObj);
	                err = validateMessage(payload);
	            }
	        }
	    }
	    if (err == null && payload != null) {
	        return new JsonRpcParsed(payload, payloadType);
	    }
	    return new JsonRpcParsed(err != null ? err : JsonRpcError.invalidRequest(obj), "invalid" /* invalid */);
	}
	// if error, return error, else return null
	function validateMessage(obj, throwIt) {
	    let err = null;
	    if (obj instanceof RequestObject) {
	        err = checkId(obj.id);
	        if (err == null) {
	            err = checkMethod(obj.method);
	        }
	        if (err == null) {
	            err = checkParams(obj.params);
	        }
	    }
	    else if (obj instanceof NotificationObject) {
	        err = checkMethod(obj.method);
	        if (err == null) {
	            err = checkParams(obj.params);
	        }
	    }
	    else if (obj instanceof SuccessObject) {
	        err = checkId(obj.id);
	        if (err == null) {
	            err = checkResult(obj.result);
	        }
	    }
	    else if (obj instanceof ErrorObject) {
	        err = checkId(obj.id, true);
	        if (err == null) {
	            err = checkError(obj.error);
	        }
	    }
	    if (throwIt && err != null) {
	        throw err;
	    }
	    return err;
	}
	function checkId(id, maybeNull) {
	    if (maybeNull && id === null) {
	        return null;
	    }
	    return isString(id) || isInteger(id)
	        ? null
	        : JsonRpcError.internalError('"id" must be provided, a string or an integer.');
	}
	function checkMethod(method) {
	    return isString(method) ? null : JsonRpcError.invalidRequest(method);
	}
	function checkResult(result) {
	    return result === undefined
	        ? JsonRpcError.internalError('Result must exist for success Response objects')
	        : null;
	}
	function checkParams(params) {
	    if (params === undefined) {
	        return null;
	    }
	    if (Array.isArray(params) || isObject(params)) {
	        // ensure params can be stringify
	        try {
	            JSON.stringify(params);
	            return null;
	        }
	        catch (err) {
	            return JsonRpcError.parseError(params);
	        }
	    }
	    return JsonRpcError.invalidParams(params);
	}
	function checkError(err) {
	    if (!(err instanceof JsonRpcError)) {
	        return JsonRpcError.internalError('Error must be an instance of JsonRpcError');
	    }
	    if (!isInteger(err.code)) {
	        return JsonRpcError.internalError('Invalid error code. It must be an integer.');
	    }
	    if (!isString(err.message)) {
	        return JsonRpcError.internalError('Message must exist or must be a string.');
	    }
	    return null;
	}
	function isString(obj) {
	    return obj !== '' && typeof obj === 'string';
	}
	function isObject(obj) {
	    return obj != null && typeof obj === 'object' && !Array.isArray(obj);
	}
	const jsonrpc = {
	    JsonRpc,
	    JsonRpcError,
	    request,
	    notification,
	    success,
	    error,
	    parse,
	    parseObject,
	    parseJsonRpcObject,
	    parseJsonRpcString,
	};

	var jsonrpc$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		ErrorObject: ErrorObject,
		JsonRpc: JsonRpc,
		JsonRpcError: JsonRpcError,
		JsonRpcParsed: JsonRpcParsed,
		NotificationObject: NotificationObject,
		RequestObject: RequestObject,
		SuccessObject: SuccessObject,
		default: jsonrpc,
		error: error,
		jsonrpc: jsonrpc,
		notification: notification,
		parse: parse,
		parseJsonRpcObject: parseJsonRpcObject,
		parseJsonRpcString: parseJsonRpcString,
		parseObject: parseObject,
		request: request,
		success: success
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(jsonrpc$1);

	async function log$1(aswait) {
	  console.log(JSON.stringify(await aswait, null,2));
	  return ''
	}
	var _log = log$1;

	const rpc = require$$0;
	const log = _log;

	// Helper function to generate unique request IDs
	let requestId = 1;
	function generateRequestId() {
	  return (requestId++) + ''
	}

	function onopen$1(ws) {
	  const {pendingRequests}= ws;
	  // Helper function to send a JSON-RPC request over the WebSocket
	  function sendRequest(method, params) {
	    let id = generateRequestId();
	    const arr = params.slice(-1);
	    const req = rpc.request(id, method, params);
	    if (/^(api|fetch$|peek$)/.test(method)) {
	      if (arr[0]==='-') {
	        params.pop();
	      } else {
	        req.broadcast = true; // broadcast call
	      }
	    }
	    ws.send(JSON.stringify(req));
	    return new Promise((resolve, reject) => {
	      // Store the request ID and resolve/reject functions in the pending requests Map
	      pendingRequests.set(id, { resolve, reject });
	    })
	  }
	  window.sendRequest = sendRequest;

	  // Example usage with async/await and Promise.all()
	  async function addAll() {
	    try {
	      const all = await Promise.all([
	        sendRequest('apidemo.add', [{ value: 1 }]),
	        sendRequest('apidemo.add', [{ value: 2 }]),
	        sendRequest('apidemo.add', [{ value: 3 }]),
	      ]);
	      console.log(`Got data: ${JSON.stringify(all)}`);
	      return all
	    } catch (error) {
	      console.error(`Error getting data:`, error);
	      return error
	    }
	  }

	  ws.onopen = async data => {
	    console.log('Websocket open...');
	    window.RPC.apitest.addAll = addAll;
	    for (const k1 in window.RPC) {
	      if (!/^_.+_$/.test(k1)) {
	        window.RPC[k1].log = log;
	      }
	    }
	  };
	}
	var onopen_1 = onopen$1;

	const init_ws = initWs;
	const onmsgs  = onmsgs_1;
	const onopen  = onopen_1;

	const ws = init_ws();
	onmsgs(ws);
	onopen(ws);

	return src;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlcyI6WyIuLi9zcmMvd3NvY2tldC9pbml0LXdzLmpzIiwiLi4vc3JjL3dzb2NrZXQvb25tc2dzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2pzb25ycGMtbGl0ZS9kaXN0L2VzbmV4dC9qc29ucnBjLmpzIiwiLi4vc3JjL3dzb2NrZXQvX2xvZy5qcyIsIi4uL3NyYy93c29ja2V0L29ub3Blbi5qcyIsIi4uL3NyYy93c29ja2V0L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBvcnRzID0ge1xuICAnMzAwMic6IGB3c3M6Ly8ke2xvY2F0aW9uLmhvc3RuYW1lfTozMDAyL3dzYCxcbiAgJzMwMDEnOiAgYHdzOi8vJHtsb2NhdGlvbi5ob3N0bmFtZX06MzAwMS93c2AsXG4gICc1MTczJzogIGB3czovLyR7bG9jYXRpb24uaG9zdG5hbWV9OjMwMDEvd3NgXG59XG5cbmZ1bmN0aW9uIGluaXR3cygpIHtcbiAgY29uc3QgdXJsID0gcG9ydHNbbG9jYXRpb24ucG9ydF1cbiAgY29uc3Qgd3MgID0gbmV3IFdlYlNvY2tldCh1cmwpXG4gIC8vIFBlbmRpbmcgcmVxdWVzdHMgaW4gYSBNYXBcbiAgd3MucGVuZGluZ1JlcXVlc3RzID0gbmV3IE1hcCgpXG4gIHJldHVybiB3cyBcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5pdHdzXG4iLCJmdW5jdGlvbiBvbm1zZ3Mod3MpIHtcbiAgY29uc3Qge3BlbmRpbmdSZXF1ZXN0c309IHdzXG4gIHdzLm9ubWVzc2FnZSA9IG1lc3NhZ2UgPT4ge1xuICAgIGNvbnN0IHtkYXRhfSA9IG1lc3NhZ2VcbiAgICBjb25zdCBwYXlsb2FkID0gSlNPTi5wYXJzZShkYXRhKVxuICAgIGNvbnN0IHtpZCwgcmVzdWx0LCBlcnJvciwgYnJvYWRjYXN0fSA9IHBheWxvYWRcbiAgICB0cnkge1xuICAgICAgaWYgKGJyb2FkY2FzdCkge1xuICAgICAgICBjb25zdCBmbmMgPSBSUEMuX2Jyb2FkY2FzdF9bYnJvYWRjYXN0XVxuICAgICAgICBjb25zdCBhbnkgPSBSUEMuX2Jyb2FkY2FzdF8uX2FueV9cbiAgICAgICAgbGV0IGV4YW55ID0gdHJ1ZVxuICAgICAgICBpZiAoZm5jKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7YnJvYWRjYXN0fSBSUEM6YCwgcGF5bG9hZClcbiAgICAgICAgICBpZiAoZm5jKHBheWxvYWQpPT09ZmFsc2UpIHtcbiAgICAgICAgICAgIGV4YW55ID0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4YW55KSB7XG4gICAgICAgICAgbGV0IGV4ZWN1dGVkID0gMFxuICAgICAgICAgIGZvciAoY29uc3QgZiBpbiBhbnkpIHtcbiAgICAgICAgICAgIGlmIChhbnlbZl0ocGF5bG9hZCkhPT1mYWxzZSkge1xuICAgICAgICAgICAgICBleGVjdXRlZCsrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGV4ZWN1dGVkICYmIGNvbnNvbGUubG9nKCdhbnkgUlBDOicsIHBheWxvYWQpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHsgcmVzb2x2ZSwgcmVqZWN0IH0gPSBwZW5kaW5nUmVxdWVzdHMuZ2V0KGlkKVxuICAgICAgICBwZW5kaW5nUmVxdWVzdHMuZGVsZXRlKGlkKVxuICAgICAgICBlcnJvciA/IHJlamVjdChlcnJvcikgOiByZXNvbHZlKHJlc3VsdCkgIFxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBwYXJzaW5nIFdlYlNvY2tldCBtZXNzYWdlOiAke2Vycm9yfWApXG4gICAgfVxuICB9ICBcbn1cbm1vZHVsZS5leHBvcnRzID0gb25tc2dzXG4iLCIvLyAqKkdpdGh1YjoqKiBodHRwczovL2dpdGh1Yi5jb20vdGVhbWJpdGlvbi9qc29ucnBjLWxpdGVcbi8vXG4vLyBodHRwOi8vd3d3Lmpzb25ycGMub3JnL3NwZWNpZmljYXRpb25cbi8vICoqTGljZW5zZToqKiBNSVRcbid1c2Ugc3RyaWN0JztcbmNvbnN0IGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmNvbnN0IGlzSW50ZWdlciA9IHR5cGVvZiBOdW1iZXIuaXNTYWZlSW50ZWdlciA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gTnVtYmVyLmlzU2FmZUludGVnZXIgLy8gRUNNQVNjcmlwdCAyMDE1XG4gICAgOiBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgbnVtID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShudW0pICYmIG51bSA9PT0gTWF0aC5mbG9vcihudW0pICYmIE1hdGguYWJzKG51bSkgPD0gOTAwNzE5OTI1NDc0MDk5MTtcbiAgICB9O1xuZXhwb3J0IGNsYXNzIEpzb25ScGMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmpzb25ycGMgPSAnMi4wJztcbiAgICB9XG4gICAgc2VyaWFsaXplKCkge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgfVxufVxuSnNvblJwYy5WRVJTSU9OID0gJzIuMCc7XG5leHBvcnQgY2xhc3MgUmVxdWVzdE9iamVjdCBleHRlbmRzIEpzb25ScGMge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBtZXRob2QsIHBhcmFtcykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICAgICAgICBpZiAocGFyYW1zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvbk9iamVjdCBleHRlbmRzIEpzb25ScGMge1xuICAgIGNvbnN0cnVjdG9yKG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICAgICAgICBpZiAocGFyYW1zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFN1Y2Nlc3NPYmplY3QgZXh0ZW5kcyBKc29uUnBjIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgcmVzdWx0KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5yZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEVycm9yT2JqZWN0IGV4dGVuZHMgSnNvblJwYyB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXNoYWRvd2VkLXZhcmlhYmxlXG4gICAgY29uc3RydWN0b3IoaWQsIGVycm9yKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSnNvblJwY1BhcnNlZCB7XG4gICAgY29uc3RydWN0b3IocGF5bG9hZCwgdHlwZSkge1xuICAgICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIH1cbn1cbi8qKlxuICogSnNvblJwY0Vycm9yIENsYXNzXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBtZXNzYWdlXG4gKiBAcGFyYW0gIHtJbnRlZ2VyfSBjb2RlXG4gKiBAcmV0dXJuIHtTdHJpbmd9IG5hbWU6IG9wdGlvbmFsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgSnNvblJwY0Vycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBjb2RlLCBkYXRhKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMuY29kZSA9IGlzSW50ZWdlcihjb2RlKSA/IGNvZGUgOiAwO1xuICAgICAgICBpZiAoZGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICB9XG4gICAgfVxufVxuSnNvblJwY0Vycm9yLmludmFsaWRSZXF1ZXN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IEpzb25ScGNFcnJvcignSW52YWxpZCByZXF1ZXN0JywgLTMyNjAwLCBkYXRhKTtcbn07XG5Kc29uUnBjRXJyb3IubWV0aG9kTm90Rm91bmQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgSnNvblJwY0Vycm9yKCdNZXRob2Qgbm90IGZvdW5kJywgLTMyNjAxLCBkYXRhKTtcbn07XG5Kc29uUnBjRXJyb3IuaW52YWxpZFBhcmFtcyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBKc29uUnBjRXJyb3IoJ0ludmFsaWQgcGFyYW1zJywgLTMyNjAyLCBkYXRhKTtcbn07XG5Kc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvciA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBKc29uUnBjRXJyb3IoJ0ludGVybmFsIGVycm9yJywgLTMyNjAzLCBkYXRhKTtcbn07XG5Kc29uUnBjRXJyb3IucGFyc2VFcnJvciA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBKc29uUnBjRXJyb3IoJ1BhcnNlIGVycm9yJywgLTMyNzAwLCBkYXRhKTtcbn07XG4vKipcbiAqIENyZWF0ZXMgYSBKU09OLVJQQyAyLjAgcmVxdWVzdCBvYmplY3RcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd8SW50ZWdlcn0gaWRcbiAqIEBwYXJhbSAge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0gIHtPYmplY3R8QXJyYXl9IFtwYXJhbXNdOiBvcHRpb25hbFxuICogQHJldHVybiB7T2JqZWN0fSBKc29uUnBjIG9iamVjdFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3QoaWQsIG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgY29uc3Qgb2JqZWN0ID0gbmV3IFJlcXVlc3RPYmplY3QoaWQsIG1ldGhvZCwgcGFyYW1zKTtcbiAgICB2YWxpZGF0ZU1lc3NhZ2Uob2JqZWN0LCB0cnVlKTtcbiAgICByZXR1cm4gb2JqZWN0O1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgSlNPTi1SUEMgMi4wIG5vdGlmaWNhdGlvbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtICB7T2JqZWN0fEFycmF5fSBbcGFyYW1zXTogb3B0aW9uYWxcbiAqIEByZXR1cm4ge09iamVjdH0gSnNvblJwYyBvYmplY3RcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3RpZmljYXRpb24obWV0aG9kLCBwYXJhbXMpIHtcbiAgICBjb25zdCBvYmplY3QgPSBuZXcgTm90aWZpY2F0aW9uT2JqZWN0KG1ldGhvZCwgcGFyYW1zKTtcbiAgICB2YWxpZGF0ZU1lc3NhZ2Uob2JqZWN0LCB0cnVlKTtcbiAgICByZXR1cm4gb2JqZWN0O1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgSlNPTi1SUEMgMi4wIHN1Y2Nlc3MgcmVzcG9uc2Ugb2JqZWN0XG4gKlxuICogQHBhcmFtICB7U3RyaW5nfEludGVnZXJ9IGlkXG4gKiBAcGFyYW0gIHtNaXhlZH0gcmVzdWx0XG4gKiBAcmV0dXJuIHtPYmplY3R9IEpzb25ScGMgb2JqZWN0XG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gc3VjY2VzcyhpZCwgcmVzdWx0KSB7XG4gICAgY29uc3Qgb2JqZWN0ID0gbmV3IFN1Y2Nlc3NPYmplY3QoaWQsIHJlc3VsdCk7XG4gICAgdmFsaWRhdGVNZXNzYWdlKG9iamVjdCwgdHJ1ZSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIEpTT04tUlBDIDIuMCBlcnJvciByZXNwb25zZSBvYmplY3RcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd8SW50ZWdlcn0gaWRcbiAqIEBwYXJhbSAge09iamVjdH0gSnNvblJwY0Vycm9yIGVycm9yXG4gKiBAcmV0dXJuIHtPYmplY3R9IEpzb25ScGMgb2JqZWN0XG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gZXJyb3IoaWQsIGVycikge1xuICAgIGNvbnN0IG9iamVjdCA9IG5ldyBFcnJvck9iamVjdChpZCwgZXJyKTtcbiAgICB2YWxpZGF0ZU1lc3NhZ2Uob2JqZWN0LCB0cnVlKTtcbiAgICByZXR1cm4gb2JqZWN0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKG1lc3NhZ2UpIHtcbiAgICBpZiAoIWlzU3RyaW5nKG1lc3NhZ2UpKSB7XG4gICAgICAgIHJldHVybiBuZXcgSnNvblJwY1BhcnNlZChKc29uUnBjRXJyb3IuaW52YWxpZFJlcXVlc3QobWVzc2FnZSksIFwiaW52YWxpZFwiIC8qIGludmFsaWQgKi8pO1xuICAgIH1cbiAgICBsZXQganNvbnJwY09iajtcbiAgICB0cnkge1xuICAgICAgICBqc29ucnBjT2JqID0gSlNPTi5wYXJzZShtZXNzYWdlKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gbmV3IEpzb25ScGNQYXJzZWQoSnNvblJwY0Vycm9yLnBhcnNlRXJyb3IobWVzc2FnZSksIFwiaW52YWxpZFwiIC8qIGludmFsaWQgKi8pO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VKc29uUnBjT2JqZWN0KGpzb25ycGNPYmopO1xufVxuLyoqXG4gKiBUYWtlcyBhIEpTT04tUlBDIDIuMCBwYXlsb2FkIChPYmplY3QpIG9yIGJhdGNoIChPYmplY3RbXSkgYW5kIHRyaWVzIHRvIHBhcnNlIGl0LlxuICogSWYgc3VjY2Vzc2Z1bCwgZGV0ZXJtaW5lIHdoYXQgb2JqZWN0cyBhcmUgaW5zaWRlIChyZXNwb25zZSwgbm90aWZpY2F0aW9uLFxuICogc3VjY2VzcywgZXJyb3IsIG9yIGludmFsaWQpLCBhbmQgcmV0dXJuIHRoZWlyIHR5cGVzIGFuZCBwcm9wZXJseSBmb3JtYXR0ZWQgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R8QXJyYXl9IGpzb25ycGNPYmpcbiAqIEByZXR1cm4ge09iamVjdHxBcnJheX0gYSBzaW5nbGUgb2JqZWN0IG9yIGFuIGFycmF5IG9mIGBKc29uUnBjUGFyc2VkYCBvYmplY3RzIHdpdGggYHR5cGVgIGFuZCBgcGF5bG9hZGA6XG4gKlxuICogIHtcbiAqICAgIHR5cGU6IDxFbnVtLCAncmVxdWVzdCd8J25vdGlmaWNhdGlvbid8J3N1Y2Nlc3MnfCdlcnJvcid8J2ludmFsaWQnPlxuICogICAgcGF5bG9hZDogPEpzb25ScGN8SnNvblJwY0Vycm9yPlxuICogIH1cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VKc29uUnBjT2JqZWN0KGpzb25ycGNPYmopIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoanNvbnJwY09iaikpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlT2JqZWN0KGpzb25ycGNPYmopO1xuICAgIH1cbiAgICBpZiAoanNvbnJwY09iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBKc29uUnBjUGFyc2VkKEpzb25ScGNFcnJvci5pbnZhbGlkUmVxdWVzdChqc29ucnBjT2JqKSwgXCJpbnZhbGlkXCIgLyogaW52YWxpZCAqLyk7XG4gICAgfVxuICAgIGNvbnN0IHBhcnNlZE9iamVjdEFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGpzb25ycGNPYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcGFyc2VkT2JqZWN0QXJyYXlbaV0gPSBwYXJzZU9iamVjdChqc29ucnBjT2JqW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZE9iamVjdEFycmF5O1xufVxuLyoqXG4gKiBBbGlhcyBmb3IgYHBhcnNlYCBtZXRob2QuXG4gKiBUYWtlcyBhIEpTT04tUlBDIDIuMCBwYXlsb2FkIChTdHJpbmcpIGFuZCB0cmllcyB0byBwYXJzZSBpdCBpbnRvIGEgSlNPTi5cbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBwYXJzZUpzb25ScGNTdHJpbmcgPSBwYXJzZTtcbi8qKlxuICogVGFrZXMgYSBKU09OLVJQQyAyLjAgcGF5bG9hZCAoT2JqZWN0KSBhbmQgdHJpZXMgdG8gcGFyc2UgaXQgaW50byBhIEpTT04uXG4gKiBJZiBzdWNjZXNzZnVsLCBkZXRlcm1pbmUgd2hhdCBvYmplY3QgaXMgaXQgKHJlc3BvbnNlLCBub3RpZmljYXRpb24sXG4gKiBzdWNjZXNzLCBlcnJvciwgb3IgaW52YWxpZCksIGFuZCByZXR1cm4gaXQncyB0eXBlIGFuZCBwcm9wZXJseSBmb3JtYXR0ZWQgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFuIGBKc29uUnBjUGFyc2VkYCBvYmplY3Qgd2l0aCBgdHlwZWAgYW5kIGBwYXlsb2FkYDpcbiAqXG4gKiAge1xuICogICAgdHlwZTogPEVudW0sICdyZXF1ZXN0J3wnbm90aWZpY2F0aW9uJ3wnc3VjY2Vzcyd8J2Vycm9yJ3wnaW52YWxpZCc+XG4gKiAgICBwYXlsb2FkOiA8SnNvblJwY3xKc29uUnBjRXJyb3I+XG4gKiAgfVxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU9iamVjdChvYmopIHtcbiAgICBsZXQgZXJyID0gbnVsbDtcbiAgICBsZXQgcGF5bG9hZCA9IG51bGw7XG4gICAgbGV0IHBheWxvYWRUeXBlID0gXCJpbnZhbGlkXCIgLyogaW52YWxpZCAqLztcbiAgICBpZiAob2JqID09IG51bGwgfHwgb2JqLmpzb25ycGMgIT09IEpzb25ScGMuVkVSU0lPTikge1xuICAgICAgICBlcnIgPSBKc29uUnBjRXJyb3IuaW52YWxpZFJlcXVlc3Qob2JqKTtcbiAgICAgICAgcGF5bG9hZFR5cGUgPSBcImludmFsaWRcIiAvKiBpbnZhbGlkICovO1xuICAgIH1cbiAgICBlbHNlIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChvYmosICdpZCcpKSB7XG4gICAgICAgIGNvbnN0IHRtcCA9IG9iajtcbiAgICAgICAgcGF5bG9hZCA9IG5ldyBOb3RpZmljYXRpb25PYmplY3QodG1wLm1ldGhvZCwgdG1wLnBhcmFtcyk7XG4gICAgICAgIGVyciA9IHZhbGlkYXRlTWVzc2FnZShwYXlsb2FkKTtcbiAgICAgICAgcGF5bG9hZFR5cGUgPSBcIm5vdGlmaWNhdGlvblwiIC8qIG5vdGlmaWNhdGlvbiAqLztcbiAgICB9XG4gICAgZWxzZSBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosICdtZXRob2QnKSkge1xuICAgICAgICBjb25zdCB0bXAgPSBvYmo7XG4gICAgICAgIHBheWxvYWQgPSBuZXcgUmVxdWVzdE9iamVjdCh0bXAuaWQsIHRtcC5tZXRob2QsIHRtcC5wYXJhbXMpO1xuICAgICAgICBlcnIgPSB2YWxpZGF0ZU1lc3NhZ2UocGF5bG9hZCk7XG4gICAgICAgIHBheWxvYWRUeXBlID0gXCJyZXF1ZXN0XCIgLyogcmVxdWVzdCAqLztcbiAgICB9XG4gICAgZWxzZSBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosICdyZXN1bHQnKSkge1xuICAgICAgICBjb25zdCB0bXAgPSBvYmo7XG4gICAgICAgIHBheWxvYWQgPSBuZXcgU3VjY2Vzc09iamVjdCh0bXAuaWQsIHRtcC5yZXN1bHQpO1xuICAgICAgICBlcnIgPSB2YWxpZGF0ZU1lc3NhZ2UocGF5bG9hZCk7XG4gICAgICAgIHBheWxvYWRUeXBlID0gXCJzdWNjZXNzXCIgLyogc3VjY2VzcyAqLztcbiAgICB9XG4gICAgZWxzZSBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosICdlcnJvcicpKSB7XG4gICAgICAgIGNvbnN0IHRtcCA9IG9iajtcbiAgICAgICAgcGF5bG9hZFR5cGUgPSBcImVycm9yXCIgLyogZXJyb3IgKi87XG4gICAgICAgIGlmICh0bXAuZXJyb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyID0gSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IodG1wKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yT2JqID0gbmV3IEpzb25ScGNFcnJvcih0bXAuZXJyb3IubWVzc2FnZSwgdG1wLmVycm9yLmNvZGUsIHRtcC5lcnJvci5kYXRhKTtcbiAgICAgICAgICAgIGlmIChlcnJvck9iai5tZXNzYWdlICE9PSB0bXAuZXJyb3IubWVzc2FnZSB8fCBlcnJvck9iai5jb2RlICE9PSB0bXAuZXJyb3IuY29kZSkge1xuICAgICAgICAgICAgICAgIGVyciA9IEpzb25ScGNFcnJvci5pbnRlcm5hbEVycm9yKHRtcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gbmV3IEVycm9yT2JqZWN0KHRtcC5pZCwgZXJyb3JPYmopO1xuICAgICAgICAgICAgICAgIGVyciA9IHZhbGlkYXRlTWVzc2FnZShwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZXJyID09IG51bGwgJiYgcGF5bG9hZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSnNvblJwY1BhcnNlZChwYXlsb2FkLCBwYXlsb2FkVHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSnNvblJwY1BhcnNlZChlcnIgIT0gbnVsbCA/IGVyciA6IEpzb25ScGNFcnJvci5pbnZhbGlkUmVxdWVzdChvYmopLCBcImludmFsaWRcIiAvKiBpbnZhbGlkICovKTtcbn1cbi8vIGlmIGVycm9yLCByZXR1cm4gZXJyb3IsIGVsc2UgcmV0dXJuIG51bGxcbmZ1bmN0aW9uIHZhbGlkYXRlTWVzc2FnZShvYmosIHRocm93SXQpIHtcbiAgICBsZXQgZXJyID0gbnVsbDtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgUmVxdWVzdE9iamVjdCkge1xuICAgICAgICBlcnIgPSBjaGVja0lkKG9iai5pZCk7XG4gICAgICAgIGlmIChlcnIgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyID0gY2hlY2tNZXRob2Qob2JqLm1ldGhvZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVyciA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcnIgPSBjaGVja1BhcmFtcyhvYmoucGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBOb3RpZmljYXRpb25PYmplY3QpIHtcbiAgICAgICAgZXJyID0gY2hlY2tNZXRob2Qob2JqLm1ldGhvZCk7XG4gICAgICAgIGlmIChlcnIgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyID0gY2hlY2tQYXJhbXMob2JqLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgU3VjY2Vzc09iamVjdCkge1xuICAgICAgICBlcnIgPSBjaGVja0lkKG9iai5pZCk7XG4gICAgICAgIGlmIChlcnIgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyID0gY2hlY2tSZXN1bHQob2JqLnJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgRXJyb3JPYmplY3QpIHtcbiAgICAgICAgZXJyID0gY2hlY2tJZChvYmouaWQsIHRydWUpO1xuICAgICAgICBpZiAoZXJyID09IG51bGwpIHtcbiAgICAgICAgICAgIGVyciA9IGNoZWNrRXJyb3Iob2JqLmVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhyb3dJdCAmJiBlcnIgIT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICAgIHJldHVybiBlcnI7XG59XG5mdW5jdGlvbiBjaGVja0lkKGlkLCBtYXliZU51bGwpIHtcbiAgICBpZiAobWF5YmVOdWxsICYmIGlkID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gaXNTdHJpbmcoaWQpIHx8IGlzSW50ZWdlcihpZClcbiAgICAgICAgPyBudWxsXG4gICAgICAgIDogSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IoJ1wiaWRcIiBtdXN0IGJlIHByb3ZpZGVkLCBhIHN0cmluZyBvciBhbiBpbnRlZ2VyLicpO1xufVxuZnVuY3Rpb24gY2hlY2tNZXRob2QobWV0aG9kKSB7XG4gICAgcmV0dXJuIGlzU3RyaW5nKG1ldGhvZCkgPyBudWxsIDogSnNvblJwY0Vycm9yLmludmFsaWRSZXF1ZXN0KG1ldGhvZCk7XG59XG5mdW5jdGlvbiBjaGVja1Jlc3VsdChyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWRcbiAgICAgICAgPyBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcignUmVzdWx0IG11c3QgZXhpc3QgZm9yIHN1Y2Nlc3MgUmVzcG9uc2Ugb2JqZWN0cycpXG4gICAgICAgIDogbnVsbDtcbn1cbmZ1bmN0aW9uIGNoZWNrUGFyYW1zKHBhcmFtcykge1xuICAgIGlmIChwYXJhbXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zKSB8fCBpc09iamVjdChwYXJhbXMpKSB7XG4gICAgICAgIC8vIGVuc3VyZSBwYXJhbXMgY2FuIGJlIHN0cmluZ2lmeVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkocGFyYW1zKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBKc29uUnBjRXJyb3IucGFyc2VFcnJvcihwYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBKc29uUnBjRXJyb3IuaW52YWxpZFBhcmFtcyhwYXJhbXMpO1xufVxuZnVuY3Rpb24gY2hlY2tFcnJvcihlcnIpIHtcbiAgICBpZiAoIShlcnIgaW5zdGFuY2VvZiBKc29uUnBjRXJyb3IpKSB7XG4gICAgICAgIHJldHVybiBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcignRXJyb3IgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBKc29uUnBjRXJyb3InKTtcbiAgICB9XG4gICAgaWYgKCFpc0ludGVnZXIoZXJyLmNvZGUpKSB7XG4gICAgICAgIHJldHVybiBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcignSW52YWxpZCBlcnJvciBjb2RlLiBJdCBtdXN0IGJlIGFuIGludGVnZXIuJyk7XG4gICAgfVxuICAgIGlmICghaXNTdHJpbmcoZXJyLm1lc3NhZ2UpKSB7XG4gICAgICAgIHJldHVybiBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcignTWVzc2FnZSBtdXN0IGV4aXN0IG9yIG11c3QgYmUgYSBzdHJpbmcuJyk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAhPT0gJycgJiYgdHlwZW9mIG9iaiA9PT0gJ3N0cmluZyc7XG59XG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkob2JqKTtcbn1cbmNvbnN0IGpzb25ycGMgPSB7XG4gICAgSnNvblJwYyxcbiAgICBKc29uUnBjRXJyb3IsXG4gICAgcmVxdWVzdCxcbiAgICBub3RpZmljYXRpb24sXG4gICAgc3VjY2VzcyxcbiAgICBlcnJvcixcbiAgICBwYXJzZSxcbiAgICBwYXJzZU9iamVjdCxcbiAgICBwYXJzZUpzb25ScGNPYmplY3QsXG4gICAgcGFyc2VKc29uUnBjU3RyaW5nLFxufTtcbmV4cG9ydCBkZWZhdWx0IGpzb25ycGM7XG5leHBvcnQgeyBqc29ucnBjIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1qc29ucnBjLmpzLm1hcCIsImFzeW5jIGZ1bmN0aW9uIGxvZyhhc3dhaXQpIHtcbiAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoYXdhaXQgYXN3YWl0LCBudWxsLDIpKVxuICByZXR1cm4gJydcbn1cbm1vZHVsZS5leHBvcnRzID0gbG9nIiwiY29uc3QgcnBjID0gcmVxdWlyZSgnanNvbnJwYy1saXRlJylcbmNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vX2xvZycgKVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgdW5pcXVlIHJlcXVlc3QgSURzXG5sZXQgcmVxdWVzdElkID0gMVxuZnVuY3Rpb24gZ2VuZXJhdGVSZXF1ZXN0SWQoKSB7XG4gIHJldHVybiAocmVxdWVzdElkKyspICsgJydcbn1cblxuZnVuY3Rpb24gb25vcGVuKHdzKSB7XG4gIGNvbnN0IHtwZW5kaW5nUmVxdWVzdHN9PSB3c1xuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gc2VuZCBhIEpTT04tUlBDIHJlcXVlc3Qgb3ZlciB0aGUgV2ViU29ja2V0XG4gIGZ1bmN0aW9uIHNlbmRSZXF1ZXN0KG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgbGV0IGlkID0gZ2VuZXJhdGVSZXF1ZXN0SWQoKVxuICAgIGNvbnN0IGFyciA9IHBhcmFtcy5zbGljZSgtMSlcbiAgICBjb25zdCByZXEgPSBycGMucmVxdWVzdChpZCwgbWV0aG9kLCBwYXJhbXMpXG4gICAgaWYgKC9eKGFwaXxmZXRjaCR8cGVlayQpLy50ZXN0KG1ldGhvZCkpIHtcbiAgICAgIGlmIChhcnJbMF09PT0nLScpIHtcbiAgICAgICAgcGFyYW1zLnBvcCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXEuYnJvYWRjYXN0ID0gdHJ1ZSAvLyBicm9hZGNhc3QgY2FsbFxuICAgICAgfVxuICAgIH1cbiAgICB3cy5zZW5kKEpTT04uc3RyaW5naWZ5KHJlcSkpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIFN0b3JlIHRoZSByZXF1ZXN0IElEIGFuZCByZXNvbHZlL3JlamVjdCBmdW5jdGlvbnMgaW4gdGhlIHBlbmRpbmcgcmVxdWVzdHMgTWFwXG4gICAgICBwZW5kaW5nUmVxdWVzdHMuc2V0KGlkLCB7IHJlc29sdmUsIHJlamVjdCB9KVxuICAgIH0pXG4gIH1cbiAgd2luZG93LnNlbmRSZXF1ZXN0ID0gc2VuZFJlcXVlc3RcblxuICAvLyBFeGFtcGxlIHVzYWdlIHdpdGggYXN5bmMvYXdhaXQgYW5kIFByb21pc2UuYWxsKClcbiAgYXN5bmMgZnVuY3Rpb24gYWRkQWxsKCkge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBhbGwgPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHNlbmRSZXF1ZXN0KCdhcGlkZW1vLmFkZCcsIFt7IHZhbHVlOiAxIH1dKSxcbiAgICAgICAgc2VuZFJlcXVlc3QoJ2FwaWRlbW8uYWRkJywgW3sgdmFsdWU6IDIgfV0pLFxuICAgICAgICBzZW5kUmVxdWVzdCgnYXBpZGVtby5hZGQnLCBbeyB2YWx1ZTogMyB9XSksXG4gICAgICBdKVxuICAgICAgY29uc29sZS5sb2coYEdvdCBkYXRhOiAke0pTT04uc3RyaW5naWZ5KGFsbCl9YClcbiAgICAgIHJldHVybiBhbGxcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgZ2V0dGluZyBkYXRhOmAsIGVycm9yKVxuICAgICAgcmV0dXJuIGVycm9yXG4gICAgfVxuICB9XG5cbiAgd3Mub25vcGVuID0gYXN5bmMgZGF0YSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1dlYnNvY2tldCBvcGVuLi4uJylcbiAgICB3aW5kb3cuUlBDLmFwaXRlc3QuYWRkQWxsID0gYWRkQWxsXG4gICAgZm9yIChjb25zdCBrMSBpbiB3aW5kb3cuUlBDKSB7XG4gICAgICBpZiAoIS9eXy4rXyQvLnRlc3QoazEpKSB7XG4gICAgICAgIHdpbmRvdy5SUENbazFdLmxvZyA9IGxvZ1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBvbm9wZW5cbiIsImNvbnN0IGluaXRfd3MgPSByZXF1aXJlKCcuL2luaXQtd3MnKVxuY29uc3Qgb25tc2dzICA9IHJlcXVpcmUoJy4vb25tc2dzJylcbmNvbnN0IG9ub3BlbiAgPSByZXF1aXJlKCcuL29ub3BlbicpXG5cbmNvbnN0IHdzID0gaW5pdF93cygpXG5vbm1zZ3Mod3MpXG5vbm9wZW4od3MpXG5cbm1vZHVsZS5leHBvcnRzID0gd3MiXSwibmFtZXMiOlsib25tc2dzIiwibG9nIiwicmVxdWlyZSQkMSIsIm9ub3BlbiIsInJlcXVpcmUkJDAiLCJyZXF1aXJlJCQyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FBQSxNQUFNLEtBQUssR0FBRztDQUNkLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0NBQzlDLEVBQUUsTUFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0NBQzlDLEVBQUUsTUFBTSxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDO0NBQzlDLEVBQUM7QUFDRDtDQUNBLFNBQVMsTUFBTSxHQUFHO0NBQ2xCLEVBQUUsTUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUM7Q0FDbEMsRUFBRSxNQUFNLEVBQUUsSUFBSSxJQUFJLFNBQVMsQ0FBQyxHQUFHLEVBQUM7Q0FDaEM7Q0FDQSxFQUFFLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSxHQUFHLEdBQUU7Q0FDaEMsRUFBRSxPQUFPLEVBQUU7Q0FDWCxDQUFDO0NBQ0QsSUFBQSxNQUFjLEdBQUc7O0NDYmpCLFNBQVNBLFFBQU0sQ0FBQyxFQUFFLEVBQUU7Q0FDcEIsRUFBRSxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsR0FBRTtDQUM3QixFQUFFLEVBQUUsQ0FBQyxT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
