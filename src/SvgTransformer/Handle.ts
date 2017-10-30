import {Point} from "../euclidean/dim2/Point";
import {Vector} from "../euclidean/dim2/Vector";
import {SvgGraphicElement} from "../svg/SvgGraphicElement";

export class Handle extends SvgGraphicElement {
  private radius = 10;
  private strokeColor = "black";
  private strokeWidth = 2;
  private fillColor = "transparent";

  constructor() {
    super("circle");

    this
      .setAttr("r", this.radius)
      .setAttr("stroke", this.strokeColor)
      .setAttr("stroke-width", this.strokeWidth)
      .setAttr("fill", this.fillColor);
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
