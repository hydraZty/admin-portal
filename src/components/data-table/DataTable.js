import React, { Component } from 'react';
import { Table, Tag } from 'antd';

import './DataTable.less';

const columns = [{
  title: 'User',
  dataIndex: 'name',
  key: 'name',
  render: (name, record) => (
    <div className="col-name">
      <span className="user-name">{name}</span>
      <span className="user-email">{record.email}</span>
      <span className="user-created-at">{record.createdAt}</span>
    </div>
  ),
}, {
  title: 'Groups',
  dataIndex: 'groups',
  key: 'groups',
  render: groups => (
    <div className="col-groups">
      {groups.map(group => <span key={group}>{group}</span>)}
    </div>
  ),
}, {
  title: 'Policies',
  dataIndex: 'policies',
  key: 'policies',
  render: policies => (
    <div className="col-policies">
      {
        policies.map(policy => (
          <div key={policy.id}>
            <span style={{ marginRight: 6 }}>{policy.roleName}</span>
            {policy.resources.map(resource => (
              <Tag
                color="#e7e7e7"
                key={resource}
                style={{ color: '#3283c8' }}
              >
                {resource}
              </Tag>
            ))}
          </div>
        ))
      }
    </div>
  ),
}];
const data = [{
  key: 1,
  name: 'Daisy Dai',
  email: 'daichen.daisy@gmail.com',
  createdAt: '2019-09-07 15:42',
  groups: ['CTDS-Mgmt'],
  policies: [{
    id: 1,
    roleName: 'Admin',
    resources: [],
  }, {
    id: 2,
    roleName: 'Downloader',
    resources: ['TCGA-BRCA', 'TCGA-LUAD', 'TCGA-BGM'],
  }],
}, {
  key: 2,
  name: 'Xenia Lu',
  email: 'xenia.lyy@gmail.com',
  createdAt: '2019-09-06 11:19',
  groups: ['CTDS-Dev', 'NIAID-Dev'],
  policies: [{
    id: 1,
    roleName: 'Admin',
    resources: [],
  }, {
    id: 2,
    roleName: 'Downloader',
    resources: ['TCGA-BRCA', 'TCGA-LUAD', 'TCGA-BGM'],
  }],
}];

class DataTable extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    return (
      <Table columns={columns} dataSource={data} pagination={false} />
    );
  }
}

export default DataTable;
