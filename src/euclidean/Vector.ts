import {Matrix} from "./Matrix";
import {ITransformable, Transformation} from "./Transformation";

export class Vector implements ITransformable {
  public readonly coordinates: number[];

  constructor(...coordinates: number[]) {
    this.coordinates = coordinates;
  }

  get length(): number {
    return this.coordinates.length;
  }

  public transform(t: Transformation): Vector {
    const v = new Vector(...this.coordinates.concat([1])).multiply(t);

    return new Vector(...v.coordinates.slice(0, -1));
  }

  // Returns [m] * [this]
  public multiply(m: Matrix): Vector {
    if (m.width !== this.length) {
      throw new Error(
        "The width of the matrix must match the length of the vector");
    }

    return new Vector(...m.transpose().vectors.map((vector, index) =>
      vector.coordinates.reduce(
        (prev, current, i) => prev + current * this.coordinates[i], 0)));
  }

  public opposite(): Vector {
    return new Vector(...this.coordinates.map((w: number) =>  -w));
  }

  // Returns [value] * [this]
  public scale(value: number): Vector {
    return new Vector(...this.coordinates.map((w: number) => value * w));
  }

  public sum(vector: Vector): Vector {
    if (this.length !== vector.length) {
      throw new Error("The vectors must have the same length");
    }

    return new Vector(...this.coordinates.map(
      (w: number, index: number) => w + vector.coordinates[index]));
  }

  public subtract(vector: Vector): Vector {
    return this.sum(vector.opposite());
  }

  // Gets the Euclidean Norm of [this] vector.
  public norm(): number {
    return Math.sqrt(this.coordinates.reduce((prev: number, w: number) =>
      prev + w * w, 0));
  }

  // Gets the unit vector of [this] vector.
  public unit(): Vector {
    return this.scale(1 / this.norm());
  }

  public toString(): string {
    return `[${this.coordinates.join(", ")}]`;
  }
}
