/* External Dependencies */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

/* Internal Dependencies */
import styles from './Transformer.scss'

class Transformer extends React.Component {
  constructor() {
    super()
    this.toggleMode = this.toggleMode.bind(this)
    this.onChange = this.onChange.bind(this)
    this._refs = {}
    this.state = {
      editing: false,
      value: '',
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

  toggleMode() {
    this.setState(state => ({
      editing: !state.editing,
    }))
  }

  onChange(e) {
    this.setState({ value: e.target.value })
  }

  render() {
    return (
      <div className={classNames(styles.wrapper, this.props.className)} onClick={this.toggleMode} onBlur={this.toggleMode}>
        {
          this.state.editing ?
            (<input
              ref={e => { if (e) { this._refs.input = e } }}
              className={styles.input}
              type="text"
              value={this.state.value}
              onChange={this.onChange}
              onKeyPress={e => { if (e.charCode === 13) { this.toggleMode() } }} />) :
            this.props.value
        }
      </div>
    )
  }
}

Transformer.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
}

Transformer.defaultProps = {
  className: '',
  value: '',
  onChange: () => {},
}

export default Transformer