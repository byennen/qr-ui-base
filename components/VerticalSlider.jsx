import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { SemaphoreColors } from './../helpers';

const UP = 'up';
const DOWN = 'down';
const DOWN_KEY = 40;
const UP_KEY = 38;
const NUMBERS_KEYS = _.range(48, 58);
const SECONDS_FOR_COMBINE_NUMBERS = 0.8;

class VerticalSlider extends Component {
  constructor(props) {
    super(props);
    const { value } = props;
    // Binds
    this.onScroll = this.onScroll.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    // Init
    this.resetScrollVars();
    this.resetNumberPressVars();
    this.state = { currentValue: value };
  }

  componentWillReceiveProps(newProps) {
    const { onOpen } = this.props
    if(!!newProps.open) {
      $('body').addClass('no-scroll')
      $('body').on('keydown', this.onKeyDown);
    } else {
      $('body').removeClass('no-scroll');
      $('body').off('keydown', this.onKeyDown);
    }
    // Call on open prop
    const isOpening = newProps.open !== this.props.open && newProps.open === OPEN;
    if(isOpening && onOpen) onOpen();
  }

  submitHandler(event) {
    if(!!event) event.preventDefault();
    const { onSubmit, onClose } = this.props;
    if(onSubmit) onSubmit();
    if(onClose) onClose();
  }

  stopParentClickPropagation(event) {
    event.stopPropagation();
  }

  resetScrollVars() {
    this.lastDeltaY = 0;
    this.previousDeltaY = 0;
    this.lastStepsScrolled = 0;
    this.deltaYLimit = 10;
  }

  resetNumberPressVars() {
    this.lastTimePressed = null;
    this.lastKeysPresseds = [];
  }

  onScroll(event) {
    if(Math.abs(event.deltaY) === 0) this.resetScrollVars();
    const direction = event.deltaY < 0 ? UP : DOWN;
    const isChanging = direction === UP ? event.deltaY > this.lastDeltaY : event.deltaY < this.lastDeltaY;
    if(isChanging) direction === UP ? this.increaseValue() : this.decreaseValue();
    this.lastDeltaY = event.deltaY;
  }

  onKeyDown(event) {
    const { keyCode } = event;
    if(keyCode === UP_KEY) this.increaseValue();
    if(keyCode === DOWN_KEY) this.decreaseValue();
    if(_.includes(NUMBERS_KEYS, keyCode)) this.handleNumberPress(keyCode);
  }

  handleNumberPress(keyCode) {
    const currentDate = new Date();
    const intervalInSeconds = (currentDate - this.lastTimePressed) / 1000;
    if(intervalInSeconds > SECONDS_FOR_COMBINE_NUMBERS) this.resetNumberPressVars();
    this.lastTimePressed = currentDate;
    this.lastKeysPresseds.push(keyCode);
    const newValue = _.map(this.lastKeysPresseds, (key) => String.fromCharCode(key)).join('');
    this.setNewValue(Number(newValue));
  }

  increaseValue() {
    const { step } = this.props;
    const { currentValue } = this.state;
    this.setNewValue(currentValue + step);
  }

  decreaseValue() {
    const { step } = this.props;
    const { currentValue } = this.state;
    this.setNewValue(currentValue - step);
  }

  setNewValue(newValue) {
    const { max, min } = this.props;
    if(newValue > max) newValue = max;
    if(newValue < min) newValue = min;
    this.setState({ currentValue: newValue });
  }

  stopParentClickPropagation(event) {
    event.stopPropagation();
  }

  renderNextValue(iterator, size) {
    const { min, max } = this.props;
    const { currentValue } = this.state;
    const value = currentValue + iterator;
    if(value > max || value < min) return false;
    const className = `qr-vertical-slider-value ${size}-font-size`;
    return <div className={className}>{value}</div>
  }

  render() {
    const { value, open, min, max, sufix, prefix, onClose, onSubmit } = this.props;
    const { currentValue } = this.state;
    if(!open) return <div className="closedVerticalSlider"></div>;

    const nextValueDOMItem3 = this.renderNextValue(3, 'xxs');
    const nextValueDOMItem2 = this.renderNextValue(2, 's');
    const nextValueDOMItem1 = this.renderNextValue(1, 'l');
    const prevValueDOMItem1 = this.renderNextValue(-1, 'l');
    const prevValueDOMItem2 = this.renderNextValue(-2, 's');
    const prevValueDOMItem3 = this.renderNextValue(-3, 'xxs');

    const semaphoreColor = SemaphoreColors.getSemaphoreColor(currentValue, { max, min });
    const className = `qr-vertical-slider grading-${semaphoreColor}-bg-color`;

    return (
      <div className="qr-vertical-slider-wrapper" onWheel={this.onScroll} onClick={onClose}>
        <div className={className} onClick={this.stopParentClickPropagation}>
          <div className="qr-vertical-slider-instructions blank">&nbsp;</div>

          {nextValueDOMItem3}
          {nextValueDOMItem2}
          {nextValueDOMItem1}

          <div className="qr-vertical-slider-value xxl-font-size active">
            <span className="prefix default-font-size">{prefix}</span>
            {currentValue}
            <span className="sufix default-font-size">{sufix}</span>
          </div>

          {prevValueDOMItem1}
          {prevValueDOMItem2}
          {prevValueDOMItem3}

          <div className="qr-vertical-slider-instructions">
            Scroll or type to change
          </div>
        </div>
      </div>
    );
  }
}

VerticalSlider.propTypes = {
  open: PropTypes.bool,
  value: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  sufix: PropTypes.string,
  prefix: PropTypes.string,
  instructions: PropTypes.string,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
}

VerticalSlider.defaultProps = {
  step: 1,
  value: 0
}

export default VerticalSlider;
