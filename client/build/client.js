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
	    const pending = pendingRequests.get(id);
	    const msg = {id};

	    if (pending) {
	      const {method: sd, params: pr} = pending;
	      if (pr?.length) {
	        msg.sd = `${sd}('${pr[0]}',.)`;
	        if (RPC._obj_.argv.verbose) {
	          msg.pr = pr[1];
	        }
	      } else {
	        msg.sd = `${sd}(...)`;
	      }
	    } else {
	      msg.bc = method;
	    }
	    if (RPC._obj_.argv.verbose) {
	      msg.result = result;
	    }
	    const show = !(msg.bc && msg.id);
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
	            msg.ex = true;
	          }
	        }
	      }
	      if (show) {
	        console.log(msg);
	      }
	      if (pending) {
	        pending.logged += 1;
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
	const t64 = 'Wabcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZh';
	const nanoid = (size = 8) => {
	  let id = '';
	  while (size-- > 0) {
	    id += t64[Math.random() * 64 | 0];
	  }
	  return id
	};

	function onopen$1(ws) {
	  const {pendingRequests}= ws;
	  // Helper function to send a JSON-RPC request over the WebSocket
	  function sendRequest(method, params) {
	    let id = nanoid();
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
	      pendingRequests.set(id, { resolve, reject, method, params, logged: 0});
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
	      if (window.RPC._obj_?.argv?.devmode) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlcyI6WyIuLi9zcmMvd3NvY2tldC9pbml0LXdzLmpzIiwiLi4vc3JjL3dzb2NrZXQvb25tc2dzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL2pzb25ycGMtbGl0ZS9kaXN0L2VzbmV4dC9qc29ucnBjLmpzIiwiLi4vc3JjL3dzb2NrZXQvb25vcGVuLmpzIiwiLi4vc3JjL3dzb2NrZXQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcG9ydHMgPSB7XG4gICc0MDAyJzogYHdzczovLyR7bG9jYXRpb24uaG9zdG5hbWV9OjQwMDIvd3NgLFxuICAnNDAwMSc6ICBgd3M6Ly8ke2xvY2F0aW9uLmhvc3RuYW1lfTo0MDAxL3dzYCxcbiAgJzUxNzMnOiAgYHdzOi8vJHtsb2NhdGlvbi5ob3N0bmFtZX06NDAwMS93c2Bcbn1cblxuZnVuY3Rpb24gaW5pdHdzKCkge1xuICBjb25zdCB1cmwgPSBwb3J0c1tsb2NhdGlvbi5wb3J0XVxuICBjb25zdCB3cyAgPSBuZXcgV2ViU29ja2V0KHVybClcbiAgLy8gUGVuZGluZyByZXF1ZXN0cyBpbiBhIE1hcFxuICB3cy5wZW5kaW5nUmVxdWVzdHMgPSBuZXcgTWFwKClcbiAgcmV0dXJuIHdzIFxufVxubW9kdWxlLmV4cG9ydHMgPSBpbml0d3NcbiIsImZ1bmN0aW9uIG9ubXNncyh3cykge1xyXG4gIGNvbnN0IHtwZW5kaW5nUmVxdWVzdHN9PSB3c1xyXG4gIHdzLm9ubWVzc2FnZSA9IGFzeW5jIG1lc3NhZ2UgPT4ge1xyXG4gICAgY29uc3Qge2RhdGF9ID0gbWVzc2FnZVxyXG4gICAgY29uc3QgcGF5bG9hZCA9IEpTT04ucGFyc2UoZGF0YSlcclxuICAgIGNvbnN0IHtpZCwgcmVzdWx0LCBlcnJvciwgYnJvYWRjYXN0Om1ldGhvZH0gPSBwYXlsb2FkXHJcbiAgICBjb25zdCBwZW5kaW5nID0gcGVuZGluZ1JlcXVlc3RzLmdldChpZClcclxuICAgIGNvbnN0IG1zZyA9IHtpZH1cclxuXHJcbiAgICBpZiAocGVuZGluZykge1xyXG4gICAgICBjb25zdCB7bWV0aG9kOiBzZCwgcGFyYW1zOiBwcn0gPSBwZW5kaW5nXHJcbiAgICAgIGlmIChwcj8ubGVuZ3RoKSB7XHJcbiAgICAgICAgbXNnLnNkID0gYCR7c2R9KCcke3ByWzBdfScsLilgXHJcbiAgICAgICAgaWYgKFJQQy5fb2JqXy5hcmd2LnZlcmJvc2UpIHtcclxuICAgICAgICAgIG1zZy5wciA9IHByWzFdXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG1zZy5zZCA9IGAke3NkfSguLi4pYFxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtc2cuYmMgPSBtZXRob2RcclxuICAgIH1cclxuICAgIGlmIChSUEMuX29ial8uYXJndi52ZXJib3NlKSB7XHJcbiAgICAgIG1zZy5yZXN1bHQgPSByZXN1bHRcclxuICAgIH1cclxuICAgIGNvbnN0IHNob3cgPSAhKG1zZy5iYyAmJiBtc2cuaWQpXHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAobWV0aG9kKSB7XHJcbiAgICAgICAgY29uc3QgZnVuYyA9IFJQQy5fYnJvYWRjYXN0X1ttZXRob2Quc3BsaXQoJzonKVswXV1cclxuICAgICAgICBjb25zdCBmYW55ID0gUlBDLl9icm9hZGNhc3RfLl9hbnlfXHJcbiAgICAgICAgbGV0IGV4ZnVuYyA9IHRydWVcclxuICAgICAgICBsZXQgcnVuIFxyXG4gICAgICAgIGlmIChmdW5jKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhgJHttZXRob2R9IFJQQzpgLCBwYXlsb2FkKVxyXG4gICAgICAgICAgcnVuID0gZnVuYyhwYXlsb2FkLCBtZXRob2QpXHJcbiAgICAgICAgICBpZiAocnVuPT09ZmFsc2UpIHtcclxuICAgICAgICAgICAgZXhmdW5jPSBmYWxzZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIFxyXG4gICAgICAgIGlmIChleGZ1bmMpIHtcclxuICAgICAgICAgIGxldCB0X2V4ZWN1dGVkID0gMFxyXG4gICAgICAgICAgZm9yIChjb25zdCBmIGluIGZhbnkpIHtcclxuICAgICAgICAgICAgcnVuID0gZmFueVtmXShwYXlsb2FkLCBtZXRob2QpXHJcbiAgICAgICAgICAgIGlmIChydW4udGhlbikge1xyXG4gICAgICAgICAgICAgIHJ1biA9IGF3YWl0IHJ1blxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChydW4hPT1mYWxzZSkge1xyXG4gICAgICAgICAgICAgIHRfZXhlY3V0ZWQrK1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodF9leGVjdXRlZCkge1xyXG4gICAgICAgICAgICBtc2cuZXggPSB0cnVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChzaG93KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2cobXNnKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChwZW5kaW5nKSB7XHJcbiAgICAgICAgcGVuZGluZy5sb2dnZWQgKz0gMVxyXG4gICAgICAgIHBlbmRpbmdSZXF1ZXN0cy5kZWxldGUoaWQpXHJcbiAgICAgICAgY29uc3QgeyByZXNvbHZlLCByZWplY3QgfSA9IHBlbmRpbmdcclxuICAgICAgICBlcnJvciA/IHJlamVjdChlcnJvcikgOiByZXNvbHZlKHJlc3VsdCkgIFxyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGBFcnJvciBwYXJzaW5nIFdlYlNvY2tldCBtZXNzYWdlOiAke2Vycm9yfWApXHJcbiAgICB9XHJcbiAgfSAgXHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBvbm1zZ3NcclxuIiwiLy8gKipHaXRodWI6KiogaHR0cHM6Ly9naXRodWIuY29tL3RlYW1iaXRpb24vanNvbnJwYy1saXRlXG4vL1xuLy8gaHR0cDovL3d3dy5qc29ucnBjLm9yZy9zcGVjaWZpY2F0aW9uXG4vLyAqKkxpY2Vuc2U6KiogTUlUXG4ndXNlIHN0cmljdCc7XG5jb25zdCBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5jb25zdCBpc0ludGVnZXIgPSB0eXBlb2YgTnVtYmVyLmlzU2FmZUludGVnZXIgPT09ICdmdW5jdGlvbidcbiAgICA/IE51bWJlci5pc1NhZmVJbnRlZ2VyIC8vIEVDTUFTY3JpcHQgMjAxNVxuICAgIDogZnVuY3Rpb24gKG51bSkge1xuICAgICAgICByZXR1cm4gdHlwZW9mIG51bSA9PT0gJ251bWJlcicgJiYgaXNGaW5pdGUobnVtKSAmJiBudW0gPT09IE1hdGguZmxvb3IobnVtKSAmJiBNYXRoLmFicyhudW0pIDw9IDkwMDcxOTkyNTQ3NDA5OTE7XG4gICAgfTtcbmV4cG9ydCBjbGFzcyBKc29uUnBjIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5qc29ucnBjID0gJzIuMCc7XG4gICAgfVxuICAgIHNlcmlhbGl6ZSgpIHtcbiAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMpO1xuICAgIH1cbn1cbkpzb25ScGMuVkVSU0lPTiA9ICcyLjAnO1xuZXhwb3J0IGNsYXNzIFJlcXVlc3RPYmplY3QgZXh0ZW5kcyBKc29uUnBjIHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgbWV0aG9kLCBwYXJhbXMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgaWYgKHBhcmFtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb25PYmplY3QgZXh0ZW5kcyBKc29uUnBjIHtcbiAgICBjb25zdHJ1Y3RvcihtZXRob2QsIHBhcmFtcykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IG1ldGhvZDtcbiAgICAgICAgaWYgKHBhcmFtcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtcyA9IHBhcmFtcztcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBTdWNjZXNzT2JqZWN0IGV4dGVuZHMgSnNvblJwYyB7XG4gICAgY29uc3RydWN0b3IoaWQsIHJlc3VsdCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBFcnJvck9iamVjdCBleHRlbmRzIEpzb25ScGMge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1zaGFkb3dlZC12YXJpYWJsZVxuICAgIGNvbnN0cnVjdG9yKGlkLCBlcnJvcikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuZXJyb3IgPSBlcnJvcjtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmVycm9yID0gZXJyb3I7XG4gICAgfVxufVxuZXhwb3J0IGNsYXNzIEpzb25ScGNQYXJzZWQge1xuICAgIGNvbnN0cnVjdG9yKHBheWxvYWQsIHR5cGUpIHtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB9XG59XG4vKipcbiAqIEpzb25ScGNFcnJvciBDbGFzc1xuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gbWVzc2FnZVxuICogQHBhcmFtICB7SW50ZWdlcn0gY29kZVxuICogQHJldHVybiB7U3RyaW5nfSBuYW1lOiBvcHRpb25hbFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGNsYXNzIEpzb25ScGNFcnJvciB7XG4gICAgY29uc3RydWN0b3IobWVzc2FnZSwgY29kZSwgZGF0YSkge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgICAgICB0aGlzLmNvZGUgPSBpc0ludGVnZXIoY29kZSkgPyBjb2RlIDogMDtcbiAgICAgICAgaWYgKGRhdGEgIT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgfVxuICAgIH1cbn1cbkpzb25ScGNFcnJvci5pbnZhbGlkUmVxdWVzdCA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgcmV0dXJuIG5ldyBKc29uUnBjRXJyb3IoJ0ludmFsaWQgcmVxdWVzdCcsIC0zMjYwMCwgZGF0YSk7XG59O1xuSnNvblJwY0Vycm9yLm1ldGhvZE5vdEZvdW5kID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICByZXR1cm4gbmV3IEpzb25ScGNFcnJvcignTWV0aG9kIG5vdCBmb3VuZCcsIC0zMjYwMSwgZGF0YSk7XG59O1xuSnNvblJwY0Vycm9yLmludmFsaWRQYXJhbXMgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgSnNvblJwY0Vycm9yKCdJbnZhbGlkIHBhcmFtcycsIC0zMjYwMiwgZGF0YSk7XG59O1xuSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgSnNvblJwY0Vycm9yKCdJbnRlcm5hbCBlcnJvcicsIC0zMjYwMywgZGF0YSk7XG59O1xuSnNvblJwY0Vycm9yLnBhcnNlRXJyb3IgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHJldHVybiBuZXcgSnNvblJwY0Vycm9yKCdQYXJzZSBlcnJvcicsIC0zMjcwMCwgZGF0YSk7XG59O1xuLyoqXG4gKiBDcmVhdGVzIGEgSlNPTi1SUEMgMi4wIHJlcXVlc3Qgb2JqZWN0XG4gKlxuICogQHBhcmFtICB7U3RyaW5nfEludGVnZXJ9IGlkXG4gKiBAcGFyYW0gIHtTdHJpbmd9IG1ldGhvZFxuICogQHBhcmFtICB7T2JqZWN0fEFycmF5fSBbcGFyYW1zXTogb3B0aW9uYWxcbiAqIEByZXR1cm4ge09iamVjdH0gSnNvblJwYyBvYmplY3RcbiAqIEBhcGkgcHVibGljXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0KGlkLCBtZXRob2QsIHBhcmFtcykge1xuICAgIGNvbnN0IG9iamVjdCA9IG5ldyBSZXF1ZXN0T2JqZWN0KGlkLCBtZXRob2QsIHBhcmFtcyk7XG4gICAgdmFsaWRhdGVNZXNzYWdlKG9iamVjdCwgdHJ1ZSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIEpTT04tUlBDIDIuMCBub3RpZmljYXRpb24gb2JqZWN0XG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSBtZXRob2RcbiAqIEBwYXJhbSAge09iamVjdHxBcnJheX0gW3BhcmFtc106IG9wdGlvbmFsXG4gKiBAcmV0dXJuIHtPYmplY3R9IEpzb25ScGMgb2JqZWN0XG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gbm90aWZpY2F0aW9uKG1ldGhvZCwgcGFyYW1zKSB7XG4gICAgY29uc3Qgb2JqZWN0ID0gbmV3IE5vdGlmaWNhdGlvbk9iamVjdChtZXRob2QsIHBhcmFtcyk7XG4gICAgdmFsaWRhdGVNZXNzYWdlKG9iamVjdCwgdHJ1ZSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cbi8qKlxuICogQ3JlYXRlcyBhIEpTT04tUlBDIDIuMCBzdWNjZXNzIHJlc3BvbnNlIG9iamVjdFxuICpcbiAqIEBwYXJhbSAge1N0cmluZ3xJbnRlZ2VyfSBpZFxuICogQHBhcmFtICB7TWl4ZWR9IHJlc3VsdFxuICogQHJldHVybiB7T2JqZWN0fSBKc29uUnBjIG9iamVjdFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN1Y2Nlc3MoaWQsIHJlc3VsdCkge1xuICAgIGNvbnN0IG9iamVjdCA9IG5ldyBTdWNjZXNzT2JqZWN0KGlkLCByZXN1bHQpO1xuICAgIHZhbGlkYXRlTWVzc2FnZShvYmplY3QsIHRydWUpO1xuICAgIHJldHVybiBvYmplY3Q7XG59XG4vKipcbiAqIENyZWF0ZXMgYSBKU09OLVJQQyAyLjAgZXJyb3IgcmVzcG9uc2Ugb2JqZWN0XG4gKlxuICogQHBhcmFtICB7U3RyaW5nfEludGVnZXJ9IGlkXG4gKiBAcGFyYW0gIHtPYmplY3R9IEpzb25ScGNFcnJvciBlcnJvclxuICogQHJldHVybiB7T2JqZWN0fSBKc29uUnBjIG9iamVjdFxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVycm9yKGlkLCBlcnIpIHtcbiAgICBjb25zdCBvYmplY3QgPSBuZXcgRXJyb3JPYmplY3QoaWQsIGVycik7XG4gICAgdmFsaWRhdGVNZXNzYWdlKG9iamVjdCwgdHJ1ZSk7XG4gICAgcmV0dXJuIG9iamVjdDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShtZXNzYWdlKSB7XG4gICAgaWYgKCFpc1N0cmluZyhtZXNzYWdlKSkge1xuICAgICAgICByZXR1cm4gbmV3IEpzb25ScGNQYXJzZWQoSnNvblJwY0Vycm9yLmludmFsaWRSZXF1ZXN0KG1lc3NhZ2UpLCBcImludmFsaWRcIiAvKiBpbnZhbGlkICovKTtcbiAgICB9XG4gICAgbGV0IGpzb25ycGNPYmo7XG4gICAgdHJ5IHtcbiAgICAgICAganNvbnJwY09iaiA9IEpTT04ucGFyc2UobWVzc2FnZSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBKc29uUnBjUGFyc2VkKEpzb25ScGNFcnJvci5wYXJzZUVycm9yKG1lc3NhZ2UpLCBcImludmFsaWRcIiAvKiBpbnZhbGlkICovKTtcbiAgICB9XG4gICAgcmV0dXJuIHBhcnNlSnNvblJwY09iamVjdChqc29ucnBjT2JqKTtcbn1cbi8qKlxuICogVGFrZXMgYSBKU09OLVJQQyAyLjAgcGF5bG9hZCAoT2JqZWN0KSBvciBiYXRjaCAoT2JqZWN0W10pIGFuZCB0cmllcyB0byBwYXJzZSBpdC5cbiAqIElmIHN1Y2Nlc3NmdWwsIGRldGVybWluZSB3aGF0IG9iamVjdHMgYXJlIGluc2lkZSAocmVzcG9uc2UsIG5vdGlmaWNhdGlvbixcbiAqIHN1Y2Nlc3MsIGVycm9yLCBvciBpbnZhbGlkKSwgYW5kIHJldHVybiB0aGVpciB0eXBlcyBhbmQgcHJvcGVybHkgZm9ybWF0dGVkIG9iamVjdHMuXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fEFycmF5fSBqc29ucnBjT2JqXG4gKiBAcmV0dXJuIHtPYmplY3R8QXJyYXl9IGEgc2luZ2xlIG9iamVjdCBvciBhbiBhcnJheSBvZiBgSnNvblJwY1BhcnNlZGAgb2JqZWN0cyB3aXRoIGB0eXBlYCBhbmQgYHBheWxvYWRgOlxuICpcbiAqICB7XG4gKiAgICB0eXBlOiA8RW51bSwgJ3JlcXVlc3QnfCdub3RpZmljYXRpb24nfCdzdWNjZXNzJ3wnZXJyb3InfCdpbnZhbGlkJz5cbiAqICAgIHBheWxvYWQ6IDxKc29uUnBjfEpzb25ScGNFcnJvcj5cbiAqICB9XG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSnNvblJwY09iamVjdChqc29ucnBjT2JqKSB7XG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGpzb25ycGNPYmopKSB7XG4gICAgICAgIHJldHVybiBwYXJzZU9iamVjdChqc29ucnBjT2JqKTtcbiAgICB9XG4gICAgaWYgKGpzb25ycGNPYmoubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgSnNvblJwY1BhcnNlZChKc29uUnBjRXJyb3IuaW52YWxpZFJlcXVlc3QoanNvbnJwY09iaiksIFwiaW52YWxpZFwiIC8qIGludmFsaWQgKi8pO1xuICAgIH1cbiAgICBjb25zdCBwYXJzZWRPYmplY3RBcnJheSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBqc29ucnBjT2JqLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHBhcnNlZE9iamVjdEFycmF5W2ldID0gcGFyc2VPYmplY3QoanNvbnJwY09ialtpXSk7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZWRPYmplY3RBcnJheTtcbn1cbi8qKlxuICogQWxpYXMgZm9yIGBwYXJzZWAgbWV0aG9kLlxuICogVGFrZXMgYSBKU09OLVJQQyAyLjAgcGF5bG9hZCAoU3RyaW5nKSBhbmQgdHJpZXMgdG8gcGFyc2UgaXQgaW50byBhIEpTT04uXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgY29uc3QgcGFyc2VKc29uUnBjU3RyaW5nID0gcGFyc2U7XG4vKipcbiAqIFRha2VzIGEgSlNPTi1SUEMgMi4wIHBheWxvYWQgKE9iamVjdCkgYW5kIHRyaWVzIHRvIHBhcnNlIGl0IGludG8gYSBKU09OLlxuICogSWYgc3VjY2Vzc2Z1bCwgZGV0ZXJtaW5lIHdoYXQgb2JqZWN0IGlzIGl0IChyZXNwb25zZSwgbm90aWZpY2F0aW9uLFxuICogc3VjY2VzcywgZXJyb3IsIG9yIGludmFsaWQpLCBhbmQgcmV0dXJuIGl0J3MgdHlwZSBhbmQgcHJvcGVybHkgZm9ybWF0dGVkIG9iamVjdC5cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9ialxuICogQHJldHVybiB7T2JqZWN0fSBhbiBgSnNvblJwY1BhcnNlZGAgb2JqZWN0IHdpdGggYHR5cGVgIGFuZCBgcGF5bG9hZGA6XG4gKlxuICogIHtcbiAqICAgIHR5cGU6IDxFbnVtLCAncmVxdWVzdCd8J25vdGlmaWNhdGlvbid8J3N1Y2Nlc3MnfCdlcnJvcid8J2ludmFsaWQnPlxuICogICAgcGF5bG9hZDogPEpzb25ScGN8SnNvblJwY0Vycm9yPlxuICogIH1cbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VPYmplY3Qob2JqKSB7XG4gICAgbGV0IGVyciA9IG51bGw7XG4gICAgbGV0IHBheWxvYWQgPSBudWxsO1xuICAgIGxldCBwYXlsb2FkVHlwZSA9IFwiaW52YWxpZFwiIC8qIGludmFsaWQgKi87XG4gICAgaWYgKG9iaiA9PSBudWxsIHx8IG9iai5qc29ucnBjICE9PSBKc29uUnBjLlZFUlNJT04pIHtcbiAgICAgICAgZXJyID0gSnNvblJwY0Vycm9yLmludmFsaWRSZXF1ZXN0KG9iaik7XG4gICAgICAgIHBheWxvYWRUeXBlID0gXCJpbnZhbGlkXCIgLyogaW52YWxpZCAqLztcbiAgICB9XG4gICAgZWxzZSBpZiAoIWhhc093blByb3BlcnR5LmNhbGwob2JqLCAnaWQnKSkge1xuICAgICAgICBjb25zdCB0bXAgPSBvYmo7XG4gICAgICAgIHBheWxvYWQgPSBuZXcgTm90aWZpY2F0aW9uT2JqZWN0KHRtcC5tZXRob2QsIHRtcC5wYXJhbXMpO1xuICAgICAgICBlcnIgPSB2YWxpZGF0ZU1lc3NhZ2UocGF5bG9hZCk7XG4gICAgICAgIHBheWxvYWRUeXBlID0gXCJub3RpZmljYXRpb25cIiAvKiBub3RpZmljYXRpb24gKi87XG4gICAgfVxuICAgIGVsc2UgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCAnbWV0aG9kJykpIHtcbiAgICAgICAgY29uc3QgdG1wID0gb2JqO1xuICAgICAgICBwYXlsb2FkID0gbmV3IFJlcXVlc3RPYmplY3QodG1wLmlkLCB0bXAubWV0aG9kLCB0bXAucGFyYW1zKTtcbiAgICAgICAgZXJyID0gdmFsaWRhdGVNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICBwYXlsb2FkVHlwZSA9IFwicmVxdWVzdFwiIC8qIHJlcXVlc3QgKi87XG4gICAgfVxuICAgIGVsc2UgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCAncmVzdWx0JykpIHtcbiAgICAgICAgY29uc3QgdG1wID0gb2JqO1xuICAgICAgICBwYXlsb2FkID0gbmV3IFN1Y2Nlc3NPYmplY3QodG1wLmlkLCB0bXAucmVzdWx0KTtcbiAgICAgICAgZXJyID0gdmFsaWRhdGVNZXNzYWdlKHBheWxvYWQpO1xuICAgICAgICBwYXlsb2FkVHlwZSA9IFwic3VjY2Vzc1wiIC8qIHN1Y2Nlc3MgKi87XG4gICAgfVxuICAgIGVsc2UgaWYgKGhhc093blByb3BlcnR5LmNhbGwob2JqLCAnZXJyb3InKSkge1xuICAgICAgICBjb25zdCB0bXAgPSBvYmo7XG4gICAgICAgIHBheWxvYWRUeXBlID0gXCJlcnJvclwiIC8qIGVycm9yICovO1xuICAgICAgICBpZiAodG1wLmVycm9yID09IG51bGwpIHtcbiAgICAgICAgICAgIGVyciA9IEpzb25ScGNFcnJvci5pbnRlcm5hbEVycm9yKHRtcCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvck9iaiA9IG5ldyBKc29uUnBjRXJyb3IodG1wLmVycm9yLm1lc3NhZ2UsIHRtcC5lcnJvci5jb2RlLCB0bXAuZXJyb3IuZGF0YSk7XG4gICAgICAgICAgICBpZiAoZXJyb3JPYmoubWVzc2FnZSAhPT0gdG1wLmVycm9yLm1lc3NhZ2UgfHwgZXJyb3JPYmouY29kZSAhPT0gdG1wLmVycm9yLmNvZGUpIHtcbiAgICAgICAgICAgICAgICBlcnIgPSBKc29uUnBjRXJyb3IuaW50ZXJuYWxFcnJvcih0bXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGF5bG9hZCA9IG5ldyBFcnJvck9iamVjdCh0bXAuaWQsIGVycm9yT2JqKTtcbiAgICAgICAgICAgICAgICBlcnIgPSB2YWxpZGF0ZU1lc3NhZ2UocGF5bG9hZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGVyciA9PSBudWxsICYmIHBheWxvYWQgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbmV3IEpzb25ScGNQYXJzZWQocGF5bG9hZCwgcGF5bG9hZFR5cGUpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IEpzb25ScGNQYXJzZWQoZXJyICE9IG51bGwgPyBlcnIgOiBKc29uUnBjRXJyb3IuaW52YWxpZFJlcXVlc3Qob2JqKSwgXCJpbnZhbGlkXCIgLyogaW52YWxpZCAqLyk7XG59XG4vLyBpZiBlcnJvciwgcmV0dXJuIGVycm9yLCBlbHNlIHJldHVybiBudWxsXG5mdW5jdGlvbiB2YWxpZGF0ZU1lc3NhZ2Uob2JqLCB0aHJvd0l0KSB7XG4gICAgbGV0IGVyciA9IG51bGw7XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIFJlcXVlc3RPYmplY3QpIHtcbiAgICAgICAgZXJyID0gY2hlY2tJZChvYmouaWQpO1xuICAgICAgICBpZiAoZXJyID09IG51bGwpIHtcbiAgICAgICAgICAgIGVyciA9IGNoZWNrTWV0aG9kKG9iai5tZXRob2QpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlcnIgPT0gbnVsbCkge1xuICAgICAgICAgICAgZXJyID0gY2hlY2tQYXJhbXMob2JqLnBhcmFtcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgTm90aWZpY2F0aW9uT2JqZWN0KSB7XG4gICAgICAgIGVyciA9IGNoZWNrTWV0aG9kKG9iai5tZXRob2QpO1xuICAgICAgICBpZiAoZXJyID09IG51bGwpIHtcbiAgICAgICAgICAgIGVyciA9IGNoZWNrUGFyYW1zKG9iai5wYXJhbXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIFN1Y2Nlc3NPYmplY3QpIHtcbiAgICAgICAgZXJyID0gY2hlY2tJZChvYmouaWQpO1xuICAgICAgICBpZiAoZXJyID09IG51bGwpIHtcbiAgICAgICAgICAgIGVyciA9IGNoZWNrUmVzdWx0KG9iai5yZXN1bHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIEVycm9yT2JqZWN0KSB7XG4gICAgICAgIGVyciA9IGNoZWNrSWQob2JqLmlkLCB0cnVlKTtcbiAgICAgICAgaWYgKGVyciA9PSBudWxsKSB7XG4gICAgICAgICAgICBlcnIgPSBjaGVja0Vycm9yKG9iai5lcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRocm93SXQgJiYgZXJyICE9IG51bGwpIHtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgIH1cbiAgICByZXR1cm4gZXJyO1xufVxuZnVuY3Rpb24gY2hlY2tJZChpZCwgbWF5YmVOdWxsKSB7XG4gICAgaWYgKG1heWJlTnVsbCAmJiBpZCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGlzU3RyaW5nKGlkKSB8fCBpc0ludGVnZXIoaWQpXG4gICAgICAgID8gbnVsbFxuICAgICAgICA6IEpzb25ScGNFcnJvci5pbnRlcm5hbEVycm9yKCdcImlkXCIgbXVzdCBiZSBwcm92aWRlZCwgYSBzdHJpbmcgb3IgYW4gaW50ZWdlci4nKTtcbn1cbmZ1bmN0aW9uIGNoZWNrTWV0aG9kKG1ldGhvZCkge1xuICAgIHJldHVybiBpc1N0cmluZyhtZXRob2QpID8gbnVsbCA6IEpzb25ScGNFcnJvci5pbnZhbGlkUmVxdWVzdChtZXRob2QpO1xufVxuZnVuY3Rpb24gY2hlY2tSZXN1bHQocmVzdWx0KSB7XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IoJ1Jlc3VsdCBtdXN0IGV4aXN0IGZvciBzdWNjZXNzIFJlc3BvbnNlIG9iamVjdHMnKVxuICAgICAgICA6IG51bGw7XG59XG5mdW5jdGlvbiBjaGVja1BhcmFtcyhwYXJhbXMpIHtcbiAgICBpZiAocGFyYW1zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChBcnJheS5pc0FycmF5KHBhcmFtcykgfHwgaXNPYmplY3QocGFyYW1zKSkge1xuICAgICAgICAvLyBlbnN1cmUgcGFyYW1zIGNhbiBiZSBzdHJpbmdpZnlcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHBhcmFtcyk7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICByZXR1cm4gSnNvblJwY0Vycm9yLnBhcnNlRXJyb3IocGFyYW1zKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSnNvblJwY0Vycm9yLmludmFsaWRQYXJhbXMocGFyYW1zKTtcbn1cbmZ1bmN0aW9uIGNoZWNrRXJyb3IoZXJyKSB7XG4gICAgaWYgKCEoZXJyIGluc3RhbmNlb2YgSnNvblJwY0Vycm9yKSkge1xuICAgICAgICByZXR1cm4gSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IoJ0Vycm9yIG11c3QgYmUgYW4gaW5zdGFuY2Ugb2YgSnNvblJwY0Vycm9yJyk7XG4gICAgfVxuICAgIGlmICghaXNJbnRlZ2VyKGVyci5jb2RlKSkge1xuICAgICAgICByZXR1cm4gSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IoJ0ludmFsaWQgZXJyb3IgY29kZS4gSXQgbXVzdCBiZSBhbiBpbnRlZ2VyLicpO1xuICAgIH1cbiAgICBpZiAoIWlzU3RyaW5nKGVyci5tZXNzYWdlKSkge1xuICAgICAgICByZXR1cm4gSnNvblJwY0Vycm9yLmludGVybmFsRXJyb3IoJ01lc3NhZ2UgbXVzdCBleGlzdCBvciBtdXN0IGJlIGEgc3RyaW5nLicpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIGlzU3RyaW5nKG9iaikge1xuICAgIHJldHVybiBvYmogIT09ICcnICYmIHR5cGVvZiBvYmogPT09ICdzdHJpbmcnO1xufVxuZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAhPSBudWxsICYmIHR5cGVvZiBvYmogPT09ICdvYmplY3QnICYmICFBcnJheS5pc0FycmF5KG9iaik7XG59XG5jb25zdCBqc29ucnBjID0ge1xuICAgIEpzb25ScGMsXG4gICAgSnNvblJwY0Vycm9yLFxuICAgIHJlcXVlc3QsXG4gICAgbm90aWZpY2F0aW9uLFxuICAgIHN1Y2Nlc3MsXG4gICAgZXJyb3IsXG4gICAgcGFyc2UsXG4gICAgcGFyc2VPYmplY3QsXG4gICAgcGFyc2VKc29uUnBjT2JqZWN0LFxuICAgIHBhcnNlSnNvblJwY1N0cmluZyxcbn07XG5leHBvcnQgZGVmYXVsdCBqc29ucnBjO1xuZXhwb3J0IHsganNvbnJwYyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9anNvbnJwYy5qcy5tYXAiLCJjb25zdCBycGMgPSByZXF1aXJlKCdqc29ucnBjLWxpdGUnKVxyXG5jb25zdCBsb2cgPSByZXF1aXJlKCcuL19sb2cnIClcclxuXHJcbi8vIEhlbHBlciBmdW5jdGlvbiB0byBnZW5lcmF0ZSB1bmlxdWUgcmVxdWVzdCBJRHNcclxuY29uc3QgdDY0ID0gJ1dhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODlBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmgnXHJcbmNvbnN0IG5hbm9pZCA9IChzaXplID0gOCkgPT4ge1xyXG4gIGxldCBpZCA9ICcnXHJcbiAgd2hpbGUgKHNpemUtLSA+IDApIHtcclxuICAgIGlkICs9IHQ2NFtNYXRoLnJhbmRvbSgpICogNjQgfCAwXVxyXG4gIH1cclxuICByZXR1cm4gaWRcclxufVxyXG5cclxuZnVuY3Rpb24gb25vcGVuKHdzKSB7XHJcbiAgY29uc3Qge3BlbmRpbmdSZXF1ZXN0c309IHdzXHJcbiAgLy8gSGVscGVyIGZ1bmN0aW9uIHRvIHNlbmQgYSBKU09OLVJQQyByZXF1ZXN0IG92ZXIgdGhlIFdlYlNvY2tldFxyXG4gIGZ1bmN0aW9uIHNlbmRSZXF1ZXN0KG1ldGhvZCwgcGFyYW1zKSB7XHJcbiAgICBsZXQgaWQgPSBuYW5vaWQoKVxyXG4gICAgY29uc3QgYXJyID0gcGFyYW1zLnNsaWNlKC0xKVxyXG4gICAgY29uc3QgcmVxID0gcnBjLnJlcXVlc3QoaWQsIG1ldGhvZCwgcGFyYW1zKVxyXG4gICAgaWYgKC8oXmFwaVxcLnxcXC5hcGlfKS8udGVzdChtZXRob2QpKSB7XHJcbiAgICAgIGlmIChhcnJbMF09PT0nLScpIHtcclxuICAgICAgICBwYXJhbXMucG9wKClcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXEuYnJvYWRjYXN0ID0gdHJ1ZSAvLyBicm9hZGNhc3QgY2FsbFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB3cy5zZW5kKEpTT04uc3RyaW5naWZ5KHJlcSkpXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAvLyBTdG9yZSB0aGUgcmVxdWVzdCBJRCBhbmQgcmVzb2x2ZS9yZWplY3QgZnVuY3Rpb25zIGluIHRoZSBwZW5kaW5nIHJlcXVlc3RzIE1hcFxyXG4gICAgICBwZW5kaW5nUmVxdWVzdHMuc2V0KGlkLCB7IHJlc29sdmUsIHJlamVjdCwgbWV0aG9kLCBwYXJhbXMsIGxvZ2dlZDogMH0pXHJcbiAgICB9KVxyXG4gIH1cclxuICB3aW5kb3cuc2VuZFJlcXVlc3QgPSBzZW5kUmVxdWVzdFxyXG5cclxuICAvLyBFeGFtcGxlIHVzYWdlIHdpdGggYXN5bmMvYXdhaXQgYW5kIFByb21pc2UuYWxsKClcclxuICBhc3luYyBmdW5jdGlvbiBwcm9taXNlQWxsQ2xpZW50KCkge1xyXG4gICAgLy8jIGNsaWVudCBjb2RlXHJcbiAgICB0cnkge1xyXG4gICAgICBjb25zdCBhbGwgPSBhd2FpdCBQcm9taXNlLmFsbChbXHJcbiAgICAgICAgc2VuZFJlcXVlc3QoJ2FwaWRlbW8uZGVtb19hZGQnLCBbeyB2YWx1ZTogMSB9XSksXHJcbiAgICAgICAgc2VuZFJlcXVlc3QoJ2FwaWRlbW8uZGVtb19hZGQnLCBbeyB2YWx1ZTogMiB9XSksXHJcbiAgICAgICAgc2VuZFJlcXVlc3QoJ2FwaWRlbW8uZGVtb19hZGQnLCBbeyB2YWx1ZTogMyB9XSksXHJcbiAgICAgIF0pXHJcbiAgICAgIGNvbnNvbGUubG9nKGBHb3QgZGF0YTogJHtKU09OLnN0cmluZ2lmeShhbGwpfWApXHJcbiAgICAgIHJldHVybiBhbGxcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoYEVycm9yIGdldHRpbmcgZGF0YTpgLCBlcnJvcilcclxuICAgICAgcmV0dXJuIGVycm9yXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB3cy5vbm9wZW4gPSBhc3luYyBkYXRhID0+IHtcclxuICAgIGNvbnNvbGUubG9nKCdXZWJzb2NrZXQgb3Blbi4uLicpXHJcbiAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgIGlmICh3aW5kb3cuUlBDLl9vYmpfPy5hcmd2Py5kZXZtb2RlKSB7XHJcbiAgICAgICAgaWYgKCF3aW5kb3cuUlBDLmFwaXRlc3QpIHtcclxuICAgICAgICAgIHdpbmRvdy5SUEMuYXBpdGVzdCA9IHt9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdpbmRvdy5SUEMuYXBpdGVzdC5wcm9taXNlQWxsQ2xpZW50ID0gcHJvbWlzZUFsbENsaWVudFxyXG4gICAgICAgIC8vIGZvciAoY29uc3QgazEgaW4gd2luZG93LlJQQykge1xyXG4gICAgICAgIC8vICAgaWYgKCEvXl8uK18kLy50ZXN0KGsxKSkge1xyXG4gICAgICAgIC8vICAgICB3aW5kb3cuUlBDW2sxXS5sb2cgPSBsb2dcclxuICAgICAgICAvLyAgIH1cclxuICAgICAgICAvLyB9ICBcclxuICAgICAgfSAgXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IG9ub3BlblxyXG4iLCJjb25zdCBpbml0X3dzID0gcmVxdWlyZSgnLi9pbml0LXdzJylcbmNvbnN0IG9ubXNncyAgPSByZXF1aXJlKCcuL29ubXNncycpXG5jb25zdCBvbm9wZW4gID0gcmVxdWlyZSgnLi9vbm9wZW4nKVxuXG5jb25zdCB3cyA9IGluaXRfd3MoKVxub25tc2dzKHdzKVxub25vcGVuKHdzKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdzIl0sIm5hbWVzIjpbIm9ubXNncyIsIm9ub3BlbiIsInJlcXVpcmUkJDAiLCJyZXF1aXJlJCQxIiwicmVxdWlyZSQkMiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBQUEsTUFBTSxLQUFLLEdBQUc7Q0FDZCxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztDQUM5QyxFQUFFLE1BQU0sR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLFFB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
