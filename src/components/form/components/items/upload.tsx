import React from "react";
import { Form, Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
const { useState, useEffect, useRef } = React
import axios from 'axios';
interface formUpload {
    item: any,
    listIndex?: number[],
    fileList?: any[]
    config: any
}

const Index: React.FC<formUpload> = (props) => {
    /** 排课表纵向偏移量 */
    const UploadRef = useRef(null)
    const { item, listIndex, fileList, config }: any = {
        item: {},
        ...props
    }

    /** 文件上传数据 */
    const [file, setFile] = useState<any>({
        fileType: 'image',
        previewVisible: false,
        previewImage: '',
        fileList: []
    })

    useEffect(() => {
        // console.log("upload------------------", UploadRef.current.state.fileList)
        saveFileList(UploadRef.current.state.fileList)
    }, [item.value])


    function getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    /** 缓存fileList */
    const saveFileList = (files) => {
        let arr = files && files.length ? files : item.value
        console.log('缓存fileList', arr)
        arr && arr.length && arr.map((aitem, index) => {
            if (aitem.uid === undefined) {
                aitem.uid = index
            }
        })
        setFile({ ...file, fileList: arr ? [...arr] : [] })

    }

    /** 创建文件list */
    const createFileList = (files) => {
        // console.log('1111111111', files)
        let { fileList } = files
        let newFiles = [...fileList]
        //formList && 返回简易的数据
        if (listIndex && item.url) {
            newFiles = []
            fileList.map((item, index) => {


                item = {
                    uid: item.uid,
                    key: item.response && item.response.data.key || item.key || '',
                    url: item.response && item.response.url || item.url || ''
                }
                newFiles.push(item)
            })
        }
        // console.log('创建文件list--------------1', newFiles)
        return newFiles;
    }

    /** 关闭查看大图 */
    const handleCancel = () => {
        setFile({ ...file, previewVisible: false });
    }

    /** 查看大图 */
    const handlePreview = async picture => {
        console.log('查看大图', picture)
        let fileType = 'image'
        /** 如果是pdf */
        if ((picture && picture.type && picture.type.indexOf('pdf') !== -1) || (picture && picture.url && picture.url.indexOf('pdf') !== -1)) {
            window.open(picture.url || picture.response.url)
            return
        }
        /** 如果是图片 */
        if (!picture.url && !picture.preview) {
            picture.preview = await getBase64(picture.originFileObj);
        }

        /** 如果是视频 */
        if ((picture && picture.type && picture.type.indexOf('mp4') !== -1) || (picture && picture.url && picture.url.indexOf('mp4') !== -1)) {
            fileType = 'video'
        }

        setFile({
            ...file,
            previewImage: picture.url || picture.preview,
            previewVisible: true,
            fileType
        });
    };

    /** 修改图片list */
    const handleChange = ({ fileList }) => {
        let newList: any = [...fileList]
        console.log('修改图片list--------------2', newList)
        setFile({ ...file, fileList: newList })
    }


    /** 图片上传前 */
    const beforeUpload = (newFile, fileList): Promise<any> => {
        let next = true
        // console.log('图片上传前----------------', fileList, file.fileList)
        //如果总数超过最大值 
        if (fileList.length + file.fileList.length > item.maxFileNum) {
            next = false
            message.warning({
                content: `总数量不能超过最大值${item.maxFileNum}`
            })

        }
        return new Promise((resolve, reject) => {
            if (next) {
                resolve(fileList)
            } else {
                reject()
            }
        })
    }

    //图片上传
    const customRequest = (detail: any) => {
        config.GetToken({ fileName: detail.file.name }).then((file: any) => {
            console.log(file.data.data, 'token')
            let data = new FormData()
            data.append('token', file.data.data.token)
            data.append('key', file.data.data.key)
            data.append('file', detail.file)
            axios({
                method: 'POST',
                url: detail.action,
                data
            }).then(res => {
                let newFile = { ...res, url: file.data.data.url }
                // console.log('图片上传------------', newFile)
                // console.log('图片上传------------', detail)
                // console.log('图片上传------------file.data.data.url', file)
                detail.onSuccess(newFile, detail.file)
            }).catch(err => {
                detail.onError("上传失败")
            })
        })
    }
    //图片删除
    const onRemove = (detail: any) => {
        console.log('图片删除', detail)
        config.DeleteFile({ key: detail.key || detail.response.data.key }).then(res => {
            return Promise.resolve(true)
        })
    }

    /** 转换文件数据 */
    const transformFile = (files) => {
        console.log('转换文件数据--------', files, file.fileList)
        // return files
    }


    /** 自定义预览逻辑 */
    const PreviewFile = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            // console.log('--------------', reader)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error);
        })
    }

    return (
        <>
            <Form.Item
                name={listIndex ? [...listIndex, item.name] : item.name}
                label={item.label}
                rules={[{
                    required: item.required === false ? false : true,
                    message: item.errMessage ? item.errMessage : `请选择${item.label}！`,
                },
                ]}
                valuePropName={"fileList"}
                getValueFromEvent={createFileList}
            // extra="longgggggggggggggggggggggggggggggggggg"
            >
                <Upload
                    ref={UploadRef}
                    disabled={item.disabled}
                    name={item.name}
                    action={config.CloudUrl}
                    multiple
                    listType='picture-card'
                    onPreview={handlePreview}
                    onChange={handleChange}
                    customRequest={customRequest}
                    previewFile={async (file): Promise<any> => PreviewFile(file)}
                    // onRemove={onRemove}
                    accept={item.accept ? item.accept : 'image/*,.jpg,.png,.jpeg,.pdf'}
                    beforeUpload={beforeUpload}
                >
                    {
                        file.fileList.length >= item.maxFileNum ? null : (
                            !item.disabled && <div>
                                <PlusOutlined />
                                <p>{item.uploadText}</p>
                            </div>
                        )
                    }

                </Upload>

            </Form.Item>
            {
                item.title && <p className="upload__title">{item.title}</p>
            }
            {/* 图片放大查看 */}
            <Modal
                width={1000}
                visible={file.previewVisible}
                closable={true}
                cancelText="关闭"
                okText='确认'
                onCancel={handleCancel}
                onOk={handleCancel}
            >
                {/* 图片 */}
                {
                    file.fileType === 'image' && <img alt="example" style={{ width: '100%' }} src={file.previewImage} />
                }
                {/* 视频 */}
                {
                    file.fileType === 'video' && <video controls autoPlay style={{ width: '100%' }} src={file.previewImage}></video>
                }
            </Modal>
        </>
    )
}
export default Index;