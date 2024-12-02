# 加密模块 crypto

## crypto 简介

当前窗口的作用域的 Crypto 对象。此对象允许网页访问某些加密相关的服务。

虽然该属性自身是只读的，但它的所有方法（以及其子对象 SubtleCrypto 的方法）不仅是只读的，因此容易受到 polyfill 的攻击。

虽然 crypto 在所有窗口上均可用，但其返回的 Crypto 对象在不安全的上下文中仅有一个可用的特性：getRandomValues() 方法。通常，你应该仅在安全上下文中使用此 API。

- `subtle` 返回一个 SubtleCrypto 对象，用来访问公共的密码学原语，例如哈希、签名、加密以及解密。
- `getRandomValues()` 使用密码学安全的随机数填充传入的 TypedArray。
- `randomUUID()` 返回一个随机生成的，长度为 36 字符的第四版 UUID。

```js
const array = new Uint32Array(10);
crypto.getRandomValues(array);
```

## SubtleCrypto

接口提供了许多底层加密函数。你可以通过 crypto 属性提供的 Crypto 对象中的 subtle 属性来访问 SubtleCrypto 的相关特性。

1. 加密函数：

这些函数你可以用来实现系统中的隐私和身份验证等安全特性。SubtleCrypto API 提供了如下加密函数：

- encrypt() 和 decrypt()：加密和解密数据。
- sign() 和 verify()：创建和验证数字签名。
- digest()：生成某些数据的定长、防碰撞的消息摘要。

2. 密钥管理函数

除了 digest()，SubtleCrypto API 中所有加密函数都会使用密钥，并使用 CryptoKey 对象表示加密密钥。要执行签名和加密操作，请将 CryptoKey 对象传参给 sign() 或 encrypt() 函数。

**_生成和派生密钥_**：generateKey() 和 deriveKey() 函数都可以创建一个新的 CryptoKey 对象。不同之处在于 generateKey() 每次都会生成一个新的键值对，而 deriveKey() 通过基础密钥资源派生一个新的密钥。如果为两个独立的 deriveKey() 函数调用提供相同的基础密钥资源，那么你会获得两个具有相同基础值的 CryptoKey 对象。如果你想通过密码派生加密密钥，然后从相同的密码派生相同的密钥以解密数据，那么这将会非常有用。

**_导入和导出密钥_**：要在应用程序外部使密钥可用，你需要导出密钥，exportKey() 可以为你提供该功能。你可以选择多种导出格式。

importKey() 与 exportKey() 刚好相反。你可以从其他系统导入密钥，并且支持像 PKCS #8 和 JSON Web Key 这样可以帮助你执行此操作的标准格式。exportKey() 函数以非加密格式导出密钥。

如果密钥是敏感的，你应该使用 wrapKey()，该函数导出密钥并且使用另外一个密钥加密它。此类 API 调用被称为“密钥包装密钥”（key-wrapping key）。unwrapKey() 与 wrapKey() 相反，该函数解密密钥后导入解密的密钥。

**_存储密钥_**：CryptoKey 对象可以通过结构化克隆算法来存储，这意味着你可以通过 web storage API 来存储和获取它们。更为规范的方式是通过使用 IndexedDB API 来存储 CryptoKey 对象。

## SubtleCrypto.encrypt()

用于加密数据。AES（Advanced Encryption Standard）对称加密算法。AES 是一种分组加密算法，这意味着它将消息分成多个模块，然后逐块进行加密。

强烈建议使用认证加密（authenticated encryption），它可以检测密文是否已被攻击者篡改。使用认证也可以避免选择密文攻击（chosen-ciphertext attack），即攻击者可以请求系统解密任意的消息，然后使用解密结果来倒推出关于密钥的一些信息。虽然 CTR 和 CBC 模式可以添加认证，但是它们默认不提供该操作，并且在手动实现它们的时候，很容易犯一些微小但严重的错误。GCM 提供了内置的认证，因此常常推荐使用这种模式。

```js
/**
 * @algorithm 一个对象，用于指定使用的算法，以及需要的任何额外的参数：
 *  使用 RSA-OAEP，是一种公钥加密系统，则传入 RsaOaepParams 对象。
 *  使用 AES-CTR，（Counter Mode，计数器模式），则传入 AesCtrParams 对象。
 *  使用 AES-CBC，(Cipher Block Chaining，密码块链接)，则传入 AesCbcParams 对象。
 *  使用 AES-GCM，GCM (Galois/Counter Mode，伽罗瓦/计数器模式，是一种认证模式)，则传入 AesGcmParams 对象。
 * @key 一个包含了密钥的、用于加密的 CryptoKey 对象。
 * @data 一个包含了待加密的数据（也称为明文）的 ArrayBuffer、TypedArray 或 DataView 对象。
 * @return 一个 Promise，会兑现一个包含密文的 ArrayBuffer。
 */
encrypt(algorithm, publicKey, data);

//使用 RSA-OAEP 加密数据
window.crypto.subtle.encrypt(
  {
    name: "RSA-OAEP",
  },
  publicKey,
  encoded
);

// 使用 AES 的计数器（CTR）模式加密
// 解密时也需要使用 counter
let iv = window.crypto.getRandomValues(new Uint8Array(16));
let key = window.crypto.getRandomValues(new Uint8Array(16));
let data = new Uint8Array(12345);
// 加密函数使用 promise 包裹，因此我们必须使用 await，
// 并确保包含此代码的函数是一个异步函数
// 加密函数需要一个 cryptokey 对象
const cryptokey = await window.crypto.subtle.importKey(
  "raw",
  key.buffer,
  "AES-CTR",
  false,
  ["encrypt", "decrypt"]
);
const encrypted_content = await window.crypto.subtle.encrypt(
  {
    name: "AES-CTR",
    counter: iv,
    length: 128,
  },
  cryptokey,
  data
);
// Uint8Array
console.log(encrypted_content);

// 使用密码块链接（CBC）模式的 AES 加密数据
function encryptMessage(key, data) {
  // 解密时也需要使用 iv
  iv = window.crypto.getRandomValues(new Uint8Array(16));
  return window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: iv,
    },
    key,
    data
  );
}

// 使用伽罗瓦/计数器（GCM）模式的 AES 加密数据
function encryptMessage(key, data) {
  // 解密时也需要使用 iv
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, data);
}
```

## SubtleCrypto.decrypt()

解密加密的数据。

```js
/**
 * @algorithm 使用的算法，以及任何需要的额外参数。额外提供的参数的值必须与对应的 encrypt() 调用所传入的值相匹配。
 * @privateKey 一个包含了密钥的 CryptoKey 对象，用于解密。
 * @data 一个包含了待解密的数据（也称为密文）的 ArrayBuffer、TypedArray 或 DataView 对象。
 * @return  一个 Promise，会兑现一个包含明文的 ArrayBuffer。
 */
decrypt(algorithm, privateKey, data);

// 使用 RSA-OAEP 解密 ciphertext
function decryptMessage(privateKey, ciphertext) {
  return window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    ciphertext
  );
}

// 使用计数器（CTR）模式的 AES 解密 ciphertext。请注意，counter 必须与加密时使用的值相匹配
function decryptMessage(key, ciphertext) {
  return window.crypto.subtle.decrypt(
    { name: "AES-CTR", counter, length: 64 },
    key,
    ciphertext
  );
}

// 使用密码块链接（CBC）模式的 AES 解密 ciphertext。请注意，iv 必须与加密时使用的值相匹配
function decryptMessage(key, ciphertext) {
  return window.crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, ciphertext);
}

// 伽罗瓦/计数器（GCM）模式的 AES 解密 ciphertext。请注意，iv 必须与加密时使用的值相匹配
function decryptMessage(key, ciphertext) {
  return window.crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
}
```

## SubtleCrypto.sign()

用于生成数字签名。

```js
/**
 * @algorithm 一个字符串或指定了算法和要使用的参数的对象：
 * @privateKey CryptoKey 对象。 如果 algorithm 标识了公开密钥加密算法，则它是一个私钥。
 * @data 一个包含待签名数据的 ArrayBuffer、TypedArray 或 DataView 对象。
 * @return  一个 Promise，会兑现包含数据签名的 ArrayBuffer 对象。
 */
sign(algorithm, privateKey, data);

// 编码为签名需要的形式
let encoded = new TextEncoder().encode("要加密的数据");
let signature = await window.crypto.subtle.sign(
  "RSASSA-PKCS1-v1_5",
  privateKey,
  encoded
);

let signature = await window.crypto.subtle.sign(
  {
    name: "RSA-PSS",
    saltLength: 32,
  },
  privateKey,
  encoded
);

let signature = await window.crypto.subtle.sign(
  {
    name: "ECDSA",
    hash: { name: "SHA-384" },
  },
  privateKey,
  encoded
);

let signature = await window.crypto.subtle.sign("HMAC", key, encoded);
```

Web Crypto API 提供了 4 种可用于签名和签名验证的算法:

其中的三种算法（RSASSA-PKCS1-v1_5、RSA-PSS 和 ECDSA）是公开密钥加密算法，它们使用私钥进行签名，使用公钥验证签名。所有的算法均使用摘要算法在签名前将消息计算为短的、固定大小的散列值。除了 ECDSA（是将摘要算法传递给 algorithm 对象），其他算法均是通过将参数传递给 generateKey() 或 importKey() 函数来选择摘要算法的。

第四种算法（HMAC）使用相同的算法、密钥来签名和验证签名：这意味着签名验证的密钥必须保密，换句话说，该算法不适用与很多签名的场景。但是，当签名者和验证签名者是同一个实体时，这也是一个不错的选择。

## SubtleCrypto.verify()

用于验证数字签名。

```js
/**
 * @algorithm 定义要使用的算法的字符串或对象
 * @key 一个包含了用于验证签名的密钥的 CryptoKey 对象。
 * 若是对称加密算法，则为密钥本身；若是非对称加密算法，则为公钥。
 * @signature 一个包含了要验证的签名的 ArrayBuffer。
 * @data 一个包含了要验证其签名的数据的 ArrayBuffer。
 * @return 一个 Promise，如果签名有效，则兑现布尔值 true，否则兑现 false。
 */
verify(algorithm, key, signature, data);

let result = await window.crypto.subtle.verify(
  "RSASSA-PKCS1-v1_5",
  publicKey,
  signature,
  encoded
);

let result = await window.crypto.subtle.verify(
  {
    name: "RSA-PSS",
    saltLength: 32,
  },
  publicKey,
  signature,
  encoded
);

let result = await window.crypto.subtle.verify(
  {
    name: "ECDSA",
    hash: { name: "SHA-384" },
  },
  publicKey,
  signature,
  encoded
);

let result = await window.crypto.subtle.verify("HMAC", key, signature, encoded);
```

## SubtleCrypto.digest()

生成给定数据的摘要。摘要是从一些可变长的输入生成的短且具有固定长度的值。密码摘要应表现出抗冲突性，这意味着很难构造出具有相同摘要值的两个不同的输入。

```js
/**
 * @algorithm 可以是一个字符串或一个仅有 name 字符串属性的对象。
 * 该字符串为使用的哈希函数的名称。支持的值有：
 *  SHA-1 不要在加密应用程序中使用它
 *  SHA-256
 *  SHA-384
 *  SHA-512
 * @data 一个包含将计算摘要的数据的 ArrayBuffer、TypedArray 或 DataView 对象。
 * @return  一个 Promise，会兑现一个包含摘要值的 ArrayBuffer。
 */
digest(algorithm, data);

// 编码为（utf-8）Uint8Array
const msgUint8 = new TextEncoder().encode("生成摘要的原始信息");
// 计算消息的哈希值
const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgUint8);
// 将缓冲区转换为字节数组
const hashArray = Array.from(new Uint8Array(hashBuffer));
// 将字节数组转换为十六进制字符串
return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
```

## SubtleCrypto.deriveKey()

从主密钥派生密钥

```js
/**
 * @algorithm 一个对象，使用的派生算法。
 * @basekey 一个 CryptoKey，主密钥
 * @derivedKeyAlgorithm 一个用于派生密钥算法的对象。
 * @extractable 是否可以使用exportKey() 或 wrapKey() 来导出密钥。
 * @keyUsages 一个数组，表示派生出来的密钥的用途。注意，密钥的用法必须
 * 是 derivedKeyAlgorithm 设置的算法所允许的。数组元素可能的值有：
 *  encrypt：密钥可用于加密消息。
    decrypt：密钥可用于解密消息。
    sign：密钥可用于对消息进行签名。
    verify：密钥可用于验证签名。
    deriveKey：密钥可用于派生新的密钥。
    deriveBits：密钥可用于派生比特序列。
    wrapKey：密钥可用于包装一个密钥。
    unwrapKey：密钥可用于解开一个密钥的包装。
 */
deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages);

//获取用作为deriveKey的主密钥
let KeyMaterial = await window.crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode("password"),
  "PBKDF2",
  false,
  ["deriveBits", "deriveKey"]
);

// 根据主密钥生成派生密钥
const deriveKey = await window.crypto.subtle.deriveKey(
  {
    name: "PBKDF2",
    salt,
    iterations: 100000,
    hash: "SHA-256",
  },
  keyMaterial,
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"]
);
// 使用派生密钥加密数据
window.crypto.subtle.encrypt({ name: "AES-GCM", iv }, deriveKey, plaintext);
```

## SubtleCrypto.deriveBits()

用于从一个基本密钥派生比特序列（数组）。

它以基本密钥、使用的派生算法和需要派生的比特长度为参数。返回一个 Promise，会兑现一个包含派生比特序列的 ArrayBuffer。

此方法与 SubtleCrypto.deriveKey() 非常类似，区别在于 deriveKey() 返回的是 CryptoKey 对象，而不是 ArrayBuffer。本质上，deriveKey() 是由 deriveBits() 和 importKey() 这两个方法组合而成的。

该函数支持的派生算法与 deriveKey() 相同：ECDH、HKDF 和 PBKDF2。参见支持的算法以了解这些算法的详细信息。

```js
// length表示要派生的比特位数。此数字应为 8 的倍数。
deriveBits(algorithm, baseKey, length);

let salt = window.crypto.getRandomValues(new Uint8Array(16));
let keyMaterial = window.crypto.subtle.importKey(
  "raw",
  new TextEncoder().encode(password),
  { name: "PBKDF2" },
  false,
  ["deriveBits", "deriveKey"]
);

//派生比特序列。
const derivedBits = await window.crypto.subtle.deriveBits(
  {
    name: "PBKDF2",
    salt,
    iterations: 100000,
    hash: "SHA-256",
  },
  keyMaterial,
  256
);
```

## SubtleCrypto.generateKey()

用于生成新的密钥（用于对称加密算法）或密钥对（用于非对称加密算法）。

```js
/**
 * @algorithm 一个对象，用于定义要生成的算法类型，并提供所需的参数
 * @extractable 生成的密钥是否可被 exportKey() 和 wrapKey() 方法导出。
 * @keyUsages 一个数组，表示生成出来的密钥可被用于做什么
 * @return  兑现为 CryptoKey（用于对称加密算法）或 CryptoKeyPair（用于非对称加密算法）
 */
generateKey(algorithm, extractable, keyUsages);

let keyPair = await window.crypto.subtle.generateKey(
  {
    name: "RSA-OAEP",
    modulusLength: 4096,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
  },
  true,
  ["encrypt", "decrypt"]
);

let keyPair = await window.crypto.subtle.generateKey(
  {
    name: "ECDSA",
    namedCurve: "P-384",
  },
  true,
  ["sign", "verify"]
);

let key = await window.crypto.subtle.generateKey(
  {
    name: "HMAC",
    hash: { name: "SHA-512" },
  },
  true,
  ["sign", "verify"]
);

let key = await window.crypto.subtle.generateKey(
  {
    name: "AES-GCM",
    length: 256,
  },
  true,
  ["encrypt", "decrypt"]
);
```

## SubtleCrypto.importKey()

用于导入密钥：也就是说，它以外部可移植格式的密钥作为输入，并给出对应的、可用于 Web Crypto API 的 CryptoKey 对象。

```js
/**
 * @format 一个字符串，用于描述要导入的密钥的数据格式。可以是以下值之一：
 *  raw：Raw 格式。
    pkcs8：PKCS #8 格式。
    spki：SubjectPublicKeyInfo 格式。
    jwk：JSON Web Key 格式。
 * @keyData 一个 ArrayBuffer、TypedArray、DataView 或 JSONWebKey 对象，
 包含了给定格式的密钥。
 * @algorithm 一个对象，定义了要导入的密钥的类型和特定于算法的额外参数
 * @extractable 是否可能使用 exportKey() 或 wrapKey() 方法来导出密钥。
 * @keyUseges 一个数组，表示生成出来的密钥可被用于做什么
 * @return  一个 Promise，会兑现为表示导入的密钥的 CryptoKey 对象。
 */
importKey(format, keyData, algorithm, extractable, keyUsages);

const rawKey = window.crypto.getRandomValues(new Uint8Array(16));

/* 导入 Raw 格式的密钥
从一个包含原始字节序列的 ArrayBuffer 导入 AES 密钥。
传入包含字节序列的 ArrayBuffer，返回一个 Promise，
会被兑现为一个表示密钥的 CryptoKey 对象。
*/
window.crypto.subtle.importKey("raw", rawKey, "AES-GCM", true, [
  "encrypt",
  "decrypt",
]);

// 导入 JSON Web Key 格式的密钥
const jwkEcKey = {
  crv: "P-384",
  d: "wouCtU7Nw4E8_7n5C1-xBjB4xqSb_liZhYMsy8MGgxUny6Q8NCoH9xSiviwLFfK_",
  ext: true,
  key_ops: ["sign"],
  kty: "EC",
  x: "SzrRXmyI8VWFJg1dPUNbFcc9jZvjZEfH7ulKI1UkXAltd7RGWrcfFxqyGPcwu6AQ",
  y: "hHUag3OvDzEr0uUQND4PXHQTXP5IDGdYhJhL-WLKjnGjQAw0rNGy5V29-aV-yseW",
};

/*
以 JSON Web Key 格式导入椭圆曲线算法的私钥，用与 ECDSA 签名。
输入一个表示 JSON Web Key 的对象，返回一个 Promise，
会兑现为一个表示私钥的 CryptoKey 对象。
*/
window.crypto.subtle.importKey(
  "jwk",
  jwk,
  {
    name: "ECDSA",
    namedCurve: "P-384",
  },
  true,
  ["sign"]
);
```

## SubtleCrypto.exportKey()

用于导出密钥。也就是说，它将一个 CryptoKey 对象作为输入，并给出对应的外部可移植格式的密钥。

若要导出密钥，密钥的 CryptoKey.extractable 必须设置为 true。密钥不会以加密的格式导出：要在导出密钥时对密钥进行加密，请使用 SubtleCrypto.wrapKey() API 代替。

```js
/**
 * @format 一个描述要导出的密钥格式的字符串。可为以下值之一：
 *  raw：Raw 格式。
    pkcs8：PKCS #8 格式。
    spki：SubjectPublicKeyInfo 格式。
    jwk：JSON Web Key 格式。
 * @key 要导出的 CryptoKey。
 * @return 如果 format 为 jwk，兑现一个包含密钥的 JSON 对象。否则是 ArrayBuffer。
 */
exportKey(format, key);

//导出为 Raw 格式
await window.crypto.subtle.exportKey("raw", key);

window.crypto.subtle
  .generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  )
  .then(key => {});

//导出为 JSON Web Key 格式
const exported = await window.crypto.subtle.exportKey("jwk", key);

//生成签名/验证密钥对
window.crypto.subtle
  .generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-384",
    },
    true,
    ["sign", "verify"]
  )
  .then(keyPair => {});
```

## SubtleCrypto.wrapKey()

用于“包装”（wrap）密钥。这一味着它以外部可移植的格式导出密钥，然后对其进行加密。包装密钥有助于在不受信任的环境中保护它，例如在未受保护的数据存储，或在未受保护的网络上进行传输。

与 SubtleCrypto.exportKey() 一样，你需要指定密钥的导出格式。要导出密钥，必须将 CryptoKey.extractable 设置为 true。

但是，由于 wrapKey() 还会对要导出的密钥进行加密，因此还需要传入用于加密的密钥。这有时被称为“包装密钥”（wrapping key）。

```js
/**
 * @format 描述密钥在加密之前所导出的数据格式的字符串
 * @key 将被包装的密钥。
 * @wrappingKey 用于加密导出密钥的密钥。密钥的用途必须包括 wrapKey。
 * @wrapAlgo 指定用于加密导出密钥的算法的对象，以及任何所需的额外参数：
 * @return  一个 Promise，会兑现一个包含已加密的导出密钥的 ArrayBuffer。
 */
wrapKey(format, key, wrappingKey, wrapAlgo);

// Raw包装
let salt;

/*
获取用于作为 deriveKey 方法的输入的密钥材料。
密钥材料是用户提供的密码。
*/
function getKeyMaterial() {
  const password = window.prompt("Enter your password");
  const enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
}

/*
给定密钥材料和随机盐，使用 PBKDF2 派生一个 AES-KW 密钥。
*/
function getKey(keyMaterial, salt) {
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-KW", length: 256 },
    true,
    ["wrapKey", "unwrapKey"]
  );
}

/*
包装给定的密钥。
*/
async function wrapCryptoKey(keyToWrap) {
  // 获取密钥加密密钥
  const keyMaterial = await getKeyMaterial();
  salt = window.crypto.getRandomValues(new Uint8Array(16));
  const wrappingKey = await getKey(keyMaterial, salt);

  return window.crypto.subtle.wrapKey("raw", keyToWrap, wrappingKey, "AES-KW");
}

/*
生成加密/解密密钥，然后包装它。
*/
window.crypto.subtle
  .generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  )
  .then(secretKey => wrapCryptoKey(secretKey))
  .then(wrappedKey => console.log(wrappedKey));
```

JSON Web Key 包装；

```js
let salt;
let iv;

/*
获取用于作为 deriveKey 方法的输入的密钥材料。
密钥材料是用户提供的密码。
*/
function getKeyMaterial() {
  const password = window.prompt("Enter your password");
  const enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
}

/*
给定密钥材料和随机盐，使用 PBKDF2 派生一个 AES-GCM 密钥。
*/
function getKey(keyMaterial, salt) {
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["wrapKey", "unwrapKey"]
  );
}

/*
包装给定的密钥。
*/
async function wrapCryptoKey(keyToWrap) {
  // 获取密钥加密密钥
  const keyMaterial = await getKeyMaterial();
  salt = window.crypto.getRandomValues(new Uint8Array(16));
  const wrappingKey = await getKey(keyMaterial, salt);
  iv = window.crypto.getRandomValues(new Uint8Array(12));

  return window.crypto.subtle.wrapKey("jwk", keyToWrap, wrappingKey, {
    name: "AES-GCM",
    iv,
  });
}

/*
生成签名/验证密钥对，然后包装其中的私钥。
*/
window.crypto.subtle
  .generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-384",
    },
    true,
    ["sign", "verify"]
  )
  .then(keyPair => wrapCryptoKey(keyPair.privateKey))
  .then(wrappedKey => console.log(wrappedKey));
```

## SubtleCrypto.unwrapKey()

解开密钥的包装。这意味着它将一个已导出且加密（也被称为“包装”）的密钥作为输入。它会解密这个密钥然后导入它，返回一个可用于 Web Crypto API 的 CryptoKey 对象。

与 SubtleCrypto.importKey() 一样，你需要指定密钥的导入格式及其他属性以导入详细信息（如是否可导出、可用于哪些操作等等）。

但因为 unwrapKey() 还需要解密导入的密钥，所以还需要传入解密时必须使用的密钥。这有时也被称为“解包密钥”（unwrapping key）。

unwrapKey() 的逆函数是 SubtleCrypto.wrapKey()：unwrapKey 由解密 + 导入组成，而 wrapKey 由加密 + 导出组成。

```js
/**
 * @format 描述要解包的密钥的数据格式的字符串
 * @wrappedKey 一个包含给定格式密钥的 ArrayBuffer。
 * @unwrappingKey 用于解密已包装的密钥的 CryptoKey。此密钥必须设置了 unwrapKey 这一用途。
 * @unwrapAlgo 指定用于解密已包装的密钥的算法，以及其他要求的参数
 * @unwrappedKeyAlgo 定义了要解包装的密钥类型，并提供额外的特定于算法的参数的对象。
 * @extractable 一个布尔值，表示是否可以使用 SubtleCrypto.exportKey() 过 SubtleCrypto.wrapKey() 方法来导出密钥。
 * @keyUseges 一个数组，表示生成出来的密钥可被用于做什么
 * @return 一个 Promise，会兑现为表示解包装后的密钥的 CryptoKey 对象
 */
unwrapKey(
  format,
  wrappedKey,
  unwrappingKey,
  unwrapAlgo,
  unwrappedKeyAlgo,
  extractable,
  keyUsages
);
```

解包装“raw”格式的密钥:

```js
/*
用于派生包装密钥的盐，
与用户提供的密码一起使用。
其必须与原先在派生密钥时使用的盐相同。
*/
const saltBytes = [
  89, 113, 135, 234, 168, 204, 21, 36, 55, 93, 1, 132, 242, 242, 192, 156,
];

/*
包装的密钥。
*/
const wrappedKeyBytes = [
  171, 223, 14, 36, 201, 233, 233, 120, 164, 68, 217, 192, 226, 80, 224, 39,
  199, 235, 239, 60, 212, 169, 100, 23, 61, 54, 244, 197, 160, 80, 109, 230,
  207, 225, 57, 197, 175, 71, 80, 209,
];

/*
将字节序列转换为 ArrayBuffer。
*/
function bytesToArrayBuffer(bytes) {
  const bytesAsArrayBuffer = new ArrayBuffer(bytes.length);
  const bytesUint8 = new Uint8Array(bytesAsArrayBuffer);
  bytesUint8.set(bytes);
  return bytesAsArrayBuffer;
}

/*
从用户输入获取一些密钥材料，用于派生密钥（deriveKey）方法。
密钥材料是一个由用户提供的密码。
*/
function getKeyMaterial() {
  let password = window.prompt("Enter your password");
  let enc = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
}

/*
使用 PBKDF2 派生 AES-KW 密钥
*/
async function getUnwrappingKey() {
  // 1. 获得密钥材料（用户提供的密码）
  const keyMaterial = await getKeyMaterial();
  // 2. 初始化盐的参数
  // 盐必须与派生密钥时使用的相匹配。
  // 在这个示例中，它由常量“saltBytes”提供。
  const saltBuffer = bytesToArrayBuffer(saltBytes);
  // 3. 由密钥材料和盐派生密钥
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-KW", length: 256 },
    true,
    ["wrapKey", "unwrapKey"]
  );
}

/*
从包含原始字节序列的 ArrayBuffer 解包装 AES 密钥。
以包含字节序列的数组为参数，返回一个 Promise，
会兑现为表示密钥的 CryptoKey。
*/
async function unwrapSecretKey(wrappedKey) {
  // 1. 获取解包密钥
  const unwrappingKey = await getUnwrappingKey();
  // 2. 初始化已包装的密钥
  const wrappedKeyBuffer = bytesToArrayBuffer(wrappedKey);
  // 3. 解开密钥的包装
  return window.crypto.subtle.unwrapKey(
    "raw", // 导入的格式
    wrappedKeyBuffer, // 表示要解包的密钥的 ArrayBuffer
    unwrappingKey, // 表示加密密钥时使用的 CryptoKey
    "AES-KW", // 加密密钥时使用的算法
    "AES-GCM", // 解包密钥使用的算法
    true, // 解包后的密钥的可导出性
    ["encrypt", "decrypt"] // 解包后的密钥的用途
  );
}
```
