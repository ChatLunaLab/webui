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

  updateLoginInfo(response.data)
}

export async function signin(info: SignInInfo) {
  const server = apiServer()

  // sha1
  info.password = await sha1(info.password)

  const response = await server.post('/v1/login', info)

  updateLoginInfo(response.data)
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
  // Convert PEM key to ArrayBuffer
  const pemHeader = '-----BEGIN PUBLIC KEY-----'
  const pemFooter = '-----END PUBLIC KEY-----'
  const pemContents = key
    .substring(pemHeader.length, key.length - pemFooter.length)
    .replace(/\n/g, '')

  const binaryDer = window.atob(pemContents)
  const arrayBuffer = new Uint8Array(binaryDer.length)
  for (let i = 0; i < binaryDer.length; i++) {
    arrayBuffer[i] = binaryDer.charCodeAt(i)
  }

  // Import the key
  const cryptoKey = await crypto.subtle.importKey(
    'spki',
    arrayBuffer,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256'
    },
    true,
    ['encrypt']
  )

  // Encrypt the data
  const encoder = new TextEncoder()
  const encodedData = encoder.encode(data)
  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'RSA-OAEP'
    },
    cryptoKey,
    encodedData
  )

  // Convert to base64
  return btoa(String.fromCharCode(...new Uint8Array(encrypted)))
}
