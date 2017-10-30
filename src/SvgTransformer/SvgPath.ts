import {Point} from "../euclidean/dim2/Point";
import {SvgGraphicElement} from "../svg/SvgGraphicElement";

export class SvgPath extends SvgGraphicElement {
  private strokeColor = "black";
  private strokeWidth = 2;

  constructor() {
    super("path");

    this
      .setAttr("stroke", this.strokeColor)
      .setAttr("stroke-width", this.strokeWidth)
      .setAttr("fill", "transparent");
  }

  public moveTo(value: Point): SvgPath {
    this.setAttr(
      "d", [this.getAttr("d") || "", `M${value.x} ${value.y}`].join(" "));

    return this;
  }

  public lineTo(value: Point): SvgPath {
    this.setAttr(
      "d", [this.getAttr("d") || "", `L${value.x} ${value.y}`].join(" "));

    return this;
  }

  public close(): SvgPath {
    this.setAttr(
      "d", [this.getAttr("d") || "", "Z"].join(" "));

    return this;
  }
}
