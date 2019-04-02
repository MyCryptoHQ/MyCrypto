import React, { Component } from 'react';
import moment from 'moment';
import CalendarContainer from './CalendarContainer';
import TimeView from './TimeView';
import { ClickableWrapper } from './ClickableWrapper';

enum viewModes {
  YEARS = 'years',
  MONTHS = 'months',
  DAYS = 'days'
}

interface DatepickerFormats {
  date: string;
  datetime: string;
  time: string;
}

export interface DatepickerCommonProps {
  addTime?: any;
  dateFormat?: boolean | string;
  handleClickOutside?: any;
  localMoment?: any;
  renderDay?: any;
  renderInput?: any;
  renderMonth?: any;
  renderYear?: any;
  selectedDate?: moment.Moment | null | undefined;
  setDate?: any;
  setTime?: any;
  showView?: any;
  subtractTime?: any;
  updateSelectedDate?: any;
  timeConstraints?: any;
  timeFormat?: string | boolean;
  value?: any;
  viewDate?: any;

  isValidDate?(current: Date): boolean;
}

interface DatepickerComponentProps {
  className?: string;
  date?: any;
  defaultValue?: Date | string;
  disableCloseOnClickOutside?: boolean;
  displayTimeZone?: any;
  inputProps: {};
  input?: boolean;
  locale?: any;
  open?: boolean;
  renderInput?: any;
  timeConstraints?: {};
  strictParsing?: boolean;
  closeOnSelect?: boolean;
  closeOnTab?: boolean;
  utc?: boolean;
  viewMode?: viewModes;

  onFocus?(e: any): void;
  onBlur?(e: any): void;
  onChange(e: any): void;
  onViewModeChange?(viewMode: viewModes): void;
  onNavigateBack?(amount: any, type: any): void;
  onNavigateForward?(amount: any, type: any): void;
}

type Props = DatepickerCommonProps & DatepickerComponentProps;

interface State {
  currentView?: viewModes;
  updateOn: viewModes;
  inputFormat: string;
  viewDate: moment.Moment;
  selectedDate: moment.Moment | null | undefined;
  inputValue: any;
  open: any;
}

export default class DateTime extends Component<Props, State> {
  public static defaultProps: Props = {
    className: '',
    defaultValue: '',
    inputProps: {},
    input: true,
    onFocus() {
      /**/
    },
    onBlur() {
      /**/
    },
    onChange() {
      /**/
    },
    onViewModeChange() {
      /**/
    },
    onNavigateBack() {
      /**/
    },
    onNavigateForward() {
      /**/
    },
    timeFormat: true,
    timeConstraints: {},
    dateFormat: true,
    strictParsing: true,
    closeOnSelect: false,
    closeOnTab: true,
    utc: false
  };

  public displayName = 'DateTime';
  public overridenEvents: any;
  public tzWarning = false;

  public componentProps = {
    fromProps: [
      'value',
      'isValidDate',
      'renderDay',
      'renderMonth',
      'renderYear',
      'timeConstraints'
    ],
    fromState: ['viewDate', 'selectedDate', 'updateOn'],
    fromThis: [
      'setDate',
      'setTime',
      'showView',
      'addTime',
      'subtractTime',
      'updateSelectedDate',
      'localMoment',
      'handleClickOutside'
    ]
  };

  public allowedSetTime = ['hours', 'minutes', 'seconds', 'milliseconds'];

  constructor(props: Props) {
    super(props);

    this.overridenEvents = {};

    this.state = this.getInitialState();

    this.addTime = this.addTime.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.onInputKey = this.onInputKey.bind(this);
    this.openCalendar = this.openCalendar.bind(this);
    this.setDate = this.setDate.bind(this);
    this.setTime = this.setTime.bind(this);
    this.showView = this.showView.bind(this);
    this.subtractTime = this.subtractTime.bind(this);
    this.updateSelectedDate = this.updateSelectedDate.bind(this);
  }

  public getInitialState() {
    this.checkTZ(this.props);

    const state = this.getStateFromProps(this.props);

    if (state.open === undefined) {
      state.open = !this.props.input;
    }

    state.currentView = this.props.viewMode || state.updateOn || viewModes.DAYS;

    return state;
  }

  public parseDate(date: any, formats: DatepickerFormats) {
    let parsedDate;

    if (date && typeof date === 'string') {
      parsedDate = this.localMoment(date, formats.datetime);
    } else if (date) {
      parsedDate = this.localMoment(date);
    }

    if (parsedDate && !parsedDate.isValid()) {
      parsedDate = null;
    }

    return parsedDate;
  }

  public getStateFromProps(props: Props): State {
    const formats = this.getFormats(props);
    const date = props.value || props.defaultValue;
    let selectedDate;
    let viewDate;
    let updateOn;
    let inputValue;

    selectedDate = this.parseDate(date, formats);

    viewDate = this.parseDate(props.viewDate, formats);

    viewDate = selectedDate
      ? selectedDate.clone().startOf('month')
      : viewDate ? viewDate.clone().startOf('month') : this.localMoment().startOf('month');

    updateOn = this.getUpdateOn(formats);

    if (selectedDate) {
      inputValue = selectedDate.format(formats.datetime);
    } else if (date.isValid && !date.isValid()) {
      inputValue = '';
    } else {
      inputValue = date || '';
    }

    return {
      updateOn,
      inputFormat: formats.datetime,
      viewDate,
      selectedDate,
      inputValue,
      open: props.open
    };
  }

  public getUpdateOn(formats: DatepickerFormats) {
    if (formats.date.match(/[lLD]/)) {
      return viewModes.DAYS;
    } else if (formats.date.indexOf('M') !== -1) {
      return viewModes.MONTHS;
    } else if (formats.date.indexOf('Y') !== -1) {
      return viewModes.YEARS;
    }

    return viewModes.DAYS;
  }

  public getFormats(props: Props): DatepickerFormats {
    const formats: any = {
      date: props.dateFormat || '',
      time: props.timeFormat || ''
    };

    const locale = this.localMoment(props.date, null, props).localeData();

    if (formats.date === true) {
      formats.date = locale.longDateFormat('L');
    } else if (this.getUpdateOn(formats) !== viewModes.DAYS) {
      formats.time = '';
    }

    if (formats.time === true) {
      formats.time = locale.longDateFormat('LT');
    }

    if (typeof formats.date !== 'string' || typeof formats.time !== 'string') {
      return {} as DatepickerFormats;
    }

    formats.datetime =
      formats.date && formats.time
        ? formats.date + ' ' + formats.time
        : formats.date || formats.time;

    return formats as DatepickerFormats;
  }

  public componentWillReceiveProps(nextProps: Props) {
    const formats = this.getFormats(nextProps);

    let updatedState: Partial<State> = {};

    if (
      nextProps.value !== this.props.value ||
      formats.datetime !== this.getFormats(this.props).datetime
    ) {
      updatedState = this.getStateFromProps(nextProps);
    }

    if (updatedState.open === undefined) {
      if (typeof nextProps.open !== 'undefined') {
        updatedState.open = nextProps.open;
      } else if (this.props.closeOnSelect) {
        updatedState.open = false;
      } else {
        updatedState.open = this.state.open;
      }
    }

    if (nextProps.viewMode !== this.props.viewMode) {
      updatedState.currentView = nextProps.viewMode;
    }

    if (nextProps.locale !== this.props.locale) {
      if (this.state.viewDate) {
        const updatedViewDate = this.state.viewDate.clone().locale(nextProps.locale);
        updatedState.viewDate = updatedViewDate;
      }
      if (this.state.selectedDate) {
        const updatedSelectedDate = this.state.selectedDate.clone().locale(nextProps.locale);
        updatedState.selectedDate = updatedSelectedDate;
        updatedState.inputValue = updatedSelectedDate.format(formats.datetime);
      }
    }

    if (
      nextProps.utc !== this.props.utc ||
      nextProps.displayTimeZone !== this.props.displayTimeZone
    ) {
      if (nextProps.utc) {
        if (this.state.viewDate) {
          updatedState.viewDate = this.state.viewDate.clone().utc();
        }
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().utc();
          updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
        }
      } else if (nextProps.displayTimeZone) {
        if (this.state.viewDate) {
          updatedState.viewDate = this.state.viewDate.clone().tz(nextProps.displayTimeZone);
        }
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().tz(nextProps.displayTimeZone);
          updatedState.inputValue = updatedState.selectedDate
            .tz(nextProps.displayTimeZone)
            .format(formats.datetime);
        }
      } else {
        if (this.state.viewDate) {
          updatedState.viewDate = this.state.viewDate.clone().local();
        }
        if (this.state.selectedDate) {
          updatedState.selectedDate = this.state.selectedDate.clone().local();
          updatedState.inputValue = updatedState.selectedDate.format(formats.datetime);
        }
      }
    }

    if (nextProps.viewDate !== this.props.viewDate) {
      updatedState.viewDate = moment(nextProps.viewDate);
    }

    this.checkTZ(nextProps);

    this.setState(updatedState as State);
  }

  public onInputChange(e: any) {
    const value = e.target === null ? e : e.target.value;
    const localMoment = this.localMoment(value, this.state.inputFormat);
    const update: any = { inputValue: value };

    if (localMoment.isValid() && !this.props.value) {
      update.selectedDate = localMoment;
      update.viewDate = localMoment.clone().startOf('month');
    } else {
      update.selectedDate = null;
    }

    return this.setState(update, () => {
      return this.props.onChange(localMoment.isValid() ? localMoment : this.state.inputValue);
    });
  }

  public onInputKey(e: any) {
    if (e.which === 9 && this.props.closeOnTab) {
      this.closeCalendar();
    }
  }

  public showView(view: viewModes) {
    if (this.state.currentView !== view && this.props.onViewModeChange) {
      this.props.onViewModeChange(view);
    }
    this.setState({ currentView: view });
  }

  public setDate(type: any) {
    const me = this;
    const nextViews: any = {
      month: viewModes.DAYS,
      year: viewModes.MONTHS
    };

    return (e: any) => {
      me.setState({
        viewDate: (me.state.viewDate as any)
          .clone()
          [type](parseInt(e.target.getAttribute('data-value'), 10))
          .startOf(type),
        currentView: nextViews[type]
      });

      if (me.props.onViewModeChange) {
        me.props.onViewModeChange(nextViews[type]);
      }
    };
  }

  public subtractTime(amount: any, type: any, toSelected: any) {
    if (this.props.onNavigateBack) {
      this.props.onNavigateBack(amount, type);
    }

    this.updateTime('subtract', amount, type, toSelected);
  }

  public addTime(amount: any, type: any, toSelected: any) {
    if (this.props.onNavigateForward) {
      this.props.onNavigateForward(amount, type);
    }

    this.updateTime('add', amount, type, toSelected);
  }

  public updateTime(op: any, amount: any, type: any, toSelected: any) {
    const update: any = {};
    const date = toSelected ? 'selectedDate' : 'viewDate';

    update[date] = (this.state as any)[date].clone()[op](amount, type);

    this.setState(update);
  }

  public setTime(type: any, value: any) {
    let index = this.allowedSetTime.indexOf(type) + 1;
    const state = this.state;
    const date: any = (state.selectedDate || state.viewDate).clone();
    let nextType;

    // It is needed to set all the time properties
    // to not to reset the time
    date[type](value);
    for (; index < this.allowedSetTime.length; index++) {
      nextType = this.allowedSetTime[index];
      date[nextType](date[nextType]());
    }

    if (!this.props.value) {
      this.setState({
        selectedDate: date,
        inputValue: date.format(state.inputFormat)
      });
    }
    this.props.onChange(date);
  }

  public updateSelectedDate(e: any, close: any) {
    const target = e.currentTarget;
    let modifier = 0;
    const viewDate = this.state.viewDate;
    const currentDate = this.state.selectedDate || viewDate;
    let date: moment.Moment | null | undefined;

    if (target.className.indexOf('rdtDay') !== -1) {
      if (target.className.indexOf('rdtNew') !== -1) {
        modifier = 1;
      } else if (target.className.indexOf('rdtOld') !== -1) {
        modifier = -1;
      }

      date = viewDate
        .clone()
        .month(viewDate.month() + modifier)
        .date(parseInt(target.getAttribute('data-value'), 10));
    } else if (target.className.indexOf('rdtMonth') !== -1) {
      date = viewDate
        .clone()
        .month(parseInt(target.getAttribute('data-value'), 10))
        .date(currentDate.date());
    } else if (target.className.indexOf('rdtYear') !== -1) {
      date = viewDate
        .clone()
        .month(currentDate.month())
        .date(currentDate.date())
        .year(parseInt(target.getAttribute('data-value'), 10));
    }

    if (!date) {
      return;
    }

    date
      .hours(currentDate.hours())
      .minutes(currentDate.minutes())
      .seconds(currentDate.seconds())
      .milliseconds(currentDate.milliseconds());

    if (!this.props.value) {
      const open = !(this.props.closeOnSelect && close);
      if (!open && this.props.onBlur) {
        this.props.onBlur(date);
      }

      this.setState({
        selectedDate: date,
        viewDate: date.clone().startOf('month'),
        inputValue: date.format(this.state.inputFormat),
        open
      });
    } else {
      if (this.props.closeOnSelect && close) {
        this.closeCalendar();
      }
    }

    this.props.onChange(date);
  }

  public openCalendar(e: any) {
    if (!this.state.open) {
      this.setState({ open: true }, () => {
        this.props.onFocus!(e);
      });
    }
  }

  public closeCalendar() {
    this.setState({ open: false }, () => {
      this.props.onBlur!(this.state.selectedDate || this.state.inputValue);
    });
  }

  public handleClickOutside() {
    if (
      this.props.input &&
      this.state.open &&
      this.props.open === undefined &&
      !this.props.disableCloseOnClickOutside
    ) {
      this.setState({ open: false }, () => {
        this.props.onBlur!(this.state.selectedDate || this.state.inputValue);
      });
    }
  }

  public localMoment(date?: any, format?: any, props?: any) {
    props = props || this.props;
    let m: moment.Moment;

    if (props.utc) {
      m = moment.utc(date, format, props.strictParsing);
    } else if (props.displayTimeZone) {
      m = moment.tz(date, format, props.displayTimeZone);
    } else {
      m = moment(date, format, props.strictParsing);
    }

    if (props.locale) {
      m.locale(props.locale);
    }
    return m;
  }

  public checkTZ(props: Props) {
    if (props.displayTimeZone && !this.tzWarning && !moment.tz) {
      this.tzWarning = true;
      console.error(
        'react-datetime: displayTimeZone prop with value "' +
          props.displayTimeZone +
          '" is used but moment.js timezone is not loaded.'
      );
    }
  }

  public getComponentProps(): DatepickerCommonProps {
    const formats = this.getFormats(this.props);
    const props: any = { dateFormat: formats.date, timeFormat: formats.time };

    this.componentProps.fromProps.forEach(name => {
      props[name] = (this.props as any)[name];
    });
    this.componentProps.fromState.forEach(name => {
      props[name] = (this.state as any)[name];
    });
    this.componentProps.fromThis.forEach(name => {
      props[name] = (this as any)[name];
    });

    return props;
  }

  public overrideEvent(handler: any, action: any) {
    if (!this.overridenEvents[handler]) {
      const me = this;
      this.overridenEvents[handler] = (e: any) => {
        let result;
        if (me.props.inputProps && (me.props.inputProps as any)[handler]) {
          result = (me.props.inputProps as any)[handler](e);
        }
        if (result !== false) {
          action(e);
        }
      };
    }

    return this.overridenEvents[handler];
  }

  public getClassName() {
    return (
      'rdt' +
      (this.props.className
        ? Array.isArray(this.props.className)
          ? ' ' + this.props.className.join(' ')
          : ' ' + this.props.className
        : '')
    );
  }

  public render() {
    let className = this.getClassName();
    let finalInputProps;

    if (this.props.input) {
      finalInputProps = Object.assign(
        { type: 'text', className: 'form-control', value: this.state.inputValue },
        this.props.inputProps,
        {
          onClick: this.overrideEvent('onClick', this.openCalendar),
          onFocus: this.overrideEvent('onFocus', this.openCalendar),
          onChange: this.overrideEvent('onChange', this.onInputChange),
          onKeyDown: this.overrideEvent('onKeyDown', this.onInputKey)
        }
      );
    } else {
      className += ' rdtStatic';
    }

    if (this.props.open || (this.props.open === undefined && this.state.open)) {
      className += ' rdtOpen';
    }

    if (!this.state.currentView) {
      return;
    }

    const viewProps = this.getComponentProps();

    return (
      <ClickableWrapper className={className} onClickOut={this.handleClickOutside}>
        {this.props.input && this.props.renderInput ? (
          <div>
            {this.props.renderInput(finalInputProps, this.openCalendar, this.closeCalendar)}
          </div>
        ) : (
          <input {...finalInputProps} />
        )}
        <div className="DateTime">
          <div className="rdtPicker">
            <CalendarContainer view={this.state.currentView} viewProps={viewProps} />
          </div>
          <TimeView {...viewProps} />
        </div>
      </ClickableWrapper>
    );
  }
}
