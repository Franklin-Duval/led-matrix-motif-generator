/**
 * model Frame to represent the state of a matrix at a given time.
 *
 * attributes:
 *    - state: boolean[8][8]
 *
 * methods:
 *    - export()
 *    - update(frame: Frame)
 *    - update(operation: func)
 */

export default class Frame {
  state: string[];

  constructor(state: number[][]) {
    this.state = [];

    for (let i = 0; i < 8; i++) {
      const line = state[i];
      let str = '0b';
      for (let j = 0; j < 8; j++) {
        str += line[j].toString();
      }
      const line_hex = Number(str).toString(16);
      if (line_hex === '0') {
        this.state.push('00');
      } else {
        this.state.push(line_hex);
      }
      // const line_byte = Number(str);
      // this.state.push(line_byte);
    }
  }

  export(): string[] {
    let res = [];
    for (let elt of this.state) {
      res.push(elt);
    }

    return res;
  }
}
