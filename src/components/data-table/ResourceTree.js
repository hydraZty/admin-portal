import React, { Component } from 'react';
import { Select, Tree } from 'antd';
import { arborist } from '../../utils/API';
import { unflatten } from '../../utils/util';

const { Option } = Select;
const { TreeNode } = Tree;

class ResourceTree extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      resourceData: [],
    };
  }

  componentDidMount = async () => {
    await this.loadResourceTree();
  }

  loadResourceTree = async () => {
    const resp = await arborist.get('/resource');
    this.setState({
      resourceData: unflatten(resp.resources),
    });
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
        <TreeNode title={item.name} key={item.path} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.path} title={item.name} {...item} />;
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
          {this.renderTreeNodes(this.state.resourceData)}
        </Tree>
      </div>
    );
  }
}

export default ResourceTree;
