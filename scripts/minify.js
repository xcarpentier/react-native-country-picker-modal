#!/usr/bin/env node

const fs = require('fs')

const [_, __, path] = process.argv

const parse = JSON.parse
const stringify = (data) => JSON.stringify(data, null, '')
const minify = (path) => stringify(parse(fs.readFileSync(path, 'utf-8')))
const save = (path, contentString) =>
  fs.writeFileSync(path, contentString, { encoding: 'utf8', flag: 'w' })

save(path, minify(path))
