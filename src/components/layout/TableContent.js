import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';

import DataTable from '../data-table/DataTable';
import './TableContent.less';

class TableContent extends PureComponent {
  render () {
    return (
      <div className="table-content">
        <Row>
          <Col span={15}>
            <DataTable />
          </Col>
          <Col span={9}/>
        </Row>
      </div>
    );
  }
}

export default TableContent;
