import  React from "react";
import { Form, Input, Button } from 'antd'
import {MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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
        <Form.List
            name={listIndex ? [...listIndex, item.name] : item.name}
        >
            {(fields, { add, remove }) => {
                return (
                    <div>
                        {
                            item.label && <p className="label">
                                {item.required !== false && <span className='fcred'>* </span>}
                                <span className="fwbd">{item.label}</span>
                            </p>
                        }
                        <div className="input__group__outer df jcs aic fw w100">
                            {fields && fields.length > 0 && fields.map((field, index) => (
                                <div key={index} className={'pr20 w25 psr df jcsb aic'} style={{ width: item.childWidth || '100%' }}>
                                    <Form.Item
                                        key={field.key}
                                        style={{ width: "100%" }}
                                    >
                                        <div className="df jcsb ais">
                                            <Form.Item
                                                {...field}
                                                validateTrigger={['onChange', 'onBlur']}
                                                rules={[{
                                                    required: item.required === false ? false : true,
                                                    message: item.errMessage ? item.errMessage : `请添加${item.label}`,
                                                    type: item.validateType,
                                                }]}
                                                style={{ width: "100%" }}
                                            >
                                                <Input disabled={item.disabled} placeholder={item.placeholder ? item.placeholder : `请添加${item.label}`} style={{ marginRight: 8 }} />
                                            </Form.Item>
                                            {fields.length ? (
                                                !item.disabled &&
                                                <div className="pt10 pl20">
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button fz18"
                                                        onClick={() => {
                                                            remove(field.name);
                                                        }}
                                                    />
                                                </div>
                                            ) : null}
                                        </div>
                                    </Form.Item>
                                </div>
                            ))}
                        </div>

                        {
                            !item.disabled && <Form.Item>
                                <Button
                                    type='primary'
                                    onClick={() => { add(); }}
                                    style={{ paddingLeft: '20px', paddingRight: '20px' }}
                                    icon={<PlusOutlined />}
                                >
                                    <span>{item.addText || '添加标签'}</span>
                                </Button>
                            </Form.Item>
                        }
                    </div>
                );
            }}
        </Form.List>
    )
}
export default Index;