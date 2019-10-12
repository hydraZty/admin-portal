import React, { PureComponent } from 'react';
import { Col, Pagination, Row } from 'antd';

import DataTable from '../data-table/DataTable';
import RowDetail from '../data-table/RowDetail';
import './TableContent.less';

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
    resources: ['TCGA-BRCA', 'TCGA-LUAD', 'TCGA-BGM', 'TCGA-SKD'],
  }, {
    id: 3,
    roleName: 'Workspace-user',
    resources: ['TCGA-BRCA'],
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

class TableContent extends PureComponent {
  constructor (props) {
    super(props);
    this.state = {
      selectedUser: data[0],
    };
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
              dataSource={data}
              onRowSelect={(user) => this.showUserDetail(user)}
            />
          </Col>
          <Col span={10}>
            <div className="table-pagination">
              <Pagination
                showSizeChanger
                total={100}
                pageSizeOptions={['10', '25', '50']}
                size="small"
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
