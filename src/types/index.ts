export module WebCursor{
    export interface options{
        /**
         * selectors|选择器
         */
        els?:string[]|string
        /**
         * 自定义光标维持时间，xms后未操作自动复原
         */
        duration?:number
        /**
         * 一直都展示原光标
         */
        show?:boolean
        /**
         * TODO：自定义dom
         */
        html?:string|HTMLElement
        /**
         * 背景图片
         */
        bgUrl?:string
        /**
         * 图片宽度
         */
        width?:number
        /**
         * 图片高度
         */
        height?:number
        /**
         * 文字内容
         */
        text?:string
        /**
         * 自定义样式
         */
        style?:CSSStyleDeclaration
    }
}
