# Orion

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/Runnable/orion.svg?branch=master)](https://travis-ci.org/Runnable/orion)
[![Code Climate](https://codeclimate.com/github/Runnable/orion/badges/gpa.svg)](https://codeclimate.com/github/Runnable/orion)
[![Dependency Status](https://david-dm.org/Runnable/orion.svg)](https://david-dm.org/Runnable/orion)
[![devDependency Status](https://david-dm.org/Runnable/orion/dev-status.svg)](https://david-dm.org/Runnable/orion/dev-status.svg)

[![NPM](https://nodei.co/npm/@runnable/orion.svg?compact=true)](https://nodei.co/npm/@runnable/orion)

Orion, the huntsman, in charge of tracking our customers. A wrapper for Intercom

![Orion](http://cdn.farmersalmanac.com/wp-content/uploads/2015/12/orion-blog-600x400.jpg)

## Configuration

In order for Orion to report data to intercom you need the following API keys

```
INTERCOM_APP_ID
INTERCOM_API_KEY
```

## Usage

```
var orion = require('orion')
orion.companies.create({
  company_id: 'CompanyId',
  name: 'My Awesome Companies Name'
})
```

