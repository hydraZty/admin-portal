import React, { Component } from 'react';
import { Icon, Select, Tree } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { map } from 'lodash';

import './ResourceTree.less';
import { arborist } from '../../utils/API';
import {
  formatTreeData,
  unflatten,
  formatResourceName,
} from '../../utils/util';
import {
  setUserResourceFilterData,
  loadUserList,
  loadNamespaceData,
  setSelectedNamespace,
  setResourceTreeData,
  setSelectedRole,
} from '../../actions';

const { Option } = Select;
const { TreeNode } = Tree;

class ResourceTree extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expandedKeys: [],
      autoExpandParent: true,
      roles: [],
    };
  }

  componentDidMount = async () => {
    await this.props.loadNamespaceData();
    await this.loadResourceTree();
    await this.loadRole();
  };

  loadRole = async () => {
    const resp = await arborist.get('/role');
    this.setState({
      roles: map(resp.roles, role => {
        const copiedRole = { ...role };
        copiedRole.checked = false;
        return copiedRole;
      }),
    });
  };

  loadResourceTree = async () => {
    const resp = await arborist.get(`/resource/namespace?path=${this.props.selectedNamespace}`);
    const resources = formatTreeData(resp.resources);
    this.props.setResourceTreeData(unflatten(resources));
  };

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

  handleSelectNamespace = async (path) => {
    await this.props.setSelectedNamespace(path);
    await this.loadResourceTree();
  };

  handleSelectRole = async (role) => {
    await this.props.setSelectedRole(role);
    await this.props.loadUserList();
  };

  renderTreeNodes = data => data.map(item => {
    if (item.children) {
      return (
        <TreeNode
          title={formatResourceName(item.name)}
          key={item.tag}
          dataRef={item}
        >
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return (
      <TreeNode
        key={item.tag}
        title={formatResourceName(item.name)}
        {...item}
      />
    );
  });

  render () {
    return (
      <div className="resource-tree">
        <Select
          className="resource-tree__selector"
          placeholder="NAMESPACE"
          defaultValue="DEFAULT"
          onChange={this.handleSelectNamespace}
        >
          {
            this.props.namespaces.map(
              namespace => (
                <Option value={namespace.path} key={namespace.path}>
                  {formatResourceName(namespace.name)}
                </Option>
              ),
            )
          }
        </Select>
        <Select
          className="selector"
          placeholder="Please select role"
          allowClear
          onChange={this.handleSelectRole}
        >
          {
            this.state.roles.map(
              role => (
                <Option value={role.id}>
                  {role.id}
                </Option>
              ),
            )
          }
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
          {this.renderTreeNodes(this.props.resourcesData)}
        </Tree>
      </div>
    );
  }
}

ResourceTree.propTypes = {
  resources: PropTypes.array,
  resourcesData: PropTypes.array,
  namespaces: PropTypes.array,
  selectedNamespace: PropTypes.any,
  selectedRole: PropTypes.string,
  setUserResourceFilterData: PropTypes.func,
  loadUserList: PropTypes.func,
  loadNamespaceData: PropTypes.func,
  setSelectedNamespace: PropTypes.func,
  setResourceTreeData: PropTypes.func,
  setSelectedRole: PropTypes.func,
};

ResourceTree.defaultProps = {
  resources: [],
  resourcesData: [],
  namespaces: [],
  selectedNamespace: null,
  selectedRole: null,
  setUserResourceFilterData: () => {},
  loadUserList: () => {},
  loadNamespaceData: () => {},
  setSelectedNamespace: () => {},
  setResourceTreeData: () => {},
  setSelectedRole: () => {},
};


const mapStateToProps = state => ({
  resources: state.userList.resources,
  resourcesData: state.userList.resourcesData,
  namespaces: state.userList.namespaces,
  selectedNamespace: state.userList.selectedNamespace,
  selectedRole: state.userList.selectedRole,
});


const mapDispatchToProps = {
  setUserResourceFilterData,
  loadUserList,
  loadNamespaceData,
  setSelectedNamespace,
  setResourceTreeData,
  setSelectedRole,
};


export default connect(mapStateToProps, mapDispatchToProps)(ResourceTree);
