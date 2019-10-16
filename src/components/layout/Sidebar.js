import React, { PureComponent } from 'react';

import ResourceTree from '../data-table/ResourceTree';
import './Sidebar.less';
import Group from '../data-table/Group';
import Role from '../data-table/Role';

class Sidebar extends PureComponent {
  render () {
    return (
      <div className="filterable-sidebar">
        <ResourceTree />
        <Group />
        <Role />
      </div>
    );
  }
}

export default Sidebar;
