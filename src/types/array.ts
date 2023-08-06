import { Decoder } from "../de/decoder";
import { Encoder } from "../enc/encoder";
import { Type } from "./type";
import { Base } from "./base";

export class Arr<T extends Type, N extends number> extends Base {
  v: Array<T>;
  size: number;
  itemCount: N;
  itemType: new (...args: any[]) => T;

  constructor(
    itemType: new (...args: any[]) => T,
    len: N,
    v: Array<T> = new Array(len)
  ) {
    super();
    this.v = v;
    this.itemType = itemType;
    this.itemCount = len;
    this.size = 8 + new itemType().size * len;
  }

  encode(encoder: Encoder) {
    for (let i = 0; i < this.v.length; i++) {
      this.v[i].encode(encoder);
    }
  }

  decode(decoder: Decoder): this {
    this.size = new this.itemType().size * this.itemCount;
    this.v = new Array<T>();

    for (let i = 0; i < this.itemCount; i++) {
      let decoded = new this.itemType().decode(decoder) as T;
      this.v.push(decoded);
    }

    return this;
  }
}
