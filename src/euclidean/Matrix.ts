import {Vector} from "./Vector";

export class Matrix {
  public readonly vectors: Vector[];

  constructor(...vectors: Vector[]) {
    this.vectors = vectors;

    const height = this.height;
    if (!vectors.every((vector) => vector.length === height)) {
      throw new Error("All vectors must have the same length");
    }
  }

  get width(): number {
    return this.vectors.length;
  }

  get height(): number {
    return this.width > 0 ? this.vectors[0].length : 0;
  }

  // Returns [value] * [this]
  public scale(value: number): Matrix {
    return new Matrix(...this.vectors.map((vector) => vector.scale(value)));
  }

  public transpose(): Matrix {
    const height = this.height;
    const width = this.width;
    const vectors = [];

    for (let i = 0; i < height; i++) {
      const coords = [];
      for (let j = 0; j < width; j++) {
        coords.push(this.vectors[j].coordinates[i]);
      }
      vectors.push(new Vector(...coords));
    }

    return new Matrix(...vectors);
  }

  public multiply(m: Matrix): Matrix {
    if (this.width !== m.height) {
      throw new Error(
        "The width of [this] matrix must match the height of the matrix");
    }

    return new Matrix(...m.vectors.map((vector) => vector.multiply(this)));
  }

  public toString(): string {
    return this.vectors.map((vector) => vector.toString()).join("\n");
  }
}
