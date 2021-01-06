import  React from "react";
import { Form, Checkbox, Row, Col } from 'antd'

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
        <>
            {
                item.options && Array.isArray(item.options) ? <Form.Item
                    shouldUpdate
                    wrapperCol={{
                        span: 24
                    }}
                    name={listIndex ? [...listIndex, item.name] : item.name}
                    label={item.label}
                    rules={[
                        {
                            required: item.required === false ? false : true,
                            message: item.errMessage ? item.errMessage : `请选择${item.label}！`
                        },
                    ]}
                >
                    <Checkbox.Group style={{ width: '100%' }}>
                        <Row>
                            {
                                item.options && item.options.map((citem, cindex) =>
                                    <Col key={cindex} span={item.colWidth}>
                                        <Checkbox disabled={item.disabled} value={citem[item.valueKey]}>{citem[item.nameKey]}</Checkbox>
                                    </Col>
                                )
                            }
                        </Row>
                    </Checkbox.Group>

                </Form.Item> : <Form.Item
                    wrapperCol={{
                        span: 24
                    }}
                    name={listIndex ? [...listIndex, item.name] : item.name}
                    label={item.label}
                    rules={[
                        {
                            required: item.required === false ? false : true,
                            message: item.errMessage ? item.errMessage : `请选择${item.label}！`
                        },
                    ]}
                    valuePropName="checked"
                >
                        {/* //如果是单个 */}
                        <Checkbox disabled={item.disabled} >{item.options[item.nameKey]}</Checkbox>

                    </Form.Item>
            }
        </>



    )
}
export default Index;