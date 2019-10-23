import React, { PureComponent } from 'react';

import ResourceTree from '../data-table/ResourceTree';
import './Sidebar.less';
import Group from '../data-table/Group';
import UserSearch from '../data-table/UserSearch';

class Sidebar extends PureComponent {
  render () {
    return (
      <div className="sidebar">
        <UserSearch />
        <ResourceTree />
        <Group />
      </div>
    );
  }
}

export default Sidebar;
