#!/usr/bin/env node

const AWS = require('aws-sdk')
const createCredstash = require('nodecredstash')

const toContext = str => {
  const context = {}
  str.split(',')
    .map(pair => pair.trim().split('='))
    .forEach(([k, v]) => {
      context[k] = v
    })

  return context
}

const args = require('minimist')(process.argv.slice(2), {
  alias: {
    p: 'profile',
    r: 'region',
    t: 'table',
    b: 'bucket',
    k: 'key',
    a: 'algorithm',
    v: 'version',
    e: 'encoding',
    c: 'context',
  },
  default: {
    region: 'us-east-1',
    algorithm: 'aes-256-ctr',
    key: 'alias/credstash',
    digest: 'SHA256',
    encoding: 'utf8'
  }
})

const {
  // aws
  profile,
  region,

  // store
  table,
  bucket,
  folder,

  // operation
  key,
  version,
  algorithm,
  digest,
  encoding,
  context,
} = args

console.log(`OPTIONS:

region:     ${region}
key:        ${key}
algorithm:  ${algorithm}
digest:     ${digest}
`)

const awsClientOpts = {}

if (profile) {
  AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile })
}

if (region) {
  awsClientOpts.region = region
  AWS.config.update({ region })
}

const [method, ...opArgs] = args._
const opts = { version }

switch (method) {
  case 'put':
    opts.name = opArgs.shift()
    opts.secret = Buffer.from(opArgs.shift())
    opts.digest = digest
    opts.context = toContext(context)
    break
  case 'get':
    opts.name = opArgs.shift()
    opts.context = toContext(context)
    break
  case 'list':
    if (opArgs.length && !opArgs[0].includes('=')) {
      opts.name = opArgs.shift()
    }

    break
  default:
    break
}

let store
if (bucket) {
  store = createCredstash.store.s3({
    client: new AWS.S3(awsClientOpts),
    bucket,
    folder
  })
}

const credstash = createCredstash({
  table,
  store,
  kmsKey: key,
  algorithm,
})

const postProcess = result => {
  if (method === 'get' && encoding) {
    return result.toString(encoding)
  }

  return result
}

credstash[method](opts)
  .then(
    postProcess,
    err => console.error(err.stack)
  )
  .then(result => {
    if (typeof result !== 'undefined') {
      console.log('VALUE:\n')
      console.log(result)
    }
  })
