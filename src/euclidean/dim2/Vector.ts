import {Matrix} from "../Matrix";
import {Transformation} from "../Transformation";
import {Vector as GeneralVector} from "../Vector";

export class Vector extends GeneralVector {
  constructor(x: number, y: number) {
    super(x, y);
  }

  get x(): number {
    return this.coordinates[0];
  }

  get y(): number {
    return this.coordinates[1];
  }

  public multiply(m: Matrix): Vector {
    const v = super.multiply(m);
    const [x, y] = v.coordinates;

    return new Vector(x, y);
  }

  public transform(t: Transformation): Vector {
    const v = super.transform(t);
    const [x, y] = v.coordinates;

    return new Vector(x, y);
  }

  public opposite(): Vector {
    const v = super.opposite();
    const [x, y] = v.coordinates;

    return new Vector(x, y);
  }

  public scale(value: number): Vector {
    const v = super.scale(value);
    const [x, y] = v.coordinates;

    return new Vector(x, y);
  }

  public sum(vector: Vector): Vector {
    const v = super.sum(vector);
    const [x, y] = v.coordinates;

    return new Vector(x, y);
  }

  public subtract(vector: Vector): Vector {
    const v = super.subtract(vector);
    const [x, y] = v.coordinates;

    return new Vector(x, y);
  }

  public unit(): Vector {
    const v = super.unit();
    const [x, y] = v.coordinates;

    return new Vector(x, y);
  }
}
