import  React from "react";
import { Form, InputNumber } from 'antd'
import { NoValue } from '../utils/global-variable'
interface formInput {
    item: any,
    listIndex?: number[]
}

const Index: React.FC<formInput> = (props) => {
    const { item, listIndex }: any = {
        item: {},
        ...props
    }
    return (
        <>
            {item.title && <p className="fz18 fc1f fwbd">{item.title}</p>}
            <Form.Item
                label={item.label}
                name={listIndex ? [...listIndex, item.name] : item.name}
                dependencies={[item.dependencies || null]}
                rules={[{
                    required: item.required === false ? false : true,
                    message: item.errMessage ? item.errMessage : `请正确输入${item.label}！`,
                    // type: 'integer',
                    // transform: value => + value
                }
                ]}
            >
                <InputNumber
                    style={{ width: '100%' }}
                    min={item.min ? item.min : 0}
                    max={item.max}
                    maxLength={item.maxLength || 10000}
                    step={item.step}
                    disabled={item.disabled}
                    placeholder={item.disabled ? NoValue : item.placeholder ? item.placeholder : `请输入${item.label}`}
                    formatter={value => item.formatter ? `${value}${item.formatter}` : `${value}`}
                    parser={value => item.formatter ? value.replace(`${item.formatter}`, '') : value}
                />
            </Form.Item>
        </>
    )
}
export default Index;