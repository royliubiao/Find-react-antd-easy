
import  React from "react";
import { Form, TimePicker } from 'antd'
const { RangePicker } = TimePicker;
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
            <RangePicker
                disabled={item.disabled}
                locale={locale}
                format={'HH:mm:ss'}
                minuteStep={item.minuteStep || 1}
                secondStep={item.secondStep || 1}
            />
        </Form.Item>
    )
}
export default Index;