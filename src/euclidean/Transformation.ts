import {SquareMatrix} from "./SquareMatrix";
import {Vector} from "./Vector";

// TODO: implement `transformation` property
export interface ITransformable {
  transform(t: Transformation): ITransformable;
}

export class Transformation extends SquareMatrix implements ITransformable {
  constructor(...vectors: Vector[]) {
    super(...vectors);

    const test1 = vectors
      .slice(-1)
      .every((vector) => vector.coordinates.slice(-1)[0] === 1);
    if (!test1) {
      throw new Error("The last coordinate of the last vector must be 1");
    }

    const test2 = vectors
      .slice(0, -1)
      .every((vector) => vector.coordinates.slice(-1)[0] === 0);
    if (!test2) {
      throw new Error("The last coordinate of the first vectors must be 0");
    }
  }

  public inverse(): Transformation {
    const vectors = super.inverse().vectors;

    return new Transformation(
      ...vectors.slice(0, -1).map(
        (vector) => new Vector(
          ...vector.coordinates.slice(0, -1).concat([0]))).concat(
            vectors.slice(-1).map(
              (vector) => new Vector(
                ...vector.coordinates.slice(0, -1).concat([1])))));
  }

  public transform(t: Transformation): Transformation {
    return new Transformation(...t.multiply(this).vectors);
  }
}
