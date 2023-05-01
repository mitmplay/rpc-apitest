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
	            console.log('f_any RPC:', payload);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlcyI6WyIuLi9zcmMvd3NvY2tldC9pbml0LXdzLmpzIiwiLi4vc3JjL3dzb2NrZXQvb25tc2dzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2pzb25ycGMtbGl0ZS9kaXN0L2VzbmV4dC9qc29ucnBjLmpzIiwiLi4vc3JjL3dzb2NrZXQvb25vcGVuLmpzIiwiLi4vc3JjL3dzb2NrZXQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcG9ydHMgPSB7XG4gICc0MDAyJzogYHdzczovLyR7bG9jYXRpb24uaG9zdG5hbWV9OjQwMDIvd3NgLFxuICAnNDAwMSc6ICBgd3M6Ly8ke2xvY2F0aW9uLmhvc3RuYW1lfTo0MDAxL3dzYCxcbiAgJzUxNzMnOiAgYHdzOi8vJHtsb2NhdGlvbi5ob3N0bmFtZX06NDAwMS93c2Bcbn1cblxuZnVuY3Rpb24gaW5pdHdzKCkge1xuICBjb25zdCB1cmwgPSBwb3J0c1tsb2NhdGlvbi5wb3J0XVxuICBjb25zdCB3cyAgPSBuZXcgV2ViU29ja2V0KHVybClcbiAgLy8gUGVuZGluZyByZXF1ZXN0cyBpbiBhIE1hcFxuICB3cy5wZW5kaW5nUmVxdWVzdHMgPSBuZXcgTWFwKClcbiAgcmV0dXJuIHdzIFxufVxubW9kdWxlLmV4cG9ydHMgPSBpbml0d3NcbiIsImZ1bmN0aW9uIG9ubXNncyh3cykge1xuICBjb25zdCB7cGVuZGluZ1JlcXVlc3RzfT0gd3NcbiAgd3Mub25tZXNzYWdlID0gYXN5bmMgbWVzc2FnZSA9PiB7XG4gICAgY29uc3Qge2RhdGF9ID0gbWVzc2FnZVxuICAgIGNvbnN0IHBheWxvYWQgPSBKU09OLnBhcnNlKGRhdGEpXG4gICAgY29uc3Qge2lkLCByZXN1bHQsIGVycm9yLCBicm9hZGNhc3Q6bWV0aG9kfSA9IHBheWxvYWRcbiAgICB0cnkge1xuICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICBjb25zdCBmdW5jID0gUlBDLl9icm9hZGNhc3RfW21ldGhvZC5zcGxpdCgnOicpWzBdXVxuICAgICAgICBjb25zdCBmYW55ID0gUlBDLl9icm9hZGNhc3RfLl9hbnlfXG4gICAgICAgIGxldCBleGZ1bmMgPSB0cnVlXG4gICAgICAgIGxldCBydW4gXG4gICAgICAgIGlmIChmdW5jKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYCR7bWV0aG9kfSBSUEM6YCwgcGF5bG9hZClcbiAgICAgICAgICBydW4gPSBmdW5jKHBheWxvYWQsIG1ldGhvZClcbiAgICAgICAgICBpZiAocnVuPT09ZmFsc2UpIHtcbiAgICAgICAgICAgIGV4ZnVuYz0gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGV4ZnVuYykge1xuICAgICAgICAgIGxldCB0X2V4ZWN1dGVkID0gMFxuICAgICAgICAgIGZvciAoY29uc3QgZiBpbiBmYW55KSB7XG4gICAgICAgICAgICBydW4gPSBmYW55W2ZdKHBheWxvYWQsIG1ldGhvZClcbiAgICAgICAgICAgIGlmIChydW4udGhlbikge1xuICAgICAgICAgICAgICBydW4gPSBhd2FpdCBydW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChydW4hPT1mYWxzZSkge1xuICAgICAgICAgICAgICB0X2V4ZWN1dGVkKytcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRfZXhlY3V0ZWQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmX2FueSBSUEM6JywgcGF5bG9hZClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHBlbmRpbmcgPSBwZW5kaW5nUmVxdWVzdHMuZ2V0KGlkKVxuICAgICAgaWYgKHBlbmRpbmcpIHtcbiAgICAgICAgcGVuZGluZ1JlcXVlc3RzLmRlbGV0ZShpZClcbiAgICAgICAgY29uc3QgeyByZXNvbHZlLCByZWplY3QgfSA9IHBlbmRpbmdcbiAgICAgICAgZXJyb3IgPyByZWplY3QoZXJyb3IpIDogcmVzb2x2ZShyZXN1bHQpICBcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcihgRXJyb3IgcGFyc2luZyBXZWJTb2NrZXQgbWVzc2FnZTogJHtlcnJvcn1gKVxuICAgIH1cbiAgfSAgXG59XG5tb2R1bGUuZXhwb3J0cyA9IG9ubXNnc1xuIiwiLy8gKipHaXRodWI6KiogaHR0cHM6Ly9naXRodWIuY29tL3RlYW1iaXRpb24vanNvbnJwYy1saXRlXG4vL1xuLy8gaHR0cDovL3d3dy5qc29ucnBjLm9yZy9zcGVjaWZpY2F0aW9uXG4vLyAqKkxpY2Vuc2U6KiogTUlUXG4ndXNlIHN0cmljdCc7XG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5jb25zdCBpc0ludGVnZXIgPSB0eXBlb2YgTnVtYmVyLmlzU2FmZUludGVnZXIgPT09ICdmdW5jdGlvbidcbiAgICA/IE51bWJlci5pc1NhZmVJbnRlZ2VyIC8vIEVDTUFTY3JpcHQgMjAxNVxuICAgIDogZnVuY3Rpb24gKG51bSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG51bSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUobnVtKSAmJiBudW0gPT09IE1hdGguZmxvb3IobnVtKSAmJiBNYXRoLmFicyhudW0pIDw9IDkwMDcxOTkyNTQ3NDA5OTE7XG4gICAgfTtcbmV4cG9ydCBjbGFzcyBKc29uUnBjIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5qc29ucnBjID0gJzIuMCc7XG4gICAgfVxuICAgIHNlcmlhbGl6ZSgpIHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgIH1cbn1cbkpzb25ScGMuVkVSU0lPTiA9ICcyLjAnO1xuZXhwb3J0IGNsYXNzIFJlcXVlc3RPYmplY3QgZXh0ZW5kcyBKc29uUnBjIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgbWV0aG9kLCBwYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgaWYgKHBhcmFtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb25PYmplY3QgZXh0ZW5kcyBKc29uUnBjIHtcbiAgICBjb25zdHJ1Y3RvcihtZXRob2QsIHBhcmFtcykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgaWYgKHBhcmFtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBTdWNjZXNzT2JqZWN0IGV4dGVuZHMgSnNvblJwYyB7XG4gICAgY29uc3RydWN0b3IoaWQsIHJlc3VsdCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBFcnJvck9iamVjdCBleHRlbmRzIEpzb25ScGMge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgIGNvbnN0cnVjdG9yKGlkLCBlcnJvcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEpzb25ScGNQYXJzZWQge1xuICAgIGNvbnN0cnVjdG9yKHBheWxvYWQsIHR5cGUpIHtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB9XG59XG4vKipcbiAqIEpzb25ScGNFcnJvciBDbGFzc1xuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gbWVzc2FnZVxuICogQHBhcmFtICB7SW50ZWdlcn0gY29kZVxuICogQHJldHVybiB7U3RyaW5nfSBuYW1lOiBvcHRpb25hbFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIEpzb25ScGNFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgY29kZSwgZGF0YSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICB0aGlzLmNvZGUgPSBpc0ludGVnZXIoY29kZSkgPyBjb2RlIDogMDtcbiAgICAgICAgaWYgKGRhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgfVxuICAgIH1cbn1cbkpzb25ScGNFcnJvci5pbnZhbGlkUmVxdWVzdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBKc29uUnBjRXJyb3IoJ0ludmFsaWQgcmVxdWVzdCcsIC0zMjYwMCwgZGF0YSk7XG59O1xuSnNvblJwY0Vycm9yLm1ldGhvZE5vdEZvdW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IEpzb25ScGNFcnJvcignTWV0aG9kIG5vdCBmb3VuZCcsIC0zMjYwMSwgZGF0YSk7XG59O1xuSnNvblJwY0Vycm9yLmludmFsaWRQYXJhbXMgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgSnNvblJwY0Vycm9yKCdJbnZhbGlkIHBhcmFtcycsIC0zMjYwMiwgZGF0YSk7XG59O1xuSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgSnNvblJwY0Vycm9yKCdJbnRlcm5hbCBlcnJvcicsIC0zMjYwMywgZGF0YSk7XG59O1xuSnNvblJwY0Vycm9yLnBhcnNlRXJyb3IgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgSnNvblJwY0Vycm9yKCdQYXJzZSBlcnJvcicsIC0zMjcwMCwgZGF0YSk7XG59O1xuLyoqXG4gKiBDcmVhdGVzIGEgSlNPTi1SUEMgMi4wIHJlcXVlc3Qgb2JqZWN0XG4gKlxuICogQHBhcmFtICB7U3RyaW5nfEludGVnZXJ9IGlkXG4gKiBAcGFyYW0gIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtICB7T2JqZWN0fEFycmF5fSBbcGFyYW1zXTogb3B0aW9uYWxcbiAqIEByZXR1cm4ge09iamVjdH0gSnNvblJwYyBvYmplY3RcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0KGlkLCBtZXRob2QsIHBhcmFtcykge1xuICAgIGNvbnN0IG9iamVjdCA9IG5ldyBSZXF1ZXN0T2JqZWN0KGlkLCBtZXRob2QsIHBhcmFtcyk7XG4gICAgdmFsaWRhdGVNZXNzYWdlKG9iamVjdCwgdHJ1ZSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIEpTT04tUlBDIDIuMCBub3RpZmljYXRpb24gb2JqZWN0XG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSAge09iamVjdHxBcnJheX0gW3BhcmFtc106IG9wdGlvbmFsXG4gKiBAcmV0dXJuIHtPYmplY3R9IEpzb25ScGMgb2JqZWN0XG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gbm90aWZpY2F0aW9uKG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgY29uc3Qgb2JqZWN0ID0gbmV3IE5vdGlmaWNhdGlvbk9iamVjdChtZXRob2QsIHBhcmFtcyk7XG4gICAgdmFsaWRhdGVNZXNzYWdlKG9iamVjdCwgdHJ1ZSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIEpTT04tUlBDIDIuMCBzdWNjZXNzIHJlc3BvbnNlIG9iamVjdFxuICpcbiAqIEBwYXJhbSAge1N0cmluZ3xJbnRlZ2VyfSBpZFxuICogQHBhcmFtICB7TWl4ZWR9IHJlc3VsdFxuICogQHJldHVybiB7T2JqZWN0fSBKc29uUnBjIG9iamVjdFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1Y2Nlc3MoaWQsIHJlc3VsdCkge1xuICAgIGNvbnN0IG9iamVjdCA9IG5ldyBTdWNjZXNzT2JqZWN0KGlkLCByZXN1bHQpO1xuICAgIHZhbGlkYXRlTWVzc2FnZShvYmplY3QsIHRydWUpO1xuICAgIHJldHVybiBvYmplY3Q7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBKU09OLVJQQyAyLjAgZXJyb3IgcmVzcG9uc2Ugb2JqZWN0XG4gKlxuICogQHBhcmFtICB7U3RyaW5nfEludGVnZXJ9IGlkXG4gKiBAcGFyYW0gIHtPYmplY3R9IEpzb25ScGNFcnJvciBlcnJvclxuICogQHJldHVybiB7T2JqZWN0fSBKc29uUnBjIG9iamVjdFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVycm9yKGlkLCBlcnIpIHtcbiAgICBjb25zdCBvYmplY3QgPSBuZXcgRXJyb3JPYmplY3QoaWQsIGVycik7XG4gICAgdmFsaWRhdGVNZXNzYWdlKG9iamVjdCwgdHJ1ZSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShtZXNzYWdlKSB7XG4gICAgaWYgKCFpc1N0cmluZyhtZXNzYWdlKSkge1xuICAgICAgICByZXR1cm4gbmV3IEpzb25ScGNQYXJzZWQoSnNvblJwY0Vycm9yLmludmFsaWRSZXF1ZXN0KG1lc3NhZ2UpLCBcImludmFsaWRcIiAvKiBpbnZhbGlkICovKTtcbiAgICB9XG4gICAgbGV0IGpzb25ycGNPYmo7XG4gICAgdHJ5IHtcbiAgICAgICAganNvbnJwY09iaiA9IEpTT04ucGFyc2UobWVzc2FnZSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBKc29uUnBjUGFyc2VkKEpzb25ScGNFcnJvci5wYXJzZUVycm9yKG1lc3NhZ2UpLCBcImludmFsaWRcIiAvKiBpbnZhbGlkICovKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSnNvblJwY09iamVjdChqc29ucnBjT2JqKTtcbn1cbi8qKlxuICogVGFrZXMgYSBKU09OLVJQQyAyLjAgcGF5bG9hZCAoT2JqZWN0KSBvciBiYXRjaCAoT2JqZWN0W10pIGFuZCB0cmllcyB0byBwYXJzZSBpdC5cbiAqIElmIHN1Y2Nlc3NmdWwsIGRldGVybWluZSB3aGF0IG9iamVjdHMgYXJlIGluc2lkZSAocmVzcG9uc2UsIG5vdGlmaWNhdGlvbixcbiAqIHN1Y2Nlc3MsIGVycm9yLCBvciBpbnZhbGlkKSwgYW5kIHJldHVybiB0aGVpciB0eXBlcyBhbmQgcHJvcGVybHkgZm9ybWF0dGVkIG9iamVjdHMuXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fEFycmF5fSBqc29ucnBjT2JqXG4gKiBAcmV0dXJuIHtPYmplY3R8QXJyYXl9IGEgc2luZ2xlIG9iamVjdCBvciBhbiBhcnJheSBvZiBgSnNvblJwY1BhcnNlZGAgb2JqZWN0cyB3aXRoIGB0eXBlYCBhbmQgYHBheWxvYWRgOlxuICpcbiAqICB7XG4gKiAgICB0eXBlOiA8RW51bSwgJ3JlcXVlc3QnfCdub3RpZmljYXRpb24nfCdzdWNjZXNzJ3wnZXJyb3InfCdpbnZhbGlkJz5cbiAqICAgIHBheWxvYWQ6IDxKc29uUnBjfEpzb25ScGNFcnJvcj5cbiAqICB9XG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSnNvblJwY09iamVjdChqc29ucnBjT2JqKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGpzb25ycGNPYmopKSB7XG4gICAgICAgIHJldHVybiBwYXJzZU9iamVjdChqc29ucnBjT2JqKTtcbiAgICB9XG4gICAgaWYgKGpzb25ycGNPYmoubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgSnNvblJwY1BhcnNlZChKc29uUnBjRXJyb3IuaW52YWxpZFJlcXVlc3QoanNvbnJwY09iaiksIFwiaW52YWxpZFwiIC8qIGludmFsaWQgKi8pO1xuICAgIH1cbiAgICBjb25zdCBwYXJzZWRPYmplY3RBcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBqc29ucnBjT2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHBhcnNlZE9iamVjdEFycmF5W2ldID0gcGFyc2VPYmplY3QoanNvbnJwY09ialtpXSk7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWRPYmplY3RBcnJheTtcbn1cbi8qKlxuICogQWxpYXMgZm9yIGBwYXJzZWAgbWV0aG9kLlxuICogVGFrZXMgYSBKU09OLVJQQyAyLjAgcGF5bG9hZCAoU3RyaW5nKSBhbmQgdHJpZXMgdG8gcGFyc2UgaXQgaW50byBhIEpTT04uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgcGFyc2VKc29uUnBjU3RyaW5nID0gcGFyc2U7XG4vKipcbiAqIFRha2VzIGEgSlNPTi1SUEMgMi4wIHBheWxvYWQgKE9iamVjdCkgYW5kIHRyaWVzIHRvIHBhcnNlIGl0IGludG8gYSBKU09OLlxuICogSWYgc3VjY2Vzc2Z1bCwgZGV0ZXJtaW5lIHdoYXQgb2JqZWN0IGlzIGl0IChyZXNwb25zZSwgbm90aWZpY2F0aW9uLFxuICogc3VjY2VzcywgZXJyb3IsIG9yIGludmFsaWQpLCBhbmQgcmV0dXJuIGl0J3MgdHlwZSBhbmQgcHJvcGVybHkgZm9ybWF0dGVkIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fSBhbiBgSnNvblJwY1BhcnNlZGAgb2JqZWN0IHdpdGggYHR5cGVgIGFuZCBgcGF5bG9hZGA6XG4gKlxuICogIHtcbiAqICAgIHR5cGU6IDxFbnVtLCAncmVxdWVzdCd8J25vdGlmaWNhdGlvbid8J3N1Y2Nlc3MnfCdlcnJvcid8J2ludmFsaWQnPlxuICogICAgcGF5bG9hZDogPEpzb25ScGN8SnNvblJwY0Vycm9yPlxuICogIH1cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VPYmplY3Qob2JqKSB7XG4gICAgbGV0IGVyciA9IG51bGw7XG4gICAgbGV0IHBheWxvYWQgPSBudWxsO1xuICAgIGxldCBwYXlsb2FkVHlwZSA9IFwiaW52YWxpZFwiIC8qIGludmFsaWQgKi87XG4gICAgaWYgKG9iaiA9PSBudWxsIHx8IG9iai5qc29ucnBjICE9PSBKc29uUnBjLlZFUlNJT04pIHtcbiAgICAgICAgZXJyID0gSnNvblJwY0Vycm9yLmludmFsaWRSZXF1ZXN0KG9iaik7XG4gICAgICAgIHBheWxvYWRUeXBlID0gXCJpbnZhbGlkXCIgLyogaW52YWxpZCAqLztcbiAgICB9XG4gICAgZWxzZSBpZiAoIWhhc093blByb3BlcnR5LmNhbGwob2JqLCAnaWQnKSkge1xuICAgICAgICBjb25zdCB0bXAgPSBvYmo7XG4gICAgICAgIHBheWxvYWQgPSBuZXcgTm90aWZpY2F0aW9uT2JqZWN0KHRtcC5tZXRob2QsIHRtcC5wYXJhbXMpO1xuICAgICAgICBlcnIgPSB2YWxpZGF0ZU1lc3NhZ2UocGF5bG9hZCk7XG4gICAgICAgIHBheWxvYWRUeXBlID0gXCJub3RpZmljYXRpb25cIiAvKiBub3RpZmljYXRpb24gKi87XG4gICAgfVxuICAgIGVsc2UgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCAnbWV0aG9kJykpIHtcbiAgICAgICAgY29uc3QgdG1wID0gb2JqO1xuICAgICAgICBwYXlsb2FkID0gbmV3IFJlcXVlc3RPYmplY3QodG1wLmlkLCB0bXAubWV0aG9kLCB0bXAucGFyYW1zKTtcbiAgICAgICAgZXJyID0gdmFsaWRhdGVNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICBwYXlsb2FkVHlwZSA9IFwicmVxdWVzdFwiIC8qIHJlcXVlc3QgKi87XG4gICAgfVxuICAgIGVsc2UgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCAncmVzdWx0JykpIHtcbiAgICAgICAgY29uc3QgdG1wID0gb2JqO1xuICAgICAgICBwYXlsb2FkID0gbmV3IFN1Y2Nlc3NPYmplY3QodG1wLmlkLCB0bXAucmVzdWx0KTtcbiAgICAgICAgZXJyID0gdmFsaWRhdGVNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICBwYXlsb2FkVHlwZSA9IFwic3VjY2Vzc1wiIC8qIHN1Y2Nlc3MgKi87XG4gICAgfVxuICAgIGVsc2UgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCAnZXJyb3InKSkge1xuICAgICAgICBjb25zdCB0bXAgPSBvYmo7XG4gICAgICAgIHBheWxvYWRUeXBlID0gXCJlcnJvclwiIC8qIGVycm9yICovO1xuICAgICAgICBpZiAodG1wLmVycm9yID09IG51bGwpIHtcbiAgICAgICAgICAgIGVyciA9IEpzb25ScGNFcnJvci5pbnRlcm5hbEVycm9yKHRtcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvck9iaiA9IG5ldyBKc29uUnBjRXJyb3IodG1wLmVycm9yLm1lc3NhZ2UsIHRtcC5lcnJvci5jb2RlLCB0bXAuZXJyb3IuZGF0YSk7XG4gICAgICAgICAgICBpZiAoZXJyb3JPYmoubWVzc2FnZSAhPT0gdG1wLmVycm9yLm1lc3NhZ2UgfHwgZXJyb3JPYmouY29kZSAhPT0gdG1wLmVycm9yLmNvZGUpIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcih0bXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZCA9IG5ldyBFcnJvck9iamVjdCh0bXAuaWQsIGVycm9yT2JqKTtcbiAgICAgICAgICAgICAgICBlcnIgPSB2YWxpZGF0ZU1lc3NhZ2UocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVyciA9PSBudWxsICYmIHBheWxvYWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbmV3IEpzb25ScGNQYXJzZWQocGF5bG9hZCwgcGF5bG9hZFR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEpzb25ScGNQYXJzZWQoZXJyICE9IG51bGwgPyBlcnIgOiBKc29uUnBjRXJyb3IuaW52YWxpZFJlcXVlc3Qob2JqKSwgXCJpbnZhbGlkXCIgLyogaW52YWxpZCAqLyk7XG59XG4vLyBpZiBlcnJvciwgcmV0dXJuIGVycm9yLCBlbHNlIHJldHVybiBudWxsXG5mdW5jdGlvbiB2YWxpZGF0ZU1lc3NhZ2Uob2JqLCB0aHJvd0l0KSB7XG4gICAgbGV0IGVyciA9IG51bGw7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIFJlcXVlc3RPYmplY3QpIHtcbiAgICAgICAgZXJyID0gY2hlY2tJZChvYmouaWQpO1xuICAgICAgICBpZiAoZXJyID09IG51bGwpIHtcbiAgICAgICAgICAgIGVyciA9IGNoZWNrTWV0aG9kKG9iai5tZXRob2QpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnIgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyID0gY2hlY2tQYXJhbXMob2JqLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgTm90aWZpY2F0aW9uT2JqZWN0KSB7XG4gICAgICAgIGVyciA9IGNoZWNrTWV0aG9kKG9iai5tZXRob2QpO1xuICAgICAgICBpZiAoZXJyID09IG51bGwpIHtcbiAgICAgICAgICAgIGVyciA9IGNoZWNrUGFyYW1zKG9iai5wYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFN1Y2Nlc3NPYmplY3QpIHtcbiAgICAgICAgZXJyID0gY2hlY2tJZChvYmouaWQpO1xuICAgICAgICBpZiAoZXJyID09IG51bGwpIHtcbiAgICAgICAgICAgIGVyciA9IGNoZWNrUmVzdWx0KG9iai5yZXN1bHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIEVycm9yT2JqZWN0KSB7XG4gICAgICAgIGVyciA9IGNoZWNrSWQob2JqLmlkLCB0cnVlKTtcbiAgICAgICAgaWYgKGVyciA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcnIgPSBjaGVja0Vycm9yKG9iai5lcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRocm93SXQgJiYgZXJyICE9IG51bGwpIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgICByZXR1cm4gZXJyO1xufVxuZnVuY3Rpb24gY2hlY2tJZChpZCwgbWF5YmVOdWxsKSB7XG4gICAgaWYgKG1heWJlTnVsbCAmJiBpZCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGlzU3RyaW5nKGlkKSB8fCBpc0ludGVnZXIoaWQpXG4gICAgICAgID8gbnVsbFxuICAgICAgICA6IEpzb25ScGNFcnJvci5pbnRlcm5hbEVycm9yKCdcImlkXCIgbXVzdCBiZSBwcm92aWRlZCwgYSBzdHJpbmcgb3IgYW4gaW50ZWdlci4nKTtcbn1cbmZ1bmN0aW9uIGNoZWNrTWV0aG9kKG1ldGhvZCkge1xuICAgIHJldHVybiBpc1N0cmluZyhtZXRob2QpID8gbnVsbCA6IEpzb25ScGNFcnJvci5pbnZhbGlkUmVxdWVzdChtZXRob2QpO1xufVxuZnVuY3Rpb24gY2hlY2tSZXN1bHQocmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IoJ1Jlc3VsdCBtdXN0IGV4aXN0IGZvciBzdWNjZXNzIFJlc3BvbnNlIG9iamVjdHMnKVxuICAgICAgICA6IG51bGw7XG59XG5mdW5jdGlvbiBjaGVja1BhcmFtcyhwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcykgfHwgaXNPYmplY3QocGFyYW1zKSkge1xuICAgICAgICAvLyBlbnN1cmUgcGFyYW1zIGNhbiBiZSBzdHJpbmdpZnlcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHBhcmFtcyk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gSnNvblJwY0Vycm9yLnBhcnNlRXJyb3IocGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSnNvblJwY0Vycm9yLmludmFsaWRQYXJhbXMocGFyYW1zKTtcbn1cbmZ1bmN0aW9uIGNoZWNrRXJyb3IoZXJyKSB7XG4gICAgaWYgKCEoZXJyIGluc3RhbmNlb2YgSnNvblJwY0Vycm9yKSkge1xuICAgICAgICByZXR1cm4gSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IoJ0Vycm9yIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgSnNvblJwY0Vycm9yJyk7XG4gICAgfVxuICAgIGlmICghaXNJbnRlZ2VyKGVyci5jb2RlKSkge1xuICAgICAgICByZXR1cm4gSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IoJ0ludmFsaWQgZXJyb3IgY29kZS4gSXQgbXVzdCBiZSBhbiBpbnRlZ2VyLicpO1xuICAgIH1cbiAgICBpZiAoIWlzU3RyaW5nKGVyci5tZXNzYWdlKSkge1xuICAgICAgICByZXR1cm4gSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IoJ01lc3NhZ2UgbXVzdCBleGlzdCBvciBtdXN0IGJlIGEgc3RyaW5nLicpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICAgIHJldHVybiBvYmogIT09ICcnICYmIHR5cGVvZiBvYmogPT09ICdzdHJpbmcnO1xufVxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iaik7XG59XG5jb25zdCBqc29ucnBjID0ge1xuICAgIEpzb25ScGMsXG4gICAgSnNvblJwY0Vycm9yLFxuICAgIHJlcXVlc3QsXG4gICAgbm90aWZpY2F0aW9uLFxuICAgIHN1Y2Nlc3MsXG4gICAgZXJyb3IsXG4gICAgcGFyc2UsXG4gICAgcGFyc2VPYmplY3QsXG4gICAgcGFyc2VKc29uUnBjT2JqZWN0LFxuICAgIHBhcnNlSnNvblJwY1N0cmluZyxcbn07XG5leHBvcnQgZGVmYXVsdCBqc29ucnBjO1xuZXhwb3J0IHsganNvbnJwYyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9anNvbnJwYy5qcy5tYXAiLCJjb25zdCBycGMgPSByZXF1aXJlKCdqc29ucnBjLWxpdGUnKVxuY29uc3QgbG9nID0gcmVxdWlyZSgnLi9fbG9nJyApXG5cbi8vIEhlbHBlciBmdW5jdGlvbiB0byBnZW5lcmF0ZSB1bmlxdWUgcmVxdWVzdCBJRHNcbmxldCByZXF1ZXN0SWQgPSAxXG5mdW5jdGlvbiBnZW5lcmF0ZVJlcXVlc3RJZCgpIHtcbiAgcmV0dXJuIChyZXF1ZXN0SWQrKykgKyAnJ1xufVxuXG5mdW5jdGlvbiBvbm9wZW4od3MpIHtcbiAgY29uc3Qge3BlbmRpbmdSZXF1ZXN0c309IHdzXG4gIC8vIEhlbHBlciBmdW5jdGlvbiB0byBzZW5kIGEgSlNPTi1SUEMgcmVxdWVzdCBvdmVyIHRoZSBXZWJTb2NrZXRcbiAgZnVuY3Rpb24gc2VuZFJlcXVlc3QobWV0aG9kLCBwYXJhbXMpIHtcbiAgICBsZXQgaWQgPSBnZW5lcmF0ZVJlcXVlc3RJZCgpXG4gICAgY29uc3QgYXJyID0gcGFyYW1zLnNsaWNlKC0xKVxuICAgIGNvbnN0IHJlcSA9IHJwYy5yZXF1ZXN0KGlkLCBtZXRob2QsIHBhcmFtcylcbiAgICBpZiAoLyheYXBpXFwufFxcLmFwaV8pLy50ZXN0KG1ldGhvZCkpIHtcbiAgICAgIGlmIChhcnJbMF09PT0nLScpIHtcbiAgICAgICAgcGFyYW1zLnBvcCgpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXEuYnJvYWRjYXN0ID0gdHJ1ZSAvLyBicm9hZGNhc3QgY2FsbFxuICAgICAgfVxuICAgIH1cbiAgICB3cy5zZW5kKEpTT04uc3RyaW5naWZ5KHJlcSkpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIFN0b3JlIHRoZSByZXF1ZXN0IElEIGFuZCByZXNvbHZlL3JlamVjdCBmdW5jdGlvbnMgaW4gdGhlIHBlbmRpbmcgcmVxdWVzdHMgTWFwXG4gICAgICBwZW5kaW5nUmVxdWVzdHMuc2V0KGlkLCB7IHJlc29sdmUsIHJlamVjdCB9KVxuICAgIH0pXG4gIH1cbiAgd2luZG93LnNlbmRSZXF1ZXN0ID0gc2VuZFJlcXVlc3RcblxuICAvLyBFeGFtcGxlIHVzYWdlIHdpdGggYXN5bmMvYXdhaXQgYW5kIFByb21pc2UuYWxsKClcbiAgYXN5bmMgZnVuY3Rpb24gcHJvbWlzZUFsbENsaWVudCgpIHtcbiAgICAvLyMgY2xpZW50IGNvZGVcbiAgICB0cnkge1xuICAgICAgY29uc3QgYWxsID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xuICAgICAgICBzZW5kUmVxdWVzdCgnYXBpZGVtby5kZW1vX2FkZCcsIFt7IHZhbHVlOiAxIH1dKSxcbiAgICAgICAgc2VuZFJlcXVlc3QoJ2FwaWRlbW8uZGVtb19hZGQnLCBbeyB2YWx1ZTogMiB9XSksXG4gICAgICAgIHNlbmRSZXF1ZXN0KCdhcGlkZW1vLmRlbW9fYWRkJywgW3sgdmFsdWU6IDMgfV0pLFxuICAgICAgXSlcbiAgICAgIGNvbnNvbGUubG9nKGBHb3QgZGF0YTogJHtKU09OLnN0cmluZ2lmeShhbGwpfWApXG4gICAgICByZXR1cm4gYWxsXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGdldHRpbmcgZGF0YTpgLCBlcnJvcilcbiAgICAgIHJldHVybiBlcnJvclxuICAgIH1cbiAgfVxuXG4gIHdzLm9ub3BlbiA9IGFzeW5jIGRhdGEgPT4ge1xuICAgIGNvbnNvbGUubG9nKCdXZWJzb2NrZXQgb3Blbi4uLicpXG4gICAgc2V0VGltZW91dCgoKT0+e1xuICAgICAgaWYgKHdpbmRvdy5SUEMuX29ial8uYXJndi5kZXZtb2RlKSB7XG4gICAgICAgIGlmICghd2luZG93LlJQQy5hcGl0ZXN0KSB7XG4gICAgICAgICAgd2luZG93LlJQQy5hcGl0ZXN0ID0ge31cbiAgICAgICAgfVxuICAgICAgICB3aW5kb3cuUlBDLmFwaXRlc3QucHJvbWlzZUFsbENsaWVudCA9IHByb21pc2VBbGxDbGllbnRcbiAgICAgICAgLy8gZm9yIChjb25zdCBrMSBpbiB3aW5kb3cuUlBDKSB7XG4gICAgICAgIC8vICAgaWYgKCEvXl8uK18kLy50ZXN0KGsxKSkge1xuICAgICAgICAvLyAgICAgd2luZG93LlJQQ1trMV0ubG9nID0gbG9nXG4gICAgICAgIC8vICAgfVxuICAgICAgICAvLyB9ICBcbiAgICAgIH0gIFxuICAgIH0pXG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gb25vcGVuXG4iLCJjb25zdCBpbml0X3dzID0gcmVxdWlyZSgnLi9pbml0LXdzJylcbmNvbnN0IG9ubXNncyAgPSByZXF1aXJlKCcuL29ubXNncycpXG5jb25zdCBvbm9wZW4gID0gcmVxdWlyZSgnLi9vbm9wZW4nKVxuXG5jb25zdCB3cyA9IGluaXRfd3MoKVxub25tc2dzKHdzKVxub25vcGVuKHdzKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdzIl0sIm5hbWVzIjpbIm9ubXNncyIsIm9ub3BlbiIsInJlcXVpcmUkJDAiLCJyZXF1aXJlJCQxIiwicmVxdWlyZSQkMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBQUEsTUFBTSxLQUFLLEdBQUc7Q0FDZCxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztDQUM5QyxFQUFFLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztDQUM5QyxFQUFFLE1BQU0sR0FBRyxDQUFD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
