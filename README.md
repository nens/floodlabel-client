Floodlabel-client
=================


TODO
----
- [ ]: Set proper e-mail address in src/components/House.tsx on line 6 (EXPERT_EMAIL_ADDRESS)

## Staging and production vs development.

Api calls to staging and production should not be relative, but they should
both start with demo.lizard.net.
This is done in /src/components/Search.tsx and /src/components/Result.tsx
with addBaseUrlToApiCall from /src/utils/getUrl.tsx.
demo.lizard.net is used, because this client should use the building
information from the Lizard backend (floodlabel.staging.lizard.net and
floodlabel.net do not have their own backend). Since there is no data about
this on staging and the app is read-only (not read-write), the production
server is also used for staging.

Dev uses the proxy provided in the package.json, because adding CORS for
localhost is probably not something we would want.

## Available Scripts

In the project directory, you can run:

### `yarn && yarn start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn && yarn build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## Deployment

Commits are automatically tested on "travis":
https://travis-ci.com/nens/floodlabel-client/, this basically makes sure `yarn
build` runs succesfully.

But travis also releases via https://artifacts.lizard.net/ (you can check the
upload status there).

- **Production**: master is automatically released to https://floodlabel.net
