import React from "react";
import { Form, Select } from 'antd'

import { ResetValue } from '../utils/index'
import { NoValue } from '../utils/global-variable'
const { Option } = Select
const { useState, useEffect } = React

interface formInput {
    item: any,
    listIndex?: any[],
    parentKey?: any[],
}

const Index: React.FC<formInput> = (props) => {
    const { item, listIndex, parentKey }: any = {
        item: {},
        ...props
    }

    const [state, setState] = useState({
        data: [],
        value: [],
        fetching: false,
    })


    useEffect(() => {
    }, [])

    // async (value) => {

    // }
    return (
        <Form.Item
            name={listIndex ? [...listIndex, item.name] : item.name}
            label={item.label}
            shouldUpdate
            rules={[{
                required: item.required === false ? false : true,
                message: item.errMessage ? item.errMessage : `请选择${item.label}！`,
            },
            ({ getFieldValue, setFieldsValue }) => ({

                validator(rule, value) {
                    //不能选择联动已有的数据
                    if (item.dependencies && getFieldValue(item.dependencies) && getFieldValue(item.dependencies).includes(value)) {
                        ResetValue(item.name, item.dependenciesText, item.value, setFieldsValue)
                    }
                    return Promise.resolve()
                },
            }),
            ]}
        >
            <Select
                showSearch
                mode={item.mode}
                disabled={item.disabled}
                allowClear
                placeholder={item.disabled ? NoValue : item.placeholder ? item.placeholder : `请选择${item.label}`}
                optionFilterProp="children"
                filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            // filterSort={(optionA, optionB) =>
            //     optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
            // }
            >
                {
                    item.options && item.options.length > 0 && item.options.map((sitem, sindex) =>
                        <Option key={sindex} value={sitem[item.valueKey]}>{sitem[item.nameKey]}</Option>
                    )
                }

            </Select>
        </Form.Item>


    )
}
export default Index;