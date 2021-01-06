import React from "react";
import { NoValue } from '../utils/global-variable'
import { Form, Select, Input } from 'antd'

const { Option } = Select
const Index = (props) => {
    const { item, onChange, data, form, areaArr }: any = {
        item: {},
        ...props,
    }

    const area = [
        {
            name: 'province',
            text: '请选择省份'
        },
        {
            name: 'city',
            text: '请选择城市'
        },
        {
            name: 'district',
            text: '请选择地区'
        }
    ]

    return (
        <>
            {
                item.valueType === 'arr' ?
                    <>
                        {
                            item.visible !== false && item.label && <p className={'pb10 fz15'}>
                                <span className={`fcred`}>{item.required === false ? null : '*'}</span>
                                {item.label}
                            </p>
                        }
                        <div className="df jcsb ais">
                            {
                                area.map((child, index) => (
                                    <div className="w30" key={index}>
                                        <Form.Item
                                            name={[item.name, index]}
                                            style={{ width: "100%" }}
                                            rules={[{
                                                required: item.required === false ? false : true,
                                                message: item.errMessage ? item.errMessage : `${child.text}`,
                                            }]}
                                        >
                                            <Select disabled={item.disabled} placeholder={item.disabled ? NoValue : `请选择省份`} onChange={value => onChange({ name: child.name, value }, item.name)}>
                                                {
                                                    areaArr[child.name].length && areaArr[child.name].map((pitem, pindex) =>
                                                        <Option key={pindex} value={pitem.code}>{pitem.name}</Option>
                                                    )
                                                }

                                            </Select>
                                        </Form.Item>

                                    </div>
                                ))
                            }
                        </div>
                    </>
                    :
                    <Form.Item
                        // name={item.name}
                        // label={item.label}
                        wrapperCol={{
                            span: 24
                        }}
                    >
                        {
                            item.visible !== false && item.label && <p className={'pb10 fz15'}>
                                <span className={`fcred`}>{item.required === false ? null : '*'}</span>
                                {item.label}
                            </p>
                        }
                        <div className="df jcsb aic">
                            {/* 请选择省份 */}
                            <div className="w30">
                                <Form.Item
                                    shouldUpdate
                                    name="province"
                                    rules={[{
                                        required: item.required === false ? false : true,
                                        message: `请选择省份！`
                                    }]}
                                >
                                    <Select disabled={item.disabled} placeholder={item.disabled ? NoValue : `请选择省份`} onChange={value => onChange({ name: 'province', value }, form)}>
                                        {
                                            data.province.length && data.province.map((pitem, pindex) =>
                                                <Option key={pindex} value={pitem.code}>{pitem.name}</Option>
                                            )
                                        }

                                    </Select>
                                </Form.Item>
                            </div>
                            {/* 请选择城市 */}
                            <div className="w30">
                                <Form.Item
                                    shouldUpdate
                                    name="city"
                                    rules={[{
                                        required: item.required === false ? false : true,
                                        message: '请选择城市'
                                    }]}
                                >
                                    <Select disabled={item.disabled} placeholder={item.disabled ? NoValue : `请选择城市`} onChange={value => onChange({ name: 'city', value }, form)}>
                                        {
                                            data.city.length && data.city.map((citem, cindex) =>
                                                <Option key={cindex} value={citem.code}>{citem.name}</Option>
                                            )
                                        }

                                    </Select>
                                </Form.Item>
                            </div>
                            {/* 选择地区 */}
                            <div className="w30">
                                <Form.Item
                                    shouldUpdate
                                    name="district"
                                    rules={[{
                                        required: item.required === false ? false : true,
                                        message: '请选择地区'
                                    }]}
                                >
                                    <Select disabled={item.disabled} placeholder={item.disabled ? NoValue : `请选择地区`}>
                                        {
                                            data.district.length && data.district.map((ditem, dindex) =>
                                                <Option key={dindex} value={ditem.code}>{ditem.name}</Option>
                                            )
                                        }
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                    </Form.Item>
            }
        </>
    )
}
export default Index;


