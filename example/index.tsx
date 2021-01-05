import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FindForm } from '../.';

const App = () => {
  return (
    <div>
      <FindForm />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
