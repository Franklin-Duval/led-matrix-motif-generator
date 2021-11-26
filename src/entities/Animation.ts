/**
 * Model Animation to represent a general animation in a display
 *
 * attributes:
 *    - frames: Frame[]
 *
 * Methods:
 *    - addFrame(frame: Frame)
 *    - deleteFrame(frame: Frame)
 *    - export()
 */

import DisplayFrame from './DisplayFrame';
import RawAnimation from './RawAnimation';

export default class AppAnimation {
  displayFrames: DisplayFrame[];

  constructor(state: [number[][]][]) {
    this.displayFrames = [];

    for (let displayFrame of state) {
      this.displayFrames.push(new DisplayFrame(displayFrame));
    }
  }

  toRawAnimation(): RawAnimation {
    /**
     * create a rowAnimation
     *
     * for each displayFrame of this.frames {
     *    for i = 0..this.displayFrame.frames.length {
     *    // for each matrixFrame of displayFrame, push it to the corresponding MatrixAnimation
     *      rowAnimation.matrixAnimations[i].push(this.displayFrame.frames[i])
     *    }
     *
     *    return RawAnimation
     * }
     */

    const n: number = this.displayFrames[0].frames.length;
    let rawAnimation: RawAnimation = new RawAnimation(n);

    for (let displayFrame of this.displayFrames) {
      for (let i = 0; i < n; i++) {
        rawAnimation.matrixAnimations[i].addFrame(displayFrame.frames[i]);
      }
    }

    return rawAnimation;
  }
}
