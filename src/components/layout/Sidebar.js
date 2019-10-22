import React, { PureComponent } from 'react';

import ResourceTree from '../data-table/ResourceTree';
import './Sidebar.less';
import Group from '../data-table/Group';

class Sidebar extends PureComponent {
  render () {
    return (
      <div className="sidebar">
        <ResourceTree />
        <Group />
      </div>
    );
  }
}

export default Sidebar;
