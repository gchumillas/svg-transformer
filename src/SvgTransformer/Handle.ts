import {Point} from "../euclidean/dim2/Point";
import {Vector} from "../euclidean/dim2/Vector";
import {SvgGraphicElement} from "../svg/SvgGraphicElement";

export class Handle extends SvgGraphicElement {
  private _fillColor = "transparent";

  constructor(attributes: {[key: string]: any} = {}) {
    super("circle", attributes);
    this.setAttr("fill", this._fillColor);
  }

  get position(): Point {
    const x = parseInt(this.getAttr("cx"), 10);
    const y = parseInt(this.getAttr("cy"), 10);

    return new Vector(x, y);
  }

  set position(value: Point) {
    this
      .setAttr("cx", value.x)
      .setAttr("cy", value.y);
  }
}
