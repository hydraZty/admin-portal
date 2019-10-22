import React, { PureComponent } from 'react';
import { Col, Pagination, Row } from 'antd';
import { find, map, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DataTable from '../data-table/DataTable';
import RowDetail from '../data-table/RowDetail';
import './TableContent.less';
import { loadUserList, setPagination } from '../../actions';

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
      users: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    const users = [];
    let selectedUser = cloneDeep(state.selectedUser);
    map(props.users, user => {
      const policies = [];
      map(user.policies, policy => {
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
      const copiedUser = {
        ...user,
        policies,
      };
      if (selectedUser === null) {
        selectedUser = copiedUser;
      }
      users.push(copiedUser);
    });
    return {
      ...state,
      users,
      selectedUser,
    };
  }

  componentDidMount = async () => {
    await this.loadUsers();
  }

  loadUsers = async () => {
    await this.props.loadUserList();
  }

  onChangePage = async (page, pageSize) => {
    this.props.setPagination(page, pageSize);
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
            <div className="table-content__pagination">
              <Pagination
                pageSize={this.props.pagination.page_size}
                current={this.props.pagination.page}
                showSizeChanger
                total={this.props.pagination.total_count}
                pageSizeOptions={['10', '25', '50']}
                size="small"
                onChange={this.onChangePage}
                onShowSizeChange={this.onShowSizeChange}
              />
            </div>
            <RowDetail
              user={this.state.selectedUser}
              key={JSON.stringify(this.state.selectedUser)}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

TableContent.propTypes = {
  pagination: PropTypes.object,
  users: PropTypes.array,
  loadUserList: PropTypes.func,
  setPagination: PropTypes.func,
};

TableContent.defaultProps = {
  pagination: {
    page: 1,
    page_size: 10,
    total_count: 0,
  },
  users: [],
  loadUserList: () => {},
  setPagination: () => {},
};


const mapStateToProps = state => ({
  pagination: state.userList.pagination,
  users: state.userList.users,
});


const mapDispatchToProps = {
  loadUserList,
  setPagination,
};


export default connect(mapStateToProps, mapDispatchToProps)(TableContent);
