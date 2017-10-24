import {Point} from "../../euclidean/dim2/Point";
import {Transformation} from "../../euclidean/dim2/Transformation";
import {Vector} from "../../euclidean/dim2/Vector";
import {ITransformable} from "../../euclidean/Transformation";
import {SvgGraphicElement} from "./../SvgGraphicElement";

export class SvgGroup implements ITransformable {
  private _elements: SvgGraphicElement[];
  private _outerTopLeftCorner: Point;
  private _innerTopLeftCorner: Point;
  private _bottomRightCorner: Point;
  private _boundingBox: {x: number, y: number, width: number, height: number};
  private _transformation: Transformation;

  constructor(elements: SvgGraphicElement[]) {
    this._elements = elements;

    const outerPoints = this._getPoints((x, y, width, height) => [
      new Vector(0, 0),
      new Vector(width, 0),
      new Vector(width, height),
      new Vector(0, height)]);
    const innerPoints = this._getPoints((x, y, width, height) => [
      new Vector(x, y),
      new Vector(x + width, y),
      new Vector(x + width, y + height),
      new Vector(x, y + height)]);
    this._outerTopLeftCorner = this._getTopLeftCorner(outerPoints);
    this._innerTopLeftCorner = this._getTopLeftCorner(innerPoints);
    this._bottomRightCorner = this._getBottomRightCorner(innerPoints);
    this._boundingBox = {
      x: this._outerTopLeftCorner.x - this._innerTopLeftCorner.x,
      y: this._outerTopLeftCorner.y - this._innerTopLeftCorner.y,
      width: this._bottomRightCorner.x - this._innerTopLeftCorner.x,
      height: this._bottomRightCorner.y - this._innerTopLeftCorner.y};
    this._transformation = new Transformation()
      .translate(this._innerTopLeftCorner);
  }

  get boundingBox(): {x: number, y: number, width: number, height: number} {
    return this._boundingBox;
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

  public transform(t: Transformation): SvgGroup {
    const t0 = this.transformation;

    for (const elem of this._elements) {
      elem
        .transform(t0.inverse())
        .transform(t)
        .transform(t0);
    }

    return this;
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
