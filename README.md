# Orion
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

