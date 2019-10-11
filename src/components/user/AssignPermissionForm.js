import React from "react"
import { Form, Icon, Row, Col, Select, Tag } from "antd"
import PropTypes from 'prop-types'

import "./AssignPermissionForm.less"

const AssignPermissionForm = Form.create({ name: 'assign_permission_form' })(
  class extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        roleOptions: [
          { label: 'Admin', id: 1 },
          { label: 'Downloader', id: 2 },
          { label: 'Submitter', id: 3 },
          { label: 'Workspace-user', id: 4 },
        ],
        resourceOptions: [
          { label: 'CGCI', id: 1 },
          { label: 'TCGA-BRCA', id: 2 },
          { label: 'TCGA-GBM', id: 3 },
          { label: 'CGA-LUAD', id: 4 },
          { label: 'TARGET-AML', id: 5 },
          { label: 'TARGET-ALL-P3', id: 6 },
        ],
        roleData: [],
      }
    }


    static propTypes = {
      onRef: PropTypes.func,
    }

    static defaultProps = {}

    componentDidMount () {
      this.props.onRef(this)
    }

    handleSubmit = () => {
      return this.state.roleData
    }

    AddRole = () => {
      this.props.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
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
                            return <Select.Option value={ r.id } key={ r.id }>{ r.label }</Select.Option>
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
                      <Select
                        style={ { width: '100%' } }
                        labelInValue
                        showSearch
                        mode="multiple"
                        placeholder="Select resource">
                        {
                          this.state.resourceOptions.map(r => {
                            return <Select.Option value={ r.id } key={ r.id }>{ r.label }</Select.Option>
                          })
                        }
                      </Select>,
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