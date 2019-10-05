import React, { Component } from 'react';
import { Menu } from 'antd';

import './NavMenu.less';

class NavMenu extends Component {
  constructor (props) {
    super(props);
    this.state = {
      current: 'users',
    };
  }

  handleClick = e => {
    this.setState({
      current: e.key,
    });
  };

  render () {
    return (
      <Menu
        onClick={this.handleClick}
        selectedKeys={[this.state.current]}
        mode="horizontal"
        className="nav-menu"
      >
        <Menu.Item key="users">USERS</Menu.Item>
        <Menu.Item key="groups">GROUPS</Menu.Item>
        <Menu.Item key="clients" disabled>CLIENTS</Menu.Item>
        <Menu.Item key="roles-permissions" disabled>
          ROLES & PERMISSIONS
        </Menu.Item>
      </Menu>
    );
  }
}


export default NavMenu;
