import React from "react";
import {
  Form,
  Button,
  Row,
  Col,
} from 'antd';
import {
  FormInput,
  FormPassWord,
  ConfirmFormPassWord,
  FormNumber,
  FormTag,
  FormPhone,
  FormTextArea,
  FormSelect,
  FormMultiple,
  FormCascader,
  FormRadio,
  FormCheckBox,
  FormDate,
  FormUpload,
  FormDatePicker,
  FormTimePicker,
  ListBox,
  TopTitle,
  NumberInput,
  FormList,
  FormEdit,
  FormSwitch,
  FormTreeSelect
} from '../index'
import { onlineForm, formItem } from '../../type'
const { useEffect, useState, memo, useMemo, useRef } = React

type CreateForm = onlineForm & {
  onlineForm,
  created: boolean
  formName: string
  fields: any
  form: any
  area: {
    province: any[],
    city: any[],
    district: any[],
  }
  onFinish: () => void
  onFinishFailed: () => void
  onValuesChange: () => void
  onReset: () => void
  AreaChange: () => void
  itemvisibles: { [name: string]: boolean }

}

const Index = (props) => {
  let {
    items,
    formName,
    fields,
    onFinish,
    onFinishFailed,
    onValuesChange,
    itemvisibles,
    aline,
    hiddeCancel,
    onReset,
    cancelText,
    hiddeSubmit,
    submitText,
    form,
    readOnly,
    config
  } = props

  useEffect(() => {
    // console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶-itemvisibles', itemvisibles)
    // console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶-items', items)
    // console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶-getFields', readOnly)
    GetFormParent()
  }, [itemvisibles, fields, items])

  /** useRef */
  const FormContainer = useRef(null)
  /** 表单 */
  const formItems = useMemo(() => items, [items])
  /** 表单值 */
  const getFields = useMemo(() => fields, [fields])
  /** 显示组件 */
  const visibles = useMemo(() => itemvisibles, [itemvisibles])

  /** 是否外层包裹着modal组件 */
  const [isModal, setModal] = useState(false)


  /** 获取form父级容器信息 */
  const GetFormParent = () => {
    let parentClassName = FormContainer.current.offsetParent.className
    /** 如果父级是modal */
    if (parentClassName.indexOf('modal__component') !== -1) {
      setModal(true)
    }
    console.log('🌶🌶🌶🌶🌶🌶🌶🌶🌶-获取form父级容器信息', FormContainer.current.offsetParent.className);
  }

  return (
    <div
      className="onlne__form"
      ref={FormContainer}
    >
      {
        formItems && formItems.length > 0 &&
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          layout={'vertical'}
          form={form}
          labelAlign='left'
          name={formName}
          fields={getFields}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          scrollToFirstError={true}
          onValuesChange={onValuesChange}
        >
          <Row
            // className="df jcsb ais fw"
            gutter={[30, 0]}
          >
            {
              formItems.map((item, index) =>

                visibles[item.name] && <Col
                  // className={`
                  //   ${(item.aline || aline) ? 'w100' : 'w50'}  
                  //   ${item.hidden && 'item_hidden'}
                  // `}
                  // span={item.type === 'toptitle' ? 24 : 12}
                  key={index}
                  sm={item.hidden ? 0 : 24}
                  xl={item.hidden ? 0 : (item.type === 'toptitle' || item.aline || aline) ? 24 : 12}
                  xxl={item.hidden ? 0 : (item.type === 'toptitle' || item.aline || aline) ? 20 : isModal ? 12 : 5}
                >

                  {/* input */}
                  {item.type === 'input' && <FormInput item={item}></FormInput>}
                  {/* password */}
                  {item.type === 'password' && <FormPassWord item={item}></FormPassWord>}
                  {/* 确认密码 */}
                  {item.type === 'confirm' && <ConfirmFormPassWord item={item}></ConfirmFormPassWord>}
                  {/*  数字*/}
                  {item.type === 'number' && <FormNumber item={item}></FormNumber>}
                  {/* 标签 */}
                  {item.type === 'tag' && <FormTag item={item}></FormTag>}
                  {/*  电话 */}
                  {item.type === 'phone' && <FormPhone item={item}></FormPhone>}
                  {/* 文本域 */}
                  {item.type === 'textarea' && <FormTextArea item={item}></FormTextArea>}
                  {/* 下拉选择框 */}
                  {item.type === 'select' && <FormSelect item={item}></FormSelect>}
                  {/* 地区选择 */}
                  {/* {item.type === 'area' && <FormArea areaArr={areaArr} item={item} data={area} onChange={AreaChange}></FormArea>} */}
                  {/* 下拉选择框 多选择框*/}
                  {item.type === 'multiple' && <FormMultiple item={item}></FormMultiple>}
                  {/* 联级选择框 */}
                  {item.type === 'cascader' && <FormCascader item={item}></FormCascader>}
                  {/* 单选 */}
                  {item.type === 'radio' && <FormRadio item={item}></FormRadio>}
                  {/* 多选 */}
                  {item.type === 'checkbox' && <FormCheckBox item={item}></FormCheckBox>}
                  {/* 切换开关 */}
                  {item.type === 'switch' && <FormSwitch item={item}></FormSwitch>}
                  {/* 时间选择器 */}
                  {item.type === 'date' && <FormDate item={item}></FormDate>}
                  {/* 上传文件 */}
                  {item.type === 'upload' && <FormUpload item={item} config={config}></FormUpload>}
                  {/* 选择日期段 */}
                  {item.type === 'datePicker' && <FormDatePicker item={item}></FormDatePicker>}
                  {/* 选择日期段 */}
                  {item.type === 'timePicker' && <FormTimePicker item={item}></FormTimePicker>}
                  {/* 表格 */}
                  {item.type === 'listbox' && <ListBox item={item}></ListBox>}
                  {/* 标题 */}
                  {item.type === 'toptitle' && <TopTitle item={item}></TopTitle>}
                  {/* 数字输入 */}
                  {item.type === 'numberinput' && <NumberInput item={item}></NumberInput>}
                  {/*  如果是formList */}
                  {item.type === 'formList' && <FormList config={config} readOnly={readOnly} parentValue={item.value} item={item}></FormList>}
                  {/* 如果是富文本编辑器 */}
                  {item.type === 'edit' && <FormEdit item={item} config={config}></FormEdit>}
                  {/* 自定义组件 */}
                  {item.type === 'component' && item.component()}
                  {/* 树形选择框 */}
                  {item.type === 'treeselect' && <FormTreeSelect item={item}></FormTreeSelect>}
                </Col>
              )
            }
          </Row>

          {/* <Form.Item> */}
          <div className="df aic jcc w100 pt30">
            {
              !hiddeCancel &&
              <div className='pr20'>
                <Button type="default" htmlType="button" onClick={onReset}>
                  {cancelText}
                </Button>
              </div>
            }
            {
              !hiddeSubmit && < Button type="primary" htmlType="submit">
                {submitText}
              </Button>
            }
          </div>
        </Form>
      }
      <div>
      </div>
    </div >
  )
}
export default memo(Index);