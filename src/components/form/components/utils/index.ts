/*
 * @Author: your name
 * @Date: 2020-07-14 14:34:56
 * @LastEditTime: 2020-07-14 14:46:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /findOnlineOperatingSystem/src/components/online-form/components/scripts/index.ts
 */
import { message } from 'antd'

/** 重置多选框的值 */
const ResetValue = (name, mess, value, fn?) => {
    if (fn) {
        fn({ [name]: value })
    }
    if (mess) {
        message.error({
            top: 200,
            content: mess,
            duration: 3,
        })
    }


}

export {
    ResetValue
}