import {Point} from "../euclidean/dim2/Point";
import {Transformation} from "../euclidean/dim2/Transformation";
import {Vector} from "../euclidean/dim2/Vector";
import {SquareMatrix} from "../euclidean/SquareMatrix";
import {Dragger} from "./ElementTransformer/Dragger";
import {Handle} from "./ElementTransformer/Handle";
import {SvgElement} from "./SvgElement";
import {SvgGraphicElement} from "./SvgGraphicElement";
import {SvgPath} from "./SvgPath";

// A decorator class to 'transform' (resize, scale or rotate) an SVG element.
export class ElementTransformer {
  private _target: SvgGraphicElement;
  private _container: SvgGraphicElement;
  private _path: SvgGraphicElement;
  private _dragger: Dragger;
  private _rotateHandle: Handle;
  private _handles: Handle[];

  constructor(_target: SvgGraphicElement) {
    this._target = _target;

    // creates the _container group
    const canvas = this._target.ownerElement;
    this._container = new SvgGraphicElement("g");
    this._container.transform(this._target.transformation);
    canvas.append(this._container);

    this._createPath();
    this._createDragger();
    this._createRotateHandle();
    this._createResizeHandles();
  }

  get target(): SVGGraphicsElement {
    return this._target.nativeElement;
  }

  get container(): SVGGraphicsElement {
    return this._container.nativeElement;
  }

  public remove(): void {
    for (const handle of this._handles) {
      handle.remove();
    }

    this._path.remove();
    this._dragger.remove();
    this._rotateHandle.remove();
    this._container.remove();
  }

  private _createPath(): void {
    const box = this._target.boundingBox;

    this._path = new SvgPath()
      .moveTo(new Vector(box.x + box.width / 2, box.y - 30))
      .lineTo(new Vector(box.x + box.width / 2, box.y))
      .lineTo(new Vector(box.x, box.y))
      .lineTo(new Vector(box.x, box.y + box.height))
      .lineTo(new Vector(box.x + box.width, box.y + box.height))
      .lineTo(new Vector(box.x + box.width, box.y))
      .lineTo(new Vector(box.x + box.width / 2, box.y));

    this._container.append(this._path);
  }

  // The 'dragger' is used to move the image. It consists of a transparent
  // rectangle placed over the image.
  private _createDragger(): void {
    const self = this;
    const box = this._target.boundingBox;
    let p0: Point;
    let t0: Transformation;

    // creates a 'dragger' and places it over the image
    this._dragger = new Dragger();
    this._dragger.position = new Vector(box.x, box.y);
    this._dragger.width = box.width;
    this._dragger.height = box.height;
    this._container.append(this._dragger);

    this._dragger
      .onStartDragging((p) => {
        t0 = self._container.transformation;
        p0 = p;
      })
      .onDragging((p1) => {
        const v = p1.subtract(p0);

        self._container.transformation = t0.translate(v);
        self._target.transformation = self._container.transformation;
      });
  }

  // The 'Rotate handle' is ued to rotate the image. It is placed on the top of
  // the image.
  private _createRotateHandle(): void {
    const self = this;
    const box = this._target.boundingBox;
    let center: Point;
    let p0: Point;
    let t0: Transformation;

    // creates a handle and places it on the top of the transformation tool
    this._rotateHandle = new Handle();
    this._rotateHandle.position = new Vector(box.x + box.width / 2, box.y - 30);
    this._container.append(this._rotateHandle);

    this._rotateHandle
      .onStartDragging((p) => {
        center = self._getCenter();
        t0 = self._container.transformation;
        p0 = p;
      })
      .onDragging((p1) => {
        const c = center.transform(t0);
        const angle = _getAdjacentAngle(p0, p1, c);

        // TODO: self._container.rotation = angle;
        self._container.transformation = t0
          .translate(c.opposite())
          .rotate(angle)
          .translate(c);
        self._target.transformation = self._container.transformation;
      });
  }

  private _createResizeHandles(): void {
    const self = this;

    // calculates the handle positions
    const box = this._target.boundingBox;
    const positionGroups: {[key: string]: Vector[]} = {
      diagonal: [
        new Vector(box.x, box.y),
        new Vector(box.x + box.width, box.y),
        new Vector(box.x, box.y + box.height),
        new Vector(box.x + box.width, box.y + box.height)],
      horizontal: [
        new Vector(box.x + box.width, box.y + box.height / 2),
        new Vector(box.x, box.y + box.height / 2)],
      vertical: [
        new Vector(box.x + box.width / 2, box.y),
        new Vector(box.x + box.width / 2, box.y + box.height)]};

    this._handles = [];
    for (const orientation in positionGroups) {
      if (!positionGroups.hasOwnProperty(orientation)) {
        continue;
      }

      const positions = positionGroups[orientation];

      for (const position of positions) {
        let center: Point;
        let p0: Point;
        let t0: Transformation;

        // creates a handle and places it to the position
        const handle = new Handle();
        handle.position = position;
        this._container.append(handle);

        handle
          .onStartDragging((p) => {
            center = self._getCenter();
            t0 = self._container.transformation;
            p0 = p;
          })
          .onDragging((p1) => {
            const c = center.transform(t0);
            const v0 = p0.subtract(c);
            const v1 = c.subtract(p1);
            const norm0 = v0.norm();
            const norm1 = v1.norm();
            const scale = norm0 > 0 ? norm1 / norm0 : 1;
            const value = new Vector(
              orientation === "vertical" ? 1 : scale,
              orientation === "horizontal" ? 1 : scale);

            // TODO: self._container.scale = value;
            self._container.transformation = new Transformation()
              .translate(center.opposite())
              .scale(value)
              .translate(center)
              .transform(t0);
            self._target.transformation = self._container.transformation;
          });

        this._handles.push(handle);
      }
    }
  }

  private _getCenter(): Point {
    const box = this._target.boundingBox;

    return new Vector(box.x + box.width / 2, box.y + box.width / 2);
  }
}

// Gets the angle adjacent to [p2] of the triangle defined by
// [p0], [p1] and [p2] in the direction of the hands of a clock.
//
// Just imagine that the segment [p0, p2] is the hour hand and
// the segment [p1, p2] is the minute hand. This function calculates the
// angle enclosed between those two hands in the direction of the hands
// of a clock.
function _getAdjacentAngle(p0: Point, p1: Point, p2: Point): number {
  // creates an orthonormal reference system
  const u = p1.subtract(p2);
  const u0 = u.unit();
  const u1 = new Vector(u0.y, -u0.x);

  // expresses the vector [p2, p0] from the orthonormal reference system
  const v = p0.subtract(p2);
  const m = new SquareMatrix(u0, u1);
  const w = v.multiply(m.inverse());

  return _getAngle(w);
}

// Gets the angle of a 'positionable' object.
function _getAngle(p: Point): number {
  let ret = NaN;
  const [x, y] = [p.x, p.y];

  if (x > 0 && !(y < 0)) {
    // first quadrant
    ret = Math.atan(y / x);
  } else if (!(x > 0) && y > 0) {
    // second quadrant
    ret = x < 0
      ? Math.atan(y / x) + Math.PI
      : Math.PI / 2;
  } else if (x < 0 && !(y > 0)) {
    // third quadrant
    ret = Math.atan(y / x) + Math.PI;
  } else if (!(x < 0) && y < 0) {
    // fourth quadrant
    ret = x > 0
      ? Math.atan(y / x) + 2 * Math.PI
      : 3 * Math.PI / 2;
  }

  return ret;
}
