import React, { PureComponent } from 'react';
import {
  Col, Modal, Pagination, Row,
} from 'antd';
import { find, cloneDeep } from 'lodash';
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
      selectedUserIndex: 0,
      users: [],
      visible: false,
      userContentReadOnly: true,
    };
  }

  static getDerivedStateFromProps(props, state) {
    const users = [];
    props.users.forEach(user => {
      const groupsWithPolicies = [];
      user.groups_with_policies.forEach(group => {
        const groupPolicies = [];
        group.policies.forEach(policy => {
          const currentPolicy = find(groupPolicies, d => d.role === policy.role);
          if (currentPolicy) {
            currentPolicy.resources.push({
              resource: policy.resource,
              policy: policy.policy,
              expires_at: policy.expires_at,
            });
          } else {
            groupPolicies.push({
              role: policy.role,
              resources: [{
                resource: policy.resource,
                policy: policy.policy,
                expires_at: policy.expires_at,
              }],
            });
          }
        });
        groupsWithPolicies.push({
          name: group.name,
          policies: groupPolicies,
        });
      });
      const policies = [];
      user.policies.forEach(policy => {
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
        groups_with_policies: groupsWithPolicies,
      };
      users.push(copiedUser);
    });
    return {
      ...state,
      users,
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
    this.setState({
      selectedUserIndex: 0,
    });
  };

  onShowSizeChange = async (current, size) => {
    await this.props.setPagination(current, size);
    await this.loadUsers();
    this.setState({
      selectedUserIndex: 0,
    });
  };

  render () {
    const selectedUser =
      this.state.users.length > this.state.selectedUserIndex ?
        cloneDeep(this.state.users[this.state.selectedUserIndex]) : null;
    return (
      <div className="table-content">
        <Row>
          <Col span={14}>
            <DataTable
              dataSource={this.state.users}
              onRowSelect={(index) => {
                if (!this.state.userContentReadOnly) {
                  Modal.confirm({
                    title: 'Are you sure you want to discard the changes?',
                    okText: 'Yes',
                    cancelText: 'Cancel',
                    onOk: () => {
                      this.setState({
                        selectedUserIndex: index,
                        userContentReadOnly: true,
                      });
                    },
                  });
                } else {
                  this.setState({
                    selectedUserIndex: index,
                  });
                }
              }}
              selectedIndex={this.state.selectedUserIndex}
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
              readOnly={this.state.userContentReadOnly}
              setReadonly={(readOnly) => this.setState({ userContentReadOnly: readOnly })}
              user={selectedUser}
              key={JSON.stringify(selectedUser)}
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
