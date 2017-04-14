import React, {Component} from 'react';
import '../styles.css'

export default class InputBox extends Component {
  render () {
    return (
      <div className="inputContainer">
        <div>
          <input onChange={this.props.onChangeField}  value={this.props.fieldValue} placeholder={this.props.placeholder} type="text"/>
        </div>
      </div>
    )
  }
}
