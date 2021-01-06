import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FindForm } from '../.';

const App = () => {


  const items = [
    {
      name: 'name',
      label: '商户名称',
      type: 'input',
      validateType: 'string',
      checkedDisabled: true,
    },
    {
      name: 'shortName',
      label: '简称',
      type: 'input',
      validateType: 'string',
    },
    {
      name: 'number',
      label: '编号',
      type: 'input',
      validateType: 'string',
      validator: 'noChinese'
    },
  ]

  const submitForm = (data) => {
    console.log('submitForm', data)
  }

  return (
    <div>
      <FindForm
        formName={'merchants-manage'}
        items={items}
        submitText={'确认'}
        onSubmit={submitForm}
        hiddeCancel={true}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
