import React, { Component } from 'react';
import { Select, Tree } from 'antd';

const { Option } = Select;
const { TreeNode } = Tree;
const resourceData = [
  {
    title: 'CGCI',
    key: 'CGCI',
    children: [
      {
        title: 'CGCI-0',
        key: 'CGCI-0',
      },
      {
        title: 'CGCI-1',
        key: 'CGCI-1',
      },
      {
        title: 'CGCI-2',
        key: 'CGCI-2',
      },
    ],
  },
  {
    title: 'TARGET',
    key: 'TARGET',
    children: [
      { title: 'TARGET-AML', key: 'TARGET-AML' },
      { title: 'TARGET-ALL-P3', key: 'TARGET-ALL-P3' },
    ],
  },
  {
    title: 'TCGA',
    key: 'TCGA',
    children: [
      { title: 'TCGA-BRCA', key: 'TCGA-BRCA' },
      { title: 'TCGA-GBM', key: 'TCGA-GBM' },
      { title: 'TCGA-LUAD', key: 'TCGA-LUAD' },
      { title: 'TCGA-IUY', key: 'TCGA-IUY' },
    ],
  },
  {
    title: 'BEATAML1.0',
    key: 'BEATAML1.0',
    children: [
      { title: 'BEATAML1.0-0', key: 'BEATAML1.0-0' },
      { title: 'BEATAML1.0-1', key: 'BEATAML1.0-1' },
    ],
  },
];

class ResourceTree extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expandedKeys: ['TARGET', 'TCGA'],
      autoExpandParent: true,
      checkedKeys: ['CGCI', 'TCGA'],
    };
  }

  onExpand = expandedKeys => {
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  };

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
  };

  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.key} {...item} />;
  });

  render () {
    return (
      <div>
        <Select
          style={{ width: 248, marginBottom: 6 }}
          placeholder="NAMESPACE"
          defaultValue="ns-1"
        >
          <Option value="ns-1">NAMESPACE 1</Option>
          <Option value="ns-2">NAMESPACE 2</Option>
        </Select>
        <Tree
          checkable
          selectable={false}
          onExpand={this.onExpand}
          expandedKeys={this.state.expandedKeys}
          autoExpandParent={this.state.autoExpandParent}
          onCheck={this.onCheck}
          checkedKeys={this.state.checkedKeys}
        >
          {this.renderTreeNodes(resourceData)}
        </Tree>
      </div>
    );
  }
}

export default ResourceTree;
