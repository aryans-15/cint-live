import { NextResponse } from 'next/server'
import crypto from 'crypto'

const BASE_URL = 'https://polygon.codeforces.com/api'
const METHOD_NAME = 'problems.list'

function makeApiSig(time, rand, params) {
  const seed = String(rand)
  const qs = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  const payload = `${seed}/${METHOD_NAME}?${qs}#${process.env.CF_API_SECRET}`
  const hash = crypto.createHash('sha512').update(payload).digest('hex')
  return seed + hash
}

export async function GET() {
  const time = Math.floor(Date.now() / 1000)
  const rand = Math.floor(100000 + Math.random() * 900000)
  const params = {
    apiKey: process.env.NEXT_PUBLIC_CF_API_KEY,
    time: String(time),
  }

  const apiSig = makeApiSig(time, rand, params)
  const url = new URL(`${BASE_URL}/${METHOD_NAME}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  url.searchParams.set('apiSig', apiSig)
  const res = await fetch(url.toString())
  const json = await res.json()

  if (json.status !== 'OK') {
    console.error('[Polygon]', json.comment)
    return NextResponse.json(
      { error: json.comment || 'Polygon API error' },
      { status: 502 }
    )
  }

  const problemIds = (json.result || []).map(p => p.id)
  return NextResponse.json({ problemIds })
}