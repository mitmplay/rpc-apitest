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
	  '4002': `wss://${location.hostname}:4002/ws`,
	  '4001':  `ws://${location.hostname}:4001/ws`,
	  '5173':  `ws://${location.hostname}:4001/ws`
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
	  ws.onmessage = async message => {
	    const {data} = message;
	    const payload = JSON.parse(data);
	    const {id, result, error, broadcast:method} = payload;
	    try {
	      if (method) {
	        const func = RPC._broadcast_[method.split(':')[0]];
	        const fany = RPC._broadcast_._any_;
	        let exfunc = true;
	        let run; 
	        if (func) {
	          console.log(`${method} RPC:`, payload);
	          run = func(payload, method);
	          if (run===false) {
	            exfunc= false;
	          }
	        }
	        if (exfunc) {
	          let t_executed = 0;
	          for (const f in fany) {
	            run = fany[f](payload, method);
	            if (run.then) {
	              run = await run;
	            }
	            if (run!==false) {
	              t_executed++;
	            }
	          }
	          if (t_executed) {
	            const {_obj_: {argv}} = RPC;
	            const json = {'RPC any-fn': method};
	            if (argv.verbose) {
	              json.result = result;
	            }
	            console.log(json);
	          }
	        }
	      }
	      const pending = pendingRequests.get(id);
	      if (pending) {
	        pendingRequests.delete(id);
	        const { resolve, reject } = pending;
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

	const rpc = require$$0;

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
	    setTimeout(()=>{
	      if (window.RPC._obj_.argv.devmode) {
	        if (!window.RPC.apitest) {
	          window.RPC.apitest = {};
	        }
	        window.RPC.apitest.promiseAllClient = promiseAllClient;
	        // for (const k1 in window.RPC) {
	        //   if (!/^_.+_$/.test(k1)) {
	        //     window.RPC[k1].log = log
	        //   }
	        // }  
	      }  
	    });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlcyI6WyIuLi9zcmMvd3NvY2tldC9pbml0LXdzLmpzIiwiLi4vc3JjL3dzb2NrZXQvb25tc2dzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2pzb25ycGMtbGl0ZS9kaXN0L2VzbmV4dC9qc29ucnBjLmpzIiwiLi4vc3JjL3dzb2NrZXQvb25vcGVuLmpzIiwiLi4vc3JjL3dzb2NrZXQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcG9ydHMgPSB7XG4gICc0MDAyJzogYHdzczovLyR7bG9jYXRpb24uaG9zdG5hbWV9OjQwMDIvd3NgLFxuICAnNDAwMSc6ICBgd3M6Ly8ke2xvY2F0aW9uLmhvc3RuYW1lfTo0MDAxL3dzYCxcbiAgJzUxNzMnOiAgYHdzOi8vJHtsb2NhdGlvbi5ob3N0bmFtZX06NDAwMS93c2Bcbn1cblxuZnVuY3Rpb24gaW5pdHdzKCkge1xuICBjb25zdCB1cmwgPSBwb3J0c1tsb2NhdGlvbi5wb3J0XVxuICBjb25zdCB3cyAgPSBuZXcgV2ViU29ja2V0KHVybClcbiAgLy8gUGVuZGluZyByZXF1ZXN0cyBpbiBhIE1hcFxuICB3cy5wZW5kaW5nUmVxdWVzdHMgPSBuZXcgTWFwKClcbiAgcmV0dXJuIHdzIFxufVxubW9kdWxlLmV4cG9ydHMgPSBpbml0d3NcbiIsImZ1bmN0aW9uIG9ubXNncyh3cykge1xuICBjb25zdCB7cGVuZGluZ1JlcXVlc3RzfT0gd3NcbiAgd3Mub25tZXNzYWdlID0gYXN5bmMgbWVzc2FnZSA9PiB7XG4gICAgY29uc3Qge2RhdGF9ID0gbWVzc2FnZVxuICAgIGNvbnN0IHBheWxvYWQgPSBKU09OLnBhcnNlKGRhdGEpXG4gICAgY29uc3Qge2lkLCByZXN1bHQsIGVycm9yLCBicm9hZGNhc3Q6bWV0aG9kfSA9IHBheWxvYWRcbiAgICB0cnkge1xuICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICBjb25zdCBmdW5jID0gUlBDLl9icm9hZGNhc3RfW21ldGhvZC5zcGxpdCgnOicpWzBdXVxuICAgICAgICBjb25zdCBmYW55ID0gUlBDLl9icm9hZGNhc3RfLl9hbnlfXG4gICAgICAgIGxldCBleGZ1bmMgPSB0cnVlXG4gICAgICAgIGxldCBydW4gXG4gICAgICAgIGlmIChmdW5jKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7bWV0aG9kfSBSUEM6YCwgcGF5bG9hZClcbiAgICAgICAgICBydW4gPSBmdW5jKHBheWxvYWQsIG1ldGhvZClcbiAgICAgICAgICBpZiAocnVuPT09ZmFsc2UpIHtcbiAgICAgICAgICAgIGV4ZnVuYz0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4ZnVuYykge1xuICAgICAgICAgIGxldCB0X2V4ZWN1dGVkID0gMFxuICAgICAgICAgIGZvciAoY29uc3QgZiBpbiBmYW55KSB7XG4gICAgICAgICAgICBydW4gPSBmYW55W2ZdKHBheWxvYWQsIG1ldGhvZClcbiAgICAgICAgICAgIGlmIChydW4udGhlbikge1xuICAgICAgICAgICAgICBydW4gPSBhd2FpdCBydW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChydW4hPT1mYWxzZSkge1xuICAgICAgICAgICAgICB0X2V4ZWN1dGVkKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRfZXhlY3V0ZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHtfb2JqXzoge2FyZ3Z9fSA9IFJQQ1xuICAgICAgICAgICAgY29uc3QganNvbiA9IHsnUlBDIGFueS1mbic6IG1ldGhvZH1cbiAgICAgICAgICAgIGlmIChhcmd2LnZlcmJvc2UpIHtcbiAgICAgICAgICAgICAganNvbi5yZXN1bHQgPSByZXN1bHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGpzb24pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBjb25zdCBwZW5kaW5nID0gcGVuZGluZ1JlcXVlc3RzLmdldChpZClcbiAgICAgIGlmIChwZW5kaW5nKSB7XG4gICAgICAgIHBlbmRpbmdSZXF1ZXN0cy5kZWxldGUoaWQpXG4gICAgICAgIGNvbnN0IHsgcmVzb2x2ZSwgcmVqZWN0IH0gPSBwZW5kaW5nXG4gICAgICAgIGVycm9yID8gcmVqZWN0KGVycm9yKSA6IHJlc29sdmUocmVzdWx0KSAgXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIHBhcnNpbmcgV2ViU29ja2V0IG1lc3NhZ2U6ICR7ZXJyb3J9YClcbiAgICB9XG4gIH0gIFxufVxubW9kdWxlLmV4cG9ydHMgPSBvbm1zZ3NcbiIsIi8vICoqR2l0aHViOioqIGh0dHBzOi8vZ2l0aHViLmNvbS90ZWFtYml0aW9uL2pzb25ycGMtbGl0ZVxuLy9cbi8vIGh0dHA6Ly93d3cuanNvbnJwYy5vcmcvc3BlY2lmaWNhdGlvblxuLy8gKipMaWNlbnNlOioqIE1JVFxuJ3VzZSBzdHJpY3QnO1xuY29uc3QgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuY29uc3QgaXNJbnRlZ2VyID0gdHlwZW9mIE51bWJlci5pc1NhZmVJbnRlZ2VyID09PSAnZnVuY3Rpb24nXG4gICAgPyBOdW1iZXIuaXNTYWZlSW50ZWdlciAvLyBFQ01BU2NyaXB0IDIwMTVcbiAgICA6IGZ1bmN0aW9uIChudW0pIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBudW0gPT09ICdudW1iZXInICYmIGlzRmluaXRlKG51bSkgJiYgbnVtID09PSBNYXRoLmZsb29yKG51bSkgJiYgTWF0aC5hYnMobnVtKSA8PSA5MDA3MTk5MjU0NzQwOTkxO1xuICAgIH07XG5leHBvcnQgY2xhc3MgSnNvblJwYyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuanNvbnJwYyA9ICcyLjAnO1xuICAgIH1cbiAgICBzZXJpYWxpemUoKSB7XG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcbiAgICB9XG59XG5Kc29uUnBjLlZFUlNJT04gPSAnMi4wJztcbmV4cG9ydCBjbGFzcyBSZXF1ZXN0T2JqZWN0IGV4dGVuZHMgSnNvblJwYyB7XG4gICAgY29uc3RydWN0b3IoaWQsIG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgICAgIGlmIChwYXJhbXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgY2xhc3MgTm90aWZpY2F0aW9uT2JqZWN0IGV4dGVuZHMgSnNvblJwYyB7XG4gICAgY29uc3RydWN0b3IobWV0aG9kLCBwYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5tZXRob2QgPSBtZXRob2Q7XG4gICAgICAgIGlmIChwYXJhbXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5wYXJhbXMgPSBwYXJhbXM7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnQgY2xhc3MgU3VjY2Vzc09iamVjdCBleHRlbmRzIEpzb25ScGMge1xuICAgIGNvbnN0cnVjdG9yKGlkLCByZXN1bHQpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLnJlc3VsdCA9IHJlc3VsdDtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgRXJyb3JPYmplY3QgZXh0ZW5kcyBKc29uUnBjIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tc2hhZG93ZWQtdmFyaWFibGVcbiAgICBjb25zdHJ1Y3RvcihpZCwgZXJyb3IpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBKc29uUnBjUGFyc2VkIHtcbiAgICBjb25zdHJ1Y3RvcihwYXlsb2FkLCB0eXBlKSB7XG4gICAgICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMucGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgfVxufVxuLyoqXG4gKiBKc29uUnBjRXJyb3IgQ2xhc3NcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd9IG1lc3NhZ2VcbiAqIEBwYXJhbSAge0ludGVnZXJ9IGNvZGVcbiAqIEByZXR1cm4ge1N0cmluZ30gbmFtZTogb3B0aW9uYWxcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBjbGFzcyBKc29uUnBjRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGNvZGUsIGRhdGEpIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICAgICAgdGhpcy5jb2RlID0gaXNJbnRlZ2VyKGNvZGUpID8gY29kZSA6IDA7XG4gICAgICAgIGlmIChkYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIH1cbiAgICB9XG59XG5Kc29uUnBjRXJyb3IuaW52YWxpZFJlcXVlc3QgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgSnNvblJwY0Vycm9yKCdJbnZhbGlkIHJlcXVlc3QnLCAtMzI2MDAsIGRhdGEpO1xufTtcbkpzb25ScGNFcnJvci5tZXRob2ROb3RGb3VuZCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBKc29uUnBjRXJyb3IoJ01ldGhvZCBub3QgZm91bmQnLCAtMzI2MDEsIGRhdGEpO1xufTtcbkpzb25ScGNFcnJvci5pbnZhbGlkUGFyYW1zID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IEpzb25ScGNFcnJvcignSW52YWxpZCBwYXJhbXMnLCAtMzI2MDIsIGRhdGEpO1xufTtcbkpzb25ScGNFcnJvci5pbnRlcm5hbEVycm9yID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IEpzb25ScGNFcnJvcignSW50ZXJuYWwgZXJyb3InLCAtMzI2MDMsIGRhdGEpO1xufTtcbkpzb25ScGNFcnJvci5wYXJzZUVycm9yID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IEpzb25ScGNFcnJvcignUGFyc2UgZXJyb3InLCAtMzI3MDAsIGRhdGEpO1xufTtcbi8qKlxuICogQ3JlYXRlcyBhIEpTT04tUlBDIDIuMCByZXF1ZXN0IG9iamVjdFxuICpcbiAqIEBwYXJhbSAge1N0cmluZ3xJbnRlZ2VyfSBpZFxuICogQHBhcmFtICB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSAge09iamVjdHxBcnJheX0gW3BhcmFtc106IG9wdGlvbmFsXG4gKiBAcmV0dXJuIHtPYmplY3R9IEpzb25ScGMgb2JqZWN0XG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdChpZCwgbWV0aG9kLCBwYXJhbXMpIHtcbiAgICBjb25zdCBvYmplY3QgPSBuZXcgUmVxdWVzdE9iamVjdChpZCwgbWV0aG9kLCBwYXJhbXMpO1xuICAgIHZhbGlkYXRlTWVzc2FnZShvYmplY3QsIHRydWUpO1xuICAgIHJldHVybiBvYmplY3Q7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBKU09OLVJQQyAyLjAgbm90aWZpY2F0aW9uIG9iamVjdFxuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gbWV0aG9kXG4gKiBAcGFyYW0gIHtPYmplY3R8QXJyYXl9IFtwYXJhbXNdOiBvcHRpb25hbFxuICogQHJldHVybiB7T2JqZWN0fSBKc29uUnBjIG9iamVjdFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vdGlmaWNhdGlvbihtZXRob2QsIHBhcmFtcykge1xuICAgIGNvbnN0IG9iamVjdCA9IG5ldyBOb3RpZmljYXRpb25PYmplY3QobWV0aG9kLCBwYXJhbXMpO1xuICAgIHZhbGlkYXRlTWVzc2FnZShvYmplY3QsIHRydWUpO1xuICAgIHJldHVybiBvYmplY3Q7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBKU09OLVJQQyAyLjAgc3VjY2VzcyByZXNwb25zZSBvYmplY3RcbiAqXG4gKiBAcGFyYW0gIHtTdHJpbmd8SW50ZWdlcn0gaWRcbiAqIEBwYXJhbSAge01peGVkfSByZXN1bHRcbiAqIEByZXR1cm4ge09iamVjdH0gSnNvblJwYyBvYmplY3RcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdWNjZXNzKGlkLCByZXN1bHQpIHtcbiAgICBjb25zdCBvYmplY3QgPSBuZXcgU3VjY2Vzc09iamVjdChpZCwgcmVzdWx0KTtcbiAgICB2YWxpZGF0ZU1lc3NhZ2Uob2JqZWN0LCB0cnVlKTtcbiAgICByZXR1cm4gb2JqZWN0O1xufVxuLyoqXG4gKiBDcmVhdGVzIGEgSlNPTi1SUEMgMi4wIGVycm9yIHJlc3BvbnNlIG9iamVjdFxuICpcbiAqIEBwYXJhbSAge1N0cmluZ3xJbnRlZ2VyfSBpZFxuICogQHBhcmFtICB7T2JqZWN0fSBKc29uUnBjRXJyb3IgZXJyb3JcbiAqIEByZXR1cm4ge09iamVjdH0gSnNvblJwYyBvYmplY3RcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlcnJvcihpZCwgZXJyKSB7XG4gICAgY29uc3Qgb2JqZWN0ID0gbmV3IEVycm9yT2JqZWN0KGlkLCBlcnIpO1xuICAgIHZhbGlkYXRlTWVzc2FnZShvYmplY3QsIHRydWUpO1xuICAgIHJldHVybiBvYmplY3Q7XG59XG5leHBvcnQgZnVuY3Rpb24gcGFyc2UobWVzc2FnZSkge1xuICAgIGlmICghaXNTdHJpbmcobWVzc2FnZSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBKc29uUnBjUGFyc2VkKEpzb25ScGNFcnJvci5pbnZhbGlkUmVxdWVzdChtZXNzYWdlKSwgXCJpbnZhbGlkXCIgLyogaW52YWxpZCAqLyk7XG4gICAgfVxuICAgIGxldCBqc29ucnBjT2JqO1xuICAgIHRyeSB7XG4gICAgICAgIGpzb25ycGNPYmogPSBKU09OLnBhcnNlKG1lc3NhZ2UpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJldHVybiBuZXcgSnNvblJwY1BhcnNlZChKc29uUnBjRXJyb3IucGFyc2VFcnJvcihtZXNzYWdlKSwgXCJpbnZhbGlkXCIgLyogaW52YWxpZCAqLyk7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUpzb25ScGNPYmplY3QoanNvbnJwY09iaik7XG59XG4vKipcbiAqIFRha2VzIGEgSlNPTi1SUEMgMi4wIHBheWxvYWQgKE9iamVjdCkgb3IgYmF0Y2ggKE9iamVjdFtdKSBhbmQgdHJpZXMgdG8gcGFyc2UgaXQuXG4gKiBJZiBzdWNjZXNzZnVsLCBkZXRlcm1pbmUgd2hhdCBvYmplY3RzIGFyZSBpbnNpZGUgKHJlc3BvbnNlLCBub3RpZmljYXRpb24sXG4gKiBzdWNjZXNzLCBlcnJvciwgb3IgaW52YWxpZCksIGFuZCByZXR1cm4gdGhlaXIgdHlwZXMgYW5kIHByb3Blcmx5IGZvcm1hdHRlZCBvYmplY3RzLlxuICpcbiAqIEBwYXJhbSAge09iamVjdHxBcnJheX0ganNvbnJwY09ialxuICogQHJldHVybiB7T2JqZWN0fEFycmF5fSBhIHNpbmdsZSBvYmplY3Qgb3IgYW4gYXJyYXkgb2YgYEpzb25ScGNQYXJzZWRgIG9iamVjdHMgd2l0aCBgdHlwZWAgYW5kIGBwYXlsb2FkYDpcbiAqXG4gKiAge1xuICogICAgdHlwZTogPEVudW0sICdyZXF1ZXN0J3wnbm90aWZpY2F0aW9uJ3wnc3VjY2Vzcyd8J2Vycm9yJ3wnaW52YWxpZCc+XG4gKiAgICBwYXlsb2FkOiA8SnNvblJwY3xKc29uUnBjRXJyb3I+XG4gKiAgfVxuICpcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUpzb25ScGNPYmplY3QoanNvbnJwY09iaikge1xuICAgIGlmICghQXJyYXkuaXNBcnJheShqc29ucnBjT2JqKSkge1xuICAgICAgICByZXR1cm4gcGFyc2VPYmplY3QoanNvbnJwY09iaik7XG4gICAgfVxuICAgIGlmIChqc29ucnBjT2JqLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IEpzb25ScGNQYXJzZWQoSnNvblJwY0Vycm9yLmludmFsaWRSZXF1ZXN0KGpzb25ycGNPYmopLCBcImludmFsaWRcIiAvKiBpbnZhbGlkICovKTtcbiAgICB9XG4gICAgY29uc3QgcGFyc2VkT2JqZWN0QXJyYXkgPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0ganNvbnJwY09iai5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBwYXJzZWRPYmplY3RBcnJheVtpXSA9IHBhcnNlT2JqZWN0KGpzb25ycGNPYmpbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcGFyc2VkT2JqZWN0QXJyYXk7XG59XG4vKipcbiAqIEFsaWFzIGZvciBgcGFyc2VgIG1ldGhvZC5cbiAqIFRha2VzIGEgSlNPTi1SUEMgMi4wIHBheWxvYWQgKFN0cmluZykgYW5kIHRyaWVzIHRvIHBhcnNlIGl0IGludG8gYSBKU09OLlxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGNvbnN0IHBhcnNlSnNvblJwY1N0cmluZyA9IHBhcnNlO1xuLyoqXG4gKiBUYWtlcyBhIEpTT04tUlBDIDIuMCBwYXlsb2FkIChPYmplY3QpIGFuZCB0cmllcyB0byBwYXJzZSBpdCBpbnRvIGEgSlNPTi5cbiAqIElmIHN1Y2Nlc3NmdWwsIGRldGVybWluZSB3aGF0IG9iamVjdCBpcyBpdCAocmVzcG9uc2UsIG5vdGlmaWNhdGlvbixcbiAqIHN1Y2Nlc3MsIGVycm9yLCBvciBpbnZhbGlkKSwgYW5kIHJldHVybiBpdCdzIHR5cGUgYW5kIHByb3Blcmx5IGZvcm1hdHRlZCBvYmplY3QuXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge09iamVjdH0gYW4gYEpzb25ScGNQYXJzZWRgIG9iamVjdCB3aXRoIGB0eXBlYCBhbmQgYHBheWxvYWRgOlxuICpcbiAqICB7XG4gKiAgICB0eXBlOiA8RW51bSwgJ3JlcXVlc3QnfCdub3RpZmljYXRpb24nfCdzdWNjZXNzJ3wnZXJyb3InfCdpbnZhbGlkJz5cbiAqICAgIHBheWxvYWQ6IDxKc29uUnBjfEpzb25ScGNFcnJvcj5cbiAqICB9XG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlT2JqZWN0KG9iaikge1xuICAgIGxldCBlcnIgPSBudWxsO1xuICAgIGxldCBwYXlsb2FkID0gbnVsbDtcbiAgICBsZXQgcGF5bG9hZFR5cGUgPSBcImludmFsaWRcIiAvKiBpbnZhbGlkICovO1xuICAgIGlmIChvYmogPT0gbnVsbCB8fCBvYmouanNvbnJwYyAhPT0gSnNvblJwYy5WRVJTSU9OKSB7XG4gICAgICAgIGVyciA9IEpzb25ScGNFcnJvci5pbnZhbGlkUmVxdWVzdChvYmopO1xuICAgICAgICBwYXlsb2FkVHlwZSA9IFwiaW52YWxpZFwiIC8qIGludmFsaWQgKi87XG4gICAgfVxuICAgIGVsc2UgaWYgKCFoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgJ2lkJykpIHtcbiAgICAgICAgY29uc3QgdG1wID0gb2JqO1xuICAgICAgICBwYXlsb2FkID0gbmV3IE5vdGlmaWNhdGlvbk9iamVjdCh0bXAubWV0aG9kLCB0bXAucGFyYW1zKTtcbiAgICAgICAgZXJyID0gdmFsaWRhdGVNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICBwYXlsb2FkVHlwZSA9IFwibm90aWZpY2F0aW9uXCIgLyogbm90aWZpY2F0aW9uICovO1xuICAgIH1cbiAgICBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgJ21ldGhvZCcpKSB7XG4gICAgICAgIGNvbnN0IHRtcCA9IG9iajtcbiAgICAgICAgcGF5bG9hZCA9IG5ldyBSZXF1ZXN0T2JqZWN0KHRtcC5pZCwgdG1wLm1ldGhvZCwgdG1wLnBhcmFtcyk7XG4gICAgICAgIGVyciA9IHZhbGlkYXRlTWVzc2FnZShwYXlsb2FkKTtcbiAgICAgICAgcGF5bG9hZFR5cGUgPSBcInJlcXVlc3RcIiAvKiByZXF1ZXN0ICovO1xuICAgIH1cbiAgICBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgJ3Jlc3VsdCcpKSB7XG4gICAgICAgIGNvbnN0IHRtcCA9IG9iajtcbiAgICAgICAgcGF5bG9hZCA9IG5ldyBTdWNjZXNzT2JqZWN0KHRtcC5pZCwgdG1wLnJlc3VsdCk7XG4gICAgICAgIGVyciA9IHZhbGlkYXRlTWVzc2FnZShwYXlsb2FkKTtcbiAgICAgICAgcGF5bG9hZFR5cGUgPSBcInN1Y2Nlc3NcIiAvKiBzdWNjZXNzICovO1xuICAgIH1cbiAgICBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgJ2Vycm9yJykpIHtcbiAgICAgICAgY29uc3QgdG1wID0gb2JqO1xuICAgICAgICBwYXlsb2FkVHlwZSA9IFwiZXJyb3JcIiAvKiBlcnJvciAqLztcbiAgICAgICAgaWYgKHRtcC5lcnJvciA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcnIgPSBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcih0bXApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZXJyb3JPYmogPSBuZXcgSnNvblJwY0Vycm9yKHRtcC5lcnJvci5tZXNzYWdlLCB0bXAuZXJyb3IuY29kZSwgdG1wLmVycm9yLmRhdGEpO1xuICAgICAgICAgICAgaWYgKGVycm9yT2JqLm1lc3NhZ2UgIT09IHRtcC5lcnJvci5tZXNzYWdlIHx8IGVycm9yT2JqLmNvZGUgIT09IHRtcC5lcnJvci5jb2RlKSB7XG4gICAgICAgICAgICAgICAgZXJyID0gSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IodG1wKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBheWxvYWQgPSBuZXcgRXJyb3JPYmplY3QodG1wLmlkLCBlcnJvck9iaik7XG4gICAgICAgICAgICAgICAgZXJyID0gdmFsaWRhdGVNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChlcnIgPT0gbnVsbCAmJiBwYXlsb2FkICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBKc29uUnBjUGFyc2VkKHBheWxvYWQsIHBheWxvYWRUeXBlKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBKc29uUnBjUGFyc2VkKGVyciAhPSBudWxsID8gZXJyIDogSnNvblJwY0Vycm9yLmludmFsaWRSZXF1ZXN0KG9iaiksIFwiaW52YWxpZFwiIC8qIGludmFsaWQgKi8pO1xufVxuLy8gaWYgZXJyb3IsIHJldHVybiBlcnJvciwgZWxzZSByZXR1cm4gbnVsbFxuZnVuY3Rpb24gdmFsaWRhdGVNZXNzYWdlKG9iaiwgdGhyb3dJdCkge1xuICAgIGxldCBlcnIgPSBudWxsO1xuICAgIGlmIChvYmogaW5zdGFuY2VvZiBSZXF1ZXN0T2JqZWN0KSB7XG4gICAgICAgIGVyciA9IGNoZWNrSWQob2JqLmlkKTtcbiAgICAgICAgaWYgKGVyciA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcnIgPSBjaGVja01ldGhvZChvYmoubWV0aG9kKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyID09IG51bGwpIHtcbiAgICAgICAgICAgIGVyciA9IGNoZWNrUGFyYW1zKG9iai5wYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIE5vdGlmaWNhdGlvbk9iamVjdCkge1xuICAgICAgICBlcnIgPSBjaGVja01ldGhvZChvYmoubWV0aG9kKTtcbiAgICAgICAgaWYgKGVyciA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcnIgPSBjaGVja1BhcmFtcyhvYmoucGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBTdWNjZXNzT2JqZWN0KSB7XG4gICAgICAgIGVyciA9IGNoZWNrSWQob2JqLmlkKTtcbiAgICAgICAgaWYgKGVyciA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcnIgPSBjaGVja1Jlc3VsdChvYmoucmVzdWx0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBFcnJvck9iamVjdCkge1xuICAgICAgICBlcnIgPSBjaGVja0lkKG9iai5pZCwgdHJ1ZSk7XG4gICAgICAgIGlmIChlcnIgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyID0gY2hlY2tFcnJvcihvYmouZXJyb3IpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICh0aHJvd0l0ICYmIGVyciAhPSBudWxsKSB7XG4gICAgICAgIHRocm93IGVycjtcbiAgICB9XG4gICAgcmV0dXJuIGVycjtcbn1cbmZ1bmN0aW9uIGNoZWNrSWQoaWQsIG1heWJlTnVsbCkge1xuICAgIGlmIChtYXliZU51bGwgJiYgaWQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBpc1N0cmluZyhpZCkgfHwgaXNJbnRlZ2VyKGlkKVxuICAgICAgICA/IG51bGxcbiAgICAgICAgOiBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcignXCJpZFwiIG11c3QgYmUgcHJvdmlkZWQsIGEgc3RyaW5nIG9yIGFuIGludGVnZXIuJyk7XG59XG5mdW5jdGlvbiBjaGVja01ldGhvZChtZXRob2QpIHtcbiAgICByZXR1cm4gaXNTdHJpbmcobWV0aG9kKSA/IG51bGwgOiBKc29uUnBjRXJyb3IuaW52YWxpZFJlcXVlc3QobWV0aG9kKTtcbn1cbmZ1bmN0aW9uIGNoZWNrUmVzdWx0KHJlc3VsdCkge1xuICAgIHJldHVybiByZXN1bHQgPT09IHVuZGVmaW5lZFxuICAgICAgICA/IEpzb25ScGNFcnJvci5pbnRlcm5hbEVycm9yKCdSZXN1bHQgbXVzdCBleGlzdCBmb3Igc3VjY2VzcyBSZXNwb25zZSBvYmplY3RzJylcbiAgICAgICAgOiBudWxsO1xufVxuZnVuY3Rpb24gY2hlY2tQYXJhbXMocGFyYW1zKSB7XG4gICAgaWYgKHBhcmFtcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXJhbXMpIHx8IGlzT2JqZWN0KHBhcmFtcykpIHtcbiAgICAgICAgLy8gZW5zdXJlIHBhcmFtcyBjYW4gYmUgc3RyaW5naWZ5XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShwYXJhbXMpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIEpzb25ScGNFcnJvci5wYXJzZUVycm9yKHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIEpzb25ScGNFcnJvci5pbnZhbGlkUGFyYW1zKHBhcmFtcyk7XG59XG5mdW5jdGlvbiBjaGVja0Vycm9yKGVycikge1xuICAgIGlmICghKGVyciBpbnN0YW5jZW9mIEpzb25ScGNFcnJvcikpIHtcbiAgICAgICAgcmV0dXJuIEpzb25ScGNFcnJvci5pbnRlcm5hbEVycm9yKCdFcnJvciBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIEpzb25ScGNFcnJvcicpO1xuICAgIH1cbiAgICBpZiAoIWlzSW50ZWdlcihlcnIuY29kZSkpIHtcbiAgICAgICAgcmV0dXJuIEpzb25ScGNFcnJvci5pbnRlcm5hbEVycm9yKCdJbnZhbGlkIGVycm9yIGNvZGUuIEl0IG11c3QgYmUgYW4gaW50ZWdlci4nKTtcbiAgICB9XG4gICAgaWYgKCFpc1N0cmluZyhlcnIubWVzc2FnZSkpIHtcbiAgICAgICAgcmV0dXJuIEpzb25ScGNFcnJvci5pbnRlcm5hbEVycm9yKCdNZXNzYWdlIG11c3QgZXhpc3Qgb3IgbXVzdCBiZSBhIHN0cmluZy4nKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG59XG5mdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gb2JqICE9PSAnJyAmJiB0eXBlb2Ygb2JqID09PSAnc3RyaW5nJztcbn1cbmZ1bmN0aW9uIGlzT2JqZWN0KG9iaikge1xuICAgIHJldHVybiBvYmogIT0gbnVsbCAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShvYmopO1xufVxuY29uc3QganNvbnJwYyA9IHtcbiAgICBKc29uUnBjLFxuICAgIEpzb25ScGNFcnJvcixcbiAgICByZXF1ZXN0LFxuICAgIG5vdGlmaWNhdGlvbixcbiAgICBzdWNjZXNzLFxuICAgIGVycm9yLFxuICAgIHBhcnNlLFxuICAgIHBhcnNlT2JqZWN0LFxuICAgIHBhcnNlSnNvblJwY09iamVjdCxcbiAgICBwYXJzZUpzb25ScGNTdHJpbmcsXG59O1xuZXhwb3J0IGRlZmF1bHQganNvbnJwYztcbmV4cG9ydCB7IGpzb25ycGMgfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWpzb25ycGMuanMubWFwIiwiY29uc3QgcnBjID0gcmVxdWlyZSgnanNvbnJwYy1saXRlJylcbmNvbnN0IGxvZyA9IHJlcXVpcmUoJy4vX2xvZycgKVxuXG4vLyBIZWxwZXIgZnVuY3Rpb24gdG8gZ2VuZXJhdGUgdW5pcXVlIHJlcXVlc3QgSURzXG5sZXQgcmVxdWVzdElkID0gMVxuZnVuY3Rpb24gZ2VuZXJhdGVSZXF1ZXN0SWQoKSB7XG4gIHJldHVybiAocmVxdWVzdElkKyspICsgJydcbn1cblxuZnVuY3Rpb24gb25vcGVuKHdzKSB7XG4gIGNvbnN0IHtwZW5kaW5nUmVxdWVzdHN9PSB3c1xuICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gc2VuZCBhIEpTT04tUlBDIHJlcXVlc3Qgb3ZlciB0aGUgV2ViU29ja2V0XG4gIGZ1bmN0aW9uIHNlbmRSZXF1ZXN0KG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgbGV0IGlkID0gZ2VuZXJhdGVSZXF1ZXN0SWQoKVxuICAgIGNvbnN0IGFyciA9IHBhcmFtcy5zbGljZSgtMSlcbiAgICBjb25zdCByZXEgPSBycGMucmVxdWVzdChpZCwgbWV0aG9kLCBwYXJhbXMpXG4gICAgaWYgKC8oXmFwaVxcLnxcXC5hcGlfKS8udGVzdChtZXRob2QpKSB7XG4gICAgICBpZiAoYXJyWzBdPT09Jy0nKSB7XG4gICAgICAgIHBhcmFtcy5wb3AoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVxLmJyb2FkY2FzdCA9IHRydWUgLy8gYnJvYWRjYXN0IGNhbGxcbiAgICAgIH1cbiAgICB9XG4gICAgd3Muc2VuZChKU09OLnN0cmluZ2lmeShyZXEpKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvLyBTdG9yZSB0aGUgcmVxdWVzdCBJRCBhbmQgcmVzb2x2ZS9yZWplY3QgZnVuY3Rpb25zIGluIHRoZSBwZW5kaW5nIHJlcXVlc3RzIE1hcFxuICAgICAgcGVuZGluZ1JlcXVlc3RzLnNldChpZCwgeyByZXNvbHZlLCByZWplY3QgfSlcbiAgICB9KVxuICB9XG4gIHdpbmRvdy5zZW5kUmVxdWVzdCA9IHNlbmRSZXF1ZXN0XG5cbiAgLy8gRXhhbXBsZSB1c2FnZSB3aXRoIGFzeW5jL2F3YWl0IGFuZCBQcm9taXNlLmFsbCgpXG4gIGFzeW5jIGZ1bmN0aW9uIHByb21pc2VBbGxDbGllbnQoKSB7XG4gICAgLy8jIGNsaWVudCBjb2RlXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGFsbCA9IGF3YWl0IFByb21pc2UuYWxsKFtcbiAgICAgICAgc2VuZFJlcXVlc3QoJ2FwaWRlbW8uZGVtb19hZGQnLCBbeyB2YWx1ZTogMSB9XSksXG4gICAgICAgIHNlbmRSZXF1ZXN0KCdhcGlkZW1vLmRlbW9fYWRkJywgW3sgdmFsdWU6IDIgfV0pLFxuICAgICAgICBzZW5kUmVxdWVzdCgnYXBpZGVtby5kZW1vX2FkZCcsIFt7IHZhbHVlOiAzIH1dKSxcbiAgICAgIF0pXG4gICAgICBjb25zb2xlLmxvZyhgR290IGRhdGE6ICR7SlNPTi5zdHJpbmdpZnkoYWxsKX1gKVxuICAgICAgcmV0dXJuIGFsbFxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBnZXR0aW5nIGRhdGE6YCwgZXJyb3IpXG4gICAgICByZXR1cm4gZXJyb3JcbiAgICB9XG4gIH1cblxuICB3cy5vbm9wZW4gPSBhc3luYyBkYXRhID0+IHtcbiAgICBjb25zb2xlLmxvZygnV2Vic29ja2V0IG9wZW4uLi4nKVxuICAgIHNldFRpbWVvdXQoKCk9PntcbiAgICAgIGlmICh3aW5kb3cuUlBDLl9vYmpfLmFyZ3YuZGV2bW9kZSkge1xuICAgICAgICBpZiAoIXdpbmRvdy5SUEMuYXBpdGVzdCkge1xuICAgICAgICAgIHdpbmRvdy5SUEMuYXBpdGVzdCA9IHt9XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LlJQQy5hcGl0ZXN0LnByb21pc2VBbGxDbGllbnQgPSBwcm9taXNlQWxsQ2xpZW50XG4gICAgICAgIC8vIGZvciAoY29uc3QgazEgaW4gd2luZG93LlJQQykge1xuICAgICAgICAvLyAgIGlmICghL15fLitfJC8udGVzdChrMSkpIHtcbiAgICAgICAgLy8gICAgIHdpbmRvdy5SUENbazFdLmxvZyA9IGxvZ1xuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy8gfSAgXG4gICAgICB9ICBcbiAgICB9KVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IG9ub3BlblxuIiwiY29uc3QgaW5pdF93cyA9IHJlcXVpcmUoJy4vaW5pdC13cycpXG5jb25zdCBvbm1zZ3MgID0gcmVxdWlyZSgnLi9vbm1zZ3MnKVxuY29uc3Qgb25vcGVuICA9IHJlcXVpcmUoJy4vb25vcGVuJylcblxuY29uc3Qgd3MgPSBpbml0X3dzKClcbm9ubXNncyh3cylcbm9ub3Blbih3cylcblxubW9kdWxlLmV4cG9ydHMgPSB3cyJdLCJuYW1lcyI6WyJvbm1zZ3MiLCJvbm9wZW4iLCJyZXF1aXJlJCQwIiwicmVxdWlyZSQkMSIsInJlcXVpcmUkJDIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQUFBLE1BQU0sS0FBSyxHQUFH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
