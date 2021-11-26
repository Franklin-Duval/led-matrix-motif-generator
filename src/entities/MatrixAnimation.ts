/**
 * model MatrixAnimation for representing an animation for a given matrix
 */

import Frame from './Frame';

export default class MatrixAnimation {
  frames: Frame[];

  constructor() {
    this.frames = [];
  }

  addFrame(frame: Frame) {
    this.frames.push(frame);
  }

  toString() {
    let res: string[] = [];
    for (let frame of this.frames) {
      let line: string = frame.export().join(' ');
      res.push(line);
    }
    return res.join('\n');
  }

  /* toBlob(): Blob {
    var bytes: number[] = [];
    for (let frame of this.frames) {
      const frame_bytes = frame.export();
    }

    const ia = new Uint8Array(bytes);
    const blob = new Blob([ia], {
      type: 'application/octet-stream',
    });

    return blob;
  } */

  export() {}
}
