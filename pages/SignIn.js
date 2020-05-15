import React from 'react';
import {View, StyleSheet, Dimensions, StatusBar} from 'react-native';
import {
  TapGestureHandler,
  State,
  TextInput,
} from 'react-native-gesture-handler';
import Animated, {
  block,
  cond,
  eq,
  set,
  startClock,
  stopClock,
  clockRunning,
  debug,
  timing,
  interpolate,
  concat,
  Extrapolate,
  Value,
  Easing,
  Clock,
} from 'react-native-reanimated';
import SVG, {Image, Circle, ClipPath} from 'react-native-svg';
import SignInButton from '../components/SignInButton';

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(
      clockRunning(clock),
      [
        // if the clock is already running we update the toValue, in case a new dest has been passed in
        set(config.toValue, dest),
      ],
      [
        // if the clock isn't running we reset all the animation params and start the clock
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock),
      ],
    ),
    // we run the step here that is going to update position
    timing(clock, state, config),
    // if the animation is over we stop the clock
    cond(state.finished, debug('stop clock', stopClock(clock))),
    // we made the block return the updated position
    state.position,
  ]);
}

export default function SignIn() {
  let buttonOpacity = new Animated.Value(1);

  let buttonY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [100, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  let buttonZIndex = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [-1, 1],
    extrapolate: Extrapolate.CLAMP,
  });

  let bgY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [-height / 3 - 70, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  let formContainerZIndex = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, -1],
    extrapolate: Extrapolate.CLAMP,
  });

  let formContainerOpacity = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [1, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  let formContainerY = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [0, 100],
    extrapolate: Extrapolate.CLAMP,
  });

  let formContainerCloseBtnTextRotate = interpolate(buttonOpacity, {
    inputRange: [0, 1],
    outputRange: [180, 360],
    extrapolate: Extrapolate.CLAMP,
  });

  const bgHeight = height + 50;

  const onFormOpen = Animated.event(
    [
      {
        nativeEvent: ({state}) =>
          block([
            cond(
              eq(state, State.END),
              set(buttonOpacity, runTiming(new Clock(), 1, 0)),
            ),
          ]),
      },
    ],
    {listener: (event) => console.log(event)},
  );

  const onFormClose = Animated.event([
    {
      nativeEvent: ({state}) =>
        block([
          cond(
            eq(state, State.END),
            set(buttonOpacity, runTiming(new Clock(), 0, 1)),
          ),
        ]),
    },
  ]);
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <Animated.View
        style={{...styles.imageContainer, transform: [{translateY: bgY}]}}>
        <SVG height={bgHeight} width={width}>
          <ClipPath id="bgCurve">
            <Circle r={bgHeight} cx={width / 2} />
          </ClipPath>
          <Image
            href={require('../assets/bg-phone.jpg')}
            height={bgHeight}
            width={width}
            preserveAspectRatio={'xMidYMid slice'}
            clipPath="url(#bgCurve)"
          />
        </SVG>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <TapGestureHandler onHandlerStateChange={onFormOpen}>
          <Animated.View
            style={{
              zIndex: buttonZIndex,
              opacity: buttonOpacity,
              transform: [{translateY: buttonY}],
            }}>
            <SignInButton
              text={'Sign In'}
              customStyles={{
                containerStyles: {...styles.button},
              }}
            />
          </Animated.View>
        </TapGestureHandler>

        <Animated.View
          style={{
            zIndex: buttonZIndex,
            opacity: buttonOpacity,
            transform: [{translateY: buttonY}],
          }}>
          <SignInButton
            text={'Sign In With Facebook'}
            customStyles={{
              containerStyles: {...styles.button, ...styles.buttonFaceBook},
              textStyles: {...styles.buttonFaceBookText},
            }}
          />
        </Animated.View>

        <Animated.View
          style={{
            ...styles.formContainer,
            zIndex: formContainerZIndex,
            opacity: formContainerOpacity,
            transform: [{translateY: formContainerY}],
          }}>
          <TapGestureHandler onHandlerStateChange={onFormClose}>
            <Animated.View style={styles.formContainerCloseBtn}>
              <Animated.Text
                style={{
                  ...styles.formContainerCloseBtnText,
                  transform: [
                    {rotate: concat(formContainerCloseBtnTextRotate, 'deg')},
                  ],
                }}>
                X
              </Animated.Text>
            </Animated.View>
          </TapGestureHandler>
          <TextInput
            placeholder="Email"
            placeholderTextColor={'#323232'}
            style={styles.textInput}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={'#323232'}
            secureTextEntry={true}
            style={styles.textInput}
          />
          <Animated.View>
            <SignInButton
              text={'Sign In'}
              customStyles={{
                containerStyles: {
                  ...styles.button,
                  ...styles.formSignInButton,
                },
              }}
            />
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

const {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
  },
  imageContainer: {
    ...StyleSheet.absoluteFill,
  },
  image: {
    width: null,
    height: null,
    flex: 1,
  },
  buttonContainer: {
    height: height / 3,
    justifyContent: 'center',
  },
  button: {
    height: 70,
    marginHorizontal: 20,
    borderRadius: 35,
    marginVertical: 5,
  },

  buttonFaceBook: {
    backgroundColor: '#0078D7',
  },
  buttonFaceBookText: {
    color: '#fff',
  },
  formContainer: {
    height: height / 3,
    ...StyleSheet.absoluteFillObject,
    top: null,
    justifyContent: 'center',
  },
  formContainerCloseBtn: {
    position: 'absolute',
    top: -40,
    left: width / 2 - 20,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  formContainerCloseBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  textInput: {
    height: 50,
    marginHorizontal: 20,
    marginVertical: 5,
    paddingLeft: 12,
    borderWidth: 0.5,
    borderRadius: 25,
    fontSize: 16,
  },
  formSignInButton: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
