import  React from "react";
import { ResetValue } from '../utils/index'
import { Form, TreeSelect } from 'antd'
const { useState } = React
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
        nameKey: item.nameKey || 'title',
        valueKey: item.valueKey || 'value',
        keyName: '',
        childrenKeyName: item.childrenKeyName || 'children'
    })

    const mapRowKey = (data) => {
        let dataList = [...data]
        const { nameKey, valueKey, childrenKeyName } = state
        dataList.map(item => {
            item.title = item[nameKey]
            item.value = item[valueKey]
            if (item[childrenKeyName] && item[childrenKeyName].length) {
                item.children = item[childrenKeyName]
                mapRowKey(item[childrenKeyName])
                // console.log('mapRowKey------------', item.children)
            }
            // console.log('11111111111', item)
        })
        return dataList
    }
    return (
        <Form.Item
            shouldUpdate
            name={listIndex ? [...listIndex, item.name] : item.name}
            label={item.label}
            rules={[{
                required: item.required === false ? false : true,
                message: item.errMessage ? item.errMessage : `请选择${item.label}！`,
            },
            ({ getFieldValue, setFieldsValue }) => ({
                validator(rule, value) {
                    let mess = ''
                    //不能选择联动已有的数据
                    if (item.dependencies && getFieldValue(item.dependencies).includes(value)) {
                        console.log('select')
                        let values = getFieldValue(item.dependencies).filter(fitem => fitem !== value)
                        ResetValue(item.dependencies, '', values, setFieldsValue)
                    }
                    return Promise.resolve()
                },
            }),
            ]}
        >


            <TreeSelect
                // treeDataSimpleMode={false}
                disabled={item.disabled}
                allowClear
                multiple={item.isMultiple}
                showSearch={item.isShowSearch}
                style={{ width: item.width || '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder={item.disabled ? '' : item.placeholder ? item.placeholder : `请输入${item.label}`}
                treeData={item.options && item.options.length > 0 && mapRowKey(item.options)}
            />

        </Form.Item>


    )
}
export default Index;