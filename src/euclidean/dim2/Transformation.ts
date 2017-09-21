import {Transformation as GeneralTransformation} from "../Transformation";
import {Vector as GeneralVector} from "../Vector";
import {Point} from "./Point";
import {Vector} from "./Vector";

export class Transformation extends GeneralTransformation {

  public static createFromValues(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number): Transformation {
    return new Transformation(
      new GeneralVector(a, b, 0),
      new GeneralVector(c, d, 0),
      new GeneralVector(e, f, 1));
  }

  constructor(...vectors: GeneralVector[]) {
    if (vectors.length === 0) {
      vectors.push(new GeneralVector(1, 0, 0));
      vectors.push(new GeneralVector(0, 1, 0));
      vectors.push(new GeneralVector(0, 0, 1));
    }

    super(...vectors);
  }

  public transform(t: Transformation): Transformation {
    return new Transformation(...super.transform(t).vectors);
  }

  public inverse(): Transformation {
    return new Transformation(...super.inverse().vectors);
  }

  public translate(v: Vector): Transformation {
    return this.transform(new Transformation(
      new GeneralVector(1, 0, 0),
      new GeneralVector(0, 1, 0),
      new GeneralVector(v.x, v.y, 1)));
  }

  public rotate(angle: number): Transformation {
    const ret: Transformation = null;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return this.transform(new Transformation(
      new GeneralVector(cos, sin, 0),
      new GeneralVector(-sin, cos, 0),
      new GeneralVector(0, 0, 1)));
  }

  public scale(value: number|Vector): Transformation {
    const xScale = value instanceof Vector ? value.x : value;
    const yScale = value instanceof Vector ? value.y : value;

    return this.transform(new Transformation(
      new GeneralVector(xScale, 0, 0),
      new GeneralVector(0, yScale, 0),
      new GeneralVector(0, 0, 1)));
  }

  public skew(value: number|Vector): Transformation {
    const xTan = value instanceof Vector ? Math.tan(value.x) : Math.tan(value);
    const yTan = value instanceof Vector ? Math.tan(value.y) : Math.tan(value);

    return this.transform(new Transformation(
      new GeneralVector(1, yTan, 0),
      new GeneralVector(xTan, 1, 0),
      new GeneralVector(0, 0, 1)));
  }

  public toString(): string {
    const [v0, v1, v2] = this.vectors;
    const [a, b] = v0.coordinates;
    const [c, d] = v1.coordinates;
    const [e, f] = v2.coordinates;

    return `matrix(${a} ${b} ${c} ${d} ${e} ${f})`;
  }
}
