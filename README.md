
[![Build Status](https://travis-ci.com/stiftelsen-effekt/effekt-frontend.svg?token=s1qLcbzPb7xPzHqKnyfS&branch=master)](https://travis-ci.com/stiftelsen-effekt/effekt-frontend)

# effekt-frontend
Frontend for donation widget at gieffektivt.no. 

## Setup
Setting up the development environment requires a couple of steps. Third-party packages must be installed, sass-files must be compiled to css-files and Javascript-files must be bundled.

Installing the third party packages can be done using `npm` ([Node Package Manager](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)). Run the following command at the root level of the repository.

```
npm install
```

In addition we use [gulp](https://gulpjs.com/docs/en/getting-started/quick-start) as our build tool and it needs to be installed globally. 

```
npm install gulp -g
```

To compile sass-files to css-files and to bundle and minify Javascript-files run either of the following commands.

```
gulp build
``` 
```
npm build
```

This build process needs to be run before testing any local changes you've made.

To run the widget on your local machine complete the aforementioned steps and open `widget-host-local.htm` in your web browser.

By default the widget points to the production backend, but you can run the backend on your local machine if you prefer. Refer to the readme of the [backend repository](https://github.com/stiftelsen-effekt/effekt-backend) for instructions. If you are running the backend locally change the `api_url` variable in `script/helpers/network.js` to `http://localhost:80`.
