![logo](http://files.rdev.im/github-now-mobile.png)

## About

This is the repo of a mobile app for ZEIT's [Now](https://now.sh) platform built with React Native.

## Contributing

If you want to contribute, here's how to work with the project:

- Make sure you have React Native installed (`npm install -g react-native-cli`)
- Clone the repo
- Run `npm install` or `yarn`
- Run `react-native start` to start the packager
- Run `react-native run-ios` to start the app in the simulator

### Swifty parts

Today extensions and Apple Watch companion app are built with Swift. Why? Well, for the Watch it's not possible to use React Native. As for Today widgets, while [it is possible](https://github.com/matejkriz/react-native-today-widget) to build Today widgets with React Native, iOS puts an insane memory limit of 16MB on Today extensions, most of which will be eaten up by RN and I didn't want to worry about it. 
Also it was all part of my ongoing effort to learn Swift 🙈

#### Swift <-> JS

All the necessary data is still passed to extensions from JS, but the extensions themselves are native. Today widgets use [Shared App Groups](https://developer.apple.com/library/archive/documentation/General/Conceptual/WatchKitProgrammingGuide/SharingData.html) and Watch uses [Watch Connectivity](https://developer.apple.com/documentation/watchconnectivity) to pass authentication data to the Watch.

### CocoaPods and .xcworkspace

Watch app uses CocoaPods, so if you want to launch the app from Xcode, you should use the `.xcworkspace` instead of `.xcproject` to open the project.

## Bugs

There's most likely a bunch of them, especially in Swift sections since I don't know Swift that well.
If you find any, please [report them](https://github.com/rdev/now-mobile/issues/new) and they shall be fixed. Also contributions are very welcome :) 

## TODO

- [ ] Deployment details screen on tap
- [ ] Cache latest state and show it on startup before loading from network. This is already beind done on the Watch so it's only fair main app has it
- [ ] Simplify `Provider` component (?)
- [ ] Flow types improvements
- [ ] Android version. It's basically good to go but there's gonna be mandatory Android bugs to sort out
- [ ] Today extension auth handling
- [ ] Tests
- [ ] Fastlane (?)

## Disclamer

This is **not** an official ZEIT software.

It just uses ZEIT's APIs, some of which is copied from [Now Desktop](https://github.com/zeit/now-desktop) and isn't documented on the official website.

If you have any questions or issues with this app, please don't bug people of ZEIT about it and just [file an issue](https://github.com/rdev/now-mobile/issues/new) on this repo.
