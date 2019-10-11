import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
          <div key={policy.role} style={{ lineHeight: 2.1 }}>
            <span style={{ marginRight: 6 }}>{policy.role}</span>
            {policy.resources && policy.resources.slice(0, 2).map(resource => (
              <Tag
                color="#e7e7e7"
                key={resource.policy}
                style={{ color: '#3283c8', marginRight: 4 }}
              >
                {resource.resource}
              </Tag>
            ))}
            <span>
              {policy.resources && policy.resources.length > 2 ? (
                <Tag color="#e7e7e7" style={{ color: '#606060' }}>
                  {policy.resources.length - 2} more
                </Tag>
              ) : ''}
            </span>
          </div>
        ))
      }
    </div>
  ),
}];


class DataTable extends Component {
  constructor (props) {
    super(props);
    this.state = {
      selectedRowIndex: 0,
    };
  }

  selectRow = (record, index) => {
    this.setState({
      selectedRowIndex: index,
    });
    this.props.onRowSelect(record);
  };

  render () {
    return (
      <Table
        columns={columns}
        dataSource={this.props.dataSource}
        pagination={false}
        rowClassName={(record, index) => {
          if (index === this.state.selectedRowIndex) {
            return 'row-selected';
          }
          return '';
        }}
        onRow={(record, index) => ({
          onClick: () => {
            this.selectRow(record, index);
          },
        })}
      />
    );
  }
}

DataTable.propTypes = {
  dataSource: PropTypes.array,
  onRowSelect: PropTypes.func,
};

DataTable.defaultProps = {
  dataSource: [],
  onRowSelect: () => {
  },
};

export default DataTable;
