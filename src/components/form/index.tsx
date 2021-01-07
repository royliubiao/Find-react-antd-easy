import React, { FC } from "react";
import './index.css'
import {
  Form,
  message
} from 'antd';
import {
  CreateForm
} from './components/index'
import moment from 'moment';
import { useDebouncedCallback } from 'use-debounce';
import { onlineForm, formItem } from './type'
import BraftEditor from 'braft-editor';
import { CreateFormConfig } from '../../utils'

const { useState, useEffect } = React

const Index: React.FC<onlineForm> = (props) => {
  const [form] = Form.useForm();
  /** props---------------------------------- */
  const {
    readOnly,
    values,
    items,
    aline,
    submitText,
    onSubmit,
    cancelText,
    onCancel,
    layout,
    formName,
    hiddeCancel,
    hiddeSubmit,
    targetDatas,
    onChange } =
  {
    readOnly: false,
    values: null,
    aline: false,
    submitText: '提交',
    cancelText: '重置',
    layout: {
      labelCol: { span: 16 },
      wrapperCol: { span: 16 },
    },
    ...props
  }

  //所有变化的数据

  const [state, setState] = useState({
    initialValues: {},
    fields: [],
    created: false,
    form: null,
    items: []
  })
  /** 地区 */
  const [area, setArea] = useState({
    province: [],
    city: [],
    district: [],
  })

  /** 地区值如果是数组 */
  const [areaArr, setAreaArr] = useState({
    province: [],
    city: [],
    district: [],
  })

  /**  check 查看是否有该用户 */
  const [checkPhoneNumber, setCheck] = useState<any>(null)

  /** items */
  const [formItems, setFormItems] = useState([])

  /** 所有依赖项 */
  const [relyOns, setRelyOn] = useState({})
  /** 所有item的显示控制 */
  const [itemvisibles, setvisible] = useState({})

  /** 需要过滤的item */
  const [filterNames, setFilterName] = useState([])

  /** 收集回调 */
  const [effects, setEffects] = useState(new Map())

  /** 回调的数据 */
  const [effectData, setEffectData] = useState<any>(new Map())

  /** 需要关联操作的action */
  const [actions, setActions] = useState<any>({})

  /** debounce的时间 */
  const [deley, setDeley] = useState(0)

  /** formConfig */
  const [config, setConfig] = useState<any>({
    /** 所有api接口 */
    Api: null,
    /** 获取token */
    GetToken: null,
    /** 获取富文本token */
    GetPublicToken: null,
    /** 云服务器地址 如七牛云 */
    CloudUrl: '',
  })


  useEffect(() => {
    //** 过滤默认数据 */
    createDefaultValue()
  }, [items, readOnly, values])



  /** 过滤默认数据 */
  const createDefaultValue = async () => {
    let newItems = []
    let fields = [] //表单默认值
    let filterNames = []
    let visibles = {} // 所有item显示
    let allRelyOn: any = {} //所有依赖项集合
    let areaValue = [ // 地区默认值
      { name: 'province', value: '' },
      { name: 'city', value: '' },
      { name: 'district', value: '' }
    ]
    let effect = new Map()
    let actions = {} //关联的操作
    let isAsync = false
    let hasCheck = false //是否要通过手机号查询
    let checkPhoneItem = null
    let FindConfig = null

    /** 获取config */
    if (CreateFormConfig.use()) { //如果有值
      console.log('获取config-------------', CreateFormConfig.use())
      FindConfig = CreateFormConfig.use()
    }

    items && items.forEach(async (item: formItem) => {

      /**
       * 如果是只读  || 如果是隐藏项
       * */
      if (readOnly || item.hidden) {
        item.disabled = true
        item.required = false
      }
      /** 如果是有值的 */
      if (values && values[item.name]) {
        // console.log('如果是有值的--------------,', values)
        item.value = values[item.name]
      }
      /** check */
      if (item.check) {
        //如果有手机号就是编辑
        // console.log('如果有手机号就是编辑',item)
        if (item.value) {
          checkPhoneItem = {
            value: item.value,
            ...item.check
          }
        } else {
          hasCheck = true
          setCheck({
            ...checkPhoneNumber,
            [item.name]: { ...item.check }
          })
        }
      }
      /** 除了手机号以外*/
      if (hasCheck && item && !item.check) {
        item.disabled = true
      }


      /** 如果有地区选择 */
      if (item.type === 'area') {
        //如果值是少数组形式的
        if (item.valueType === 'arr') {
          fields.push({ name: item.name, value: item.value })
        } else {
          //如果有值
          if (values && values['province'] && values['city'] && values['district']) {
            item.value = [ // 地区默认值
              { name: 'province', value: { code: values['province'] } },
              { name: 'city', value: { code: values['city'] } },
              { name: 'district', value: { code: values['district'] } }
            ]
          }

          item.value && item.value.length && item.value.forEach(async (aitem) => {
            fields.push({ name: aitem.name, value: aitem.value.code })
          })

          if (!item.value || !item.value.length) {
            item.value = areaValue
          }

          getArea(item)
          // if (item.state !== 'edit' && !items.find(item => item.check)) {
          //   getArea(item)
          // }
        }





      }
      /** 设置默认数据 */
      if (item.value && item.type !== 'area') {
        /** 如果是日期组件 */
        if (item.type === 'date') {
          item.value = item.value === '0000-00-00' ? '' : moment(item.value, 'YYYY-MM-DD')
        }

        /** 如果是datePicker组件 */
        if (item.type === 'datePicker') {
          //如果有值
          if (item.value) {
            item.value = [
              moment(item.value.startTime, 'YYYY-MM-DD'),
              moment(item.value.endTime, 'YYYY-MM-DD'),
            ]
          }
        }

        /** 如果是富文本编辑器 */
        if (item.type === 'edit') {
          item.value = BraftEditor.createEditorState(item.value)
        }
        /** 如果是formList && childType = checkbox */
        if (item.value && item.childType === 'checkbox' && item.filter) {
          let checkValues = [];
          item.value.map((vitem) => {
            let childValue = []
            vitem.map((cvitem, cvindex) => {
              /** 如果是勾选 */
              if (cvitem) {
                childValue.push(item.filter.entry[cvindex])
              } else {
                childValue.push('')
              }
            })
            checkValues.push(childValue)
          })
          item.value = checkValues
          // fields.push({ name: item.name, value: checkValues })
          // console.log('过滤默认数据🍺🍺🍺', checkValues)
        }

        /** 如果是upload在formList里面 */
        if (item.type === 'formList' && item.value && item.value.length && item.addUidName && item.addUidName.length) {
          item.addUidName.map((aitem) => {
            item.value.map((vitem) => {
              vitem[aitem].map((uitem, uindex) => {
                uitem.uid = uindex
              })
            })
          })

        }

        /** 如果是upload */
        if (item.type === 'upload') {

          if (item.value) {
            //如果值是字符串
            if (typeof item.value === 'string') {
              item.value = [
                {
                  url: item.value,
                  key: item.value,
                  uid: item.value
                }
              ]
            } else {
              item.value.length && item.value.map((file, fileIndex) => {
                if (file.uid === undefined) {
                  file.uid = fileIndex
                }
              })
            }

          } else {

            item.value = null
          }

        }
      }

      //设置默认值
      if (item.value === 0 || item.value === false || item.value) {
        // console.log('设置默认值-------------', item)
        fields.push({
          name: item.name,
          value: item.value
        })
      }
      /** 
       * 生成依赖项集合
       * @desc  name(暂时隐藏的item名) 依赖 item.relyOn.name(被依赖项) 的value
       */
      if (item.relyOn) {
        let relyOnName = Array.isArray(item.relyOn.name) ? item.relyOn.name[0] : item.relyOn.name
        let relyOnItem = items.find(aitem => aitem.name === relyOnName);
        /** 
           * 如果有 valueKey
           * @desc 依赖项有options和value
           * */
        if (item.relyOn.childName &&
          relyOnItem.options &&
          relyOnItem.options.length &&
          relyOnItem.value &&
          relyOnItem.value.length) {
          let { valueKey, childName } = item.relyOn
          let id = relyOnItem.value[0][childName]
          let selectItem = relyOnItem.options.find(oitem => oitem[childName] === id);
          if (item.relyOn.value === selectItem[valueKey]) {
            visibles[item.name] = true
          }
        }
        /** 如果有options */
        else if (item.relyOn.valueKey) {
          let { idKey, valueKey, value } = item.relyOn
          /** 被依赖项optionsitem 中的value值等于需要依赖项的值对应的那一条 */
          let select = relyOnItem.options && relyOnItem.options.length && relyOnItem.options.find(ritem => ritem[idKey] === relyOnItem.value)
          // console.log('如果有options', item.name, relyOnItem, select)
          /** 如果id对应的key值等于默认值 */
          if (select && value.includes(select[valueKey])) {
            visibles[item.name] = true
          }
          //不重复添加
          filterNames.indexOf(item.name[0]) && filterNames.push(item.name[0])
        } else {
          //如果依赖项的默认值等于需要依赖项的需要值
          // console.log('如果依赖项的默认值等于需要依赖项的需要值', item)
          if (
            //不是布尔值
            (typeof item.relyOn.value !== 'boolean' && fields.find(field => field.name === item.relyOn.name && item.relyOn.value.includes(field.value))) ||
            ((item.relyOn.value === '' || item.relyOn.value == null) && fields.find(field => field.name === item.relyOn.name && field.value) ||
              (typeof item.relyOn.value === 'boolean' && fields.find(field => field.name === item.relyOn.name && item.relyOn.value === field.value)) ||
              (Array.isArray(relyOnItem.value) && relyOnItem.value.includes(item.relyOn.value)) //当item是数组的时候
            )
          ) {
            visibles[item.name] = true
          }
        }
        /** 暂存所有可联动的模板 */
        allRelyOn[relyOnName] = {
          ...allRelyOn[relyOnName],
          [item.name]: {
            ...item.relyOn,
            name: item.name
          }
        }
      }
      else {
        if (item.visible !== false) {
          visibles[item.name] = true
        }
      }


      /** 如果有action */
      if (item.actions && item.actions.length > 0) {
        let name = Array.isArray(item.name) ? item.name[0] : item.name
        actions[name] = [...item.actions]
      }


      /** 如果有effect */
      if (item.effect && FindConfig) {
        let params = Object.entries(item.effect.effectParams)
        let relyNum = params.length
        let newParams = {} //回调接口需要的参数
        let effectDataName = null

        isAsync = true
        newItems.push(new Promise(async (resolve) => {

          //如果有需要依赖的值
          if (params.length) {
            params.map(async (pitem: any) => {
              // let effectName = ''
              let relyItem = items.find(relyItem => relyItem.name === pitem[1].relyName && relyItem.value) || state.fields.find(field => field.name === pitem[1].relyName && field.value)
              /** 如果依赖项都有值 */
              if (relyItem) {
                newParams[pitem[0]] = relyItem.value
                // effectName = pitem[1].relyName
              }

              let sameEffect = []
              /** 判断是否有一样的依赖 */
              if (effect.get(pitem[1].relyName)) {
                sameEffect = [...effect.get(pitem[1].relyName)]

              }
              sameEffect.push({ ...item.effect, target: item.name, effectKey: pitem[0] })
              // effect.set(pitem[1].relyName, [{ ...item.effect, target: item.name, effectKey: pitem[0] }]}) //缓存需要异步的参数
              effect.set(pitem[1].relyName, [...sameEffect]) //缓存需要异步的参数
              // console.log('如果有effect', item.name, relyItem)
            })
          }



          effectDataName = Object.values(newParams).length ? newParams : item.effect.effectName
          /** 如果所依赖项都是有值的 执行effect */
          if (Object.entries(newParams).length === relyNum && !effectData.has(JSON.stringify(newParams))) {
            newParams = { ...newParams, ...item.effect.defaultParams }

            const data = await FindConfig.Api[item.effect.effectName](newParams)
            //如果有res值字段
            item.options = item.effect.resName ? data[item.effect.resName] : data
            console.log('如果所依赖项都是有值的 执行effect', data)
            /** 存储获取到的数据 */
            setEffectData(effectData.set(JSON.stringify(effectDataName), item.options))
          } else {
            //如果有异步缓存下的数据
            let data = effectData.get(JSON.stringify(effectDataName));
            item.options = data
          }
          resolve(item)
        }))
      } else {
        item && newItems.push(item)
      }
    })


    // debugger
    //如果有执行异步方法
    if (isAsync) {
      Promise.all(newItems).then(res => {
        setvisible(visibles)
        setState({ ...state, created: true, fields: [...fields] })
        setRelyOn(allRelyOn)
        setFormItems(res)
        setFilterName(filterNames)
        setEffects(effect)
        setActions(actions)
        setConfig({ ...config, ...FindConfig })
      })
    } else {
      setvisible(visibles)
      setState({ ...state, created: true, fields: [...fields] })
      setRelyOn(allRelyOn)
      setFormItems(newItems)
      setFilterName(filterNames)
      setEffects(effect)
      setActions(actions)
      setConfig({ ...config, ...FindConfig })
    }


    //如果是查看详情
    if (checkPhoneItem && FindConfig) {
      return RunCheck(checkPhoneItem.value, FindConfig, checkPhoneItem, visibles, effect, actions)
    }

    console.log('初始化formItems🍺🍺🍺🍺🍺🍺🍺', newItems, fields, visibles)

  }


  /** 重置表单 */
  const onReset = () => {
    // const values = state.initialValues
    form.resetFields();
    onCancel && onCancel(false)
  };

  /** Form验证通过的回调 */
  const onFinish = fieldsValue => {
    let isUpload = true
    let values = { ...fieldsValue }
    /** formList过滤gourp的空对象 */
    filterNames.map((item) => {
      if (values[item]) {
        let filterVlaue = values[item];
        let groupValue = filterVlaue.filter(citem => citem)[0]
        let newGroupValue: any = typeof groupValue === 'string' ? groupValue : []
        //groupValue必须是数组
        Array.isArray(groupValue) && groupValue.map((gitem: any) => {
          let newGitem: any = Object.entries(gitem);
          /** 过滤group里的key */
          newGitem.map((gcitem: any) => {
            if (Array.isArray(gcitem[1]) && gcitem[1].length === 1 && (gcitem[1][0].key || (gcitem[1][0].response && gcitem[1][0].response.data))) {
              gcitem[1] = gcitem[1][0].key || (gcitem[1][0].response && gcitem[1][0].response.data.key)
            }
            // console.log('过滤group里的key---------------', gcitem)
          })
          gitem = { ...Object.fromEntries(newGitem) }
          newGroupValue.push(gitem)
        })
        values = {
          ...values,
          [item]: newGroupValue,
        };

      }
    })


    items.map(item => {
      //如果有时间组件
      if (item.type === 'date') {
        //如果有值
        if (values[item.name]) {
          values = {
            ...values,
            [item.name]: item.showTime ? fieldsValue[item.name].format('YYYY-MM-DD HH:mm:ss') : fieldsValue[item.name].format('YYYY-MM-DD'),
          };
        }
      }

      /** 选择时间段 */
      if (item.type === 'timePicker') {
        let rangeTime = {
          startTime: fieldsValue[item.name][0].format('HH:mm:ss'),
          endTime: fieldsValue[item.name][1].format('HH:mm:ss')
        }
        values = {
          ...values,
          [item.name]: rangeTime,
        };
        // console.log('Received values of form: ', values);
      }

      /** 选择日期时间段 */
      if (item.type === 'datePicker') {
        let rangeTime = {
          startTime: fieldsValue[item.name][0] && fieldsValue[item.name][0].format('YYYY-MM-DD'),
          endTime: fieldsValue[item.name][1] && fieldsValue[item.name][1].format('YYYY-MM-DD')
        }
        values = {
          ...values,
          [item.name]: rangeTime,
        };
        // console.log('Received values of form: ', values);
      }

      /** 如果是富文本编辑器 */
      if (item.type === 'edit') {
        values = {
          ...values,
          [item.name]: fieldsValue[item.name].toHTML(),
        };
        // console.log('如果是富文本编辑器-------------- ', values);
      }
      /** 如果是图片上传 */
      if (item.type === 'upload' && config.Api) {
        //如果返回简易的url
        let newfiles = []
        let uploads = fieldsValue[item.name]

        if (!uploads || !uploads.length) {
          return
        }

        uploads.map(file => {
          //如果没有上传完毕
          if (!file.response) {
            return message.warning({
              content: '文件正在上传中~',
            })
          }

          newfiles.push({
            url: file.response.url,
            uid: file.uid,
            key: file.response.data.key
          })
        })

        //如果需要返回简易数据
        if (item.url) {
          uploads = newfiles
        }

        values = {
          ...values,
          [item.name]: uploads,
        };

        /** ------------------------------------- */

        if (item.uploadValueType === 'key') {
          let files: string[] = []
          uploads.map(vitem => {
            files.push((vitem.response && vitem.response.data.key) || vitem.key)
          })

          values = {
            ...values,
            [item.name]: files,
          };

        }

        // console.log('files--------', item.name, values)

        if (item.uploadValueType === 'string' && values[item.name].length === 1) {
          let key = values[item.name][0].response ? values[item.name][0].response.data.key : values[item.name][0] ? values[item.name][0].key : undefined
          // console.log('uploadValueType === ', key)
          // if (key.indexOf('http') !== -1) {
          //   key = undefined
          // }
          values = {
            ...values,
            [item.name]: key,
          };
        }

      }


      /** 如果有需要替换名字的 */
      if (item.itemName) {
        values = {
          // ...values,
          ...JSON.parse(JSON.stringify(values).replace(new RegExp(item.name, 'g'), item.itemName))
        };
      }

      //如果是formList && childType = checkbox
      // if (items.find(item => item.filter)) {
      //   let checkValues = []
      //   name = items.find(item => item.filter).name;
      //   let filter = items.find(item => item.filter).filter;
      //   console.log('如果是formList', name, filter, values[name])
      //   let { entry, submit } = filter
      //   values[name] && values[name].length && values[name].map((vitem, vindex) => {
      //     let childValue = [...submit]
      //     vitem.map((cvitem, cvindex) => {
      //       /** 如果是勾选 */
      //       cvitem && childValue.splice(entry.findIndex(fitem => fitem === cvitem), 1, true)
      //     })
      //     checkValues.push(childValue)
      //   })

      //   values = {
      //     ...values,
      //     [name]: checkValues,
      //   }
      // }

      /** 如果是formList并且有date组件 */
      if (item.type === 'formList' && item.hasDate) {
        let listValue = fieldsValue[item.name]
        listValue.map((litem, lindex) => {
          Object.entries(litem).map((vdate: any, vindex) => {
            //如果是时间
            if (vdate[1] && vdate[1]._d) {
              litem[vdate[0]] = vdate[1].format('YYYY-MM-DD')
              // console.log('如果是formList并且有date组件', vdate[1].format('YYYY-MM-DD'))
            }
            //如果是undefined
            if (vdate[1] === undefined || vdate[1] === '' || vdate[1] === null) {
              delete litem[vdate[0]]
            }
          })
        })
        // console.log('如果是formList并且有date组件', listValue)
      }

      /** 如果是非必填项就不传值 */
      if (item.required === false && values[item.name] === undefined) {
        delete values[item.name]
      }
      /** 如果需要空值 */
      if (item.needSpaceValue) {
        values = {
          ...values,
          [item.name]: '',
        };
      }
    })

    //如果正在上传
    if (!isUpload) {
      return message.warning({
        content: '文件正在上传中~',
      })
    }
    // return console.log('values--------------', values)

    onSubmit(values, formItems, state.fields)
  };


  /** Form提交时验证失败回调 */
  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };



  /** formItem关联显示 */
  const RelyOn = (relyOns, changeValue: any) => {
    let allvisibles = { ...itemvisibles };
    let change: any = Object.entries(changeValue)
    /** 如果当前改变对象有值 */
    if (change[0][1] !== null || change[0][1] !== undefined) {
      console.log('如果当前有值')
      /** 如果依赖项是formList 并且依赖其中的子属性值 */
      if (typeof change[0][1] === 'object' && Object.values(relyOns[change[0][0]])[0]['childName']) {
        let childName = Object.values(relyOns[change[0][0]])[0]['childName']
        change[0][1] = Object.values(change[0][1])[0][childName]
      }
      //需要依赖的数组
      let arr: any = [...Object.values(relyOns[change[0][0]])]
      //依赖项下的所有需要依赖项
      arr.filter(aitem => {
        // console.log('依赖项下的所以需要依赖项-------', aitem, change[0][1], items.find(item => item.name === change[0][0]).options.find(oitem => console.log('oitem-----', oitem)))
        let selectItem = aitem.valueKey ? items.find(item => item.name === change[0][0]).options.find(oitem => oitem[aitem.idKey] === change[0][1])[aitem.valueKey] : aitem.value //当前select选择的对应值
        aitem.changeValue = selectItem;
        // if (aitem.value === selectItem) {
        //   return aitem
        // }
        return aitem
      }).map(fitem => {
        console.log('Object.keys(allvisibles)-------------', fitem.value, change[0][1])
        //需要显示的itemName


        /** 如果需要显示的name是个数组 */
        if (Array.isArray(fitem.name)) {
          //如果依赖值等于当前被依赖值 显示
          if (fitem.changeValue === change[0][1]) {
            allvisibles[fitem.name] = true
          } else {
            delete allvisibles[fitem.name]
          }
        } else {
          /** 如果是布尔值 */
          if (typeof fitem.value === 'boolean') {
            if (fitem.value === change[0][1]) {
              allvisibles[fitem.name] = true
            } else {
              allvisibles[fitem.name] = false
            }
          } else {
            /** 如果值相等 */
            if (!Array.isArray(change[0][1]) && fitem.value.includes(change[0][1])) {
              console.log('如果值相等------------', 1)
              allvisibles[fitem.name] = true
            }
            else if (Array.isArray(change[0][1]) && change[0][1].includes(fitem.value)) {
              console.log('如果值相等------------', 2)
              allvisibles[fitem.name] = true
            }
            else {
              allvisibles[fitem.name] = false
            }
          }
          /** 如果没有固定值 */
          if (fitem.childName && fitem.value === fitem.changeValue) {
            // console.log('fitemfitemfitemfitemfitemfitem222', fitem)
            allvisibles[fitem.name] = true
          }

          /** 如果没有固定值 && 依赖项有值*/
          if ((fitem.value === '' || fitem.value == null) && change[0][1]) {
            allvisibles[fitem.name] = true
          }
        }
      })
    } else {
      console.log("如果当前没有值")
      allvisibles[Object.keys(relyOns[change[0][0]])[0]] = false
    }
    setvisible(allvisibles)
    console.log("allvisibles2----------------------", allvisibles)
  }

  //地区---------------------------------------------------------------------------------

  /** 获取地区 */
  const getArea = async (item) => {
    let allarea = {
      province: [],
      city: [],
      district: []
    };
    let codes = [];
    // console.log('获取地区', item)
    //如果是需要替换的
    if (item.valueType === 'arr') {
      codes = [...item.value]
    } else {
      item.value && item.value.length && item.value.forEach((aitem, aindex) => {
        /** 如果有省份默认值 */
        codes.push(aitem.value.code)
      })
    }
    // console.log("获取地区----------", item)
    await config.Api.GetProvinces({}).then(res => {
      allarea.province = res.data.data

    })
    //** 如果有默认值 */
    if (codes.length) {
      codes[0] && await config.Api.GetCitys({ code: codes[0] }).then(res => {
        allarea.city = res.data.data
        // console.log("如果有城市默认值----------", res.data.data)
      })
      // console.log("获取城市", e)
      codes[1] && await config.Api.GetDistricts({ code: codes[1] }).then(res => {
        allarea.district = res.data.data

      })
    }
    if (item.valueType === 'arr') {
      // console.log('11111111111', allarea)
      setAreaArr({ ...areaArr, ...allarea })
    } else {
      setArea({ ...area, ...allarea })
    }

  }


  /** 地区值修改 */
  const AreaChange = async (data, name = undefined) => {
    enum Direction {
      province,
      city,
      district
    }
    /** 如果是切换省份 */
    if (data.name === 'province') {
      const values = await getCitys(data, name)
      setFields(values, name, Direction[data.name])
      // console.log('province--------------------', values, data, state.fields)
    }
    /** 如果是切换城市 */
    if (data.name === 'city') {
      const values = await getDistrict(data, name)
      setFields(values, name, Direction[data.name])

    }
    // console.log('city--------------------', data, Direction[data.name])
  }

  /** 更新默认表单数据 */
  const setFields = (values, name, len) => {
    let data = []

    Object.entries(values).map((item: any, index) => {
      if (!name) {
        form.setFieldsValue({ [item[0]]: item[1] })
      }
      data.push(item[1])
    })

    //如果需要返回的数据是数组
    if (name) {
      let fieds = form.getFieldValue([name])
      if (len) {
        fieds.length = len
        data = [...fieds, ...data]
      }
      form.setFieldsValue({ [name]: data })
    }
  }

  /** 获取城市 */
  const getCitys = async (data, name) => {
    const citys = await config.Api.GetCitys({ code: data.value })
    const district = await config.Api.GetDistricts({ code: citys.data.data[0].code })
    //如果是值数组
    if (name) {
      setAreaArr({ ...areaArr, city: citys.data.data, district: district.data.data })
    } else {
      setArea({ ...area, city: citys.data.data, district: district.data.data })
    }



    return {
      [data.name]: data.value,
      city: citys.data.data[0].code,
      district: district.data.data[0].code
    }
  }

  /** 获取地区 */
  const getDistrict = async (data, name) => {
    const district = await config.Api.GetDistricts({ code: data.value })
    //如果值是数组
    if (name) {
      setAreaArr({ ...areaArr, district: district.data.data })
    } else {
      setArea({ ...area, district: district.data.data })
    }

    return {
      [data.name]: data.value,
      district: district.data.data[0].code
    }
  }

  /** Form监听value值的变化调 */
  const onValuesChange = (value, allValue) => {
    let change = Object.entries(value)
    //监听所有数据
    /** 控制显示item */
    relyOns[change[0][0]] && RelyOn(relyOns, value)
    /** 执行actions */
    actions[change[0][0]] && runActions(change, allValue)
    /** 执行check */
    checkPhoneNumber && checkPhoneNumber[change[0][0]] && config.Api && RunCheck(change, config)
    /** 执行effect */
    effects.get(change[0][0]) && runEffects(change)

    onChange && onChange(value, allValue)
    console.log('Form监听value值的变化', value, allValue)
  }

  /** 
   * 执行items中的effect
   */
  const runEffects = async (change, allEffect?, items?) => {
    let effectChilds = allEffect ? allEffect.get(change[0][0]) : effects.get(change[0][0]);
    //遍历同一个依赖的effect
    effectChilds.map(async (effect) => {
      let { defaultParams, effectName, effectParams, target, effectKey, resName } = effect
      let params = { ...defaultParams, [effectKey]: change[0][1] }
      let newItems = items ? [...items] : [...formItems]
      let newData = null
      //如果有值
      if (change[0][1]) {
        if (effectData.get(JSON.stringify(params))) { //如果缓存中已经有数据
          newData = effectData.get(JSON.stringify(params))
        } else {
          const data = await config.Api[effectName](params)
          // console.log('执行items中的effect', data)
          newData = resName ? data[resName] : data
        }
        newItems.find(item => {
          if (item.name === target) {
            item.options = newData
          }
        })
      }
      setFormItems(newItems)
      //如果是编辑状态下的
      if (!allEffect) {
        form.setFieldsValue({ [target]: [] })
      }
    })
  }
  /** 执行check */
  const RunCheck = async (value, FindConfig, checkApi?, visibles?, effect?, actions?,) => {
    alert(1)
    let phone = checkApi ? value : value[0][1]
    let fields = []
    let myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    let newItems = checkApi ? [...items] : [...formItems]
    let areaValue = [ // 地区默认值
      { name: 'province', value: { code: null } },
      { name: 'city', value: { code: null } },
      { name: 'district', value: { code: null } }
    ]
    let allvisibles = visibles ? { ...visibles } : { ...itemvisibles }
    //如果手机号验证通过
    if (myreg.test(phone) || (checkApi && value)) {
      let {
        api,
        paramKey,
        type,
        successMessage,
        errMessage,
        action,
        saveData,
        checkKeyToDisabled,
        closeModal,
        setValue,
      } = checkApi || checkPhoneNumber[value[0][0]] && checkPhoneNumber[value[0][0]]
      await FindConfig.Api[api]({
        [paramKey]: phone,
        callBack: async (res) => {

          let infos = res.data || {}

          // console.log('1111111111111111111111e', res)
          /** 如果人员已存在此商户下*/
          if (res.code === -1) {
            message.success({
              content: res.message,
              top: 100,
              duration: 1,
            })
            return false
          }


          //如果需要先执行action
          if (action && await action(infos) === false) {
            return false
          }
          /** 如果要缓存数据 */
          if (saveData) {
            await saveData(infos)
          }

          /** setValue */
          if (setValue) {
            let { name, value } = setValue(infos)
            newItems.map(item => {
              if (item.name === name) {
                item.value = value
              }
            })
            // console.log('check-setValue',setValue(infos))
          }
          // console.log('如果要缓存数据', infos)
          return Promise.all(
            infos && newItems.map(async (item) => {
              item.disabled = false
              //如果是编辑，手机号不能修改
              if (item.type === 'phone' && item.check) {
                if (checkApi) {
                  item.disabled = true
                } else {
                  fields.push({
                    name: item.name,
                    value: phone
                  })
                }
              }
              //如果是日期
              else if (item.type === 'date') {
                fields.push({
                  name: item.name,
                  value: infos[item.name] ? infos[item.name] === '0000-00-00' ? '' : moment(infos[item.name], 'YYYY-MM-DD') : ''
                })
              }
              //如果是datePicker
              else if (item.type === 'datePicker') {
                /** 如果是datePicker组件 */
                //如果有值
                if (item.value && item.value.length) {
                  fields.push({
                    name: item.name,
                    value: [
                      moment(item.value[0], 'YYYY-MM-DD'),
                      moment(item.value[1], 'YYYY-MM-DD'),
                    ]
                  })
                }
              }
              // 如果是富文本编辑器
              else if (item.type === 'edit') {
                fields.push({
                  name: item.name,
                  value: BraftEditor.createEditorState(infos[item.name])
                })
              }
              // 如果是upload
              else if (item.type === 'upload' && infos[item.name]) {
                item.value = infos[item.name] || null
                //如果是string
                if (typeof item.value === 'string') {
                  item.value = [
                    {
                      url: infos[item.name],
                      key: infos[item.name]
                    }
                  ]
                } else {

                }

                fields.push({
                  name: item.name,
                  value: item.value
                })
              }
              //如果是地区
              else if (item.type === 'area') {
                //如果是地区的值是一个数组
                if (item.valueType === 'arr') {
                  //如果有值
                  if (item.itemName && infos[item.itemName]) {
                    allvisibles[item.name] = true
                    item.value = infos[item.itemName] || []
                  }
                  fields.push({
                    name: item.name,
                    value: item.value
                  })
                } else {
                  areaValue.map(item => {
                    item.value.code = infos[item.name] || null
                    fields.push({
                      name: item.name,
                      value: infos[item.name] || null
                    })
                  })
                  item.value = [...areaValue]
                }
                // console.log('11111111111111111area', item)
                await getArea(item)
              }
              //如果有formList
              else if (item.type === 'formList') {
                let newValue = infos[item.name]

                let hasDate = item.children.find(child => child.type === 'date')
                // console.log('是否有日期----------------🍺', newValue,hasDate)
                /** 
                 * 如果条件都满足
                 * 
                 */
                if (newValue) {
                  //type = 'date'
                  if (hasDate) {

                    newValue.length && newValue.map(nitem => {

                      nitem[hasDate.name] = nitem[hasDate.name] ? nitem[hasDate.name] === '0000-00-00' ? '' : moment(nitem[hasDate.name], 'YYYY-MM-DD') : ''

                      // console.log('111111', nitem)
                    })
                  }
                  fields.push({
                    name: item.name,
                    value: newValue
                  })
                }

              }
              //如果是有些字段不能赋值
              else if (checkApi) {
                let field = infos[item.name] ? infos[item.name] : (infos[item.name] === '' || infos[item.name] === 0 || infos[item.name] === false) ? infos[item.name] : (item.type === 'textarea' || item.type === 'input' || item.type === 'phone' || item.type === 'number' || item.type === 'radio' || item.type === 'treeselect' || item.type === 'select') ? null : []
                // console.log('如果是有些字段不能赋值', infos, item, field)
                /** 如果详情是空值 但自身有值 */
                if (!field && item.value) {
                  field = item.value
                }
                fields.push({
                  name: item.name,
                  value: field
                })
              } else {
                if (!item.noValue) {
                  let field = infos[item.name] ? infos[item.name] : (infos[item.name] === '' || infos[item.name] === 0 || infos[item.name] === false) ? infos[item.name] : (item.type === 'textarea' || item.type === 'input' || item.type === 'phone' || item.type === 'number' || item.type === 'radio' || item.type === 'treeselect' || item.type === 'select') ? null : []
                  /** 如果详情是控制 但自身有值 */
                  if (!field && item.value) {
                    field = item.value
                  }

                  fields.push({
                    name: item.name,
                    value: field
                  })
                }
              }

              /** 如果有依赖隐藏项 */
              if (item.relyOn) {
                let show = false
                let { name, value } = item.relyOn

                //如果依赖项需要固定对应的值
                if (typeof value === 'boolean' && value === infos[name]) {
                  show = true
                }

                // console.log('如果依赖项需要固定对应的值---------', name, value)
                if (typeof value !== 'boolean' && value && value.includes(infos[name])) {
                  show = true
                }

                //如果没有固定值
                if ((value === '' || value == null) && infos[name] && infos[name] !== null) {
                  show = true
                }
                allvisibles[item.name] = show
              }

              /** 没有值的时候不显示 */
              if (item.noValueHidden) {
                console.log('没有值的时候不显示', item)
                allvisibles[item.name] = false
              }

              /** 如果有要执行的effect */
              if (effect && effect.get(item.name)) {
                // console.log('如果有要执行的effect-----------', effect)
                await runEffects([[item.name, infos[item.name]]], effect, newItems)
              }

              // console.log('如果是查看-----------', type)
              /** 如果是查看 或者 checkedDisabled*/
              if (type === 'check' || item.checkedDisabled || (type === 'create' && checkKeyToDisabled && infos[checkKeyToDisabled] && !item.check)) {
                item.disabled = true
                // item.required = false
              }

              /** 如果自身有 checkedDisabled = false 说明不能disabled*/
              if (item.checkedDisabled === false && type === 'create') {
                let arrValueNames = ['multiple']
                item.disabled = false
                //值重置为空
                fields.push({
                  name: item.name,
                  value: arrValueNames.includes(item.type) ? [] : null
                })
              }
            })

          ).then(async (res) => {
            // console.log('查找用户详情-------------fields', fields)
            console.log('查找用户详情-------------newItems', newItems)
            // console.log('查找用户详情-------------newItems', allvisibles)
            setFormItems(newItems)
            setState({ ...state, fields: [...fields] })
            setvisible(allvisibles)
            message.success({
              content: `${Object.values(infos).length ? successMessage ? successMessage : '获取人员信息完成' : errMessage ? errMessage : '无此手机号信息,可以新建！'}`,
              top: 100,
              duration: 1,
            })
          })
        }
      })
    }
  }

  /** 执行actions */
  const [runActions]: any = useDebouncedCallback((value, allValue) => {
    let action = actions[value[0][0]]
    action.map(async (item) => {
      let actionValue = value

      let { action, dataName, setName, debounceTime, setChildName, relyOnData, setOptionsByValue, setVisabled } = item
      let bindData = dataName ? targetDatas[dataName] : allValue[value[0][0]] //需要依赖的数据
      let newData = action && await action(bindData, actionValue, allValue, relyOnData)
      /** 如果有setChildName 说明是formList */
      if (setChildName && relyOnData && relyOnData.length) {
        let index = value[0][1].length - 1
        let data = allValue[setName]
        data[index][setChildName] = newData
        newData = data
      }


      //如果是延迟执行
      if (debounceTime && newData) {
        setDeley(debounceTime)
      } else {
        setDeley(0)
      }

      //如果有值
      if (newData !== null) {

        /**如果setOptionsByValue */
        if (setOptionsByValue) {
          let allItems = [...items]
          let newItems = [...formItems]
          let itemIndex = 0
          let setItem = allItems.find((item, index) => {
            if (item.name === setName) {
              itemIndex = index
              return item
            }
          })
          console.log('执行actions------------setItem', setItem)
          let newOptions = []
          setItem.options && setItem.options.length && setItem.options.map(item => {
            if (newData.includes(item[setItem.valueKey])) {
              newOptions.push(item)
            }
          })
          // setItem.options = [...newOptions]
          newItems[itemIndex] = {
            ...newItems[itemIndex],
            options: newOptions
          }
          setFormItems(newItems)
        }
        form.setFieldsValue({ [setName]: newData })


        /** 如果有setVisabled */
        if (setVisabled) {
          setvisible({ ...itemvisibles, [setName]: newData })
        }
      }


      console.log('执行actions------------value', newData)

    })
  }, deley)


  return (
    /** 表单组件 */
    < CreateForm
      items={formItems}
      created={state.created}
      layout={layout}
      formName={formName}
      fields={state.fields}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={onValuesChange}
      itemvisibles={itemvisibles}
      aline={aline}
      hiddeCancel={hiddeCancel}
      onReset={onReset}
      cancelText={cancelText}
      hiddeSubmit={hiddeSubmit}
      submitText={submitText}
      form={form}
      // area={area}
      // areaArr={areaArr}
      // AreaChange={AreaChange}
      readOnly={readOnly}
      config={config}
    />
  )
}
export default Index;