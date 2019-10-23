import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Tag } from 'antd';

import './DataTable.less';
import { formatResourceName } from '../../utils/util';

const columns = [{
  title: 'User',
  dataIndex: 'display_name',
  key: 'display_name',
  render: (name, record) => (
    <div className="data-table__user">
      <span className="data-table__user-name">{record.display_name ? record.display_name : record.name}</span>
      <span className="data-table__user-email">{record.email}</span>
      <span className="data-table__cuser-reate-at">{record.created_at}</span>
    </div>
  ),
}, {
  title: 'Groups',
  dataIndex: 'groups',
  key: 'groups',
  render: groups => (
    <div className="data-table__groups">
      {groups.map(group => <span key={group}>{group}</span>)}
    </div>
  ),
}, {
  title: 'Rights / Resources',
  dataIndex: 'policies',
  key: 'policies',
  render: policies => (
    <div className="data-table__policies">
      {
        policies.map(policy => (
          <div key={policy.role} style={{ lineHeight: 2.1 }}>
            <span style={{ marginRight: 6 }}>{policy.role}</span>
            {policy.resources && policy.resources.slice(0, 2).map(resource => (
              <Tag
                color="#eeedf5"
                key={resource.policy}
                className="data-table__policies-resource-tag"
              >
                {formatResourceName(resource.resource)}
              </Tag>
            ))}
            <span>
              {policy.resources && policy.resources.length > 2 ? (
                <Tag color="#eeedf5" className="data-table__policies-resource-tag--more">
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

  scrollHeight = () => window.innerHeight - 64 - 32 - 54;

  render () {
    return (
      <Table
        columns={columns}
        dataSource={this.props.dataSource}
        pagination={false}
        rowClassName={(record, index) => {
          if (index === this.state.selectedRowIndex) {
            return 'data-table__row--select';
          }
          return '';
        }}
        scroll={{ y: this.scrollHeight() }}
        rowKey={(record) => record.name}
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
