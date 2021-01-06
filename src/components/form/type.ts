/*
 * @Author: your name
 * @Date: 2020-03-19 11:06:00
 * @LastEditTime: 2020-12-09 13:28:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /findOnlineOperatingSystem/src/components/online-form/type.ts
 */

type Type =
    string |
    'input' |
    'edit' |
    'number' |
    'select' |
    'upload' |
    'listbox' |
    'password' |
    'numberinput' |
    'toptitle' |
    'textarea' |
    'cascader' |
    'radio' |
    'checkbox' |
    'date' |
    'multiple' |
    'phone' |
    'area' |
    'confirm' |
    'tag' |
    'rangeTime' |
    'formList' |
    'component'

export type formItem = {
    /** form值对应的key */
    name?: string,
    /** 用来替换name */
    itemName?: string,
    /** label */
    label?: string,
    /** 
     * type ----------form组件类型
     * input 
     * number   数字
     * password 密码
     * textarea 文本框
     * cascader 联级选择框
     * radio    单选
     * checkbox 多选
     * date     日期
     * multiple 多选择器
     * phone    电话
     * area     地区
     * confirm  确认密码
     * tag      标签
     * rangeTime 选择时间段
     * formList  formList
     * component 自定义组件
     */
    type: Type
    /** 显示类型 */
    viewType?: string
    /**指定输入框展示值的格式 inputNumber  */
    formatter?: string
    /** 禁止黏贴 */
    disablePaste?: boolean
    /** type === select 是否需要搜索 */
    search?: boolean
    /** type === select 搜索需要的参数和接口名 */
    searchParams?: {
        api: string//'GetTeacherList',
        searchParam: string //'text'
        defaultParams: {
            [key: string]: any
        } //默认参数
    }
    /** date组件是否显示时间段 */
    showTime?: boolean

    /** 最长字符长度 */
    maxLength?: number

    /** 状态 */
    state?: 'create' | 'check' | 'edit' | string
    /** 显示或隐藏 
     * 隐藏后没有值
    */
    visible?: boolean

    /** 
     * 隐藏后有值
     */
    hidden?: boolean

    /** 当type是select时
     * mode = true 表示多选
     */
    mode?: true,
    /** 当时多选框时 最多选择几个tag */
    maxTagCount?: number,
    /** 关联item项 */
    dependencies?: string
    /** 必填项 默认必填*/
    required?: boolean
    /** title */
    title?: string | string[]
    /** groupTitle formlist中group专用 */
    groupTitle?: string | string[]
    /** 自定义组件 */
    component?: any
    /** 要校验的类型 */
    validateType?: string | any
    /** 依赖 */
    relyOn?: {
        name: string,
        value?: any,
        valueKey?: string,
        options?: any[],
        idKey?: string,
        childName?: string // formList的子id
        noValue?: boolean //无值的时候才显示
        type?: string | 'formList' //类型
    } | any

    /** 获取详情后没有值 需要隐藏的 */
    noValueHidden?: boolean
    /** 
     * type为formlist时 切valueType = 'arr'
     */
    direction?: 'row' | 'column'

    /** 执行异步函数
     * @deprecated 正常情况下只有select组件会用到 获取到数据后赋值个options
     */
    effect?: {
        effectName?: any, //异步函数方法名 Api[effect.effectName]()
        effectParams?: {
            [key: string]: { //参数名
                relyName: string //依赖字段的值
                valueKey?: string
            }
        } | any,//参数
        defaultParams?: { [key: string]: any } //默认参数==>不需要依赖的参
        resName?: any // 返回数据的子字段
    }


    /** 执行同步函数
     * 
     */
    actions?: [
        {
            dataName?: string // 如果有这从targetDatas中获取,没有则是自身的对应的数据
            setName?: string
            action: any
            relyOnData?: string // 当type='formList'时会用到 需要依赖的数据
            setChildName?: string //当type='formList'时会用到 需要设置兄弟name
            debounceTime?: string //延迟执行时间
            setOptionsByValue?: boolean //根据值显示options
            setVisabled?: boolean //设置visabled
            setItem?: boolean //重新设置item
        }
    ]

    /** formList下设置label */
    setLabel?: {
        itemName: string //'specification',
        parentName: string //'value',
        labelName: string //'label'
    }

    /** action
     * 目前只用于输入手机号是调接口-后续可以继续扩展
     */
    action?: any

    /** title时  buttons */
    buttons?: {
        type: string,
        button: string,
        aciton: () => void
    }

    /** 需要空值 */
    needSpaceValue?: true

    /** 
     * 根据手机号查找用户是否存在
     */
    check?: {
        api: string,
        paramKey: string //api参数名
        type?: 'check' | 'create' | string
        successMessage?: string,
        errMessage?: string,
        saveData?: any //获取check后的数据
        action?: any //获取数据后需要执行的函数
        checkKeyToDisabled?: string //某个字段有值时全部disabled
        closeModal?: any //当人员已经存在此商户下时自动关闭弹窗
        setValue?: any //获取到数据后对某个不对应的字段名进行赋值
    }

    /** 查看后disabeld */
    checkedDisabled?: boolean //false = undisabled true = disabled

    /** 
     * @description 在有check的情况下 不需要给某些字段赋值
     */
    noValue?: boolean

    /** 需要添加uid的字段 */
    addUidName?: string[]


    /** placeholder
     * 不填则以label名进行定义
     */
    placeholder?: string | null

    /** 错误提示 
     * 不填则以label名进行定义
    */
    errMessage?: string | null

    /** 默认显示的值 */
    value?: any

    /** 禁用 
     * 默认不禁用
    */
    disabled?: boolean | null

    /** 需要map的数组 */
    options?: any[] | null

    /** 针对options的 valueKey*/
    valueKey?: string | null

    /** 针对options的 nameKey*/
    nameKey?: string | null

    /** form组件宽度 */
    aline?: boolean | null

    /** form组件 options里的子宽度 */
    colWidth?: number | null
    /** 上传组件 */
    uploadText?: string | null
    /** 最多上传几张 */
    maxFileNum?: number | null
    /** 是否展开下拉框 */
    open?: boolean
    /** formlistBtn text */
    addText?: string
    /** formlistBtn text */
    addButton?: boolean
    /** children */
    children?: formItem[]
    /** formlist中子item的宽度 */
    childWidth?: string | string[]
    /** formlist listType 列表类型 */
    valueType?: 'arr' | 'obj'
    /** formlist  valueType= obj 时 */
    dataType?: 'obj' | 'arr' | 'string'
    /** formList childType */
    childType?: Type,
    /** formList titleWidth */
    titleWidth?: string | string[]
    /** groupWidth  */
    groupWidth?: string
    /** FromList delete 删除item*/
    delete?: boolean
    /** FromList delete 删除item*/
    deleteNum?: number
    /** FromList filter*/
    filter?: {
        /** 输入 */
        entry: any[]
        /** 输出 */
        submit: any[]
    }
    /** 图片上传返回的值类型 */
    uploadValueType?: 'key' | 'string' | string
    /** upload组件返回只要sting */
    // upload

    /** formList 控制子显示项显示 */
    childVisables?: {
        names: string[] //item 名
        type: 'list' | 'all',
        index?: number[] | null, //formlist的下标
        hidden?: string[] | null //哪些childItem不显示
    },
    /** 上传组件-返回简易带有url */
    url?: boolean
    /** switch 开启转态下文案 */
    checkedChildren?: string
    /** switch 关闭转态下文案 */
    unCheckedChildren?: string

    /** formList的disabled */
    switchDisabled?: {
        name: string,
        value: string,
        disabled: boolean
    }
    /** formList的required */
    switchRequired?: {
        name: string,
        bortherName?: string //如果是关联兄弟级
        value: any,
        required: boolean
    }

    /**formList中设置是否显示 */
    switchVisabled?: {
        itemName: string //'attr',
        parentBortherName: string //'name',
        hiddenValue: string //'leaseMonth',
        hiddenByOtherItem?: {
            name: string //'type',
            value: string // 'piano'
        }
    }

    /** 是否有date组件 */
    hasDate?: boolean
}


export interface onlineForm {
    /** 是否是只读 */
    readOnly?: boolean
    /** 表单数据 */
    values?: {
        [key: string]: any
    } | null
    /** 需要渲染的表单组件集合 */
    items: formItem[],
    /** 表单名称 */
    formName: string,
    /** 子组件宽度 
     * 默认一行2个
     * true  一行一个
     * false   一行2个   
    */
    aline?: boolean,
    /** formitem 排列 */
    layout?: {
        labelCol: { span: number },
        wrapperCol: { span: number },
    };
    /** 确认按钮文案 */
    submitText?: string,
    /** 确认按钮回调 */
    onSubmit?: Function,
    /** 监听form表单值 */
    onChange?: Function
    /** 确认按钮文案 */
    cancelText?: string,
    /** 重设按钮回调 */
    onCancel?: Function | any,
    /** 隐藏取消按钮 */
    hiddeCancel?: boolean
    /** 隐藏提交按钮 */
    hiddeSubmit?: boolean
    /** 需要关联的数据 */
    targetDatas?: {
        [key: string]: any
    }
}