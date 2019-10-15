# gatsby-source-zwimlo
Plugin for creating [GatsbyJS](https://gatsbyjs.org) content and asset nodes based on [zwimlo](https://zwimlo.io) as a data source. It retrieves data from delivery or preview based on the configuration settings in your gatsby-config.js.

## Install
with yarn  
`yarn add gatsby-source-zwimlo`

with npm  
`npm install --save gatsby-source-zwimlo`

## How to use the plugin
```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    // You can have multiple instances of this plugin
    //   to read source nodes from different locations on your
    //   filesystem.
    {
      resolve: "gatsby-source-zwimlo",
      options: {
        // REQUIRED
        // Add your site ID, which is part of the URI for your requests
        siteId: 'Your zwimlo siteId',
        // REQUIRED if site is proteced otherwise could be left empty otherwise OPTIONAL
        //   An empty toke means your site is not procteced thus does not require a token
        //   - deliveryToken reflects your Delivery Access Token
        //   - previewToke reflects your Preview Access Token
        deliveryToken: '',
        previewToken: '',
        // OPTIONAL
        //   Set preview to true if you want preview data. This parameter is entirely
        //   optional and could be left out for production data. false delivers
        //   production data from content URI
        preview: false,
        // OPTIONAL
        //   Set to true outputs debugging information otherwise plugin is quite silent
        verboseOutput: false
      },
    },
  ],
}
```

## Queries
The plugin creates two new nodes types zwimloAsset and zwimloContent. Both types could be queried with GraphQL as usual.

## Thanks
For all inspirations and code examples.
