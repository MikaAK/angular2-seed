angular2-seed
===

*Requires Node >= 0.12*

## Included
This includes angular2 built with webpack and has testing setup. It has the the ability to upload to S3.
If you do not wish to upload to S3 make sure to disable that part of the config in the webpack config.

##### Directives
Comes with a few directives
- Modal
- Tabs

##### Styles
Uses ITCSS styles and has setup for that. Also a few helper classes and btn, forms and resets
and other useful things

## Getting Started
When you start the application it will be setup on port `4000`

###### Steps
- Run `npm install` in root directory
- Run `npm link` (or prefix all commands with ./node_modules/bin/webpack-ng2-seed instead of just webpack-ng2-seed)
- Run `mv .env.sample .env` and fill in the strings

## Commands
This seed makes use of a cli tool. Run `webpack-ng2-seed` to see a list of options.

## Vendor Imports
To add a vendor file such as `@angular/core` that add it to `./src/vendor.ts`
To add a polyfill file such as `babel-polyfill` that add it to `./src/polyfill.ts`

## Things to Note
When in sass files and need variables and includes use `@import 'myModule/path';`

By default `rxjs/add/operators/map` is imported to include map for HTTP. Make sure to remove this if unwanted.

You must have a trailing slash for CDN_URL
