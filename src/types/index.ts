export module WebCursor{
    export interface options{
        /**
         * selectors|选择器
         */
        els?:string[]|string
        /**
         * 持续时间
         */
        duration?:number
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
