import  React from "react";
import { NoValue } from '../utils/global-variable'
import { Form, InputNumber } from 'antd'

const Index = (props) => {
    const { item }: any = {
        item: {},
        ...props,
    }
    return (
        <Form.Item
            shouldUpdate
            label={item.label}
            name={item.name}
            rules={[{
                required: item.required === false ? false : true,
                message: item.errMessage ? item.errMessage : `请输入${item.label}！`,
                // type: item.validateType,
                // min: item.min,
                // max: item.max,
                // transform: value => + value
            }]}
        >
            <InputNumber style={{ width: '100%' }} min={item.min} max={item.max} step={item.step} disabled={item.disabled}
                placeholder={item.disabled ? NoValue : item.placeholder ? item.placeholder : `请输入${item.label}`}
            />
        </Form.Item>
    )
}
export default Index;