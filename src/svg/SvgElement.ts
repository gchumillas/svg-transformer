import {SvgGraphicElement} from "./SvgGraphicElement";

export class SvgElement<Type extends SVGElement> {
  public readonly nativeElement: Type;

  constructor(target: string | Type, attributes: {[key: string]: any} = {}) {
    if ( typeof target === "string" ) {
      this.nativeElement = document.createElementNS(
        "http://www.w3.org/2000/svg", target.toString()) as Type;
    } else {
      this.nativeElement = target;
    }

    for (const key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        this.setAttr(key, attributes[key]);
      }
    }
  }

  get ownerElement(): SvgGraphicElement {
    return new SvgGraphicElement(this.nativeElement.ownerSVGElement);
  }

  public getAttr(name: string): string {
    return this.nativeElement.getAttributeNS(null, name);
  }

  public setAttr(name: string, value: any): SvgElement<Type> {
    this.nativeElement.setAttributeNS(null, name, "" + value);

    return this;
  }

  public removeAttr(name: string): SvgElement<Type> {
    this.nativeElement.removeAttributeNS(null, name);

    return this;
  }

  public append(element: SvgElement<SVGElement>): void {
    this.nativeElement.appendChild(element.nativeElement);
  }
}
