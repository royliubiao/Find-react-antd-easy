import  React from "react";
import { Form, Input } from 'antd'
import Validate from '../utils/validate';
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
    <Form.Item
      shouldUpdate
      label={item.label}
      name={listIndex ? [...listIndex, item.name] : item.name}
      rules={[
        {
          required: item.required === false ? false : true,
          message: item.errMessage ? item.errMessage : `请输入${item.label}！`,
          validator: async (rule, value) => Validate.phone(value, item),
        },
      ]}
    >
      <Input
        allowClear
        disabled={item.disabled}
        placeholder={item.disabled ? NoValue : item.placeholder ? item.placeholder : `请输入${item.label}`}
        maxLength={item.maxLength || 10000}
      />
    </Form.Item>
  )
}
export default Index;