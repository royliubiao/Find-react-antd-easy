import  React from "react";
import { Form, DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/zh_CN';
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
        <Form.Item
            shouldUpdate
            label={item.label}
            name={listIndex ? [...listIndex, item.name] : item.name}
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
            <DatePicker
                showTime={item.showTime ? { format: 'YYYY-MM-DD HH:mm:ss' } : false}
                disabled={item.disabled}
                locale={locale}
                format={item.showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'}
                disabledDate={item.disabledDate}
            />
        </Form.Item>
    )
}
export default Index;