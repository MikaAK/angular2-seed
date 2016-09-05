#!/usr/bin/env node

process.env.BABEL_ENV = 'tooling'

require('babel-register')
require('./cli').default()
