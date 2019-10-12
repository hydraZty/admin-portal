import React, { PureComponent } from 'react';

import ResourceTree from '../data-table/ResourceTree';
import './Sidebar.less';

class Sidebar extends PureComponent {
  render () {
    return (
      <div className="filterable-sidebar">
        <ResourceTree />
      </div>
    );
  }
}

export default Sidebar;
