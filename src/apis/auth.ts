import type { SignInInfo, SignUpInfo } from '@/lib/types'
import { apiServer } from '@/apis/base'
import { useLoginData } from '@/stores'

export async function signup(info: SignUpInfo) {
  const server = apiServer()

  const rsaPublicKey = await server.get<string>('/v1/generate-register-key')

  info.password = await rsaPublicEncrypt(rsaPublicKey.data, info.password)

  const response = await server.post('/v1/register', {
    ...info,
    publicKey: rsaPublicKey.data
  })

  updateLoginInfo(response.data.data)
}

export async function signin(info: SignInInfo) {
  const server = apiServer()

  // sha1
  info.password = await sha1(info.password)

  const response = await server.post('/v1/login', info)

  updateLoginInfo(response.data.data)
}

function updateLoginInfo(data: { accessToken: string; refreshToken: string }) {
  const { set } = useLoginData()
  set({
    accessToken: data.accessToken,
    refreshToken: data.refreshToken
  })
  console.log('loginInfo', useLoginData().loginData, data)
}

async function sha1(data: string): Promise<string> {
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest('SHA-1', encodedData)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function rsaPublicEncrypt(key: string, data: string): Promise<string> {
  // Clean the PEM key by removing headers, footers, and whitespace
  const pemHeader = '-----BEGIN PUBLIC KEY-----'
  const pemFooter = '-----END PUBLIC KEY-----'
  const pemContents = key
    .replace(pemHeader, '')
    .replace(pemFooter, '')
    .replace(/\s+/g, '') // Remove all whitespace, including newlines

  // Decode the base64-encoded PEM to a binary ArrayBuffer
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0))

  // Import the public key using the Web Crypto API
  const cryptoKey = await crypto.subtle.importKey(
    'spki', // Key format (SubjectPublicKeyInfo)
    binaryDer, // Binary DER-encoded key
    {
      name: 'RSA-OAEP', // Algorithm name
      hash: 'SHA-256' // Hash function for OAEP
    },
    true, // Whether the key is extractable
    ['encrypt'] // Key usage
  )

  // Encode the data to be encrypted
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(data)

  // Encrypt the data using RSA-OAEP
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP' // Algorithm name
    },
    cryptoKey, // Imported public key
    encodedData // Data to encrypt
  )

  // Convert the encrypted data to a base64-encoded string
  const encryptedArray = new Uint8Array(encrypted)
  return btoa(String.fromCharCode(...encryptedArray))
}
