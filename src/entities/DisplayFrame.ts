/***
 * model Display Frame for representing a frame of a general Animation
 */

import Frame from './Frame';

export default class DisplayFrame {
  frames: Frame[];

  constructor(state: number[][][]) {
    this.frames = [];

    for (let frame of state) {
      this.frames.push(new Frame(frame));
    }
  }
}
