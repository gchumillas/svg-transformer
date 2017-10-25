import {Point} from "../../euclidean/dim2/Point";
import {Transformation} from "../../euclidean/dim2/Transformation";
import {Vector} from "../../euclidean/dim2/Vector";
import {SvgGraphicElement} from "./../SvgGraphicElement";

// NOTE: `bounding box` is not the smallest box. See: getBoundingClientRect()
export class SvgGroup {
  private _elements: SvgGraphicElement[];
  private _topLeftCorner: Point;
  private _bottomRightCorner: Point;
  private _width: number;
  private _height: number;
  private _transformation: Transformation;

  constructor(elements: SvgGraphicElement[]) {
    this._elements = elements;

    const points = this._getPoints((x, y, width, height) => [
      new Vector(x, y),
      new Vector(x + width, y),
      new Vector(x + width, y + height),
      new Vector(x, y + height)]);
    this._topLeftCorner = this._getTopLeftCorner(points);
    this._bottomRightCorner = this._getBottomRightCorner(points);
    this._width = this._bottomRightCorner.x - this._topLeftCorner.x;
    this._height = this._bottomRightCorner.y - this._topLeftCorner.y;
    this._transformation = new Transformation()
      .translate(this._topLeftCorner);
  }

  get width(): number {
    return this._width;
  }

  get height(): number {
    return this._height;
  }

  get transformation(): Transformation {
    return this._transformation;
  }

  set transformation(value: Transformation) {
    // applies the transformation to each element
    const t0 = this._transformation.inverse();
    for (const elem of this._elements) {
      elem.transformation = elem.transformation.transform(t0).transform(value);
    }

    this._transformation = value;
  }

  private _getPoints(
    getCorners: (
      x: number,
      y: number,
      width: number,
      height: number) => [Point, Point, Point, Point]): Point[] {
    const points: Point[] = [];

    for (const element of this._elements) {
      const t = element.transformation;
      const {x, y, width, height} = element.boundingBox;
      const corners = getCorners(x, y, width, height);

      points.push(...corners.map((p) => p.transform(t)));
    }

    return points;
  }

  private _getDiagonalCorner(
    points: Vector[],
    comparator: (...values: number[]) => number,
    initValue: number): Vector {
    const [x, y] = [0, 1].map((i) => points
        .map((point) => point.coordinates[i])
        .reduce((prev, curr) => comparator(prev, curr), initValue));

    return new Vector(x, y);
  }

  private _getTopLeftCorner(points: Vector[]): Point {
    return this._getDiagonalCorner(points, Math.min, Number.POSITIVE_INFINITY);
  }

  private _getBottomRightCorner(points: Vector[]): Vector {
    return this._getDiagonalCorner(points, Math.max, Number.NEGATIVE_INFINITY);
  }
}
