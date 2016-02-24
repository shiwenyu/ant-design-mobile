/* eslint no-console:0 */

import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import 'rmc-date-picker/assets/popup.css';
import 'rmc-modal/assets/index.css';
import PopupDatePicker from 'rmc-date-picker/lib/Popup';
import React, {PropTypes} from 'react';
import GregorianCalendarFormat from 'gregorian-calendar-format';
import zhCn from 'gregorian-calendar/lib/locale/zh_CN';
import GregorianCalendar from 'gregorian-calendar';

const now = new GregorianCalendar(zhCn);
now.setTime(Date.now());

function getFormatter(type) {
  let formatter;
  if (type === 'time') {
    formatter = new GregorianCalendarFormat('HH:mm');
  } else if (type === 'datetime') {
    formatter = new GregorianCalendarFormat('yyyy-MM-dd HH:mm');
  } else {
    formatter = new GregorianCalendarFormat('yyyy-MM-dd');
  }
  return formatter;
}

const ListDatePicker = React.createClass({
  propTypes: {
    value: PropTypes.string,
    mode: PropTypes.string,
    minDate: PropTypes.string,
    maxDate: PropTypes.string,
    onChange: PropTypes.func,
    format: PropTypes.func
  },
  getDefaultProps() {
    return {
      mode: 'datetime',
      locale: require('rmc-date-picker/lib/locale/zh_CN'),
      format: (val) => {
        return val;
      }
    };
  },
  getInitialState() {
    return {
      date: this.props.value && this.getFormatter().parse(this.props.value, {locale: zhCn}) || now,
      minDate: this.props.minDate && this.getFormatter().parse(this.props.minDate, {locale: zhCn}),
      maxDate: this.props.maxDate && this.getFormatter().parse(this.props.maxDate, {locale: zhCn}),
    };
  },
  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps && nextProps.value !== this.props.value) {
      this.setState({
        date: nextProps.value && this.getFormatter().parse(nextProps.value, {
          locale: zhCn,
        }) || now,
      });
    }

    if ('minDate' in nextProps && nextProps.minDate !== this.props.minDate) {
      this.setState({
        minDate: nextProps.minDate && this.getFormatter().parse(nextProps.minDate, {
          locale: zhCn,
        }),
      });
    }

    if ('maxDate' in nextProps && nextProps.maxDate !== this.props.maxDate) {
      this.setState({
        maxDate: nextProps.maxDate && this.getFormatter().parse(nextProps.maxDate, {
          locale: zhCn,
        }),
      });
    }
  },
  onChange(v){
    this.props.onChange(this.getFormatter().format(v));
  },
  getFormatter() {
    return getFormatter(this.props.mode);
  },
  render() {
    const {date, minDate, maxDate} = this.state;
    let dateStr = this.props.value ? this.props.format(this.props.value) : '请选择';
    const extraProps = {
      extra: dateStr
    };
    return (
      <div>
        <PopupDatePicker {...this.props}
          okText="确定"
          dismissText="取消"
          style={{left: 0, bottom: 0}}
          onChange={this.onChange}
          date={date}
          minDate={minDate}
          maxDate={maxDate}
        >
          {React.cloneElement(this.props.children, extraProps)}
        </PopupDatePicker>
      </div>
    );
  },
});
export default ListDatePicker;
