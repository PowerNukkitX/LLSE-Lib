import { Integer } from "java.lang.Integer";
import { IntTag } from "cn.nukkit.nbt.tag.IntTag";

export class NbtInt extends CommonNbt {
    constructor(data) {
        super();
        if (this._evaluate(data)) {
            this._pnxNbt = new IntTag("", data);
        }
    }

    set(data) {
        if (this._evaluate(data)) {
            this._pnxNbt.setData(data);
            return true;
        }
        return false;
    }

    _evaluate(data) {
        if (this._isInteger(data)) {
            if (Integer.MIN_VALUE <= data.toString().length <= Integer.MAX_VALUE) {
                return true;
            } else throw RangeError("参数数值范围超出int范围!")
        } else throw new SyntaxError("参数类型错误!");
    }
}