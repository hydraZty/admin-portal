import React, { PureComponent } from 'react';
import { Col, Pagination, Row } from 'antd';
import { find } from 'lodash';

import DataTable from '../data-table/DataTable';
import RowDetail from '../data-table/RowDetail';
import './TableContent.less';
import { arborist } from '../../utils/API';

// const data = [{
//   key: 1,
//   name: 'Daisy Dai',
//   email: 'daichen.daisy@gmail.com',
//   createdAt: '2019-09-07 15:42',
//   groups: ['CTDS-Mgmt'],
//   policies: [{
//     id: 1,
//     roleName: 'Admin',
//     resources: [],
//   }, {
//     id: 2,
//     roleName: 'Downloader',
//     resources: ['TCGA-BRCA', 'TCGA-LUAD', 'TCGA-BGM', 'TCGA-SKD'],
//   }, {
//     id: 3,
//     roleName: 'Workspace-user',
//     resources: ['TCGA-BRCA'],
//   }],
// }, {
//   key: 2,
//   name: 'Xenia Lu',
//   email: 'xenia.lyy@gmail.com',
//   createdAt: '2019-09-06 11:19',
//   groups: ['CTDS-Dev', 'NIAID-Dev'],
//   policies: [{
//     id: 1,
//     roleName: 'Admin',
//     resources: [],
//   }, {
//     id: 2,
//     roleName: 'Downloader',
//     resources: ['TCGA-BRCA', 'TCGA-LUAD', 'TCGA-BGM'],
//   }],
// }];

class TableContent extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      selectedUser: null,
      pagination: {
        page: 1,
        page_size: 10,
        total_count: 0,
      },
      users: [],
    };
  }

  componentDidMount = async () => {
    await this.loadUsers();
  }

  loadUsers = async () => {
    // eslint-disable-next-line camelcase
    const { page, page_size } = this.state.pagination;
    // eslint-disable-next-line camelcase
    const resp = await arborist.get(`/user?page=${page}&page_size=${page_size}`);
    const users = resp.users.map(user => {
      const copiedUser = Object.assign(user);
      const policies = [];
      copiedUser.policies.forEach(policy => {
        const currentPolicy = find(policies, d => d.role === policy.role);
        if (currentPolicy) {
          currentPolicy.resources.push({
            resource: policy.resource,
            policy: policy.policy,
            expires_at: policy.expires_at,
          });
        } else {
          policies.push({
            role: policy.role,
            resources: [{
              resource: policy.resource,
              policy: policy.policy,
              expires_at: policy.expires_at,
            }],
          });
        }
      });
      copiedUser.policies = policies;
      return copiedUser;
    });
    await this.setState({
      pagination: resp.pagination,
      users,
      selectedUser: resp.users[0],
    });
  }

  onChangePage = async (page, pageSize) => {
    await this.setState(prevState => ({
      pagination: {
        ...prevState.pagination,
        page,
        page_size: pageSize,
      },
    }));
    await this.loadUsers();
  }

  onShowSizeChange = async (current, size) => {
    await this.setState(prevState => ({
      pagination: {
        ...prevState.pagination,
        page: current,
        page_size: size,
      },
    }));
    await this.loadUsers();
  }

  showUserDetail = (user) => {
    this.setState({
      selectedUser: user,
    });
  };

  render () {
    return (
      <div className="table-content">
        <Row>
          <Col span={14}>
            <DataTable
              dataSource={this.state.users}
              onRowSelect={(user) => this.showUserDetail(user)}
            />
          </Col>
          <Col span={10}>
            <div className="table-pagination">
              <Pagination
                pageSize={this.state.pagination.page_size}
                current={this.state.pagination.page}
                showSizeChanger
                total={this.state.pagination.total_count}
                pageSizeOptions={['10', '25', '50']}
                size="small"
                onChange={this.onChangePage}
                onShowSizeChange={this.onShowSizeChange}
              />
            </div>
            <RowDetail user={this.state.selectedUser} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default TableContent;
