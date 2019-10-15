import React, { Component } from 'react';
import { Icon, Select, Tree } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { arborist } from '../../utils/API';
import { unflatten } from '../../utils/util';
import { setUserResourceFilterData, loadUserList } from '../../actions';

const { Option } = Select;
const { TreeNode } = Tree;

class ResourceTree extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
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
    this.props.setUserResourceFilterData(checkedKeys);
    this.props.loadUserList();
  };

  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode title={item.name} key={item.tag} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode key={item.tag} title={item.name} {...item} />;
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
          checkedKeys={this.props.resources}
          switcherIcon={<Icon type="down" />}
        >
          {this.renderTreeNodes(this.state.resourceData)}
        </Tree>
      </div>
    );
  }
}

ResourceTree.propTypes = {
  resources: PropTypes.array,
  setUserResourceFilterData: PropTypes.func,
  loadUserList: PropTypes.func,
};

ResourceTree.defaultProps = {
  resources: [],
  setUserResourceFilterData: () => {},
  loadUserList: () => {},
};


const mapStateToProps = state => ({
  resources: state.userList.resources,
});


const mapDispatchToProps = {
  setUserResourceFilterData,
  loadUserList,
};


export default connect(mapStateToProps, mapDispatchToProps)(ResourceTree);
