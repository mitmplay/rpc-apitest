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
	  //# client code
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
	    if (/(^api\.|\.api_)/.test(method)) {
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
	  async function promiseAllClient() {
	    //# client code
	    try {
	      const all = await Promise.all([
	        sendRequest('apidemo.demo_add', [{ value: 1 }]),
	        sendRequest('apidemo.demo_add', [{ value: 2 }]),
	        sendRequest('apidemo.demo_add', [{ value: 3 }]),
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
	    window.RPC.apitest.promiseAllClient = promiseAllClient;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlcyI6WyIuLi9zcmMvd3NvY2tldC9pbml0LXdzLmpzIiwiLi4vc3JjL3dzb2NrZXQvb25tc2dzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2pzb25ycGMtbGl0ZS9kaXN0L2VzbmV4dC9qc29ucnBjLmpzIiwiLi4vc3JjL3dzb2NrZXQvX2xvZy5qcyIsIi4uL3NyYy93c29ja2V0L29ub3Blbi5qcyIsIi4uL3NyYy93c29ja2V0L2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHBvcnRzID0ge1xuICAnMzAwMic6IGB3c3M6Ly8ke2xvY2F0aW9uLmhvc3RuYW1lfTozMDAyL3dzYCxcbiAgJzMwMDEnOiAgYHdzOi8vJHtsb2NhdGlvbi5ob3N0bmFtZX06MzAwMS93c2AsXG4gICc1MTczJzogIGB3czovLyR7bG9jYXRpb24uaG9zdG5hbWV9OjMwMDEvd3NgXG59XG5cbmZ1bmN0aW9uIGluaXR3cygpIHtcbiAgY29uc3QgdXJsID0gcG9ydHNbbG9jYXRpb24ucG9ydF1cbiAgY29uc3Qgd3MgID0gbmV3IFdlYlNvY2tldCh1cmwpXG4gIC8vIFBlbmRpbmcgcmVxdWVzdHMgaW4gYSBNYXBcbiAgd3MucGVuZGluZ1JlcXVlc3RzID0gbmV3IE1hcCgpXG4gIHJldHVybiB3cyBcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5pdHdzXG4iLCJmdW5jdGlvbiBvbm1zZ3Mod3MpIHtcbiAgY29uc3Qge3BlbmRpbmdSZXF1ZXN0c309IHdzXG4gIHdzLm9ubWVzc2FnZSA9IG1lc3NhZ2UgPT4ge1xuICAgIGNvbnN0IHtkYXRhfSA9IG1lc3NhZ2VcbiAgICBjb25zdCBwYXlsb2FkID0gSlNPTi5wYXJzZShkYXRhKVxuICAgIGNvbnN0IHtpZCwgcmVzdWx0LCBlcnJvciwgYnJvYWRjYXN0fSA9IHBheWxvYWRcbiAgICB0cnkge1xuICAgICAgaWYgKGJyb2FkY2FzdCkge1xuICAgICAgICBjb25zdCBmbmMgPSBSUEMuX2Jyb2FkY2FzdF9bYnJvYWRjYXN0XVxuICAgICAgICBjb25zdCBhbnkgPSBSUEMuX2Jyb2FkY2FzdF8uX2FueV9cbiAgICAgICAgbGV0IGV4YW55ID0gdHJ1ZVxuICAgICAgICBpZiAoZm5jKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7YnJvYWRjYXN0fSBSUEM6YCwgcGF5bG9hZClcbiAgICAgICAgICBpZiAoZm5jKHBheWxvYWQpPT09ZmFsc2UpIHtcbiAgICAgICAgICAgIGV4YW55ID0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4YW55KSB7XG4gICAgICAgICAgbGV0IGV4ZWN1dGVkID0gMFxuICAgICAgICAgIGZvciAoY29uc3QgZiBpbiBhbnkpIHtcbiAgICAgICAgICAgIGlmIChhbnlbZl0ocGF5bG9hZCkhPT1mYWxzZSkge1xuICAgICAgICAgICAgICBleGVjdXRlZCsrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGV4ZWN1dGVkICYmIGNvbnNvbGUubG9nKCdhbnkgUlBDOicsIHBheWxvYWQpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHsgcmVzb2x2ZSwgcmVqZWN0IH0gPSBwZW5kaW5nUmVxdWVzdHMuZ2V0KGlkKVxuICAgICAgICBwZW5kaW5nUmVxdWVzdHMuZGVsZXRlKGlkKVxuICAgICAgICBlcnJvciA/IHJlamVjdChlcnJvcikgOiByZXNvbHZlKHJlc3VsdCkgIFxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBwYXJzaW5nIFdlYlNvY2tldCBtZXNzYWdlOiAke2Vycm9yfWApXG4gICAgfVxuICB9ICBcbn1cbm1vZHVsZS5leHBvcnRzID0gb25tc2dzXG4iLCIvLyAqKkdpdGh1YjoqKiBodHRwczovL2dpdGh1Yi5jb20vdGVhbWJpdGlvbi9qc29ucnBjLWxpdGVcbi8vXG4vLyBodHRwOi8vd3d3Lmpzb25ycGMub3JnL3NwZWNpZmljYXRpb25cbi8vICoqTGljZW5zZToqKiBNSVRcbid1c2Ugc3RyaWN0JztcbmNvbnN0IGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmNvbnN0IGlzSW50ZWdlciA9IHR5cGVvZiBOdW1iZXIuaXNTYWZlSW50ZWdlciA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gTnVtYmVyLmlzU2FmZUludGVnZXIgLy8gRUNNQVNjcmlwdCAyMDE1XG4gICAgOiBmdW5jdGlvbiAobnVtKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgbnVtID09PSAnbnVtYmVyJyAmJiBpc0Zpbml0ZShudW0pICYmIG51bSA9PT0gTWF0aC5mbG9vcihudW0pICYmIE1hdGguYWJzKG51bSkgPD0gOTAwNzE5OTI1NDc0MDk5MTtcbiAgICB9O1xuZXhwb3J0IGNsYXNzIEpzb25ScGMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmpzb25ycGMgPSAnMi4wJztcbiAgICB9XG4gICAgc2VyaWFsaXplKCkge1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcyk7XG4gICAgfVxufVxuSnNvblJwYy5WRVJTSU9OID0gJzIuMCc7XG5leHBvcnQgY2xhc3MgUmVxdWVzdE9iamVjdCBleHRlbmRzIEpzb25ScGMge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBtZXRob2QsIHBhcmFtcykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICAgICAgICBpZiAocGFyYW1zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvbk9iamVjdCBleHRlbmRzIEpzb25ScGMge1xuICAgIGNvbnN0cnVjdG9yKG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubWV0aG9kID0gbWV0aG9kO1xuICAgICAgICBpZiAocGFyYW1zICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xuICAgICAgICB9XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIFN1Y2Nlc3NPYmplY3QgZXh0ZW5kcyBKc29uUnBjIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgcmVzdWx0KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5yZXN1bHQgPSByZXN1bHQ7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEVycm9yT2JqZWN0IGV4dGVuZHMgSnNvblJwYyB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXNoYWRvd2VkLXZhcmlhYmxlXG4gICAgY29uc3RydWN0b3IoaWQsIGVycm9yKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgSnNvblJwY1BhcnNlZCB7XG4gICAgY29uc3RydWN0b3IocGF5bG9hZCwgdHlwZSkge1xuICAgICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLnBheWxvYWQgPSBwYXlsb2FkO1xuICAgICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIH1cbn1cbi8qKlxuICogSnNvblJwY0Vycm9yIENsYXNzXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBtZXNzYWdlXG4gKiBAcGFyYW0gIHtJbnRlZ2VyfSBjb2RlXG4gKiBAcmV0dXJuIHtTdHJpbmd9IG5hbWU6IG9wdGlvbmFsXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgY2xhc3MgSnNvblJwY0Vycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBjb2RlLCBkYXRhKSB7XG4gICAgICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgICAgIHRoaXMuY29kZSA9IGlzSW50ZWdlcihjb2RlKSA/IGNvZGUgOiAwO1xuICAgICAgICBpZiAoZGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgICAgICB9XG4gICAgfVxufVxuSnNvblJwY0Vycm9yLmludmFsaWRSZXF1ZXN0ID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IEpzb25ScGNFcnJvcignSW52YWxpZCByZXF1ZXN0JywgLTMyNjAwLCBkYXRhKTtcbn07XG5Kc29uUnBjRXJyb3IubWV0aG9kTm90Rm91bmQgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgSnNvblJwY0Vycm9yKCdNZXRob2Qgbm90IGZvdW5kJywgLTMyNjAxLCBkYXRhKTtcbn07XG5Kc29uUnBjRXJyb3IuaW52YWxpZFBhcmFtcyA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBKc29uUnBjRXJyb3IoJ0ludmFsaWQgcGFyYW1zJywgLTMyNjAyLCBkYXRhKTtcbn07XG5Kc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvciA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBKc29uUnBjRXJyb3IoJ0ludGVybmFsIGVycm9yJywgLTMyNjAzLCBkYXRhKTtcbn07XG5Kc29uUnBjRXJyb3IucGFyc2VFcnJvciA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBKc29uUnBjRXJyb3IoJ1BhcnNlIGVycm9yJywgLTMyNzAwLCBkYXRhKTtcbn07XG4vKipcbiAqIENyZWF0ZXMgYSBKU09OLVJQQyAyLjAgcmVxdWVzdCBvYmplY3RcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd8SW50ZWdlcn0gaWRcbiAqIEBwYXJhbSAge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0gIHtPYmplY3R8QXJyYXl9IFtwYXJhbXNdOiBvcHRpb25hbFxuICogQHJldHVybiB7T2JqZWN0fSBKc29uUnBjIG9iamVjdFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3QoaWQsIG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgY29uc3Qgb2JqZWN0ID0gbmV3IFJlcXVlc3RPYmplY3QoaWQsIG1ldGhvZCwgcGFyYW1zKTtcbiAgICB2YWxpZGF0ZU1lc3NhZ2Uob2JqZWN0LCB0cnVlKTtcbiAgICByZXR1cm4gb2JqZWN0O1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgSlNPTi1SUEMgMi4wIG5vdGlmaWNhdGlvbiBvYmplY3RcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtICB7T2JqZWN0fEFycmF5fSBbcGFyYW1zXTogb3B0aW9uYWxcbiAqIEByZXR1cm4ge09iamVjdH0gSnNvblJwYyBvYmplY3RcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3RpZmljYXRpb24obWV0aG9kLCBwYXJhbXMpIHtcbiAgICBjb25zdCBvYmplY3QgPSBuZXcgTm90aWZpY2F0aW9uT2JqZWN0KG1ldGhvZCwgcGFyYW1zKTtcbiAgICB2YWxpZGF0ZU1lc3NhZ2Uob2JqZWN0LCB0cnVlKTtcbiAgICByZXR1cm4gb2JqZWN0O1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgSlNPTi1SUEMgMi4wIHN1Y2Nlc3MgcmVzcG9uc2Ugb2JqZWN0XG4gKlxuICogQHBhcmFtICB7U3RyaW5nfEludGVnZXJ9IGlkXG4gKiBAcGFyYW0gIHtNaXhlZH0gcmVzdWx0XG4gKiBAcmV0dXJuIHtPYmplY3R9IEpzb25ScGMgb2JqZWN0XG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gc3VjY2VzcyhpZCwgcmVzdWx0KSB7XG4gICAgY29uc3Qgb2JqZWN0ID0gbmV3IFN1Y2Nlc3NPYmplY3QoaWQsIHJlc3VsdCk7XG4gICAgdmFsaWRhdGVNZXNzYWdlKG9iamVjdCwgdHJ1ZSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIEpTT04tUlBDIDIuMCBlcnJvciByZXNwb25zZSBvYmplY3RcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd8SW50ZWdlcn0gaWRcbiAqIEBwYXJhbSAge09iamVjdH0gSnNvblJwY0Vycm9yIGVycm9yXG4gKiBAcmV0dXJuIHtPYmplY3R9IEpzb25ScGMgb2JqZWN0XG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gZXJyb3IoaWQsIGVycikge1xuICAgIGNvbnN0IG9iamVjdCA9IG5ldyBFcnJvck9iamVjdChpZCwgZXJyKTtcbiAgICB2YWxpZGF0ZU1lc3NhZ2Uob2JqZWN0LCB0cnVlKTtcbiAgICByZXR1cm4gb2JqZWN0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKG1lc3NhZ2UpIHtcbiAgICBpZiAoIWlzU3RyaW5nKG1lc3NhZ2UpKSB7XG4gICAgICAgIHJldHVybiBuZXcgSnNvblJwY1BhcnNlZChKc29uUnBjRXJyb3IuaW52YWxpZFJlcXVlc3QobWVzc2FnZSksIFwiaW52YWxpZFwiIC8qIGludmFsaWQgKi8pO1xuICAgIH1cbiAgICBsZXQganNvbnJwY09iajtcbiAgICB0cnkge1xuICAgICAgICBqc29ucnBjT2JqID0gSlNPTi5wYXJzZShtZXNzYWdlKTtcbiAgICB9XG4gICAgY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gbmV3IEpzb25ScGNQYXJzZWQoSnNvblJwY0Vycm9yLnBhcnNlRXJyb3IobWVzc2FnZSksIFwiaW52YWxpZFwiIC8qIGludmFsaWQgKi8pO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VKc29uUnBjT2JqZWN0KGpzb25ycGNPYmopO1xufVxuLyoqXG4gKiBUYWtlcyBhIEpTT04tUlBDIDIuMCBwYXlsb2FkIChPYmplY3QpIG9yIGJhdGNoIChPYmplY3RbXSkgYW5kIHRyaWVzIHRvIHBhcnNlIGl0LlxuICogSWYgc3VjY2Vzc2Z1bCwgZGV0ZXJtaW5lIHdoYXQgb2JqZWN0cyBhcmUgaW5zaWRlIChyZXNwb25zZSwgbm90aWZpY2F0aW9uLFxuICogc3VjY2VzcywgZXJyb3IsIG9yIGludmFsaWQpLCBhbmQgcmV0dXJuIHRoZWlyIHR5cGVzIGFuZCBwcm9wZXJseSBmb3JtYXR0ZWQgb2JqZWN0cy5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R8QXJyYXl9IGpzb25ycGNPYmpcbiAqIEByZXR1cm4ge09iamVjdHxBcnJheX0gYSBzaW5nbGUgb2JqZWN0IG9yIGFuIGFycmF5IG9mIGBKc29uUnBjUGFyc2VkYCBvYmplY3RzIHdpdGggYHR5cGVgIGFuZCBgcGF5bG9hZGA6XG4gKlxuICogIHtcbiAqICAgIHR5cGU6IDxFbnVtLCAncmVxdWVzdCd8J25vdGlmaWNhdGlvbid8J3N1Y2Nlc3MnfCdlcnJvcid8J2ludmFsaWQnPlxuICogICAgcGF5bG9hZDogPEpzb25ScGN8SnNvblJwY0Vycm9yPlxuICogIH1cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VKc29uUnBjT2JqZWN0KGpzb25ycGNPYmopIHtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoanNvbnJwY09iaikpIHtcbiAgICAgICAgcmV0dXJuIHBhcnNlT2JqZWN0KGpzb25ycGNPYmopO1xuICAgIH1cbiAgICBpZiAoanNvbnJwY09iai5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIG5ldyBKc29uUnBjUGFyc2VkKEpzb25ScGNFcnJvci5pbnZhbGlkUmVxdWVzdChqc29ucnBjT2JqKSwgXCJpbnZhbGlkXCIgLyogaW52YWxpZCAqLyk7XG4gICAgfVxuICAgIGNvbnN0IHBhcnNlZE9iamVjdEFycmF5ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGpzb25ycGNPYmoubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcGFyc2VkT2JqZWN0QXJyYXlbaV0gPSBwYXJzZU9iamVjdChqc29ucnBjT2JqW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlZE9iamVjdEFycmF5O1xufVxuLyoqXG4gKiBBbGlhcyBmb3IgYHBhcnNlYCBtZXRob2QuXG4gKiBUYWtlcyBhIEpTT04tUlBDIDIuMCBwYXlsb2FkIChTdHJpbmcpIGFuZCB0cmllcyB0byBwYXJzZSBpdCBpbnRvIGEgSlNPTi5cbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBjb25zdCBwYXJzZUpzb25ScGNTdHJpbmcgPSBwYXJzZTtcbi8qKlxuICogVGFrZXMgYSBKU09OLVJQQyAyLjAgcGF5bG9hZCAoT2JqZWN0KSBhbmQgdHJpZXMgdG8gcGFyc2UgaXQgaW50byBhIEpTT04uXG4gKiBJZiBzdWNjZXNzZnVsLCBkZXRlcm1pbmUgd2hhdCBvYmplY3QgaXMgaXQgKHJlc3BvbnNlLCBub3RpZmljYXRpb24sXG4gKiBzdWNjZXNzLCBlcnJvciwgb3IgaW52YWxpZCksIGFuZCByZXR1cm4gaXQncyB0eXBlIGFuZCBwcm9wZXJseSBmb3JtYXR0ZWQgb2JqZWN0LlxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9IGFuIGBKc29uUnBjUGFyc2VkYCBvYmplY3Qgd2l0aCBgdHlwZWAgYW5kIGBwYXlsb2FkYDpcbiAqXG4gKiAge1xuICogICAgdHlwZTogPEVudW0sICdyZXF1ZXN0J3wnbm90aWZpY2F0aW9uJ3wnc3VjY2Vzcyd8J2Vycm9yJ3wnaW52YWxpZCc+XG4gKiAgICBwYXlsb2FkOiA8SnNvblJwY3xKc29uUnBjRXJyb3I+XG4gKiAgfVxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU9iamVjdChvYmopIHtcbiAgICBsZXQgZXJyID0gbnVsbDtcbiAgICBsZXQgcGF5bG9hZCA9IG51bGw7XG4gICAgbGV0IHBheWxvYWRUeXBlID0gXCJpbnZhbGlkXCIgLyogaW52YWxpZCAqLztcbiAgICBpZiAob2JqID09IG51bGwgfHwgb2JqLmpzb25ycGMgIT09IEpzb25ScGMuVkVSU0lPTikge1xuICAgICAgICBlcnIgPSBKc29uUnBjRXJyb3IuaW52YWxpZFJlcXVlc3Qob2JqKTtcbiAgICAgICAgcGF5bG9hZFR5cGUgPSBcImludmFsaWRcIiAvKiBpbnZhbGlkICovO1xuICAgIH1cbiAgICBlbHNlIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChvYmosICdpZCcpKSB7XG4gICAgICAgIGNvbnN0IHRtcCA9IG9iajtcbiAgICAgICAgcGF5bG9hZCA9IG5ldyBOb3RpZmljYXRpb25PYmplY3QodG1wLm1ldGhvZCwgdG1wLnBhcmFtcyk7XG4gICAgICAgIGVyciA9IHZhbGlkYXRlTWVzc2FnZShwYXlsb2FkKTtcbiAgICAgICAgcGF5bG9hZFR5cGUgPSBcIm5vdGlmaWNhdGlvblwiIC8qIG5vdGlmaWNhdGlvbiAqLztcbiAgICB9XG4gICAgZWxzZSBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosICdtZXRob2QnKSkge1xuICAgICAgICBjb25zdCB0bXAgPSBvYmo7XG4gICAgICAgIHBheWxvYWQgPSBuZXcgUmVxdWVzdE9iamVjdCh0bXAuaWQsIHRtcC5tZXRob2QsIHRtcC5wYXJhbXMpO1xuICAgICAgICBlcnIgPSB2YWxpZGF0ZU1lc3NhZ2UocGF5bG9hZCk7XG4gICAgICAgIHBheWxvYWRUeXBlID0gXCJyZXF1ZXN0XCIgLyogcmVxdWVzdCAqLztcbiAgICB9XG4gICAgZWxzZSBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosICdyZXN1bHQnKSkge1xuICAgICAgICBjb25zdCB0bXAgPSBvYmo7XG4gICAgICAgIHBheWxvYWQgPSBuZXcgU3VjY2Vzc09iamVjdCh0bXAuaWQsIHRtcC5yZXN1bHQpO1xuICAgICAgICBlcnIgPSB2YWxpZGF0ZU1lc3NhZ2UocGF5bG9hZCk7XG4gICAgICAgIHBheWxvYWRUeXBlID0gXCJzdWNjZXNzXCIgLyogc3VjY2VzcyAqLztcbiAgICB9XG4gICAgZWxzZSBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChvYmosICdlcnJvcicpKSB7XG4gICAgICAgIGNvbnN0IHRtcCA9IG9iajtcbiAgICAgICAgcGF5bG9hZFR5cGUgPSBcImVycm9yXCIgLyogZXJyb3IgKi87XG4gICAgICAgIGlmICh0bXAuZXJyb3IgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyID0gSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IodG1wKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yT2JqID0gbmV3IEpzb25ScGNFcnJvcih0bXAuZXJyb3IubWVzc2FnZSwgdG1wLmVycm9yLmNvZGUsIHRtcC5lcnJvci5kYXRhKTtcbiAgICAgICAgICAgIGlmIChlcnJvck9iai5tZXNzYWdlICE9PSB0bXAuZXJyb3IubWVzc2FnZSB8fCBlcnJvck9iai5jb2RlICE9PSB0bXAuZXJyb3IuY29kZSkge1xuICAgICAgICAgICAgICAgIGVyciA9IEpzb25ScGNFcnJvci5pbnRlcm5hbEVycm9yKHRtcCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXlsb2FkID0gbmV3IEVycm9yT2JqZWN0KHRtcC5pZCwgZXJyb3JPYmopO1xuICAgICAgICAgICAgICAgIGVyciA9IHZhbGlkYXRlTWVzc2FnZShwYXlsb2FkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZXJyID09IG51bGwgJiYgcGF5bG9hZCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiBuZXcgSnNvblJwY1BhcnNlZChwYXlsb2FkLCBwYXlsb2FkVHlwZSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgSnNvblJwY1BhcnNlZChlcnIgIT0gbnVsbCA/IGVyciA6IEpzb25ScGNFcnJvci5pbnZhbGlkUmVxdWVzdChvYmopLCBcImludmFsaWRcIiAvKiBpbnZhbGlkICovKTtcbn1cbi8vIGlmIGVycm9yLCByZXR1cm4gZXJyb3IsIGVsc2UgcmV0dXJuIG51bGxcbmZ1bmN0aW9uIHZhbGlkYXRlTWVzc2FnZShvYmosIHRocm93SXQpIHtcbiAgICBsZXQgZXJyID0gbnVsbDtcbiAgICBpZiAob2JqIGluc3RhbmNlb2YgUmVxdWVzdE9iamVjdCkge1xuICAgICAgICBlcnIgPSBjaGVja0lkKG9iai5pZCk7XG4gICAgICAgIGlmIChlcnIgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyID0gY2hlY2tNZXRob2Qob2JqLm1ldGhvZCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVyciA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcnIgPSBjaGVja1BhcmFtcyhvYmoucGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBOb3RpZmljYXRpb25PYmplY3QpIHtcbiAgICAgICAgZXJyID0gY2hlY2tNZXRob2Qob2JqLm1ldGhvZCk7XG4gICAgICAgIGlmIChlcnIgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyID0gY2hlY2tQYXJhbXMob2JqLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgU3VjY2Vzc09iamVjdCkge1xuICAgICAgICBlcnIgPSBjaGVja0lkKG9iai5pZCk7XG4gICAgICAgIGlmIChlcnIgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyID0gY2hlY2tSZXN1bHQob2JqLnJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgRXJyb3JPYmplY3QpIHtcbiAgICAgICAgZXJyID0gY2hlY2tJZChvYmouaWQsIHRydWUpO1xuICAgICAgICBpZiAoZXJyID09IG51bGwpIHtcbiAgICAgICAgICAgIGVyciA9IGNoZWNrRXJyb3Iob2JqLmVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAodGhyb3dJdCAmJiBlcnIgIT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuICAgIHJldHVybiBlcnI7XG59XG5mdW5jdGlvbiBjaGVja0lkKGlkLCBtYXliZU51bGwpIHtcbiAgICBpZiAobWF5YmVOdWxsICYmIGlkID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gaXNTdHJpbmcoaWQpIHx8IGlzSW50ZWdlcihpZClcbiAgICAgICAgPyBudWxsXG4gICAgICAgIDogSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IoJ1wiaWRcIiBtdXN0IGJlIHByb3ZpZGVkLCBhIHN0cmluZyBvciBhbiBpbnRlZ2VyLicpO1xufVxuZnVuY3Rpb24gY2hlY2tNZXRob2QobWV0aG9kKSB7XG4gICAgcmV0dXJuIGlzU3RyaW5nKG1ldGhvZCkgPyBudWxsIDogSnNvblJwY0Vycm9yLmludmFsaWRSZXF1ZXN0KG1ldGhvZCk7XG59XG5mdW5jdGlvbiBjaGVja1Jlc3VsdChyZXN1bHQpIHtcbiAgICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWRcbiAgICAgICAgPyBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcignUmVzdWx0IG11c3QgZXhpc3QgZm9yIHN1Y2Nlc3MgUmVzcG9uc2Ugb2JqZWN0cycpXG4gICAgICAgIDogbnVsbDtcbn1cbmZ1bmN0aW9uIGNoZWNrUGFyYW1zKHBhcmFtcykge1xuICAgIGlmIChwYXJhbXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkocGFyYW1zKSB8fCBpc09iamVjdChwYXJhbXMpKSB7XG4gICAgICAgIC8vIGVuc3VyZSBwYXJhbXMgY2FuIGJlIHN0cmluZ2lmeVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkocGFyYW1zKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHJldHVybiBKc29uUnBjRXJyb3IucGFyc2VFcnJvcihwYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBKc29uUnBjRXJyb3IuaW52YWxpZFBhcmFtcyhwYXJhbXMpO1xufVxuZnVuY3Rpb24gY2hlY2tFcnJvcihlcnIpIHtcbiAgICBpZiAoIShlcnIgaW5zdGFuY2VvZiBKc29uUnBjRXJyb3IpKSB7XG4gICAgICAgIHJldHVybiBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcignRXJyb3IgbXVzdCBiZSBhbiBpbnN0YW5jZSBvZiBKc29uUnBjRXJyb3InKTtcbiAgICB9XG4gICAgaWYgKCFpc0ludGVnZXIoZXJyLmNvZGUpKSB7XG4gICAgICAgIHJldHVybiBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcignSW52YWxpZCBlcnJvciBjb2RlLiBJdCBtdXN0IGJlIGFuIGludGVnZXIuJyk7XG4gICAgfVxuICAgIGlmICghaXNTdHJpbmcoZXJyLm1lc3NhZ2UpKSB7XG4gICAgICAgIHJldHVybiBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcignTWVzc2FnZSBtdXN0IGV4aXN0IG9yIG11c3QgYmUgYSBzdHJpbmcuJyk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAhPT0gJycgJiYgdHlwZW9mIG9iaiA9PT0gJ3N0cmluZyc7XG59XG5mdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gb2JqICE9IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkob2JqKTtcbn1cbmNvbnN0IGpzb25ycGMgPSB7XG4gICAgSnNvblJwYyxcbiAgICBKc29uUnBjRXJyb3IsXG4gICAgcmVxdWVzdCxcbiAgICBub3RpZmljYXRpb24sXG4gICAgc3VjY2VzcyxcbiAgICBlcnJvcixcbiAgICBwYXJzZSxcbiAgICBwYXJzZU9iamVjdCxcbiAgICBwYXJzZUpzb25ScGNPYmplY3QsXG4gICAgcGFyc2VKc29uUnBjU3RyaW5nLFxufTtcbmV4cG9ydCBkZWZhdWx0IGpzb25ycGM7XG5leHBvcnQgeyBqc29ucnBjIH07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1qc29ucnBjLmpzLm1hcCIsImFzeW5jIGZ1bmN0aW9uIGxvZyhhc3dhaXQpIHtcbiAgLy8jIGNsaWVudCBjb2RlXG4gIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGF3YWl0IGFzd2FpdCwgbnVsbCwyKSlcbiAgcmV0dXJuICcnXG59XG5tb2R1bGUuZXhwb3J0cyA9IGxvZyIsImNvbnN0IHJwYyA9IHJlcXVpcmUoJ2pzb25ycGMtbGl0ZScpXG5jb25zdCBsb2cgPSByZXF1aXJlKCcuL19sb2cnIClcblxuLy8gSGVscGVyIGZ1bmN0aW9uIHRvIGdlbmVyYXRlIHVuaXF1ZSByZXF1ZXN0IElEc1xubGV0IHJlcXVlc3RJZCA9IDFcbmZ1bmN0aW9uIGdlbmVyYXRlUmVxdWVzdElkKCkge1xuICByZXR1cm4gKHJlcXVlc3RJZCsrKSArICcnXG59XG5cbmZ1bmN0aW9uIG9ub3Blbih3cykge1xuICBjb25zdCB7cGVuZGluZ1JlcXVlc3RzfT0gd3NcbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIHNlbmQgYSBKU09OLVJQQyByZXF1ZXN0IG92ZXIgdGhlIFdlYlNvY2tldFxuICBmdW5jdGlvbiBzZW5kUmVxdWVzdChtZXRob2QsIHBhcmFtcykge1xuICAgIGxldCBpZCA9IGdlbmVyYXRlUmVxdWVzdElkKClcbiAgICBjb25zdCBhcnIgPSBwYXJhbXMuc2xpY2UoLTEpXG4gICAgY29uc3QgcmVxID0gcnBjLnJlcXVlc3QoaWQsIG1ldGhvZCwgcGFyYW1zKVxuICAgIGlmICgvKF5hcGlcXC58XFwuYXBpXykvLnRlc3QobWV0aG9kKSkge1xuICAgICAgaWYgKGFyclswXT09PSctJykge1xuICAgICAgICBwYXJhbXMucG9wKClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlcS5icm9hZGNhc3QgPSB0cnVlIC8vIGJyb2FkY2FzdCBjYWxsXG4gICAgICB9XG4gICAgfVxuICAgIHdzLnNlbmQoSlNPTi5zdHJpbmdpZnkocmVxKSlcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgLy8gU3RvcmUgdGhlIHJlcXVlc3QgSUQgYW5kIHJlc29sdmUvcmVqZWN0IGZ1bmN0aW9ucyBpbiB0aGUgcGVuZGluZyByZXF1ZXN0cyBNYXBcbiAgICAgIHBlbmRpbmdSZXF1ZXN0cy5zZXQoaWQsIHsgcmVzb2x2ZSwgcmVqZWN0IH0pXG4gICAgfSlcbiAgfVxuICB3aW5kb3cuc2VuZFJlcXVlc3QgPSBzZW5kUmVxdWVzdFxuXG4gIC8vIEV4YW1wbGUgdXNhZ2Ugd2l0aCBhc3luYy9hd2FpdCBhbmQgUHJvbWlzZS5hbGwoKVxuICBhc3luYyBmdW5jdGlvbiBwcm9taXNlQWxsQ2xpZW50KCkge1xuICAgIC8vIyBjbGllbnQgY29kZVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBhbGwgPSBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgICAgIHNlbmRSZXF1ZXN0KCdhcGlkZW1vLmRlbW9fYWRkJywgW3sgdmFsdWU6IDEgfV0pLFxuICAgICAgICBzZW5kUmVxdWVzdCgnYXBpZGVtby5kZW1vX2FkZCcsIFt7IHZhbHVlOiAyIH1dKSxcbiAgICAgICAgc2VuZFJlcXVlc3QoJ2FwaWRlbW8uZGVtb19hZGQnLCBbeyB2YWx1ZTogMyB9XSksXG4gICAgICBdKVxuICAgICAgY29uc29sZS5sb2coYEdvdCBkYXRhOiAke0pTT04uc3RyaW5naWZ5KGFsbCl9YClcbiAgICAgIHJldHVybiBhbGxcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgZ2V0dGluZyBkYXRhOmAsIGVycm9yKVxuICAgICAgcmV0dXJuIGVycm9yXG4gICAgfVxuICB9XG5cbiAgd3Mub25vcGVuID0gYXN5bmMgZGF0YSA9PiB7XG4gICAgY29uc29sZS5sb2coJ1dlYnNvY2tldCBvcGVuLi4uJylcbiAgICB3aW5kb3cuUlBDLmFwaXRlc3QucHJvbWlzZUFsbENsaWVudCA9IHByb21pc2VBbGxDbGllbnRcbiAgICBmb3IgKGNvbnN0IGsxIGluIHdpbmRvdy5SUEMpIHtcbiAgICAgIGlmICghL15fLitfJC8udGVzdChrMSkpIHtcbiAgICAgICAgd2luZG93LlJQQ1trMV0ubG9nID0gbG9nXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IG9ub3BlblxuIiwiY29uc3QgaW5pdF93cyA9IHJlcXVpcmUoJy4vaW5pdC13cycpXG5jb25zdCBvbm1zZ3MgID0gcmVxdWlyZSgnLi9vbm1zZ3MnKVxuY29uc3Qgb25vcGVuICA9IHJlcXVpcmUoJy4vb25vcGVuJylcblxuY29uc3Qgd3MgPSBpbml0X3dzKClcbm9ubXNncyh3cylcbm9ub3Blbih3cylcblxubW9kdWxlLmV4cG9ydHMgPSB3cyJdLCJuYW1lcyI6WyJvbm1zZ3MiLCJsb2ciLCJyZXF1aXJlJCQxIiwib25vcGVuIiwicmVxdWlyZSQkMCIsInJlcXVpcmUkJDIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQUFBLE1BQU0sS0FBSyxHQUFHO0NBQ2QsRUFBRSxNQUFNLEVBQUUsQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7Q0FDOUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7Q0FDOUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7Q0FDOUMsRUFBQztBQUNEO0NBQ0EsU0FBUyxNQUFNLEdBQUc7Q0FDbEIsRUFBRSxNQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksRUFBQztDQUNsQyxFQUFFLE1BQU0sRUFBRSxJQUFJLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBQztDQUNoQztDQUNBLEVBQUUsRUFBRSxDQUFDLGVBQWUsR0FBRyxJQUFJLEdBQUcsR0FBRTtDQUNoQyxFQUFFLE9BQU8sRUFBRTtDQUNYLENBQUM7Q0FDRCxJQUFBLE1BQWMsR0FBRzs7Q0NiakIsU0FBU0Es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
