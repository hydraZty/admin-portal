import React from "react"
import { Form, Button, Icon, Row, Col, Input } from "antd"
import PropTypes from 'prop-types'

import './AddUserForm.less'

let id = 0

const AddUserForm = Form.create({ name: 'add_user_form' })(
  class extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        rows: 0
      }
    }

    static propTypes = {
      onRef: PropTypes.func,
    }

    componentDidMount () {
      this.props.onRef(this)
    }

    add = () => {
      const { form } = this.props
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(id++)
      // can use data-binding to set
      form.setFieldsValue({
        keys: nextKeys,
      })
    }

    remove = k => {
      const { form } = this.props
      const keys = form.getFieldValue('keys')
      if (keys.length === 1) {
        return
      }
      form.setFieldsValue({
        keys: keys.filter(key => key !== k),
      })
    }

    handleSubmit = () => {
      return this.props.form.validateFields((err, values) => {
        if (!err) {
          const { keys, users } = values
          return keys.map(key => users[key])
        } else {
          return err
        }
      })
    }

    render () {
      const { form, ...other } = this.props
      const { getFieldDecorator, getFieldValue } = form
      getFieldDecorator('keys', { initialValue: [] })
      const keys = getFieldValue('keys')
      if (keys.length === 0) {
        this.add()
      }

      const requireRule = {
        required: true,
        whitespace: true,
        message: "Required",
      }


      const formItems = keys.map((key, index) => {
        return (
          <Row gutter={ 8 } key={ `${key}.${index}` }>
            <Col span={ 8 }>
              <Form.Item
                required={ false }
                className="add-user-form-item"
                { ...other }
              >
                <label className="label">
                  User Name
                </label>
                <Row>
                  { getFieldDecorator(`users[${index}].name`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [requireRule,],
                  })(<Input style={ { width: '100%' } }/>) }
                </Row>
              </Form.Item>
            </Col>

            <Col span={ 14 } className="form-item-col">
              <Form.Item
                required={ false }
                className="add-user-form-item"
                { ...other }
              >
                <label className="label">
                  Email Address
                </label>
                { getFieldDecorator(`users[${index}].email`, {
                  validateTrigger: ['onChange', 'onBlur'],
                  rules: [requireRule,],
                })(<Input style={ { width: '100%' } }/>) }
              </Form.Item>
            </Col>
            <Col span={ 2 } className="form-item-delete-item">
              { keys.length > 1 ? (
                <Icon
                  className="dynamic-delete-button"
                  type="minus-circle-o"
                  onClick={ () => this.remove(key) }
                />
              ) : null }
            </Col>
          </Row>
        )
      })

      return (
        <Row>
          <Col span={ 22 } offset={ 2 }>
            { formItems }
            <Button type="dashed" onClick={ this.add } className="add-button" style={ {} }>
              <Icon type="plus"/> Add field
            </Button>
          </Col>
        </Row>
      )
    }
  }
)

export default AddUserForm