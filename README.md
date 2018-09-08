This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## An Inevitable Solutions Product

Lets call this custom boilerplate code for now.

Just add firebase and/or graphql credentials and be on your way.
Change the app name in the package.json file and the folder name.
Delete the .git folder and run git init and you have a brand new project! :) 

Libraries present:

* `firebase` please populate the api keys acordingly
* `re-base` to communicate with firebase
* `react-activity` this is for the loader animation
* `styled-components` practically every styled component
* `react-router-dom` for some reason it isn't present in the box
* `react-custom-scrollbars` cause everyone could use a nicer scrollbar, and more control
* `react-icons-kit` for icons man!
* `axios` for api call handling

Database configuration inputs:

Integrating a Firebase project is a must for authentication, to make the app work place your values in `./src/utils/base.js`

If you are using prisma and graphql, make sure you place your values in `./prisma/prisma.yml`, `App.js` and `Api.js`