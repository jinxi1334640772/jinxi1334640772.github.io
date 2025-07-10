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

## 3. 加密和解密

SubtleCrypto 提供了多种加密算法来保护数据的机密性。支持对称加密（AES）和非对称加密（RSA）算法。

### 3.1 加密算法概述

#### 对称加密算法 (AES)
- **AES-GCM**: 推荐使用，提供内置认证，可检测篡改
- **AES-CTR**: 计数器模式，适合流式加密
- **AES-CBC**: 密码块链接模式，需要填充

#### 非对称加密算法
- **RSA-OAEP**: 适合加密小量数据，如密钥

### 3.2 encrypt() 方法

```javascript
/**
 * 加密数据
 * @param {Object} algorithm - 算法配置对象
 * @param {CryptoKey} key - 用于加密的密钥
 * @param {ArrayBuffer|TypedArray|DataView} data - 待加密的数据
 * @return {Promise<ArrayBuffer>} 包含密文的 ArrayBuffer
 */
crypto.subtle.encrypt(algorithm, key, data);
```

### 3.3 AES-GCM 加密（推荐）

```javascript
class AESGCMCrypto {
  constructor() {
    this.subtle = crypto.subtle;
  }
  
  // 生成 AES-GCM 密钥
  async generateKey() {
    return await this.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256
      },
      true, // 可导出
      ['encrypt', 'decrypt']
    );
  }
  
  // 加密数据
  async encrypt(key, plaintext) {
    // 生成随机初始化向量
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // 将字符串转换为 ArrayBuffer
    const encodedText = new TextEncoder().encode(plaintext);
    
    try {
      const ciphertext = await this.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        encodedText
      );
      
      // 返回 IV 和密文
      return {
        iv: iv,
        ciphertext: new Uint8Array(ciphertext)
      };
    } catch (error) {
      throw new Error(`加密失败: ${error.message}`);
    }
  }
  
  // 解密数据
  async decrypt(key, encryptedData) {
    const { iv, ciphertext } = encryptedData;
    
    try {
      const decryptedBuffer = await this.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: iv
        },
        key,
        ciphertext
      );
      
      // 将 ArrayBuffer 转换回字符串
      return new TextDecoder().decode(decryptedBuffer);
    } catch (error) {
      throw new Error(`解密失败: ${error.message}`);
    }
  }
}

// 使用示例
async function demonstrateAESGCM() {
  const aesCrypto = new AESGCMCrypto();
  
  try {
    // 生成密钥
    const key = await aesCrypto.generateKey();
    
    // 加密数据
    const message = '这是需要保护的敏感数据';
    const encrypted = await aesCrypto.encrypt(key, message);
    console.log('加密结果:', encrypted);
    
    // 解密数据
    const decrypted = await aesCrypto.decrypt(key, encrypted);
    console.log('解密结果:', decrypted);
    
    console.log('加密解密成功:', message === decrypted);
  } catch (error) {
    console.error('操作失败:', error);
  }
}

demonstrateAESGCM();
```

### 3.4 AES-CTR 加密

```javascript
class AESCTRCrypto {
  constructor() {
    this.subtle = crypto.subtle;
  }
  
  async generateKey() {
    return await this.subtle.generateKey(
      {
        name: 'AES-CTR',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  async encrypt(key, plaintext) {
    // 生成随机计数器
    const counter = crypto.getRandomValues(new Uint8Array(16));
    const encodedText = new TextEncoder().encode(plaintext);
    
    const ciphertext = await this.subtle.encrypt(
      {
        name: 'AES-CTR',
        counter: counter,
        length: 128 // 计数器位长度
    },
    key,
      encodedText
    );
    
    return {
      counter: counter,
      ciphertext: new Uint8Array(ciphertext)
    };
  }
  
  async decrypt(key, encryptedData) {
    const { counter, ciphertext } = encryptedData;
    
    const decryptedBuffer = await this.subtle.decrypt(
      {
        name: 'AES-CTR',
        counter: counter,
        length: 128
      },
      key,
      ciphertext
    );
    
    return new TextDecoder().decode(decryptedBuffer);
  }
}
```

### 3.5 RSA-OAEP 非对称加密

```javascript
class RSAOAEPCrypto {
  constructor() {
    this.subtle = crypto.subtle;
  }
  
  // 生成 RSA 密钥对
  async generateKeyPair() {
    return await this.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 4096, // 密钥长度
        publicExponent: new Uint8Array([1, 0, 1]), // 65537
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  // 使用公钥加密
  async encrypt(publicKey, plaintext) {
    const encodedText = new TextEncoder().encode(plaintext);
    
    // RSA-OAEP 有长度限制，通常用于加密对称密钥
    if (encodedText.length > 190) { // 4096位密钥的大致限制
      throw new Error('RSA-OAEP 数据长度超限，建议使用混合加密');
    }
    
    const ciphertext = await this.subtle.encrypt(
      {
        name: 'RSA-OAEP'
      },
      publicKey,
      encodedText
    );
    
    return new Uint8Array(ciphertext);
  }
  
  // 使用私钥解密
  async decrypt(privateKey, ciphertext) {
    const decryptedBuffer = await this.subtle.decrypt(
      {
        name: 'RSA-OAEP'
      },
    privateKey,
    ciphertext
  );
    
    return new TextDecoder().decode(decryptedBuffer);
  }
}
```

### 3.6 混合加密实现

```javascript
class HybridCrypto {
  constructor() {
    this.subtle = crypto.subtle;
    this.aes = new AESGCMCrypto();
    this.rsa = new RSAOAEPCrypto();
  }
  
  // 混合加密：使用 RSA 加密 AES 密钥，使用 AES 加密数据
  async encrypt(publicKey, plaintext) {
    // 生成随机 AES 密钥
    const aesKey = await this.aes.generateKey();
    
    // 使用 AES 加密数据
    const aesEncrypted = await this.aes.encrypt(aesKey, plaintext);
    
    // 导出 AES 密钥为原始格式
    const exportedKey = await this.subtle.exportKey('raw', aesKey);
    
    // 使用 RSA 加密 AES 密钥
    const encryptedAESKey = await this.rsa.encrypt(
      publicKey, 
      new TextDecoder().decode(exportedKey)
    );
    
    return {
      encryptedKey: encryptedAESKey,
      encryptedData: aesEncrypted
    };
  }
  
  async decrypt(privateKey, encryptedPackage) {
    const { encryptedKey, encryptedData } = encryptedPackage;
    
    // 使用 RSA 解密 AES 密钥
    const decryptedKeyData = await this.rsa.decrypt(privateKey, encryptedKey);
    const keyBuffer = new TextEncoder().encode(decryptedKeyData);
    
    // 重新导入 AES 密钥
    const aesKey = await this.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // 使用 AES 解密数据
    return await this.aes.decrypt(aesKey, encryptedData);
  }
}

// 使用示例
async function demonstrateHybridCrypto() {
  const hybridCrypto = new HybridCrypto();
  const rsaCrypto = new RSAOAEPCrypto();
  
  try {
    // 生成 RSA 密钥对
    const keyPair = await rsaCrypto.generateKeyPair();
    
    // 加密大量数据
    const largeMessage = '这是一段很长的文本数据，超过了RSA直接加密的限制...'.repeat(100);
    const encrypted = await hybridCrypto.encrypt(keyPair.publicKey, largeMessage);
    
    console.log('混合加密完成');
    
    // 解密数据
    const decrypted = await hybridCrypto.decrypt(keyPair.privateKey, encrypted);
    
    console.log('解密成功:', largeMessage === decrypted);
  } catch (error) {
    console.error('混合加密失败:', error);
  }
}
```

### 3.7 decrypt() 方法

```javascript
/**
 * 解密数据
 * @param {Object} algorithm - 算法配置，必须与加密时使用的参数匹配
 * @param {CryptoKey} key - 用于解密的密钥
 * @param {ArrayBuffer|TypedArray|DataView} data - 待解密的密文
 * @return {Promise<ArrayBuffer>} 包含明文的 ArrayBuffer
 */
crypto.subtle.decrypt(algorithm, key, data);
```

**重要注意事项**:
- 解密时的算法参数（如 IV、counter）必须与加密时完全一致
- 密钥类型必须匹配（公钥加密需要私钥解密）
- AES-GCM 提供完整性验证，如果数据被篡改会抛出异常

## 4. 数字签名

数字签名用于验证数据的完整性和来源的真实性。Web Crypto API 支持多种数字签名算法。

### 4.1 签名算法概述

#### 非对称签名算法
- **RSASSA-PKCS1-v1_5**: 经典RSA签名，广泛支持
- **RSA-PSS**: 更安全的RSA签名方案，推荐使用
- **ECDSA**: 椭圆曲线数字签名，效率高

#### 对称签名算法
- **HMAC**: 基于散列的消息认证码，用于对称验证

### 4.2 sign() 方法

```javascript
/**
 * 生成数字签名
 * @param {Object|String} algorithm - 签名算法配置
 * @param {CryptoKey} privateKey - 用于签名的私钥
 * @param {ArrayBuffer|TypedArray|DataView} data - 待签名的数据
 * @return {Promise<ArrayBuffer>} 包含数字签名的 ArrayBuffer
 */
crypto.subtle.sign(algorithm, privateKey, data);
```

### 4.3 RSA签名实现

```javascript
class RSASignature {
  constructor() {
    this.subtle = crypto.subtle;
  }
  
  // 生成RSA签名密钥对
  async generateKeyPair(algorithm = 'RSASSA-PKCS1-v1_5') {
    return await this.subtle.generateKey(
      {
        name: algorithm,
        modulusLength: 4096,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['sign', 'verify']
    );
  }
  
  // RSASSA-PKCS1-v1_5 签名
  async signWithPKCS1(privateKey, message) {
    const encodedMessage = new TextEncoder().encode(message);
    
    try {
      const signature = await this.subtle.sign(
        'RSASSA-PKCS1-v1_5',
  privateKey,
        encodedMessage
      );
      
      return new Uint8Array(signature);
    } catch (error) {
      throw new Error(`PKCS1签名失败: ${error.message}`);
    }
  }
  
  // RSA-PSS 签名（推荐）
  async signWithPSS(privateKey, message) {
    const encodedMessage = new TextEncoder().encode(message);
    
    try {
      const signature = await this.subtle.sign(
        {
          name: 'RSA-PSS',
          saltLength: 32 // 盐长度
  },
  privateKey,
        encodedMessage
      );
      
      return new Uint8Array(signature);
    } catch (error) {
      throw new Error(`PSS签名失败: ${error.message}`);
    }
  }
  
  // 验证签名
  async verify(publicKey, signature, message, algorithm = 'RSASSA-PKCS1-v1_5') {
    const encodedMessage = new TextEncoder().encode(message);
    
    try {
      let algorithmConfig;
      if (algorithm === 'RSA-PSS') {
        algorithmConfig = {
          name: 'RSA-PSS',
          saltLength: 32
        };
      } else {
        algorithmConfig = algorithm;
      }
      
      const isValid = await this.subtle.verify(
        algorithmConfig,
        publicKey,
        signature,
        encodedMessage
      );
      
      return isValid;
    } catch (error) {
      throw new Error(`签名验证失败: ${error.message}`);
    }
  }
}

// 使用示例
async function demonstrateRSASignature() {
  const rsaSign = new RSASignature();
  
  try {
    // 生成密钥对
    const keyPair = await rsaSign.generateKeyPair('RSA-PSS');
    
    const message = '这是需要签名的重要文档内容';
    
    // 创建签名
    const signature = await rsaSign.signWithPSS(keyPair.privateKey, message);
    console.log('签名生成成功');
    
    // 验证签名
    const isValid = await rsaSign.verify(
      keyPair.publicKey, 
  signature,
      message, 
      'RSA-PSS'
    );
    
    console.log('签名验证结果:', isValid);
    
    // 验证被篡改的消息
    const tamperedMessage = message + '被恶意修改';
    const isTamperedValid = await rsaSign.verify(
      keyPair.publicKey, 
      signature, 
      tamperedMessage, 
      'RSA-PSS'
    );
    
    console.log('篡改消息验证结果:', isTamperedValid);
  } catch (error) {
    console.error('RSA签名演示失败:', error);
  }
}

demonstrateRSASignature();
```

### 4.4 ECDSA椭圆曲线签名

```javascript
class ECDSASignature {
  constructor() {
    this.subtle = crypto.subtle;
  }
  
  // 生成ECDSA密钥对
  async generateKeyPair(curve = 'P-384') {
    return await this.subtle.generateKey(
      {
        name: 'ECDSA',
        namedCurve: curve // 'P-256', 'P-384', 'P-521'
      },
      true,
      ['sign', 'verify']
    );
  }
  
  // ECDSA签名
  async sign(privateKey, message, hashAlgorithm = 'SHA-384') {
    const encodedMessage = new TextEncoder().encode(message);
    
    try {
      const signature = await this.subtle.sign(
        {
          name: 'ECDSA',
          hash: { name: hashAlgorithm }
        },
        privateKey,
        encodedMessage
      );
      
      return new Uint8Array(signature);
    } catch (error) {
      throw new Error(`ECDSA签名失败: ${error.message}`);
    }
  }
  
  // 验证ECDSA签名
  async verify(publicKey, signature, message, hashAlgorithm = 'SHA-384') {
    const encodedMessage = new TextEncoder().encode(message);
    
    try {
      const isValid = await this.subtle.verify(
        {
          name: 'ECDSA',
          hash: { name: hashAlgorithm }
  },
  publicKey,
  signature,
        encodedMessage
      );
      
      return isValid;
    } catch (error) {
      throw new Error(`ECDSA验证失败: ${error.message}`);
    }
  }
}

// 使用示例
async function demonstrateECDSASignature() {
  const ecdsaSign = new ECDSASignature();
  
  try {
    // 生成P-384曲线密钥对
    const keyPair = await ecdsaSign.generateKeyPair('P-384');
    
    const document = {
      id: '12345',
      content: '重要的合同文档内容',
      timestamp: Date.now()
    };
    
    const message = JSON.stringify(document);
    
    // 签名
    const signature = await ecdsaSign.sign(keyPair.privateKey, message);
    console.log('ECDSA签名成功');
    
    // 验证
    const isValid = await ecdsaSign.verify(keyPair.publicKey, signature, message);
    console.log('ECDSA验证结果:', isValid);
    
  } catch (error) {
    console.error('ECDSA签名演示失败:', error);
  }
}

demonstrateECDSASignature();
```

### 4.5 HMAC对称签名

```javascript
class HMACSignature {
  constructor() {
    this.subtle = crypto.subtle;
  }
  
  // 生成HMAC密钥
  async generateKey(hashAlgorithm = 'SHA-256') {
    return await this.subtle.generateKey(
      {
        name: 'HMAC',
        hash: { name: hashAlgorithm }
      },
      true,
      ['sign', 'verify']
    );
  }
  
  // 从密码派生HMAC密钥
  async deriveKeyFromPassword(password, salt) {
    // 首先导入密码作为密钥材料
    const keyMaterial = await this.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    // 派生HMAC密钥
    return await this.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'HMAC',
        hash: 'SHA-256'
      },
      false,
      ['sign', 'verify']
    );
  }
  
  // HMAC签名
  async sign(key, message) {
    const encodedMessage = new TextEncoder().encode(message);
    
    try {
      const signature = await this.subtle.sign('HMAC', key, encodedMessage);
      return new Uint8Array(signature);
    } catch (error) {
      throw new Error(`HMAC签名失败: ${error.message}`);
    }
  }
  
  // 验证HMAC签名
  async verify(key, signature, message) {
    const encodedMessage = new TextEncoder().encode(message);
    
    try {
      const isValid = await this.subtle.verify('HMAC', key, signature, encodedMessage);
      return isValid;
    } catch (error) {
      throw new Error(`HMAC验证失败: ${error.message}`);
    }
  }
}

// 使用示例
async function demonstrateHMACSignature() {
  const hmacSign = new HMACSignature();
  
  try {
    // 生成随机密钥
    const key = await hmacSign.generateKey('SHA-256');
    
    const apiRequest = {
      method: 'POST',
      url: '/api/transfer',
      body: { amount: 1000, to: 'account123' },
      timestamp: Date.now()
    };
    
    const message = JSON.stringify(apiRequest);
    
    // 生成HMAC签名
    const signature = await hmacSign.sign(key, message);
    console.log('HMAC签名生成成功');
    
    // 验证签名
    const isValid = await hmacSign.verify(key, signature, message);
    console.log('HMAC验证结果:', isValid);
    
    // 演示基于密码的HMAC
    const password = 'secret-shared-key';
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const derivedKey = await hmacSign.deriveKeyFromPassword(password, salt);
    
    const sensitiveData = '敏感的用户数据';
    const hmacTag = await hmacSign.sign(derivedKey, sensitiveData);
    const isValidTag = await hmacSign.verify(derivedKey, hmacTag, sensitiveData);
    
    console.log('基于密码的HMAC验证:', isValidTag);
    
  } catch (error) {
    console.error('HMAC签名演示失败:', error);
  }
}

demonstrateHMACSignature();
```

### 4.6 verify() 方法

```javascript
/**
 * 验证数字签名
 * @param {Object|String} algorithm - 验证算法配置，必须与签名时匹配
 * @param {CryptoKey} key - 用于验证的密钥（公钥或HMAC密钥）
 * @param {ArrayBuffer|TypedArray|DataView} signature - 要验证的签名
 * @param {ArrayBuffer|TypedArray|DataView} data - 原始数据
 * @return {Promise<boolean>} 签名是否有效
 */
crypto.subtle.verify(algorithm, key, signature, data);
```

### 4.7 数字签名综合应用示例

```javascript
class DocumentSigner {
  constructor() {
    this.subtle = crypto.subtle;
    this.rsaSign = new RSASignature();
    this.ecdsaSign = new ECDSASignature();
    this.hmacSign = new HMACSignature();
  }
  
  // 文档签名和验证流程
  async signDocument(document, signerKeyPair, algorithm = 'RSA-PSS') {
    const documentString = JSON.stringify(document);
    const timestamp = Date.now();
    
    // 创建签名元数据
    const signatureMetadata = {
      algorithm: algorithm,
      timestamp: timestamp,
      version: '1.0'
    };
    
    // 要签名的完整数据
    const signedData = {
      document: document,
      metadata: signatureMetadata
    };
    
    const dataToSign = JSON.stringify(signedData);
    
    // 根据算法选择签名方法
    let signature;
    switch (algorithm) {
      case 'RSA-PSS':
        signature = await this.rsaSign.signWithPSS(signerKeyPair.privateKey, dataToSign);
        break;
      case 'RSASSA-PKCS1-v1_5':
        signature = await this.rsaSign.signWithPKCS1(signerKeyPair.privateKey, dataToSign);
        break;
      case 'ECDSA':
        signature = await this.ecdsaSign.sign(signerKeyPair.privateKey, dataToSign);
        break;
      default:
        throw new Error(`不支持的签名算法: ${algorithm}`);
    }
    
    return {
      signedData: signedData,
      signature: Array.from(signature), // 转换为普通数组以便序列化
      publicKey: await this.exportPublicKey(signerKeyPair.publicKey)
    };
  }
  
  // 验证文档签名
  async verifyDocument(signedDocument) {
    const { signedData, signature, publicKey } = signedDocument;
    const { metadata } = signedData;
    
    try {
      // 重新导入公钥
      const importedPublicKey = await this.importPublicKey(publicKey, metadata.algorithm);
      
      // 重新创建要验证的数据
      const dataToVerify = JSON.stringify(signedData);
      const signatureBuffer = new Uint8Array(signature);
      
      // 根据算法进行验证
      let isValid;
      switch (metadata.algorithm) {
        case 'RSA-PSS':
          isValid = await this.rsaSign.verify(
            importedPublicKey, 
            signatureBuffer, 
            dataToVerify, 
            'RSA-PSS'
          );
          break;
        case 'RSASSA-PKCS1-v1_5':
          isValid = await this.rsaSign.verify(
            importedPublicKey, 
            signatureBuffer, 
            dataToVerify, 
            'RSASSA-PKCS1-v1_5'
          );
          break;
        case 'ECDSA':
          isValid = await this.ecdsaSign.verify(
            importedPublicKey, 
            signatureBuffer, 
            dataToVerify
          );
          break;
        default:
          throw new Error(`不支持的验证算法: ${metadata.algorithm}`);
      }
      
      return {
        valid: isValid,
        algorithm: metadata.algorithm,
        timestamp: metadata.timestamp,
        document: signedData.document
      };
    } catch (error) {
      throw new Error(`文档验证失败: ${error.message}`);
    }
  }
  
  // 导出公钥
  async exportPublicKey(publicKey) {
    const exportedKey = await this.subtle.exportKey('spki', publicKey);
    return Array.from(new Uint8Array(exportedKey));
  }
  
  // 导入公钥
  async importPublicKey(keyData, algorithm) {
    const keyBuffer = new Uint8Array(keyData).buffer;
    
    const algorithmConfig = {
      'RSA-PSS': {
        name: 'RSA-PSS',
        hash: 'SHA-256'
      },
      'RSASSA-PKCS1-v1_5': {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256'
      },
      'ECDSA': {
        name: 'ECDSA',
        namedCurve: 'P-384'
      }
    };
    
    return await this.subtle.importKey(
      'spki',
      keyBuffer,
      algorithmConfig[algorithm],
      false,
      ['verify']
    );
  }
}

// 使用示例
async function demonstrateDocumentSigning() {
  const docSigner = new DocumentSigner();
  const rsaSign = new RSASignature();
  
  try {
    // 准备要签名的文档
    const document = {
      id: 'CONTRACT-2024-001',
      type: 'purchase_agreement',
      parties: ['Company A', 'Company B'],
      amount: 100000,
      terms: '30 days payment terms',
      date: '2024-01-15'
    };
    
    // 生成签名密钥对
    const keyPair = await rsaSign.generateKeyPair('RSA-PSS');
    
    // 签名文档
    console.log('正在签名文档...');
    const signedDoc = await docSigner.signDocument(document, keyPair, 'RSA-PSS');
    console.log('文档签名完成');
    
    // 验证签名
    console.log('正在验证签名...');
    const verification = await docSigner.verifyDocument(signedDoc);
    
    console.log('验证结果:', verification);
    console.log('签名有效:', verification.valid);
    console.log('签名算法:', verification.algorithm);
    console.log('签名时间:', new Date(verification.timestamp));
    
    // 模拟文档被篡改的情况
    console.log('\\n模拟文档篡改...');
    const tamperedDoc = { ...signedDoc };
    tamperedDoc.signedData.document.amount = 200000; // 篡改金额
    
    const tamperedVerification = await docSigner.verifyDocument(tamperedDoc);
    console.log('篡改文档验证结果:', tamperedVerification.valid);
    
  } catch (error) {
    console.error('文档签名演示失败:', error);
  }
}

demonstrateDocumentSigning();
```

## 5. 消息摘要

消息摘要（Hash）用于生成数据的固定长度"指纹"，广泛应用于数据完整性验证、数字签名等场景。

### 5.1 digest() 方法

```javascript
/**
 * 生成消息摘要
 * @param {String|Object} algorithm - 哈希算法名称
 * @param {ArrayBuffer|TypedArray|DataView} data - 待计算摘要的数据
 * @return {Promise<ArrayBuffer>} 包含摘要值的 ArrayBuffer
 */
crypto.subtle.digest(algorithm, data);
```

### 5.2 支持的哈希算法

- **SHA-256**: 推荐使用，输出256位
- **SHA-384**: 更强安全性，输出384位  
- **SHA-512**: 最强安全性，输出512位
- **SHA-1**: 已不安全，不推荐使用

### 5.3 哈希工具类实现

```javascript
class HashUtility {
  constructor() {
    this.subtle = crypto.subtle;
  }
  
  // 计算字符串的哈希值
  async hashString(message, algorithm = 'SHA-256') {
    const encodedMessage = new TextEncoder().encode(message);
    const hashBuffer = await this.subtle.digest(algorithm, encodedMessage);
    return this.bufferToHex(hashBuffer);
  }
  
  // 计算文件的哈希值
  async hashFile(file, algorithm = 'SHA-256') {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await this.subtle.digest(algorithm, arrayBuffer);
    return this.bufferToHex(hashBuffer);
  }
  
  // 计算大文件的分块哈希（流式处理）
  async hashLargeFile(file, algorithm = 'SHA-256', chunkSize = 1024 * 1024) {
    // 注意：Web Crypto API 不直接支持流式哈希
    // 这里演示如何分块读取并最终计算整体哈希
    const chunks = [];
    let offset = 0;
    
    while (offset < file.size) {
      const chunk = file.slice(offset, offset + chunkSize);
      const arrayBuffer = await chunk.arrayBuffer();
      chunks.push(new Uint8Array(arrayBuffer));
      offset += chunkSize;
    }
    
    // 合并所有块
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const combined = new Uint8Array(totalLength);
    let position = 0;
    
    for (const chunk of chunks) {
      combined.set(chunk, position);
      position += chunk.length;
    }
    
    const hashBuffer = await this.subtle.digest(algorithm, combined);
    return this.bufferToHex(hashBuffer);
  }
  
  // 将 ArrayBuffer 转换为十六进制字符串
  bufferToHex(buffer) {
    const hashArray = Array.from(new Uint8Array(buffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // 验证数据完整性
  async verifyIntegrity(data, expectedHash, algorithm = 'SHA-256') {
    const actualHash = await this.hashString(data, algorithm);
    return actualHash === expectedHash;
  }
  
  // 生成数据指纹
  async generateFingerprint(data) {
    const hashes = {};
    const algorithms = ['SHA-256', 'SHA-384', 'SHA-512'];
    
    for (const algorithm of algorithms) {
      hashes[algorithm] = await this.hashString(data, algorithm);
    }
    
    return {
      data: data,
      timestamp: Date.now(),
      hashes: hashes
    };
  }
}

// 使用示例
async function demonstrateHashing() {
  const hashUtil = new HashUtility();
  
  try {
    const message = '这是需要计算哈希值的重要数据';
    
    // 计算不同算法的哈希值
    console.log('SHA-256:', await hashUtil.hashString(message, 'SHA-256'));
    console.log('SHA-384:', await hashUtil.hashString(message, 'SHA-384'));
    console.log('SHA-512:', await hashUtil.hashString(message, 'SHA-512'));
    
    // 生成数据指纹
    const fingerprint = await hashUtil.generateFingerprint(message);
    console.log('数据指纹:', fingerprint);
    
    // 验证数据完整性
    const isValid = await hashUtil.verifyIntegrity(
      message, 
      fingerprint.hashes['SHA-256']
    );
    console.log('数据完整性验证:', isValid);
    
    // 验证被篡改的数据
    const tamperedMessage = message + '被修改';
    const isTamperedValid = await hashUtil.verifyIntegrity(
      tamperedMessage, 
      fingerprint.hashes['SHA-256']
    );
    console.log('篡改数据验证:', isTamperedValid);
    
  } catch (error) {
    console.error('哈希演示失败:', error);
  }
}

demonstrateHashing();
```

### 5.4 密码存储应用

```javascript
class PasswordManager {
  constructor() {
    this.hashUtil = new HashUtility();
  }
  
  // 安全存储密码（加盐哈希）
  async hashPassword(password, salt = null) {
    // 生成随机盐值
    if (!salt) {
      salt = crypto.getRandomValues(new Uint8Array(32));
    }
    
    // 组合密码和盐值
    const combined = new Uint8Array(
      new TextEncoder().encode(password).length + salt.length
    );
    combined.set(new TextEncoder().encode(password));
    combined.set(salt, new TextEncoder().encode(password).length);
    
    // 计算哈希
    const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
    
    return {
      hash: this.hashUtil.bufferToHex(hashBuffer),
      salt: Array.from(salt)
    };
  }
  
  // 验证密码
  async verifyPassword(password, storedHash, storedSalt) {
    const salt = new Uint8Array(storedSalt);
    const computed = await this.hashPassword(password, salt);
    return computed.hash === storedHash;
  }
}

// 使用示例
async function demonstratePasswordHashing() {
  const passwordMgr = new PasswordManager();
  
  try {
    const password = 'mySecurePassword123!';
    
    // 存储密码
    const stored = await passwordMgr.hashPassword(password);
    console.log('存储的密码哈希:', stored.hash);
    console.log('盐值:', stored.salt);
    
    // 验证正确密码
    const isValid = await passwordMgr.verifyPassword(
      password, 
      stored.hash, 
      stored.salt
    );
    console.log('密码验证结果:', isValid);
    
    // 验证错误密码
    const isWrongValid = await passwordMgr.verifyPassword(
      'wrongPassword', 
      stored.hash, 
      stored.salt
    );
    console.log('错误密码验证结果:', isWrongValid);
    
  } catch (error) {
    console.error('密码哈希演示失败:', error);
  }
}

demonstratePasswordHashing();
```

## 6. 密钥管理

密钥管理是密码学应用的核心，包括密钥的生成、导入、导出、派生、包装等操作。

### 6.1 generateKey() - 密钥生成

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

### 6.2 SubtleCrypto.deriveBits()

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

### 6.3 SubtleCrypto.generateKey()

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

### 6.4 SubtleCrypto.importKey()

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

### 6.5 SubtleCrypto.exportKey()

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

### 6.6SubtleCrypto.wrapKey()

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

### 6.7 SubtleCrypto.unwrapKey()

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

## 7. 密钥派生

密钥派生允许从一个基础密钥材料（如密码）生成新的密钥。

### 7.1 deriveKey() 方法

```javascript
/**
 * 从主密钥派生新密钥
 * @param {Object} algorithm - 派生算法配置
 * @param {CryptoKey} baseKey - 基础密钥材料
 * @param {Object} derivedKeyAlgorithm - 派生密钥的算法配置
 * @param {boolean} extractable - 派生密钥是否可导出
 * @param {Array<string>} keyUsages - 派生密钥的用途
 * @return {Promise<CryptoKey>} 派生的密钥
 */
crypto.subtle.deriveKey(algorithm, baseKey, derivedKeyAlgorithm, extractable, keyUsages);
```

### 7.2 PBKDF2密钥派生实现

```javascript
class PBKDF2KeyDerivation {
  constructor() {
    this.subtle = crypto.subtle;
  }
  
  // 从密码派生密钥
  async deriveKeyFromPassword(password, salt, iterations = 100000) {
    // 导入密码作为密钥材料
    const keyMaterial = await this.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    // 派生AES密钥
    return await this.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: 256
      },
      true,
      ['encrypt', 'decrypt']
    );
  }
  
  // 从密码派生多个密钥
  async deriveMultipleKeys(password, salt, keyCount = 2) {
    const keyMaterial = await this.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    
    // 派生足够的比特数据
    const derivedBits = await this.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      256 * keyCount // 每个密钥256位
    );
    
    const keys = [];
    const bitArray = new Uint8Array(derivedBits);
    
    // 从派生的比特中创建多个密钥
    for (let i = 0; i < keyCount; i++) {
      const keyBytes = bitArray.slice(i * 32, (i + 1) * 32);
      const key = await this.subtle.importKey(
        'raw',
        keyBytes,
        'AES-GCM',
        false,
        ['encrypt', 'decrypt']
      );
      keys.push(key);
    }
    
    return keys;
  }
}

// 使用示例
async function demonstrateKeyDerivation() {
  const keyDerivation = new PBKDF2KeyDerivation();
  
  try {
    const password = 'user-strong-password-123';
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // 单个密钥派生
    const derivedKey = await keyDerivation.deriveKeyFromPassword(password, salt);
    console.log('密钥派生成功');
    
    // 多个密钥派生
    const multipleKeys = await keyDerivation.deriveMultipleKeys(password, salt, 3);
    console.log(`成功派生${multipleKeys.length}个密钥`);
    
  } catch (error) {
    console.error('密钥派生失败:', error);
  }
}

demonstrateKeyDerivation();
```

## 8. 密钥包装

密钥包装允许安全地传输和存储密钥，通过用另一个密钥对目标密钥进行加密。

### 8.1 wrapKey() 和 unwrapKey() 方法

```javascript
/**
 * 包装密钥（加密导出）
 * @param {string} format - 导出格式
 * @param {CryptoKey} key - 要包装的密钥
 * @param {CryptoKey} wrappingKey - 用于包装的密钥
 * @param {Object} wrapAlgorithm - 包装算法配置
 * @return {Promise<ArrayBuffer>} 包装后的密钥数据
 */
crypto.subtle.wrapKey(format, key, wrappingKey, wrapAlgorithm);

/**
 * 解包密钥（解密导入）
 * @param {string} format - 导入格式
 * @param {ArrayBuffer} wrappedKey - 包装的密钥数据
 * @param {CryptoKey} unwrappingKey - 用于解包的密钥
 * @param {Object} unwrapAlgorithm - 解包算法配置
 * @param {Object} unwrappedKeyAlgorithm - 解包后密钥的算法配置
 * @param {boolean} extractable - 解包后密钥是否可导出
 * @param {Array<string>} keyUsages - 解包后密钥的用途
 * @return {Promise<CryptoKey>} 解包后的密钥
 */
crypto.subtle.unwrapKey(format, wrappedKey, unwrappingKey, unwrapAlgorithm, unwrappedKeyAlgorithm, extractable, keyUsages);
```

### 8.2 密钥包装实现

```javascript
class KeyWrapping {
  constructor() {
    this.subtle = crypto.subtle;
    this.pbkdf2 = new PBKDF2KeyDerivation();
  }
  
  // 基于密码的密钥包装
  async wrapKeyWithPassword(keyToWrap, password) {
    // 生成随机盐值
    const salt = crypto.getRandomValues(new Uint8Array(16));
    
    // 从密码派生包装密钥
    const wrappingKey = await this.pbkdf2.deriveKeyFromPassword(password, salt);
    
    // 生成随机IV
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    // 包装密钥
    const wrappedKey = await this.subtle.wrapKey(
      'raw',
      keyToWrap,
      wrappingKey,
      {
        name: 'AES-GCM',
        iv: iv
      }
    );
    
    return {
      wrappedKey: new Uint8Array(wrappedKey),
      salt: salt,
      iv: iv
    };
  }
  
  // 解包密钥
  async unwrapKeyWithPassword(wrappedKeyData, password, keyAlgorithm) {
    const { wrappedKey, salt, iv } = wrappedKeyData;
    
    // 从密码重新派生包装密钥
    const unwrappingKey = await this.pbkdf2.deriveKeyFromPassword(password, salt);
    
    // 解包密钥
    const unwrappedKey = await this.subtle.unwrapKey(
      'raw',
      wrappedKey,
      unwrappingKey,
      {
        name: 'AES-GCM',
        iv: iv
      },
      keyAlgorithm,
      false,
      ['encrypt', 'decrypt']
    );
    
    return unwrappedKey;
  }
  
  // RSA密钥包装
  async wrapKeyWithRSA(keyToWrap, rsaPublicKey) {
    const wrappedKey = await this.subtle.wrapKey(
      'raw',
      keyToWrap,
      rsaPublicKey,
      {
        name: 'RSA-OAEP'
      }
    );
    
    return new Uint8Array(wrappedKey);
  }
  
  // RSA密钥解包
  async unwrapKeyWithRSA(wrappedKey, rsaPrivateKey, keyAlgorithm) {
    const unwrappedKey = await this.subtle.unwrapKey(
      'raw',
      wrappedKey,
      rsaPrivateKey,
      {
        name: 'RSA-OAEP'
      },
      keyAlgorithm,
      false,
      ['encrypt', 'decrypt']
    );
    
    return unwrappedKey;
  }
}

// 使用示例
async function demonstrateKeyWrapping() {
  const keyWrapper = new KeyWrapping();
  const aes = new AESGCMCrypto();
  
  try {
    // 生成要包装的密钥
    const secretKey = await aes.generateKey();
    
    // 使用密码包装密钥
    const password = 'wrapping-password-123';
    const wrappedData = await keyWrapper.wrapKeyWithPassword(secretKey, password);
    console.log('密钥包装成功');
    
    // 解包密钥
    const unwrappedKey = await keyWrapper.unwrapKeyWithPassword(
      wrappedData, 
      password, 
      { name: 'AES-GCM' }
    );
    console.log('密钥解包成功');
    
    // 验证密钥功能
    const testMessage = '测试消息';
    const encrypted = await aes.encrypt(unwrappedKey, testMessage);
    const decrypted = await aes.decrypt(unwrappedKey, encrypted);
    
    console.log('密钥验证:', testMessage === decrypted);
    
  } catch (error) {
    console.error('密钥包装演示失败:', error);
  }
}

demonstrateKeyWrapping();
```

## 9. 安全最佳实践

1. **密钥管理**：
   - 使用 `generateKey()` 生成对称密钥，使用 `subtle.generateKey()` 生成非对称密钥对。
   - 对称密钥通常用于加密数据，非对称密钥用于签名和密钥交换。
   - 密钥必须设置为不可导出 (`extractable: false`)，除非你确实需要导出它。

2. **加密数据**：
   - 使用 `subtle.encrypt()` 和 `subtle.decrypt()` 进行对称加密。
   - 使用 `subtle.sign()` 和 `subtle.verify()` 进行数字签名。
   - 使用 `subtle.digest()` 生成消息摘要。

3. **密钥派生**：
   - 使用 `subtle.deriveKey()` 或 `subtle.deriveBits()` 从基础密钥派生新密钥。
   - PBKDF2 是推荐的基础派生算法。

4. **密钥包装**：
   - 使用 `subtle.wrapKey()` 和 `subtle.unwrapKey()` 安全地传输和存储密钥。
   - 包装密钥可以防止密钥在不受信任的环境中泄露。

5. **随机数生成**：
   - 使用 `subtle.getRandomValues()` 生成密码学安全的随机数。
   - 确保随机数用于加密密钥、初始化向量（IV）、盐值等。

6. **算法选择**：
   - 选择已被广泛审计和测试的加密算法（如 AES-GCM、RSA-OAEP、ECDSA）。
   - 避免使用已知漏洞或已被弃用的算法。

7. **密钥存储**：
   - 敏感密钥（如对称密钥、私钥）应存储在安全的硬件安全模块（HSM）或受信任的密钥管理系统中。
   - 不要将密钥硬编码在代码中。

8. **数据完整性**：
   - 使用 `subtle.digest()` 生成数据的固定长度哈希，用于验证数据的完整性。
   - 确保哈希算法是抗碰撞的（如 SHA-256）。

9. **密钥轮换**：
   - 定期轮换密钥，特别是对称密钥。
   - 确保旧密钥在不再需要时被销毁。

10. **错误处理**：
    - 始终对加密操作进行错误处理，并提供清晰的错误信息。
    - 避免在生产环境中使用未经验证的加密实现。

## 10. 浏览器兼容性

Web Crypto API 在现代浏览器中得到广泛支持。以下是一些主要浏览器的兼容性概览：

- **Chrome**: 自 Chrome 37 起支持。
- **Firefox**: 自 Firefox 38 起支持。
- **Safari**: 自 Safari 12 起支持。
- **Edge**: 自 Edge 18 起支持。
- **Opera**: 自 Opera 24 起支持。

对于旧版浏览器，你可能需要使用 polyfills 或第三方库来提供加密功能。

## 11. 参考资料

1. [Web Crypto API Specification](https://www.w3.org/TR/WebCryptoAPI/)
2. [Mozilla Developer Network - Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
3. [NIST FIPS 140-2](https://csrc.nist.gov/publications/fips/fips140-2/fips1402.pdf)
4. [RFC 4648 - Base64 Encoding with URL and Filename Safe Alphabet](https://www.rfc-editor.org/rfc/rfc4648.txt)
5. [RFC 5208 - PKCS #8: Private-Key Information Syntax Standard](https://www.rfc-editor.org/rfc/rfc5208.txt)
6. [RFC 7518 - JSON Web Algorithms (JWA)](https://www.rfc-editor.org/rfc/rfc7518.txt)
7. [RFC 7519 - JSON Web Tokens (JWT)](https://www.rfc-editor.org/rfc/rfc7519.txt)
