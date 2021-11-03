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

  // TODO，待完善，dom，残影等等
  private createCursor() {
    const defaultOps = {
      bgUrl: 'https://img.cdn.sugarat.top/mdImg/MTYzNTg2NTAyNzk0Nw==635865027947',
      text: '',
      width: 12,
      height: 20,
      show: false,
    };
    const {
      text, bgUrl, style: cursorStyle, width, height,
    } = {
      ...defaultOps,
      ...this.option,
    };
    const dom = h('div');
    dom.textContent = text;

    Object.assign(dom.style, cursorStyle);
    if (bgUrl && !text) {
      Object.assign(dom.style, {
        backgroundImage: `url(${bgUrl})`,
        width: `${width}px`,
        height: `${height}px`,
        backgroundSize: `${width}px ${height}px`,
      });
    }

    dom.classList.add('cursor-wrapper');
    addStyleDom(dom, style);
    document.body.appendChild(dom);
    this.cursorDom = dom;
  }

  private refreshCursor(x, y, show = true) {
    this.cursorDom.style.display = show ? 'block' : 'none';
    if (show) {
      this.cursorDom.style.left = `${x}px`;
      this.cursorDom.style.top = `${y}px`;
    }
  }

  private elCallback = (e:MouseEvent) => {
    const { duration = 0, show } = this.option;
    const { clientX, clientY } = e;

    // 防止叠加的元素出现多个鼠标样式
    e.stopPropagation();

    const targetDom = e.target as HTMLElement;

    this.refreshCursor(clientX, clientY);

    let ops = this.domMap.get(targetDom);
    if (!ops) {
      const { cursor } = getComputedStyle(targetDom);
      ops = {
        timer: null,
        cursor,
      };
      this.domMap.set(targetDom, ops);
    }
    if (!show) {
      targetDom.style.cursor = 'none';
    }
    if (duration <= 0) {
      return;
    }
    if (ops.timer) {
      clearTimeout(ops.timer);
    }

    ops.timer = setTimeout(() => {
      // 恢复
      if (targetDom.style.cursor !== ops.cursor) {
        targetDom.style.cursor = ops.cursor;
      }
      this.refreshCursor(0, 0, false);
    }, duration);
  }

  private documentCallback = () => {
    // 选择器外，自动复原
    this.refreshCursor(0, 0, false);
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

    document.documentElement.addEventListener('mousemove', this.documentCallback, {
      capture: true,
    });
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
