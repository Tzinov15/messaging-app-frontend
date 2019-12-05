# Frontend for Messaging App

## Things Learned

- Avataaars.io is super cool for generating random avatars if needed
- How to use `useEffect` to re-create `componentDidMount` behavior
- More deep dive on `useEffect`
  `useEffect` gets called AFTER render. A `console.log()` right before the `return()` command will log, and then any console.log statements inside of `useEffect()` will run

  After a render and before calling an effect, React will compare the array of values defined in the second parameter of the effect with the array defined in the same effect from the previous render. React will only call the effect when any value of the array has changed since the previous render.

  The same way, if we only want our effect to be called only after the first render, we have to pass an empty array [] (which never changes) as second parameter.

  Even if we pass `[]` as the 2nd parameter to `useEffect`, which will only cause the effect function to be called once per component, it will still be called _after_ the render, so it doesn't quite act like componentDidMount which (I believe?) gets called before the render

  An effect can optionally return a function (the cleanup function) that React will call when the component unmounts and before running the effect next time. In the example, our effect returns a function that unsubscribes it from the window resize events.

  https://blog.logrocket.com/react-hooks-cheat-sheet-unlock-solutions-to-common-problems-af4caf699e70/

  https://medium.com/@rossbulat/react-hooks-managing-web-sockets-with-useeffect-and-usestate-2dfc30eeceec

  useEffect simply takes a function as its one required argument. Everything within this argument will be run upon the componentDidMount and componentDidUpdate phases.
  Within this function, we can return another function that acts as component cleanup upon unmounting: E.g. the componentWillUnmount phase.
  Finally, after our function, useEffect can also take an optional array as its second argument, containing state values that must change for the re-render to take place.

  Why you can't reliable `console.log(stateVariable)` immediately after updating it using setState (or in React Hooks useState)
  https://stackoverflow.com/a/54867900

  When exactly does React clean up an effect? React performs the cleanup when the component unmounts. However, as we learned earlier, effects run for every render and not just once. This is why React also cleans up effects from the previous render before running the effects next time. We’ll discuss why this helps avoid bugs and how to opt out of this behavior in case it creates performance issues later below.

- Learned that React Router `state` object that you push when you hit routes must be serializable
  https://stackoverflow.com/questions/24425885/failed-to-execute-pushstate-on-history-error-when-using-window-history-pushs
- https://medium.com/the-andela-way/understanding-the-fundamentals-of-routing-in-react-b29f806b157e

  > > > For the browser-based applications we are building, the BrowserRouter and HashRouter are a good fit.
  > > > The BrowserRouter is used for applications which have a dynamic server that knows how to handle any type of URL whereas the HashRouter is used for static websites with a server that only responds to requests for files that it knows about.

- https://medium.com/front-end-weekly/3-things-you-didnt-know-about-the-foreach-loop-in-js-ff02cec465b1

## Resources Used

https://medium.com/@rossbulat/react-hooks-managing-web-sockets-with-useeffect-and-usestate-2dfc30eeceec

https://medium.com/simars/react-hooks-manage-life-cycle-events-tricks-and-tips-7ed13f52ba12
https://medium.com/trabe/react-useeffect-hook-44d8aa7cccd0

## Consideration

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
