/**
 * model RawAnimation for representing an animation as a set of matrix animations
 */

import MatrixAnimation from './MatrixAnimation';
export default class RawAnimation {
  matrixAnimations: MatrixAnimation[];

  constructor(n: number) {
    this.matrixAnimations = [];
    for (let i = 0; i < n; i++) {
      this.matrixAnimations.push(new MatrixAnimation());
    }
  }

  export() {
    var res = [];
    for (let matrixAnimation of this.matrixAnimations) {
      res.push(matrixAnimation.toString());
    }

    return res;
  }
}
