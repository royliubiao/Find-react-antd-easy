import React from "react";
import { Form, InputNumber } from 'antd'
const { useEffect } = React

const Index = (props) => {
    const { item }: any = {
        item: {},
        ...props,
    }

    useEffect(() => {
        console.log('=======', item)
    }, [])

    return (
        <Form.Item
            shouldUpdate
            label={item.label}
            name={item.name}
            rules={[{
                required: item.required === false ? false : true,
                message: item.errMessage ? item.errMessage : `请输入${item.label}！`,
                type: item.validateType,
            }]}
        >
            <div>
                <div className='row_wrapper jcsb'>
                    {
                        item.options.map((e, index) =>
                            <div className='p10' style={{ width: '50%' }} key={index}>
                                <div className='middle_wrapper pb10' >
                                    <p>{e.rowTitle}</p>
                                </div>
                                {
                                    e.ary.map((row, indexR) =>
                                        <Form.Item
                                            key={row.name}
                                            name={row.name}
                                            rules={[{
                                                required: true,// row.required === false ? false : true,
                                                message: '请再输入一次值'
                                            }]}
                                        >
                                            <div className='pb10' key={indexR}>
                                                <InputNumber min={0} max={1} step={0.01} style={{ width: '100%' }}
                                                    placeholder={row.placeholder ? row.placeholder : '请输入'}
                                                    defaultValue={row.value} />
                                            </div>
                                        </Form.Item>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </Form.Item>
    )
}
export default Index;