import  React from "react";
import { Form, DatePicker } from 'antd'
const { RangePicker } = DatePicker;
import locale from 'antd/es/date-picker/locale/zh_CN';
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
            wrapperCol={{
                xs: { span: 16 },
                sm: { span: 24 },
            }}
        >
            <RangePicker disabled={item.disabled} locale={locale} format={'YYYY-MM-DD'} />
        </Form.Item>
    )
}
export default Index;