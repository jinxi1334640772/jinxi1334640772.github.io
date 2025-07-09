# Payment Request API 开发指南

Payment Request API 为商家和支付者提供了统一的用户体验，简化了 Web 支付流程。本文档详细介绍了 Payment Request API 和 Payment Handler API 的使用方法和最佳实践。

## 目录导航

1. [Payment Request API 概述](#1-payment-request-api-概述)
2. [API 优势特性](#2-api-优势特性)
3. [PaymentRequest 对象](#3-paymentrequest-对象)
4. [PaymentResponse 对象](#4-paymentresponse-对象)
5. [Payment Handler API](#5-payment-handler-api)
6. [支付清单配置](#6-支付清单配置)
7. [支付流程实现](#7-支付流程实现)
8. [Service Worker 处理](#8-service-worker-处理)
9. [支付应用管理](#9-支付应用管理)

## 1. Payment Request API 概述

Payment Request API 是一种标准化的 Web 支付解决方案，它并非提供一种新的支付方式，而是让用户可以在原有的支付方式中进行选择，并使商家可以获悉用户的支付情况。

### 1.1 核心概念

Payment Request API 通过浏览器提供统一的支付界面，简化了在线支付流程，提升了用户体验和支付安全性。

## 2. API 优势特性

### 2.1 用户体验优势

使用支付请求 API 中"保存卡信息并自动扣款"（使用银行卡支付时）的优点：

- **快捷的购买体验**：用户在浏览器上只需输入一次银行卡信息，之后便可一键对网络上提供的商品和服务进行支付。即使在不同的站点购物，他们也不需要反复填写相同的支付信息。

- **跨站点的统一用户体验**：仅指支持此 API 的站点，浏览器统一控制支付页面，使定制化内容得以实现。可以定制的内容包括语言的本地化。

- **无障碍体验**：支付页面中的表单元素由浏览器控制，使得键盘输入和屏幕朗读在跨站点时也能以统一的方式工作，且不需要开发者的额外开发。浏览器也可以对支付页面中的字体大小、颜色对比度进行同一调节，使用户在支付过程中获得更加舒适的体验。

- **认证管理**：用户可以直接通过浏览器管理自己的信用卡和收件地址，且浏览器可以在不同设备间同步这些"认证信息"。这样，用户就能在购物时灵活地在电脑和移动设备间来回切换。

- **统一的异常信息处理**：浏览器可以检查信用卡卡号的有效性，并在卡片已经（或即将）过期时告知用户。浏览器可以通过用户过去的使用习惯和商家的支付规则（例如，"我们只支持 Visa 或 Mastercard"）自动对此次交易使用卡片的选择提出建议。用户还可以自行设置默认/最偏好的卡片。

## 3. PaymentRequest 对象

### 3.1 属性说明

PaymentRequest 对象包含以下核心属性：

| 属性 | 类型 | 描述 |
|------|------|------|
| `id` | string | 唯一标识符 |
| `shippingAddress` | PaymentAddress | 计算运费而选择的送货地址 |
| `shippingOption` | string | 所选配送选项的标识符 |
| `shippingType` | string | 完成交易的发货类型：shipping、delivery、pickup、null |

### 3.2 方法说明

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `canMakePayment()` | Promise&lt;boolean&gt; | 检查是否可以在调用 PaymentRequest.show() 之前进行付款 |
| `show()` | Promise&lt;PaymentResponse&gt; | 使用户代理开始与付款请求进行用户交互 |
| `abort()` | Promise&lt;void&gt; | 使用户代理结束付款请求并删除可能显示的任何用户界面 |

### 3.3 事件处理

| 事件 | 描述 |
|------|------|
| `paymentmethodchange` | 用户更改付款方式时触发 |

## 4. PaymentResponse 对象

### 4.1 属性说明

PaymentResponse 对象包含以下属性：

| 属性 | 类型 | 描述 |
|------|------|------|
| `requestId` | string | 生成当前响应的 PaymentRequest 的标识符 |
| `shippingAddress` | PaymentAddress | 计算运费而选择的送货地址 |
| `shippingOption` | string | 用户选择的发货选项的 ID 属性 |
| `details` | object | 处理交易和确定资金转账成功的支付方式特定消息 |
| `methodName` | string | 用户选择的付款方式的付款方式标识符，例如 Visa、Mastercard、PayPal 等 |
| `payerEmail` | string | 支付者邮箱地址 |
| `payerName` | string | 支付者姓名 |
| `payerPhone` | string | 支付者电话号码 |

### 4.2 方法说明

| 方法 | 返回值 | 描述 |
|------|--------|------|
| `retry()` | Promise&lt;void&gt; | 如果付款响应的数据有问题（并且存在可恢复的错误），此方法允许商家请求用户重试付款 |
| `complete()` | Promise&lt;void&gt; | 通知用户代理用户交互已结束。这将导致关闭任何剩余的用户界面 |
| `toJSON()` | object | 返回表示此对象的 JSON 对象 |

### 4.3 事件处理

| 事件 | 描述 |
|------|------|
| `payerdetailchange` | 当用户在填写付款申请表时更改其个人信息时触发 |

## 5. Payment Handler API

### 5.1 概述

Payment Handler API 为 Web 应用程序提供了一组标准化的功能，用于直接处理付款，而不必重定向到单独的站点进行付款处理。

### 5.2 工作原理

当商家网站通过 Payment Request API 发起付款时，Payment Handler API 会处理适用的支付应用的发现，将其作为选项呈现给用户，在选择允许用户输入其支付详细信息后打开支付处理程序窗口，并使用支付应用处理支付交易。

与支付应用程序的通信（授权、支付凭证的传递）通过 Service Workers 处理。

### 5.3 基本使用方法

```javascript
/**
 * 通过构建新的 PaymentRequest 对象来启动支付请求
 * @param {Array} methodData - 包含有关支付提供商的信息的对象，例如支持哪些支付方式等
 * @param {Object} details - 包含有关特定付款的信息的对象，例如总付款金额、税金、运费等
 * @param {Object} options - （可选）包含与付款相关的其他选项的对象
 * @returns {PaymentRequest} PaymentRequest 实例
 */
const request = new PaymentRequest(
  [
    { supportedMethods: "https://alicebucks.dev/pay" },
    { supportedMethods: "https://bobbucks.dev/pay" },
  ],
  {
    id: "order-123",
    displayItems: [
      {
        label: "Example item",
        amount: { currency: "USD", value: "10.00" },
      },
    ],
    total: {
      label: "total",
      amount: { value: "10", currency: "USD" },
    },
  }
);
```

## 6. 支付清单配置

### 6.1 支付方式清单

从每个支付方式 supportedMethods URL 获取付款方式清单 payment-manifest.json，通常应按以下方式构建：

```json
{
  // 使用 BobBucks 付款方式的默认支付应用程序
  "default_applications": ["https://bobbucks.dev/manifest.json"],
  // 允许哪些其他支付应用程序处理 BobBucks 付款
  "supported_origins": ["https://alicepay.friendsofalice.example"]
}
```

### 6.2 Web 应用程序清单

从付款方式清单中，浏览器获取默认支付应用的 Web 应用程序清单文件的 URL：

```json
{
  "name": "Pay with BobBucks",
  "short_name": "BobBucks",
  "description": "This is an example of the Payment Handler API.",
  "icons": [
    {
      "src": "images/manifest/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "images/manifest/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "serviceworker": {
    "src": "service-worker.js",
    "scope": "/",
    "use_cache": false
  },
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3f51b5",
  "background_color": "#3f51b5",
  "related_applications": [
    {
      "platform": "play",
      "id": "com.example.android.samplepay",
      "min_version": "1",
      "fingerprints": [
        {
          "type": "sha256_cert",
          "value": "4C:FC:14:C6:97:DE:66:4E:66:97:50:C0:24:CE:5F:27:00:92:EE:F3:7F:18:B3:DA:77:66:84:CD:9D:E9:D2:CB"
        }
      ]
    }
  ]
}
```

> **注意**：如果在支付应用程序清单中将 `prefer_related_applications` 设置为 `true`，则浏览器将启动 `related_applications` 中指定的特定于平台的支付应用程序来处理付款（如果可用），而不是 Web 支付应用程序。

### 6.3 支付应用选择

如果有多个支付应用程序选项，则会向用户显示一个选项列表供他们选择。如果只有一个支付应用选项，将使用此支付应用启动支付流程。

当商家选择某个支付应用程序，将调用 `PaymentRequest.show()` 方法，浏览器会使用每个清单中找到的名称和图标信息，在 UI 中向用户显示付款应用程序。

## 7. 支付流程实现

### 7.1 完整的支付请求实现

```javascript
/**
 * 支付请求处理函数
 */
async function handlePaymentRequest() {
  const checkoutButton = document.getElementById("checkout-button");
  
  // 自定义付款按钮状态
  checkoutButton.innerText = "Loading…";
  
  // 支持的支付方式配置
  const supportedMethods = [
    { supportedMethods: "https://alicebucks.dev/pay" },
    { supportedMethods: "https://bobbucks.dev/pay" },
  ];
  
  // 支付详情配置
  const details = {
    id: "order-123",
    displayItems: [
      {
        label: "Example item",
        amount: { currency: "USD", value: "10.00" },
      },
    ],
    total: {
      label: "total",
      amount: { value: "10", currency: "USD" },
    },
  };

  // 特性检查
  if (!window.PaymentRequest) {
    checkoutButton.textContent = "不支持 PaymentRequest";
    return;
  }

  // 构建 PaymentRequest 支付请求
  let request = new PaymentRequest(supportedMethods, details);
  
  try {
    // 开始付款流程之前检查对象是否能够进行付款
    const canMakePayment = await request.canMakePayment();
    
    if (!canMakePayment) {
      checkoutButton.textContent = "设置结账";
      return;
    }

    checkoutButton.textContent = "快速结账";
    
    // 支付应用程序已经准备好，则启动付款请求
    const paymentResponse = await request.show();
    
    // 表示交互已完成，可以更新用户界面以告诉用户交易已完成等
    await paymentResponse.complete("success");
    
    // 在成功付款后显示其他用户界面
    const detailsElement = document.getElementById("details");
    detailsElement.style.display = "block";
    window.scrollTo(detailsElement.getBoundingClientRect().x, 0);
    
  } catch (error) {
    if (error.name === "NotSupportedError") {
      // 如果不支持此付款方式，它将重定向到 BobPay 的注册页面
      window.location.href = "https://bobpay.xyz/#download";
    } else {
      checkoutButton.textContent = "结账失败";
      console.error("支付失败:", error);
    }
  }
  
  // show方法只会调用一次，每次需要重新生成实例
  request = new PaymentRequest(supportedMethods, details);
}

/**
 * 商家认证处理
 * 获取商家的认证密钥并传输给 complete() 事件的方法
 */
request.onmerchantvalidation = function (event) {
  event.complete(fetchValidationData(event.validationURL));
};
```

## 8. Service Worker 处理

### 8.1 支付能力检查

```javascript
/**
 * 商家网站调用 PaymentRequest 构造函数时，在支付应用程序的 Service Worker 上将触发
 * canmakepayment 事件，以检查它是否准备好处理付款
 */
self.addEventListener("canmakepayment", e => {
  e.respondWith(
    new Promise((resolve, reject) => {
      someAppSpecificLogic()
        .then(result => {
          // 使用布尔值表示它已准备好处理付款请求
          resolve(result);
        })
        .catch(error => {
          reject(error);
        });
    })
  );
});
```

### 8.2 支付请求处理

```javascript
/**
 * 处理付款：调用 PaymentRequest.show() 方法后，
 * 将在支付应用的 Service Worker 上触发 paymentrequest 事件
 */
let payment_request_event;
let resolver;
let client;

self.addEventListener("paymentrequest", async e => {
  // 判断是否有正在进行中的支付事务
  if (payment_request_event) {
    resolver.reject();
  }
  
  // 缓存该事件，用于下次判断，本次是否支付完毕
  payment_request_event = e;

  // 向客户展示支付应用程序界面，进行身份验证、选择送货地址和选项以及授权付款
  payment_request_event.openWindow();

  // 付款后将结果传回商家网站
  PaymentRequestEvent.respondWith();
});
```

## 9. 支付应用管理

### 9.1 功能管理配置

```javascript
/**
 * 管理支付应用程序功能
 * 注册支付应用程序 Service Worker 后，您可以使用 Service Worker 的 PaymentManager 实例
 * （通过 ServiceWorkerRegistration.paymentManager 访问）来管理支付应用程序功能的各个方面
 */
navigator.serviceWorker.register("serviceworker.js").then(registration => {
  // 为浏览器提供提示，以便在 Payment Handler UI 中与支付应用程序的名称和图标一起显示
  registration.paymentManager.userHint = "Card number should be 16 digits";
  
  // enableDelegations: 委托向支付应用程序提供所需支付信息的各个部分的责任，
  // 而不是从浏览器收集这些信息（例如，通过自动填充）
  registration.paymentManager
    .enableDelegations(["shippingAddress", "payerName"])
    .then(() => {
      console.log("支付委托配置成功");
    })
    .catch(error => {
      console.error("支付委托配置失败:", error);
    });
});
```

### 9.2 委托选项说明

可用的委托选项包括：

- `shippingAddress`: 委托收集用户的送货地址
- `payerName`: 委托收集支付者姓名
- `payerPhone`: 委托收集支付者电话
- `payerEmail`: 委托收集支付者邮箱

## 总结

Payment Request API 和 Payment Handler API 为现代 Web 支付提供了标准化、安全且用户友好的解决方案。通过本文档的学习，您应该能够：

1. **理解核心概念**：掌握 Payment Request API 的基本概念和工作原理
2. **配置支付清单**：正确配置支付方式和应用程序清单文件
3. **实现支付流程**：完整实现从支付请求到支付完成的整个流程
4. **处理 Service Worker**：在 Service Worker 中正确处理支付事件
5. **管理支付应用**：配置和管理支付应用程序的各种功能

这些 API 为构建现代化的 Web 支付体验提供了强大的基础，是现代前端开发中重要的技术栈之一。

### 参考资料

- [MDN Web Docs - Payment Request API](https://developer.mozilla.org/zh-CN/docs/Web/API/Payment_Request_API)
- [W3C Payment Request API 规范](https://www.w3.org/TR/payment-request/)
- [Payment Handler API 规范](https://www.w3.org/TR/payment-handler/)
- [Web 支付最佳实践](https://web.dev/payments/)
