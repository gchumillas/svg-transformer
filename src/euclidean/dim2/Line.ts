import {SquareMatrix} from "../SquareMatrix";
import {Point} from "./Point";
import {Transformation} from "./Transformation";
import {Vector} from "./Vector";

export class Line {
  public readonly origin: Point;
  public readonly direction: Vector;

  constructor(origin: Point, direction: Vector) {
    this.origin = origin;
    this.direction = direction;
  }

  // Gets the parallel line that contains the point [p].
  public getParallel(p: Point): Line {
    return new Line(p, this.direction);
  }

  // Gets the perpendicular line that contains the point [p].
  public getPerpendicular(p: Point): Line {
    return new Line(p, new Vector(-this.direction.y, this.direction.x));
  }

  // Is the line [l] parallel to [this] line?
  public isParallel(l: Line): boolean {
    const v0 = this.direction;
    const v1 = l.direction;

    return v0.x * v1.y === v1.x * v0.y;
  }

  // Gets the intersection between [this] line and the [l] line.
  public getIntersection(l: Line): Point {
    const [p0, p1] = [this.origin, l.origin];
    const [v0, v1] = [this.direction, l.direction];
    const m = new SquareMatrix(v0, v1.opposite());
    const v = p1.subtract(p0);
    const w = v.multiply(m.inverse());

    return p0.transform(new Transformation().translate(v0.scale(w.x)));
  }
}
