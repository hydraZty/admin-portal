import React from "react"
import { Form, Icon, Row, Col, Select, Tag, TreeSelect } from "antd"
import PropTypes from 'prop-types'
import _ from 'lodash'

import "./AssignPermissionForm.less"
import { arborist } from "../../utils/API"
import { unflatten } from "../../utils/util"


const AssignPermissionForm = Form.create({ name: 'assign_permission_form' })(
  class extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        roleOptions: [],
        resourceOptions: [],
        roleData: [],
        results: [],
      }
    }


    renderTreeNodes = (data, disable = false) => data.map(item => {
      // Removed from the results when the node was disabled
      if (disable) {
        _.remove(this.state.results, (r) => {
          return r.value === item.name
        })
      }
      if (item.children) {
        let disableChildren
        if (disable) {
          // Child nodes recursively disabled
          disableChildren = true
        } else {
          let values = this.state.results.map(v => v.value)
          disableChildren = values.includes(item.name)
        }
        return (
          <TreeSelect.TreeNode title={ item.name } key={ item.path } value={ item.name } disabled={ disable }>
            { this.renderTreeNodes(item.children, disableChildren) }
          </TreeSelect.TreeNode>
        )
      }
      return <TreeSelect.TreeNode key={ item.path } title={ item.name } value={ item.name } { ...item } />
    })


    onChange = results => {
      this.setState({ results })
    }

    static propTypes = {
      onRef: PropTypes.func,
    }

    static defaultProps = {}

    componentDidMount () {
      this.props.onRef(this)
      this.loadResourceOptions()
      this.loadRoleOptions()
    }


    loadRoleOptions = async () => {
      const resp = await arborist.get("/role")
      this.setState({
        roleOptions: resp.roles
      })
    }

    loadResourceOptions = async () => {
      const resp = await arborist.get("/resource")
      this.setState({
        resourceOptions: unflatten(resp.resources),
      })
    }
    handleSubmit = () => {
      return this.state.roleData
    }

    AddRole = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            roleData: this.state.roleData.concat(values)
          })
          this.props.form.resetFields()
        } else {
          return err
        }
      })
    }

    removeRole = (index) => {
      this.state.roleData.splice(index, 1)
      this.setState({
        roleData: this.state.roleData
      })
    }

    removeResource = (rowIndex, resourceIndex) => {
      this.state.roleData[rowIndex].resource.splice(resourceIndex, 1)
      this.setState({
        roleData: this.state.roleData
      })
    }

    render () {
      const { form } = this.props
      const { getFieldDecorator } = form

      const filteredRoleOptions = this.state.roleOptions.filter(o => {
        let keys = this.state.roleData.map(i => i.role.key)
        return !keys.includes(o.id)
      })

      return (

        <Row>
          <Col span={ 22 } offset={ 2 }>
            <Row>
              <Form>
                <Col span={ 8 }>
                  <Form.Item className="assign-permission-form-item">
                    { getFieldDecorator('role', {
                      rules: [{ required: true, message: 'Select role' }],
                    })(
                      <Select
                        labelInValue
                        showSearch
                        style={ { width: '95%' } }
                        placeholder="Select role">
                        {
                          filteredRoleOptions.map(r => {
                            return <Select.Option value={ r.id } key={ r.id }>{ r.id }</Select.Option>
                          })
                        }
                      </Select>,
                    ) }
                  </Form.Item>
                </Col>
                <Col span={ 14 }>
                  <Form.Item className="assign-permission-form-item">
                    { getFieldDecorator('resource', {
                      rules: [
                        { required: false, type: 'array' },
                      ],
                    })(
                      <TreeSelect
                        style={ { width: '100%'} }
                        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        allowClear
                        labelInValue
                        showSearch
                        multiple
                        treeCheckable
                        treeCheckStrictly={ true }
                        onChange={ this.onChange }
                        placeholder="Select resource (Searchable)">
                        { this.renderTreeNodes(this.state.resourceOptions) }
                      </TreeSelect>
                      ,
                    ) }
                  </Form.Item>
                </Col>

                <Col span={ 2 } className="add-role-col">
                  <div className="icon-wrapper" onClick={ this.AddRole }>
                    <Icon type="plus"/>
                  </div>
                </Col>
              </Form>
            </Row>
            {
              this.state.roleData.map((row, roleIndex) => {
                return (
                  <Row className="role-list-row" key={ `role-list-${roleIndex}` }>
                    <Col span={ 22 } className="role-list-item">
                      <div>
                        { row.role.label }
                      </div>
                      <div className="role-list-resource-tag-wrapper">
                        { row.resource && row.resource.map((row, resourceIndex) => {
                          return (
                            <Tag
                              color="#eeedf5"
                              key={ row.key }
                              className="resource-tag"
                              closable={ true }
                              onClose={ () => this.removeResource(roleIndex, resourceIndex) }
                            >
                              { row.label }
                            </Tag>
                          )
                        }) }
                      </div>
                    </Col>
                    <Col span={ 2 } className="delete-role-col">
                      <div className="icon-wrapper" onClick={ () => this.removeRole(roleIndex) }>
                        <Icon type="plus" rotate={ 45 }/>
                      </div>
                    </Col>
                  </Row>
                )
              })
            }
          </Col>
        </Row>
      )
    }
  }
)

export default AssignPermissionForm