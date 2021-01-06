import React from "react";
import { Form } from 'antd'
import BraftEditor from 'braft-editor';
// import 'braft-editor/dist/index.css';
import axios from 'axios';
import Validate from '../utils/validate';
const Index = (props) => {
    const { item, config } = props
    const controls: any[] = ['bold', 'italic', 'underline', 'separator', 'link', 'separator', 'media']
    /**-----------富文本分割线以下------------**/
    //上传媒体文件
    const mediaUploadFn = (value: any) => {
        console.log(value, '----')
        config.GetPublicToken({ fileName: value.file.name }).then(res => {
            console.log(res, 'GetPublicToken')
            if (res.data.code === 0) {
                let data = new FormData()
                data.append('token', res.data.data.token)
                data.append('key', res.data.data.key)
                data.append('file', value.file)
                axios({
                    method: 'POST',
                    url: config.CloudUrl,
                    data
                }).then(success => {
                    console.log(res.data.data.url, 'res.data.data.url')
                    value.success({
                        url: res.data.data.url
                    })
                }).catch(err => {
                    value.error()
                })
            } else {
                value.error()
            }
        })
    }
    // //媒体库文件改变 暂时不需要
    // const mediachange = (value: any) => {
    //     console.log(value, '--mediachange--')
    // }
    // //从媒体库中插入文本 暂时不需要
    // const mediaOnInsert = (value: any) => {
    //     console.log(value, '=======')
    // }
    // //删除文本 暂时不需要
    // const onDelete = (value: any) => {
    //     console.log(value.toHTML(), 'onDelete')
    // }
    /**-----------富文本分割线以上------------**/

    return (
        <Form.Item
            // {...{ wrapperCol: { span: 14 } }}
            name={item.name}
            label={item.label}
            validateTrigger="onBlur"
            rules={[{
                required: item.required === false ? false : true,
                message: item.errMessage ? item.errMessage : `请选择${item.label}！`,
                validator: async (_, value, callback) => Validate.edit(value, item.required)
            }]}
        // wrapperCol={{ span: 23 }}
        >
            <BraftEditor
                readOnly={item.disabled}
                // onDelete={onDelete}
                media={{
                    // onChange:mediachange, 
                    uploadFn: mediaUploadFn,
                    // onInsert:mediaOnInsert,
                    externals: { image: false, audio: false, video: false, embed: false },
                    accepts: { video: 'video/mp4', audio: false },
                    pasteImage: false
                }}
                className="editor-wrapper"
                controls={item.viewType === 'check' ? [] : controls}
                contentStyle={{ height: 360, border: '1px solid #dcdcdc' }}
            />
        </Form.Item>
    )
}
export default Index;