/* External Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { HotKeys } from 'react-hotkeys'
import Textarea from 'react-textarea-autosize'

/* Internal Dependencies */
import styles from './Transformer.scss'

const keyMap = {
  handleEnter: 'enter',
}

class Transformer extends React.Component {
  constructor() {
    super()
    this.changeToEditMode = this.changeToEditMode.bind(this)
    this.changeToViewMode = this.changeToViewMode.bind(this)
    this.onChange = this.onChange.bind(this)
    this._refs = {}
    this.state = {
      editing: false,
      value: '',
    }
    this.handlers = {
      handleEnter: this.changeToViewMode,
    }
  }

  componentWillMount() {
    this.init()
  }

  componentWillReceiveProps(nextProps) {
    this.init(nextProps)
  }

  componentWillUpdate(nextProps, nextState) {
    if (!nextState.editing && this.state.editing) {
      this.props.onChange(nextState.value)
    }
  }

  componentDidUpdate(prevState) {
    if (!prevState.editing && this.state.editing) {
      this._refs.input.focus()
    }
  }

  init(props = this.props) {
    this.setState({ value: props.value })
  }

  changeToEditMode() {
    this.setState({
      editing: true,
    })
  }

  changeToViewMode() {
    this.setState({
      editing: false,
    })
  }

  onChange(e) {
    this.setState({ value: e.target.value })
  }

  render() {
    return (
      <HotKeys
        keyMap={keyMap}
        handlers={this.handlers}
        className={classNames(styles.wrapper, this.props.className)}
        onClick={this.changeToEditMode}>
        <Textarea
          ref={e => { if (e) { this._refs.input = e } }}
          className={classNames(styles.textArea, this.props.fontClassName, { [styles.disabled]: !this.state.editing })}
          disabled={!this.state.editing}
          value={this.state.value}
          placeholder={this.props.placeholder}
          onChange={this.onChange}
          onBlur={this.changeToViewMode} />
      </HotKeys>
    )
  }
}

Transformer.propTypes = {
  className: PropTypes.string,
  fontClassName: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
}

Transformer.defaultProps = {
  className: '',
  fontClassName: '',
  value: '',
  placeholder: '',
  onChange: () => {},
}

export default Transformer
