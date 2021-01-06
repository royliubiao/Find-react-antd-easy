import  React from "react";
import { Form, Radio } from 'antd'
interface formInput {
    item: any,
    listIndex?: any[]
}

const Index: React.FC<formInput> = (props) => {
    const { item, listIndex }: any = {
        item: {},
        ...props
    }
    return (
        <Form.Item
            name={listIndex ? [...listIndex, item.name] : item.name}
            label={item.label}
            rules={[
                {
                    required: item.required === false ? false : true,
                    message: item.errMessage ? item.errMessage : `请选择${item.label}！`
                },
            ]}
        >
            <Radio.Group>
                {
                    item.options && item.options.map((ritem, rindex) =>
                        <Radio key={rindex} disabled={item.disabled} value={ritem[item.valueKey]}>{ritem[item.nameKey]}</Radio>
                    )
                }
            </Radio.Group>
        </Form.Item>
    )

}
export default Index;