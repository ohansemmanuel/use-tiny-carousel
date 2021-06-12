import React from 'react';
import * as ReactDOM from 'react-dom';

const Nothing = () => {
  return <div>Nothing</div>;
};

describe('Nothing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Nothing />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
