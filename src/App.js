import React from 'react';
import { Layout } from 'antd';

import NavMenu from './components/layout/NavMenu';
import Sidebar from './components/layout/Sidebar';
import TableContent from './components/layout/TableContent';
import CurrentUser from './components/auth/CurrentUser';
import AddUser from './components/user/AddUser';
import './App.less';
import './global.less';


const {
  Content,
  Header,
  Sider,
} = Layout;

function App () {
  return (
    <Layout className="app">
      <Header className="app-header">
        <NavMenu />
        <CurrentUser />
        <AddUser />
      </Header>
      <Layout hasSider className="app-layout">
        <Sider width="300" className="app-sidebar">
          <Sidebar />
        </Sider>
        <Content className="app-content">
          <TableContent />
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
