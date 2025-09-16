(function() {
  "use strict";
  const _csmVector = class _csmVector {
    /**
     * 引数付きコンストラクタ
     * @param iniitalCapacity 初期化後のキャパシティ。データサイズは_capacity * sizeof(T)
     * @param zeroClear trueなら初期化時に確保した領域を0で埋める
     */
    constructor(initialCapacity = 0) {
      if (initialCapacity < 1) {
        this._ptr = [];
        this._capacity = 0;
        this._size = 0;
      } else {
        this._ptr = new Array(initialCapacity);
        this._capacity = initialCapacity;
        this._size = 0;
      }
    }
    /**
     * インデックスで指定した要素を返す
     */
    at(index) {
      return this._ptr[index];
    }
    /**
     * 要素をセット
     * @param index 要素をセットするインデックス
     * @param value セットする要素
     */
    set(index, value) {
      this._ptr[index] = value;
    }
    /**
     * コンテナを取得する
     */
    get(offset = 0) {
      const ret = new Array();
      for (let i = offset; i < this._size; i++) {
        ret.push(this._ptr[i]);
      }
      return ret;
    }
    /**
     * pushBack処理、コンテナに新たな要素を追加する
     * @param value PushBack処理で追加する値
     */
    pushBack(value) {
      if (this._size >= this._capacity) {
        this.prepareCapacity(
          this._capacity == 0 ? _csmVector.DefaultSize : this._capacity * 2
        );
      }
      this._ptr[this._size++] = value;
    }
    /**
     * コンテナの全要素を解放する
     */
    clear() {
      this._ptr.length = 0;
      this._size = 0;
    }
    /**
     * コンテナの要素数を返す
     * @return コンテナの要素数
     */
    getSize() {
      return this._size;
    }
    /**
     * コンテナの全要素に対して代入処理を行う
     * @param newSize 代入処理後のサイズ
     * @param value 要素に代入する値
     */
    assign(newSize, value) {
      const curSize = this._size;
      if (curSize < newSize) {
        this.prepareCapacity(newSize);
      }
      for (let i = 0; i < newSize; i++) {
        this._ptr[i] = value;
      }
      this._size = newSize;
    }
    /**
     * サイズ変更
     */
    resize(newSize, value = null) {
      this.updateSize(newSize, value, true);
    }
    /**
     * サイズ変更
     */
    updateSize(newSize, value = null, callPlacementNew = true) {
      const curSize = this._size;
      if (curSize < newSize) {
        this.prepareCapacity(newSize);
        if (callPlacementNew) {
          for (let i = this._size; i < newSize; i++) {
            if (typeof value == "function") {
              this._ptr[i] = JSON.parse(JSON.stringify(new value()));
            } else {
              this._ptr[i] = value;
            }
          }
        } else {
          for (let i = this._size; i < newSize; i++) {
            this._ptr[i] = value;
          }
        }
      } else {
        const sub = this._size - newSize;
        this._ptr.splice(this._size - sub, sub);
      }
      this._size = newSize;
    }
    /**
     * コンテナにコンテナ要素を挿入する
     * @param position 挿入する位置
     * @param begin 挿入するコンテナの開始位置
     * @param end 挿入するコンテナの終端位置
     */
    insert(position, begin, end) {
      let dstSi = position._index;
      const srcSi = begin._index;
      const srcEi = end._index;
      const addCount = srcEi - srcSi;
      this.prepareCapacity(this._size + addCount);
      const addSize = this._size - dstSi;
      if (addSize > 0) {
        for (let i = 0; i < addSize; i++) {
          this._ptr.splice(dstSi + i, 0, null);
        }
      }
      for (let i = srcSi; i < srcEi; i++, dstSi++) {
        this._ptr[dstSi] = begin._vector._ptr[i];
      }
      this._size = this._size + addCount;
    }
    /**
     * コンテナからインデックスで指定した要素を削除する
     * @param index インデックス値
     * @return true 削除実行
     * @return false 削除範囲外
     */
    remove(index) {
      if (index < 0 || this._size <= index) {
        return false;
      }
      this._ptr.splice(index, 1);
      --this._size;
      return true;
    }
    /**
     * コンテナから要素を削除して他の要素をシフトする
     * @param ite 削除する要素
     */
    erase(ite) {
      const index = ite._index;
      if (index < 0 || this._size <= index) {
        return ite;
      }
      this._ptr.splice(index, 1);
      --this._size;
      const ite2 = new iterator$1(this, index);
      return ite2;
    }
    /**
     * コンテナのキャパシティを確保する
     * @param newSize 新たなキャパシティ。引数の値が現在のサイズ未満の場合は何もしない.
     */
    prepareCapacity(newSize) {
      if (newSize > this._capacity) {
        if (this._capacity == 0) {
          this._ptr = new Array(newSize);
          this._capacity = newSize;
        } else {
          this._ptr.length = newSize;
          this._capacity = newSize;
        }
      }
    }
    /**
     * コンテナの先頭要素を返す
     */
    begin() {
      const ite = this._size == 0 ? this.end() : new iterator$1(this, 0);
      return ite;
    }
    /**
     * コンテナの終端要素を返す
     */
    end() {
      const ite = new iterator$1(this, this._size);
      return ite;
    }
    getOffset(offset) {
      const newVector = new _csmVector();
      newVector._ptr = this.get(offset);
      newVector._size = this.get(offset).length;
      newVector._capacity = this.get(offset).length;
      return newVector;
    }
    // コンテナ初期化のデフォルトサイズ
  };
  _csmVector.DefaultSize = 10;
  let csmVector = _csmVector;
  let iterator$1 = class iterator2 {
    /**
     * コンストラクタ
     */
    constructor(v, index) {
      this._vector = v != void 0 ? v : null;
      this._index = index != void 0 ? index : 0;
    }
    /**
     * 代入
     */
    set(ite) {
      this._index = ite._index;
      this._vector = ite._vector;
      return this;
    }
    /**
     * 前置き++演算
     */
    preIncrement() {
      ++this._index;
      return this;
    }
    /**
     * 前置き--演算
     */
    preDecrement() {
      --this._index;
      return this;
    }
    /**
     * 後置き++演算子
     */
    increment() {
      const iteold = new iterator2(this._vector, this._index++);
      return iteold;
    }
    /**
     * 後置き--演算子
     */
    decrement() {
      const iteold = new iterator2(this._vector, this._index--);
      return iteold;
    }
    /**
     * ptr
     */
    ptr() {
      return this._vector._ptr[this._index];
    }
    /**
     * =演算子のオーバーロード
     */
    substitution(ite) {
      this._index = ite._index;
      this._vector = ite._vector;
      return this;
    }
    /**
     * !=演算子のオーバーロード
     */
    notEqual(ite) {
      return this._index != ite._index || this._vector != ite._vector;
    }
    // コンテナ
  };
  var Live2DCubismFramework$l;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.csmVector = csmVector;
    Live2DCubismFramework2.iterator = iterator$1;
  })(Live2DCubismFramework$l || (Live2DCubismFramework$l = {}));
  class csmString {
    /**
     * 文字列を後方に追加する
     *
     * @param c 追加する文字列
     * @return 更新された文字列
     */
    append(c, length) {
      this.s += length !== void 0 ? c.substr(0, length) : c;
      return this;
    }
    /**
     * 文字サイズを拡張して文字を埋める
     * @param length    拡張する文字数
     * @param v         埋める文字
     * @return 更新された文字列
     */
    expansion(length, v) {
      for (let i = 0; i < length; i++) {
        this.append(v);
      }
      return this;
    }
    /**
     * 文字列の長さをバイト数で取得する
     */
    getBytes() {
      return encodeURIComponent(this.s).replace(/%../g, "x").length;
    }
    /**
     * 文字列の長さを返す
     */
    getLength() {
      return this.s.length;
    }
    /**
     * 文字列比較 <
     * @param s 比較する文字列
     * @return true:    比較する文字列より小さい
     * @return false:   比較する文字列より大きい
     */
    isLess(s) {
      return this.s < s.s;
    }
    /**
     * 文字列比較 >
     * @param s 比較する文字列
     * @return true:    比較する文字列より大きい
     * @return false:   比較する文字列より小さい
     */
    isGreat(s) {
      return this.s > s.s;
    }
    /**
     * 文字列比較 ==
     * @param s 比較する文字列
     * @return true:    比較する文字列と等しい
     * @return false:   比較する文字列と異なる
     */
    isEqual(s) {
      return this.s == s;
    }
    /**
     * 文字列が空かどうか
     * @return true: 空の文字列
     * @return false: 値が設定されている
     */
    isEmpty() {
      return this.s.length == 0;
    }
    /**
     * 引数付きコンストラクタ
     */
    constructor(s) {
      this.s = s;
    }
  }
  var Live2DCubismFramework$k;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.csmString = csmString;
  })(Live2DCubismFramework$k || (Live2DCubismFramework$k = {}));
  class CubismId {
    /**
     * 内部で使用するCubismIdクラス生成メソッド
     *
     * @param id ID文字列
     * @returns CubismId
     * @note 指定したID文字列からCubismIdを取得する際は
     *       CubismIdManager().getId(id)を使用してください
     */
    static createIdInternal(id) {
      return new CubismId(id);
    }
    /**
     * ID名を取得する
     */
    getString() {
      return this._id;
    }
    /**
     * idを比較
     * @param c 比較するid
     * @return 同じならばtrue,異なっていればfalseを返す
     */
    isEqual(c) {
      if (typeof c === "string") {
        return this._id.isEqual(c);
      } else if (c instanceof csmString) {
        return this._id.isEqual(c.s);
      } else if (c instanceof CubismId) {
        return this._id.isEqual(c._id.s);
      }
      return false;
    }
    /**
     * idを比較
     * @param c 比較するid
     * @return 同じならばtrue,異なっていればfalseを返す
     */
    isNotEqual(c) {
      if (typeof c == "string") {
        return !this._id.isEqual(c);
      } else if (c instanceof csmString) {
        return !this._id.isEqual(c.s);
      } else if (c instanceof CubismId) {
        return !this._id.isEqual(c._id.s);
      }
      return false;
    }
    /**
     * プライベートコンストラクタ
     *
     * @note ユーザーによる生成は許可しません
     */
    constructor(id) {
      if (typeof id === "string") {
        this._id = new csmString(id);
        return;
      }
      this._id = id;
    }
    // ID名
  }
  var Live2DCubismFramework$j;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismId = CubismId;
  })(Live2DCubismFramework$j || (Live2DCubismFramework$j = {}));
  class CubismIdManager {
    /**
     * コンストラクタ
     */
    constructor() {
      this._ids = new csmVector();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      for (let i = 0; i < this._ids.getSize(); ++i) {
        this._ids.set(i, void 0);
      }
      this._ids = null;
    }
    /**
     * ID名をリストから登録
     *
     * @param ids ID名リスト
     * @param count IDの個数
     */
    registerIds(ids) {
      for (let i = 0; i < ids.length; i++) {
        this.registerId(ids[i]);
      }
    }
    /**
     * ID名を登録
     *
     * @param id ID名
     */
    registerId(id) {
      let result = null;
      if ("string" == typeof id) {
        if ((result = this.findId(id)) != null) {
          return result;
        }
        result = CubismId.createIdInternal(id);
        this._ids.pushBack(result);
      } else {
        return this.registerId(id.s);
      }
      return result;
    }
    /**
     * ID名からIDを取得する
     *
     * @param id ID名
     */
    getId(id) {
      return this.registerId(id);
    }
    /**
     * ID名からIDの確認
     *
     * @return true 存在する
     * @return false 存在しない
     */
    isExist(id) {
      if ("string" == typeof id) {
        return this.findId(id) != null;
      }
      return this.isExist(id.s);
    }
    /**
     * ID名からIDを検索する。
     *
     * @param id ID名
     * @return 登録されているID。なければNULL。
     */
    findId(id) {
      for (let i = 0; i < this._ids.getSize(); ++i) {
        if (this._ids.at(i).getString().isEqual(id)) {
          return this._ids.at(i);
        }
      }
      return null;
    }
    // 登録されているIDのリスト
  }
  var Live2DCubismFramework$i;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismIdManager = CubismIdManager;
  })(Live2DCubismFramework$i || (Live2DCubismFramework$i = {}));
  class CubismMatrix44 {
    /**
     * コンストラクタ
     */
    constructor() {
      this._tr = new Float32Array(16);
      this.loadIdentity();
    }
    /**
     * 受け取った２つの行列の乗算を行う。
     *
     * @param a 行列a
     * @param b 行列b
     * @return 乗算結果の行列
     */
    static multiply(a, b, dst) {
      const c = new Float32Array([
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]);
      const n = 4;
      for (let i = 0; i < n; ++i) {
        for (let j = 0; j < n; ++j) {
          for (let k = 0; k < n; ++k) {
            c[j + i * 4] += a[k + i * 4] * b[j + k * 4];
          }
        }
      }
      for (let i = 0; i < 16; ++i) {
        dst[i] = c[i];
      }
    }
    /**
     * 単位行列に初期化する
     */
    loadIdentity() {
      const c = new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ]);
      this.setMatrix(c);
    }
    /**
     * 行列を設定
     *
     * @param tr 16個の浮動小数点数で表される4x4の行列
     */
    setMatrix(tr) {
      for (let i = 0; i < 16; ++i) {
        this._tr[i] = tr[i];
      }
    }
    /**
     * 行列を浮動小数点数の配列で取得
     *
     * @return 16個の浮動小数点数で表される4x4の行列
     */
    getArray() {
      return this._tr;
    }
    /**
     * X軸の拡大率を取得
     * @return X軸の拡大率
     */
    getScaleX() {
      return this._tr[0];
    }
    /**
     * Y軸の拡大率を取得する
     *
     * @return Y軸の拡大率
     */
    getScaleY() {
      return this._tr[5];
    }
    /**
     * X軸の移動量を取得
     * @return X軸の移動量
     */
    getTranslateX() {
      return this._tr[12];
    }
    /**
     * Y軸の移動量を取得
     * @return Y軸の移動量
     */
    getTranslateY() {
      return this._tr[13];
    }
    /**
     * X軸の値を現在の行列で計算
     *
     * @param src X軸の値
     * @return 現在の行列で計算されたX軸の値
     */
    transformX(src) {
      return this._tr[0] * src + this._tr[12];
    }
    /**
     * Y軸の値を現在の行列で計算
     *
     * @param src Y軸の値
     * @return 現在の行列で計算されたY軸の値
     */
    transformY(src) {
      return this._tr[5] * src + this._tr[13];
    }
    /**
     * X軸の値を現在の行列で逆計算
     */
    invertTransformX(src) {
      return (src - this._tr[12]) / this._tr[0];
    }
    /**
     * Y軸の値を現在の行列で逆計算
     */
    invertTransformY(src) {
      return (src - this._tr[13]) / this._tr[5];
    }
    /**
     * 現在の行列の位置を起点にして移動
     *
     * 現在の行列の位置を起点にして相対的に移動する。
     *
     * @param x X軸の移動量
     * @param y Y軸の移動量
     */
    translateRelative(x, y) {
      const tr1 = new Float32Array([
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1,
        0,
        x,
        y,
        0,
        1
      ]);
      CubismMatrix44.multiply(tr1, this._tr, this._tr);
    }
    /**
     * 現在の行列の位置を移動
     *
     * 現在の行列の位置を指定した位置へ移動する
     *
     * @param x X軸の移動量
     * @param y y軸の移動量
     */
    translate(x, y) {
      this._tr[12] = x;
      this._tr[13] = y;
    }
    /**
     * 現在の行列のX軸の位置を指定した位置へ移動する
     *
     * @param x X軸の移動量
     */
    translateX(x) {
      this._tr[12] = x;
    }
    /**
     * 現在の行列のY軸の位置を指定した位置へ移動する
     *
     * @param y Y軸の移動量
     */
    translateY(y) {
      this._tr[13] = y;
    }
    /**
     * 現在の行列の拡大率を相対的に設定する
     *
     * @param x X軸の拡大率
     * @param y Y軸の拡大率
     */
    scaleRelative(x, y) {
      const tr1 = new Float32Array([
        x,
        0,
        0,
        0,
        0,
        y,
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      ]);
      CubismMatrix44.multiply(tr1, this._tr, this._tr);
    }
    /**
     * 現在の行列の拡大率を指定した倍率に設定する
     *
     * @param x X軸の拡大率
     * @param y Y軸の拡大率
     */
    scale(x, y) {
      this._tr[0] = x;
      this._tr[5] = y;
    }
    /**
     * 引数で与えられた行列にこの行列を乗算する。
     * (引数で与えられた行列) * (この行列)
     *
     * @note 関数名と実際の計算内容に乖離があるため、今後計算順が修正される可能性があります。
     * @param m 行列
     */
    multiplyByMatrix(m) {
      CubismMatrix44.multiply(m.getArray(), this._tr, this._tr);
    }
    /**
     * オブジェクトのコピーを生成する
     */
    clone() {
      const cloneMatrix = new CubismMatrix44();
      for (let i = 0; i < this._tr.length; i++) {
        cloneMatrix._tr[i] = this._tr[i];
      }
      return cloneMatrix;
    }
    // 4x4行列データ
  }
  var Live2DCubismFramework$h;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismMatrix44 = CubismMatrix44;
  })(Live2DCubismFramework$h || (Live2DCubismFramework$h = {}));
  class csmRect {
    /**
     * コンストラクタ
     * @param x 左端X座標
     * @param y 上端Y座標
     * @param w 幅
     * @param h 高さ
     */
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
    }
    /**
     * 矩形中央のX座標を取得する
     */
    getCenterX() {
      return this.x + 0.5 * this.width;
    }
    /**
     * 矩形中央のY座標を取得する
     */
    getCenterY() {
      return this.y + 0.5 * this.height;
    }
    /**
     * 右側のX座標を取得する
     */
    getRight() {
      return this.x + this.width;
    }
    /**
     * 下端のY座標を取得する
     */
    getBottom() {
      return this.y + this.height;
    }
    /**
     * 矩形に値をセットする
     * @param r 矩形のインスタンス
     */
    setRect(r) {
      this.x = r.x;
      this.y = r.y;
      this.width = r.width;
      this.height = r.height;
    }
    /**
     * 矩形中央を軸にして縦横を拡縮する
     * @param w 幅方向に拡縮する量
     * @param h 高さ方向に拡縮する量
     */
    expand(w, h) {
      this.x -= w;
      this.y -= h;
      this.width += w * 2;
      this.height += h * 2;
    }
    // 高さ
  }
  var Live2DCubismFramework$g;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.csmRect = csmRect;
  })(Live2DCubismFramework$g || (Live2DCubismFramework$g = {}));
  class CubismRenderer {
    /**
     * レンダラのインスタンスを生成して取得する
     *
     * @return レンダラのインスタンス
     */
    static create() {
      return null;
    }
    /**
     * レンダラのインスタンスを解放する
     */
    static delete(renderer) {
      renderer = null;
    }
    /**
     * レンダラの初期化処理を実行する
     * 引数に渡したモデルからレンダラの初期化処理に必要な情報を取り出すことができる
     * @param model モデルのインスタンス
     */
    initialize(model) {
      this._model = model;
    }
    /**
     * モデルを描画する
     */
    drawModel() {
      if (this.getModel() == null) return;
      this.saveProfile();
      this.doDrawModel();
      this.restoreProfile();
    }
    /**
     * Model-View-Projection 行列をセットする
     * 配列は複製されるので、元の配列は外で破棄して良い
     * @param matrix44 Model-View-Projection 行列
     */
    setMvpMatrix(matrix44) {
      this._mvpMatrix4x4.setMatrix(matrix44.getArray());
    }
    /**
     * Model-View-Projection 行列を取得する
     * @return Model-View-Projection 行列
     */
    getMvpMatrix() {
      return this._mvpMatrix4x4;
    }
    /**
     * モデルの色をセットする
     * 各色0.0~1.0の間で指定する（1.0が標準の状態）
     * @param red 赤チャンネルの値
     * @param green 緑チャンネルの値
     * @param blue 青チャンネルの値
     * @param alpha αチャンネルの値
     */
    setModelColor(red, green, blue, alpha) {
      if (red < 0) {
        red = 0;
      } else if (red > 1) {
        red = 1;
      }
      if (green < 0) {
        green = 0;
      } else if (green > 1) {
        green = 1;
      }
      if (blue < 0) {
        blue = 0;
      } else if (blue > 1) {
        blue = 1;
      }
      if (alpha < 0) {
        alpha = 0;
      } else if (alpha > 1) {
        alpha = 1;
      }
      this._modelColor.r = red;
      this._modelColor.g = green;
      this._modelColor.b = blue;
      this._modelColor.a = alpha;
    }
    /**
     * モデルの色を取得する
     * 各色0.0~1.0の間で指定する(1.0が標準の状態)
     *
     * @return RGBAのカラー情報
     */
    getModelColor() {
      return JSON.parse(JSON.stringify(this._modelColor));
    }
    /**
     * 透明度を考慮したモデルの色を計算する。
     *
     * @param opacity 透明度
     *
     * @return RGBAのカラー情報
     */
    getModelColorWithOpacity(opacity) {
      const modelColorRGBA = this.getModelColor();
      modelColorRGBA.a *= opacity;
      if (this.isPremultipliedAlpha()) {
        modelColorRGBA.r *= modelColorRGBA.a;
        modelColorRGBA.g *= modelColorRGBA.a;
        modelColorRGBA.b *= modelColorRGBA.a;
      }
      return modelColorRGBA;
    }
    /**
     * 乗算済みαの有効・無効をセットする
     * 有効にするならtrue、無効にするならfalseをセットする
     */
    setIsPremultipliedAlpha(enable) {
      this._isPremultipliedAlpha = enable;
    }
    /**
     * 乗算済みαの有効・無効を取得する
     * @return true 乗算済みのα有効
     * @return false 乗算済みのα無効
     */
    isPremultipliedAlpha() {
      return this._isPremultipliedAlpha;
    }
    /**
     * カリング（片面描画）の有効・無効をセットする。
     * 有効にするならtrue、無効にするならfalseをセットする
     */
    setIsCulling(culling) {
      this._isCulling = culling;
    }
    /**
     * カリング（片面描画）の有効・無効を取得する。
     * @return true カリング有効
     * @return false カリング無効
     */
    isCulling() {
      return this._isCulling;
    }
    /**
     * テクスチャの異方性フィルタリングのパラメータをセットする
     * パラメータ値の影響度はレンダラの実装に依存する
     * @param n パラメータの値
     */
    setAnisotropy(n) {
      this._anisotropy = n;
    }
    /**
     * テクスチャの異方性フィルタリングのパラメータをセットする
     * @return 異方性フィルタリングのパラメータ
     */
    getAnisotropy() {
      return this._anisotropy;
    }
    /**
     * レンダリングするモデルを取得する
     * @return レンダリングするモデル
     */
    getModel() {
      return this._model;
    }
    /**
     * マスク描画の方式を変更する。
     * falseの場合、マスクを1枚のテクスチャに分割してレンダリングする（デフォルト）
     * 高速だが、マスク個数の上限が36に限定され、質も荒くなる
     * trueの場合、パーツ描画の前にその都度必要なマスクを描き直す
     * レンダリング品質は高いが描画処理負荷は増す
     * @param high 高精細マスクに切り替えるか？
     */
    useHighPrecisionMask(high) {
      this._useHighPrecisionMask = high;
    }
    /**
     * マスクの描画方式を取得する
     * @return true 高精細方式
     * @return false デフォルト
     */
    isUsingHighPrecisionMask() {
      return this._useHighPrecisionMask;
    }
    /**
     * コンストラクタ
     */
    constructor() {
      this._isCulling = false;
      this._isPremultipliedAlpha = false;
      this._anisotropy = 0;
      this._model = null;
      this._modelColor = new CubismTextureColor();
      this._useHighPrecisionMask = false;
      this._mvpMatrix4x4 = new CubismMatrix44();
      this._mvpMatrix4x4.loadIdentity();
    }
    // falseの場合、マスクを纏めて描画する trueの場合、マスクはパーツ描画ごとに書き直す
  }
  var CubismBlendMode = /* @__PURE__ */ ((CubismBlendMode2) => {
    CubismBlendMode2[CubismBlendMode2["CubismBlendMode_Normal"] = 0] = "CubismBlendMode_Normal";
    CubismBlendMode2[CubismBlendMode2["CubismBlendMode_Additive"] = 1] = "CubismBlendMode_Additive";
    CubismBlendMode2[CubismBlendMode2["CubismBlendMode_Multiplicative"] = 2] = "CubismBlendMode_Multiplicative";
    return CubismBlendMode2;
  })(CubismBlendMode || {});
  class CubismTextureColor {
    /**
     * コンストラクタ
     */
    constructor(r = 1, g = 1, b = 1, a = 1) {
      this.r = r;
      this.g = g;
      this.b = b;
      this.a = a;
    }
    // αチャンネル
  }
  class CubismClippingContext {
    /**
     * 引数付きコンストラクタ
     */
    constructor(clippingDrawableIndices, clipCount) {
      this._clippingIdList = clippingDrawableIndices;
      this._clippingIdCount = clipCount;
      this._allClippedDrawRect = new csmRect();
      this._layoutBounds = new csmRect();
      this._clippedDrawableIndexList = [];
      this._matrixForMask = new CubismMatrix44();
      this._matrixForDraw = new CubismMatrix44();
      this._bufferIndex = 0;
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      if (this._layoutBounds != null) {
        this._layoutBounds = null;
      }
      if (this._allClippedDrawRect != null) {
        this._allClippedDrawRect = null;
      }
      if (this._clippedDrawableIndexList != null) {
        this._clippedDrawableIndexList = null;
      }
    }
    /**
     * このマスクにクリップされる描画オブジェクトを追加する
     *
     * @param drawableIndex クリッピング対象に追加する描画オブジェクトのインデックス
     */
    addClippedDrawable(drawableIndex) {
      this._clippedDrawableIndexList.push(drawableIndex);
    }
    // このマスクが割り当てられるレンダーテクスチャ（フレームバッファ）やカラーバッファのインデックス
  }
  var Live2DCubismFramework$f;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismBlendMode = CubismBlendMode;
    Live2DCubismFramework2.CubismRenderer = CubismRenderer;
    Live2DCubismFramework2.CubismTextureColor = CubismTextureColor;
  })(Live2DCubismFramework$f || (Live2DCubismFramework$f = {}));
  const CSM_LOG_LEVEL_VERBOSE = 0;
  const CSM_LOG_LEVEL_DEBUG = 1;
  const CSM_LOG_LEVEL_INFO = 2;
  const CSM_LOG_LEVEL_WARNING = 3;
  const CSM_LOG_LEVEL_ERROR = 4;
  const CSM_LOG_LEVEL_OFF = 5;
  const CSM_LOG_LEVEL = CSM_LOG_LEVEL_VERBOSE;
  const CubismLogPrint = (level, fmt, args) => {
    CubismDebug.print(level, "[CSM]" + fmt, args);
  };
  const CubismLogPrintIn = (level, fmt, args) => {
    CubismLogPrint(level, fmt + "\n", args);
  };
  const CSM_ASSERT = (expr) => {
    console.assert(expr);
  };
  let CubismLogVerbose;
  let CubismLogDebug;
  let CubismLogInfo;
  let CubismLogWarning;
  let CubismLogError;
  if (CSM_LOG_LEVEL <= CSM_LOG_LEVEL_VERBOSE) {
    CubismLogVerbose = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Verbose, "[V]" + fmt, args);
    };
    CubismLogDebug = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Debug, "[D]" + fmt, args);
    };
    CubismLogInfo = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Info, "[I]" + fmt, args);
    };
    CubismLogWarning = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Warning, "[W]" + fmt, args);
    };
    CubismLogError = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Error, "[E]" + fmt, args);
    };
  } else if (CSM_LOG_LEVEL == CSM_LOG_LEVEL_DEBUG) {
    CubismLogDebug = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Debug, "[D]" + fmt, args);
    };
    CubismLogInfo = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Info, "[I]" + fmt, args);
    };
    CubismLogWarning = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Warning, "[W]" + fmt, args);
    };
    CubismLogError = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Error, "[E]" + fmt, args);
    };
  } else if (CSM_LOG_LEVEL == CSM_LOG_LEVEL_INFO) {
    CubismLogInfo = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Info, "[I]" + fmt, args);
    };
    CubismLogWarning = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Warning, "[W]" + fmt, args);
    };
    CubismLogError = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Error, "[E]" + fmt, args);
    };
  } else if (CSM_LOG_LEVEL == CSM_LOG_LEVEL_WARNING) {
    CubismLogWarning = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Warning, "[W]" + fmt, args);
    };
    CubismLogError = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Error, "[E]" + fmt, args);
    };
  } else if (CSM_LOG_LEVEL == CSM_LOG_LEVEL_ERROR) {
    CubismLogError = (fmt, ...args) => {
      CubismLogPrintIn(LogLevel.LogLevel_Error, "[E]" + fmt, args);
    };
  }
  class CubismDebug {
    /**
     * ログを出力する。第一引数にログレベルを設定する。
     * CubismFramework.initialize()時にオプションで設定されたログ出力レベルを下回る場合はログに出さない。
     *
     * @param logLevel ログレベルの設定
     * @param format 書式付き文字列
     * @param args 可変長引数
     */
    static print(logLevel, format, args) {
      if (logLevel < CubismFramework.getLoggingLevel()) {
        return;
      }
      const logPrint = CubismFramework.coreLogFunction;
      if (!logPrint) return;
      const buffer = format.replace(/\{(\d+)\}/g, (m, k) => {
        return args[k];
      });
      logPrint(buffer);
    }
    /**
     * データから指定した長さだけダンプ出力する。
     * CubismFramework.initialize()時にオプションで設定されたログ出力レベルを下回る場合はログに出さない。
     *
     * @param logLevel ログレベルの設定
     * @param data ダンプするデータ
     * @param length ダンプする長さ
     */
    static dumpBytes(logLevel, data, length) {
      for (let i = 0; i < length; i++) {
        if (i % 16 == 0 && i > 0) this.print(logLevel, "\n");
        else if (i % 8 == 0 && i > 0) this.print(logLevel, "  ");
        this.print(logLevel, "{0} ", [data[i] & 255]);
      }
      this.print(logLevel, "\n");
    }
    /**
     * private コンストラクタ
     */
    constructor() {
    }
  }
  var Live2DCubismFramework$e;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismDebug = CubismDebug;
  })(Live2DCubismFramework$e || (Live2DCubismFramework$e = {}));
  class csmPair {
    /**
     * コンストラクタ
     * @param key Keyとしてセットする値
     * @param value Valueとしてセットする値
     */
    constructor(key, value) {
      this.first = key == void 0 ? null : key;
      this.second = value == void 0 ? null : value;
    }
    // valueとして用いる変数
  }
  const _csmMap = class _csmMap {
    /**
     * 引数付きコンストラクタ
     * @param size 初期化時点で確保するサイズ
     */
    constructor(size) {
      if (size != void 0) {
        if (size < 1) {
          this._keyValues = [];
          this._dummyValue = null;
          this._size = 0;
        } else {
          this._keyValues = new Array(size);
          this._size = size;
        }
      } else {
        this._keyValues = [];
        this._dummyValue = null;
        this._size = 0;
      }
    }
    /**
     * デストラクタ
     */
    release() {
      this.clear();
    }
    /**
     * キーを追加する
     * @param key 新たに追加するキー
     */
    appendKey(key) {
      let findIndex = -1;
      for (let i = 0; i < this._size; i++) {
        if (this._keyValues[i].first == key) {
          findIndex = i;
          break;
        }
      }
      if (findIndex != -1) {
        CubismLogWarning("The key `{0}` is already append.", key);
        return;
      }
      this.prepareCapacity(this._size + 1, false);
      this._keyValues[this._size] = new csmPair(key);
      this._size += 1;
    }
    /**
     * 添字演算子[key]のオーバーロード(get)
     * @param key 添字から特定されるValue値
     */
    getValue(key) {
      let found = -1;
      for (let i = 0; i < this._size; i++) {
        if (this._keyValues[i].first == key) {
          found = i;
          break;
        }
      }
      if (found >= 0) {
        return this._keyValues[found].second;
      } else {
        this.appendKey(key);
        return this._keyValues[this._size - 1].second;
      }
    }
    /**
     * 添字演算子[key]のオーバーロード(set)
     * @param key 添字から特定されるValue値
     * @param value 代入するValue値
     */
    setValue(key, value) {
      let found = -1;
      for (let i = 0; i < this._size; i++) {
        if (this._keyValues[i].first == key) {
          found = i;
          break;
        }
      }
      if (found >= 0) {
        this._keyValues[found].second = value;
      } else {
        this.appendKey(key);
        this._keyValues[this._size - 1].second = value;
      }
    }
    /**
     * 引数で渡したKeyを持つ要素が存在するか
     * @param key 存在を確認するkey
     * @return true 引数で渡したkeyを持つ要素が存在する
     * @return false 引数で渡したkeyを持つ要素が存在しない
     */
    isExist(key) {
      for (let i = 0; i < this._size; i++) {
        if (this._keyValues[i].first == key) {
          return true;
        }
      }
      return false;
    }
    /**
     * keyValueのポインタを全て解放する
     */
    clear() {
      this._keyValues = void 0;
      this._keyValues = null;
      this._keyValues = [];
      this._size = 0;
    }
    /**
     * コンテナのサイズを取得する
     *
     * @return コンテナのサイズ
     */
    getSize() {
      return this._size;
    }
    /**
     * コンテナのキャパシティを確保する
     * @param newSize 新たなキャパシティ。引数の値が現在のサイズ未満の場合は何もしない。
     * @param fitToSize trueなら指定したサイズに合わせる。falseならサイズを2倍確保しておく。
     */
    prepareCapacity(newSize, fitToSize) {
      if (newSize > this._keyValues.length) {
        if (this._keyValues.length == 0) {
          if (!fitToSize && newSize < _csmMap.DefaultSize)
            newSize = _csmMap.DefaultSize;
          this._keyValues.length = newSize;
        } else {
          if (!fitToSize && newSize < this._keyValues.length * 2)
            newSize = this._keyValues.length * 2;
          this._keyValues.length = newSize;
        }
      }
    }
    /**
     * コンテナの先頭要素を返す
     */
    begin() {
      const ite = new iterator(this, 0);
      return ite;
    }
    /**
     * コンテナの終端要素を返す
     */
    end() {
      const ite = new iterator(
        this,
        this._size
      );
      return ite;
    }
    /**
     * コンテナから要素を削除する
     *
     * @param ite 削除する要素
     */
    erase(ite) {
      const index = ite._index;
      if (index < 0 || this._size <= index) {
        return ite;
      }
      this._keyValues.splice(index, 1);
      --this._size;
      const ite2 = new iterator(
        this,
        index
      );
      return ite2;
    }
    /**
     * コンテナの値を32ビット符号付き整数型でダンプする
     */
    dumpAsInt() {
      for (let i = 0; i < this._size; i++) {
        CubismLogDebug("{0} ,", this._keyValues[i]);
        CubismLogDebug("\n");
      }
    }
    // コンテナの要素数
  };
  _csmMap.DefaultSize = 10;
  let csmMap = _csmMap;
  class iterator {
    /**
     * コンストラクタ
     */
    constructor(v, idx) {
      this._map = v != void 0 ? v : new csmMap();
      this._index = idx != void 0 ? idx : 0;
    }
    /**
     * =演算子のオーバーロード
     */
    set(ite) {
      this._index = ite._index;
      this._map = ite._map;
      return this;
    }
    /**
     * 前置き++演算子のオーバーロード
     */
    preIncrement() {
      ++this._index;
      return this;
    }
    /**
     * 前置き--演算子のオーバーロード
     */
    preDecrement() {
      --this._index;
      return this;
    }
    /**
     * 後置き++演算子のオーバーロード
     */
    increment() {
      const iteold = new iterator(this._map, this._index++);
      return iteold;
    }
    /**
     * 後置き--演算子のオーバーロード
     */
    decrement() {
      const iteold = new iterator(this._map, this._index);
      this._map = iteold._map;
      this._index = iteold._index;
      return this;
    }
    /**
     * *演算子のオーバーロード
     */
    ptr() {
      return this._map._keyValues[this._index];
    }
    /**
     * !=演算
     */
    notEqual(ite) {
      return this._index != ite._index || this._map != ite._map;
    }
    // コンテナ
  }
  var Live2DCubismFramework$d;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.csmMap = csmMap;
    Live2DCubismFramework2.csmPair = csmPair;
    Live2DCubismFramework2.iterator = iterator;
  })(Live2DCubismFramework$d || (Live2DCubismFramework$d = {}));
  class CubismJsonExtension {
    static parseJsonObject(obj, map) {
      Object.keys(obj).forEach((key) => {
        if (typeof obj[key] == "boolean") {
          const convValue = Boolean(obj[key]);
          map.put(key, new JsonBoolean(convValue));
        } else if (typeof obj[key] == "string") {
          const convValue = String(obj[key]);
          map.put(key, new JsonString(convValue));
        } else if (typeof obj[key] == "number") {
          const convValue = Number(obj[key]);
          map.put(key, new JsonFloat(convValue));
        } else if (obj[key] instanceof Array) {
          map.put(
            key,
            CubismJsonExtension.parseJsonArray(obj[key])
          );
        } else if (obj[key] instanceof Object) {
          map.put(
            key,
            CubismJsonExtension.parseJsonObject(obj[key], new JsonMap())
          );
        } else if (obj[key] == null) {
          map.put(key, new JsonNullvalue());
        } else {
          map.put(key, obj[key]);
        }
      });
      return map;
    }
    static parseJsonArray(obj) {
      const arr = new JsonArray();
      Object.keys(obj).forEach((key) => {
        const convKey = Number(key);
        if (typeof convKey == "number") {
          if (typeof obj[key] == "boolean") {
            const convValue = Boolean(obj[key]);
            arr.add(new JsonBoolean(convValue));
          } else if (typeof obj[key] == "string") {
            const convValue = String(obj[key]);
            arr.add(new JsonString(convValue));
          } else if (typeof obj[key] == "number") {
            const convValue = Number(obj[key]);
            arr.add(new JsonFloat(convValue));
          } else if (obj[key] instanceof Array) {
            arr.add(this.parseJsonArray(obj[key]));
          } else if (obj[key] instanceof Object) {
            arr.add(this.parseJsonObject(obj[key], new JsonMap()));
          } else if (obj[key] == null) {
            arr.add(new JsonNullvalue());
          } else {
            arr.add(obj[key]);
          }
        } else if (obj[key] instanceof Array) {
          arr.add(this.parseJsonArray(obj[key]));
        } else if (obj[key] instanceof Object) {
          arr.add(this.parseJsonObject(obj[key], new JsonMap()));
        } else if (obj[key] == null) {
          arr.add(new JsonNullvalue());
        } else {
          const convValue = Array(obj[key]);
          for (let i = 0; i < convValue.length; i++) {
            arr.add(convValue[i]);
          }
        }
      });
      return arr;
    }
  }
  const CSM_JSON_ERROR_TYPE_MISMATCH = "Error: type mismatch";
  const CSM_JSON_ERROR_INDEX_OF_BOUNDS = "Error: index out of bounds";
  let Value$1 = class Value2 {
    /**
     * コンストラクタ
     */
    constructor() {
    }
    /**
     * 要素を文字列型で返す(string)
     */
    getRawString(defaultValue, indent) {
      return this.getString(defaultValue, indent);
    }
    /**
     * 要素を数値型で返す(number)
     */
    toInt(defaultValue = 0) {
      return defaultValue;
    }
    /**
     * 要素を数値型で返す(number)
     */
    toFloat(defaultValue = 0) {
      return defaultValue;
    }
    /**
     * 要素を真偽値で返す(boolean)
     */
    toBoolean(defaultValue = false) {
      return defaultValue;
    }
    /**
     * サイズを返す
     */
    getSize() {
      return 0;
    }
    /**
     * 要素を配列で返す(Value[])
     */
    getArray(defaultValue = null) {
      return defaultValue;
    }
    /**
     * 要素をコンテナで返す(array)
     */
    getVector(defaultValue = new csmVector()) {
      return defaultValue;
    }
    /**
     * 要素をマップで返す(csmMap<csmString, Value>)
     */
    getMap(defaultValue) {
      return defaultValue;
    }
    /**
     * 添字演算子[index]
     */
    getValueByIndex(index) {
      return Value2.errorValue.setErrorNotForClientCall(
        CSM_JSON_ERROR_TYPE_MISMATCH
      );
    }
    /**
     * 添字演算子[string | csmString]
     */
    getValueByString(s) {
      return Value2.nullValue.setErrorNotForClientCall(
        CSM_JSON_ERROR_TYPE_MISMATCH
      );
    }
    /**
     * マップのキー一覧をコンテナで返す
     *
     * @return マップのキーの一覧
     */
    getKeys() {
      return Value2.dummyKeys;
    }
    /**
     * Valueの種類がエラー値ならtrue
     */
    isError() {
      return false;
    }
    /**
     * Valueの種類がnullならtrue
     */
    isNull() {
      return false;
    }
    /**
     * Valueの種類が真偽値ならtrue
     */
    isBool() {
      return false;
    }
    /**
     * Valueの種類が数値型ならtrue
     */
    isFloat() {
      return false;
    }
    /**
     * Valueの種類が文字列ならtrue
     */
    isString() {
      return false;
    }
    /**
     * Valueの種類が配列ならtrue
     */
    isArray() {
      return false;
    }
    /**
     * Valueの種類がマップ型ならtrue
     */
    isMap() {
      return false;
    }
    equals(value) {
      return false;
    }
    /**
     * Valueの値が静的ならtrue、静的なら解放しない
     */
    isStatic() {
      return false;
    }
    /**
     * Valueにエラー値をセットする
     */
    setErrorNotForClientCall(errorStr) {
      return JsonError.errorValue;
    }
    /**
     * 初期化用メソッド
     */
    static staticInitializeNotForClientCall() {
      JsonBoolean.trueValue = new JsonBoolean(true);
      JsonBoolean.falseValue = new JsonBoolean(false);
      Value2.errorValue = new JsonError("ERROR", true);
      Value2.nullValue = new JsonNullvalue();
      Value2.dummyKeys = new csmVector();
    }
    /**
     * リリース用メソッド
     */
    static staticReleaseNotForClientCall() {
      JsonBoolean.trueValue = null;
      JsonBoolean.falseValue = null;
      Value2.errorValue = null;
      Value2.nullValue = null;
      Value2.dummyKeys = null;
    }
    // 明示的に連想配列をany型で指定
  };
  class CubismJson {
    /**
     * コンストラクタ
     */
    constructor(buffer, length) {
      this._parseCallback = CubismJsonExtension.parseJsonObject;
      this._error = null;
      this._lineCount = 0;
      this._root = null;
      if (buffer != void 0) {
        this.parseBytes(buffer, length, this._parseCallback);
      }
    }
    /**
     * バイトデータから直接ロードしてパースする
     *
     * @param buffer バッファ
     * @param size バッファサイズ
     * @return CubismJsonクラスのインスタンス。失敗したらNULL
     */
    static create(buffer, size) {
      const json = new CubismJson();
      const succeeded = json.parseBytes(
        buffer,
        size,
        json._parseCallback
      );
      if (!succeeded) {
        CubismJson.delete(json);
        return null;
      } else {
        return json;
      }
    }
    /**
     * パースしたJSONオブジェクトの解放処理
     *
     * @param instance CubismJsonクラスのインスタンス
     */
    static delete(instance) {
      instance = null;
    }
    /**
     * パースしたJSONのルート要素を返す
     */
    getRoot() {
      return this._root;
    }
    /**
     *  UnicodeのバイナリをStringに変換
     *
     * @param buffer 変換するバイナリデータ
     * @return 変換後の文字列
     */
    static arrayBufferToString(buffer) {
      const uint8Array = new Uint8Array(buffer);
      let str = "";
      for (let i = 0, len = uint8Array.length; i < len; ++i) {
        str += "%" + this.pad(uint8Array[i].toString(16));
      }
      str = decodeURIComponent(str);
      return str;
    }
    /**
     * エンコード、パディング
     */
    static pad(n) {
      return n.length < 2 ? "0" + n : n;
    }
    /**
     * JSONのパースを実行する
     * @param buffer    パース対象のデータバイト
     * @param size      データバイトのサイズ
     * return true : 成功
     * return false: 失敗
     */
    parseBytes(buffer, size, parseCallback) {
      const endPos = new Array(1);
      const decodeBuffer = CubismJson.arrayBufferToString(buffer);
      if (parseCallback == void 0) {
        this._root = this.parseValue(decodeBuffer, size, 0, endPos);
      } else {
        this._root = parseCallback(JSON.parse(decodeBuffer), new JsonMap());
      }
      if (this._error) {
        let strbuf = "\0";
        strbuf = "Json parse error : @line " + (this._lineCount + 1) + "\n";
        this._root = new JsonString(strbuf);
        CubismLogInfo("{0}", this._root.getRawString());
        return false;
      } else if (this._root == null) {
        this._root = new JsonError(new csmString(this._error), false);
        return false;
      }
      return true;
    }
    /**
     * パース時のエラー値を返す
     */
    getParseError() {
      return this._error;
    }
    /**
     * ルート要素の次の要素がファイルの終端だったらtrueを返す
     */
    checkEndOfFile() {
      return this._root.getArray()[1].equals("EOF");
    }
    /**
     * JSONエレメントからValue(float,String,Value*,Array,null,true,false)をパースする
     * エレメントの書式に応じて内部でParseString(), ParseObject(), ParseArray()を呼ぶ
     *
     * @param   buffer      JSONエレメントのバッファ
     * @param   length      パースする長さ
     * @param   begin       パースを開始する位置
     * @param   outEndPos   パース終了時の位置
     * @return      パースから取得したValueオブジェクト
     */
    parseValue(buffer, length, begin, outEndPos) {
      if (this._error) return null;
      let o = null;
      let i = begin;
      let f;
      for (; i < length; i++) {
        const c = buffer[i];
        switch (c) {
          case "-":
          case ".":
          case "0":
          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9": {
            const afterString = new Array(1);
            f = strtod(buffer.slice(i), afterString);
            outEndPos[0] = buffer.indexOf(afterString[0]);
            return new JsonFloat(f);
          }
          case '"':
            return new JsonString(
              this.parseString(buffer, length, i + 1, outEndPos)
            );
          case "[":
            o = this.parseArray(buffer, length, i + 1, outEndPos);
            return o;
          case "{":
            o = this.parseObject(buffer, length, i + 1, outEndPos);
            return o;
          case "n":
            if (i + 3 < length) {
              o = new JsonNullvalue();
              outEndPos[0] = i + 4;
            } else {
              this._error = "parse null";
            }
            return o;
          case "t":
            if (i + 3 < length) {
              o = JsonBoolean.trueValue;
              outEndPos[0] = i + 4;
            } else {
              this._error = "parse true";
            }
            return o;
          case "f":
            if (i + 4 < length) {
              o = JsonBoolean.falseValue;
              outEndPos[0] = i + 5;
            } else {
              this._error = "illegal ',' position";
            }
            return o;
          case ",":
            this._error = "illegal ',' position";
            return null;
          case "]":
            outEndPos[0] = i;
            return null;
          case "\n":
            this._lineCount++;
          case " ":
          case "	":
          case "\r":
          default:
            break;
        }
      }
      this._error = "illegal end of value";
      return null;
    }
    /**
     * 次の「"」までの文字列をパースする。
     *
     * @param   string  ->  パース対象の文字列
     * @param   length  ->  パースする長さ
     * @param   begin   ->  パースを開始する位置
     * @param  outEndPos   ->  パース終了時の位置
     * @return      パースした文F字列要素
     */
    parseString(string, length, begin, outEndPos) {
      if (this._error) {
        return null;
      }
      if (!string) {
        this._error = "string is null";
        return null;
      }
      let i = begin;
      let c, c2;
      const ret = new csmString("");
      let bufStart = begin;
      for (; i < length; i++) {
        c = string[i];
        switch (c) {
          case '"': {
            outEndPos[0] = i + 1;
            ret.append(string.slice(bufStart), i - bufStart);
            return ret.s;
          }
          case "//": {
            i++;
            if (i - 1 > bufStart) {
              ret.append(string.slice(bufStart), i - bufStart);
            }
            bufStart = i + 1;
            if (i < length) {
              c2 = string[i];
              switch (c2) {
                case "\\":
                  ret.expansion(1, "\\");
                  break;
                case '"':
                  ret.expansion(1, '"');
                  break;
                case "/":
                  ret.expansion(1, "/");
                  break;
                case "b":
                  ret.expansion(1, "\b");
                  break;
                case "f":
                  ret.expansion(1, "\f");
                  break;
                case "n":
                  ret.expansion(1, "\n");
                  break;
                case "r":
                  ret.expansion(1, "\r");
                  break;
                case "t":
                  ret.expansion(1, "	");
                  break;
                case "u":
                  this._error = "parse string/unicord escape not supported";
                  break;
                default:
                  break;
              }
            } else {
              this._error = "parse string/escape error";
            }
          }
          default: {
            break;
          }
        }
      }
      this._error = "parse string/illegal end";
      return null;
    }
    /**
     * JSONのオブジェクトエレメントをパースしてValueオブジェクトを返す
     *
     * @param buffer    JSONエレメントのバッファ
     * @param length    パースする長さ
     * @param begin     パースを開始する位置
     * @param outEndPos パース終了時の位置
     * @return パースから取得したValueオブジェクト
     */
    parseObject(buffer, length, begin, outEndPos) {
      if (this._error) {
        return null;
      }
      if (!buffer) {
        this._error = "buffer is null";
        return null;
      }
      const ret = new JsonMap();
      let key = "";
      let i = begin;
      let c = "";
      const localRetEndPos2 = Array(1);
      let ok = false;
      for (; i < length; i++) {
        FOR_LOOP: for (; i < length; i++) {
          c = buffer[i];
          switch (c) {
            case '"':
              key = this.parseString(buffer, length, i + 1, localRetEndPos2);
              if (this._error) {
                return null;
              }
              i = localRetEndPos2[0];
              ok = true;
              break FOR_LOOP;
            case "}":
              outEndPos[0] = i + 1;
              return ret;
            case ":":
              this._error = "illegal ':' position";
              break;
            case "\n":
              this._lineCount++;
            default:
              break;
          }
        }
        if (!ok) {
          this._error = "key not found";
          return null;
        }
        ok = false;
        FOR_LOOP2: for (; i < length; i++) {
          c = buffer[i];
          switch (c) {
            case ":":
              ok = true;
              i++;
              break FOR_LOOP2;
            case "}":
              this._error = "illegal '}' position";
              break;
            case "\n":
              this._lineCount++;
            default:
              break;
          }
        }
        if (!ok) {
          this._error = "':' not found";
          return null;
        }
        const value = this.parseValue(buffer, length, i, localRetEndPos2);
        if (this._error) {
          return null;
        }
        i = localRetEndPos2[0];
        ret.put(key, value);
        FOR_LOOP3: for (; i < length; i++) {
          c = buffer[i];
          switch (c) {
            case ",":
              break FOR_LOOP3;
            case "}":
              outEndPos[0] = i + 1;
              return ret;
            case "\n":
              this._lineCount++;
            default:
              break;
          }
        }
      }
      this._error = "illegal end of perseObject";
      return null;
    }
    /**
     * 次の「"」までの文字列をパースする。
     * @param buffer    JSONエレメントのバッファ
     * @param length    パースする長さ
     * @param begin     パースを開始する位置
     * @param outEndPos パース終了時の位置
     * @return パースから取得したValueオブジェクト
     */
    parseArray(buffer, length, begin, outEndPos) {
      if (this._error) {
        return null;
      }
      if (!buffer) {
        this._error = "buffer is null";
        return null;
      }
      let ret = new JsonArray();
      let i = begin;
      let c;
      const localRetEndpos2 = new Array(1);
      for (; i < length; i++) {
        const value = this.parseValue(buffer, length, i, localRetEndpos2);
        if (this._error) {
          return null;
        }
        i = localRetEndpos2[0];
        if (value) {
          ret.add(value);
        }
        FOR_LOOP: for (; i < length; i++) {
          c = buffer[i];
          switch (c) {
            case ",":
              break FOR_LOOP;
            case "]":
              outEndPos[0] = i + 1;
              return ret;
            case "\n":
              ++this._lineCount;
            default:
              break;
          }
        }
      }
      ret = void 0;
      this._error = "illegal end of parseObject";
      return null;
    }
    // パースされたルート要素
  }
  class JsonFloat extends Value$1 {
    /**
     * コンストラクタ
     */
    constructor(v) {
      super();
      this._value = v;
    }
    /**
     * Valueの種類が数値型ならtrue
     */
    isFloat() {
      return true;
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
      const strbuf = "\0";
      this._value = parseFloat(strbuf);
      this._stringBuffer = strbuf;
      return this._stringBuffer;
    }
    /**
     * 要素を数値型で返す(number)
     */
    toInt(defaultValue = 0) {
      return parseInt(this._value.toString());
    }
    /**
     * 要素を数値型で返す(number)
     */
    toFloat(defaultValue = 0) {
      return this._value;
    }
    equals(value) {
      if ("number" === typeof value) {
        if (Math.round(value)) {
          return false;
        } else {
          return value == this._value;
        }
      }
      return false;
    }
    // JSON要素の値
  }
  class JsonBoolean extends Value$1 {
    /**
     * Valueの種類が真偽値ならtrue
     */
    isBool() {
      return true;
    }
    /**
     * 要素を真偽値で返す(boolean)
     */
    toBoolean(defaultValue = false) {
      return this._boolValue;
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
      this._stringBuffer = this._boolValue ? "true" : "false";
      return this._stringBuffer;
    }
    equals(value) {
      if ("boolean" === typeof value) {
        return value == this._boolValue;
      }
      return false;
    }
    /**
     * Valueの値が静的ならtrue, 静的なら解放しない
     */
    isStatic() {
      return true;
    }
    /**
     * 引数付きコンストラクタ
     */
    constructor(v) {
      super();
      this._boolValue = v;
    }
    // JSON要素の値
  }
  class JsonString extends Value$1 {
    constructor(s) {
      super();
      if ("string" === typeof s) {
        this._stringBuffer = s;
      }
      if (s instanceof csmString) {
        this._stringBuffer = s.s;
      }
    }
    /**
     * Valueの種類が文字列ならtrue
     */
    isString() {
      return true;
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
      return this._stringBuffer;
    }
    equals(value) {
      if ("string" === typeof value) {
        return this._stringBuffer == value;
      }
      if (value instanceof csmString) {
        return this._stringBuffer == value.s;
      }
      return false;
    }
  }
  class JsonError extends JsonString {
    /**
     * Valueの値が静的ならtrue、静的なら解放しない
     */
    isStatic() {
      return this._isStatic;
    }
    /**
     * エラー情報をセットする
     */
    setErrorNotForClientCall(s) {
      this._stringBuffer = s;
      return this;
    }
    /**
     * 引数付きコンストラクタ
     */
    constructor(s, isStatic) {
      if ("string" === typeof s) {
        super(s);
      } else {
        super(s);
      }
      this._isStatic = isStatic;
    }
    /**
     * Valueの種類がエラー値ならtrue
     */
    isError() {
      return true;
    }
    // 静的なValueかどうか
  }
  class JsonNullvalue extends Value$1 {
    /**
     * Valueの種類がNULL値ならtrue
     */
    isNull() {
      return true;
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
      return this._stringBuffer;
    }
    /**
     * Valueの値が静的ならtrue, 静的なら解放しない
     */
    isStatic() {
      return true;
    }
    /**
     * Valueにエラー値をセットする
     */
    setErrorNotForClientCall(s) {
      this._stringBuffer = s;
      return JsonError.nullValue;
    }
    /**
     * コンストラクタ
     */
    constructor() {
      super();
      this._stringBuffer = "NullValue";
    }
  }
  class JsonArray extends Value$1 {
    /**
     * コンストラクタ
     */
    constructor() {
      super();
      this._array = new csmVector();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      for (let ite = this._array.begin(); ite.notEqual(this._array.end()); ite.preIncrement()) {
        let v = ite.ptr();
        if (v && !v.isStatic()) {
          v = void 0;
          v = null;
        }
      }
    }
    /**
     * Valueの種類が配列ならtrue
     */
    isArray() {
      return true;
    }
    /**
     * 添字演算子[index]
     */
    getValueByIndex(index) {
      if (index < 0 || this._array.getSize() <= index) {
        return Value$1.errorValue.setErrorNotForClientCall(
          CSM_JSON_ERROR_INDEX_OF_BOUNDS
        );
      }
      const v = this._array.at(index);
      if (v == null) {
        return Value$1.nullValue;
      }
      return v;
    }
    /**
     * 添字演算子[string | csmString]
     */
    getValueByString(s) {
      return Value$1.errorValue.setErrorNotForClientCall(
        CSM_JSON_ERROR_TYPE_MISMATCH
      );
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
      const stringBuffer = indent + "[\n";
      for (let ite = this._array.begin(); ite.notEqual(this._array.end()); ite.increment()) {
        const v = ite.ptr();
        this._stringBuffer += indent + "" + v.getString(indent + " ") + "\n";
      }
      this._stringBuffer = stringBuffer + indent + "]\n";
      return this._stringBuffer;
    }
    /**
     * 配列要素を追加する
     * @param v 追加する要素
     */
    add(v) {
      this._array.pushBack(v);
    }
    /**
     * 要素をコンテナで返す(csmVector<Value>)
     */
    getVector(defaultValue = null) {
      return this._array;
    }
    /**
     * 要素の数を返す
     */
    getSize() {
      return this._array.getSize();
    }
    // JSON要素の値
  }
  class JsonMap extends Value$1 {
    /**
     * コンストラクタ
     */
    constructor() {
      super();
      this._map = new csmMap();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      const ite = this._map.begin();
      while (ite.notEqual(this._map.end())) {
        let v = ite.ptr().second;
        if (v && !v.isStatic()) {
          v = void 0;
          v = null;
        }
        ite.preIncrement();
      }
    }
    /**
     * Valueの値がMap型ならtrue
     */
    isMap() {
      return true;
    }
    /**
     * 添字演算子[string | csmString]
     */
    getValueByString(s) {
      if (s instanceof csmString) {
        const ret = this._map.getValue(s.s);
        if (ret == null) {
          return Value$1.nullValue;
        }
        return ret;
      }
      for (let iter = this._map.begin(); iter.notEqual(this._map.end()); iter.preIncrement()) {
        if (iter.ptr().first == s) {
          if (iter.ptr().second == null) {
            return Value$1.nullValue;
          }
          return iter.ptr().second;
        }
      }
      return Value$1.nullValue;
    }
    /**
     * 添字演算子[index]
     */
    getValueByIndex(index) {
      return Value$1.errorValue.setErrorNotForClientCall(
        CSM_JSON_ERROR_TYPE_MISMATCH
      );
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
      this._stringBuffer = indent + "{\n";
      const ite = this._map.begin();
      while (ite.notEqual(this._map.end())) {
        const key = ite.ptr().first;
        const v = ite.ptr().second;
        this._stringBuffer += indent + " " + key + " : " + v.getString(indent + "   ") + " \n";
        ite.preIncrement();
      }
      this._stringBuffer += indent + "}\n";
      return this._stringBuffer;
    }
    /**
     * 要素をMap型で返す
     */
    getMap(defaultValue) {
      return this._map;
    }
    /**
     * Mapに要素を追加する
     */
    put(key, v) {
      this._map.setValue(key, v);
    }
    /**
     * Mapからキーのリストを取得する
     */
    getKeys() {
      if (!this._keys) {
        this._keys = new csmVector();
        const ite = this._map.begin();
        while (ite.notEqual(this._map.end())) {
          const key = ite.ptr().first;
          this._keys.pushBack(key);
          ite.preIncrement();
        }
      }
      return this._keys;
    }
    /**
     * Mapの要素数を取得する
     */
    getSize() {
      return this._keys.getSize();
    }
    // JSON要素の値
  }
  var Live2DCubismFramework$c;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismJson = CubismJson;
    Live2DCubismFramework2.JsonArray = JsonArray;
    Live2DCubismFramework2.JsonBoolean = JsonBoolean;
    Live2DCubismFramework2.JsonError = JsonError;
    Live2DCubismFramework2.JsonFloat = JsonFloat;
    Live2DCubismFramework2.JsonMap = JsonMap;
    Live2DCubismFramework2.JsonNullvalue = JsonNullvalue;
    Live2DCubismFramework2.JsonString = JsonString;
    Live2DCubismFramework2.Value = Value$1;
  })(Live2DCubismFramework$c || (Live2DCubismFramework$c = {}));
  function strtod(s, endPtr) {
    let index = 0;
    for (let i = 1; ; i++) {
      const testC = s.slice(i - 1, i);
      if (testC == "e" || testC == "-" || testC == "E") {
        continue;
      }
      const test = s.substring(0, i);
      const number = Number(test);
      if (isNaN(number)) {
        break;
      }
      index = i;
    }
    let d = parseFloat(s);
    if (isNaN(d)) {
      d = NaN;
    }
    endPtr[0] = s.slice(index);
    return d;
  }
  let s_isStarted = false;
  let s_isInitialized = false;
  let s_option = null;
  let s_cubismIdManager = null;
  const Constant = Object.freeze({
    vertexOffset: 0,
    // メッシュ頂点のオフセット値
    vertexStep: 2
    // メッシュ頂点のステップ値
  });
  function csmDelete(address) {
    if (!address) {
      return;
    }
    address = void 0;
  }
  class CubismFramework {
    /**
     * Cubism FrameworkのAPIを使用可能にする。
     *  APIを実行する前に必ずこの関数を実行すること。
     *  一度準備が完了して以降は、再び実行しても内部処理がスキップされます。
     *
     * @param    option      Optionクラスのインスタンス
     *
     * @return   準備処理が完了したらtrueが返ります。
     */
    static startUp(option = null) {
      if (s_isStarted) {
        CubismLogInfo("CubismFramework.startUp() is already done.");
        return s_isStarted;
      }
      s_option = option;
      if (s_option != null) {
        Live2DCubismCore.Logging.csmSetLogFunction(s_option.logFunction);
      }
      s_isStarted = true;
      if (s_isStarted) {
        const version = Live2DCubismCore.Version.csmGetVersion();
        const major = (version & 4278190080) >> 24;
        const minor = (version & 16711680) >> 16;
        const patch = version & 65535;
        const versionNumber = version;
        CubismLogInfo(
          `Live2D Cubism Core version: {0}.{1}.{2} ({3})`,
          ("00" + major).slice(-2),
          ("00" + minor).slice(-2),
          ("0000" + patch).slice(-4),
          versionNumber
        );
      }
      CubismLogInfo("CubismFramework.startUp() is complete.");
      return s_isStarted;
    }
    /**
     * StartUp()で初期化したCubismFrameworkの各パラメータをクリアします。
     * Dispose()したCubismFrameworkを再利用する際に利用してください。
     */
    static cleanUp() {
      s_isStarted = false;
      s_isInitialized = false;
      s_option = null;
      s_cubismIdManager = null;
    }
    /**
     * Cubism Framework内のリソースを初期化してモデルを表示可能な状態にします。<br>
     *     再度Initialize()するには先にDispose()を実行する必要があります。
     *
     * @param memorySize 初期化時メモリ量 [byte(s)]
     *    複数モデル表示時などにモデルが更新されない際に使用してください。
     *    指定する際は必ず1024*1024*16 byte(16MB)以上の値を指定してください。
     *    それ以外はすべて1024*1024*16 byteに丸めます。
     */
    static initialize(memorySize = 0) {
      CSM_ASSERT(s_isStarted);
      if (!s_isStarted) {
        CubismLogWarning("CubismFramework is not started.");
        return;
      }
      if (s_isInitialized) {
        CubismLogWarning(
          "CubismFramework.initialize() skipped, already initialized."
        );
        return;
      }
      Value$1.staticInitializeNotForClientCall();
      s_cubismIdManager = new CubismIdManager();
      Live2DCubismCore.Memory.initializeAmountOfMemory(memorySize);
      s_isInitialized = true;
      CubismLogInfo("CubismFramework.initialize() is complete.");
    }
    /**
     * Cubism Framework内の全てのリソースを解放します。
     *      ただし、外部で確保されたリソースについては解放しません。
     *      外部で適切に破棄する必要があります。
     */
    static dispose() {
      CSM_ASSERT(s_isStarted);
      if (!s_isStarted) {
        CubismLogWarning("CubismFramework is not started.");
        return;
      }
      if (!s_isInitialized) {
        CubismLogWarning("CubismFramework.dispose() skipped, not initialized.");
        return;
      }
      Value$1.staticReleaseNotForClientCall();
      s_cubismIdManager.release();
      s_cubismIdManager = null;
      CubismRenderer.staticRelease();
      s_isInitialized = false;
      CubismLogInfo("CubismFramework.dispose() is complete.");
    }
    /**
     * Cubism FrameworkのAPIを使用する準備が完了したかどうか
     * @return APIを使用する準備が完了していればtrueが返ります。
     */
    static isStarted() {
      return s_isStarted;
    }
    /**
     * Cubism Frameworkのリソース初期化がすでに行われているかどうか
     * @return リソース確保が完了していればtrueが返ります
     */
    static isInitialized() {
      return s_isInitialized;
    }
    /**
     * Core APIにバインドしたログ関数を実行する
     *
     * @praram message ログメッセージ
     */
    static coreLogFunction(message) {
      if (!Live2DCubismCore.Logging.csmGetLogFunction()) {
        return;
      }
      Live2DCubismCore.Logging.csmGetLogFunction()(message);
    }
    /**
     * 現在のログ出力レベル設定の値を返す。
     *
     * @return  現在のログ出力レベル設定の値
     */
    static getLoggingLevel() {
      if (s_option != null) {
        return s_option.loggingLevel;
      }
      return 5;
    }
    /**
     * IDマネージャのインスタンスを取得する
     * @return CubismManagerクラスのインスタンス
     */
    static getIdManager() {
      return s_cubismIdManager;
    }
    /**
     * 静的クラスとして使用する
     * インスタンス化させない
     */
    constructor() {
    }
  }
  class Option {
    // ログ出力レベルの設定
  }
  var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
    LogLevel2[LogLevel2["LogLevel_Verbose"] = 0] = "LogLevel_Verbose";
    LogLevel2[LogLevel2["LogLevel_Debug"] = 1] = "LogLevel_Debug";
    LogLevel2[LogLevel2["LogLevel_Info"] = 2] = "LogLevel_Info";
    LogLevel2[LogLevel2["LogLevel_Warning"] = 3] = "LogLevel_Warning";
    LogLevel2[LogLevel2["LogLevel_Error"] = 4] = "LogLevel_Error";
    LogLevel2[LogLevel2["LogLevel_Off"] = 5] = "LogLevel_Off";
    return LogLevel2;
  })(LogLevel || {});
  var Live2DCubismFramework$b;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.Constant = Constant;
    Live2DCubismFramework2.csmDelete = csmDelete;
    Live2DCubismFramework2.CubismFramework = CubismFramework;
  })(Live2DCubismFramework$b || (Live2DCubismFramework$b = {}));
  const NS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    Constant,
    CubismFramework,
    get Live2DCubismFramework() {
      return Live2DCubismFramework$b;
    },
    LogLevel,
    Option,
    csmDelete,
    strtod
  }, Symbol.toStringTag, { value: "Module" }));
  class CubismVector2 {
    /**
     * コンストラクタ
     */
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.x = x == void 0 ? 0 : x;
      this.y = y == void 0 ? 0 : y;
    }
    /**
     * ベクトルの加算
     *
     * @param vector2 加算するベクトル値
     * @return 加算結果 ベクトル値
     */
    add(vector2) {
      const ret = new CubismVector2(0, 0);
      ret.x = this.x + vector2.x;
      ret.y = this.y + vector2.y;
      return ret;
    }
    /**
     * ベクトルの減算
     *
     * @param vector2 減算するベクトル値
     * @return 減算結果 ベクトル値
     */
    substract(vector2) {
      const ret = new CubismVector2(0, 0);
      ret.x = this.x - vector2.x;
      ret.y = this.y - vector2.y;
      return ret;
    }
    /**
     * ベクトルの乗算
     *
     * @param vector2 乗算するベクトル値
     * @return 乗算結果 ベクトル値
     */
    multiply(vector2) {
      const ret = new CubismVector2(0, 0);
      ret.x = this.x * vector2.x;
      ret.y = this.y * vector2.y;
      return ret;
    }
    /**
     * ベクトルの乗算(スカラー)
     *
     * @param scalar 乗算するスカラー値
     * @return 乗算結果 ベクトル値
     */
    multiplyByScaler(scalar) {
      return this.multiply(new CubismVector2(scalar, scalar));
    }
    /**
     * ベクトルの除算
     *
     * @param vector2 除算するベクトル値
     * @return 除算結果 ベクトル値
     */
    division(vector2) {
      const ret = new CubismVector2(0, 0);
      ret.x = this.x / vector2.x;
      ret.y = this.y / vector2.y;
      return ret;
    }
    /**
     * ベクトルの除算(スカラー)
     *
     * @param scalar 除算するスカラー値
     * @return 除算結果 ベクトル値
     */
    divisionByScalar(scalar) {
      return this.division(new CubismVector2(scalar, scalar));
    }
    /**
     * ベクトルの長さを取得する
     *
     * @return ベクトルの長さ
     */
    getLength() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * ベクトルの距離の取得
     *
     * @param a 点
     * @return ベクトルの距離
     */
    getDistanceWith(a) {
      return Math.sqrt(
        (this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y)
      );
    }
    /**
     * ドット積の計算
     *
     * @param a 値
     * @return 結果
     */
    dot(a) {
      return this.x * a.x + this.y * a.y;
    }
    /**
     * 正規化の適用
     */
    normalize() {
      const length = Math.pow(this.x * this.x + this.y * this.y, 0.5);
      this.x = this.x / length;
      this.y = this.y / length;
    }
    /**
     * 等しさの確認（等しいか？）
     *
     * 値が等しいか？
     *
     * @param rhs 確認する値
     * @return true 値は等しい
     * @return false 値は等しくない
     */
    isEqual(rhs) {
      return this.x == rhs.x && this.y == rhs.y;
    }
    /**
     * 等しさの確認（等しくないか？）
     *
     * 値が等しくないか？
     *
     * @param rhs 確認する値
     * @return true 値は等しくない
     * @return false 値は等しい
     */
    isNotEqual(rhs) {
      return !this.isEqual(rhs);
    }
  }
  var Live2DCubismFramework$a;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismVector2 = CubismVector2;
  })(Live2DCubismFramework$a || (Live2DCubismFramework$a = {}));
  const _CubismMath = class _CubismMath {
    /**
     * 第一引数の値を最小値と最大値の範囲に収めた値を返す
     *
     * @param value 収められる値
     * @param min   範囲の最小値
     * @param max   範囲の最大値
     * @return 最小値と最大値の範囲に収めた値
     */
    static range(value, min, max) {
      if (value < min) {
        value = min;
      } else if (value > max) {
        value = max;
      }
      return value;
    }
    /**
     * サイン関数の値を求める
     *
     * @param x 角度値（ラジアン）
     * @return サイン関数sin(x)の値
     */
    static sin(x) {
      return Math.sin(x);
    }
    /**
     * コサイン関数の値を求める
     *
     * @param x 角度値(ラジアン)
     * @return コサイン関数cos(x)の値
     */
    static cos(x) {
      return Math.cos(x);
    }
    /**
     * 値の絶対値を求める
     *
     * @param x 絶対値を求める値
     * @return 値の絶対値
     */
    static abs(x) {
      return Math.abs(x);
    }
    /**
     * 平方根(ルート)を求める
     * @param x -> 平方根を求める値
     * @return 値の平方根
     */
    static sqrt(x) {
      return Math.sqrt(x);
    }
    /**
     * 立方根を求める
     * @param x -> 立方根を求める値
     * @return 値の立方根
     */
    static cbrt(x) {
      if (x === 0) {
        return x;
      }
      let cx = x;
      const isNegativeNumber = cx < 0;
      if (isNegativeNumber) {
        cx = -cx;
      }
      let ret;
      if (cx === Infinity) {
        ret = Infinity;
      } else {
        ret = Math.exp(Math.log(cx) / 3);
        ret = (cx / (ret * ret) + 2 * ret) / 3;
      }
      return isNegativeNumber ? -ret : ret;
    }
    /**
     * イージング処理されたサインを求める
     * フェードイン・アウト時のイージングに利用できる
     *
     * @param value イージングを行う値
     * @return イージング処理されたサイン値
     */
    static getEasingSine(value) {
      if (value < 0) {
        return 0;
      } else if (value > 1) {
        return 1;
      }
      return 0.5 - 0.5 * this.cos(value * Math.PI);
    }
    /**
     * 大きい方の値を返す
     *
     * @param left 左辺の値
     * @param right 右辺の値
     * @return 大きい方の値
     */
    static max(left, right) {
      return left > right ? left : right;
    }
    /**
     * 小さい方の値を返す
     *
     * @param left  左辺の値
     * @param right 右辺の値
     * @return 小さい方の値
     */
    static min(left, right) {
      return left > right ? right : left;
    }
    static clamp(val, min, max) {
      if (val < min) {
        return min;
      } else if (max < val) {
        return max;
      }
      return val;
    }
    /**
     * 角度値をラジアン値に変換する
     *
     * @param degrees   角度値
     * @return 角度値から変換したラジアン値
     */
    static degreesToRadian(degrees) {
      return degrees / 180 * Math.PI;
    }
    /**
     * ラジアン値を角度値に変換する
     *
     * @param radian    ラジアン値
     * @return ラジアン値から変換した角度値
     */
    static radianToDegrees(radian) {
      return radian * 180 / Math.PI;
    }
    /**
     * ２つのベクトルからラジアン値を求める
     *
     * @param from  始点ベクトル
     * @param to    終点ベクトル
     * @return ラジアン値から求めた方向ベクトル
     */
    static directionToRadian(from, to) {
      const q1 = Math.atan2(to.y, to.x);
      const q2 = Math.atan2(from.y, from.x);
      let ret = q1 - q2;
      while (ret < -Math.PI) {
        ret += Math.PI * 2;
      }
      while (ret > Math.PI) {
        ret -= Math.PI * 2;
      }
      return ret;
    }
    /**
     * ２つのベクトルから角度値を求める
     *
     * @param from  始点ベクトル
     * @param to    終点ベクトル
     * @return 角度値から求めた方向ベクトル
     */
    static directionToDegrees(from, to) {
      const radian = this.directionToRadian(from, to);
      let degree = this.radianToDegrees(radian);
      if (to.x - from.x > 0) {
        degree = -degree;
      }
      return degree;
    }
    /**
     * ラジアン値を方向ベクトルに変換する。
     *
     * @param totalAngle    ラジアン値
     * @return ラジアン値から変換した方向ベクトル
     */
    static radianToDirection(totalAngle) {
      const ret = new CubismVector2();
      ret.x = this.sin(totalAngle);
      ret.y = this.cos(totalAngle);
      return ret;
    }
    /**
     * 三次方程式の三次項の係数が0になったときに補欠的に二次方程式の解をもとめる。
     * a * x^2 + b * x + c = 0
     *
     * @param   a -> 二次項の係数値
     * @param   b -> 一次項の係数値
     * @param   c -> 定数項の値
     * @return  二次方程式の解
     */
    static quadraticEquation(a, b, c) {
      if (this.abs(a) < _CubismMath.Epsilon) {
        if (this.abs(b) < _CubismMath.Epsilon) {
          return -c;
        }
        return -c / b;
      }
      return -(b + this.sqrt(b * b - 4 * a * c)) / (2 * a);
    }
    /**
     * カルダノの公式によってベジェのt値に該当する３次方程式の解を求める。
     * 重解になったときには0.0～1.0の値になる解を返す。
     *
     * a * x^3 + b * x^2 + c * x + d = 0
     *
     * @param   a -> 三次項の係数値
     * @param   b -> 二次項の係数値
     * @param   c -> 一次項の係数値
     * @param   d -> 定数項の値
     * @return  0.0～1.0の間にある解
     */
    static cardanoAlgorithmForBezier(a, b, c, d) {
      if (this.abs(a) < _CubismMath.Epsilon) {
        return this.range(this.quadraticEquation(b, c, d), 0, 1);
      }
      const ba = b / a;
      const ca = c / a;
      const da = d / a;
      const p = (3 * ca - ba * ba) / 3;
      const p3 = p / 3;
      const q = (2 * ba * ba * ba - 9 * ba * ca + 27 * da) / 27;
      const q2 = q / 2;
      const discriminant = q2 * q2 + p3 * p3 * p3;
      const center = 0.5;
      const threshold = center + 0.01;
      if (discriminant < 0) {
        const mp3 = -p / 3;
        const mp33 = mp3 * mp3 * mp3;
        const r = this.sqrt(mp33);
        const t = -q / (2 * r);
        const cosphi = this.range(t, -1, 1);
        const phi = Math.acos(cosphi);
        const crtr = this.cbrt(r);
        const t1 = 2 * crtr;
        const root12 = t1 * this.cos(phi / 3) - ba / 3;
        if (this.abs(root12 - center) < threshold) {
          return this.range(root12, 0, 1);
        }
        const root2 = t1 * this.cos((phi + 2 * Math.PI) / 3) - ba / 3;
        if (this.abs(root2 - center) < threshold) {
          return this.range(root2, 0, 1);
        }
        const root3 = t1 * this.cos((phi + 4 * Math.PI) / 3) - ba / 3;
        return this.range(root3, 0, 1);
      }
      if (discriminant == 0) {
        let u12;
        if (q2 < 0) {
          u12 = this.cbrt(-q2);
        } else {
          u12 = -this.cbrt(q2);
        }
        const root12 = 2 * u12 - ba / 3;
        if (this.abs(root12 - center) < threshold) {
          return this.range(root12, 0, 1);
        }
        const root2 = -u12 - ba / 3;
        return this.range(root2, 0, 1);
      }
      const sd = this.sqrt(discriminant);
      const u1 = this.cbrt(sd - q2);
      const v1 = this.cbrt(sd + q2);
      const root1 = u1 - v1 - ba / 3;
      return this.range(root1, 0, 1);
    }
    /**
     * 浮動小数点の余りを求める。
     *
     * @param dividend 被除数（割られる値）
     * @param divisor 除数（割る値）
     * @returns 余り
     */
    static mod(dividend, divisor) {
      if (!isFinite(dividend) || divisor === 0 || isNaN(dividend) || isNaN(divisor)) {
        console.warn(
          `divided: ${dividend}, divisor: ${divisor} mod() returns 'NaN'.`
        );
        return NaN;
      }
      const absDividend = Math.abs(dividend);
      const absDivisor = Math.abs(divisor);
      let result = absDividend - Math.floor(absDividend / absDivisor) * absDivisor;
      result *= Math.sign(dividend);
      return result;
    }
    /**
     * コンストラクタ
     */
    constructor() {
    }
  };
  _CubismMath.Epsilon = 1e-5;
  let CubismMath = _CubismMath;
  var Live2DCubismFramework$9;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismMath = CubismMath;
  })(Live2DCubismFramework$9 || (Live2DCubismFramework$9 = {}));
  class ParameterRepeatData {
    /**
     * Constructor
     *
     * @param isOverridden whether to be overriden
     * @param isParameterRepeated override flag for settings
     */
    constructor(isOverridden = false, isParameterRepeated = false) {
      this.isOverridden = isOverridden;
      this.isParameterRepeated = isParameterRepeated;
    }
  }
  class DrawableColorData {
    constructor(isOverridden = false, color = new CubismTextureColor()) {
      this.isOverridden = isOverridden;
      this.color = color;
    }
    get isOverwritten() {
      return this.isOverridden;
    }
  }
  class PartColorData {
    constructor(isOverridden = false, color = new CubismTextureColor()) {
      this.isOverridden = isOverridden;
      this.color = color;
    }
    get isOverwritten() {
      return this.isOverridden;
    }
  }
  class DrawableCullingData {
    /**
     * コンストラクタ
     *
     * @param isOverridden
     * @param isCulling
     */
    constructor(isOverridden = false, isCulling = false) {
      this.isOverridden = isOverridden;
      this.isCulling = isCulling;
    }
    get isOverwritten() {
      return this.isOverridden;
    }
  }
  class CubismModel {
    /**
     * モデルのパラメータの更新
     */
    update() {
      this._model.update();
      this._model.drawables.resetDynamicFlags();
    }
    /**
     * PixelsPerUnitを取得する
     * @returns PixelsPerUnit
     */
    getPixelsPerUnit() {
      if (this._model == null) {
        return 0;
      }
      return this._model.canvasinfo.PixelsPerUnit;
    }
    /**
     * キャンバスの幅を取得する
     */
    getCanvasWidth() {
      if (this._model == null) {
        return 0;
      }
      return this._model.canvasinfo.CanvasWidth / this._model.canvasinfo.PixelsPerUnit;
    }
    /**
     * キャンバスの高さを取得する
     */
    getCanvasHeight() {
      if (this._model == null) {
        return 0;
      }
      return this._model.canvasinfo.CanvasHeight / this._model.canvasinfo.PixelsPerUnit;
    }
    /**
     * パラメータを保存する
     */
    saveParameters() {
      const parameterCount = this._model.parameters.count;
      const savedParameterCount = this._savedParameters.getSize();
      for (let i = 0; i < parameterCount; ++i) {
        if (i < savedParameterCount) {
          this._savedParameters.set(i, this._parameterValues[i]);
        } else {
          this._savedParameters.pushBack(this._parameterValues[i]);
        }
      }
    }
    /**
     * 乗算色を取得する
     * @param index Drawablesのインデックス
     * @returns 指定したdrawableの乗算色(RGBA)
     */
    getMultiplyColor(index) {
      if (this.getOverrideFlagForModelMultiplyColors() || this.getOverrideFlagForDrawableMultiplyColors(index)) {
        return this._userMultiplyColors.at(index).color;
      }
      const color = this.getDrawableMultiplyColor(index);
      return color;
    }
    /**
     * スクリーン色を取得する
     * @param index Drawablesのインデックス
     * @returns 指定したdrawableのスクリーン色(RGBA)
     */
    getScreenColor(index) {
      if (this.getOverrideFlagForModelScreenColors() || this.getOverrideFlagForDrawableScreenColors(index)) {
        return this._userScreenColors.at(index).color;
      }
      const color = this.getDrawableScreenColor(index);
      return color;
    }
    /**
     * 乗算色をセットする
     * @param index Drawablesのインデックス
     * @param color 設定する乗算色(CubismTextureColor)
     */
    setMultiplyColorByTextureColor(index, color) {
      this.setMultiplyColorByRGBA(index, color.r, color.g, color.b, color.a);
    }
    /**
     * 乗算色をセットする
     * @param index Drawablesのインデックス
     * @param r 設定する乗算色のR値
     * @param g 設定する乗算色のG値
     * @param b 設定する乗算色のB値
     * @param a 設定する乗算色のA値
     */
    setMultiplyColorByRGBA(index, r, g, b, a = 1) {
      this._userMultiplyColors.at(index).color.r = r;
      this._userMultiplyColors.at(index).color.g = g;
      this._userMultiplyColors.at(index).color.b = b;
      this._userMultiplyColors.at(index).color.a = a;
    }
    /**
     * スクリーン色をセットする
     * @param index Drawablesのインデックス
     * @param color 設定するスクリーン色(CubismTextureColor)
     */
    setScreenColorByTextureColor(index, color) {
      this.setScreenColorByRGBA(index, color.r, color.g, color.b, color.a);
    }
    /**
     * スクリーン色をセットする
     * @param index Drawablesのインデックス
     * @param r 設定するスクリーン色のR値
     * @param g 設定するスクリーン色のG値
     * @param b 設定するスクリーン色のB値
     * @param a 設定するスクリーン色のA値
     */
    setScreenColorByRGBA(index, r, g, b, a = 1) {
      this._userScreenColors.at(index).color.r = r;
      this._userScreenColors.at(index).color.g = g;
      this._userScreenColors.at(index).color.b = b;
      this._userScreenColors.at(index).color.a = a;
    }
    /**
     * partの乗算色を取得する
     * @param partIndex partのインデックス
     * @returns 指定したpartの乗算色
     */
    getPartMultiplyColor(partIndex) {
      return this._userPartMultiplyColors.at(partIndex).color;
    }
    /**
     * partのスクリーン色を取得する
     * @param partIndex partのインデックス
     * @returns 指定したpartのスクリーン色
     */
    getPartScreenColor(partIndex) {
      return this._userPartScreenColors.at(partIndex).color;
    }
    /**
     * partのOverrideColor setter関数
     * @param partIndex partのインデックス
     * @param r 設定する色のR値
     * @param g 設定する色のG値
     * @param b 設定する色のB値
     * @param a 設定する色のA値
     * @param partColors 設定するpartのカラーデータ配列
     * @param drawableColors partに関連するDrawableのカラーデータ配列
     */
    setPartColor(partIndex, r, g, b, a, partColors, drawableColors) {
      partColors.at(partIndex).color.r = r;
      partColors.at(partIndex).color.g = g;
      partColors.at(partIndex).color.b = b;
      partColors.at(partIndex).color.a = a;
      if (partColors.at(partIndex).isOverridden) {
        for (let i = 0; i < this._partChildDrawables.at(partIndex).getSize(); ++i) {
          const drawableIndex = this._partChildDrawables.at(partIndex).at(i);
          drawableColors.at(drawableIndex).color.r = r;
          drawableColors.at(drawableIndex).color.g = g;
          drawableColors.at(drawableIndex).color.b = b;
          drawableColors.at(drawableIndex).color.a = a;
        }
      }
    }
    /**
     * 乗算色をセットする
     * @param partIndex partのインデックス
     * @param color 設定する乗算色(CubismTextureColor)
     */
    setPartMultiplyColorByTextureColor(partIndex, color) {
      this.setPartMultiplyColorByRGBA(
        partIndex,
        color.r,
        color.g,
        color.b,
        color.a
      );
    }
    /**
     * 乗算色をセットする
     * @param partIndex partのインデックス
     * @param r 設定する乗算色のR値
     * @param g 設定する乗算色のG値
     * @param b 設定する乗算色のB値
     * @param a 設定する乗算色のA値
     */
    setPartMultiplyColorByRGBA(partIndex, r, g, b, a) {
      this.setPartColor(
        partIndex,
        r,
        g,
        b,
        a,
        this._userPartMultiplyColors,
        this._userMultiplyColors
      );
    }
    /**
     * スクリーン色をセットする
     * @param partIndex partのインデックス
     * @param color 設定するスクリーン色(CubismTextureColor)
     */
    setPartScreenColorByTextureColor(partIndex, color) {
      this.setPartScreenColorByRGBA(
        partIndex,
        color.r,
        color.g,
        color.b,
        color.a
      );
    }
    /**
     * スクリーン色をセットする
     * @param partIndex partのインデックス
     * @param r 設定するスクリーン色のR値
     * @param g 設定するスクリーン色のG値
     * @param b 設定するスクリーン色のB値
     * @param a 設定するスクリーン色のA値
     */
    setPartScreenColorByRGBA(partIndex, r, g, b, a) {
      this.setPartColor(
        partIndex,
        r,
        g,
        b,
        a,
        this._userPartScreenColors,
        this._userScreenColors
      );
    }
    /**
     * Checks whether parameter repetition is performed for the entire model.
     *
     * @return true if parameter repetition is performed for the entire model; otherwise returns false.
     */
    getOverrideFlagForModelParameterRepeat() {
      return this._isOverriddenParameterRepeat;
    }
    /**
     * Sets whether parameter repetition is performed for the entire model.
     * Use true to perform parameter repetition for the entire model, or false to not perform it.
     */
    setOverrideFlagForModelParameterRepeat(isRepeat) {
      this._isOverriddenParameterRepeat = isRepeat;
    }
    /**
     * Returns the flag indicating whether to override the parameter repeat.
     *
     * @param parameterIndex Parameter index
     *
     * @return true if the parameter repeat is overridden, false otherwise.
     */
    getOverrideFlagForParameterRepeat(parameterIndex) {
      return this._userParameterRepeatDataList.at(parameterIndex).isOverridden;
    }
    /**
     * Sets the flag indicating whether to override the parameter repeat.
     *
     * @param parameterIndex Parameter index
     * @param value true if it is to be overridden; otherwise, false.
     */
    setOverrideFlagForParameterRepeat(parameterIndex, value) {
      this._userParameterRepeatDataList.at(parameterIndex).isOverridden = value;
    }
    /**
     * Returns the repeat flag.
     *
     * @param parameterIndex Parameter index
     *
     * @return true if repeating, false otherwise.
     */
    getRepeatFlagForParameterRepeat(parameterIndex) {
      return this._userParameterRepeatDataList.at(parameterIndex).isParameterRepeated;
    }
    /**
     * Sets the repeat flag.
     *
     * @param parameterIndex Parameter index
     * @param value true to enable repeating, false otherwise.
     */
    setRepeatFlagForParameterRepeat(parameterIndex, value) {
      this._userParameterRepeatDataList.at(parameterIndex).isParameterRepeated = value;
    }
    /**
     * SDKから指定したモデルの乗算色を上書きするか
     *
     * @deprecated 名称変更のため非推奨 getOverrideFlagForModelMultiplyColors() に置き換え
     *
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverwriteFlagForModelMultiplyColors() {
      CubismLogWarning(
        "getOverwriteFlagForModelMultiplyColors() is a deprecated function. Please use getOverrideFlagForModelMultiplyColors()."
      );
      return this.getOverrideFlagForModelMultiplyColors();
    }
    /**
     * SDKから指定したモデルの乗算色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverrideFlagForModelMultiplyColors() {
      return this._isOverriddenModelMultiplyColors;
    }
    /**
     * SDKから指定したモデルのスクリーン色を上書きするか
     *
     * @deprecated 名称変更のため非推奨 getOverrideFlagForModelScreenColors() に置き換え
     *
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverwriteFlagForModelScreenColors() {
      CubismLogWarning(
        "getOverwriteFlagForModelScreenColors() is a deprecated function. Please use getOverrideFlagForModelScreenColors()."
      );
      return this.getOverrideFlagForModelScreenColors();
    }
    /**
     * SDKから指定したモデルのスクリーン色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverrideFlagForModelScreenColors() {
      return this._isOverriddenModelScreenColors;
    }
    /**
     * SDKから指定したモデルの乗算色を上書きするかセットする
     *
     * @deprecated 名称変更のため非推奨 setOverrideFlagForModelMultiplyColors(value: boolean) に置き換え
     *
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteFlagForModelMultiplyColors(value) {
      CubismLogWarning(
        "setOverwriteFlagForModelMultiplyColors(value: boolean) is a deprecated function. Please use setOverrideFlagForModelMultiplyColors(value: boolean)."
      );
      this.setOverrideFlagForModelMultiplyColors(value);
    }
    /**
     * SDKから指定したモデルの乗算色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverrideFlagForModelMultiplyColors(value) {
      this._isOverriddenModelMultiplyColors = value;
    }
    /**
     * SDKから指定したモデルのスクリーン色を上書きするかセットする
     *
     * @deprecated 名称変更のため非推奨 setOverrideFlagForModelScreenColors(value: boolean) に置き換え
     *
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteFlagForModelScreenColors(value) {
      CubismLogWarning(
        "setOverwriteFlagForModelScreenColors(value: boolean) is a deprecated function. Please use setOverrideFlagForModelScreenColors(value: boolean)."
      );
      this.setOverrideFlagForModelScreenColors(value);
    }
    /**
     * SDKから指定したモデルのスクリーン色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverrideFlagForModelScreenColors(value) {
      this._isOverriddenModelScreenColors = value;
    }
    /**
     * SDKから指定したDrawableIndexの乗算色を上書きするか
     *
     * @deprecated 名称変更のため非推奨 getOverrideFlagForDrawableMultiplyColors(drawableindex: number) に置き換え
     *
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverwriteFlagForDrawableMultiplyColors(drawableindex) {
      CubismLogWarning(
        "getOverwriteFlagForDrawableMultiplyColors(drawableindex: number) is a deprecated function. Please use getOverrideFlagForDrawableMultiplyColors(drawableindex: number)."
      );
      return this.getOverrideFlagForDrawableMultiplyColors(drawableindex);
    }
    /**
     * SDKから指定したDrawableIndexの乗算色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverrideFlagForDrawableMultiplyColors(drawableindex) {
      return this._userMultiplyColors.at(drawableindex).isOverridden;
    }
    /**
     * SDKから指定したDrawableIndexのスクリーン色を上書きするか
     *
     * @deprecated 名称変更のため非推奨 getOverrideFlagForDrawableScreenColors(drawableindex: number) に置き換え
     *
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverwriteFlagForDrawableScreenColors(drawableindex) {
      CubismLogWarning(
        "getOverwriteFlagForDrawableScreenColors(drawableindex: number) is a deprecated function. Please use getOverrideFlagForDrawableScreenColors(drawableindex: number)."
      );
      return this.getOverrideFlagForDrawableScreenColors(drawableindex);
    }
    /**
     * SDKから指定したDrawableIndexのスクリーン色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverrideFlagForDrawableScreenColors(drawableindex) {
      return this._userScreenColors.at(drawableindex).isOverridden;
    }
    /**
     * SDKから指定したDrawableIndexの乗算色を上書きするかセットする
     *
     * @deprecated 名称変更のため非推奨 setOverrideFlagForDrawableMultiplyColors(drawableindex: number, value: boolean) に置き換え
     *
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteFlagForDrawableMultiplyColors(drawableindex, value) {
      CubismLogWarning(
        "setOverwriteFlagForDrawableMultiplyColors(drawableindex: number, value: boolean) is a deprecated function. Please use setOverrideFlagForDrawableMultiplyColors(drawableindex: number, value: boolean)."
      );
      this.setOverrideFlagForDrawableMultiplyColors(drawableindex, value);
    }
    /**
     * SDKから指定したDrawableIndexの乗算色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverrideFlagForDrawableMultiplyColors(drawableindex, value) {
      this._userMultiplyColors.at(drawableindex).isOverridden = value;
    }
    /**
     * SDKから指定したDrawableIndexのスクリーン色を上書きするかセットする
     *
     * @deprecated 名称変更のため非推奨 setOverrideFlagForDrawableScreenColors(drawableindex: number, value: boolean) に置き換え
     *
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteFlagForDrawableScreenColors(drawableindex, value) {
      CubismLogWarning(
        "setOverwriteFlagForDrawableScreenColors(drawableindex: number, value: boolean) is a deprecated function. Please use setOverrideFlagForDrawableScreenColors(drawableindex: number, value: boolean)."
      );
      this.setOverrideFlagForDrawableScreenColors(drawableindex, value);
    }
    /**
     * SDKから指定したDrawableIndexのスクリーン色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverrideFlagForDrawableScreenColors(drawableindex, value) {
      this._userScreenColors.at(drawableindex).isOverridden = value;
    }
    /**
     * SDKからpartの乗算色を上書きするか
     *
     * @deprecated 名称変更のため非推奨 getOverrideColorForPartMultiplyColors(partIndex: number) に置き換え
     *
     * @param partIndex partのインデックス
     * @returns true    ->  SDKからの情報を優先する
     *          false   ->  モデルに設定されている色情報を使用
     */
    getOverwriteColorForPartMultiplyColors(partIndex) {
      CubismLogWarning(
        "getOverwriteColorForPartMultiplyColors(partIndex: number) is a deprecated function. Please use getOverrideColorForPartMultiplyColors(partIndex: number)."
      );
      return this.getOverrideColorForPartMultiplyColors(partIndex);
    }
    /**
     * SDKからpartの乗算色を上書きするか
     * @param partIndex partのインデックス
     * @returns true    ->  SDKからの情報を優先する
     *          false   ->  モデルに設定されている色情報を使用
     */
    getOverrideColorForPartMultiplyColors(partIndex) {
      return this._userPartMultiplyColors.at(partIndex).isOverridden;
    }
    /**
     * SDKからpartのスクリーン色を上書きするか
     *
     * @deprecated 名称変更のため非推奨 getOverrideColorForPartScreenColors(partIndex: number) に置き換え
     *
     * @param partIndex partのインデックス
     * @returns true    ->  SDKからの情報を優先する
     *          false   ->  モデルに設定されている色情報を使用
     */
    getOverwriteColorForPartScreenColors(partIndex) {
      CubismLogWarning(
        "getOverwriteColorForPartScreenColors(partIndex: number) is a deprecated function. Please use getOverrideColorForPartScreenColors(partIndex: number)."
      );
      return this.getOverrideColorForPartScreenColors(partIndex);
    }
    /**
     * SDKからpartのスクリーン色を上書きするか
     * @param partIndex partのインデックス
     * @returns true    ->  SDKからの情報を優先する
     *          false   ->  モデルに設定されている色情報を使用
     */
    getOverrideColorForPartScreenColors(partIndex) {
      return this._userPartScreenColors.at(partIndex).isOverridden;
    }
    /**
     * partのOverrideFlag setter関数
     *
     * @deprecated 名称変更のため非推奨 setOverrideColorForPartColors(
     * partIndex: number,
     * value: boolean,
     * partColors: csmVector<PartColorData>,
     * drawableColors: csmVector<DrawableColorData>) に置き換え
     *
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     * @param partColors 設定するpartのカラーデータ配列
     * @param drawableColors partに関連するDrawableのカラーデータ配列
     */
    setOverwriteColorForPartColors(partIndex, value, partColors, drawableColors) {
      CubismLogWarning(
        "setOverwriteColorForPartColors(partIndex: number, value: boolean, partColors: csmVector<PartColorData>, drawableColors: csmVector<DrawableColorData>) is a deprecated function. Please use setOverrideColorForPartColors(partIndex: number, value: boolean, partColors: csmVector<PartColorData>, drawableColors: csmVector<DrawableColorData>)."
      );
      this.setOverrideColorForPartColors(
        partIndex,
        value,
        partColors,
        drawableColors
      );
    }
    /**
     * partのOverrideFlag setter関数
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     * @param partColors 設定するpartのカラーデータ配列
     * @param drawableColors partに関連するDrawableのカラーデータ配列
     */
    setOverrideColorForPartColors(partIndex, value, partColors, drawableColors) {
      partColors.at(partIndex).isOverridden = value;
      for (let i = 0; i < this._partChildDrawables.at(partIndex).getSize(); ++i) {
        const drawableIndex = this._partChildDrawables.at(partIndex).at(i);
        drawableColors.at(drawableIndex).isOverridden = value;
        if (value) {
          drawableColors.at(drawableIndex).color.r = partColors.at(partIndex).color.r;
          drawableColors.at(drawableIndex).color.g = partColors.at(partIndex).color.g;
          drawableColors.at(drawableIndex).color.b = partColors.at(partIndex).color.b;
          drawableColors.at(drawableIndex).color.a = partColors.at(partIndex).color.a;
        }
      }
    }
    /**
     * SDKからpartのスクリーン色を上書きするかをセットする
     *
     * @deprecated 名称変更のため非推奨 setOverrideColorForPartMultiplyColors(partIndex: number, value: boolean) に置き換え
     *
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteColorForPartMultiplyColors(partIndex, value) {
      CubismLogWarning(
        "setOverwriteColorForPartMultiplyColors(partIndex: number, value: boolean) is a deprecated function. Please use setOverrideColorForPartMultiplyColors(partIndex: number, value: boolean)."
      );
      this.setOverrideColorForPartMultiplyColors(partIndex, value);
    }
    /**
     * SDKからpartのスクリーン色を上書きするかをセットする
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverrideColorForPartMultiplyColors(partIndex, value) {
      this._userPartMultiplyColors.at(partIndex).isOverridden = value;
      this.setOverrideColorForPartColors(
        partIndex,
        value,
        this._userPartMultiplyColors,
        this._userMultiplyColors
      );
    }
    /**
     * SDKからpartのスクリーン色を上書きするかをセットする
     *
     * @deprecated 名称変更のため非推奨 setOverrideColorForPartScreenColors(partIndex: number, value: boolean) に置き換え
     *
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteColorForPartScreenColors(partIndex, value) {
      CubismLogWarning(
        "setOverwriteColorForPartScreenColors(partIndex: number, value: boolean) is a deprecated function. Please use setOverrideColorForPartScreenColors(partIndex: number, value: boolean)."
      );
      this.setOverrideColorForPartScreenColors(partIndex, value);
    }
    /**
     * SDKからpartのスクリーン色を上書きするかをセットする
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverrideColorForPartScreenColors(partIndex, value) {
      this._userPartScreenColors.at(partIndex).isOverridden = value;
      this.setOverrideColorForPartColors(
        partIndex,
        value,
        this._userPartScreenColors,
        this._userScreenColors
      );
    }
    /**
     * Drawableのカリング情報を取得する。
     *
     * @param   drawableIndex   Drawableのインデックス
     * @return  Drawableのカリング情報
     */
    getDrawableCulling(drawableIndex) {
      if (this.getOverrideFlagForModelCullings() || this.getOverrideFlagForDrawableCullings(drawableIndex)) {
        return this._userCullings.at(drawableIndex).isCulling;
      }
      const constantFlags = this._model.drawables.constantFlags;
      return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(
        constantFlags[drawableIndex]
      );
    }
    /**
     * Drawableのカリング情報を設定する。
     *
     * @param drawableIndex Drawableのインデックス
     * @param isCulling カリング情報
     */
    setDrawableCulling(drawableIndex, isCulling) {
      this._userCullings.at(drawableIndex).isCulling = isCulling;
    }
    /**
     * SDKからモデル全体のカリング設定を上書きするか。
     *
     * @deprecated 名称変更のため非推奨 getOverrideFlagForModelCullings() に置き換え
     *
     * @retval  true    ->  SDK上のカリング設定を使用
     * @retval  false   ->  モデルのカリング設定を使用
     */
    getOverwriteFlagForModelCullings() {
      CubismLogWarning(
        "getOverwriteFlagForModelCullings() is a deprecated function. Please use getOverrideFlagForModelCullings()."
      );
      return this.getOverrideFlagForModelCullings();
    }
    /**
     * SDKからモデル全体のカリング設定を上書きするか。
     *
     * @retval  true    ->  SDK上のカリング設定を使用
     * @retval  false   ->  モデルのカリング設定を使用
     */
    getOverrideFlagForModelCullings() {
      return this._isOverriddenCullings;
    }
    /**
     * SDKからモデル全体のカリング設定を上書きするかを設定する。
     *
     * @deprecated 名称変更のため非推奨 setOverrideFlagForModelCullings(isOverriddenCullings: boolean) に置き換え
     *
     * @param isOveriddenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
     */
    setOverwriteFlagForModelCullings(isOverriddenCullings) {
      CubismLogWarning(
        "setOverwriteFlagForModelCullings(isOverriddenCullings: boolean) is a deprecated function. Please use setOverrideFlagForModelCullings(isOverriddenCullings: boolean)."
      );
      this.setOverrideFlagForModelCullings(isOverriddenCullings);
    }
    /**
     * SDKからモデル全体のカリング設定を上書きするかを設定する。
     *
     * @param isOverriddenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
     */
    setOverrideFlagForModelCullings(isOverriddenCullings) {
      this._isOverriddenCullings = isOverriddenCullings;
    }
    /**
     *
     * @deprecated 名称変更のため非推奨 getOverrideFlagForDrawableCullings(drawableIndex: number) に置き換え
     *
     * @param drawableIndex Drawableのインデックス
     * @retval  true    ->  SDK上のカリング設定を使用
     * @retval  false   ->  モデルのカリング設定を使用
     */
    getOverwriteFlagForDrawableCullings(drawableIndex) {
      CubismLogWarning(
        "getOverwriteFlagForDrawableCullings(drawableIndex: number) is a deprecated function. Please use getOverrideFlagForDrawableCullings(drawableIndex: number)."
      );
      return this.getOverrideFlagForDrawableCullings(drawableIndex);
    }
    /**
     *
     * @param drawableIndex Drawableのインデックス
     * @retval  true    ->  SDK上のカリング設定を使用
     * @retval  false   ->  モデルのカリング設定を使用
     */
    getOverrideFlagForDrawableCullings(drawableIndex) {
      return this._userCullings.at(drawableIndex).isOverridden;
    }
    /**
     *
     * @deprecated 名称変更のため非推奨 setOverrideFlagForDrawableCullings(drawableIndex: number, isOverriddenCullings: bolean) に置き換え
     *
     * @param drawableIndex Drawableのインデックス
     * @param isOverriddenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
     */
    setOverwriteFlagForDrawableCullings(drawableIndex, isOverriddenCullings) {
      CubismLogWarning(
        "setOverwriteFlagForDrawableCullings(drawableIndex: number, isOverriddenCullings: boolean) is a deprecated function. Please use setOverrideFlagForDrawableCullings(drawableIndex: number, isOverriddenCullings: boolean)."
      );
      this.setOverrideFlagForDrawableCullings(
        drawableIndex,
        isOverriddenCullings
      );
    }
    /**
     *
     * @param drawableIndex Drawableのインデックス
     * @param isOverriddenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
     */
    setOverrideFlagForDrawableCullings(drawableIndex, isOverriddenCullings) {
      this._userCullings.at(drawableIndex).isOverridden = isOverriddenCullings;
    }
    /**
     * モデルの不透明度を取得する
     *
     * @returns 不透明度の値
     */
    getModelOapcity() {
      return this._modelOpacity;
    }
    /**
     * モデルの不透明度を設定する
     *
     * @param value 不透明度の値
     */
    setModelOapcity(value) {
      this._modelOpacity = value;
    }
    /**
     * モデルを取得
     */
    getModel() {
      return this._model;
    }
    /**
     * パーツのインデックスを取得
     * @param partId パーツのID
     * @return パーツのインデックス
     */
    getPartIndex(partId) {
      let partIndex;
      const partCount = this._model.parts.count;
      for (partIndex = 0; partIndex < partCount; ++partIndex) {
        if (partId == this._partIds.at(partIndex)) {
          return partIndex;
        }
      }
      if (this._notExistPartId.isExist(partId)) {
        return this._notExistPartId.getValue(partId);
      }
      partIndex = partCount + this._notExistPartId.getSize();
      this._notExistPartId.setValue(partId, partIndex);
      this._notExistPartOpacities.appendKey(partIndex);
      return partIndex;
    }
    /**
     * パーツのIDを取得する。
     *
     * @param partIndex 取得するパーツのインデックス
     * @return パーツのID
     */
    getPartId(partIndex) {
      const partId = this._model.parts.ids[partIndex];
      return CubismFramework.getIdManager().getId(partId);
    }
    /**
     * パーツの個数の取得
     * @return パーツの個数
     */
    getPartCount() {
      const partCount = this._model.parts.count;
      return partCount;
    }
    /**
     * パーツの親パーツインデックスのリストを取得
     *
     * @returns パーツの親パーツインデックスのリスト
     */
    getPartParentPartIndices() {
      const parentIndices = this._model.parts.parentIndices;
      return parentIndices;
    }
    /**
     * パーツの不透明度の設定(Index)
     * @param partIndex パーツのインデックス
     * @param opacity 不透明度
     */
    setPartOpacityByIndex(partIndex, opacity) {
      if (this._notExistPartOpacities.isExist(partIndex)) {
        this._notExistPartOpacities.setValue(partIndex, opacity);
        return;
      }
      CSM_ASSERT(0 <= partIndex && partIndex < this.getPartCount());
      this._partOpacities[partIndex] = opacity;
    }
    /**
     * パーツの不透明度の設定(Id)
     * @param partId パーツのID
     * @param opacity パーツの不透明度
     */
    setPartOpacityById(partId, opacity) {
      const index = this.getPartIndex(partId);
      if (index < 0) {
        return;
      }
      this.setPartOpacityByIndex(index, opacity);
    }
    /**
     * パーツの不透明度の取得(index)
     * @param partIndex パーツのインデックス
     * @return パーツの不透明度
     */
    getPartOpacityByIndex(partIndex) {
      if (this._notExistPartOpacities.isExist(partIndex)) {
        return this._notExistPartOpacities.getValue(partIndex);
      }
      CSM_ASSERT(0 <= partIndex && partIndex < this.getPartCount());
      return this._partOpacities[partIndex];
    }
    /**
     * パーツの不透明度の取得(id)
     * @param partId パーツのＩｄ
     * @return パーツの不透明度
     */
    getPartOpacityById(partId) {
      const index = this.getPartIndex(partId);
      if (index < 0) {
        return 0;
      }
      return this.getPartOpacityByIndex(index);
    }
    /**
     * パラメータのインデックスの取得
     * @param パラメータID
     * @return パラメータのインデックス
     */
    getParameterIndex(parameterId) {
      let parameterIndex;
      const idCount = this._model.parameters.count;
      for (parameterIndex = 0; parameterIndex < idCount; ++parameterIndex) {
        if (parameterId != this._parameterIds.at(parameterIndex)) {
          continue;
        }
        return parameterIndex;
      }
      if (this._notExistParameterId.isExist(parameterId)) {
        return this._notExistParameterId.getValue(parameterId);
      }
      parameterIndex = this._model.parameters.count + this._notExistParameterId.getSize();
      this._notExistParameterId.setValue(parameterId, parameterIndex);
      this._notExistParameterValues.appendKey(parameterIndex);
      return parameterIndex;
    }
    /**
     * パラメータの個数の取得
     * @return パラメータの個数
     */
    getParameterCount() {
      return this._model.parameters.count;
    }
    /**
     * パラメータの種類の取得
     * @param parameterIndex パラメータのインデックス
     * @return csmParameterType_Normal -> 通常のパラメータ
     *          csmParameterType_BlendShape -> ブレンドシェイプパラメータ
     */
    getParameterType(parameterIndex) {
      return this._model.parameters.types[parameterIndex];
    }
    /**
     * パラメータの最大値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータの最大値
     */
    getParameterMaximumValue(parameterIndex) {
      return this._model.parameters.maximumValues[parameterIndex];
    }
    /**
     * パラメータの最小値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータの最小値
     */
    getParameterMinimumValue(parameterIndex) {
      return this._model.parameters.minimumValues[parameterIndex];
    }
    /**
     * パラメータのデフォルト値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータのデフォルト値
     */
    getParameterDefaultValue(parameterIndex) {
      return this._model.parameters.defaultValues[parameterIndex];
    }
    /**
     * 指定したパラメータindexのIDを取得
     *
     * @param parameterIndex パラメータのインデックス
     * @returns パラメータID
     */
    getParameterId(parameterIndex) {
      return CubismFramework.getIdManager().getId(
        this._model.parameters.ids[parameterIndex]
      );
    }
    /**
     * パラメータの値の取得
     * @param parameterIndex    パラメータのインデックス
     * @return パラメータの値
     */
    getParameterValueByIndex(parameterIndex) {
      if (this._notExistParameterValues.isExist(parameterIndex)) {
        return this._notExistParameterValues.getValue(parameterIndex);
      }
      CSM_ASSERT(
        0 <= parameterIndex && parameterIndex < this.getParameterCount()
      );
      return this._parameterValues[parameterIndex];
    }
    /**
     * パラメータの値の取得
     * @param parameterId    パラメータのID
     * @return パラメータの値
     */
    getParameterValueById(parameterId) {
      const parameterIndex = this.getParameterIndex(parameterId);
      return this.getParameterValueByIndex(parameterIndex);
    }
    /**
     * パラメータの値の設定
     * @param parameterIndex パラメータのインデックス
     * @param value パラメータの値
     * @param weight 重み
     */
    setParameterValueByIndex(parameterIndex, value, weight = 1) {
      if (this._notExistParameterValues.isExist(parameterIndex)) {
        this._notExistParameterValues.setValue(
          parameterIndex,
          weight == 1 ? value : this._notExistParameterValues.getValue(parameterIndex) * (1 - weight) + value * weight
        );
        return;
      }
      CSM_ASSERT(
        0 <= parameterIndex && parameterIndex < this.getParameterCount()
      );
      if (this.isRepeat(parameterIndex)) {
        value = this.getParameterRepeatValue(parameterIndex, value);
      } else {
        value = this.getParameterClampValue(parameterIndex, value);
      }
      this._parameterValues[parameterIndex] = weight == 1 ? value : this._parameterValues[parameterIndex] = this._parameterValues[parameterIndex] * (1 - weight) + value * weight;
    }
    /**
     * パラメータの値の設定
     * @param parameterId パラメータのID
     * @param value パラメータの値
     * @param weight 重み
     */
    setParameterValueById(parameterId, value, weight = 1) {
      const index = this.getParameterIndex(parameterId);
      this.setParameterValueByIndex(index, value, weight);
    }
    /**
     * パラメータの値の加算(index)
     * @param parameterIndex パラメータインデックス
     * @param value 加算する値
     * @param weight 重み
     */
    addParameterValueByIndex(parameterIndex, value, weight = 1) {
      this.setParameterValueByIndex(
        parameterIndex,
        this.getParameterValueByIndex(parameterIndex) + value * weight
      );
    }
    /**
     * パラメータの値の加算(id)
     * @param parameterId パラメータＩＤ
     * @param value 加算する値
     * @param weight 重み
     */
    addParameterValueById(parameterId, value, weight = 1) {
      const index = this.getParameterIndex(parameterId);
      this.addParameterValueByIndex(index, value, weight);
    }
    /**
     * Gets whether the parameter has the repeat setting.
     *
     * @param parameterIndex Parameter index
     *
     * @return true if it is set, otherwise returns false.
     */
    isRepeat(parameterIndex) {
      if (this._notExistParameterValues.isExist(parameterIndex)) {
        return false;
      }
      CSM_ASSERT(
        0 <= parameterIndex && parameterIndex < this.getParameterCount()
      );
      let isRepeat;
      if (this._isOverriddenParameterRepeat || this._userParameterRepeatDataList.at(parameterIndex).isOverridden) {
        isRepeat = this._userParameterRepeatDataList.at(
          parameterIndex
        ).isParameterRepeated;
      } else {
        isRepeat = this._model.parameters.repeats[parameterIndex] != 0;
      }
      return isRepeat;
    }
    /**
     * Returns the calculated result ensuring the value falls within the parameter's range.
     *
     * @param parameterIndex Parameter index
     * @param value Parameter value
     *
     * @return a value that falls within the parameter’s range. If the parameter does not exist, returns it as is.
     */
    getParameterRepeatValue(parameterIndex, value) {
      if (this._notExistParameterValues.isExist(parameterIndex)) {
        return value;
      }
      CSM_ASSERT(
        0 <= parameterIndex && parameterIndex < this.getParameterCount()
      );
      const maxValue = this._model.parameters.maximumValues[parameterIndex];
      const minValue = this._model.parameters.minimumValues[parameterIndex];
      const valueSize = maxValue - minValue;
      if (maxValue < value) {
        const overValue = CubismMath.mod(value - maxValue, valueSize);
        if (!Number.isNaN(overValue)) {
          value = minValue + overValue;
        } else {
          value = maxValue;
        }
      }
      if (value < minValue) {
        const overValue = CubismMath.mod(minValue - value, valueSize);
        if (!Number.isNaN(overValue)) {
          value = maxValue - overValue;
        } else {
          value = minValue;
        }
      }
      return value;
    }
    /**
     * Returns the result of clamping the value to ensure it falls within the parameter's range.
     *
     * @param parameterIndex Parameter index
     * @param value Parameter value
     *
     * @return the clamped value. If the parameter does not exist, returns it as is.
     */
    getParameterClampValue(parameterIndex, value) {
      if (this._notExistParameterValues.isExist(parameterIndex)) {
        return value;
      }
      CSM_ASSERT(
        0 <= parameterIndex && parameterIndex < this.getParameterCount()
      );
      const maxValue = this._model.parameters.maximumValues[parameterIndex];
      const minValue = this._model.parameters.minimumValues[parameterIndex];
      return CubismMath.clamp(value, minValue, maxValue);
    }
    /**
     * Returns the repeat of the parameter.
     *
     * @param parameterIndex Parameter index
     *
     * @return the raw data parameter repeat from the Cubism Core.
     */
    getParameterRepeats(parameterIndex) {
      return this._model.parameters.repeats[parameterIndex] != 0;
    }
    /**
     * パラメータの値の乗算
     * @param parameterId パラメータのID
     * @param value 乗算する値
     * @param weight 重み
     */
    multiplyParameterValueById(parameterId, value, weight = 1) {
      const index = this.getParameterIndex(parameterId);
      this.multiplyParameterValueByIndex(index, value, weight);
    }
    /**
     * パラメータの値の乗算
     * @param parameterIndex パラメータのインデックス
     * @param value 乗算する値
     * @param weight 重み
     */
    multiplyParameterValueByIndex(parameterIndex, value, weight = 1) {
      this.setParameterValueByIndex(
        parameterIndex,
        this.getParameterValueByIndex(parameterIndex) * (1 + (value - 1) * weight)
      );
    }
    /**
     * Drawableのインデックスの取得
     * @param drawableId DrawableのID
     * @return Drawableのインデックス
     */
    getDrawableIndex(drawableId) {
      const drawableCount = this._model.drawables.count;
      for (let drawableIndex = 0; drawableIndex < drawableCount; ++drawableIndex) {
        if (this._drawableIds.at(drawableIndex) == drawableId) {
          return drawableIndex;
        }
      }
      return -1;
    }
    /**
     * Drawableの個数の取得
     * @return drawableの個数
     */
    getDrawableCount() {
      const drawableCount = this._model.drawables.count;
      return drawableCount;
    }
    /**
     * DrawableのIDを取得する
     * @param drawableIndex Drawableのインデックス
     * @return drawableのID
     */
    getDrawableId(drawableIndex) {
      const parameterIds = this._model.drawables.ids;
      return CubismFramework.getIdManager().getId(parameterIds[drawableIndex]);
    }
    /**
     * Drawableの描画順リストの取得
     * @return Drawableの描画順リスト
     */
    getDrawableRenderOrders() {
      const renderOrders = this._model.drawables.renderOrders;
      return renderOrders;
    }
    /**
     * @deprecated
     * 関数名が誤っていたため、代替となる getDrawableTextureIndex を追加し、この関数は非推奨となりました。
     *
     * Drawableのテクスチャインデックスリストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのテクスチャインデックスリスト
     */
    getDrawableTextureIndices(drawableIndex) {
      return this.getDrawableTextureIndex(drawableIndex);
    }
    /**
     * Drawableのテクスチャインデックスの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのテクスチャインデックス
     */
    getDrawableTextureIndex(drawableIndex) {
      const textureIndices = this._model.drawables.textureIndices;
      return textureIndices[drawableIndex];
    }
    /**
     * DrawableのVertexPositionsの変化情報の取得
     *
     * 直近のCubismModel.update関数でDrawableの頂点情報が変化したかを取得する。
     *
     * @param   drawableIndex   Drawableのインデックス
     * @retval  true    Drawableの頂点情報が直近のCubismModel.update関数で変化した
     * @retval  false   Drawableの頂点情報が直近のCubismModel.update関数で変化していない
     */
    getDrawableDynamicFlagVertexPositionsDidChange(drawableIndex) {
      const dynamicFlags = this._model.drawables.dynamicFlags;
      return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(
        dynamicFlags[drawableIndex]
      );
    }
    /**
     * Drawableの頂点インデックスの個数の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点インデックスの個数
     */
    getDrawableVertexIndexCount(drawableIndex) {
      const indexCounts = this._model.drawables.indexCounts;
      return indexCounts[drawableIndex];
    }
    /**
     * Drawableの頂点の個数の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点の個数
     */
    getDrawableVertexCount(drawableIndex) {
      const vertexCounts = this._model.drawables.vertexCounts;
      return vertexCounts[drawableIndex];
    }
    /**
     * Drawableの頂点リストの取得
     * @param drawableIndex drawableのインデックス
     * @return drawableの頂点リスト
     */
    getDrawableVertices(drawableIndex) {
      return this.getDrawableVertexPositions(drawableIndex);
    }
    /**
     * Drawableの頂点インデックスリストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点インデックスリスト
     */
    getDrawableVertexIndices(drawableIndex) {
      const indicesArray = this._model.drawables.indices;
      return indicesArray[drawableIndex];
    }
    /**
     * Drawableの頂点リストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点リスト
     */
    getDrawableVertexPositions(drawableIndex) {
      const verticesArray = this._model.drawables.vertexPositions;
      return verticesArray[drawableIndex];
    }
    /**
     * Drawableの頂点のUVリストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点UVリスト
     */
    getDrawableVertexUvs(drawableIndex) {
      const uvsArray = this._model.drawables.vertexUvs;
      return uvsArray[drawableIndex];
    }
    /**
     * Drawableの不透明度の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの不透明度
     */
    getDrawableOpacity(drawableIndex) {
      const opacities = this._model.drawables.opacities;
      return opacities[drawableIndex];
    }
    /**
     * Drawableの乗算色の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの乗算色(RGBA)
     * スクリーン色はRGBAで取得されるが、Aは必ず0
     */
    getDrawableMultiplyColor(drawableIndex) {
      const multiplyColors = this._model.drawables.multiplyColors;
      const index = drawableIndex * 4;
      const multiplyColor = new CubismTextureColor();
      multiplyColor.r = multiplyColors[index];
      multiplyColor.g = multiplyColors[index + 1];
      multiplyColor.b = multiplyColors[index + 2];
      multiplyColor.a = multiplyColors[index + 3];
      return multiplyColor;
    }
    /**
     * Drawableのスクリーン色の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのスクリーン色(RGBA)
     * スクリーン色はRGBAで取得されるが、Aは必ず0
     */
    getDrawableScreenColor(drawableIndex) {
      const screenColors = this._model.drawables.screenColors;
      const index = drawableIndex * 4;
      const screenColor = new CubismTextureColor();
      screenColor.r = screenColors[index];
      screenColor.g = screenColors[index + 1];
      screenColor.b = screenColors[index + 2];
      screenColor.a = screenColors[index + 3];
      return screenColor;
    }
    /**
     * Drawableの親パーツのインデックスの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの親パーツのインデックス
     */
    getDrawableParentPartIndex(drawableIndex) {
      return this._model.drawables.parentPartIndices[drawableIndex];
    }
    /**
     * Drawableのブレンドモードを取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのブレンドモード
     */
    getDrawableBlendMode(drawableIndex) {
      const constantFlags = this._model.drawables.constantFlags;
      return Live2DCubismCore.Utils.hasBlendAdditiveBit(
        constantFlags[drawableIndex]
      ) ? CubismBlendMode.CubismBlendMode_Additive : Live2DCubismCore.Utils.hasBlendMultiplicativeBit(
        constantFlags[drawableIndex]
      ) ? CubismBlendMode.CubismBlendMode_Multiplicative : CubismBlendMode.CubismBlendMode_Normal;
    }
    /**
     * Drawableのマスクの反転使用の取得
     *
     * Drawableのマスク使用時の反転設定を取得する。
     * マスクを使用しない場合は無視される。
     *
     * @param drawableIndex Drawableのインデックス
     * @return Drawableの反転設定
     */
    getDrawableInvertedMaskBit(drawableIndex) {
      const constantFlags = this._model.drawables.constantFlags;
      return Live2DCubismCore.Utils.hasIsInvertedMaskBit(
        constantFlags[drawableIndex]
      );
    }
    /**
     * Drawableのクリッピングマスクリストの取得
     * @return Drawableのクリッピングマスクリスト
     */
    getDrawableMasks() {
      const masks = this._model.drawables.masks;
      return masks;
    }
    /**
     * Drawableのクリッピングマスクの個数リストの取得
     * @return Drawableのクリッピングマスクの個数リスト
     */
    getDrawableMaskCounts() {
      const maskCounts = this._model.drawables.maskCounts;
      return maskCounts;
    }
    /**
     * クリッピングマスクの使用状態
     *
     * @return true クリッピングマスクを使用している
     * @return false クリッピングマスクを使用していない
     */
    isUsingMasking() {
      for (let d = 0; d < this._model.drawables.count; ++d) {
        if (this._model.drawables.maskCounts[d] <= 0) {
          continue;
        }
        return true;
      }
      return false;
    }
    /**
     * Drawableの表示情報を取得する
     *
     * @param drawableIndex Drawableのインデックス
     * @return true Drawableが表示
     * @return false Drawableが非表示
     */
    getDrawableDynamicFlagIsVisible(drawableIndex) {
      const dynamicFlags = this._model.drawables.dynamicFlags;
      return Live2DCubismCore.Utils.hasIsVisibleBit(dynamicFlags[drawableIndex]);
    }
    /**
     * DrawableのDrawOrderの変化情報の取得
     *
     * 直近のCubismModel.update関数でdrawableのdrawOrderが変化したかを取得する。
     * drawOrderはartMesh上で指定する0から1000の情報
     * @param drawableIndex drawableのインデックス
     * @return true drawableの不透明度が直近のCubismModel.update関数で変化した
     * @return false drawableの不透明度が直近のCubismModel.update関数で変化している
     */
    getDrawableDynamicFlagVisibilityDidChange(drawableIndex) {
      const dynamicFlags = this._model.drawables.dynamicFlags;
      return Live2DCubismCore.Utils.hasVisibilityDidChangeBit(
        dynamicFlags[drawableIndex]
      );
    }
    /**
     * Drawableの不透明度の変化情報の取得
     *
     * 直近のCubismModel.update関数でdrawableの不透明度が変化したかを取得する。
     *
     * @param drawableIndex drawableのインデックス
     * @return true Drawableの不透明度が直近のCubismModel.update関数で変化した
     * @return false Drawableの不透明度が直近のCubismModel.update関数で変化してない
     */
    getDrawableDynamicFlagOpacityDidChange(drawableIndex) {
      const dynamicFlags = this._model.drawables.dynamicFlags;
      return Live2DCubismCore.Utils.hasOpacityDidChangeBit(
        dynamicFlags[drawableIndex]
      );
    }
    /**
     * Drawableの描画順序の変化情報の取得
     *
     * 直近のCubismModel.update関数でDrawableの描画の順序が変化したかを取得する。
     *
     * @param drawableIndex Drawableのインデックス
     * @return true Drawableの描画の順序が直近のCubismModel.update関数で変化した
     * @return false Drawableの描画の順序が直近のCubismModel.update関数で変化してない
     */
    getDrawableDynamicFlagRenderOrderDidChange(drawableIndex) {
      const dynamicFlags = this._model.drawables.dynamicFlags;
      return Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(
        dynamicFlags[drawableIndex]
      );
    }
    /**
     * Drawableの乗算色・スクリーン色の変化情報の取得
     *
     * 直近のCubismModel.update関数でDrawableの乗算色・スクリーン色が変化したかを取得する。
     *
     * @param drawableIndex Drawableのインデックス
     * @return true Drawableの乗算色・スクリーン色が直近のCubismModel.update関数で変化した
     * @return false Drawableの乗算色・スクリーン色が直近のCubismModel.update関数で変化してない
     */
    getDrawableDynamicFlagBlendColorDidChange(drawableIndex) {
      const dynamicFlags = this._model.drawables.dynamicFlags;
      return Live2DCubismCore.Utils.hasBlendColorDidChangeBit(
        dynamicFlags[drawableIndex]
      );
    }
    /**
     * 保存されたパラメータの読み込み
     */
    loadParameters() {
      let parameterCount = this._model.parameters.count;
      const savedParameterCount = this._savedParameters.getSize();
      if (parameterCount > savedParameterCount) {
        parameterCount = savedParameterCount;
      }
      for (let i = 0; i < parameterCount; ++i) {
        this._parameterValues[i] = this._savedParameters.at(i);
      }
    }
    /**
     * 初期化する
     */
    initialize() {
      CSM_ASSERT(this._model);
      this._parameterValues = this._model.parameters.values;
      this._partOpacities = this._model.parts.opacities;
      this._parameterMaximumValues = this._model.parameters.maximumValues;
      this._parameterMinimumValues = this._model.parameters.minimumValues;
      {
        const parameterIds = this._model.parameters.ids;
        const parameterCount = this._model.parameters.count;
        this._parameterIds.prepareCapacity(parameterCount);
        this._userParameterRepeatDataList.prepareCapacity(parameterCount);
        for (let i = 0; i < parameterCount; ++i) {
          this._parameterIds.pushBack(
            CubismFramework.getIdManager().getId(parameterIds[i])
          );
          this._userParameterRepeatDataList.pushBack(
            new ParameterRepeatData(false, false)
          );
        }
      }
      const partCount = this._model.parts.count;
      {
        const partIds = this._model.parts.ids;
        this._partIds.prepareCapacity(partCount);
        for (let i = 0; i < partCount; ++i) {
          this._partIds.pushBack(
            CubismFramework.getIdManager().getId(partIds[i])
          );
        }
        this._userPartMultiplyColors.prepareCapacity(partCount);
        this._userPartScreenColors.prepareCapacity(partCount);
        this._partChildDrawables.prepareCapacity(partCount);
      }
      {
        const drawableIds = this._model.drawables.ids;
        const drawableCount = this._model.drawables.count;
        this._userMultiplyColors.prepareCapacity(drawableCount);
        this._userScreenColors.prepareCapacity(drawableCount);
        this._userCullings.prepareCapacity(drawableCount);
        const userCulling = new DrawableCullingData(
          false,
          false
        );
        {
          for (let i = 0; i < partCount; ++i) {
            const multiplyColor = new CubismTextureColor(
              1,
              1,
              1,
              1
            );
            const screenColor = new CubismTextureColor(
              0,
              0,
              0,
              1
            );
            const userMultiplyColor = new PartColorData(
              false,
              multiplyColor
            );
            const userScreenColor = new PartColorData(
              false,
              screenColor
            );
            this._userPartMultiplyColors.pushBack(userMultiplyColor);
            this._userPartScreenColors.pushBack(userScreenColor);
            this._partChildDrawables.pushBack(new csmVector());
            this._partChildDrawables.at(i).prepareCapacity(drawableCount);
          }
        }
        {
          for (let i = 0; i < drawableCount; ++i) {
            const multiplyColor = new CubismTextureColor(
              1,
              1,
              1,
              1
            );
            const screenColor = new CubismTextureColor(
              0,
              0,
              0,
              1
            );
            const userMultiplyColor = new DrawableColorData(
              false,
              multiplyColor
            );
            const userScreenColor = new DrawableColorData(
              false,
              screenColor
            );
            this._drawableIds.pushBack(
              CubismFramework.getIdManager().getId(drawableIds[i])
            );
            this._userMultiplyColors.pushBack(userMultiplyColor);
            this._userScreenColors.pushBack(userScreenColor);
            this._userCullings.pushBack(userCulling);
            const parentIndex = this.getDrawableParentPartIndex(i);
            if (parentIndex >= 0) {
              this._partChildDrawables.at(parentIndex).pushBack(i);
            }
          }
        }
      }
    }
    /**
     * コンストラクタ
     * @param model モデル
     */
    constructor(model) {
      this._model = model;
      this._parameterValues = null;
      this._parameterMaximumValues = null;
      this._parameterMinimumValues = null;
      this._partOpacities = null;
      this._savedParameters = new csmVector();
      this._parameterIds = new csmVector();
      this._drawableIds = new csmVector();
      this._partIds = new csmVector();
      this._isOverriddenParameterRepeat = true;
      this._isOverriddenModelMultiplyColors = false;
      this._isOverriddenModelScreenColors = false;
      this._isOverriddenCullings = false;
      this._modelOpacity = 1;
      this._userParameterRepeatDataList = new csmVector();
      this._userMultiplyColors = new csmVector();
      this._userScreenColors = new csmVector();
      this._userCullings = new csmVector();
      this._userPartMultiplyColors = new csmVector();
      this._userPartScreenColors = new csmVector();
      this._partChildDrawables = new csmVector();
      this._notExistPartId = new csmMap();
      this._notExistParameterId = new csmMap();
      this._notExistParameterValues = new csmMap();
      this._notExistPartOpacities = new csmMap();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      this._model.release();
      this._model = null;
    }
    // カリング設定の配列
  }
  var Live2DCubismFramework$8;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismModel = CubismModel;
  })(Live2DCubismFramework$8 || (Live2DCubismFramework$8 = {}));
  class CubismMoc {
    /**
     * Mocデータの作成
     */
    static create(mocBytes, shouldCheckMocConsistency) {
      let cubismMoc = null;
      if (shouldCheckMocConsistency) {
        const consistency = this.hasMocConsistency(mocBytes);
        if (!consistency) {
          CubismLogError(`Inconsistent MOC3.`);
          return cubismMoc;
        }
      }
      const moc = Live2DCubismCore.Moc.fromArrayBuffer(mocBytes);
      if (moc) {
        cubismMoc = new CubismMoc(moc);
        cubismMoc._mocVersion = Live2DCubismCore.Version.csmGetMocVersion(
          moc,
          mocBytes
        );
      }
      return cubismMoc;
    }
    /**
     * Mocデータを削除
     *
     * Mocデータを削除する
     */
    static delete(moc) {
      moc._moc._release();
      moc._moc = null;
      moc = null;
    }
    /**
     * モデルを作成する
     *
     * @return Mocデータから作成されたモデル
     */
    createModel() {
      let cubismModel = null;
      const model = Live2DCubismCore.Model.fromMoc(
        this._moc
      );
      if (model) {
        cubismModel = new CubismModel(model);
        cubismModel.initialize();
        ++this._modelCount;
      }
      return cubismModel;
    }
    /**
     * モデルを削除する
     */
    deleteModel(model) {
      if (model != null) {
        model.release();
        model = null;
        --this._modelCount;
      }
    }
    /**
     * コンストラクタ
     */
    constructor(moc) {
      this._moc = moc;
      this._modelCount = 0;
      this._mocVersion = 0;
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      CSM_ASSERT(this._modelCount == 0);
      this._moc._release();
      this._moc = null;
    }
    /**
     * 最新の.moc3 Versionを取得
     */
    getLatestMocVersion() {
      return Live2DCubismCore.Version.csmGetLatestMocVersion();
    }
    /**
     * 読み込んだモデルの.moc3 Versionを取得
     */
    getMocVersion() {
      return this._mocVersion;
    }
    /**
     * .moc3 の整合性を検証する
     */
    static hasMocConsistency(mocBytes) {
      const isConsistent = Live2DCubismCore.Moc.prototype.hasMocConsistency(mocBytes);
      return isConsistent === 1 ? true : false;
    }
    // 読み込んだモデルの.moc3 Version
  }
  var Live2DCubismFramework$7;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismMoc = CubismMoc;
  })(Live2DCubismFramework$7 || (Live2DCubismFramework$7 = {}));
  const ColorChannelCount = 4;
  const ClippingMaskMaxCountOnDefault = 36;
  const ClippingMaskMaxCountOnMultiRenderTexture = 32;
  class CubismClippingManager {
    /**
     * コンストラクタ
     */
    constructor(clippingContextFactory) {
      this._renderTextureCount = 0;
      this._clippingMaskBufferSize = 256;
      this._clippingContextListForMask = new csmVector();
      this._clippingContextListForDraw = new csmVector();
      this._channelColors = new csmVector();
      this._tmpBoundsOnModel = new csmRect();
      this._tmpMatrix = new CubismMatrix44();
      this._tmpMatrixForMask = new CubismMatrix44();
      this._tmpMatrixForDraw = new CubismMatrix44();
      this._clippingContexttConstructor = clippingContextFactory;
      let tmp = new CubismTextureColor();
      tmp.r = 1;
      tmp.g = 0;
      tmp.b = 0;
      tmp.a = 0;
      this._channelColors.pushBack(tmp);
      tmp = new CubismTextureColor();
      tmp.r = 0;
      tmp.g = 1;
      tmp.b = 0;
      tmp.a = 0;
      this._channelColors.pushBack(tmp);
      tmp = new CubismTextureColor();
      tmp.r = 0;
      tmp.g = 0;
      tmp.b = 1;
      tmp.a = 0;
      this._channelColors.pushBack(tmp);
      tmp = new CubismTextureColor();
      tmp.r = 0;
      tmp.g = 0;
      tmp.b = 0;
      tmp.a = 1;
      this._channelColors.pushBack(tmp);
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      for (let i = 0; i < this._clippingContextListForMask.getSize(); i++) {
        if (this._clippingContextListForMask.at(i)) {
          this._clippingContextListForMask.at(i).release();
          this._clippingContextListForMask.set(i, void 0);
        }
        this._clippingContextListForMask.set(i, null);
      }
      this._clippingContextListForMask = null;
      for (let i = 0; i < this._clippingContextListForDraw.getSize(); i++) {
        this._clippingContextListForDraw.set(i, null);
      }
      this._clippingContextListForDraw = null;
      for (let i = 0; i < this._channelColors.getSize(); i++) {
        this._channelColors.set(i, null);
      }
      this._channelColors = null;
      if (this._clearedFrameBufferFlags != null) {
        this._clearedFrameBufferFlags.clear();
      }
      this._clearedFrameBufferFlags = null;
    }
    /**
     * マネージャの初期化処理
     * クリッピングマスクを使う描画オブジェクトの登録を行う
     * @param model モデルのインスタンス
     * @param renderTextureCount バッファの生成数
     */
    initialize(model, renderTextureCount) {
      if (renderTextureCount % 1 != 0) {
        CubismLogWarning(
          "The number of render textures must be specified as an integer. The decimal point is rounded down and corrected to an integer."
        );
        renderTextureCount = ~~renderTextureCount;
      }
      if (renderTextureCount < 1) {
        CubismLogWarning(
          "The number of render textures must be an integer greater than or equal to 1. Set the number of render textures to 1."
        );
      }
      this._renderTextureCount = renderTextureCount < 1 ? 1 : renderTextureCount;
      this._clearedFrameBufferFlags = new csmVector(
        this._renderTextureCount
      );
      for (let i = 0; i < model.getDrawableCount(); i++) {
        if (model.getDrawableMaskCounts()[i] <= 0) {
          this._clippingContextListForDraw.pushBack(null);
          continue;
        }
        let clippingContext = this.findSameClip(
          model.getDrawableMasks()[i],
          model.getDrawableMaskCounts()[i]
        );
        if (clippingContext == null) {
          clippingContext = new this._clippingContexttConstructor(
            this,
            model.getDrawableMasks()[i],
            model.getDrawableMaskCounts()[i]
          );
          this._clippingContextListForMask.pushBack(clippingContext);
        }
        clippingContext.addClippedDrawable(i);
        this._clippingContextListForDraw.pushBack(clippingContext);
      }
    }
    /**
     * 既にマスクを作っているかを確認
     * 作っている様であれば該当するクリッピングマスクのインスタンスを返す
     * 作っていなければNULLを返す
     * @param drawableMasks 描画オブジェクトをマスクする描画オブジェクトのリスト
     * @param drawableMaskCounts 描画オブジェクトをマスクする描画オブジェクトの数
     * @return 該当するクリッピングマスクが存在すればインスタンスを返し、なければNULLを返す
     */
    findSameClip(drawableMasks, drawableMaskCounts) {
      for (let i = 0; i < this._clippingContextListForMask.getSize(); i++) {
        const clippingContext = this._clippingContextListForMask.at(i);
        const count = clippingContext._clippingIdCount;
        if (count != drawableMaskCounts) {
          continue;
        }
        let sameCount = 0;
        for (let j = 0; j < count; j++) {
          const clipId = clippingContext._clippingIdList[j];
          for (let k = 0; k < count; k++) {
            if (drawableMasks[k] == clipId) {
              sameCount++;
              break;
            }
          }
        }
        if (sameCount == count) {
          return clippingContext;
        }
      }
      return null;
    }
    /**
     * 高精細マスク処理用の行列を計算する
     * @param model モデルのインスタンス
     * @param isRightHanded 処理が右手系であるか
     */
    setupMatrixForHighPrecision(model, isRightHanded) {
      let usingClipCount = 0;
      for (let clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
        const cc = this._clippingContextListForMask.at(clipIndex);
        this.calcClippedDrawTotalBounds(model, cc);
        if (cc._isUsing) {
          usingClipCount++;
        }
      }
      if (usingClipCount > 0) {
        this.setupLayoutBounds(0);
        if (this._clearedFrameBufferFlags.getSize() != this._renderTextureCount) {
          this._clearedFrameBufferFlags.clear();
          for (let i = 0; i < this._renderTextureCount; i++) {
            this._clearedFrameBufferFlags.pushBack(false);
          }
        } else {
          for (let i = 0; i < this._renderTextureCount; i++) {
            this._clearedFrameBufferFlags.set(i, false);
          }
        }
        for (let clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
          const clipContext = this._clippingContextListForMask.at(clipIndex);
          const allClippedDrawRect = clipContext._allClippedDrawRect;
          const layoutBoundsOnTex01 = clipContext._layoutBounds;
          const margin = 0.05;
          let scaleX = 0;
          let scaleY = 0;
          const ppu = model.getPixelsPerUnit();
          const maskPixelSize = clipContext.getClippingManager().getClippingMaskBufferSize();
          const physicalMaskWidth = layoutBoundsOnTex01.width * maskPixelSize;
          const physicalMaskHeight = layoutBoundsOnTex01.height * maskPixelSize;
          this._tmpBoundsOnModel.setRect(allClippedDrawRect);
          if (this._tmpBoundsOnModel.width * ppu > physicalMaskWidth) {
            this._tmpBoundsOnModel.expand(allClippedDrawRect.width * margin, 0);
            scaleX = layoutBoundsOnTex01.width / this._tmpBoundsOnModel.width;
          } else {
            scaleX = ppu / physicalMaskWidth;
          }
          if (this._tmpBoundsOnModel.height * ppu > physicalMaskHeight) {
            this._tmpBoundsOnModel.expand(
              0,
              allClippedDrawRect.height * margin
            );
            scaleY = layoutBoundsOnTex01.height / this._tmpBoundsOnModel.height;
          } else {
            scaleY = ppu / physicalMaskHeight;
          }
          this.createMatrixForMask(
            isRightHanded,
            layoutBoundsOnTex01,
            scaleX,
            scaleY
          );
          clipContext._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray());
          clipContext._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray());
        }
      }
    }
    /**
     * マスク作成・描画用の行列を作成する。
     * @param isRightHanded 座標を右手系として扱うかを指定
     * @param layoutBoundsOnTex01 マスクを収める領域
     * @param scaleX 描画オブジェクトの伸縮率
     * @param scaleY 描画オブジェクトの伸縮率
     */
    createMatrixForMask(isRightHanded, layoutBoundsOnTex01, scaleX, scaleY) {
      this._tmpMatrix.loadIdentity();
      {
        this._tmpMatrix.translateRelative(-1, -1);
        this._tmpMatrix.scaleRelative(2, 2);
      }
      {
        this._tmpMatrix.translateRelative(
          layoutBoundsOnTex01.x,
          layoutBoundsOnTex01.y
        );
        this._tmpMatrix.scaleRelative(scaleX, scaleY);
        this._tmpMatrix.translateRelative(
          -this._tmpBoundsOnModel.x,
          -this._tmpBoundsOnModel.y
        );
      }
      this._tmpMatrixForMask.setMatrix(this._tmpMatrix.getArray());
      this._tmpMatrix.loadIdentity();
      {
        this._tmpMatrix.translateRelative(
          layoutBoundsOnTex01.x,
          layoutBoundsOnTex01.y * (isRightHanded ? -1 : 1)
        );
        this._tmpMatrix.scaleRelative(
          scaleX,
          scaleY * (isRightHanded ? -1 : 1)
        );
        this._tmpMatrix.translateRelative(
          -this._tmpBoundsOnModel.x,
          -this._tmpBoundsOnModel.y
        );
      }
      this._tmpMatrixForDraw.setMatrix(this._tmpMatrix.getArray());
    }
    /**
     * クリッピングコンテキストを配置するレイアウト
     * 指定された数のレンダーテクスチャを極力いっぱいに使ってマスクをレイアウトする
     * マスクグループの数が4以下ならRGBA各チャンネルに一つずつマスクを配置し、5以上6以下ならRGBAを2,2,1,1と配置する。
     *
     * @param usingClipCount 配置するクリッピングコンテキストの数
     */
    setupLayoutBounds(usingClipCount) {
      const useClippingMaskMaxCount = this._renderTextureCount <= 1 ? ClippingMaskMaxCountOnDefault : ClippingMaskMaxCountOnMultiRenderTexture * this._renderTextureCount;
      if (usingClipCount <= 0 || usingClipCount > useClippingMaskMaxCount) {
        if (usingClipCount > useClippingMaskMaxCount) {
          CubismLogError(
            "not supported mask count : {0}\n[Details] render texture count : {1}, mask count : {2}",
            usingClipCount - useClippingMaskMaxCount,
            this._renderTextureCount,
            usingClipCount
          );
        }
        for (let index = 0; index < this._clippingContextListForMask.getSize(); index++) {
          const clipContext = this._clippingContextListForMask.at(index);
          clipContext._layoutChannelIndex = 0;
          clipContext._layoutBounds.x = 0;
          clipContext._layoutBounds.y = 0;
          clipContext._layoutBounds.width = 1;
          clipContext._layoutBounds.height = 1;
          clipContext._bufferIndex = 0;
        }
        return;
      }
      const layoutCountMaxValue = this._renderTextureCount <= 1 ? 9 : 8;
      let countPerSheetDiv = usingClipCount / this._renderTextureCount;
      const reduceLayoutTextureCount = usingClipCount % this._renderTextureCount;
      countPerSheetDiv = Math.ceil(countPerSheetDiv);
      let divCount = countPerSheetDiv / ColorChannelCount;
      const modCount = countPerSheetDiv % ColorChannelCount;
      divCount = ~~divCount;
      let curClipIndex = 0;
      for (let renderTextureIndex = 0; renderTextureIndex < this._renderTextureCount; renderTextureIndex++) {
        for (let channelIndex = 0; channelIndex < ColorChannelCount; channelIndex++) {
          let layoutCount = divCount + (channelIndex < modCount ? 1 : 0);
          const checkChannelIndex = modCount + (divCount < 1 ? -1 : 0);
          if (channelIndex == checkChannelIndex && reduceLayoutTextureCount > 0) {
            layoutCount -= !(renderTextureIndex < reduceLayoutTextureCount) ? 1 : 0;
          }
          if (layoutCount == 0) {
          } else if (layoutCount == 1) {
            const clipContext = this._clippingContextListForMask.at(curClipIndex++);
            clipContext._layoutChannelIndex = channelIndex;
            clipContext._layoutBounds.x = 0;
            clipContext._layoutBounds.y = 0;
            clipContext._layoutBounds.width = 1;
            clipContext._layoutBounds.height = 1;
            clipContext._bufferIndex = renderTextureIndex;
          } else if (layoutCount == 2) {
            for (let i = 0; i < layoutCount; i++) {
              let xpos = i % 2;
              xpos = ~~xpos;
              const cc = this._clippingContextListForMask.at(
                curClipIndex++
              );
              cc._layoutChannelIndex = channelIndex;
              cc._layoutBounds.x = xpos * 0.5;
              cc._layoutBounds.y = 0;
              cc._layoutBounds.width = 0.5;
              cc._layoutBounds.height = 1;
              cc._bufferIndex = renderTextureIndex;
            }
          } else if (layoutCount <= 4) {
            for (let i = 0; i < layoutCount; i++) {
              let xpos = i % 2;
              let ypos = i / 2;
              xpos = ~~xpos;
              ypos = ~~ypos;
              const cc = this._clippingContextListForMask.at(curClipIndex++);
              cc._layoutChannelIndex = channelIndex;
              cc._layoutBounds.x = xpos * 0.5;
              cc._layoutBounds.y = ypos * 0.5;
              cc._layoutBounds.width = 0.5;
              cc._layoutBounds.height = 0.5;
              cc._bufferIndex = renderTextureIndex;
            }
          } else if (layoutCount <= layoutCountMaxValue) {
            for (let i = 0; i < layoutCount; i++) {
              let xpos = i % 3;
              let ypos = i / 3;
              xpos = ~~xpos;
              ypos = ~~ypos;
              const cc = this._clippingContextListForMask.at(
                curClipIndex++
              );
              cc._layoutChannelIndex = channelIndex;
              cc._layoutBounds.x = xpos / 3;
              cc._layoutBounds.y = ypos / 3;
              cc._layoutBounds.width = 1 / 3;
              cc._layoutBounds.height = 1 / 3;
              cc._bufferIndex = renderTextureIndex;
            }
          } else {
            CubismLogError(
              "not supported mask count : {0}\n[Details] render texture count : {1}, mask count : {2}",
              usingClipCount - useClippingMaskMaxCount,
              this._renderTextureCount,
              usingClipCount
            );
            for (let index = 0; index < layoutCount; index++) {
              const cc = this._clippingContextListForMask.at(
                curClipIndex++
              );
              cc._layoutChannelIndex = 0;
              cc._layoutBounds.x = 0;
              cc._layoutBounds.y = 0;
              cc._layoutBounds.width = 1;
              cc._layoutBounds.height = 1;
              cc._bufferIndex = 0;
            }
          }
        }
      }
    }
    /**
     * マスクされる描画オブジェクト群全体を囲む矩形（モデル座標系）を計算する
     * @param model モデルのインスタンス
     * @param clippingContext クリッピングマスクのコンテキスト
     */
    calcClippedDrawTotalBounds(model, clippingContext) {
      let clippedDrawTotalMinX = Number.MAX_VALUE;
      let clippedDrawTotalMinY = Number.MAX_VALUE;
      let clippedDrawTotalMaxX = Number.MIN_VALUE;
      let clippedDrawTotalMaxY = Number.MIN_VALUE;
      const clippedDrawCount = clippingContext._clippedDrawableIndexList.length;
      for (let clippedDrawableIndex = 0; clippedDrawableIndex < clippedDrawCount; clippedDrawableIndex++) {
        const drawableIndex = clippingContext._clippedDrawableIndexList[clippedDrawableIndex];
        const drawableVertexCount = model.getDrawableVertexCount(drawableIndex);
        const drawableVertexes = model.getDrawableVertices(drawableIndex);
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = -Number.MAX_VALUE;
        let maxY = -Number.MAX_VALUE;
        const loop = drawableVertexCount * Constant.vertexStep;
        for (let pi = Constant.vertexOffset; pi < loop; pi += Constant.vertexStep) {
          const x = drawableVertexes[pi];
          const y = drawableVertexes[pi + 1];
          if (x < minX) {
            minX = x;
          }
          if (x > maxX) {
            maxX = x;
          }
          if (y < minY) {
            minY = y;
          }
          if (y > maxY) {
            maxY = y;
          }
        }
        if (minX == Number.MAX_VALUE) {
          continue;
        }
        if (minX < clippedDrawTotalMinX) {
          clippedDrawTotalMinX = minX;
        }
        if (minY < clippedDrawTotalMinY) {
          clippedDrawTotalMinY = minY;
        }
        if (maxX > clippedDrawTotalMaxX) {
          clippedDrawTotalMaxX = maxX;
        }
        if (maxY > clippedDrawTotalMaxY) {
          clippedDrawTotalMaxY = maxY;
        }
        if (clippedDrawTotalMinX == Number.MAX_VALUE) {
          clippingContext._allClippedDrawRect.x = 0;
          clippingContext._allClippedDrawRect.y = 0;
          clippingContext._allClippedDrawRect.width = 0;
          clippingContext._allClippedDrawRect.height = 0;
          clippingContext._isUsing = false;
        } else {
          clippingContext._isUsing = true;
          const w = clippedDrawTotalMaxX - clippedDrawTotalMinX;
          const h = clippedDrawTotalMaxY - clippedDrawTotalMinY;
          clippingContext._allClippedDrawRect.x = clippedDrawTotalMinX;
          clippingContext._allClippedDrawRect.y = clippedDrawTotalMinY;
          clippingContext._allClippedDrawRect.width = w;
          clippingContext._allClippedDrawRect.height = h;
        }
      }
    }
    /**
     * 画面描画に使用するクリッピングマスクのリストを取得する
     * @return 画面描画に使用するクリッピングマスクのリスト
     */
    getClippingContextListForDraw() {
      return this._clippingContextListForDraw;
    }
    /**
     * クリッピングマスクバッファのサイズを取得する
     * @return クリッピングマスクバッファのサイズ
     */
    getClippingMaskBufferSize() {
      return this._clippingMaskBufferSize;
    }
    /**
     * このバッファのレンダーテクスチャの枚数を取得する
     * @return このバッファのレンダーテクスチャの枚数
     */
    getRenderTextureCount() {
      return this._renderTextureCount;
    }
    /**
     * カラーチャンネル（RGBA）のフラグを取得する
     * @param channelNo カラーチャンネル（RGBA）の番号（0:R, 1:G, 2:B, 3:A）
     */
    getChannelFlagAsColor(channelNo) {
      return this._channelColors.at(channelNo);
    }
    /**
     * クリッピングマスクバッファのサイズを設定する
     * @param size クリッピングマスクバッファのサイズ
     */
    setClippingMaskBufferSize(size) {
      this._clippingMaskBufferSize = size;
    }
  }
  let s_instance;
  const ShaderCount = 10;
  class CubismShader_WebGL {
    /**
     * コンストラクタ
     */
    constructor() {
      this._shaderSets = new csmVector();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      this.releaseShaderProgram();
    }
    /**
     * 描画用のシェーダプログラムの一連のセットアップを実行する
     * @param renderer レンダラー
     * @param model 描画対象のモデル
     * @param index 描画対象のメッシュのインデックス
     */
    setupShaderProgramForDraw(renderer, model, index) {
      if (!renderer.isPremultipliedAlpha()) {
        CubismLogError("NoPremultipliedAlpha is not allowed");
      }
      if (this._shaderSets.getSize() == 0) {
        this.generateShaders();
      }
      let srcColor;
      let dstColor;
      let srcAlpha;
      let dstAlpha;
      const masked = renderer.getClippingContextBufferForDraw() != null;
      const invertedMask = model.getDrawableInvertedMaskBit(index);
      const offset = masked ? invertedMask ? 2 : 1 : 0;
      let shaderSet;
      switch (model.getDrawableBlendMode(index)) {
        case CubismBlendMode.CubismBlendMode_Normal:
        default:
          shaderSet = this._shaderSets.at(
            1 + offset
          );
          srcColor = this.gl.ONE;
          dstColor = this.gl.ONE_MINUS_SRC_ALPHA;
          srcAlpha = this.gl.ONE;
          dstAlpha = this.gl.ONE_MINUS_SRC_ALPHA;
          break;
        case CubismBlendMode.CubismBlendMode_Additive:
          shaderSet = this._shaderSets.at(
            4 + offset
          );
          srcColor = this.gl.ONE;
          dstColor = this.gl.ONE;
          srcAlpha = this.gl.ZERO;
          dstAlpha = this.gl.ONE;
          break;
        case CubismBlendMode.CubismBlendMode_Multiplicative:
          shaderSet = this._shaderSets.at(
            7 + offset
          );
          srcColor = this.gl.DST_COLOR;
          dstColor = this.gl.ONE_MINUS_SRC_ALPHA;
          srcAlpha = this.gl.ZERO;
          dstAlpha = this.gl.ONE;
          break;
      }
      this.gl.useProgram(shaderSet.shaderProgram);
      if (renderer._bufferData.vertex == null) {
        renderer._bufferData.vertex = this.gl.createBuffer();
      }
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, renderer._bufferData.vertex);
      const vertexArray = model.getDrawableVertices(index);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexArray, this.gl.DYNAMIC_DRAW);
      this.gl.enableVertexAttribArray(shaderSet.attributePositionLocation);
      this.gl.vertexAttribPointer(
        shaderSet.attributePositionLocation,
        2,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      if (renderer._bufferData.uv == null) {
        renderer._bufferData.uv = this.gl.createBuffer();
      }
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, renderer._bufferData.uv);
      const uvArray = model.getDrawableVertexUvs(index);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, uvArray, this.gl.DYNAMIC_DRAW);
      this.gl.enableVertexAttribArray(shaderSet.attributeTexCoordLocation);
      this.gl.vertexAttribPointer(
        shaderSet.attributeTexCoordLocation,
        2,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      if (masked) {
        this.gl.activeTexture(this.gl.TEXTURE1);
        const tex = renderer.getClippingContextBufferForDraw().getClippingManager().getColorBuffer().at(renderer.getClippingContextBufferForDraw()._bufferIndex);
        this.gl.bindTexture(this.gl.TEXTURE_2D, tex);
        this.gl.uniform1i(shaderSet.samplerTexture1Location, 1);
        this.gl.uniformMatrix4fv(
          shaderSet.uniformClipMatrixLocation,
          false,
          renderer.getClippingContextBufferForDraw()._matrixForDraw.getArray()
        );
        const channelIndex = renderer.getClippingContextBufferForDraw()._layoutChannelIndex;
        const colorChannel = renderer.getClippingContextBufferForDraw().getClippingManager().getChannelFlagAsColor(channelIndex);
        this.gl.uniform4f(
          shaderSet.uniformChannelFlagLocation,
          colorChannel.r,
          colorChannel.g,
          colorChannel.b,
          colorChannel.a
        );
      }
      const textureNo = model.getDrawableTextureIndex(index);
      const textureId = renderer.getBindedTextures().getValue(textureNo);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, textureId);
      this.gl.uniform1i(shaderSet.samplerTexture0Location, 0);
      const matrix4x4 = renderer.getMvpMatrix();
      this.gl.uniformMatrix4fv(
        shaderSet.uniformMatrixLocation,
        false,
        matrix4x4.getArray()
      );
      const baseColor = renderer.getModelColorWithOpacity(
        model.getDrawableOpacity(index)
      );
      const multiplyColor = model.getMultiplyColor(index);
      const screenColor = model.getScreenColor(index);
      this.gl.uniform4f(
        shaderSet.uniformBaseColorLocation,
        baseColor.r,
        baseColor.g,
        baseColor.b,
        baseColor.a
      );
      this.gl.uniform4f(
        shaderSet.uniformMultiplyColorLocation,
        multiplyColor.r,
        multiplyColor.g,
        multiplyColor.b,
        multiplyColor.a
      );
      this.gl.uniform4f(
        shaderSet.uniformScreenColorLocation,
        screenColor.r,
        screenColor.g,
        screenColor.b,
        screenColor.a
      );
      if (renderer._bufferData.index == null) {
        renderer._bufferData.index = this.gl.createBuffer();
      }
      const indexArray = model.getDrawableVertexIndices(index);
      this.gl.bindBuffer(
        this.gl.ELEMENT_ARRAY_BUFFER,
        renderer._bufferData.index
      );
      this.gl.bufferData(
        this.gl.ELEMENT_ARRAY_BUFFER,
        indexArray,
        this.gl.DYNAMIC_DRAW
      );
      this.gl.blendFuncSeparate(srcColor, dstColor, srcAlpha, dstAlpha);
    }
    /**
     * マスク用のシェーダプログラムの一連のセットアップを実行する
     * @param renderer レンダラー
     * @param model 描画対象のモデル
     * @param index 描画対象のメッシュのインデックス
     */
    setupShaderProgramForMask(renderer, model, index) {
      if (!renderer.isPremultipliedAlpha()) {
        CubismLogError("NoPremultipliedAlpha is not allowed");
      }
      if (this._shaderSets.getSize() == 0) {
        this.generateShaders();
      }
      const shaderSet = this._shaderSets.at(
        0
        /* ShaderNames_SetupMask */
      );
      this.gl.useProgram(shaderSet.shaderProgram);
      if (renderer._bufferData.vertex == null) {
        renderer._bufferData.vertex = this.gl.createBuffer();
      }
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, renderer._bufferData.vertex);
      const vertexArray = model.getDrawableVertices(index);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexArray, this.gl.DYNAMIC_DRAW);
      this.gl.enableVertexAttribArray(shaderSet.attributePositionLocation);
      this.gl.vertexAttribPointer(
        shaderSet.attributePositionLocation,
        2,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      if (renderer._bufferData.uv == null) {
        renderer._bufferData.uv = this.gl.createBuffer();
      }
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, renderer._bufferData.uv);
      const textureNo = model.getDrawableTextureIndex(index);
      const textureId = renderer.getBindedTextures().getValue(textureNo);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, textureId);
      this.gl.uniform1i(shaderSet.samplerTexture0Location, 0);
      if (renderer._bufferData.uv == null) {
        renderer._bufferData.uv = this.gl.createBuffer();
      }
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, renderer._bufferData.uv);
      const uvArray = model.getDrawableVertexUvs(index);
      this.gl.bufferData(this.gl.ARRAY_BUFFER, uvArray, this.gl.DYNAMIC_DRAW);
      this.gl.enableVertexAttribArray(shaderSet.attributeTexCoordLocation);
      this.gl.vertexAttribPointer(
        shaderSet.attributeTexCoordLocation,
        2,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      const context = renderer.getClippingContextBufferForMask();
      const channelIndex = renderer.getClippingContextBufferForMask()._layoutChannelIndex;
      const colorChannel = renderer.getClippingContextBufferForMask().getClippingManager().getChannelFlagAsColor(channelIndex);
      this.gl.uniform4f(
        shaderSet.uniformChannelFlagLocation,
        colorChannel.r,
        colorChannel.g,
        colorChannel.b,
        colorChannel.a
      );
      this.gl.uniformMatrix4fv(
        shaderSet.uniformClipMatrixLocation,
        false,
        renderer.getClippingContextBufferForMask()._matrixForMask.getArray()
      );
      const rect = renderer.getClippingContextBufferForMask()._layoutBounds;
      this.gl.uniform4f(
        shaderSet.uniformBaseColorLocation,
        rect.x * 2 - 1,
        rect.y * 2 - 1,
        rect.getRight() * 2 - 1,
        rect.getBottom() * 2 - 1
      );
      const multiplyColor = model.getMultiplyColor(index);
      const screenColor = model.getScreenColor(index);
      this.gl.uniform4f(
        shaderSet.uniformMultiplyColorLocation,
        multiplyColor.r,
        multiplyColor.g,
        multiplyColor.b,
        multiplyColor.a
      );
      this.gl.uniform4f(
        shaderSet.uniformScreenColorLocation,
        screenColor.r,
        screenColor.g,
        screenColor.b,
        screenColor.a
      );
      const srcColor = this.gl.ZERO;
      const dstColor = this.gl.ONE_MINUS_SRC_COLOR;
      const srcAlpha = this.gl.ZERO;
      const dstAlpha = this.gl.ONE_MINUS_SRC_ALPHA;
      if (renderer._bufferData.index == null) {
        renderer._bufferData.index = this.gl.createBuffer();
      }
      const indexArray = model.getDrawableVertexIndices(index);
      this.gl.bindBuffer(
        this.gl.ELEMENT_ARRAY_BUFFER,
        renderer._bufferData.index
      );
      this.gl.bufferData(
        this.gl.ELEMENT_ARRAY_BUFFER,
        indexArray,
        this.gl.DYNAMIC_DRAW
      );
      this.gl.blendFuncSeparate(srcColor, dstColor, srcAlpha, dstAlpha);
    }
    /**
     * シェーダープログラムを解放する
     */
    releaseShaderProgram() {
      for (let i = 0; i < this._shaderSets.getSize(); i++) {
        this.gl.deleteProgram(this._shaderSets.at(i).shaderProgram);
        this._shaderSets.at(i).shaderProgram = 0;
        this._shaderSets.set(i, void 0);
        this._shaderSets.set(i, null);
      }
    }
    /**
     * シェーダープログラムを初期化する
     * @param vertShaderSrc 頂点シェーダのソース
     * @param fragShaderSrc フラグメントシェーダのソース
     */
    generateShaders() {
      for (let i = 0; i < ShaderCount; i++) {
        this._shaderSets.pushBack(new CubismShaderSet());
      }
      this._shaderSets.at(0).shaderProgram = this.loadShaderProgram(
        vertexShaderSrcSetupMask,
        fragmentShaderSrcsetupMask
      );
      this._shaderSets.at(1).shaderProgram = this.loadShaderProgram(
        vertexShaderSrc,
        fragmentShaderSrcPremultipliedAlpha
      );
      this._shaderSets.at(2).shaderProgram = this.loadShaderProgram(
        vertexShaderSrcMasked,
        fragmentShaderSrcMaskPremultipliedAlpha
      );
      this._shaderSets.at(3).shaderProgram = this.loadShaderProgram(
        vertexShaderSrcMasked,
        fragmentShaderSrcMaskInvertedPremultipliedAlpha
      );
      this._shaderSets.at(4).shaderProgram = this._shaderSets.at(1).shaderProgram;
      this._shaderSets.at(5).shaderProgram = this._shaderSets.at(2).shaderProgram;
      this._shaderSets.at(6).shaderProgram = this._shaderSets.at(3).shaderProgram;
      this._shaderSets.at(7).shaderProgram = this._shaderSets.at(1).shaderProgram;
      this._shaderSets.at(8).shaderProgram = this._shaderSets.at(2).shaderProgram;
      this._shaderSets.at(9).shaderProgram = this._shaderSets.at(3).shaderProgram;
      this._shaderSets.at(0).attributePositionLocation = this.gl.getAttribLocation(
        this._shaderSets.at(0).shaderProgram,
        "a_position"
      );
      this._shaderSets.at(0).attributeTexCoordLocation = this.gl.getAttribLocation(
        this._shaderSets.at(0).shaderProgram,
        "a_texCoord"
      );
      this._shaderSets.at(0).samplerTexture0Location = this.gl.getUniformLocation(
        this._shaderSets.at(0).shaderProgram,
        "s_texture0"
      );
      this._shaderSets.at(0).uniformClipMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(0).shaderProgram,
        "u_clipMatrix"
      );
      this._shaderSets.at(0).uniformChannelFlagLocation = this.gl.getUniformLocation(
        this._shaderSets.at(0).shaderProgram,
        "u_channelFlag"
      );
      this._shaderSets.at(0).uniformBaseColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(0).shaderProgram,
        "u_baseColor"
      );
      this._shaderSets.at(0).uniformMultiplyColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(0).shaderProgram,
        "u_multiplyColor"
      );
      this._shaderSets.at(0).uniformScreenColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(0).shaderProgram,
        "u_screenColor"
      );
      this._shaderSets.at(1).attributePositionLocation = this.gl.getAttribLocation(
        this._shaderSets.at(1).shaderProgram,
        "a_position"
      );
      this._shaderSets.at(1).attributeTexCoordLocation = this.gl.getAttribLocation(
        this._shaderSets.at(1).shaderProgram,
        "a_texCoord"
      );
      this._shaderSets.at(1).samplerTexture0Location = this.gl.getUniformLocation(
        this._shaderSets.at(1).shaderProgram,
        "s_texture0"
      );
      this._shaderSets.at(1).uniformMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(1).shaderProgram,
        "u_matrix"
      );
      this._shaderSets.at(1).uniformBaseColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(1).shaderProgram,
        "u_baseColor"
      );
      this._shaderSets.at(1).uniformMultiplyColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(1).shaderProgram,
        "u_multiplyColor"
      );
      this._shaderSets.at(1).uniformScreenColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(1).shaderProgram,
        "u_screenColor"
      );
      this._shaderSets.at(2).attributePositionLocation = this.gl.getAttribLocation(
        this._shaderSets.at(2).shaderProgram,
        "a_position"
      );
      this._shaderSets.at(2).attributeTexCoordLocation = this.gl.getAttribLocation(
        this._shaderSets.at(2).shaderProgram,
        "a_texCoord"
      );
      this._shaderSets.at(2).samplerTexture0Location = this.gl.getUniformLocation(
        this._shaderSets.at(2).shaderProgram,
        "s_texture0"
      );
      this._shaderSets.at(2).samplerTexture1Location = this.gl.getUniformLocation(
        this._shaderSets.at(2).shaderProgram,
        "s_texture1"
      );
      this._shaderSets.at(2).uniformMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(2).shaderProgram,
        "u_matrix"
      );
      this._shaderSets.at(2).uniformClipMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(2).shaderProgram,
        "u_clipMatrix"
      );
      this._shaderSets.at(2).uniformChannelFlagLocation = this.gl.getUniformLocation(
        this._shaderSets.at(2).shaderProgram,
        "u_channelFlag"
      );
      this._shaderSets.at(2).uniformBaseColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(2).shaderProgram,
        "u_baseColor"
      );
      this._shaderSets.at(2).uniformMultiplyColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(2).shaderProgram,
        "u_multiplyColor"
      );
      this._shaderSets.at(2).uniformScreenColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(2).shaderProgram,
        "u_screenColor"
      );
      this._shaderSets.at(3).attributePositionLocation = this.gl.getAttribLocation(
        this._shaderSets.at(3).shaderProgram,
        "a_position"
      );
      this._shaderSets.at(3).attributeTexCoordLocation = this.gl.getAttribLocation(
        this._shaderSets.at(3).shaderProgram,
        "a_texCoord"
      );
      this._shaderSets.at(3).samplerTexture0Location = this.gl.getUniformLocation(
        this._shaderSets.at(3).shaderProgram,
        "s_texture0"
      );
      this._shaderSets.at(3).samplerTexture1Location = this.gl.getUniformLocation(
        this._shaderSets.at(3).shaderProgram,
        "s_texture1"
      );
      this._shaderSets.at(3).uniformMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(3).shaderProgram,
        "u_matrix"
      );
      this._shaderSets.at(3).uniformClipMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(3).shaderProgram,
        "u_clipMatrix"
      );
      this._shaderSets.at(3).uniformChannelFlagLocation = this.gl.getUniformLocation(
        this._shaderSets.at(3).shaderProgram,
        "u_channelFlag"
      );
      this._shaderSets.at(3).uniformBaseColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(3).shaderProgram,
        "u_baseColor"
      );
      this._shaderSets.at(3).uniformMultiplyColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(3).shaderProgram,
        "u_multiplyColor"
      );
      this._shaderSets.at(3).uniformScreenColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(3).shaderProgram,
        "u_screenColor"
      );
      this._shaderSets.at(4).attributePositionLocation = this.gl.getAttribLocation(
        this._shaderSets.at(4).shaderProgram,
        "a_position"
      );
      this._shaderSets.at(4).attributeTexCoordLocation = this.gl.getAttribLocation(
        this._shaderSets.at(4).shaderProgram,
        "a_texCoord"
      );
      this._shaderSets.at(4).samplerTexture0Location = this.gl.getUniformLocation(
        this._shaderSets.at(4).shaderProgram,
        "s_texture0"
      );
      this._shaderSets.at(4).uniformMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(4).shaderProgram,
        "u_matrix"
      );
      this._shaderSets.at(4).uniformBaseColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(4).shaderProgram,
        "u_baseColor"
      );
      this._shaderSets.at(4).uniformMultiplyColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(4).shaderProgram,
        "u_multiplyColor"
      );
      this._shaderSets.at(4).uniformScreenColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(4).shaderProgram,
        "u_screenColor"
      );
      this._shaderSets.at(5).attributePositionLocation = this.gl.getAttribLocation(
        this._shaderSets.at(5).shaderProgram,
        "a_position"
      );
      this._shaderSets.at(5).attributeTexCoordLocation = this.gl.getAttribLocation(
        this._shaderSets.at(5).shaderProgram,
        "a_texCoord"
      );
      this._shaderSets.at(5).samplerTexture0Location = this.gl.getUniformLocation(
        this._shaderSets.at(5).shaderProgram,
        "s_texture0"
      );
      this._shaderSets.at(5).samplerTexture1Location = this.gl.getUniformLocation(
        this._shaderSets.at(5).shaderProgram,
        "s_texture1"
      );
      this._shaderSets.at(5).uniformMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(5).shaderProgram,
        "u_matrix"
      );
      this._shaderSets.at(5).uniformClipMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(5).shaderProgram,
        "u_clipMatrix"
      );
      this._shaderSets.at(5).uniformChannelFlagLocation = this.gl.getUniformLocation(
        this._shaderSets.at(5).shaderProgram,
        "u_channelFlag"
      );
      this._shaderSets.at(5).uniformBaseColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(5).shaderProgram,
        "u_baseColor"
      );
      this._shaderSets.at(5).uniformMultiplyColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(5).shaderProgram,
        "u_multiplyColor"
      );
      this._shaderSets.at(5).uniformScreenColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(5).shaderProgram,
        "u_screenColor"
      );
      this._shaderSets.at(6).attributePositionLocation = this.gl.getAttribLocation(
        this._shaderSets.at(6).shaderProgram,
        "a_position"
      );
      this._shaderSets.at(6).attributeTexCoordLocation = this.gl.getAttribLocation(
        this._shaderSets.at(6).shaderProgram,
        "a_texCoord"
      );
      this._shaderSets.at(6).samplerTexture0Location = this.gl.getUniformLocation(
        this._shaderSets.at(6).shaderProgram,
        "s_texture0"
      );
      this._shaderSets.at(6).samplerTexture1Location = this.gl.getUniformLocation(
        this._shaderSets.at(6).shaderProgram,
        "s_texture1"
      );
      this._shaderSets.at(6).uniformMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(6).shaderProgram,
        "u_matrix"
      );
      this._shaderSets.at(6).uniformClipMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(6).shaderProgram,
        "u_clipMatrix"
      );
      this._shaderSets.at(6).uniformChannelFlagLocation = this.gl.getUniformLocation(
        this._shaderSets.at(6).shaderProgram,
        "u_channelFlag"
      );
      this._shaderSets.at(6).uniformBaseColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(6).shaderProgram,
        "u_baseColor"
      );
      this._shaderSets.at(6).uniformMultiplyColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(6).shaderProgram,
        "u_multiplyColor"
      );
      this._shaderSets.at(6).uniformScreenColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(6).shaderProgram,
        "u_screenColor"
      );
      this._shaderSets.at(7).attributePositionLocation = this.gl.getAttribLocation(
        this._shaderSets.at(7).shaderProgram,
        "a_position"
      );
      this._shaderSets.at(7).attributeTexCoordLocation = this.gl.getAttribLocation(
        this._shaderSets.at(7).shaderProgram,
        "a_texCoord"
      );
      this._shaderSets.at(7).samplerTexture0Location = this.gl.getUniformLocation(
        this._shaderSets.at(7).shaderProgram,
        "s_texture0"
      );
      this._shaderSets.at(7).uniformMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(7).shaderProgram,
        "u_matrix"
      );
      this._shaderSets.at(7).uniformBaseColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(7).shaderProgram,
        "u_baseColor"
      );
      this._shaderSets.at(7).uniformMultiplyColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(7).shaderProgram,
        "u_multiplyColor"
      );
      this._shaderSets.at(7).uniformScreenColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(7).shaderProgram,
        "u_screenColor"
      );
      this._shaderSets.at(8).attributePositionLocation = this.gl.getAttribLocation(
        this._shaderSets.at(8).shaderProgram,
        "a_position"
      );
      this._shaderSets.at(8).attributeTexCoordLocation = this.gl.getAttribLocation(
        this._shaderSets.at(8).shaderProgram,
        "a_texCoord"
      );
      this._shaderSets.at(8).samplerTexture0Location = this.gl.getUniformLocation(
        this._shaderSets.at(8).shaderProgram,
        "s_texture0"
      );
      this._shaderSets.at(8).samplerTexture1Location = this.gl.getUniformLocation(
        this._shaderSets.at(8).shaderProgram,
        "s_texture1"
      );
      this._shaderSets.at(8).uniformMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(8).shaderProgram,
        "u_matrix"
      );
      this._shaderSets.at(8).uniformClipMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(8).shaderProgram,
        "u_clipMatrix"
      );
      this._shaderSets.at(8).uniformChannelFlagLocation = this.gl.getUniformLocation(
        this._shaderSets.at(8).shaderProgram,
        "u_channelFlag"
      );
      this._shaderSets.at(8).uniformBaseColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(8).shaderProgram,
        "u_baseColor"
      );
      this._shaderSets.at(8).uniformMultiplyColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(8).shaderProgram,
        "u_multiplyColor"
      );
      this._shaderSets.at(8).uniformScreenColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(8).shaderProgram,
        "u_screenColor"
      );
      this._shaderSets.at(9).attributePositionLocation = this.gl.getAttribLocation(
        this._shaderSets.at(9).shaderProgram,
        "a_position"
      );
      this._shaderSets.at(9).attributeTexCoordLocation = this.gl.getAttribLocation(
        this._shaderSets.at(9).shaderProgram,
        "a_texCoord"
      );
      this._shaderSets.at(9).samplerTexture0Location = this.gl.getUniformLocation(
        this._shaderSets.at(9).shaderProgram,
        "s_texture0"
      );
      this._shaderSets.at(9).samplerTexture1Location = this.gl.getUniformLocation(
        this._shaderSets.at(9).shaderProgram,
        "s_texture1"
      );
      this._shaderSets.at(9).uniformMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(9).shaderProgram,
        "u_matrix"
      );
      this._shaderSets.at(9).uniformClipMatrixLocation = this.gl.getUniformLocation(
        this._shaderSets.at(9).shaderProgram,
        "u_clipMatrix"
      );
      this._shaderSets.at(9).uniformChannelFlagLocation = this.gl.getUniformLocation(
        this._shaderSets.at(9).shaderProgram,
        "u_channelFlag"
      );
      this._shaderSets.at(9).uniformBaseColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(9).shaderProgram,
        "u_baseColor"
      );
      this._shaderSets.at(9).uniformMultiplyColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(9).shaderProgram,
        "u_multiplyColor"
      );
      this._shaderSets.at(9).uniformScreenColorLocation = this.gl.getUniformLocation(
        this._shaderSets.at(9).shaderProgram,
        "u_screenColor"
      );
    }
    /**
     * シェーダプログラムをロードしてアドレスを返す
     * @param vertexShaderSource    頂点シェーダのソース
     * @param fragmentShaderSource  フラグメントシェーダのソース
     * @return シェーダプログラムのアドレス
     */
    loadShaderProgram(vertexShaderSource, fragmentShaderSource) {
      let shaderProgram = this.gl.createProgram();
      let vertShader = this.compileShaderSource(
        this.gl.VERTEX_SHADER,
        vertexShaderSource
      );
      if (!vertShader) {
        CubismLogError("Vertex shader compile error!");
        return 0;
      }
      let fragShader = this.compileShaderSource(
        this.gl.FRAGMENT_SHADER,
        fragmentShaderSource
      );
      if (!fragShader) {
        CubismLogError("Vertex shader compile error!");
        return 0;
      }
      this.gl.attachShader(shaderProgram, vertShader);
      this.gl.attachShader(shaderProgram, fragShader);
      this.gl.linkProgram(shaderProgram);
      const linkStatus = this.gl.getProgramParameter(
        shaderProgram,
        this.gl.LINK_STATUS
      );
      if (!linkStatus) {
        CubismLogError("Failed to link program: {0}", shaderProgram);
        this.gl.deleteShader(vertShader);
        vertShader = 0;
        this.gl.deleteShader(fragShader);
        fragShader = 0;
        if (shaderProgram) {
          this.gl.deleteProgram(shaderProgram);
          shaderProgram = 0;
        }
        return 0;
      }
      this.gl.deleteShader(vertShader);
      this.gl.deleteShader(fragShader);
      return shaderProgram;
    }
    /**
     * シェーダープログラムをコンパイルする
     * @param shaderType シェーダタイプ(Vertex/Fragment)
     * @param shaderSource シェーダソースコード
     *
     * @return コンパイルされたシェーダープログラム
     */
    compileShaderSource(shaderType, shaderSource) {
      const source = shaderSource;
      const shader = this.gl.createShader(shaderType);
      this.gl.shaderSource(shader, source);
      this.gl.compileShader(shader);
      if (!shader) {
        const log = this.gl.getShaderInfoLog(shader);
        CubismLogError("Shader compile log: {0} ", log);
      }
      const status = this.gl.getShaderParameter(
        shader,
        this.gl.COMPILE_STATUS
      );
      if (!status) {
        this.gl.deleteShader(shader);
        return null;
      }
      return shader;
    }
    setGl(gl) {
      this.gl = gl;
    }
    // webglコンテキスト
  }
  class CubismShaderManager_WebGL {
    /**
     * インスタンスを取得する（シングルトン）
     * @return インスタンス
     */
    static getInstance() {
      if (s_instance == null) {
        s_instance = new CubismShaderManager_WebGL();
      }
      return s_instance;
    }
    /**
     * インスタンスを開放する（シングルトン）
     */
    static deleteInstance() {
      if (s_instance) {
        s_instance.release();
        s_instance = null;
      }
    }
    /**
     * Privateなコンストラクタ
     */
    constructor() {
      this._shaderMap = new csmMap();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      for (const ite = this._shaderMap.begin(); ite.notEqual(this._shaderMap.end()); ite.preIncrement()) {
        ite.ptr().second.release();
      }
      this._shaderMap.clear();
    }
    /**
     * GLContextをキーにShaderを取得する
     * @param gl
     * @returns
     */
    getShader(gl) {
      return this._shaderMap.getValue(gl);
    }
    /**
     * GLContextを登録する
     * @param gl
     */
    setGlContext(gl) {
      if (!this._shaderMap.isExist(gl)) {
        const instance = new CubismShader_WebGL();
        instance.setGl(gl);
        this._shaderMap.setValue(gl, instance);
      }
    }
  }
  class CubismShaderSet {
    // シェーダープログラムに渡す変数のアドレス（ScreenColor）
  }
  var ShaderNames = /* @__PURE__ */ ((ShaderNames2) => {
    ShaderNames2[ShaderNames2["ShaderNames_SetupMask"] = 0] = "ShaderNames_SetupMask";
    ShaderNames2[ShaderNames2["ShaderNames_NormalPremultipliedAlpha"] = 1] = "ShaderNames_NormalPremultipliedAlpha";
    ShaderNames2[ShaderNames2["ShaderNames_NormalMaskedPremultipliedAlpha"] = 2] = "ShaderNames_NormalMaskedPremultipliedAlpha";
    ShaderNames2[ShaderNames2["ShaderNames_NomralMaskedInvertedPremultipliedAlpha"] = 3] = "ShaderNames_NomralMaskedInvertedPremultipliedAlpha";
    ShaderNames2[ShaderNames2["ShaderNames_AddPremultipliedAlpha"] = 4] = "ShaderNames_AddPremultipliedAlpha";
    ShaderNames2[ShaderNames2["ShaderNames_AddMaskedPremultipliedAlpha"] = 5] = "ShaderNames_AddMaskedPremultipliedAlpha";
    ShaderNames2[ShaderNames2["ShaderNames_AddMaskedPremultipliedAlphaInverted"] = 6] = "ShaderNames_AddMaskedPremultipliedAlphaInverted";
    ShaderNames2[ShaderNames2["ShaderNames_MultPremultipliedAlpha"] = 7] = "ShaderNames_MultPremultipliedAlpha";
    ShaderNames2[ShaderNames2["ShaderNames_MultMaskedPremultipliedAlpha"] = 8] = "ShaderNames_MultMaskedPremultipliedAlpha";
    ShaderNames2[ShaderNames2["ShaderNames_MultMaskedPremultipliedAlphaInverted"] = 9] = "ShaderNames_MultMaskedPremultipliedAlphaInverted";
    return ShaderNames2;
  })(ShaderNames || {});
  const vertexShaderSrcSetupMask = "attribute vec4     a_position;attribute vec2     a_texCoord;varying vec2       v_texCoord;varying vec4       v_myPos;uniform mat4       u_clipMatrix;void main(){   gl_Position = u_clipMatrix * a_position;   v_myPos = u_clipMatrix * a_position;   v_texCoord = a_texCoord;   v_texCoord.y = 1.0 - v_texCoord.y;}";
  const fragmentShaderSrcsetupMask = "precision mediump float;varying vec2       v_texCoord;varying vec4       v_myPos;uniform vec4       u_baseColor;uniform vec4       u_channelFlag;uniform sampler2D  s_texture0;void main(){   float isInside =        step(u_baseColor.x, v_myPos.x/v_myPos.w)       * step(u_baseColor.y, v_myPos.y/v_myPos.w)       * step(v_myPos.x/v_myPos.w, u_baseColor.z)       * step(v_myPos.y/v_myPos.w, u_baseColor.w);   gl_FragColor = u_channelFlag * texture2D(s_texture0, v_texCoord).a * isInside;}";
  const vertexShaderSrc = "attribute vec4     a_position;attribute vec2     a_texCoord;varying vec2       v_texCoord;uniform mat4       u_matrix;void main(){   gl_Position = u_matrix * a_position;   v_texCoord = a_texCoord;   v_texCoord.y = 1.0 - v_texCoord.y;}";
  const vertexShaderSrcMasked = "attribute vec4     a_position;attribute vec2     a_texCoord;varying vec2       v_texCoord;varying vec4       v_clipPos;uniform mat4       u_matrix;uniform mat4       u_clipMatrix;void main(){   gl_Position = u_matrix * a_position;   v_clipPos = u_clipMatrix * a_position;   v_texCoord = a_texCoord;   v_texCoord.y = 1.0 - v_texCoord.y;}";
  const fragmentShaderSrcPremultipliedAlpha = "precision mediump float;varying vec2       v_texCoord;uniform vec4       u_baseColor;uniform sampler2D  s_texture0;uniform vec4       u_multiplyColor;uniform vec4       u_screenColor;void main(){   vec4 texColor = texture2D(s_texture0, v_texCoord);   texColor.rgb = texColor.rgb * u_multiplyColor.rgb;   texColor.rgb = (texColor.rgb + u_screenColor.rgb * texColor.a) - (texColor.rgb * u_screenColor.rgb);   vec4 color = texColor * u_baseColor;   gl_FragColor = vec4(color.rgb, color.a);}";
  const fragmentShaderSrcMaskPremultipliedAlpha = "precision mediump float;varying vec2       v_texCoord;varying vec4       v_clipPos;uniform vec4       u_baseColor;uniform vec4       u_channelFlag;uniform sampler2D  s_texture0;uniform sampler2D  s_texture1;uniform vec4       u_multiplyColor;uniform vec4       u_screenColor;void main(){   vec4 texColor = texture2D(s_texture0, v_texCoord);   texColor.rgb = texColor.rgb * u_multiplyColor.rgb;   texColor.rgb = (texColor.rgb + u_screenColor.rgb * texColor.a) - (texColor.rgb * u_screenColor.rgb);   vec4 col_formask = texColor * u_baseColor;   vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;   float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;   col_formask = col_formask * maskVal;   gl_FragColor = col_formask;}";
  const fragmentShaderSrcMaskInvertedPremultipliedAlpha = "precision mediump float;varying vec2      v_texCoord;varying vec4      v_clipPos;uniform sampler2D s_texture0;uniform sampler2D s_texture1;uniform vec4      u_channelFlag;uniform vec4      u_baseColor;uniform vec4      u_multiplyColor;uniform vec4      u_screenColor;void main(){   vec4 texColor = texture2D(s_texture0, v_texCoord);   texColor.rgb = texColor.rgb * u_multiplyColor.rgb;   texColor.rgb = (texColor.rgb + u_screenColor.rgb * texColor.a) - (texColor.rgb * u_screenColor.rgb);   vec4 col_formask = texColor * u_baseColor;   vec4 clipMask = (1.0 - texture2D(s_texture1, v_clipPos.xy / v_clipPos.w)) * u_channelFlag;   float maskVal = clipMask.r + clipMask.g + clipMask.b + clipMask.a;   col_formask = col_formask * (1.0 - maskVal);   gl_FragColor = col_formask;}";
  var Live2DCubismFramework$6;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismShaderSet = CubismShaderSet;
    Live2DCubismFramework2.CubismShader_WebGL = CubismShader_WebGL;
    Live2DCubismFramework2.CubismShaderManager_WebGL = CubismShaderManager_WebGL;
    Live2DCubismFramework2.ShaderNames = ShaderNames;
  })(Live2DCubismFramework$6 || (Live2DCubismFramework$6 = {}));
  let s_viewport;
  let s_fbo;
  class CubismClippingManager_WebGL extends CubismClippingManager {
    /**
     * テンポラリのレンダーテクスチャのアドレスを取得する
     * FrameBufferObjectが存在しない場合、新しく生成する
     *
     * @return レンダーテクスチャの配列
     */
    getMaskRenderTexture() {
      if (this._maskTexture && this._maskTexture.textures != null) {
        this._maskTexture.frameNo = this._currentFrameNo;
      } else {
        if (this._maskRenderTextures != null) {
          this._maskRenderTextures.clear();
        }
        this._maskRenderTextures = new csmVector();
        if (this._maskColorBuffers != null) {
          this._maskColorBuffers.clear();
        }
        this._maskColorBuffers = new csmVector();
        const size = this._clippingMaskBufferSize;
        for (let index = 0; index < this._renderTextureCount; index++) {
          this._maskColorBuffers.pushBack(this.gl.createTexture());
          this.gl.bindTexture(
            this.gl.TEXTURE_2D,
            this._maskColorBuffers.at(index)
          );
          this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            size,
            size,
            0,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            null
          );
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_S,
            this.gl.CLAMP_TO_EDGE
          );
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_WRAP_T,
            this.gl.CLAMP_TO_EDGE
          );
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MIN_FILTER,
            this.gl.LINEAR
          );
          this.gl.texParameteri(
            this.gl.TEXTURE_2D,
            this.gl.TEXTURE_MAG_FILTER,
            this.gl.LINEAR
          );
          this.gl.bindTexture(this.gl.TEXTURE_2D, null);
          this._maskRenderTextures.pushBack(this.gl.createFramebuffer());
          this.gl.bindFramebuffer(
            this.gl.FRAMEBUFFER,
            this._maskRenderTextures.at(index)
          );
          this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER,
            this.gl.COLOR_ATTACHMENT0,
            this.gl.TEXTURE_2D,
            this._maskColorBuffers.at(index),
            0
          );
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo);
        this._maskTexture = new CubismRenderTextureResource(
          this._currentFrameNo,
          this._maskRenderTextures
        );
      }
      return this._maskTexture.textures;
    }
    /**
     * WebGLレンダリングコンテキストを設定する
     * @param gl WebGLレンダリングコンテキスト
     */
    setGL(gl) {
      this.gl = gl;
    }
    /**
     * コンストラクタ
     */
    constructor() {
      super(CubismClippingContext_WebGL);
    }
    /**
     * クリッピングコンテキストを作成する。モデル描画時に実行する。
     * @param model モデルのインスタンス
     * @param renderer レンダラのインスタンス
     */
    setupClippingContext(model, renderer) {
      this._currentFrameNo++;
      let usingClipCount = 0;
      for (let clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
        const cc = this._clippingContextListForMask.at(clipIndex);
        this.calcClippedDrawTotalBounds(model, cc);
        if (cc._isUsing) {
          usingClipCount++;
        }
      }
      if (usingClipCount > 0) {
        this.gl.viewport(
          0,
          0,
          this._clippingMaskBufferSize,
          this._clippingMaskBufferSize
        );
        this._currentMaskRenderTexture = this.getMaskRenderTexture().at(0);
        renderer.preDraw();
        this.setupLayoutBounds(usingClipCount);
        this.gl.bindFramebuffer(
          this.gl.FRAMEBUFFER,
          this._currentMaskRenderTexture
        );
        if (this._clearedFrameBufferFlags.getSize() != this._renderTextureCount) {
          this._clearedFrameBufferFlags.clear();
          this._clearedFrameBufferFlags = new csmVector(
            this._renderTextureCount
          );
        }
        for (let index = 0; index < this._clearedFrameBufferFlags.getSize(); index++) {
          this._clearedFrameBufferFlags.set(index, false);
        }
        for (let clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
          const clipContext = this._clippingContextListForMask.at(clipIndex);
          const allClipedDrawRect = clipContext._allClippedDrawRect;
          const layoutBoundsOnTex01 = clipContext._layoutBounds;
          const margin = 0.05;
          let scaleX = 0;
          let scaleY = 0;
          const clipContextRenderTexture = this.getMaskRenderTexture().at(
            clipContext._bufferIndex
          );
          if (this._currentMaskRenderTexture != clipContextRenderTexture) {
            this._currentMaskRenderTexture = clipContextRenderTexture;
            renderer.preDraw();
            this.gl.bindFramebuffer(
              this.gl.FRAMEBUFFER,
              this._currentMaskRenderTexture
            );
          }
          this._tmpBoundsOnModel.setRect(allClipedDrawRect);
          this._tmpBoundsOnModel.expand(
            allClipedDrawRect.width * margin,
            allClipedDrawRect.height * margin
          );
          scaleX = layoutBoundsOnTex01.width / this._tmpBoundsOnModel.width;
          scaleY = layoutBoundsOnTex01.height / this._tmpBoundsOnModel.height;
          {
            this._tmpMatrix.loadIdentity();
            {
              this._tmpMatrix.translateRelative(-1, -1);
              this._tmpMatrix.scaleRelative(2, 2);
            }
            {
              this._tmpMatrix.translateRelative(
                layoutBoundsOnTex01.x,
                layoutBoundsOnTex01.y
              );
              this._tmpMatrix.scaleRelative(scaleX, scaleY);
              this._tmpMatrix.translateRelative(
                -this._tmpBoundsOnModel.x,
                -this._tmpBoundsOnModel.y
              );
            }
            this._tmpMatrixForMask.setMatrix(this._tmpMatrix.getArray());
          }
          {
            this._tmpMatrix.loadIdentity();
            {
              this._tmpMatrix.translateRelative(
                layoutBoundsOnTex01.x,
                layoutBoundsOnTex01.y
              );
              this._tmpMatrix.scaleRelative(scaleX, scaleY);
              this._tmpMatrix.translateRelative(
                -this._tmpBoundsOnModel.x,
                -this._tmpBoundsOnModel.y
              );
            }
            this._tmpMatrixForDraw.setMatrix(this._tmpMatrix.getArray());
          }
          clipContext._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray());
          clipContext._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray());
          const clipDrawCount = clipContext._clippingIdCount;
          for (let i = 0; i < clipDrawCount; i++) {
            const clipDrawIndex = clipContext._clippingIdList[i];
            if (!model.getDrawableDynamicFlagVertexPositionsDidChange(clipDrawIndex)) {
              continue;
            }
            renderer.setIsCulling(
              model.getDrawableCulling(clipDrawIndex) != false
            );
            if (!this._clearedFrameBufferFlags.at(clipContext._bufferIndex)) {
              this.gl.clearColor(1, 1, 1, 1);
              this.gl.clear(this.gl.COLOR_BUFFER_BIT);
              this._clearedFrameBufferFlags.set(clipContext._bufferIndex, true);
            }
            renderer.setClippingContextBufferForMask(clipContext);
            renderer.drawMeshWebGL(model, clipDrawIndex);
          }
        }
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo);
        renderer.setClippingContextBufferForMask(null);
        this.gl.viewport(
          s_viewport[0],
          s_viewport[1],
          s_viewport[2],
          s_viewport[3]
        );
      }
    }
    /**
     * カラーバッファを取得する
     * @return カラーバッファ
     */
    getColorBuffer() {
      return this._maskColorBuffers;
    }
    /**
     * マスクの合計数をカウント
     * @returns
     */
    getClippingMaskCount() {
      return this._clippingContextListForMask.getSize();
    }
    // WebGLレンダリングコンテキスト
  }
  class CubismRenderTextureResource {
    /**
     * 引数付きコンストラクタ
     * @param frameNo レンダラーのフレーム番号
     * @param texture テクスチャのアドレス
     */
    constructor(frameNo, texture) {
      this.frameNo = frameNo;
      this.textures = texture;
    }
    // テクスチャのアドレス
  }
  class CubismClippingContext_WebGL extends CubismClippingContext {
    /**
     * 引数付きコンストラクタ
     */
    constructor(manager, clippingDrawableIndices, clipCount) {
      super(clippingDrawableIndices, clipCount);
      this._owner = manager;
    }
    /**
     * このマスクを管理するマネージャのインスタンスを取得する
     * @return クリッピングマネージャのインスタンス
     */
    getClippingManager() {
      return this._owner;
    }
    setGl(gl) {
      this._owner.setGL(gl);
    }
    // このマスクを管理しているマネージャのインスタンス
  }
  class CubismRendererProfile_WebGL {
    setGlEnable(index, enabled) {
      if (enabled) this.gl.enable(index);
      else this.gl.disable(index);
    }
    setGlEnableVertexAttribArray(index, enabled) {
      if (enabled) this.gl.enableVertexAttribArray(index);
      else this.gl.disableVertexAttribArray(index);
    }
    save() {
      if (this.gl == null) {
        CubismLogError(
          "'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function."
        );
        return;
      }
      this._lastArrayBufferBinding = this.gl.getParameter(
        this.gl.ARRAY_BUFFER_BINDING
      );
      this._lastElementArrayBufferBinding = this.gl.getParameter(
        this.gl.ELEMENT_ARRAY_BUFFER_BINDING
      );
      this._lastProgram = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
      this._lastActiveTexture = this.gl.getParameter(this.gl.ACTIVE_TEXTURE);
      this.gl.activeTexture(this.gl.TEXTURE1);
      this._lastTexture1Binding2D = this.gl.getParameter(
        this.gl.TEXTURE_BINDING_2D
      );
      this.gl.activeTexture(this.gl.TEXTURE0);
      this._lastTexture0Binding2D = this.gl.getParameter(
        this.gl.TEXTURE_BINDING_2D
      );
      this._lastVertexAttribArrayEnabled[0] = this.gl.getVertexAttrib(
        0,
        this.gl.VERTEX_ATTRIB_ARRAY_ENABLED
      );
      this._lastVertexAttribArrayEnabled[1] = this.gl.getVertexAttrib(
        1,
        this.gl.VERTEX_ATTRIB_ARRAY_ENABLED
      );
      this._lastVertexAttribArrayEnabled[2] = this.gl.getVertexAttrib(
        2,
        this.gl.VERTEX_ATTRIB_ARRAY_ENABLED
      );
      this._lastVertexAttribArrayEnabled[3] = this.gl.getVertexAttrib(
        3,
        this.gl.VERTEX_ATTRIB_ARRAY_ENABLED
      );
      this._lastScissorTest = this.gl.isEnabled(this.gl.SCISSOR_TEST);
      this._lastStencilTest = this.gl.isEnabled(this.gl.STENCIL_TEST);
      this._lastDepthTest = this.gl.isEnabled(this.gl.DEPTH_TEST);
      this._lastCullFace = this.gl.isEnabled(this.gl.CULL_FACE);
      this._lastBlend = this.gl.isEnabled(this.gl.BLEND);
      this._lastFrontFace = this.gl.getParameter(this.gl.FRONT_FACE);
      this._lastColorMask = this.gl.getParameter(this.gl.COLOR_WRITEMASK);
      this._lastBlending[0] = this.gl.getParameter(this.gl.BLEND_SRC_RGB);
      this._lastBlending[1] = this.gl.getParameter(this.gl.BLEND_DST_RGB);
      this._lastBlending[2] = this.gl.getParameter(this.gl.BLEND_SRC_ALPHA);
      this._lastBlending[3] = this.gl.getParameter(this.gl.BLEND_DST_ALPHA);
      this._lastFBO = this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING);
      this._lastViewport = this.gl.getParameter(this.gl.VIEWPORT);
    }
    restore() {
      if (this.gl == null) {
        CubismLogError(
          "'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function."
        );
        return;
      }
      this.gl.useProgram(this._lastProgram);
      this.setGlEnableVertexAttribArray(0, this._lastVertexAttribArrayEnabled[0]);
      this.setGlEnableVertexAttribArray(1, this._lastVertexAttribArrayEnabled[1]);
      this.setGlEnableVertexAttribArray(2, this._lastVertexAttribArrayEnabled[2]);
      this.setGlEnableVertexAttribArray(3, this._lastVertexAttribArrayEnabled[3]);
      this.setGlEnable(this.gl.SCISSOR_TEST, this._lastScissorTest);
      this.setGlEnable(this.gl.STENCIL_TEST, this._lastStencilTest);
      this.setGlEnable(this.gl.DEPTH_TEST, this._lastDepthTest);
      this.setGlEnable(this.gl.CULL_FACE, this._lastCullFace);
      this.setGlEnable(this.gl.BLEND, this._lastBlend);
      this.gl.frontFace(this._lastFrontFace);
      this.gl.colorMask(
        this._lastColorMask[0],
        this._lastColorMask[1],
        this._lastColorMask[2],
        this._lastColorMask[3]
      );
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._lastArrayBufferBinding);
      this.gl.bindBuffer(
        this.gl.ELEMENT_ARRAY_BUFFER,
        this._lastElementArrayBufferBinding
      );
      this.gl.activeTexture(this.gl.TEXTURE1);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this._lastTexture1Binding2D);
      this.gl.activeTexture(this.gl.TEXTURE0);
      this.gl.bindTexture(this.gl.TEXTURE_2D, this._lastTexture0Binding2D);
      this.gl.activeTexture(this._lastActiveTexture);
      this.gl.blendFuncSeparate(
        this._lastBlending[0],
        this._lastBlending[1],
        this._lastBlending[2],
        this._lastBlending[3]
      );
    }
    setGl(gl) {
      this.gl = gl;
    }
    constructor() {
      this._lastVertexAttribArrayEnabled = new Array(4);
      this._lastColorMask = new Array(4);
      this._lastBlending = new Array(4);
      this._lastViewport = new Array(4);
    }
  }
  class CubismRenderer_WebGL extends CubismRenderer {
    /**
     * レンダラの初期化処理を実行する
     * 引数に渡したモデルからレンダラの初期化処理に必要な情報を取り出すことができる
     *
     * @param model モデルのインスタンス
     * @param maskBufferCount バッファの生成数
     */
    initialize(model, maskBufferCount = 1) {
      if (model.isUsingMasking()) {
        this._clippingManager = new CubismClippingManager_WebGL();
        this._clippingManager.initialize(model, maskBufferCount);
      }
      this._sortedDrawableIndexList.resize(model.getDrawableCount(), 0);
      super.initialize(model);
    }
    /**
     * WebGLテクスチャのバインド処理
     * CubismRendererにテクスチャを設定し、CubismRenderer内でその画像を参照するためのIndex値を戻り値とする
     * @param modelTextureNo セットするモデルテクスチャの番号
     * @param glTextureNo WebGLテクスチャの番号
     */
    bindTexture(modelTextureNo, glTexture) {
      this._textures.setValue(modelTextureNo, glTexture);
    }
    /**
     * WebGLにバインドされたテクスチャのリストを取得する
     * @return テクスチャのリスト
     */
    getBindedTextures() {
      return this._textures;
    }
    /**
     * クリッピングマスクバッファのサイズを設定する
     * マスク用のFrameBufferを破棄、再作成する為処理コストは高い
     * @param size クリッピングマスクバッファのサイズ
     */
    setClippingMaskBufferSize(size) {
      if (!this._model.isUsingMasking()) {
        return;
      }
      const renderTextureCount = this._clippingManager.getRenderTextureCount();
      this._clippingManager.release();
      this._clippingManager = void 0;
      this._clippingManager = null;
      this._clippingManager = new CubismClippingManager_WebGL();
      this._clippingManager.setClippingMaskBufferSize(size);
      this._clippingManager.initialize(
        this.getModel(),
        renderTextureCount
        // インスタンス破棄前に保存したレンダーテクスチャの数
      );
    }
    /**
     * クリッピングマスクバッファのサイズを取得する
     * @return クリッピングマスクバッファのサイズ
     */
    getClippingMaskBufferSize() {
      return this._model.isUsingMasking() ? this._clippingManager.getClippingMaskBufferSize() : -1;
    }
    /**
     * レンダーテクスチャの枚数を取得する
     * @return レンダーテクスチャの枚数
     */
    getRenderTextureCount() {
      return this._model.isUsingMasking() ? this._clippingManager.getRenderTextureCount() : -1;
    }
    /**
     * コンストラクタ
     */
    constructor() {
      super();
      this._clippingContextBufferForMask = null;
      this._clippingContextBufferForDraw = null;
      this._rendererProfile = new CubismRendererProfile_WebGL();
      this.firstDraw = true;
      this._textures = new csmMap();
      this._sortedDrawableIndexList = new csmVector();
      this._bufferData = {
        vertex: WebGLBuffer = null,
        uv: WebGLBuffer = null,
        index: WebGLBuffer = null
      };
      this._textures.prepareCapacity(32, true);
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      if (this._clippingManager) {
        this._clippingManager.release();
        this._clippingManager = void 0;
        this._clippingManager = null;
      }
      if (this.gl == null) {
        return;
      }
      this.gl.deleteBuffer(this._bufferData.vertex);
      this._bufferData.vertex = null;
      this.gl.deleteBuffer(this._bufferData.uv);
      this._bufferData.uv = null;
      this.gl.deleteBuffer(this._bufferData.index);
      this._bufferData.index = null;
      this._bufferData = null;
      this._textures = null;
    }
    /**
     * モデルを描画する実際の処理
     */
    doDrawModel() {
      if (this.gl == null) {
        CubismLogError(
          "'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function."
        );
        return;
      }
      if (this._clippingManager != null) {
        this.preDraw();
        if (this.isUsingHighPrecisionMask()) {
          this._clippingManager.setupMatrixForHighPrecision(
            this.getModel(),
            false
          );
        } else {
          this._clippingManager.setupClippingContext(this.getModel(), this);
        }
      }
      this.preDraw();
      const drawableCount = this.getModel().getDrawableCount();
      const renderOrder = this.getModel().getDrawableRenderOrders();
      for (let i = 0; i < drawableCount; ++i) {
        const order = renderOrder[i];
        this._sortedDrawableIndexList.set(order, i);
      }
      for (let i = 0; i < drawableCount; ++i) {
        const drawableIndex = this._sortedDrawableIndexList.at(i);
        if (!this.getModel().getDrawableDynamicFlagIsVisible(drawableIndex)) {
          continue;
        }
        const clipContext = this._clippingManager != null ? this._clippingManager.getClippingContextListForDraw().at(drawableIndex) : null;
        if (clipContext != null && this.isUsingHighPrecisionMask()) {
          if (clipContext._isUsing) {
            this.gl.viewport(
              0,
              0,
              this._clippingManager.getClippingMaskBufferSize(),
              this._clippingManager.getClippingMaskBufferSize()
            );
            this.preDraw();
            this.gl.bindFramebuffer(
              this.gl.FRAMEBUFFER,
              clipContext.getClippingManager().getMaskRenderTexture().at(clipContext._bufferIndex)
            );
            this.gl.clearColor(1, 1, 1, 1);
            this.gl.clear(this.gl.COLOR_BUFFER_BIT);
          }
          {
            const clipDrawCount = clipContext._clippingIdCount;
            for (let index = 0; index < clipDrawCount; index++) {
              const clipDrawIndex = clipContext._clippingIdList[index];
              if (!this._model.getDrawableDynamicFlagVertexPositionsDidChange(
                clipDrawIndex
              )) {
                continue;
              }
              this.setIsCulling(
                this._model.getDrawableCulling(clipDrawIndex) != false
              );
              this.setClippingContextBufferForMask(clipContext);
              this.drawMeshWebGL(this._model, clipDrawIndex);
            }
          }
          {
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo);
            this.setClippingContextBufferForMask(null);
            this.gl.viewport(
              s_viewport[0],
              s_viewport[1],
              s_viewport[2],
              s_viewport[3]
            );
            this.preDraw();
          }
        }
        this.setClippingContextBufferForDraw(clipContext);
        this.setIsCulling(this.getModel().getDrawableCulling(drawableIndex));
        this.drawMeshWebGL(this._model, drawableIndex);
      }
    }
    /**
     * 描画オブジェクト（アートメッシュ）を描画する。
     * @param model 描画対象のモデル
     * @param index 描画対象のメッシュのインデックス
     */
    drawMeshWebGL(model, index) {
      if (this.isCulling()) {
        this.gl.enable(this.gl.CULL_FACE);
      } else {
        this.gl.disable(this.gl.CULL_FACE);
      }
      this.gl.frontFace(this.gl.CCW);
      if (this.isGeneratingMask()) {
        CubismShaderManager_WebGL.getInstance().getShader(this.gl).setupShaderProgramForMask(this, model, index);
      } else {
        CubismShaderManager_WebGL.getInstance().getShader(this.gl).setupShaderProgramForDraw(this, model, index);
      }
      {
        const indexCount = model.getDrawableVertexIndexCount(index);
        this.gl.drawElements(
          this.gl.TRIANGLES,
          indexCount,
          this.gl.UNSIGNED_SHORT,
          0
        );
      }
      this.gl.useProgram(null);
      this.setClippingContextBufferForDraw(null);
      this.setClippingContextBufferForMask(null);
    }
    saveProfile() {
      this._rendererProfile.save();
    }
    restoreProfile() {
      this._rendererProfile.restore();
    }
    /**
     * レンダラが保持する静的なリソースを解放する
     * WebGLの静的なシェーダープログラムを解放する
     */
    static doStaticRelease() {
      CubismShaderManager_WebGL.deleteInstance();
    }
    /**
     * レンダーステートを設定する
     * @param fbo アプリケーション側で指定しているフレームバッファ
     * @param viewport ビューポート
     */
    setRenderState(fbo, viewport) {
      s_fbo = fbo;
      s_viewport = viewport;
    }
    /**
     * 描画開始時の追加処理
     * モデルを描画する前にクリッピングマスクに必要な処理を実装している
     */
    preDraw() {
      if (this.firstDraw) {
        this.firstDraw = false;
      }
      this.gl.disable(this.gl.SCISSOR_TEST);
      this.gl.disable(this.gl.STENCIL_TEST);
      this.gl.disable(this.gl.DEPTH_TEST);
      this.gl.frontFace(this.gl.CW);
      this.gl.enable(this.gl.BLEND);
      this.gl.colorMask(true, true, true, true);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
      if (this.getAnisotropy() > 0 && this._extension) {
        for (let i = 0; i < this._textures.getSize(); ++i) {
          this.gl.bindTexture(this.gl.TEXTURE_2D, this._textures.getValue(i));
          this.gl.texParameterf(
            this.gl.TEXTURE_2D,
            this._extension.TEXTURE_MAX_ANISOTROPY_EXT,
            this.getAnisotropy()
          );
        }
      }
    }
    /**
     * マスクテクスチャに描画するクリッピングコンテキストをセットする
     */
    setClippingContextBufferForMask(clip) {
      this._clippingContextBufferForMask = clip;
    }
    /**
     * マスクテクスチャに描画するクリッピングコンテキストを取得する
     * @return マスクテクスチャに描画するクリッピングコンテキスト
     */
    getClippingContextBufferForMask() {
      return this._clippingContextBufferForMask;
    }
    /**
     * 画面上に描画するクリッピングコンテキストをセットする
     */
    setClippingContextBufferForDraw(clip) {
      this._clippingContextBufferForDraw = clip;
    }
    /**
     * 画面上に描画するクリッピングコンテキストを取得する
     * @return 画面上に描画するクリッピングコンテキスト
     */
    getClippingContextBufferForDraw() {
      return this._clippingContextBufferForDraw;
    }
    /**
     * マスク生成時かを判定する
     * @returns 判定値
     */
    isGeneratingMask() {
      return this.getClippingContextBufferForMask() != null;
    }
    /**
     * glの設定
     */
    startUp(gl) {
      this.gl = gl;
      if (this._clippingManager) {
        this._clippingManager.setGL(gl);
      }
      CubismShaderManager_WebGL.getInstance().setGlContext(gl);
      this._rendererProfile.setGl(gl);
      this._extension = this.gl.getExtension("EXT_texture_filter_anisotropic") || this.gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") || this.gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
    }
    // webglコンテキスト
  }
  CubismRenderer.staticRelease = () => {
    CubismRenderer_WebGL.doStaticRelease();
  };
  var Live2DCubismFramework$5;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismClippingContext = CubismClippingContext_WebGL;
    Live2DCubismFramework2.CubismClippingManager_WebGL = CubismClippingManager_WebGL;
    Live2DCubismFramework2.CubismRenderTextureResource = CubismRenderTextureResource;
    Live2DCubismFramework2.CubismRenderer_WebGL = CubismRenderer_WebGL;
  })(Live2DCubismFramework$5 || (Live2DCubismFramework$5 = {}));
  class ACubismMotion {
    /**
     * コンストラクタ
     */
    constructor() {
      this.setBeganMotionHandler = (onBeganMotionHandler) => this._onBeganMotion = onBeganMotionHandler;
      this.getBeganMotionHandler = () => this._onBeganMotion;
      this.setFinishedMotionHandler = (onFinishedMotionHandler) => this._onFinishedMotion = onFinishedMotionHandler;
      this.getFinishedMotionHandler = () => this._onFinishedMotion;
      this._fadeInSeconds = -1;
      this._fadeOutSeconds = -1;
      this._weight = 1;
      this._offsetSeconds = 0;
      this._isLoop = false;
      this._isLoopFadeIn = true;
      this._previousLoopState = this._isLoop;
      this._firedEventValues = new csmVector();
    }
    /**
     * インスタンスの破棄
     */
    static delete(motion) {
      motion.release();
      motion = null;
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      this._weight = 0;
    }
    /**
     * モデルのパラメータ
     * @param model 対象のモデル
     * @param motionQueueEntry CubismMotionQueueManagerで管理されているモーション
     * @param userTimeSeconds デルタ時間の積算値[秒]
     */
    updateParameters(model, motionQueueEntry, userTimeSeconds) {
      if (!motionQueueEntry.isAvailable() || motionQueueEntry.isFinished()) {
        return;
      }
      this.setupMotionQueueEntry(motionQueueEntry, userTimeSeconds);
      const fadeWeight = this.updateFadeWeight(motionQueueEntry, userTimeSeconds);
      this.doUpdateParameters(
        model,
        userTimeSeconds,
        fadeWeight,
        motionQueueEntry
      );
      if (motionQueueEntry.getEndTime() > 0 && motionQueueEntry.getEndTime() < userTimeSeconds) {
        motionQueueEntry.setIsFinished(true);
      }
    }
    /**
     * @brief モデルの再生開始処理
     *
     * モーションの再生を開始するためのセットアップを行う。
     *
     * @param[in]   motionQueueEntry    CubismMotionQueueManagerで管理されているモーション
     * @param[in]   userTimeSeconds     デルタ時間の積算値[秒]
     */
    setupMotionQueueEntry(motionQueueEntry, userTimeSeconds) {
      if (motionQueueEntry == null || motionQueueEntry.isStarted()) {
        return;
      }
      if (!motionQueueEntry.isAvailable()) {
        return;
      }
      motionQueueEntry.setIsStarted(true);
      motionQueueEntry.setStartTime(userTimeSeconds - this._offsetSeconds);
      motionQueueEntry.setFadeInStartTime(userTimeSeconds);
      if (motionQueueEntry.getEndTime() < 0) {
        this.adjustEndTime(motionQueueEntry);
      }
      if (motionQueueEntry._motion._onBeganMotion) {
        motionQueueEntry._motion._onBeganMotion(motionQueueEntry._motion);
      }
    }
    /**
     * @brief モデルのウェイト更新
     *
     * モーションのウェイトを更新する。
     *
     * @param[in]   motionQueueEntry    CubismMotionQueueManagerで管理されているモーション
     * @param[in]   userTimeSeconds     デルタ時間の積算値[秒]
     */
    updateFadeWeight(motionQueueEntry, userTimeSeconds) {
      if (motionQueueEntry == null) {
        CubismDebug.print(LogLevel.LogLevel_Error, "motionQueueEntry is null.");
      }
      let fadeWeight = this._weight;
      const fadeIn = this._fadeInSeconds == 0 ? 1 : CubismMath.getEasingSine(
        (userTimeSeconds - motionQueueEntry.getFadeInStartTime()) / this._fadeInSeconds
      );
      const fadeOut = this._fadeOutSeconds == 0 || motionQueueEntry.getEndTime() < 0 ? 1 : CubismMath.getEasingSine(
        (motionQueueEntry.getEndTime() - userTimeSeconds) / this._fadeOutSeconds
      );
      fadeWeight = fadeWeight * fadeIn * fadeOut;
      motionQueueEntry.setState(userTimeSeconds, fadeWeight);
      CSM_ASSERT(0 <= fadeWeight && fadeWeight <= 1);
      return fadeWeight;
    }
    /**
     * フェードインの時間を設定する
     * @param fadeInSeconds フェードインにかかる時間[秒]
     */
    setFadeInTime(fadeInSeconds) {
      this._fadeInSeconds = fadeInSeconds;
    }
    /**
     * フェードアウトの時間を設定する
     * @param fadeOutSeconds フェードアウトにかかる時間[秒]
     */
    setFadeOutTime(fadeOutSeconds) {
      this._fadeOutSeconds = fadeOutSeconds;
    }
    /**
     * フェードアウトにかかる時間の取得
     * @return フェードアウトにかかる時間[秒]
     */
    getFadeOutTime() {
      return this._fadeOutSeconds;
    }
    /**
     * フェードインにかかる時間の取得
     * @return フェードインにかかる時間[秒]
     */
    getFadeInTime() {
      return this._fadeInSeconds;
    }
    /**
     * モーション適用の重みの設定
     * @param weight 重み（0.0 - 1.0）
     */
    setWeight(weight) {
      this._weight = weight;
    }
    /**
     * モーション適用の重みの取得
     * @return 重み（0.0 - 1.0）
     */
    getWeight() {
      return this._weight;
    }
    /**
     * モーションの長さの取得
     * @return モーションの長さ[秒]
     *
     * @note ループの時は「-1」。
     *       ループでない場合は、オーバーライドする。
     *       正の値の時は取得される時間で終了する。
     *       「-1」の時は外部から停止命令がない限り終わらない処理となる。
     */
    getDuration() {
      return -1;
    }
    /**
     * モーションのループ1回分の長さの取得
     * @return モーションのループ一回分の長さ[秒]
     *
     * @note ループしない場合は、getDuration()と同じ値を返す
     *       ループ一回分の長さが定義できない場合(プログラム的に動き続けるサブクラスなど)の場合は「-1」を返す
     */
    getLoopDuration() {
      return -1;
    }
    /**
     * モーション再生の開始時刻の設定
     * @param offsetSeconds モーション再生の開始時刻[秒]
     */
    setOffsetTime(offsetSeconds) {
      this._offsetSeconds = offsetSeconds;
    }
    /**
     * ループ情報の設定
     * @param loop ループ情報
     */
    setLoop(loop) {
      this._isLoop = loop;
    }
    /**
     * ループ情報の取得
     * @return true ループする
     * @return false ループしない
     */
    getLoop() {
      return this._isLoop;
    }
    /**
     * ループ時のフェードイン情報の設定
     * @param loopFadeIn  ループ時のフェードイン情報
     */
    setLoopFadeIn(loopFadeIn) {
      this._isLoopFadeIn = loopFadeIn;
    }
    /**
     * ループ時のフェードイン情報の取得
     *
     * @return  true    する
     * @return  false   しない
     */
    getLoopFadeIn() {
      return this._isLoopFadeIn;
    }
    /**
     * モデルのパラメータ更新
     *
     * イベント発火のチェック。
     * 入力する時間は呼ばれるモーションタイミングを０とした秒数で行う。
     *
     * @param beforeCheckTimeSeconds 前回のイベントチェック時間[秒]
     * @param motionTimeSeconds 今回の再生時間[秒]
     */
    getFiredEvent(beforeCheckTimeSeconds, motionTimeSeconds) {
      return this._firedEventValues;
    }
    /**
     * 透明度のカーブが存在するかどうかを確認する
     *
     * @returns true  -> キーが存在する
     *          false -> キーが存在しない
     */
    isExistModelOpacity() {
      return false;
    }
    /**
     * 透明度のカーブのインデックスを返す
     *
     * @returns success:透明度のカーブのインデックス
     */
    getModelOpacityIndex() {
      return -1;
    }
    /**
     * 透明度のIdを返す
     *
     * @param index モーションカーブのインデックス
     * @returns success:透明度のId
     */
    getModelOpacityId(index) {
      return null;
    }
    /**
     * 指定時間の透明度の値を返す
     *
     * @returns success:モーションの現在時間におけるOpacityの値
     *
     * @note  更新後の値を取るにはUpdateParameters() の後に呼び出す。
     */
    getModelOpacityValue() {
      return 1;
    }
    /**
     * 終了時刻の調整
     * @param motionQueueEntry CubismMotionQueueManagerで管理されているモーション
     */
    adjustEndTime(motionQueueEntry) {
      const duration = this.getDuration();
      const endTime = duration <= 0 ? -1 : motionQueueEntry.getStartTime() + duration;
      motionQueueEntry.setEndTime(endTime);
    }
  }
  var Live2DCubismFramework$4;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.ACubismMotion = ACubismMotion;
  })(Live2DCubismFramework$4 || (Live2DCubismFramework$4 = {}));
  var CubismMotionCurveTarget = /* @__PURE__ */ ((CubismMotionCurveTarget2) => {
    CubismMotionCurveTarget2[CubismMotionCurveTarget2["CubismMotionCurveTarget_Model"] = 0] = "CubismMotionCurveTarget_Model";
    CubismMotionCurveTarget2[CubismMotionCurveTarget2["CubismMotionCurveTarget_Parameter"] = 1] = "CubismMotionCurveTarget_Parameter";
    CubismMotionCurveTarget2[CubismMotionCurveTarget2["CubismMotionCurveTarget_PartOpacity"] = 2] = "CubismMotionCurveTarget_PartOpacity";
    return CubismMotionCurveTarget2;
  })(CubismMotionCurveTarget || {});
  var CubismMotionSegmentType = /* @__PURE__ */ ((CubismMotionSegmentType2) => {
    CubismMotionSegmentType2[CubismMotionSegmentType2["CubismMotionSegmentType_Linear"] = 0] = "CubismMotionSegmentType_Linear";
    CubismMotionSegmentType2[CubismMotionSegmentType2["CubismMotionSegmentType_Bezier"] = 1] = "CubismMotionSegmentType_Bezier";
    CubismMotionSegmentType2[CubismMotionSegmentType2["CubismMotionSegmentType_Stepped"] = 2] = "CubismMotionSegmentType_Stepped";
    CubismMotionSegmentType2[CubismMotionSegmentType2["CubismMotionSegmentType_InverseStepped"] = 3] = "CubismMotionSegmentType_InverseStepped";
    return CubismMotionSegmentType2;
  })(CubismMotionSegmentType || {});
  class CubismMotionPoint {
    constructor() {
      this.time = 0;
      this.value = 0;
    }
    // 値
  }
  class CubismMotionSegment {
    /**
     * @brief コンストラクタ
     *
     * コンストラクタ。
     */
    constructor() {
      this.evaluate = null;
      this.basePointIndex = 0;
      this.segmentType = 0;
    }
    // セグメントの種類
  }
  class CubismMotionCurve {
    constructor() {
      this.type = 0;
      this.segmentCount = 0;
      this.baseSegmentIndex = 0;
      this.fadeInTime = 0;
      this.fadeOutTime = 0;
    }
    // フェードアウトにかかる時間[秒]
  }
  class CubismMotionEvent {
    constructor() {
      this.fireTime = 0;
    }
  }
  class CubismMotionData {
    constructor() {
      this.duration = 0;
      this.loop = false;
      this.curveCount = 0;
      this.eventCount = 0;
      this.fps = 0;
      this.curves = new csmVector();
      this.segments = new csmVector();
      this.points = new csmVector();
      this.events = new csmVector();
    }
    // イベントのリスト
  }
  var Live2DCubismFramework$3;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismMotionCurve = CubismMotionCurve;
    Live2DCubismFramework2.CubismMotionCurveTarget = CubismMotionCurveTarget;
    Live2DCubismFramework2.CubismMotionData = CubismMotionData;
    Live2DCubismFramework2.CubismMotionEvent = CubismMotionEvent;
    Live2DCubismFramework2.CubismMotionPoint = CubismMotionPoint;
    Live2DCubismFramework2.CubismMotionSegment = CubismMotionSegment;
    Live2DCubismFramework2.CubismMotionSegmentType = CubismMotionSegmentType;
  })(Live2DCubismFramework$3 || (Live2DCubismFramework$3 = {}));
  const Meta = "Meta";
  const Duration = "Duration";
  const Loop = "Loop";
  const AreBeziersRestricted = "AreBeziersRestricted";
  const CurveCount = "CurveCount";
  const Fps = "Fps";
  const TotalSegmentCount = "TotalSegmentCount";
  const TotalPointCount = "TotalPointCount";
  const Curves = "Curves";
  const Target = "Target";
  const Id = "Id";
  const FadeInTime = "FadeInTime";
  const FadeOutTime = "FadeOutTime";
  const Segments = "Segments";
  const UserData = "UserData";
  const UserDataCount = "UserDataCount";
  const TotalUserDataSize = "TotalUserDataSize";
  const Time = "Time";
  const Value = "Value";
  class CubismMotionJson {
    /**
     * コンストラクタ
     * @param buffer motion3.jsonが読み込まれているバッファ
     * @param size バッファのサイズ
     */
    constructor(buffer, size) {
      this._json = CubismJson.create(buffer, size);
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      CubismJson.delete(this._json);
    }
    /**
     * モーションの長さを取得する
     * @return モーションの長さ[秒]
     */
    getMotionDuration() {
      return this._json.getRoot().getValueByString(Meta).getValueByString(Duration).toFloat();
    }
    /**
     * モーションのループ情報の取得
     * @return true ループする
     * @return false ループしない
     */
    isMotionLoop() {
      return this._json.getRoot().getValueByString(Meta).getValueByString(Loop).toBoolean();
    }
    /**
     *  motion3.jsonファイルの整合性チェック
     *
     * @return 正常なファイルの場合はtrueを返す。
     */
    hasConsistency() {
      let result = true;
      if (!this._json || !this._json.getRoot()) {
        return false;
      }
      const actualCurveListSize = this._json.getRoot().getValueByString(Curves).getVector().getSize();
      let actualTotalSegmentCount = 0;
      let actualTotalPointCount = 0;
      for (let curvePosition = 0; curvePosition < actualCurveListSize; ++curvePosition) {
        for (let segmentPosition = 0; segmentPosition < this.getMotionCurveSegmentCount(curvePosition); ) {
          if (segmentPosition == 0) {
            actualTotalPointCount += 1;
            segmentPosition += 2;
          }
          const segment = this.getMotionCurveSegment(
            curvePosition,
            segmentPosition
          );
          switch (segment) {
            case CubismMotionSegmentType.CubismMotionSegmentType_Linear:
              actualTotalPointCount += 1;
              segmentPosition += 3;
              break;
            case CubismMotionSegmentType.CubismMotionSegmentType_Bezier:
              actualTotalPointCount += 3;
              segmentPosition += 7;
              break;
            case CubismMotionSegmentType.CubismMotionSegmentType_Stepped:
              actualTotalPointCount += 1;
              segmentPosition += 3;
              break;
            case CubismMotionSegmentType.CubismMotionSegmentType_InverseStepped:
              actualTotalPointCount += 1;
              segmentPosition += 3;
              break;
            default:
              CSM_ASSERT(0);
              break;
          }
          ++actualTotalSegmentCount;
        }
      }
      if (actualCurveListSize != this.getMotionCurveCount()) {
        CubismLogWarning("The number of curves does not match the metadata.");
        result = false;
      }
      if (actualTotalSegmentCount != this.getMotionTotalSegmentCount()) {
        CubismLogWarning("The number of segment does not match the metadata.");
        result = false;
      }
      if (actualTotalPointCount != this.getMotionTotalPointCount()) {
        CubismLogWarning("The number of point does not match the metadata.");
        result = false;
      }
      return result;
    }
    getEvaluationOptionFlag(flagType) {
      if (0 == flagType) {
        return this._json.getRoot().getValueByString(Meta).getValueByString(AreBeziersRestricted).toBoolean();
      }
      return false;
    }
    /**
     * モーションカーブの個数の取得
     * @return モーションカーブの個数
     */
    getMotionCurveCount() {
      return this._json.getRoot().getValueByString(Meta).getValueByString(CurveCount).toInt();
    }
    /**
     * モーションのフレームレートの取得
     * @return フレームレート[FPS]
     */
    getMotionFps() {
      return this._json.getRoot().getValueByString(Meta).getValueByString(Fps).toFloat();
    }
    /**
     * モーションのセグメントの総合計の取得
     * @return モーションのセグメントの取得
     */
    getMotionTotalSegmentCount() {
      return this._json.getRoot().getValueByString(Meta).getValueByString(TotalSegmentCount).toInt();
    }
    /**
     * モーションのカーブの制御店の総合計の取得
     * @return モーションのカーブの制御点の総合計
     */
    getMotionTotalPointCount() {
      return this._json.getRoot().getValueByString(Meta).getValueByString(TotalPointCount).toInt();
    }
    /**
     * モーションのフェードイン時間の存在
     * @return true 存在する
     * @return false 存在しない
     */
    isExistMotionFadeInTime() {
      return !this._json.getRoot().getValueByString(Meta).getValueByString(FadeInTime).isNull();
    }
    /**
     * モーションのフェードアウト時間の存在
     * @return true 存在する
     * @return false 存在しない
     */
    isExistMotionFadeOutTime() {
      return !this._json.getRoot().getValueByString(Meta).getValueByString(FadeOutTime).isNull();
    }
    /**
     * モーションのフェードイン時間の取得
     * @return フェードイン時間[秒]
     */
    getMotionFadeInTime() {
      return this._json.getRoot().getValueByString(Meta).getValueByString(FadeInTime).toFloat();
    }
    /**
     * モーションのフェードアウト時間の取得
     * @return フェードアウト時間[秒]
     */
    getMotionFadeOutTime() {
      return this._json.getRoot().getValueByString(Meta).getValueByString(FadeOutTime).toFloat();
    }
    /**
     * モーションのカーブの種類の取得
     * @param curveIndex カーブのインデックス
     * @return カーブの種類
     */
    getMotionCurveTarget(curveIndex) {
      return this._json.getRoot().getValueByString(Curves).getValueByIndex(curveIndex).getValueByString(Target).getRawString();
    }
    /**
     * モーションのカーブのIDの取得
     * @param curveIndex カーブのインデックス
     * @return カーブのID
     */
    getMotionCurveId(curveIndex) {
      return CubismFramework.getIdManager().getId(
        this._json.getRoot().getValueByString(Curves).getValueByIndex(curveIndex).getValueByString(Id).getRawString()
      );
    }
    /**
     * モーションのカーブのフェードイン時間の存在
     * @param curveIndex カーブのインデックス
     * @return true 存在する
     * @return false 存在しない
     */
    isExistMotionCurveFadeInTime(curveIndex) {
      return !this._json.getRoot().getValueByString(Curves).getValueByIndex(curveIndex).getValueByString(FadeInTime).isNull();
    }
    /**
     * モーションのカーブのフェードアウト時間の存在
     * @param curveIndex カーブのインデックス
     * @return true 存在する
     * @return false 存在しない
     */
    isExistMotionCurveFadeOutTime(curveIndex) {
      return !this._json.getRoot().getValueByString(Curves).getValueByIndex(curveIndex).getValueByString(FadeOutTime).isNull();
    }
    /**
     * モーションのカーブのフェードイン時間の取得
     * @param curveIndex カーブのインデックス
     * @return フェードイン時間[秒]
     */
    getMotionCurveFadeInTime(curveIndex) {
      return this._json.getRoot().getValueByString(Curves).getValueByIndex(curveIndex).getValueByString(FadeInTime).toFloat();
    }
    /**
     * モーションのカーブのフェードアウト時間の取得
     * @param curveIndex カーブのインデックス
     * @return フェードアウト時間[秒]
     */
    getMotionCurveFadeOutTime(curveIndex) {
      return this._json.getRoot().getValueByString(Curves).getValueByIndex(curveIndex).getValueByString(FadeOutTime).toFloat();
    }
    /**
     * モーションのカーブのセグメントの個数を取得する
     * @param curveIndex カーブのインデックス
     * @return モーションのカーブのセグメントの個数
     */
    getMotionCurveSegmentCount(curveIndex) {
      return this._json.getRoot().getValueByString(Curves).getValueByIndex(curveIndex).getValueByString(Segments).getVector().getSize();
    }
    /**
     * モーションのカーブのセグメントの値の取得
     * @param curveIndex カーブのインデックス
     * @param segmentIndex セグメントのインデックス
     * @return セグメントの値
     */
    getMotionCurveSegment(curveIndex, segmentIndex) {
      return this._json.getRoot().getValueByString(Curves).getValueByIndex(curveIndex).getValueByString(Segments).getValueByIndex(segmentIndex).toFloat();
    }
    /**
     * イベントの個数の取得
     * @return イベントの個数
     */
    getEventCount() {
      return this._json.getRoot().getValueByString(Meta).getValueByString(UserDataCount).toInt();
    }
    /**
     *  イベントの総文字数の取得
     * @return イベントの総文字数
     */
    getTotalEventValueSize() {
      return this._json.getRoot().getValueByString(Meta).getValueByString(TotalUserDataSize).toInt();
    }
    /**
     * イベントの時間の取得
     * @param userDataIndex イベントのインデックス
     * @return イベントの時間[秒]
     */
    getEventTime(userDataIndex) {
      return this._json.getRoot().getValueByString(UserData).getValueByIndex(userDataIndex).getValueByString(Time).toFloat();
    }
    /**
     * イベントの取得
     * @param userDataIndex イベントのインデックス
     * @return イベントの文字列
     */
    getEventValue(userDataIndex) {
      return new csmString(
        this._json.getRoot().getValueByString(UserData).getValueByIndex(userDataIndex).getValueByString(Value).getRawString()
      );
    }
    // motion3.jsonのデータ
  }
  var EvaluationOptionFlag = /* @__PURE__ */ ((EvaluationOptionFlag2) => {
    EvaluationOptionFlag2[EvaluationOptionFlag2["EvaluationOptionFlag_AreBeziersRistricted"] = 0] = "EvaluationOptionFlag_AreBeziersRistricted";
    return EvaluationOptionFlag2;
  })(EvaluationOptionFlag || {});
  var Live2DCubismFramework$2;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismMotionJson = CubismMotionJson;
  })(Live2DCubismFramework$2 || (Live2DCubismFramework$2 = {}));
  const EffectNameEyeBlink = "EyeBlink";
  const EffectNameLipSync = "LipSync";
  const TargetNameModel = "Model";
  const TargetNameParameter = "Parameter";
  const TargetNamePartOpacity = "PartOpacity";
  const IdNameOpacity = "Opacity";
  const UseOldBeziersCurveMotion = false;
  function lerpPoints(a, b, t) {
    const result = new CubismMotionPoint();
    result.time = a.time + (b.time - a.time) * t;
    result.value = a.value + (b.value - a.value) * t;
    return result;
  }
  function linearEvaluate(points, time) {
    let t = (time - points[0].time) / (points[1].time - points[0].time);
    if (t < 0) {
      t = 0;
    }
    return points[0].value + (points[1].value - points[0].value) * t;
  }
  function bezierEvaluate(points, time) {
    let t = (time - points[0].time) / (points[3].time - points[0].time);
    if (t < 0) {
      t = 0;
    }
    const p01 = lerpPoints(points[0], points[1], t);
    const p12 = lerpPoints(points[1], points[2], t);
    const p23 = lerpPoints(points[2], points[3], t);
    const p012 = lerpPoints(p01, p12, t);
    const p123 = lerpPoints(p12, p23, t);
    return lerpPoints(p012, p123, t).value;
  }
  function bezierEvaluateBinarySearch(points, time) {
    const xError = 0.01;
    const x = time;
    let x1 = points[0].time;
    let x2 = points[3].time;
    let cx1 = points[1].time;
    let cx2 = points[2].time;
    let ta = 0;
    let tb = 1;
    let t = 0;
    let i = 0;
    for (let var33 = true; i < 20; ++i) {
      if (x < x1 + xError) {
        t = ta;
        break;
      }
      if (x2 - xError < x) {
        t = tb;
        break;
      }
      let centerx = (cx1 + cx2) * 0.5;
      cx1 = (x1 + cx1) * 0.5;
      cx2 = (x2 + cx2) * 0.5;
      const ctrlx12 = (cx1 + centerx) * 0.5;
      const ctrlx21 = (cx2 + centerx) * 0.5;
      centerx = (ctrlx12 + ctrlx21) * 0.5;
      if (x < centerx) {
        tb = (ta + tb) * 0.5;
        if (centerx - xError < x) {
          t = tb;
          break;
        }
        x2 = centerx;
        cx2 = ctrlx12;
      } else {
        ta = (ta + tb) * 0.5;
        if (x < centerx + xError) {
          t = ta;
          break;
        }
        x1 = centerx;
        cx1 = ctrlx21;
      }
    }
    if (i == 20) {
      t = (ta + tb) * 0.5;
    }
    if (t < 0) {
      t = 0;
    }
    if (t > 1) {
      t = 1;
    }
    const p01 = lerpPoints(points[0], points[1], t);
    const p12 = lerpPoints(points[1], points[2], t);
    const p23 = lerpPoints(points[2], points[3], t);
    const p012 = lerpPoints(p01, p12, t);
    const p123 = lerpPoints(p12, p23, t);
    return lerpPoints(p012, p123, t).value;
  }
  function bezierEvaluateCardanoInterpretation(points, time) {
    const x = time;
    const x1 = points[0].time;
    const x2 = points[3].time;
    const cx1 = points[1].time;
    const cx2 = points[2].time;
    const a = x2 - 3 * cx2 + 3 * cx1 - x1;
    const b = 3 * cx2 - 6 * cx1 + 3 * x1;
    const c = 3 * cx1 - 3 * x1;
    const d = x1 - x;
    const t = CubismMath.cardanoAlgorithmForBezier(a, b, c, d);
    const p01 = lerpPoints(points[0], points[1], t);
    const p12 = lerpPoints(points[1], points[2], t);
    const p23 = lerpPoints(points[2], points[3], t);
    const p012 = lerpPoints(p01, p12, t);
    const p123 = lerpPoints(p12, p23, t);
    return lerpPoints(p012, p123, t).value;
  }
  function steppedEvaluate(points, time) {
    return points[0].value;
  }
  function inverseSteppedEvaluate(points, time) {
    return points[1].value;
  }
  function evaluateCurve(motionData, index, time, isCorrection, endTime) {
    const curve = motionData.curves.at(index);
    let target = -1;
    const totalSegmentCount = curve.baseSegmentIndex + curve.segmentCount;
    let pointPosition = 0;
    for (let i = curve.baseSegmentIndex; i < totalSegmentCount; ++i) {
      pointPosition = motionData.segments.at(i).basePointIndex + (motionData.segments.at(i).segmentType == CubismMotionSegmentType.CubismMotionSegmentType_Bezier ? 3 : 1);
      if (motionData.points.at(pointPosition).time > time) {
        target = i;
        break;
      }
    }
    if (target == -1) {
      if (isCorrection && time < endTime) {
        return correctEndPoint(
          motionData,
          totalSegmentCount - 1,
          motionData.segments.at(curve.baseSegmentIndex).basePointIndex,
          pointPosition,
          time,
          endTime
        );
      }
      return motionData.points.at(pointPosition).value;
    }
    const segment = motionData.segments.at(target);
    return segment.evaluate(motionData.points.get(segment.basePointIndex), time);
  }
  function correctEndPoint(motionData, segmentIndex, beginIndex, endIndex, time, endTime) {
    const motionPoint = [
      new CubismMotionPoint(),
      new CubismMotionPoint()
    ];
    {
      const src = motionData.points.at(endIndex);
      motionPoint[0].time = src.time;
      motionPoint[0].value = src.value;
    }
    {
      const src = motionData.points.at(beginIndex);
      motionPoint[1].time = endTime;
      motionPoint[1].value = src.value;
    }
    switch (motionData.segments.at(segmentIndex).segmentType) {
      case CubismMotionSegmentType.CubismMotionSegmentType_Linear:
      case CubismMotionSegmentType.CubismMotionSegmentType_Bezier:
      default:
        return linearEvaluate(motionPoint, time);
      case CubismMotionSegmentType.CubismMotionSegmentType_Stepped:
        return steppedEvaluate(motionPoint, time);
      case CubismMotionSegmentType.CubismMotionSegmentType_InverseStepped:
        return inverseSteppedEvaluate(motionPoint, time);
    }
  }
  var MotionBehavior = /* @__PURE__ */ ((MotionBehavior2) => {
    MotionBehavior2[MotionBehavior2["MotionBehavior_V1"] = 0] = "MotionBehavior_V1";
    MotionBehavior2[MotionBehavior2["MotionBehavior_V2"] = 1] = "MotionBehavior_V2";
    return MotionBehavior2;
  })(MotionBehavior || {});
  class CubismMotion extends ACubismMotion {
    /**
     * コンストラクタ
     */
    constructor() {
      super();
      this._motionBehavior = 1;
      this._sourceFrameRate = 30;
      this._loopDurationSeconds = -1;
      this._isLoop = false;
      this._isLoopFadeIn = true;
      this._lastWeight = 0;
      this._motionData = null;
      this._modelCurveIdEyeBlink = null;
      this._modelCurveIdLipSync = null;
      this._modelCurveIdOpacity = null;
      this._eyeBlinkParameterIds = null;
      this._lipSyncParameterIds = null;
      this._modelOpacity = 1;
      this._debugMode = false;
    }
    /**
     * インスタンスを作成する
     *
     * @param buffer motion3.jsonが読み込まれているバッファ
     * @param size バッファのサイズ
     * @param onFinishedMotionHandler モーション再生終了時に呼び出されるコールバック関数
     * @param onBeganMotionHandler モーション再生開始時に呼び出されるコールバック関数
     * @param shouldCheckMotionConsistency motion3.json整合性チェックするかどうか
     * @return 作成されたインスタンス
     */
    static create(buffer, size, onFinishedMotionHandler, onBeganMotionHandler, shouldCheckMotionConsistency = false) {
      const ret = new CubismMotion();
      ret.parse(buffer, size, shouldCheckMotionConsistency);
      if (ret._motionData) {
        ret._sourceFrameRate = ret._motionData.fps;
        ret._loopDurationSeconds = ret._motionData.duration;
        ret._onFinishedMotion = onFinishedMotionHandler;
        ret._onBeganMotion = onBeganMotionHandler;
      } else {
        csmDelete(ret);
        return null;
      }
      return ret;
    }
    /**
     * モデルのパラメータの更新の実行
     * @param model             対象のモデル
     * @param userTimeSeconds   現在の時刻[秒]
     * @param fadeWeight        モーションの重み
     * @param motionQueueEntry  CubismMotionQueueManagerで管理されているモーション
     */
    doUpdateParameters(model, userTimeSeconds, fadeWeight, motionQueueEntry) {
      if (this._modelCurveIdEyeBlink == null) {
        this._modelCurveIdEyeBlink = CubismFramework.getIdManager().getId(EffectNameEyeBlink);
      }
      if (this._modelCurveIdLipSync == null) {
        this._modelCurveIdLipSync = CubismFramework.getIdManager().getId(EffectNameLipSync);
      }
      if (this._modelCurveIdOpacity == null) {
        this._modelCurveIdOpacity = CubismFramework.getIdManager().getId(IdNameOpacity);
      }
      if (this._motionBehavior === 1) {
        if (this._previousLoopState !== this._isLoop) {
          this.adjustEndTime(motionQueueEntry);
          this._previousLoopState = this._isLoop;
        }
      }
      let timeOffsetSeconds = userTimeSeconds - motionQueueEntry.getStartTime();
      if (timeOffsetSeconds < 0) {
        timeOffsetSeconds = 0;
      }
      let lipSyncValue = Number.MAX_VALUE;
      let eyeBlinkValue = Number.MAX_VALUE;
      const maxTargetSize = 64;
      let lipSyncFlags = 0;
      let eyeBlinkFlags = 0;
      if (this._eyeBlinkParameterIds.getSize() > maxTargetSize) {
        CubismLogDebug(
          "too many eye blink targets : {0}",
          this._eyeBlinkParameterIds.getSize()
        );
      }
      if (this._lipSyncParameterIds.getSize() > maxTargetSize) {
        CubismLogDebug(
          "too many lip sync targets : {0}",
          this._lipSyncParameterIds.getSize()
        );
      }
      const tmpFadeIn = this._fadeInSeconds <= 0 ? 1 : CubismMath.getEasingSine(
        (userTimeSeconds - motionQueueEntry.getFadeInStartTime()) / this._fadeInSeconds
      );
      const tmpFadeOut = this._fadeOutSeconds <= 0 || motionQueueEntry.getEndTime() < 0 ? 1 : CubismMath.getEasingSine(
        (motionQueueEntry.getEndTime() - userTimeSeconds) / this._fadeOutSeconds
      );
      let value;
      let c, parameterIndex;
      let time = timeOffsetSeconds;
      let duration = this._motionData.duration;
      const isCorrection = this._motionBehavior === 1 && this._isLoop;
      if (this._isLoop) {
        if (this._motionBehavior === 1) {
          duration += 1 / this._motionData.fps;
        }
        while (time > duration) {
          time -= duration;
        }
      }
      const curves = this._motionData.curves;
      for (c = 0; c < this._motionData.curveCount && curves.at(c).type == CubismMotionCurveTarget.CubismMotionCurveTarget_Model; ++c) {
        value = evaluateCurve(this._motionData, c, time, isCorrection, duration);
        if (curves.at(c).id == this._modelCurveIdEyeBlink) {
          eyeBlinkValue = value;
        } else if (curves.at(c).id == this._modelCurveIdLipSync) {
          lipSyncValue = value;
        } else if (curves.at(c).id == this._modelCurveIdOpacity) {
          this._modelOpacity = value;
          model.setModelOapcity(this.getModelOpacityValue());
        }
      }
      let parameterMotionCurveCount = 0;
      for (; c < this._motionData.curveCount && curves.at(c).type == CubismMotionCurveTarget.CubismMotionCurveTarget_Parameter; ++c) {
        parameterMotionCurveCount++;
        parameterIndex = model.getParameterIndex(curves.at(c).id);
        if (parameterIndex == -1) {
          continue;
        }
        const sourceValue = model.getParameterValueByIndex(parameterIndex);
        value = evaluateCurve(this._motionData, c, time, isCorrection, duration);
        if (eyeBlinkValue != Number.MAX_VALUE) {
          for (let i = 0; i < this._eyeBlinkParameterIds.getSize() && i < maxTargetSize; ++i) {
            if (this._eyeBlinkParameterIds.at(i) == curves.at(c).id) {
              value *= eyeBlinkValue;
              eyeBlinkFlags |= 1 << i;
              break;
            }
          }
        }
        if (lipSyncValue != Number.MAX_VALUE) {
          for (let i = 0; i < this._lipSyncParameterIds.getSize() && i < maxTargetSize; ++i) {
            if (this._lipSyncParameterIds.at(i) == curves.at(c).id) {
              value += lipSyncValue;
              lipSyncFlags |= 1 << i;
              break;
            }
          }
        }
        if (model.isRepeat(parameterIndex)) {
          value = model.getParameterRepeatValue(parameterIndex, value);
        }
        let v;
        if (curves.at(c).fadeInTime < 0 && curves.at(c).fadeOutTime < 0) {
          v = sourceValue + (value - sourceValue) * fadeWeight;
        } else {
          let fin;
          let fout;
          if (curves.at(c).fadeInTime < 0) {
            fin = tmpFadeIn;
          } else {
            fin = curves.at(c).fadeInTime == 0 ? 1 : CubismMath.getEasingSine(
              (userTimeSeconds - motionQueueEntry.getFadeInStartTime()) / curves.at(c).fadeInTime
            );
          }
          if (curves.at(c).fadeOutTime < 0) {
            fout = tmpFadeOut;
          } else {
            fout = curves.at(c).fadeOutTime == 0 || motionQueueEntry.getEndTime() < 0 ? 1 : CubismMath.getEasingSine(
              (motionQueueEntry.getEndTime() - userTimeSeconds) / curves.at(c).fadeOutTime
            );
          }
          const paramWeight = this._weight * fin * fout;
          v = sourceValue + (value - sourceValue) * paramWeight;
        }
        model.setParameterValueByIndex(parameterIndex, v, 1);
      }
      {
        if (eyeBlinkValue != Number.MAX_VALUE) {
          for (let i = 0; i < this._eyeBlinkParameterIds.getSize() && i < maxTargetSize; ++i) {
            const sourceValue = model.getParameterValueById(
              this._eyeBlinkParameterIds.at(i)
            );
            if (eyeBlinkFlags >> i & 1) {
              continue;
            }
            const v = sourceValue + (eyeBlinkValue - sourceValue) * fadeWeight;
            model.setParameterValueById(this._eyeBlinkParameterIds.at(i), v);
          }
        }
        if (lipSyncValue != Number.MAX_VALUE) {
          for (let i = 0; i < this._lipSyncParameterIds.getSize() && i < maxTargetSize; ++i) {
            const sourceValue = model.getParameterValueById(
              this._lipSyncParameterIds.at(i)
            );
            if (lipSyncFlags >> i & 1) {
              continue;
            }
            const v = sourceValue + (lipSyncValue - sourceValue) * fadeWeight;
            model.setParameterValueById(this._lipSyncParameterIds.at(i), v);
          }
        }
      }
      for (; c < this._motionData.curveCount && curves.at(c).type == CubismMotionCurveTarget.CubismMotionCurveTarget_PartOpacity; ++c) {
        parameterIndex = model.getParameterIndex(curves.at(c).id);
        if (parameterIndex == -1) {
          continue;
        }
        value = evaluateCurve(this._motionData, c, time, isCorrection, duration);
        model.setParameterValueByIndex(parameterIndex, value);
      }
      if (timeOffsetSeconds >= duration) {
        if (this._isLoop) {
          this.updateForNextLoop(motionQueueEntry, userTimeSeconds, time);
        } else {
          if (this._onFinishedMotion) {
            this._onFinishedMotion(this);
          }
          motionQueueEntry.setIsFinished(true);
        }
      }
      this._lastWeight = fadeWeight;
    }
    /**
     * ループ情報の設定
     * @param loop ループ情報
     */
    setIsLoop(loop) {
      CubismLogWarning(
        "setIsLoop() is a deprecated function. Please use setLoop()."
      );
      this._isLoop = loop;
    }
    /**
     * ループ情報の取得
     * @return true ループする
     * @return false ループしない
     */
    isLoop() {
      CubismLogWarning(
        "isLoop() is a deprecated function. Please use getLoop()."
      );
      return this._isLoop;
    }
    /**
     * ループ時のフェードイン情報の設定
     * @param loopFadeIn  ループ時のフェードイン情報
     */
    setIsLoopFadeIn(loopFadeIn) {
      CubismLogWarning(
        "setIsLoopFadeIn() is a deprecated function. Please use setLoopFadeIn()."
      );
      this._isLoopFadeIn = loopFadeIn;
    }
    /**
     * ループ時のフェードイン情報の取得
     *
     * @return  true    する
     * @return  false   しない
     */
    isLoopFadeIn() {
      CubismLogWarning(
        "isLoopFadeIn() is a deprecated function. Please use getLoopFadeIn()."
      );
      return this._isLoopFadeIn;
    }
    /**
     * Sets the version of the Motion Behavior.
     *
     * @param Specifies the version of the Motion Behavior.
     */
    setMotionBehavior(motionBehavior) {
      this._motionBehavior = motionBehavior;
    }
    /**
     * Gets the version of the Motion Behavior.
     *
     * @return Returns the version of the Motion Behavior.
     */
    getMotionBehavior() {
      return this._motionBehavior;
    }
    /**
     * モーションの長さを取得する。
     *
     * @return  モーションの長さ[秒]
     */
    getDuration() {
      return this._isLoop ? -1 : this._loopDurationSeconds;
    }
    /**
     * モーションのループ時の長さを取得する。
     *
     * @return  モーションのループ時の長さ[秒]
     */
    getLoopDuration() {
      return this._loopDurationSeconds;
    }
    /**
     * パラメータに対するフェードインの時間を設定する。
     *
     * @param parameterId     パラメータID
     * @param value           フェードインにかかる時間[秒]
     */
    setParameterFadeInTime(parameterId, value) {
      const curves = this._motionData.curves;
      for (let i = 0; i < this._motionData.curveCount; ++i) {
        if (parameterId == curves.at(i).id) {
          curves.at(i).fadeInTime = value;
          return;
        }
      }
    }
    /**
     * パラメータに対するフェードアウトの時間の設定
     * @param parameterId     パラメータID
     * @param value           フェードアウトにかかる時間[秒]
     */
    setParameterFadeOutTime(parameterId, value) {
      const curves = this._motionData.curves;
      for (let i = 0; i < this._motionData.curveCount; ++i) {
        if (parameterId == curves.at(i).id) {
          curves.at(i).fadeOutTime = value;
          return;
        }
      }
    }
    /**
     * パラメータに対するフェードインの時間の取得
     * @param    parameterId     パラメータID
     * @return   フェードインにかかる時間[秒]
     */
    getParameterFadeInTime(parameterId) {
      const curves = this._motionData.curves;
      for (let i = 0; i < this._motionData.curveCount; ++i) {
        if (parameterId == curves.at(i).id) {
          return curves.at(i).fadeInTime;
        }
      }
      return -1;
    }
    /**
     * パラメータに対するフェードアウトの時間を取得
     *
     * @param   parameterId     パラメータID
     * @return   フェードアウトにかかる時間[秒]
     */
    getParameterFadeOutTime(parameterId) {
      const curves = this._motionData.curves;
      for (let i = 0; i < this._motionData.curveCount; ++i) {
        if (parameterId == curves.at(i).id) {
          return curves.at(i).fadeOutTime;
        }
      }
      return -1;
    }
    /**
     * 自動エフェクトがかかっているパラメータIDリストの設定
     * @param eyeBlinkParameterIds    自動まばたきがかかっているパラメータIDのリスト
     * @param lipSyncParameterIds     リップシンクがかかっているパラメータIDのリスト
     */
    setEffectIds(eyeBlinkParameterIds, lipSyncParameterIds) {
      this._eyeBlinkParameterIds = eyeBlinkParameterIds;
      this._lipSyncParameterIds = lipSyncParameterIds;
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
      this._motionData = void 0;
      this._motionData = null;
    }
    /**
     *
     * @param motionQueueEntry
     * @param userTimeSeconds
     * @param time
     */
    updateForNextLoop(motionQueueEntry, userTimeSeconds, time) {
      switch (this._motionBehavior) {
        case 1:
        default:
          motionQueueEntry.setStartTime(userTimeSeconds - time);
          if (this._isLoopFadeIn) {
            motionQueueEntry.setFadeInStartTime(userTimeSeconds - time);
          }
          if (this._onFinishedMotion != null) {
            this._onFinishedMotion(this);
          }
          break;
        case 0:
          motionQueueEntry.setStartTime(userTimeSeconds);
          if (this._isLoopFadeIn) {
            motionQueueEntry.setFadeInStartTime(userTimeSeconds);
          }
          break;
      }
    }
    /**
     * motion3.jsonをパースする。
     *
     * @param motionJson  motion3.jsonが読み込まれているバッファ
     * @param size        バッファのサイズ
     * @param shouldCheckMotionConsistency motion3.json整合性チェックするかどうか
     */
    parse(motionJson, size, shouldCheckMotionConsistency = false) {
      let json = new CubismMotionJson(motionJson, size);
      if (!json) {
        json.release();
        json = void 0;
        return;
      }
      if (shouldCheckMotionConsistency) {
        const consistency = json.hasConsistency();
        if (!consistency) {
          json.release();
          CubismLogError("Inconsistent motion3.json.");
          return;
        }
      }
      this._motionData = new CubismMotionData();
      this._motionData.duration = json.getMotionDuration();
      this._motionData.loop = json.isMotionLoop();
      this._motionData.curveCount = json.getMotionCurveCount();
      this._motionData.fps = json.getMotionFps();
      this._motionData.eventCount = json.getEventCount();
      const areBeziersRestructed = json.getEvaluationOptionFlag(
        EvaluationOptionFlag.EvaluationOptionFlag_AreBeziersRistricted
      );
      if (json.isExistMotionFadeInTime()) {
        this._fadeInSeconds = json.getMotionFadeInTime() < 0 ? 1 : json.getMotionFadeInTime();
      } else {
        this._fadeInSeconds = 1;
      }
      if (json.isExistMotionFadeOutTime()) {
        this._fadeOutSeconds = json.getMotionFadeOutTime() < 0 ? 1 : json.getMotionFadeOutTime();
      } else {
        this._fadeOutSeconds = 1;
      }
      this._motionData.curves.updateSize(
        this._motionData.curveCount,
        CubismMotionCurve,
        true
      );
      this._motionData.segments.updateSize(
        json.getMotionTotalSegmentCount(),
        CubismMotionSegment,
        true
      );
      this._motionData.points.updateSize(
        json.getMotionTotalPointCount(),
        CubismMotionPoint,
        true
      );
      this._motionData.events.updateSize(
        this._motionData.eventCount,
        CubismMotionEvent,
        true
      );
      let totalPointCount = 0;
      let totalSegmentCount = 0;
      for (let curveCount = 0; curveCount < this._motionData.curveCount; ++curveCount) {
        if (json.getMotionCurveTarget(curveCount) == TargetNameModel) {
          this._motionData.curves.at(curveCount).type = CubismMotionCurveTarget.CubismMotionCurveTarget_Model;
        } else if (json.getMotionCurveTarget(curveCount) == TargetNameParameter) {
          this._motionData.curves.at(curveCount).type = CubismMotionCurveTarget.CubismMotionCurveTarget_Parameter;
        } else if (json.getMotionCurveTarget(curveCount) == TargetNamePartOpacity) {
          this._motionData.curves.at(curveCount).type = CubismMotionCurveTarget.CubismMotionCurveTarget_PartOpacity;
        } else {
          CubismLogWarning(
            'Warning : Unable to get segment type from Curve! The number of "CurveCount" may be incorrect!'
          );
        }
        this._motionData.curves.at(curveCount).id = json.getMotionCurveId(curveCount);
        this._motionData.curves.at(curveCount).baseSegmentIndex = totalSegmentCount;
        this._motionData.curves.at(curveCount).fadeInTime = json.isExistMotionCurveFadeInTime(curveCount) ? json.getMotionCurveFadeInTime(curveCount) : -1;
        this._motionData.curves.at(curveCount).fadeOutTime = json.isExistMotionCurveFadeOutTime(curveCount) ? json.getMotionCurveFadeOutTime(curveCount) : -1;
        for (let segmentPosition = 0; segmentPosition < json.getMotionCurveSegmentCount(curveCount); ) {
          if (segmentPosition == 0) {
            this._motionData.segments.at(totalSegmentCount).basePointIndex = totalPointCount;
            this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition);
            this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
            totalPointCount += 1;
            segmentPosition += 2;
          } else {
            this._motionData.segments.at(totalSegmentCount).basePointIndex = totalPointCount - 1;
          }
          const segment = json.getMotionCurveSegment(
            curveCount,
            segmentPosition
          );
          const segmentType = segment;
          switch (segmentType) {
            case CubismMotionSegmentType.CubismMotionSegmentType_Linear: {
              this._motionData.segments.at(totalSegmentCount).segmentType = CubismMotionSegmentType.CubismMotionSegmentType_Linear;
              this._motionData.segments.at(totalSegmentCount).evaluate = linearEvaluate;
              this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
              this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
              totalPointCount += 1;
              segmentPosition += 3;
              break;
            }
            case CubismMotionSegmentType.CubismMotionSegmentType_Bezier: {
              this._motionData.segments.at(totalSegmentCount).segmentType = CubismMotionSegmentType.CubismMotionSegmentType_Bezier;
              if (areBeziersRestructed || UseOldBeziersCurveMotion) {
                this._motionData.segments.at(totalSegmentCount).evaluate = bezierEvaluate;
              } else {
                this._motionData.segments.at(totalSegmentCount).evaluate = bezierEvaluateCardanoInterpretation;
              }
              this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
              this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
              this._motionData.points.at(totalPointCount + 1).time = json.getMotionCurveSegment(curveCount, segmentPosition + 3);
              this._motionData.points.at(totalPointCount + 1).value = json.getMotionCurveSegment(curveCount, segmentPosition + 4);
              this._motionData.points.at(totalPointCount + 2).time = json.getMotionCurveSegment(curveCount, segmentPosition + 5);
              this._motionData.points.at(totalPointCount + 2).value = json.getMotionCurveSegment(curveCount, segmentPosition + 6);
              totalPointCount += 3;
              segmentPosition += 7;
              break;
            }
            case CubismMotionSegmentType.CubismMotionSegmentType_Stepped: {
              this._motionData.segments.at(totalSegmentCount).segmentType = CubismMotionSegmentType.CubismMotionSegmentType_Stepped;
              this._motionData.segments.at(totalSegmentCount).evaluate = steppedEvaluate;
              this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
              this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
              totalPointCount += 1;
              segmentPosition += 3;
              break;
            }
            case CubismMotionSegmentType.CubismMotionSegmentType_InverseStepped: {
              this._motionData.segments.at(totalSegmentCount).segmentType = CubismMotionSegmentType.CubismMotionSegmentType_InverseStepped;
              this._motionData.segments.at(totalSegmentCount).evaluate = inverseSteppedEvaluate;
              this._motionData.points.at(totalPointCount).time = json.getMotionCurveSegment(curveCount, segmentPosition + 1);
              this._motionData.points.at(totalPointCount).value = json.getMotionCurveSegment(curveCount, segmentPosition + 2);
              totalPointCount += 1;
              segmentPosition += 3;
              break;
            }
            default: {
              CSM_ASSERT(0);
              break;
            }
          }
          ++this._motionData.curves.at(curveCount).segmentCount;
          ++totalSegmentCount;
        }
      }
      for (let userdatacount = 0; userdatacount < json.getEventCount(); ++userdatacount) {
        this._motionData.events.at(userdatacount).fireTime = json.getEventTime(userdatacount);
        this._motionData.events.at(userdatacount).value = json.getEventValue(userdatacount);
      }
      json.release();
      json = void 0;
      json = null;
    }
    /**
     * モデルのパラメータ更新
     *
     * イベント発火のチェック。
     * 入力する時間は呼ばれるモーションタイミングを０とした秒数で行う。
     *
     * @param beforeCheckTimeSeconds   前回のイベントチェック時間[秒]
     * @param motionTimeSeconds        今回の再生時間[秒]
     */
    getFiredEvent(beforeCheckTimeSeconds, motionTimeSeconds) {
      this._firedEventValues.updateSize(0);
      for (let u = 0; u < this._motionData.eventCount; ++u) {
        if (this._motionData.events.at(u).fireTime > beforeCheckTimeSeconds && this._motionData.events.at(u).fireTime <= motionTimeSeconds) {
          this._firedEventValues.pushBack(
            new csmString(this._motionData.events.at(u).value.s)
          );
        }
      }
      return this._firedEventValues;
    }
    /**
     * 透明度のカーブが存在するかどうかを確認する
     *
     * @returns true  -> キーが存在する
     *          false -> キーが存在しない
     */
    isExistModelOpacity() {
      for (let i = 0; i < this._motionData.curveCount; i++) {
        const curve = this._motionData.curves.at(i);
        if (curve.type != CubismMotionCurveTarget.CubismMotionCurveTarget_Model) {
          continue;
        }
        if (curve.id.getString().s.localeCompare(IdNameOpacity) == 0) {
          return true;
        }
      }
      return false;
    }
    /**
     * 透明度のカーブのインデックスを返す
     *
     * @returns success:透明度のカーブのインデックス
     */
    getModelOpacityIndex() {
      if (this.isExistModelOpacity()) {
        for (let i = 0; i < this._motionData.curveCount; i++) {
          const curve = this._motionData.curves.at(i);
          if (curve.type != CubismMotionCurveTarget.CubismMotionCurveTarget_Model) {
            continue;
          }
          if (curve.id.getString().s.localeCompare(IdNameOpacity) == 0) {
            return i;
          }
        }
      }
      return -1;
    }
    /**
     * 透明度のIdを返す
     *
     * @param index モーションカーブのインデックス
     * @returns success:透明度のカーブのインデックス
     */
    getModelOpacityId(index) {
      if (index != -1) {
        const curve = this._motionData.curves.at(index);
        if (curve.type == CubismMotionCurveTarget.CubismMotionCurveTarget_Model) {
          if (curve.id.getString().s.localeCompare(IdNameOpacity) == 0) {
            return CubismFramework.getIdManager().getId(curve.id.getString().s);
          }
        }
      }
      return null;
    }
    /**
     * 現在時間の透明度の値を返す
     *
     * @returns success:モーションの当該時間におけるOpacityの値
     */
    getModelOpacityValue() {
      return this._modelOpacity;
    }
    /**
     * デバッグ用フラグを設定する
     *
     * @param debugMode デバッグモードの有効・無効
     */
    setDebugMode(debugMode) {
      this._debugMode = debugMode;
    }
    // デバッグモードかどうか
  }
  var Live2DCubismFramework$1;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.CubismMotion = CubismMotion;
  })(Live2DCubismFramework$1 || (Live2DCubismFramework$1 = {}));
  const CubismDefaultParameterId = Object.freeze({
    // パーツID
    HitAreaPrefix: "HitArea",
    HitAreaHead: "Head",
    HitAreaBody: "Body",
    PartsIdCore: "Parts01Core",
    PartsArmPrefix: "Parts01Arm_",
    PartsArmLPrefix: "Parts01ArmL_",
    PartsArmRPrefix: "Parts01ArmR_",
    // パラメータID
    ParamAngleX: "ParamAngleX",
    ParamAngleY: "ParamAngleY",
    ParamAngleZ: "ParamAngleZ",
    ParamEyeLOpen: "ParamEyeLOpen",
    ParamEyeLSmile: "ParamEyeLSmile",
    ParamEyeROpen: "ParamEyeROpen",
    ParamEyeRSmile: "ParamEyeRSmile",
    ParamEyeBallX: "ParamEyeBallX",
    ParamEyeBallY: "ParamEyeBallY",
    ParamEyeBallForm: "ParamEyeBallForm",
    ParamBrowLY: "ParamBrowLY",
    ParamBrowRY: "ParamBrowRY",
    ParamBrowLX: "ParamBrowLX",
    ParamBrowRX: "ParamBrowRX",
    ParamBrowLAngle: "ParamBrowLAngle",
    ParamBrowRAngle: "ParamBrowRAngle",
    ParamBrowLForm: "ParamBrowLForm",
    ParamBrowRForm: "ParamBrowRForm",
    ParamMouthForm: "ParamMouthForm",
    ParamMouthOpenY: "ParamMouthOpenY",
    ParamCheek: "ParamCheek",
    ParamBodyAngleX: "ParamBodyAngleX",
    ParamBodyAngleY: "ParamBodyAngleY",
    ParamBodyAngleZ: "ParamBodyAngleZ",
    ParamBreath: "ParamBreath",
    ParamArmLA: "ParamArmLA",
    ParamArmRA: "ParamArmRA",
    ParamArmLB: "ParamArmLB",
    ParamArmRB: "ParamArmRB",
    ParamHandL: "ParamHandL",
    ParamHandR: "ParamHandR",
    ParamHairFront: "ParamHairFront",
    ParamHairSide: "ParamHairSide",
    ParamHairBack: "ParamHairBack",
    ParamHairFluffy: "ParamHairFluffy",
    ParamShoulderY: "ParamShoulderY",
    ParamBustX: "ParamBustX",
    ParamBustY: "ParamBustY",
    ParamBaseX: "ParamBaseX",
    ParamBaseY: "ParamBaseY",
    ParamNONE: "NONE:"
  });
  var Live2DCubismFramework;
  ((Live2DCubismFramework2) => {
    Live2DCubismFramework2.HitAreaBody = CubismDefaultParameterId.HitAreaBody;
    Live2DCubismFramework2.HitAreaHead = CubismDefaultParameterId.HitAreaHead;
    Live2DCubismFramework2.HitAreaPrefix = CubismDefaultParameterId.HitAreaPrefix;
    Live2DCubismFramework2.ParamAngleX = CubismDefaultParameterId.ParamAngleX;
    Live2DCubismFramework2.ParamAngleY = CubismDefaultParameterId.ParamAngleY;
    Live2DCubismFramework2.ParamAngleZ = CubismDefaultParameterId.ParamAngleZ;
    Live2DCubismFramework2.ParamArmLA = CubismDefaultParameterId.ParamArmLA;
    Live2DCubismFramework2.ParamArmLB = CubismDefaultParameterId.ParamArmLB;
    Live2DCubismFramework2.ParamArmRA = CubismDefaultParameterId.ParamArmRA;
    Live2DCubismFramework2.ParamArmRB = CubismDefaultParameterId.ParamArmRB;
    Live2DCubismFramework2.ParamBaseX = CubismDefaultParameterId.ParamBaseX;
    Live2DCubismFramework2.ParamBaseY = CubismDefaultParameterId.ParamBaseY;
    Live2DCubismFramework2.ParamBodyAngleX = CubismDefaultParameterId.ParamBodyAngleX;
    Live2DCubismFramework2.ParamBodyAngleY = CubismDefaultParameterId.ParamBodyAngleY;
    Live2DCubismFramework2.ParamBodyAngleZ = CubismDefaultParameterId.ParamBodyAngleZ;
    Live2DCubismFramework2.ParamBreath = CubismDefaultParameterId.ParamBreath;
    Live2DCubismFramework2.ParamBrowLAngle = CubismDefaultParameterId.ParamBrowLAngle;
    Live2DCubismFramework2.ParamBrowLForm = CubismDefaultParameterId.ParamBrowLForm;
    Live2DCubismFramework2.ParamBrowLX = CubismDefaultParameterId.ParamBrowLX;
    Live2DCubismFramework2.ParamBrowLY = CubismDefaultParameterId.ParamBrowLY;
    Live2DCubismFramework2.ParamBrowRAngle = CubismDefaultParameterId.ParamBrowRAngle;
    Live2DCubismFramework2.ParamBrowRForm = CubismDefaultParameterId.ParamBrowRForm;
    Live2DCubismFramework2.ParamBrowRX = CubismDefaultParameterId.ParamBrowRX;
    Live2DCubismFramework2.ParamBrowRY = CubismDefaultParameterId.ParamBrowRY;
    Live2DCubismFramework2.ParamBustX = CubismDefaultParameterId.ParamBustX;
    Live2DCubismFramework2.ParamBustY = CubismDefaultParameterId.ParamBustY;
    Live2DCubismFramework2.ParamCheek = CubismDefaultParameterId.ParamCheek;
    Live2DCubismFramework2.ParamEyeBallForm = CubismDefaultParameterId.ParamEyeBallForm;
    Live2DCubismFramework2.ParamEyeBallX = CubismDefaultParameterId.ParamEyeBallX;
    Live2DCubismFramework2.ParamEyeBallY = CubismDefaultParameterId.ParamEyeBallY;
    Live2DCubismFramework2.ParamEyeLOpen = CubismDefaultParameterId.ParamEyeLOpen;
    Live2DCubismFramework2.ParamEyeLSmile = CubismDefaultParameterId.ParamEyeLSmile;
    Live2DCubismFramework2.ParamEyeROpen = CubismDefaultParameterId.ParamEyeROpen;
    Live2DCubismFramework2.ParamEyeRSmile = CubismDefaultParameterId.ParamEyeRSmile;
    Live2DCubismFramework2.ParamHairBack = CubismDefaultParameterId.ParamHairBack;
    Live2DCubismFramework2.ParamHairFluffy = CubismDefaultParameterId.ParamHairFluffy;
    Live2DCubismFramework2.ParamHairFront = CubismDefaultParameterId.ParamHairFront;
    Live2DCubismFramework2.ParamHairSide = CubismDefaultParameterId.ParamHairSide;
    Live2DCubismFramework2.ParamHandL = CubismDefaultParameterId.ParamHandL;
    Live2DCubismFramework2.ParamHandR = CubismDefaultParameterId.ParamHandR;
    Live2DCubismFramework2.ParamMouthForm = CubismDefaultParameterId.ParamMouthForm;
    Live2DCubismFramework2.ParamMouthOpenY = CubismDefaultParameterId.ParamMouthOpenY;
    Live2DCubismFramework2.ParamNONE = CubismDefaultParameterId.ParamNONE;
    Live2DCubismFramework2.ParamShoulderY = CubismDefaultParameterId.ParamShoulderY;
    Live2DCubismFramework2.PartsArmLPrefix = CubismDefaultParameterId.PartsArmLPrefix;
    Live2DCubismFramework2.PartsArmPrefix = CubismDefaultParameterId.PartsArmPrefix;
    Live2DCubismFramework2.PartsArmRPrefix = CubismDefaultParameterId.PartsArmRPrefix;
    Live2DCubismFramework2.PartsIdCore = CubismDefaultParameterId.PartsIdCore;
  })(Live2DCubismFramework || (Live2DCubismFramework = {}));
  undefined = CubismMoc;
  undefined = CubismModel;
  undefined = CubismRenderer_WebGL;
  undefined = CubismMotion;
  undefined = CubismDefaultParameterId;
  globalThis.Live2DCubismFramework = NS;
})();
