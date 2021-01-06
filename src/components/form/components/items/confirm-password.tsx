import  React from "react";
import { Form, Input } from 'antd'
const Index = (props) => {
    const { item }: any = {
        item: {},
        ...props,
    }
    return (
        <Form.Item
            label={item.label}
            name={item.name}
            dependencies={['password']}
            hasFeedback
            rules={[
                {
                    required: item.required === false ? false : true,
                    message: item.errMessage ? item.errMessage : `请选择${item.label}！`,
                },
                ({ getFieldValue }) => ({
                    validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                            console.log("确认密码----------1", value, getFieldValue('password'))
                            return Promise.resolve();
                        } else {
                            console.log("确认密码----------2", value, getFieldValue('password'))
                            return Promise.reject('两次输入的密码不一致！');
                        }
                    },
                }),
            ]}
        >
            <Input.Password
                allowClear
                disabled={item.disabled}
                maxLength={item.maxLength || 10000}
                placeholder={item.placeholder ? item.placeholder : `请输入${item.label}`} />
        </Form.Item>
    )
}
export default Index;