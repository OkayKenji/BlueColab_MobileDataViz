# AquaWatch Mobile Frontend

This folder contains the various files related to the application.

## Tech Stack
-   Languages + Bundler
    -   [JavaScript 🔗](https://www.typescriptlang.org/)
    -   [Metro 🔗](https://metrobundler.dev/) (Bundler. under the hood)
-   Framework
    -   [React Native 🔗](https://reactnative.dev/)
-   UI Components
    -   [Expo 🔗](https://expo.dev/)
-   Deploy
    -   Expo CLI

## Prerequisites (required)
 - [git 🔗](https://git-scm.com/) - version control. For installing git, please see the [git website 🔗](https://git-scm.com/).
 - [npm 🔗](https://www.npmjs.com/) - package manager. For installing npm, please see [npm docs 🔗](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
 - [Android Studio 🔗](https://developer.android.com/studio) or Test Flight (Apple). This will take a while and take a good chuck of space. Start a device emulator. For more info see [here 🔗](https://developer.android.com/codelabs/basic-android-kotlin-compose-emulator#2) (these are technically not required but highly recommended).
 - Expo Go on iOS and Android - to test the app
 - All other prerequisites are node_packages. To install them see 'Getting Started'.

## Prerequisites (recommended)
 - [VS Code 🔗](https://code.visualstudio.com/) - code editor. Feel free to use any other but this is generally recommend.

## Getting Started
1. Install all the above prerequisites. Instructions on how are linked above.
2. Open a terminal in this directory ``../BlueColab_MobileDataViz/aquawatch_mobile_app/``
3. Run ``npm i``, it installs all needed node_packages and expo. It may take a few minutes to install everything.

## Running locally on computer
1. Start a device emulator on your computer.
2. Run ``npx expo start`` (should be installed with node) in terminal window. Expo should be installed when you do ``npm i``.
3. On the terminal, there will be instructions to start the app in emulator. (For example, pressing A key should start the app in an Android emulator)

## Running locally on mobile device
1. Run ``npx expo start`` (should be installed with node) in terminal window. Expo should be installed when you do ``npm i``.
2. After running the above, a QR code should pop up. Make sure your computer and phone are on the same WiFi network. Scan the QR Code that pops up with your phone.
3. The Expo Go app should open - with our app loaded! The first time running the app takes loading time. 

For instructions on deploying, please see our [GitHub Wiki](https://github.com/bluecolab/BlueColab_MobileDataViz/wiki/Frontend-Deployment).
