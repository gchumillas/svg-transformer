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

  public determinant(): number {
    const vector = this.width > 0 ? this.vectors[0] : new Vector();
    const initVal = this.width > 0 ? 0 : 1;

    return vector.coordinates.reduce(
      (prev, current, index) =>
        prev + current * this._getCofactor(0, index), initVal);
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
