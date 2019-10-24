import React, { PureComponent } from 'react';
import { Col, Pagination, Row } from 'antd';
import { find, map, cloneDeep } from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DataTable from '../data-table/DataTable';
import RowDetail from '../data-table/RowDetail';
import './TableContent.less';
import { loadUserList, setPagination } from '../../actions';


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
  };

  loadUsers = async (reset = true) => {
    await this.props.loadUserList(reset);
  };

  onChangePage = async (page, pageSize) => {
    this.props.setPagination(page, pageSize);
    await this.loadUsers(false);
  };

  onShowSizeChange = async (current, size) => {
    await this.props.setPagination(current, size);
    await this.loadUsers();
  };

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
              loading={this.props.loading}
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
  loading: PropTypes.bool,
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
  loading: false,
};


const mapStateToProps = state => ({
  pagination: state.userList.pagination,
  users: state.userList.users,
  loading: state.userList.loading,
});


const mapDispatchToProps = {
  loadUserList,
  setPagination,
};


export default connect(mapStateToProps, mapDispatchToProps)(TableContent);
