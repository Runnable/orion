# Orion
Orion, the huntsman, in charge of tracking our customers. A wrapper for Intercom

## Configuration

In order for Orion to report data to intercom you need the following API keys

```
INTERCOM_APP_ID
INTERCOM_API_KEY
```

## Usage

```
var orion = require('orion')
orion.upsertCompany({
  company_id: 'CompanyId',
  name: 'My Awesome Company Name'
})
```

## API

`upsertCompany` - Passes data through to intercom - https://developers.intercom.io/reference#create-or-update-company

