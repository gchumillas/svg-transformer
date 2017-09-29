import {Point} from "../../euclidean/dim2/Point";
import {Vector} from "../../euclidean/dim2/Vector";
import {SvgGraphicElement} from "./../SvgGraphicElement";

export class Dragger extends SvgGraphicElement {
  constructor() {
    super("rect");

    this
      .setAttr("fill", "000")
      .setAttr("opacity", .5);
  }

  get position(): Point {
    const x = parseInt(this.getAttr("x"), 10);
    const y = parseInt(this.getAttr("y"), 10);

    return new Vector(x, y);
  }

  set position(value: Point) {
    this
      .setAttr("x", value.x)
      .setAttr("y", value.y);
  }

  get width(): number {
    return parseInt(this.getAttr("width"), 10);
  }

  set width(value: number) {
    this.setAttr("width", value);
  }

  get height(): number {
    return parseInt(this.getAttr("height"), 10);
  }

  set height(value: number) {
    this.setAttr("height", value);
  }
}
