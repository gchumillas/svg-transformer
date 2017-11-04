import {SvgGraphicElement} from "../svg/SvgGraphicElement";

export class Dragger extends SvgGraphicElement {
  private _backgroundColor = "000";
  private _opacity = 0;
  private _isVisible = true;

  constructor() {
    super("rect");

    this.nativeElement.style.cursor = "move";
    this
      .setAttr("fill", this._backgroundColor)
      .setAttr("opacity", this._opacity);
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  set isVisible(value: boolean) {
    this._isVisible = value;
    this.nativeElement.style.display = this._isVisible ? "inline" : "none";
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
