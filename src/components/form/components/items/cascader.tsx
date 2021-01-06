import  React from "react";
import { Form, Cascader } from 'antd'

const Index = (props) => {
    const { item }: any = {
        item: {},
        ...props,
    }
    return (
        <Form.Item
            name={item.name}
            label={item.label}
            rules={[
                {
                    required: item.required === false ? false : true,
                    message: item.errMessage ? item.errMessage : `请选择${item.label}！`
                },
            ]}
        >
            <Cascader
                placeholder={item.placeholder ? item.placeholder : `请选择${item.label}`}
                options={item.options} />
        </Form.Item>
    )
}
export default Index;