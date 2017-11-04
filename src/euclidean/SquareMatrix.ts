import {Matrix} from "./Matrix";
import {Vector} from "./Vector";

export class SquareMatrix extends Matrix {
  constructor(...vectors: Vector[]) {
    super(...vectors);

    if (this.width !== this.height) {
      throw new Error("The width and the height of [this] matrix must match");
    }
  }

  public scale(value: number): SquareMatrix {
    return new SquareMatrix(...super.scale(value).vectors);
  }

  public transpose(): SquareMatrix {
    return new SquareMatrix(...super.transpose().vectors);
  }

  public adjoint(): SquareMatrix {
    return new SquareMatrix(...this.vectors.map((vector, col) =>
      new Vector(...vector.coordinates.map((value, row) =>
        this._getCofactor(col, row))))).transpose();
  }

  // TODO: optimize for 2x2 and 3x3
  public determinant(): number {
    if (this.width === 1) {
      const [v0] = this.vectors;
      const [a0] = v0.coordinates;

      return a0;
    } else if (this.width === 2) {
      const [v0, v1] = this.vectors;
      const [a00, a01] = v0.coordinates;
      const [a10, a11] = v1.coordinates;

      return a00 * a11 - a01 * a10;
    } else if (this.width === 3) {
      const [v0, v1, v2] = this.vectors;
      const [a00, a01, a02] = v0.coordinates;
      const [a10, a11, a12] = v1.coordinates;
      const [a20, a21, a22] = v2.coordinates;

      return (a00 * a11 * a22) + (a02 * a10 * a21) + (a01 * a12 * a20)
        - (a02 * a11 * a20) - (a00 * a12 * a20) - (a01 * a10 * a22);
    } else {
      const vector = this.width > 0 ? this.vectors[0] : new Vector();
      const initVal = this.width > 0 ? 0 : 1;

      return vector.coordinates.reduce(
        (prev, current, index) =>
          prev + current * this._getCofactor(0, index), initVal);
    }
  }

  public inverse(): SquareMatrix {
    return  this.adjoint().scale(1 / this.determinant());
  }

  private _getCofactor(col: number, row: number): number {
    const sign = (col + row) % 2 > 0 ? -1 : +1;
    const m = new SquareMatrix(...this.vectors.filter(
      (vector, index) => index !== col).map(
        (vector, index) => new Vector(
          ...vector.coordinates.filter((value, i) => i !== row))));

    return sign * m.determinant();
  }
}
