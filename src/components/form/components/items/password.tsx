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
            rules={[{
                required: item.required === false ? false : true,
                message: item.errMessage ? item.errMessage : `请选择${item.label}！`,
            }]}
            hasFeedback
        >
            <Input.Password

                allowClear
                maxLength={item.maxLength || 10000}
                disabled={item.disabled}
                placeholder={item.placeholder ? item.placeholder : `请输入${item.label}`}
            />
        </Form.Item>
    )
}
export default Index;