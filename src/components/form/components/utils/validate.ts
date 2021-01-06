/*
 * @Author: your name
 * @Date: 2020-03-04 16:08:18
 * @LastEditTime: 2020-12-09 13:40:05
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /findOnlineOperatingSystem/src/utils/validate.ts
 */



const Validate = {
    /** 校验电话号码 */
    phone: async (value, item?) => {
        if (item && item.required === false) {
            return Promise.resolve();
        }

        let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (value && !myreg.test(value)) {
            throw new Error('Something wrong!');
        } else {
            //如果有callback
            if (item && item.action) {
                item.action(value)
            }
            // //如果有getUserInfo
            // if (item.getUserInfo) {
            //     GetInfoByPhone(value, item)
            // }
            return Promise.resolve();
        }
    },

    /** 没有中文 */
    noChinese: async (value, item?) => {
        if (item && item.required === false) {
            return Promise.resolve();
        }

        let myreg = /[\u4E00-\u9FA5]/g;
        if (value && !myreg.test(value)) {
            return Promise.resolve();
        } else {
            throw new Error('Something wrong!');
        }
    },
    /** 密码验证 */
    password: async (value, item?) => {
        if (item && item.required === false) {
            return Promise.resolve();
        }
        let myreg = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');
        if (value && !myreg.test(value)) {
            return Promise.resolve();
        } else {
            throw new Error('Something wrong!');
        }
    },

    /** 验证编辑器 */
    edit: (value, required) => {
        if (required === false) {
            return Promise.resolve();
        }
        if (value.isEmpty()) {
            throw new Error('请输入正文内容');
        } else {
            return Promise.resolve();
        }
    }
}

export default Validate