import { WebCursor } from '../types';
import { addStyleDom, h } from '../utils';
import style from '../styles/cursor.scss';

class Cursor {
  private option:WebCursor.options

  private cursorDom:HTMLElement

  private domMap = new WeakMap()

  constructor(option?:WebCursor.options) {
    this.option = { els: ['body'], duration: 0, ...option };
    this.cursorDom = h('div');
    this.init();
  }

  // TODO，待完善，支持自定义图片和文案内容，样式，dom，残影，预设样式等等
  private createCursor() {
    const { text = '', bgUrl, style: cursorStyle } = this.option;
    const dom = h('div');
    dom.textContent = text;
    if (bgUrl) {
      dom.style.backgroundImage = `url(${bgUrl})`;
      Object.assign(dom.style, {
        width: '40px',
        height: '40px',
        backgroundSize: '40px 40px',
      }, cursorStyle);
    }

    dom.classList.add('cursor-wrapper');
    addStyleDom(dom, style);
    document.body.appendChild(dom);
    this.cursorDom = dom;
  }

  private refreshCursor(x, y, show = true) {
    this.cursorDom.style.left = `${x}px`;
    this.cursorDom.style.top = `${y}px`;
    this.cursorDom.style.display = show ? 'block' : 'none';
  }

  private elCallback = (e:MouseEvent) => {
    const { duration = 0 } = this.option;

    // TODO:事件冒泡处理
    e.stopPropagation();
    const { clientX, clientY } = e;
    const targetDom = e.target as HTMLElement;

    this.refreshCursor(clientX, clientY);

    targetDom.style.cursor = 'none';
    if (duration <= 0) {
      return;
    }
    let ops = this.domMap.get(targetDom);
    if (!ops) {
      const { cursor } = getComputedStyle(targetDom);
      ops = {
        timer: null,
        cursor,
      };
      this.domMap.set(targetDom, ops);
    }
    if (ops.timer) {
      clearTimeout(ops.timer);
    }

    ops.timer = setTimeout(() => {
      targetDom.style.cursor = ops.cursor;
    }, duration);
  }

  private documentCallback = () => {
    // 选择器外，自动复原
    this.refreshCursor(0, 0, false);
    console.log('global');
  }

  private init() {
    this.createCursor();
    let { els } = this.option;
    if (!Array.isArray(els)) {
      els = [els as string];
    }
    // 注册事件
    els?.forEach((el) => {
      const doms = document.querySelectorAll(el) as unknown as HTMLElement[];
      doms.forEach((dom) => {
        if (dom?.addEventListener) {
          dom.addEventListener('mousemove', this.elCallback);
        }
      });
    });

    document.documentElement.addEventListener('mousemove', this.documentCallback);
  }

  /**
   * 取消注册的事件，销毁创建的指针dom
   */
  destroy() {
    let { els } = this.option;
    if (!Array.isArray(els)) {
      els = [els as string];
    }
    els?.forEach((el) => {
      const doms = document.querySelectorAll(el) as unknown as HTMLElement[];
      doms.forEach((dom) => {
        if (dom?.removeEventListener) {
          dom.removeEventListener('mousemove', this.elCallback);
        }
      });
    });

    document.documentElement.removeEventListener('mousemove', this.documentCallback);
    this.cursorDom.remove();
  }
}

export default Cursor;
