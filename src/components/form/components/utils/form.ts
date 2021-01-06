/*
 * @Author: your name
 * @Date: 2020-05-21 16:51:46
 * @LastEditTime: 2020-11-02 17:35:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /findOnlineOperatingSystem/src/components/online-form copy/scripts/index.ts
 */


/** 更新Form表单组件 */
const UpdateFormItem = (item, parentKey, listIndex, fn, itemlistIndex?) => {
    let show = item.visible === false ? false : true
    let { relyOn, switchVisabled } = item
    let name = [...item.name]
    /** 如果有依赖 */
    if (relyOn) {
        //如果是formList
        if (relyOn.type === 'formList') {
            name = [parentKey, ...listIndex, ...relyOn.name]
            let field = fn(name)
            // console.log('更新Form表单组件', name, field)
            if (relyOn.value.includes(field)) {
                show = true
            } else {
                show = false
            }

        } else {
            let value = fn(relyOn.name)
            //如果依赖项的值等于需要值
            if (relyOn.value.includes(value)) {
                show = true
            } else {
                show = false
            }
            // console.log('getFieldValue-------------', fn(relyOn.name), item.name)
        }
    }


    /** 如果有switchVisabled */
    if (switchVisabled) {
        let { itemName, parentBortherName, hiddenValue, hiddenByOtherItem } = switchVisabled
        // console.log('更新Form表单组件-------------', item, parentKey, listIndex, fn([itemName, itemlistIndex, parentBortherName]))
        /** 如果有relyOn的情况下 */
        if (hiddenByOtherItem) {
            let relyOnValue = fn(hiddenByOtherItem.name)
            if (relyOnValue === hiddenByOtherItem.value && fn([itemName, itemlistIndex, parentBortherName]) === hiddenValue) {
                show = false
            }
            // console.log('更新Form表单组件-------------', relyOnValue)
        } else { //如果没有relyOn
            if (fn([itemName, itemlistIndex, parentBortherName]) === hiddenValue) {
                show = false
            }
        }


    }

    // console.log('更新Form表单组件-------------', item, parentKey, listIndex, fn(parentKey))
    return show
}


export {
    UpdateFormItem
}