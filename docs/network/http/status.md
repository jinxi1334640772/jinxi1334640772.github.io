
## 2XX 开头，请求成功

- 200 🆗：客户端发送给服务器的请求被正常处理并返回

## 3XX 开头，重定向

- 301 Moved Permanently：永久重定向，请求的网页已永久移动到新位置。 服务器返回此响应时，会自动将请求者转到新位置
- 302 ：临时重定向，请求的网页已临时移动到新位置。服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求
- 304 Not Modified：未修改，自从上次请求后，请求的网页未修改过。服务器返回此响应时，不会返回网页内容

## 4XX，客户端错误

- 400 Bad Request：错误请求，服务器不理解请求的语法，常见于客户端传参错误
- 401 Unauthorized：未授权，表示发送的请求需要有通过 HTTP 认证的认证信息，常见于客户端未登录
- 403 Forbidden：禁止，服务器拒绝请求，常见于客户端权限不足
- 404 Not Found：未找到，服务器找不到对应资源

## 5XX 开头，服务器错误

- 500 Inter Server Error：服务器内部错误，服务器遇到错误，无法完成请求
- 501 Not Implemented：尚未实施，服务器不具备完成请求的功能
- 502 Bad Gateway：作为网关或者代理工作的服务器尝试执行请求时，从上游服务器接收到无效的响应。
- 503 service unavailable：服务不可用，服务器目前无法使用（处于超载或停机维护状态）。通常是暂时状态。
- 504 ：网关超时。

## 所有状态码

<pre>
100 "continue"
101 "switching protocols"
102 "processing"

200 "ok"
201 "created"
202 "accepted"
203 "non-authoritative information"
204 "no content"
205 "reset content"
206 "partial content"
207 "multi-status"
208 "already reported"
226 "im used"

300 "multiple choices"
301 "moved permanently"
302 "found"
303 "see other"
304 "not modified"
305 "use proxy"
307 "temporary redirect"
308 "permanent redirect"

400 "bad request"
401 "unauthorized"
402 "payment required"
403 "forbidden"
404 "not found"
405 "method not allowed"
406 "not acceptable"
407 "proxy authentication required"
408 "request timeout"
409 "conflict"
410 "gone"
411 "length required"
412 "precondition failed"
413 "payload too large"
414 "uri too long"
415 "unsupported media type"
416 "range not satisfiable"
417 "expectation failed"
418 "I'm a teapot"
422 "unprocessable entity"
423 "locked"
424 "failed dependency"
426 "upgrade required"
428 "precondition required"
429 "too many requests"
431 "request header fields too large"

500 "internal server error"
501 "not implemented"
502 "bad gateway"
503 "service unavailable"
504 "gateway timeout"
505 "http version not supported"
506 "variant also negotiates"
507 "insufficient storage"
508 "loop detected"
510 "not extended"
511 "network authentication required"
</pre>
