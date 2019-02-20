/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, ElementRef, ViewChild, EventEmitter, Output, Input, forwardRef, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { LocaleService } from './locale.service';
var /** @type {?} */ moment = _moment;
/** @enum {string} */
var SideEnum = {
    left: 'left',
    right: 'right',
};
export { SideEnum };
var DaterangepickerComponent = /** @class */ (function () {
    function DaterangepickerComponent(el, _ref, _localeService) {
        this.el = el;
        this._ref = _ref;
        this._localeService = _localeService;
        this._old = { start: null, end: null };
        this.calendarVariables = { left: {}, right: {} };
        this.timepickerVariables = { left: {}, right: {} };
        this.daterangepicker = { start: new FormControl(), end: new FormControl() };
        this.applyBtn = { disabled: false };
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.dateLimit = null;
        // used in template for compile time support of enum values.
        this.sideEnum = SideEnum;
        this.minDate = null;
        this.maxDate = null;
        this.autoApply = false;
        this.singleDatePicker = false;
        this.showDropdowns = false;
        this.showWeekNumbers = false;
        this.showISOWeekNumbers = false;
        this.linkedCalendars = false;
        this.autoUpdateInput = true;
        this.alwaysShowCalendars = false;
        this.maxSpan = false;
        // timepicker variables
        this.timePicker = false;
        this.timePicker24Hour = false;
        this.timePickerIncrement = 1;
        this.timePickerSeconds = false;
        // end of timepicker variables
        this.showClearButton = false;
        this.firstMonthDayClass = null;
        this.lastMonthDayClass = null;
        this.emptyWeekRowClass = null;
        this.firstDayOfNextMonthClass = null;
        this.lastDayOfPreviousMonthClass = null;
        this._locale = {};
        // custom ranges
        this._ranges = {};
        this.showCancel = false;
        this.keepCalendarOpeningWithRange = false;
        this.showRangeLabelOnInput = false;
        this.rangesArray = [];
        // some state information
        this.isShown = false;
        this.inline = true;
        this.leftCalendar = {};
        this.rightCalendar = {};
        this.showCalInRanges = false;
        this.options = {}; // should get some opt from user
        this.choosedDate = new EventEmitter();
        this.rangeClicked = new EventEmitter();
        this.datesUpdated = new EventEmitter();
        this.locale = this._localeService.config;
        this.updateMonthsInView();
    }
    Object.defineProperty(DaterangepickerComponent.prototype, "locale", {
        get: /**
         * @return {?}
         */
        function () {
            return this._locale;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._locale = tslib_1.__assign({}, this._localeService.config, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DaterangepickerComponent.prototype, "ranges", {
        get: /**
         * @return {?}
         */
        function () {
            return this._ranges;
        },
        set: /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this._ranges = value;
            this.renderRanges();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    DaterangepickerComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        if (this.locale.firstDay != 0) {
            var /** @type {?} */ iterator = this.locale.firstDay;
            while (iterator > 0) {
                this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                iterator--;
            }
        }
        if (this.inline) {
            this._old.start = this.startDate.clone();
            this._old.end = this.endDate.clone();
        }
        if (!this.locale.format) {
            if (this.timePicker) {
                this.locale.format = moment.localeData().longDateFormat('lll');
            }
            else {
                this.locale.format = moment.localeData().longDateFormat('L');
            }
        }
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        this.renderRanges();
    };
    /**
     * @return {?}
     */
    DaterangepickerComponent.prototype.renderRanges = /**
     * @return {?}
     */
    function () {
        this.rangesArray = [];
        var /** @type {?} */ start, /** @type {?} */ end;
        if (typeof this.ranges === 'object') {
            for (var /** @type {?} */ range in this.ranges) {
                if (typeof this.ranges[range][0] === 'string') {
                    start = moment(this.ranges[range][0], this.locale.format);
                }
                else {
                    start = moment(this.ranges[range][0]);
                }
                if (typeof this.ranges[range][1] === 'string') {
                    end = moment(this.ranges[range][1], this.locale.format);
                }
                else {
                    end = moment(this.ranges[range][1]);
                }
                // If the start or end date exceed those allowed by the minDate or maxSpan
                // options, shorten the range to the allowable period.
                if (this.minDate && start.isBefore(this.minDate)) {
                    start = this.minDate.clone();
                }
                var /** @type {?} */ maxDate = this.maxDate;
                if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) {
                    maxDate = start.clone().add(this.maxSpan);
                }
                if (maxDate && end.isAfter(maxDate)) {
                    end = maxDate.clone();
                }
                // If the end of the range is before the minimum or the start of the range is
                // after the maximum, don't display this range option at all.
                if ((this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day'))
                    || (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))) {
                    continue;
                }
                //Support unicode chars in the range names.
                var /** @type {?} */ elem = document.createElement('textarea');
                elem.innerHTML = range;
                var /** @type {?} */ rangeHtml = elem.value;
                this.ranges[rangeHtml] = [start, end];
            }
            if (this.showCustomRangeLabel) {
                this.rangesArray.push(this.locale.customRangeLabel);
            }
            for (var /** @type {?} */ range in this.ranges) {
                this.rangesArray.push(range);
            }
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate = this.startDate.startOf('day');
                this.endDate = this.endDate.endOf('day');
            }
            // can't be used together for now
            if (this.timePicker && this.autoApply) {
                this.autoApply = false;
            }
        }
    };
    /**
     * @param {?} side
     * @return {?}
     */
    DaterangepickerComponent.prototype.renderTimePicker = /**
     * @param {?} side
     * @return {?}
     */
    function (side) {
        if (side == SideEnum.right && !this.endDate) {
            return;
        }
        var /** @type {?} */ selected, /** @type {?} */ minDate;
        var /** @type {?} */ maxDate = this.maxDate;
        if (side === SideEnum.left) {
            selected = this.startDate.clone(),
                minDate = this.minDate;
        }
        else if (side === SideEnum.right) {
            selected = this.endDate.clone(),
                minDate = this.startDate;
        }
        var /** @type {?} */ start = this.timePicker24Hour ? 0 : 1;
        var /** @type {?} */ end = this.timePicker24Hour ? 23 : 12;
        this.timepickerVariables[side] = {
            hours: [],
            minutes: [],
            minutesLabel: [],
            seconds: [],
            secondsLabel: [],
            disabledHours: [],
            disabledMinutes: [],
            disabledSeconds: [],
            selectedHour: 0,
            selectedMinute: 0,
            selectedSecond: 0,
        };
        // generate hours
        for (var /** @type {?} */ i_1 = start; i_1 <= end; i_1++) {
            var /** @type {?} */ i_in_24 = i_1;
            if (!this.timePicker24Hour) {
                i_in_24 = selected.hour() >= 12 ? (i_1 == 12 ? 12 : i_1 + 12) : (i_1 == 12 ? 0 : i_1);
            }
            var /** @type {?} */ time_1 = selected.clone().hour(i_in_24);
            var /** @type {?} */ disabled_1 = false;
            if (minDate && time_1.minute(59).isBefore(minDate)) {
                disabled_1 = true;
            }
            if (maxDate && time_1.minute(0).isAfter(maxDate)) {
                disabled_1 = true;
            }
            this.timepickerVariables[side].hours.push(i_1);
            if (i_in_24 == selected.hour() && !disabled_1) {
                this.timepickerVariables[side].selectedHour = i_1;
            }
            else if (disabled_1) {
                this.timepickerVariables[side].disabledHours.push(i_1);
            }
        }
        // generate minutes
        for (var /** @type {?} */ i = 0; i < 60; i += this.timePickerIncrement) {
            var /** @type {?} */ padded = i < 10 ? '0' + i : i;
            var /** @type {?} */ time = selected.clone().minute(i);
            var /** @type {?} */ disabled = false;
            if (minDate && time.second(59).isBefore(minDate)) {
                disabled = true;
            }
            if (maxDate && time.second(0).isAfter(maxDate)) {
                disabled = true;
            }
            this.timepickerVariables[side].minutes.push(i);
            this.timepickerVariables[side].minutesLabel.push(padded);
            if (selected.minute() == i && !disabled) {
                this.timepickerVariables[side].selectedMinute = i;
            }
            else if (disabled) {
                this.timepickerVariables[side].disabledMinutes.push(i);
            }
        }
        // generate seconds
        if (this.timePickerSeconds) {
            for (var /** @type {?} */ i = 0; i < 60; i++) {
                var /** @type {?} */ padded = i < 10 ? '0' + i : i;
                var /** @type {?} */ time = selected.clone().second(i);
                var /** @type {?} */ disabled = false;
                if (minDate && time.isBefore(minDate)) {
                    disabled = true;
                }
                if (maxDate && time.isAfter(maxDate)) {
                    disabled = true;
                }
                this.timepickerVariables[side].seconds.push(i);
                this.timepickerVariables[side].secondsLabel.push(padded);
                if (selected.second() == i && !disabled) {
                    this.timepickerVariables[side].selectedSecond = i;
                }
                else if (disabled) {
                    this.timepickerVariables[side].disabledSeconds.push(i);
                }
            }
        }
        // generate AM/PM
        if (!this.timePicker24Hour) {
            var /** @type {?} */ am_html = '';
            var /** @type {?} */ pm_html = '';
            if (minDate && selected.clone().hour(12).minute(0).second(0).isBefore(minDate)) {
                this.timepickerVariables[side].amDisabled = true;
            }
            if (maxDate && selected.clone().hour(0).minute(0).second(0).isAfter(maxDate)) {
                this.timepickerVariables[side].pmDisabled = true;
            }
            if (selected.hour() >= 12) {
                this.timepickerVariables[side].ampmModel = 'PM';
            }
            else {
                this.timepickerVariables[side].ampmModel = 'AM';
            }
        }
        this.timepickerVariables[side].selected = selected;
    };
    /**
     * @param {?} side
     * @return {?}
     */
    DaterangepickerComponent.prototype.renderCalendar = /**
     * @param {?} side
     * @return {?}
     */
    function (side) {
        // side enum
        var /** @type {?} */ mainCalendar = (side === SideEnum.left) ? this.leftCalendar : this.rightCalendar;
        var /** @type {?} */ month = mainCalendar.month.month();
        var /** @type {?} */ year = mainCalendar.month.year();
        var /** @type {?} */ hour = mainCalendar.month.hour();
        var /** @type {?} */ minute = mainCalendar.month.minute();
        var /** @type {?} */ second = mainCalendar.month.second();
        var /** @type {?} */ daysInMonth = moment([year, month]).daysInMonth();
        var /** @type {?} */ firstDay = moment([year, month, 1]);
        var /** @type {?} */ lastDay = moment([year, month, daysInMonth]);
        var /** @type {?} */ lastMonth = moment(firstDay).subtract(1, 'month').month();
        var /** @type {?} */ lastYear = moment(firstDay).subtract(1, 'month').year();
        var /** @type {?} */ daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();
        var /** @type {?} */ dayOfWeek = firstDay.day();
        // initialize a 6 rows x 7 columns array for the calendar
        var /** @type {?} */ calendar = [];
        calendar.firstDay = firstDay;
        calendar.lastDay = lastDay;
        for (var /** @type {?} */ i = 0; i < 6; i++) {
            calendar[i] = [];
        }
        // populate the calendar with date objects
        var /** @type {?} */ startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
        if (startDay > daysInLastMonth) {
            startDay -= 7;
        }
        if (dayOfWeek === this.locale.firstDay) {
            startDay = daysInLastMonth - 6;
        }
        var /** @type {?} */ curDate = moment([lastYear, lastMonth, startDay, 12, minute, second]);
        for (var /** @type {?} */ i = 0, /** @type {?} */ col = 0, /** @type {?} */ row = 0; i < 42; i++, col++, curDate = moment(curDate).add(24, 'hour')) {
            if (i > 0 && col % 7 === 0) {
                col = 0;
                row++;
            }
            calendar[row][col] = curDate.clone().hour(hour).minute(minute).second(second);
            curDate.hour(12);
            if (this.minDate && calendar[row][col].format('YYYY-MM-DD') === this.minDate.format('YYYY-MM-DD') &&
                calendar[row][col].isBefore(this.minDate) && side === 'left') {
                calendar[row][col] = this.minDate.clone();
            }
            if (this.maxDate && calendar[row][col].format('YYYY-MM-DD') === this.maxDate.format('YYYY-MM-DD') &&
                calendar[row][col].isAfter(this.maxDate) && side === 'right') {
                calendar[row][col] = this.maxDate.clone();
            }
        }
        // make the calendar object available to hoverDate/clickDate
        if (side === SideEnum.left) {
            this.leftCalendar.calendar = calendar;
        }
        else {
            this.rightCalendar.calendar = calendar;
        }
        //
        // Display the calendar
        //
        var /** @type {?} */ minDate = side === 'left' ? this.minDate : this.startDate;
        var /** @type {?} */ maxDate = this.maxDate;
        // adjust maxDate to reflect the dateLimit setting in order to
        // grey out end dates beyond the dateLimit
        if (this.endDate === null && this.dateLimit) {
            var /** @type {?} */ maxLimit = this.startDate.clone().add(this.dateLimit).endOf('day');
            if (!maxDate || maxLimit.isBefore(maxDate)) {
                maxDate = maxLimit;
            }
        }
        this.calendarVariables[side] = {
            month: month,
            year: year,
            hour: hour,
            minute: minute,
            second: second,
            daysInMonth: daysInMonth,
            firstDay: firstDay,
            lastDay: lastDay,
            lastMonth: lastMonth,
            lastYear: lastYear,
            daysInLastMonth: daysInLastMonth,
            dayOfWeek: dayOfWeek,
            // other vars
            calRows: Array.from(Array(6).keys()),
            calCols: Array.from(Array(7).keys()),
            classes: {},
            minDate: minDate,
            maxDate: maxDate,
            calendar: calendar
        };
        if (this.showDropdowns) {
            var /** @type {?} */ currentMonth = calendar[1][1].month();
            var /** @type {?} */ currentYear = calendar[1][1].year();
            var /** @type {?} */ maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
            var /** @type {?} */ minYear = (minDate && minDate.year()) || (currentYear - 50);
            var /** @type {?} */ inMinYear = currentYear === minYear;
            var /** @type {?} */ inMaxYear = currentYear === maxYear;
            var /** @type {?} */ years = [];
            for (var /** @type {?} */ y = minYear; y <= maxYear; y++) {
                years.push(y);
            }
            this.calendarVariables[side].dropdowns = {
                currentMonth: currentMonth,
                currentYear: currentYear,
                maxYear: maxYear,
                minYear: minYear,
                inMinYear: inMinYear,
                inMaxYear: inMaxYear,
                monthArrays: Array.from(Array(12).keys()),
                yearArrays: years
            };
        }
        this._buildCells(calendar, side);
    };
    /**
     * @param {?} startDate
     * @return {?}
     */
    DaterangepickerComponent.prototype.setStartDate = /**
     * @param {?} startDate
     * @return {?}
     */
    function (startDate) {
        if (typeof startDate === 'string') {
            this.startDate = moment(startDate, this.locale.format);
        }
        if (typeof startDate === 'object') {
            this.startDate = moment(startDate);
        }
        if (!this.timePicker) {
            this.startDate = this.startDate.startOf('day');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        if (this.minDate && this.startDate.isBefore(this.minDate)) {
            this.startDate = this.minDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
            this.startDate = this.maxDate.clone();
            if (this.timePicker && this.timePickerIncrement) {
                this.startDate.minute(Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
            }
        }
        if (!this.isShown) {
            this.updateElement();
        }
        this.updateMonthsInView();
    };
    /**
     * @param {?} endDate
     * @return {?}
     */
    DaterangepickerComponent.prototype.setEndDate = /**
     * @param {?} endDate
     * @return {?}
     */
    function (endDate) {
        if (typeof endDate === 'string') {
            this.endDate = moment(endDate, this.locale.format);
        }
        if (typeof endDate === 'object') {
            this.endDate = moment(endDate);
        }
        if (!this.timePicker) {
            this.endDate = this.endDate.add(1, 'd').startOf('day').subtract(1, 'second');
        }
        if (this.timePicker && this.timePickerIncrement) {
            this.endDate.minute(Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement);
        }
        if (this.endDate.isBefore(this.startDate)) {
            this.endDate = this.startDate.clone();
        }
        if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
            this.endDate = this.maxDate.clone();
        }
        if (this.dateLimit && this.startDate.clone().add(this.dateLimit).isBefore(this.endDate)) {
            this.endDate = this.startDate.clone().add(this.dateLimit);
        }
        if (!this.isShown) {
            // this.updateElement();
        }
        this.updateMonthsInView();
    };
    /**
     * @param {?} date
     * @return {?}
     */
    DaterangepickerComponent.prototype.isInvalidDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return false;
    };
    /**
     * @param {?} date
     * @return {?}
     */
    DaterangepickerComponent.prototype.isCustomDate = /**
     * @param {?} date
     * @return {?}
     */
    function (date) {
        return false;
    };
    /**
     * @return {?}
     */
    DaterangepickerComponent.prototype.updateView = /**
     * @return {?}
     */
    function () {
        if (this.timePicker) {
            this.renderTimePicker(SideEnum.left);
            this.renderTimePicker(SideEnum.right);
        }
        this.updateMonthsInView();
        this.updateCalendars();
    };
    /**
     * @return {?}
     */
    DaterangepickerComponent.prototype.updateMonthsInView = /**
     * @return {?}
     */
    function () {
        if (this.endDate) {
            // if both dates are visible already, do nothing
            if (!this.singleDatePicker && this.leftCalendar.month && this.rightCalendar.month &&
                ((this.startDate && this.leftCalendar && this.startDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM')) ||
                    (this.startDate && this.rightCalendar && this.startDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM')))
                &&
                    (this.endDate.format('YYYY-MM') === this.leftCalendar.month.format('YYYY-MM') ||
                        this.endDate.format('YYYY-MM') === this.rightCalendar.month.format('YYYY-MM'))) {
                return;
            }
            if (this.startDate) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                if (!this.linkedCalendars && (this.endDate.month() !== this.startDate.month() ||
                    this.endDate.year() !== this.startDate.year())) {
                    this.rightCalendar.month = this.endDate.clone().date(2);
                }
                else {
                    this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
                }
            }
        }
        else {
            if (this.leftCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM') &&
                this.rightCalendar.month.format('YYYY-MM') !== this.startDate.format('YYYY-MM')) {
                this.leftCalendar.month = this.startDate.clone().date(2);
                this.rightCalendar.month = this.startDate.clone().date(2).add(1, 'month');
            }
        }
        if (this.maxDate && this.linkedCalendars && !this.singleDatePicker && this.rightCalendar.month > this.maxDate) {
            this.rightCalendar.month = this.maxDate.clone().date(2);
            this.leftCalendar.month = this.maxDate.clone().date(2).subtract(1, 'month');
        }
    };
    /**
     *  This is responsible for updating the calendars
     */
    /**
     *  This is responsible for updating the calendars
     * @return {?}
     */
    DaterangepickerComponent.prototype.updateCalendars = /**
     *  This is responsible for updating the calendars
     * @return {?}
     */
    function () {
        this.renderCalendar(SideEnum.left);
        this.renderCalendar(SideEnum.right);
        if (this.endDate === null) {
            return;
        }
        this.calculateChosenLabel();
    };
    /**
     * @return {?}
     */
    DaterangepickerComponent.prototype.updateElement = /**
     * @return {?}
     */
    function () {
        if (!this.singleDatePicker && this.autoUpdateInput) {
            if (this.startDate && this.endDate) {
                // if we use ranges and should show range label on inpu
                if (this.rangesArray.length && this.showRangeLabelOnInput === true && this.chosenRange &&
                    this.locale.customRangeLabel !== this.chosenRange) {
                    this.chosenLabel = this.chosenRange;
                }
                else {
                    this.chosenLabel = this.startDate.format(this.locale.format) +
                        this.locale.separator + this.endDate.format(this.locale.format);
                }
            }
        }
        else if (this.autoUpdateInput) {
            this.chosenLabel = this.startDate.format(this.locale.format);
        }
    };
    /**
     * @return {?}
     */
    DaterangepickerComponent.prototype.remove = /**
     * @return {?}
     */
    function () {
        this.isShown = false;
    };
    /**
     * this should calculate the label
     */
    /**
     * this should calculate the label
     * @return {?}
     */
    DaterangepickerComponent.prototype.calculateChosenLabel = /**
     * this should calculate the label
     * @return {?}
     */
    function () {
        var /** @type {?} */ customRange = true;
        var /** @type {?} */ i = 0;
        if (this.rangesArray.length > 0) {
            for (var /** @type {?} */ range in this.ranges) {
                if (this.timePicker) {
                    var /** @type {?} */ format = this.timePickerSeconds ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD HH:mm";
                    //ignore times when comparing dates if time picker seconds is not enabled
                    if (this.startDate.format(format) == this.ranges[range][0].format(format) && this.endDate.format(format) == this.ranges[range][1].format(format)) {
                        customRange = false;
                        this.chosenRange = this.rangesArray[i + 1];
                        break;
                    }
                }
                else {
                    //ignore times when comparing dates if time picker is not enabled
                    if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
                        customRange = false;
                        this.chosenRange = this.rangesArray[i + 1];
                        break;
                    }
                }
                i++;
            }
            if (customRange) {
                if (this.showCustomRangeLabel) {
                    this.chosenRange = this.locale.customRangeLabel;
                }
                else {
                    this.chosenRange = null;
                }
                // if custom label: show calenar
                this.showCalInRanges = true;
            }
        }
        this.updateElement();
    };
    /**
     * @param {?=} e
     * @return {?}
     */
    DaterangepickerComponent.prototype.clickApply = /**
     * @param {?=} e
     * @return {?}
     */
    function (e) {
        if (!this.singleDatePicker && this.startDate && !this.endDate) {
            this.endDate = this.startDate.clone();
            this.calculateChosenLabel();
        }
        if (this.isInvalidDate && this.startDate && this.endDate) {
            // get if there are invalid date between range
            var /** @type {?} */ d = this.startDate.clone();
            while (d.isBefore(this.endDate)) {
                if (this.isInvalidDate(d)) {
                    this.endDate = d.subtract(1, 'days');
                    this.calculateChosenLabel();
                    break;
                }
                d.add(1, 'days');
            }
        }
        if (this.chosenLabel) {
            this.choosedDate.emit({ chosenLabel: this.chosenLabel, startDate: this.startDate, endDate: this.endDate });
        }
        this.datesUpdated.emit({ startDate: this.startDate, endDate: this.endDate });
        this.hide();
    };
    /**
     * @param {?} e
     * @return {?}
     */
    DaterangepickerComponent.prototype.clickCancel = /**
     * @param {?} e
     * @return {?}
     */
    function (e) {
        this.startDate = this._old.start;
        this.endDate = this._old.end;
        if (this.inline) {
            this.updateView();
        }
        this.hide();
    };
    /**
     * called when month is changed
     * @param monthEvent get value in event.target.value
     * @param side left or right
     */
    /**
     * called when month is changed
     * @param {?} monthEvent get value in event.target.value
     * @param {?} side left or right
     * @return {?}
     */
    DaterangepickerComponent.prototype.monthChanged = /**
     * called when month is changed
     * @param {?} monthEvent get value in event.target.value
     * @param {?} side left or right
     * @return {?}
     */
    function (monthEvent, side) {
        var /** @type {?} */ year = this.calendarVariables[side].dropdowns.currentYear;
        var /** @type {?} */ month = parseInt(monthEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    };
    /**
     * called when year is changed
     * @param yearEvent get value in event.target.value
     * @param side left or right
     */
    /**
     * called when year is changed
     * @param {?} yearEvent get value in event.target.value
     * @param {?} side left or right
     * @return {?}
     */
    DaterangepickerComponent.prototype.yearChanged = /**
     * called when year is changed
     * @param {?} yearEvent get value in event.target.value
     * @param {?} side left or right
     * @return {?}
     */
    function (yearEvent, side) {
        var /** @type {?} */ month = this.calendarVariables[side].dropdowns.currentMonth;
        var /** @type {?} */ year = parseInt(yearEvent.target.value, 10);
        this.monthOrYearChanged(month, year, side);
    };
    /**
     * called when time is changed
     * @param timeEvent  an event
     * @param side left or right
     */
    /**
     * called when time is changed
     * @param {?} timeEvent  an event
     * @param {?} side left or right
     * @return {?}
     */
    DaterangepickerComponent.prototype.timeChanged = /**
     * called when time is changed
     * @param {?} timeEvent  an event
     * @param {?} side left or right
     * @return {?}
     */
    function (timeEvent, side) {
        var /** @type {?} */ hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        var /** @type {?} */ minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        var /** @type {?} */ second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        if (!this.timePicker24Hour) {
            var /** @type {?} */ ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12)
                hour += 12;
            if (ampm === 'AM' && hour === 12)
                hour = 0;
        }
        if (side === SideEnum.left) {
            var /** @type {?} */ start = this.startDate.clone();
            start.hour(hour);
            start.minute(minute);
            start.second(second);
            this.setStartDate(start);
            if (this.singleDatePicker) {
                this.endDate = this.startDate.clone();
            }
            else if (this.endDate && this.endDate.format('YYYY-MM-DD') == start.format('YYYY-MM-DD') && this.endDate.isBefore(start)) {
                this.setEndDate(start.clone());
            }
        }
        else if (this.endDate) {
            var /** @type {?} */ end = this.endDate.clone();
            end.hour(hour);
            end.minute(minute);
            end.second(second);
            this.setEndDate(end);
        }
        //update the calendars so all clickable dates reflect the new time component
        this.updateCalendars();
        //re-render the time pickers because changing one selection can affect what's enabled in another
        this.renderTimePicker(SideEnum.left);
        this.renderTimePicker(SideEnum.right);
    };
    /**
     *  call when month or year changed
     * @param month month number 0 -11
     * @param year year eg: 1995
     * @param side left or right
     */
    /**
     *  call when month or year changed
     * @param {?} month month number 0 -11
     * @param {?} year year eg: 1995
     * @param {?} side left or right
     * @return {?}
     */
    DaterangepickerComponent.prototype.monthOrYearChanged = /**
     *  call when month or year changed
     * @param {?} month month number 0 -11
     * @param {?} year year eg: 1995
     * @param {?} side left or right
     * @return {?}
     */
    function (month, year, side) {
        var /** @type {?} */ isLeft = side === SideEnum.left;
        if (!isLeft) {
            if (year < this.startDate.year() || (year === this.startDate.year() && month < this.startDate.month())) {
                month = this.startDate.month();
                year = this.startDate.year();
            }
        }
        if (this.minDate) {
            if (year < this.minDate.year() || (year === this.minDate.year() && month < this.minDate.month())) {
                month = this.minDate.month();
                year = this.minDate.year();
            }
        }
        if (this.maxDate) {
            if (year > this.maxDate.year() || (year === this.maxDate.year() && month > this.maxDate.month())) {
                month = this.maxDate.month();
                year = this.maxDate.year();
            }
        }
        this.calendarVariables[side].dropdowns.currentYear = year;
        this.calendarVariables[side].dropdowns.currentMonth = month;
        if (isLeft) {
            this.leftCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.rightCalendar.month = this.leftCalendar.month.clone().add(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.month(month).year(year);
            if (this.linkedCalendars) {
                this.leftCalendar.month = this.rightCalendar.month.clone().subtract(1, 'month');
            }
        }
        this.updateCalendars();
    };
    /**
     * Click on previous month
     * @param side left or right calendar
     */
    /**
     * Click on previous month
     * @param {?} side left or right calendar
     * @return {?}
     */
    DaterangepickerComponent.prototype.clickPrev = /**
     * Click on previous month
     * @param {?} side left or right calendar
     * @return {?}
     */
    function (side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.subtract(1, 'month');
            if (this.linkedCalendars) {
                this.rightCalendar.month.subtract(1, 'month');
            }
        }
        else {
            this.rightCalendar.month.subtract(1, 'month');
        }
        this.updateCalendars();
    };
    /**
     * Click on next month
     * @param side left or right calendar
     */
    /**
     * Click on next month
     * @param {?} side left or right calendar
     * @return {?}
     */
    DaterangepickerComponent.prototype.clickNext = /**
     * Click on next month
     * @param {?} side left or right calendar
     * @return {?}
     */
    function (side) {
        if (side === SideEnum.left) {
            this.leftCalendar.month.add(1, 'month');
        }
        else {
            this.rightCalendar.month.add(1, 'month');
            if (this.linkedCalendars) {
                this.leftCalendar.month.add(1, 'month');
            }
        }
        this.updateCalendars();
    };
    /**
     * When selecting a date
     * @param e event: get value by e.target.value
     * @param side left or right
     * @param row row position of the current date clicked
     * @param col col position of the current date clicked
     */
    /**
     * When selecting a date
     * @param {?} e event: get value by e.target.value
     * @param {?} side left or right
     * @param {?} row row position of the current date clicked
     * @param {?} col col position of the current date clicked
     * @return {?}
     */
    DaterangepickerComponent.prototype.clickDate = /**
     * When selecting a date
     * @param {?} e event: get value by e.target.value
     * @param {?} side left or right
     * @param {?} row row position of the current date clicked
     * @param {?} col col position of the current date clicked
     * @return {?}
     */
    function (e, side, row, col) {
        if (e.target.tagName === 'TD') {
            if (!e.target.classList.contains('available')) {
                return;
            }
        }
        else if (e.target.tagName === 'SPAN') {
            if (!e.target.parentElement.classList.contains('available')) {
                return;
            }
        }
        if (this.rangesArray.length) {
            this.chosenRange = this.locale.customRangeLabel;
        }
        var /** @type {?} */ date = side === SideEnum.left ? this.leftCalendar.calendar[row][col] : this.rightCalendar.calendar[row][col];
        if (this.endDate || date.isBefore(this.startDate, 'day')) { // picking start
            // picking start
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.left);
            }
            this.endDate = null;
            this.setStartDate(date.clone());
        }
        else if (!this.endDate && date.isBefore(this.startDate)) {
            // special case: clicking the same date for start/end,
            // but the time of the end date is before the start date
            this.setEndDate(this.startDate.clone());
        }
        else { // picking end
            // picking end
            if (this.timePicker) {
                date = this._getDateWithTime(date, SideEnum.right);
            }
            this.setEndDate(date.clone());
            if (this.autoApply) {
                this.calculateChosenLabel();
                this.clickApply();
            }
        }
        if (this.singleDatePicker) {
            this.setEndDate(this.startDate);
            this.updateElement();
            if (this.autoApply) {
                this.clickApply();
            }
        }
        this.updateView();
        // This is to cancel the blur event handler if the mouse was in one of the inputs
        e.stopPropagation();
    };
    /**
     *  Click on the custom range
     * @param e: Event
     * @param label
     */
    /**
     *  Click on the custom range
     * @param {?} e
     * @param {?} label
     * @return {?}
     */
    DaterangepickerComponent.prototype.clickRange = /**
     *  Click on the custom range
     * @param {?} e
     * @param {?} label
     * @return {?}
     */
    function (e, label) {
        this.chosenRange = label;
        if (label == this.locale.customRangeLabel) {
            this.isShown = true; // show calendars
            this.showCalInRanges = true;
        }
        else {
            var /** @type {?} */ dates = this.ranges[label];
            this.startDate = dates[0].clone();
            this.endDate = dates[1].clone();
            if (this.showRangeLabelOnInput && label !== this.locale.customRangeLabel) {
                this.chosenLabel = label;
            }
            else {
                this.calculateChosenLabel();
            }
            this.showCalInRanges = (!this.rangesArray.length) || this.alwaysShowCalendars;
            if (!this.timePicker) {
                this.startDate.startOf('day');
                this.endDate.endOf('day');
            }
            if (!this.alwaysShowCalendars) {
                this.isShown = false; // hide calendars
            }
            this.rangeClicked.emit({ label: label, dates: dates });
            if (!this.keepCalendarOpeningWithRange) {
                this.clickApply();
            }
            else {
                this.renderCalendar(SideEnum.left);
                this.renderCalendar(SideEnum.right);
                if (this.timePicker) {
                    this.renderTimePicker(SideEnum.left);
                    this.renderTimePicker(SideEnum.right);
                }
            }
        }
    };
    ;
    /**
     * @param {?=} e
     * @return {?}
     */
    DaterangepickerComponent.prototype.show = /**
     * @param {?=} e
     * @return {?}
     */
    function (e) {
        if (this.isShown) {
            return;
        }
        this._old.start = this.startDate.clone();
        this._old.end = this.endDate.clone();
        this.isShown = true;
        this.updateView();
    };
    /**
     * @param {?=} e
     * @return {?}
     */
    DaterangepickerComponent.prototype.hide = /**
     * @param {?=} e
     * @return {?}
     */
    function (e) {
        if (!this.isShown) {
            return;
        }
        // incomplete date selection, revert to last values
        if (!this.endDate) {
            if (this._old.start) {
                this.startDate = this._old.start.clone();
            }
            if (this._old.end) {
                this.endDate = this._old.end.clone();
            }
        }
        // if a new date range was selected, invoke the user callback function
        if (!this.startDate.isSame(this._old.start) || !this.endDate.isSame(this._old.end)) {
            // this.callback(this.startDate, this.endDate, this.chosenLabel);
        }
        // if picker is attached to a text input, update it
        this.updateElement();
        this.isShown = false;
        this._ref.detectChanges();
    };
    /**
     * handle click on all element in the component, usefull for outside of click
     * @param e event
     */
    /**
     * handle click on all element in the component, usefull for outside of click
     * @param {?} e event
     * @return {?}
     */
    DaterangepickerComponent.prototype.handleInternalClick = /**
     * handle click on all element in the component, usefull for outside of click
     * @param {?} e event
     * @return {?}
     */
    function (e) {
        e.stopPropagation();
    };
    /**
     * update the locale options
     * @param locale
     */
    /**
     * update the locale options
     * @param {?} locale
     * @return {?}
     */
    DaterangepickerComponent.prototype.updateLocale = /**
     * update the locale options
     * @param {?} locale
     * @return {?}
     */
    function (locale) {
        for (var /** @type {?} */ key in locale) {
            if (locale.hasOwnProperty(key)) {
                this.locale[key] = locale[key];
            }
        }
    };
    /**
     *  clear the daterange picker
     */
    /**
     *  clear the daterange picker
     * @return {?}
     */
    DaterangepickerComponent.prototype.clear = /**
     *  clear the daterange picker
     * @return {?}
     */
    function () {
        this.startDate = moment().startOf('day');
        this.endDate = moment().endOf('day');
        this.choosedDate.emit({ chosenLabel: '', startDate: null, endDate: null });
        this.datesUpdated.emit({ startDate: null, endDate: null });
        this.hide();
    };
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     */
    /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     * @param {?} range
     * @return {?}
     */
    DaterangepickerComponent.prototype.disableRange = /**
     * Find out if the selected range should be disabled if it doesn't
     * fit into minDate and maxDate limitations.
     * @param {?} range
     * @return {?}
     */
    function (range) {
        var _this = this;
        if (range === this.locale.customRangeLabel) {
            return false;
        }
        var /** @type {?} */ rangeMarkers = this.ranges[range];
        var /** @type {?} */ areBothBefore = rangeMarkers.every(function (date) {
            if (!_this.minDate) {
                return false;
            }
            return date.isBefore(_this.minDate);
        });
        var /** @type {?} */ areBothAfter = rangeMarkers.every(function (date) {
            if (!_this.maxDate) {
                return false;
            }
            return date.isAfter(_this.maxDate);
        });
        return (areBothBefore || areBothAfter);
    };
    /**
     *
     * @param {?} date the date to add time
     * @param {?} side left or right
     * @return {?}
     */
    DaterangepickerComponent.prototype._getDateWithTime = /**
     *
     * @param {?} date the date to add time
     * @param {?} side left or right
     * @return {?}
     */
    function (date, side) {
        var /** @type {?} */ hour = parseInt(this.timepickerVariables[side].selectedHour, 10);
        if (!this.timePicker24Hour) {
            var /** @type {?} */ ampm = this.timepickerVariables[side].ampmModel;
            if (ampm === 'PM' && hour < 12)
                hour += 12;
            if (ampm === 'AM' && hour === 12)
                hour = 0;
        }
        var /** @type {?} */ minute = parseInt(this.timepickerVariables[side].selectedMinute, 10);
        var /** @type {?} */ second = this.timePickerSeconds ? parseInt(this.timepickerVariables[side].selectedSecond, 10) : 0;
        return date.clone().hour(hour).minute(minute).second(second);
    };
    /**
     * @param {?} calendar
     * @param {?} side
     * @return {?}
     */
    DaterangepickerComponent.prototype._buildCells = /**
     * @param {?} calendar
     * @param {?} side
     * @return {?}
     */
    function (calendar, side) {
        for (var /** @type {?} */ row = 0; row < 6; row++) {
            this.calendarVariables[side].classes[row] = {};
            var /** @type {?} */ rowClasses = [];
            if (this.emptyWeekRowClass && !this.hasCurrentMonthDays(this.calendarVariables[side].month, calendar[row])) {
                rowClasses.push(this.emptyWeekRowClass);
            }
            for (var /** @type {?} */ col = 0; col < 7; col++) {
                var /** @type {?} */ classes = [];
                // highlight today's date
                if (calendar[row][col].isSame(new Date(), 'day')) {
                    classes.push('today');
                }
                // highlight weekends
                if (calendar[row][col].isoWeekday() > 5) {
                    classes.push('weekend');
                }
                // grey out the dates in other months displayed at beginning and end of this calendar
                if (calendar[row][col].month() !== calendar[1][1].month()) {
                    classes.push('off');
                    // mark the last day of the previous month in this calendar
                    if (this.lastDayOfPreviousMonthClass && (calendar[row][col].month() < calendar[1][1].month() || calendar[1][1].month() === 0) && calendar[row][col].date() === this.calendarVariables[side].daysInLastMonth) {
                        classes.push(this.lastDayOfPreviousMonthClass);
                    }
                    // mark the first day of the next month in this calendar
                    if (this.firstDayOfNextMonthClass && (calendar[row][col].month() > calendar[1][1].month() || calendar[row][col].month() === 0) && calendar[row][col].date() === 1) {
                        classes.push(this.firstDayOfNextMonthClass);
                    }
                }
                // mark the first day of the current month with a custom class
                if (this.firstMonthDayClass && calendar[row][col].month() === calendar[1][1].month() && calendar[row][col].date() === calendar.firstDay.date()) {
                    classes.push(this.firstMonthDayClass);
                }
                // mark the last day of the current month with a custom class
                if (this.lastMonthDayClass && calendar[row][col].month() === calendar[1][1].month() && calendar[row][col].date() === calendar.lastDay.date()) {
                    classes.push(this.lastMonthDayClass);
                }
                // don't allow selection of dates before the minimum date
                if (this.minDate && calendar[row][col].isBefore(this.minDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of dates after the maximum date
                if (this.calendarVariables[side].maxDate && calendar[row][col].isAfter(this.calendarVariables[side].maxDate, 'day')) {
                    classes.push('off', 'disabled');
                }
                // don't allow selection of date if a custom function decides it's invalid
                if (this.isInvalidDate(calendar[row][col])) {
                    classes.push('off', 'disabled');
                }
                // highlight the currently selected start date
                if (this.startDate && calendar[row][col].format('YYYY-MM-DD') === this.startDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'start-date');
                }
                // highlight the currently selected end date
                if (this.endDate != null && calendar[row][col].format('YYYY-MM-DD') === this.endDate.format('YYYY-MM-DD')) {
                    classes.push('active', 'end-date');
                }
                // highlight dates in-between the selected dates
                if (this.endDate != null && calendar[row][col] > this.startDate && calendar[row][col] < this.endDate) {
                    classes.push('in-range');
                }
                // apply custom classes for this date
                var /** @type {?} */ isCustom = this.isCustomDate(calendar[row][col]);
                if (isCustom !== false) {
                    if (typeof isCustom === 'string') {
                        classes.push(isCustom);
                    }
                    else {
                        Array.prototype.push.apply(classes, isCustom);
                    }
                }
                // store classes var
                var /** @type {?} */ cname = '', /** @type {?} */ disabled = false;
                for (var /** @type {?} */ i = 0; i < classes.length; i++) {
                    cname += classes[i] + ' ';
                    if (classes[i] === 'disabled') {
                        disabled = true;
                    }
                }
                if (!disabled) {
                    cname += 'available';
                }
                this.calendarVariables[side].classes[row][col] = cname.replace(/^\s+|\s+$/g, '');
            }
            this.calendarVariables[side].classes[row].classList = rowClasses.join(' ');
        }
    };
    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     */
    /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     * @param {?} currentMonth
     * @param {?} row
     * @return {?}
     */
    DaterangepickerComponent.prototype.hasCurrentMonthDays = /**
     * Find out if the current calendar row has current month days
     * (as opposed to consisting of only previous/next month days)
     * @param {?} currentMonth
     * @param {?} row
     * @return {?}
     */
    function (currentMonth, row) {
        for (var /** @type {?} */ day = 0; day < 7; day++) {
            if (row[day].month() === currentMonth) {
                return true;
            }
        }
        return false;
    };
    DaterangepickerComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-daterangepicker-material',
                    template: "<div class=\"md-drppicker\" #pickerContainer\n[ngClass]=\"{\n    ltr: locale.direction === 'ltr',\n    rtl: this.locale.direction === 'rtl',\n    'shown': isShown || inline,\n    'hidden': !isShown && !inline,\n    'inline': inline,\n    'double': !singleDatePicker && showCalInRanges,\n    'show-ranges': rangesArray.length\n}\" [class]=\"'drops-' + drops + '-' + opens\">\n    <div class=\"ranges\">\n        <ul>\n          <li *ngFor=\"let range of rangesArray\">\n            <button type=\"button\"\n                    (click)=\"clickRange($event, range)\"\n                    [disabled]=\"disableRange(range)\"\n                    [ngClass]=\"{'active': range === chosenRange}\">{{range}}</button>\n          </li>\n        </ul>\n    </div>\n    <div class=\"calendar\" [ngClass]=\"{right: singleDatePicker, left: !singleDatePicker}\"\n        *ngIf=\"showCalInRanges\">\n        <div class=\"calendar-table\">\n            <table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n                <thead>\n                    <tr>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n                        <ng-container *ngIf=\"!calendarVariables.left.minDate || calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) && (!this.linkedCalendars || true)\">\n                            <th (click)=\"clickPrev(sideEnum.left)\" class=\"prev available\" >\n                            </th>\n                        </ng-container>\n                        <ng-container *ngIf=\"!(!calendarVariables.left.minDate || calendarVariables.left.minDate.isBefore(calendarVariables.left.calendar.firstDay) && (!this.linkedCalendars || true))\">\n                            <th></th>\n                        </ng-container>\n                        <th colspan=\"5\" class=\"month drp-animate\">\n                            <ng-container *ngIf=\"showDropdowns && calendarVariables.left.dropdowns\">\n                                <div class=\"dropdowns\">\n                                        {{this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()]}}\n                                        <select class=\"monthselect\" (change)=\"monthChanged($event, sideEnum.left)\">\n                                                <option\n                                                [disabled]=\"(calendarVariables.left.dropdowns.inMinYear && m < calendarVariables.left.minDate.month()) || (calendarVariables.left.dropdowns.inMaxYear && m > calendarVariables.left.maxDate.month())\"\n                                                *ngFor=\"let m of calendarVariables.left.dropdowns.monthArrays\" [value]=\"m\" [selected]=\"calendarVariables.left.dropdowns.currentMonth == m\">\n                                                    {{locale.monthNames[m]}}\n                                                </option>\n                                        </select>\n                                </div>\n                                <div class=\"dropdowns\">\n                                    {{ calendarVariables?.left?.calendar[1][1].format(\" YYYY\")}}\n                                    <select class=\"yearselect\"  (change)=\"yearChanged($event, sideEnum.left)\">\n                                        <option *ngFor=\"let y of calendarVariables.left.dropdowns.yearArrays\" [selected]=\"y === calendarVariables.left.dropdowns.currentYear\">\n                                            {{y}}\n                                        </option>\n                                    </select>\n                                </div>\n                            </ng-container>\n                            <ng-container *ngIf=\"!showDropdowns || !calendarVariables.left.dropdowns\">\n                                    {{this.locale.monthNames[calendarVariables?.left?.calendar[1][1].month()]}}  {{ calendarVariables?.left?.calendar[1][1].format(\" YYYY\")}}\n                            </ng-container>\n                        </th>\n                        <ng-container *ngIf=\"(!calendarVariables.left.maxDate || calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) && (!linkedCalendars || singleDatePicker )\">\n                            <th class=\"next available\" (click)=\"clickNext(sideEnum.left)\">\n                            </th>\n                        </ng-container>\n                        <ng-container *ngIf=\"!((!calendarVariables.left.maxDate || calendarVariables.left.maxDate.isAfter(calendarVariables.left.calendar.lastDay)) && (!linkedCalendars || singleDatePicker ))\">\n                            <th></th>\n                        </ng-container>\n                    </tr>\n                    <tr>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\"><span>{{this.locale.weekLabel}}</span></th>\n                        <th *ngFor=\"let dayofweek of locale.daysOfWeek\"><span>{{dayofweek}}</span></th>\n                    </tr>\n                </thead>\n                <tbody class=\"drp-animate\">\n                    <tr *ngFor=\"let row of calendarVariables.left.calRows\" [class]=\"calendarVariables.left.classes[row].classList\">\n                        <!-- add week number -->\n                        <td  class=\"week\" *ngIf=\"showWeekNumbers\">\n                            <span>{{calendarVariables.left.calendar[row][0].week()}}</span>\n                        </td>\n                        <td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n                            <span>{{calendarVariables.left.calendar[row][0].isoWeek()}}</span>\n                        </td>\n                        <!-- cal -->\n                        <td *ngFor=\"let col of calendarVariables.left.calCols\" [class]=\"calendarVariables.left.classes[row][col]\" (click)=\"clickDate($event, sideEnum.left, row, col)\">\n                            <span>{{calendarVariables.left.calendar[row][col].date()}}</span>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n        <div class=\"calendar-time\" *ngIf=\"timePicker\">\n            <div class=\"select\">\n                <select class=\"hourselect select-item\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedHour\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option *ngFor=\"let i of timepickerVariables.left.hours\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.left.disabledHours.indexOf(i) > -1\">{{i}}</option>\n                </select>\n            </div>\n            <div class=\"select\">\n                <select class=\"select-item minuteselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedMinute\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option *ngFor=\"let i of timepickerVariables.left.minutes; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.left.disabledMinutes.indexOf(i) > -1\">{{timepickerVariables.left.minutesLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"select\">\n                <select class=\"select-item secondselect\" *ngIf=\"timePickerSeconds\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.left.selectedSecond\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option *ngFor=\"let i of timepickerVariables.left.seconds; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.left.disabledSeconds.indexOf(i) > -1\">{{timepickerVariables.left.secondsLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"select\">\n                <select class=\"select-item ampmselect\" *ngIf=\"!timePicker24Hour\" [(ngModel)]=\"timepickerVariables.left.ampmModel\" (ngModelChange)=\"timeChanged($event, sideEnum.left)\">\n                    <option value=\"AM\" [disabled]=\"timepickerVariables.left.amDisabled\">AM</option>\n                    <option value=\"PM\"  [disabled]=\"timepickerVariables.left.pmDisabled\">PM</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n        </div>\n    </div>\n    <div class=\"calendar right\"\n        *ngIf=\"showCalInRanges && !singleDatePicker\"\n        >\n        <div class=\"calendar-table\">\n            <table class=\"table-condensed\" *ngIf=\"calendarVariables\">\n                <thead>\n                    <tr>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\"></th>\n                        <ng-container *ngIf=\"(!calendarVariables.right.minDate || calendarVariables.right.minDate.isBefore(calendarVariables.right.calendar.firstDay)) && (!this.linkedCalendars)\">\n                            <th (click)=\"clickPrev(sideEnum.right)\" class=\"prev available\" >\n                            </th>\n                        </ng-container>\n                        <ng-container *ngIf=\"!((!calendarVariables.right.minDate || calendarVariables.right.minDate.isBefore(calendarVariables.right.calendar.firstDay)) && (!this.linkedCalendars))\">\n                            <th></th>\n                        </ng-container>\n                        <th colspan=\"5\" class=\"month\">\n                            <ng-container *ngIf=\"showDropdowns && calendarVariables.right.dropdowns\">\n                                <div class=\"dropdowns\">\n                                    {{this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()]}}\n                                    <select class=\"monthselect\" (change)=\"monthChanged($event, sideEnum.right)\">\n                                            <option\n                                            [disabled]=\"(calendarVariables.right.dropdowns.inMinYear && m < calendarVariables.right.minDate.month()) || (calendarVariables.right.dropdowns.inMaxYear && m > calendarVariables.right.maxDate.month())\"\n                                            *ngFor=\"let m of calendarVariables.right.dropdowns.monthArrays\" [value]=\"m\" [selected]=\"calendarVariables.right.dropdowns.currentMonth == m\">\n                                                {{locale.monthNames[m]}}\n                                            </option>\n                                    </select>\n                                </div>\n                                <div class=\"dropdowns\">\n                                        {{ calendarVariables?.right?.calendar[1][1].format(\" YYYY\")}}\n                                        <select class=\"yearselect\" (change)=\"yearChanged($event, sideEnum.right)\">\n                                        <option *ngFor=\"let y of calendarVariables.right.dropdowns.yearArrays\" [selected]=\"y === calendarVariables.right.dropdowns.currentYear\">\n                                            {{y}}\n                                        </option>\n                                    </select>\n                                </div>\n                            </ng-container>\n                            <ng-container *ngIf=\"!showDropdowns || !calendarVariables.right.dropdowns\">\n                                    {{this.locale.monthNames[calendarVariables?.right?.calendar[1][1].month()]}}  {{ calendarVariables?.right?.calendar[1][1].format(\" YYYY\")}}\n                            </ng-container>\n                        </th>\n                            <ng-container *ngIf=\"!calendarVariables.right.maxDate || calendarVariables.right.maxDate.isAfter(calendarVariables.right.calendar.lastDay) && (!linkedCalendars || singleDatePicker || true)\">\n                                <th class=\"next available\" (click)=\"clickNext(sideEnum.right)\">\n                                </th>\n                            </ng-container>\n                            <ng-container *ngIf=\"!(!calendarVariables.right.maxDate || calendarVariables.right.maxDate.isAfter(calendarVariables.right.calendar.lastDay) && (!linkedCalendars || singleDatePicker || true))\">\n                                <th></th>\n                            </ng-container>\n                    </tr>\n\n                    <tr>\n                        <th *ngIf=\"showWeekNumbers || showISOWeekNumbers\" class=\"week\"><span>{{this.locale.weekLabel}}</span></th>\n                        <th *ngFor=\"let dayofweek of locale.daysOfWeek\"><span>{{dayofweek}}</span></th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <tr *ngFor=\"let row of calendarVariables.right.calRows\" [class]=\"calendarVariables.right.classes[row].classList\">\n                        <td class=\"week\" *ngIf=\"showWeekNumbers\">\n                            <span>{{calendarVariables.right.calendar[row][0].week()}}</span>\n                        </td>\n                        <td class=\"week\" *ngIf=\"showISOWeekNumbers\">\n                            <span>{{calendarVariables.right.calendar[row][0].isoWeek()}}</span>\n                        </td>\n                        <td *ngFor=\"let col of calendarVariables.right.calCols\" [class]=\"calendarVariables.right.classes[row][col]\" (click)=\"clickDate($event, sideEnum.right, row, col)\">\n                            <span>{{calendarVariables.right.calendar[row][col].date()}}</span>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n        <div class=\"calendar-time\" *ngIf=\"timePicker\">\n            <div class=\"select\">\n                <select class=\"select-item hourselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedHour\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option *ngFor=\"let i of timepickerVariables.right.hours\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.right.disabledHours.indexOf(i) > -1\">{{i}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"select\">\n                <select class=\"select-item minuteselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedMinute\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option *ngFor=\"let i of timepickerVariables.right.minutes; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.right.disabledMinutes.indexOf(i) > -1\">{{timepickerVariables.right.minutesLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"select\">\n                <select *ngIf=\"timePickerSeconds\" class=\"select-item secondselect\" [disabled]=\"!endDate\" [(ngModel)]=\"timepickerVariables.right.selectedSecond\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option *ngFor=\"let i of timepickerVariables.right.seconds; let index = index;\"\n                    [value]=\"i\"\n                    [disabled]=\"timepickerVariables.right.disabledSeconds.indexOf(i) > -1\">{{timepickerVariables.right.secondsLabel[index]}}</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n            <div class=\"select\">\n                <select *ngIf=\"!timePicker24Hour\" class=\"select-item ampmselect\" [(ngModel)]=\"timepickerVariables.right.ampmModel\" (ngModelChange)=\"timeChanged($event, sideEnum.right)\">\n                    <option value=\"AM\" [disabled]=\"timepickerVariables.right.amDisabled\">AM</option>\n                    <option value=\"PM\"  [disabled]=\"timepickerVariables.right.pmDisabled\">PM</option>\n                </select>\n                <span class=\"select-highlight\"></span>\n                <span class=\"select-bar\"></span>\n            </div>\n        </div>\n    </div>\n    <div class=\"buttons\" *ngIf=\"!autoApply && ( !rangesArray.length || (showCalInRanges && !singleDatePicker))\">\n        <div class=\"buttons_input\">\n            <button  *ngIf=\"showClearButton\" class=\"btn btn-default clear\" type=\"button\" (click)=\"clear()\" title=\"clear the date\">\n                <svg xmlns=\"http://www.w3.org/2000/svg\" width=\"30\" height=\"30\" viewBox=\"0 -5 24 24\"><path d=\"M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z\"/></svg>\n            </button>\n            <button class=\"btn btn-default\" *ngIf=\"showCancel\" type=\"button\" (click)=\"clickCancel($event)\">{{locale.cancelLabel}}</button>\n            <button class=\"btn\"  [disabled]=\"applyBtn.disabled\" type=\"button\" (click)=\"clickApply($event)\">{{locale.applyLabel}}</button>\n        </div>\n    </div>\n</div>\n",
                    host: {
                        '(click)': 'handleInternalClick($event)',
                    },
                    encapsulation: ViewEncapsulation.None,
                    providers: [{
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(function () { return DaterangepickerComponent; }),
                            multi: true
                        }],
                    styles: [".md-drppicker{position:absolute;font-family:Roboto,sans-serif;color:inherit;border-radius:4px;width:278px;margin-top:40px;overflow:hidden;z-index:1000;font-size:14px;background-color:#fff;box-shadow:0 2px 4px 0 rgba(0,0,0,.16),0 2px 8px 0 rgba(0,0,0,.12)}.md-drppicker.double{width:auto}.md-drppicker.inline{position:relative;display:inline-block}.md-drppicker:after,.md-drppicker:before{position:absolute;display:inline-block;border-bottom-color:rgba(0,0,0,.2);content:''}.md-drppicker.openscenter:after,.md-drppicker.openscenter:before{left:0;right:0;width:0;margin-left:auto;margin-right:auto}.md-drppicker.single .calendar,.md-drppicker.single .ranges{float:none}.md-drppicker.shown{-webkit-transform:scale(1);transform:scale(1);transition:.1s ease-in-out;-webkit-transform-origin:0 0;transform-origin:0 0;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.shown.drops-up-left{-webkit-transform-origin:100% 100%;transform-origin:100% 100%}.md-drppicker.shown.drops-up-right{-webkit-transform-origin:0 100%;transform-origin:0 100%}.md-drppicker.shown.drops-down-left{-webkit-transform-origin:100% 0;transform-origin:100% 0}.md-drppicker.shown.drops-down-right{-webkit-transform-origin:0 0;transform-origin:0 0}.md-drppicker.shown.drops-down-center{-webkit-transform-origin:NaN;transform-origin:NaN}.md-drppicker.shown.drops-up-center{-webkit-transform-origin:50%;transform-origin:50%}.md-drppicker.shown .calendar{display:block}.md-drppicker.hidden{transition:.1s;-webkit-transform:scale(0);transform:scale(0);-webkit-transform-origin:0 0;transform-origin:0 0;cursor:default;-webkit-touch-callout:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.md-drppicker.hidden.drops-up-left{-webkit-transform-origin:100% 100%;transform-origin:100% 100%}.md-drppicker.hidden.drops-up-right{-webkit-transform-origin:0 100%;transform-origin:0 100%}.md-drppicker.hidden.drops-down-left{-webkit-transform-origin:100% 0;transform-origin:100% 0}.md-drppicker.hidden.drops-down-right{-webkit-transform-origin:0 0;transform-origin:0 0}.md-drppicker.hidden.drops-down-center{-webkit-transform-origin:NaN;transform-origin:NaN}.md-drppicker.hidden.drops-up-center{-webkit-transform-origin:50%;transform-origin:50%}.md-drppicker.hidden .calendar{display:none}.md-drppicker .calendar{max-width:270px}.md-drppicker .calendar.single .calendar-table{border:none}.md-drppicker .calendar td,.md-drppicker .calendar th{padding:0;white-space:nowrap;text-align:center;min-width:32px;font-size:12px;font-weight:400}.md-drppicker .calendar td span,.md-drppicker .calendar th span{pointer-events:none}.md-drppicker .calendar-table{background-color:#fff;padding:16px 12px 16px 16px}.md-drppicker table{width:100%;margin:0;border-spacing:0}.md-drppicker tr{border:none}.md-drppicker th{color:rgba(61,63,73,.4)}.md-drppicker td,.md-drppicker th{text-align:center;border-radius:4px;white-space:nowrap;cursor:pointer;height:32px;width:32px;vertical-align:middle}.md-drppicker td.available.prev,.md-drppicker th.available.prev{display:block;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K);background-repeat:no-repeat;background-size:.5em;background-position:center;opacity:.8;transition:background-color .2s;border-radius:2em}.md-drppicker td.available.prev:hover,.md-drppicker th.available.prev:hover{margin:0}.md-drppicker td.available.next,.md-drppicker th.available.next{-webkit-transform:rotate(180deg);transform:rotate(180deg);display:block;background-image:url(data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgMy43IDYiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDMuNyA2IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxwYXRoIGQ9Ik0zLjcsMC43TDEuNCwzbDIuMywyLjNMMyw2TDAsM2wzLTNMMy43LDAuN3oiLz4NCjwvZz4NCjwvc3ZnPg0K);background-repeat:no-repeat;background-size:.5em;background-position:center;opacity:.8;transition:background-color .2s;border-radius:2em}.md-drppicker td.available.next:hover,.md-drppicker th.available.next:hover{margin:0;-webkit-transform:rotate(180deg);transform:rotate(180deg)}.md-drppicker td.available:hover,.md-drppicker th.available:hover{background-color:#eee;border-color:transparent;color:inherit;background-repeat:no-repeat;background-size:.5em;background-position:center;margin:.25em 0;opacity:.8;border-radius:2em;-webkit-transform:scale(1);transform:scale(1);transition:450ms cubic-bezier(.23,1,.32,1)}.md-drppicker td.week,.md-drppicker th.week{font-size:80%;color:#ccc}.md-drppicker td{margin:.25em 0;opacity:.8;transition:450ms cubic-bezier(.23,1,.32,1);border-radius:2em;-webkit-transform:scale(1);transform:scale(1)}.md-drppicker td.off,.md-drppicker td.off.end-date,.md-drppicker td.off.in-range,.md-drppicker td.off.start-date{background-color:#fff;border-color:transparent;color:#999}.md-drppicker td.in-range{background-color:rgba(0,143,255,.2);border-color:transparent;color:#000;border-radius:0}.md-drppicker td.start-date{border-radius:2em 0 0 2em}.md-drppicker td.end-date{border-radius:0 2em 2em 0}.md-drppicker td.start-date.end-date{border-radius:50%}.md-drppicker td.active{transition:background .3s ease-out;background:rgba(0,0,0,.1)}.md-drppicker td.active,.md-drppicker td.active:hover{background-color:#008fff;border-color:transparent;color:#fff}.md-drppicker th.month{width:auto;font-size:14px;color:#3d3f49}.md-drppicker option.disabled,.md-drppicker td.disabled{color:#999;cursor:not-allowed;text-decoration:line-through}.md-drppicker .dropdowns{background-repeat:no-repeat;background-size:10px;background-position-y:center;background-position-x:right;width:50px;background-image:url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDI1NSAyNTUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI1NSAyNTU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPGc+Cgk8ZyBpZD0iYXJyb3ctZHJvcC1kb3duIj4KCQk8cG9seWdvbiBwb2ludHM9IjAsNjMuNzUgMTI3LjUsMTkxLjI1IDI1NSw2My43NSAgICIgZmlsbD0iIzk4OGM4YyIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=)}.md-drppicker .dropdowns select{display:inline-block;background-color:rgba(255,255,255,.9);width:100%;padding:5px;border:1px solid #f2f2f2;border-radius:2px;height:3rem}.md-drppicker .dropdowns select.ampmselect,.md-drppicker .dropdowns select.hourselect,.md-drppicker .dropdowns select.minuteselect,.md-drppicker .dropdowns select.secondselect{width:50px;margin:0 auto;background:#eee;border:1px solid #eee;padding:2px;outline:0;font-size:12px}.md-drppicker .dropdowns select.monthselect,.md-drppicker .dropdowns select.yearselect{font-size:12px;height:auto;cursor:pointer;opacity:0;position:absolute;top:0;left:0;margin:0;padding:0}.md-drppicker th.month>div{position:relative;display:inline-block}.md-drppicker .calendar-time{text-align:center;margin:4px auto 0;line-height:30px;position:relative}.md-drppicker .calendar-time .select{display:inline}.md-drppicker .calendar-time .select .select-item{display:inline-block;width:auto;position:relative;font-family:inherit;background-color:transparent;padding:10px 10px 10px 0;font-size:18px;border-radius:0;border:none}.md-drppicker .calendar-time .select .select-item:after{position:absolute;top:18px;right:10px;width:0;height:0;padding:0;content:'';border-left:6px solid transparent;border-right:6px solid transparent;border-top:6px solid rgba(0,0,0,.12);pointer-events:none}.md-drppicker .calendar-time .select .select-item:focus{outline:0}.md-drppicker .calendar-time .select .select-item .select-label{color:rgba(0,0,0,.26);font-size:16px;font-weight:400;position:absolute;pointer-events:none;left:0;top:10px;transition:.2s}.md-drppicker .calendar-time select.disabled{color:#ccc;cursor:not-allowed}.md-drppicker .label-input{border:1px solid #ccc;border-radius:4px;color:#555;height:30px;line-height:30px;display:block;vertical-align:middle;margin:0 auto 5px;padding:0 0 0 28px;width:100%}.md-drppicker .label-input.active{border:1px solid #08c;border-radius:4px}.md-drppicker .md-drppicker_input{position:relative;padding:0 30px 0 0}.md-drppicker .md-drppicker_input i,.md-drppicker .md-drppicker_input svg{position:absolute;left:8px;top:8px}.md-drppicker.rtl .label-input{padding-right:28px;padding-left:6px}.md-drppicker.rtl .md-drppicker_input i,.md-drppicker.rtl .md-drppicker_input svg{left:auto;right:8px}.md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid #ddd}.md-drppicker .ranges{float:none;text-align:left;margin:0;padding-top:8px}.md-drppicker .ranges ul{list-style:none;margin:0 auto;padding:0;width:100%}.md-drppicker .ranges ul li{font-size:14px}.md-drppicker .ranges ul li button{padding:6px 16px;width:100%;background:0 0;border:none;text-align:left;line-height:20px;color:#3d3f49;cursor:pointer}.md-drppicker .ranges ul li button.active{background-color:#008fff;color:#fff}.md-drppicker .ranges ul li button[disabled]{opacity:.3}.md-drppicker .ranges ul li button:active{background:0 0}.md-drppicker .ranges ul li:hover{background-color:#eee}.md-drppicker .show-calendar .ranges{margin-top:8px}.md-drppicker [hidden]{display:none}.md-drppicker .buttons{text-align:right;margin:0 5px 5px 0}.md-drppicker .btn{position:relative;overflow:hidden;border-width:0;outline:0;padding:0 6px;cursor:pointer;border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.6);background-color:#008fff;color:#ecf0f1;transition:background-color .4s;height:auto;text-transform:uppercase;line-height:36px;border:none}.md-drppicker .btn>*{position:relative}.md-drppicker .btn span{display:block;padding:12px 24px}.md-drppicker .btn:before{content:\"\";position:absolute;top:50%;left:50%;display:block;width:0;padding-top:0;border-radius:100%;background-color:rgba(236,240,241,.3);-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}.md-drppicker .btn:active:before{width:120%;padding-top:120%;transition:width .2s ease-out,padding-top .2s ease-out}.md-drppicker .btn:disabled{opacity:.5}.md-drppicker .btn.btn-default{color:#000;background-color:#dcdcdc}.md-drppicker .clear{box-shadow:none;background-color:#fff!important}.md-drppicker .clear svg{color:#eb3232;fill:currentColor}@media (min-width:564px){.md-drppicker{width:auto}.md-drppicker.single .calendar.left{clear:none}.md-drppicker.ltr{direction:ltr;text-align:left}.md-drppicker.ltr .calendar.left{clear:left}.md-drppicker.ltr .calendar.left .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;border-left:1px solid #dce0e3}.md-drppicker.ltr .calendar.right{margin-left:0}.md-drppicker.ltr .calendar.right .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0;padding-left:12px;padding-right:16px}.md-drppicker.ltr .left .md-drppicker_input,.md-drppicker.ltr .right .md-drppicker_input{padding-right:35px}.md-drppicker.ltr .calendar.left .calendar-table{padding-right:12px}.md-drppicker.ltr .calendar,.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl{direction:rtl;text-align:right}.md-drppicker.rtl .calendar.left{clear:right;margin-left:0}.md-drppicker.rtl .calendar.left .calendar-table{border-left:none;border-top-left-radius:0;border-bottom-left-radius:0}.md-drppicker.rtl .calendar.right{margin-right:0}.md-drppicker.rtl .calendar.right .calendar-table{border-right:none;border-top-right-radius:0;border-bottom-right-radius:0}.md-drppicker.rtl .calendar.left .calendar-table,.md-drppicker.rtl .left .md-drppicker_input{padding-left:12px}.md-drppicker.rtl .calendar,.md-drppicker.rtl .ranges{text-align:right;float:right}.drp-animate{-webkit-transform:translate(0);transform:translate(0);transition:transform .2s,opacity .2s,-webkit-transform .2s}.drp-animate.drp-picker-site-this{transition-timing-function:linear}.drp-animate.drp-animate-right{-webkit-transform:translateX(10%);transform:translateX(10%);opacity:0}.drp-animate.drp-animate-left{-webkit-transform:translateX(-10%);transform:translateX(-10%);opacity:0}}@media (min-width:730px){.md-drppicker .ranges{width:auto}.md-drppicker.ltr .ranges{float:left}.md-drppicker.rtl .ranges{float:right}.md-drppicker .calendar.left{clear:none!important}}"]
                }] }
    ];
    /** @nocollapse */
    DaterangepickerComponent.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: ChangeDetectorRef, },
        { type: LocaleService, },
    ]; };
    DaterangepickerComponent.propDecorators = {
        "minDate": [{ type: Input },],
        "maxDate": [{ type: Input },],
        "autoApply": [{ type: Input },],
        "singleDatePicker": [{ type: Input },],
        "showDropdowns": [{ type: Input },],
        "showWeekNumbers": [{ type: Input },],
        "showISOWeekNumbers": [{ type: Input },],
        "linkedCalendars": [{ type: Input },],
        "autoUpdateInput": [{ type: Input },],
        "alwaysShowCalendars": [{ type: Input },],
        "maxSpan": [{ type: Input },],
        "timePicker": [{ type: Input },],
        "timePicker24Hour": [{ type: Input },],
        "timePickerIncrement": [{ type: Input },],
        "timePickerSeconds": [{ type: Input },],
        "showClearButton": [{ type: Input },],
        "firstMonthDayClass": [{ type: Input },],
        "lastMonthDayClass": [{ type: Input },],
        "emptyWeekRowClass": [{ type: Input },],
        "firstDayOfNextMonthClass": [{ type: Input },],
        "lastDayOfPreviousMonthClass": [{ type: Input },],
        "locale": [{ type: Input },],
        "ranges": [{ type: Input },],
        "showCustomRangeLabel": [{ type: Input },],
        "showCancel": [{ type: Input },],
        "keepCalendarOpeningWithRange": [{ type: Input },],
        "showRangeLabelOnInput": [{ type: Input },],
        "drops": [{ type: Input },],
        "opens": [{ type: Input },],
        "choosedDate": [{ type: Output, args: ['choosedDate',] },],
        "rangeClicked": [{ type: Output, args: ['rangeClicked',] },],
        "datesUpdated": [{ type: Output, args: ['datesUpdated',] },],
        "pickerContainer": [{ type: ViewChild, args: ['pickerContainer',] },],
        "isInvalidDate": [{ type: Input },],
        "isCustomDate": [{ type: Input },],
    };
    return DaterangepickerComponent;
}());
export { DaterangepickerComponent };
function DaterangepickerComponent_tsickle_Closure_declarations() {
    /** @type {!Array<{type: !Function, args: (undefined|!Array<?>)}>} */
    DaterangepickerComponent.decorators;
    /**
     * @nocollapse
     * @type {function(): !Array<(null|{type: ?, decorators: (undefined|!Array<{type: !Function, args: (undefined|!Array<?>)}>)})>}
     */
    DaterangepickerComponent.ctorParameters;
    /** @type {!Object<string,!Array<{type: !Function, args: (undefined|!Array<?>)}>>} */
    DaterangepickerComponent.propDecorators;
    /** @type {?} */
    DaterangepickerComponent.prototype._old;
    /** @type {?} */
    DaterangepickerComponent.prototype.chosenLabel;
    /** @type {?} */
    DaterangepickerComponent.prototype.calendarVariables;
    /** @type {?} */
    DaterangepickerComponent.prototype.timepickerVariables;
    /** @type {?} */
    DaterangepickerComponent.prototype.daterangepicker;
    /** @type {?} */
    DaterangepickerComponent.prototype.applyBtn;
    /** @type {?} */
    DaterangepickerComponent.prototype.startDate;
    /** @type {?} */
    DaterangepickerComponent.prototype.endDate;
    /** @type {?} */
    DaterangepickerComponent.prototype.dateLimit;
    /** @type {?} */
    DaterangepickerComponent.prototype.sideEnum;
    /** @type {?} */
    DaterangepickerComponent.prototype.minDate;
    /** @type {?} */
    DaterangepickerComponent.prototype.maxDate;
    /** @type {?} */
    DaterangepickerComponent.prototype.autoApply;
    /** @type {?} */
    DaterangepickerComponent.prototype.singleDatePicker;
    /** @type {?} */
    DaterangepickerComponent.prototype.showDropdowns;
    /** @type {?} */
    DaterangepickerComponent.prototype.showWeekNumbers;
    /** @type {?} */
    DaterangepickerComponent.prototype.showISOWeekNumbers;
    /** @type {?} */
    DaterangepickerComponent.prototype.linkedCalendars;
    /** @type {?} */
    DaterangepickerComponent.prototype.autoUpdateInput;
    /** @type {?} */
    DaterangepickerComponent.prototype.alwaysShowCalendars;
    /** @type {?} */
    DaterangepickerComponent.prototype.maxSpan;
    /** @type {?} */
    DaterangepickerComponent.prototype.timePicker;
    /** @type {?} */
    DaterangepickerComponent.prototype.timePicker24Hour;
    /** @type {?} */
    DaterangepickerComponent.prototype.timePickerIncrement;
    /** @type {?} */
    DaterangepickerComponent.prototype.timePickerSeconds;
    /** @type {?} */
    DaterangepickerComponent.prototype.showClearButton;
    /** @type {?} */
    DaterangepickerComponent.prototype.firstMonthDayClass;
    /** @type {?} */
    DaterangepickerComponent.prototype.lastMonthDayClass;
    /** @type {?} */
    DaterangepickerComponent.prototype.emptyWeekRowClass;
    /** @type {?} */
    DaterangepickerComponent.prototype.firstDayOfNextMonthClass;
    /** @type {?} */
    DaterangepickerComponent.prototype.lastDayOfPreviousMonthClass;
    /** @type {?} */
    DaterangepickerComponent.prototype._locale;
    /** @type {?} */
    DaterangepickerComponent.prototype._ranges;
    /** @type {?} */
    DaterangepickerComponent.prototype.showCustomRangeLabel;
    /** @type {?} */
    DaterangepickerComponent.prototype.showCancel;
    /** @type {?} */
    DaterangepickerComponent.prototype.keepCalendarOpeningWithRange;
    /** @type {?} */
    DaterangepickerComponent.prototype.showRangeLabelOnInput;
    /** @type {?} */
    DaterangepickerComponent.prototype.chosenRange;
    /** @type {?} */
    DaterangepickerComponent.prototype.rangesArray;
    /** @type {?} */
    DaterangepickerComponent.prototype.isShown;
    /** @type {?} */
    DaterangepickerComponent.prototype.inline;
    /** @type {?} */
    DaterangepickerComponent.prototype.leftCalendar;
    /** @type {?} */
    DaterangepickerComponent.prototype.rightCalendar;
    /** @type {?} */
    DaterangepickerComponent.prototype.showCalInRanges;
    /** @type {?} */
    DaterangepickerComponent.prototype.options;
    /** @type {?} */
    DaterangepickerComponent.prototype.drops;
    /** @type {?} */
    DaterangepickerComponent.prototype.opens;
    /** @type {?} */
    DaterangepickerComponent.prototype.choosedDate;
    /** @type {?} */
    DaterangepickerComponent.prototype.rangeClicked;
    /** @type {?} */
    DaterangepickerComponent.prototype.datesUpdated;
    /** @type {?} */
    DaterangepickerComponent.prototype.pickerContainer;
    /** @type {?} */
    DaterangepickerComponent.prototype.el;
    /** @type {?} */
    DaterangepickerComponent.prototype._ref;
    /** @type {?} */
    DaterangepickerComponent.prototype._localeService;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXJhbmdlcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL25neC1kYXRlcmFuZ2VwaWNrZXItbWF0ZXJpYWwvIiwic291cmNlcyI6WyJkYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUNILFNBQVMsRUFBVSxVQUFVLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxpQkFBaUIsRUFDMUgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUF3QixNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUc1QyxPQUFPLEtBQUssT0FBTyxNQUFNLFFBQVEsQ0FBQztBQUNsQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDakQscUJBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQzs7O1VBR1osTUFBTTtXQUNMLE9BQU87Ozs7SUFzSGYsa0NBQ1ksSUFDQSxNQUNBO1FBRkEsT0FBRSxHQUFGLEVBQUU7UUFDRixTQUFJLEdBQUosSUFBSTtRQUNKLG1CQUFjLEdBQWQsY0FBYztvQkF2R2EsRUFBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUM7UUFFL0QseUJBQTZDLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUM7UUFDbkUsMkJBQStDLEVBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFDLENBQUM7UUFDckUsdUJBQTBELEVBQUMsS0FBSyxFQUFFLElBQUksV0FBVyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksV0FBVyxFQUFFLEVBQUMsQ0FBQztRQUM3RyxnQkFBZ0MsRUFBQyxRQUFRLEVBQUUsS0FBSyxF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QixDQUF3QixDQUFDOzRCQUN2RCxLQUFLLEVBQUUsSUFBSTt5QkFDZCxDQUFDOztpQkFDTDs7OztnQkE1QnNCLFVBQVU7Z0JBQXlFLGlCQUFpQjtnQkFPbEgsYUFBYTs7OzRCQW1DakIsS0FBSzs0QkFFTCxLQUFLOzhCQUVMLEtBQUs7cUNBRUwsS0FBSztrQ0FFTCxLQUFLO29DQUVMLEtBQUs7dUNBRUwsS0FBSztvQ0FFTCxLQUFLO29DQUVMLEtBQUs7d0NBRUwsS0FBSzs0QkFFTCxLQUFLOytCQUdMLEtBQUs7cUNBRUwsS0FBSzt3Q0FFTCxLQUFLO3NDQUVMLEtBQUs7b0NBR0wsS0FBSzt1Q0FFTCxLQUFLO3NDQUVMLEtBQUs7c0NBRUwsS0FBSzs2Q0FFTCxLQUFLO2dEQUVMLEtBQUs7MkJBR0wsS0FBSzsyQkFTTCxLQUFLO3lDQVFMLEtBQUs7K0JBRUwsS0FBSztpREFFTCxLQUFLOzBDQUVMLEtBQUs7MEJBYUwsS0FBSzswQkFDTCxLQUFLO2dDQUNMLE1BQU0sU0FBQyxhQUFhO2lDQUNwQixNQUFNLFNBQUMsY0FBYztpQ0FDckIsTUFBTSxTQUFDLGNBQWM7b0NBQ3JCLFNBQVMsU0FBQyxpQkFBaUI7a0NBdVozQixLQUFLO2lDQUlMLEtBQUs7O21DQTVoQlY7O1NBOEJhLHdCQUF3QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQ29tcG9uZW50LCBPbkluaXQsIEVsZW1lbnRSZWYsIFZpZXdDaGlsZCwgRXZlbnRFbWl0dGVyLCBPdXRwdXQsIElucHV0LCBmb3J3YXJkUmVmLCBWaWV3RW5jYXBzdWxhdGlvbiwgQ2hhbmdlRGV0ZWN0b3JSZWYsIEluamVjdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE5HX1ZBTFVFX0FDQ0VTU09SLCBDb250cm9sVmFsdWVBY2Nlc3NvciB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEZvcm1Db250cm9sfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBMb2NhbGVDb25maWcsIExPQ0FMRV9DT05GSUcgfSBmcm9tICcuL2RhdGVyYW5nZXBpY2tlci5jb25maWcnO1xuXG5pbXBvcnQgKiBhcyBfbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBMb2NhbGVTZXJ2aWNlIH0gZnJvbSAnLi9sb2NhbGUuc2VydmljZSc7XG5jb25zdCBtb21lbnQgPSBfbW9tZW50O1xuXG5leHBvcnQgZW51bSBTaWRlRW51bSB7XG4gICAgbGVmdCA9ICdsZWZ0JyxcbiAgICByaWdodCA9ICdyaWdodCdcbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICduZ3gtZGF0ZXJhbmdlcGlja2VyLW1hdGVyaWFsJyxcbiAgICBzdHlsZVVybHM6IFsnLi9kYXRlcmFuZ2VwaWNrZXIuY29tcG9uZW50LnNjc3MnXSxcbiAgICB0ZW1wbGF0ZVVybDogJy4vZGF0ZXJhbmdlcGlja2VyLmNvbXBvbmVudC5odG1sJyxcbiAgICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnaGFuZGxlSW50ZXJuYWxDbGljaygkZXZlbnQpJyxcbiAgICB9LFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgcHJvdmlkZXJzOiBbe1xuICAgICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gRGF0ZXJhbmdlcGlja2VyQ29tcG9uZW50KSxcbiAgICAgICAgbXVsdGk6IHRydWVcbiAgICB9XVxufSlcbmV4cG9ydCBjbGFzcyBEYXRlcmFuZ2VwaWNrZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHByaXZhdGUgX29sZDoge3N0YXJ0OiBhbnksIGVuZDogYW55fSA9IHtzdGFydDogbnVsbCwgZW5kOiBudWxsfTtcbiAgICBjaG9zZW5MYWJlbDogc3RyaW5nO1xuICAgIGNhbGVuZGFyVmFyaWFibGVzOiB7bGVmdDogYW55LCByaWdodDogYW55fSA9IHtsZWZ0OiB7fSwgcmlnaHQ6IHt9fTtcbiAgICB0aW1lcGlja2VyVmFyaWFibGVzOiB7bGVmdDogYW55LCByaWdodDogYW55fSA9IHtsZWZ0OiB7fSwgcmlnaHQ6IHt9fTtcbiAgICBkYXRlcmFuZ2VwaWNrZXI6IHtzdGFydDogRm9ybUNvbnRyb2wsIGVuZDogRm9ybUNvbnRyb2x9ID0ge3N0YXJ0OiBuZXcgRm9ybUNvbnRyb2woKSwgZW5kOiBuZXcgRm9ybUNvbnRyb2woKX07XG4gICAgYXBwbHlCdG46IHtkaXNhYmxlZDogYm9vbGVhbn0gPSB7ZGlzYWJsZWQ6IGZhbHNlfTtcbiAgICBzdGFydERhdGUgPSBtb21lbnQoKS5zdGFydE9mKCdkYXknKTtcbiAgICBlbmREYXRlID0gbW9tZW50KCkuZW5kT2YoJ2RheScpO1xuICAgIGRhdGVMaW1pdCA9IG51bGw7XG4gICAgLy8gdXNlZCBpbiB0ZW1wbGF0ZSBmb3IgY29tcGlsZSB0aW1lIHN1cHBvcnQgb2YgZW51bSB2YWx1ZXMuXG4gICAgc2lkZUVudW0gPSBTaWRlRW51bTtcblxuICAgIEBJbnB1dCgpXG4gICAgbWluRGF0ZTogX21vbWVudC5Nb21lbnQgPSBudWxsO1xuICAgIEBJbnB1dCgpXG4gICAgbWF4RGF0ZTogX21vbWVudC5Nb21lbnQgPSBudWxsO1xuICAgIEBJbnB1dCgpXG4gICAgYXV0b0FwcGx5OiBCb29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICBzaW5nbGVEYXRlUGlja2VyOiBCb29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICBzaG93RHJvcGRvd25zOiBCb29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICBzaG93V2Vla051bWJlcnM6IEJvb2xlYW4gPSBmYWxzZTtcbiAgICBASW5wdXQoKVxuICAgIHNob3dJU09XZWVrTnVtYmVycyA6IEJvb2xlYW49IGZhbHNlO1xuICAgIEBJbnB1dCgpXG4gICAgbGlua2VkQ2FsZW5kYXJzOiBCb29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICBhdXRvVXBkYXRlSW5wdXQ6IEJvb2xlYW4gPSB0cnVlO1xuICAgIEBJbnB1dCgpXG4gICAgYWx3YXlzU2hvd0NhbGVuZGFyczogQm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpXG4gICAgbWF4U3BhbjogQm9vbGVhbiA9IGZhbHNlO1xuICAgIC8vIHRpbWVwaWNrZXIgdmFyaWFibGVzXG4gICAgQElucHV0KClcbiAgICB0aW1lUGlja2VyOiBCb29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICB0aW1lUGlja2VyMjRIb3VyOiBCb29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICB0aW1lUGlja2VySW5jcmVtZW50OiBudW1iZXIgPSAxO1xuICAgIEBJbnB1dCgpXG4gICAgdGltZVBpY2tlclNlY29uZHM6IEJvb2xlYW4gPSBmYWxzZTtcbiAgICAvLyBlbmQgb2YgdGltZXBpY2tlciB2YXJpYWJsZXNcbiAgICBASW5wdXQoKVxuICAgIHNob3dDbGVhckJ1dHRvbjogQm9vbGVhbiA9IGZhbHNlO1xuICAgIEBJbnB1dCgpXG4gICAgZmlyc3RNb250aERheUNsYXNzOiBzdHJpbmcgPSBudWxsO1xuICAgIEBJbnB1dCgpXG4gICAgbGFzdE1vbnRoRGF5Q2xhc3M6IHN0cmluZyA9IG51bGw7XG4gICAgQElucHV0KClcbiAgICBlbXB0eVdlZWtSb3dDbGFzczogc3RyaW5nID0gbnVsbDtcbiAgICBASW5wdXQoKVxuICAgIGZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzczogc3RyaW5nID0gbnVsbDtcbiAgICBASW5wdXQoKVxuICAgIGxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzczogc3RyaW5nID0gbnVsbDtcbiAgICBfbG9jYWxlOiBMb2NhbGVDb25maWcgPSB7fTtcbiAgICBASW5wdXQoKSBzZXQgbG9jYWxlKHZhbHVlKSB7XG4gICAgICB0aGlzLl9sb2NhbGUgPSB7Li4udGhpcy5fbG9jYWxlU2VydmljZS5jb25maWcsIC4uLnZhbHVlfTtcbiAgICB9XG4gICAgZ2V0IGxvY2FsZSgpOiBhbnkge1xuICAgICAgcmV0dXJuIHRoaXMuX2xvY2FsZTtcbiAgICB9XG4gICAgLy8gY3VzdG9tIHJhbmdlc1xuICAgIF9yYW5nZXM6IGFueSA9IHt9O1xuXG4gICAgQElucHV0KCkgc2V0IHJhbmdlcyh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9yYW5nZXMgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5yZW5kZXJSYW5nZXMoKTtcbiAgICB9XG4gICAgZ2V0IHJhbmdlcygpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmFuZ2VzO1xuICAgIH1cblxuICAgIEBJbnB1dCgpXG4gICAgc2hvd0N1c3RvbVJhbmdlTGFiZWw6IGJvb2xlYW47XG4gICAgQElucHV0KClcbiAgICBzaG93Q2FuY2VsOiBib29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICBrZWVwQ2FsZW5kYXJPcGVuaW5nV2l0aFJhbmdlOiBib29sZWFuID0gZmFsc2U7XG4gICAgQElucHV0KClcbiAgICBzaG93UmFuZ2VMYWJlbE9uSW5wdXQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBjaG9zZW5SYW5nZTogc3RyaW5nO1xuICAgIHJhbmdlc0FycmF5OiBBcnJheTxhbnk+ID0gW107XG5cbiAgICAvLyBzb21lIHN0YXRlIGluZm9ybWF0aW9uXG4gICAgaXNTaG93bjogQm9vbGVhbiA9IGZhbHNlO1xuICAgIGlubGluZTogYm9vbGVhbiA9IHRydWU7XG4gICAgbGVmdENhbGVuZGFyOiBhbnkgPSB7fTtcbiAgICByaWdodENhbGVuZGFyOiBhbnkgPSB7fTtcbiAgICBzaG93Q2FsSW5SYW5nZXM6IEJvb2xlYW4gPSBmYWxzZTtcblxuICAgIG9wdGlvbnM6IGFueSA9IHt9IDsgLy8gc2hvdWxkIGdldCBzb21lIG9wdCBmcm9tIHVzZXJcbiAgICBASW5wdXQoKSBkcm9wczogc3RyaW5nO1xuICAgIEBJbnB1dCgpIG9wZW5zOiBzdHJpbmc7XG4gICAgQE91dHB1dCgnY2hvb3NlZERhdGUnKSBjaG9vc2VkRGF0ZTogRXZlbnRFbWl0dGVyPE9iamVjdD47XG4gICAgQE91dHB1dCgncmFuZ2VDbGlja2VkJykgcmFuZ2VDbGlja2VkOiBFdmVudEVtaXR0ZXI8T2JqZWN0PjtcbiAgICBAT3V0cHV0KCdkYXRlc1VwZGF0ZWQnKSBkYXRlc1VwZGF0ZWQ6IEV2ZW50RW1pdHRlcjxPYmplY3Q+O1xuICAgIEBWaWV3Q2hpbGQoJ3BpY2tlckNvbnRhaW5lcicpIHBpY2tlckNvbnRhaW5lcjogRWxlbWVudFJlZjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBwcml2YXRlIGVsOiBFbGVtZW50UmVmLFxuICAgICAgICBwcml2YXRlIF9yZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgICAgICBwcml2YXRlIF9sb2NhbGVTZXJ2aWNlOiBMb2NhbGVTZXJ2aWNlXG4gICAgKSB7XG4gICAgICAgIHRoaXMuY2hvb3NlZERhdGUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgICAgIHRoaXMucmFuZ2VDbGlja2VkID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICAgICAgICB0aGlzLmRhdGVzVXBkYXRlZCA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5sb2NhbGUgPSB0aGlzLl9sb2NhbGVTZXJ2aWNlLmNvbmZpZztcbiAgICAgICAgdGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcbiAgICB9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMubG9jYWxlLmZpcnN0RGF5ICE9IDApIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IHRoaXMubG9jYWxlLmZpcnN0RGF5O1xuICAgICAgICAgICAgd2hpbGUgKGl0ZXJhdG9yID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLmRheXNPZldlZWsucHVzaCh0aGlzLmxvY2FsZS5kYXlzT2ZXZWVrLnNoaWZ0KCkpO1xuICAgICAgICAgICAgICAgIGl0ZXJhdG9yLS07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaW5saW5lKSB7XG4gICAgICAgICAgICB0aGlzLl9vbGQuc3RhcnQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5fb2xkLmVuZCA9IHRoaXMuZW5kRGF0ZS5jbG9uZSgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5sb2NhbGUuZm9ybWF0KSB7IFxuICAgICAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlcikge1xuICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLmZvcm1hdCA9IG1vbWVudC5sb2NhbGVEYXRhKCkubG9uZ0RhdGVGb3JtYXQoJ2xsbCcpO1xuICAgICAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgICAgICAgdGhpcy5sb2NhbGUuZm9ybWF0ID0gbW9tZW50LmxvY2FsZURhdGEoKS5sb25nRGF0ZUZvcm1hdCgnTCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ubGVmdCk7XG4gICAgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ucmlnaHQpO1xuICAgICAgICB0aGlzLnJlbmRlclJhbmdlcygpO1xuICAgIH1cbiAgICByZW5kZXJSYW5nZXMoKSB7XG4gICAgICAgIHRoaXMucmFuZ2VzQXJyYXkgPSBbXTtcbiAgICAgICAgbGV0IHN0YXJ0LCBlbmQ7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5yYW5nZXMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHJhbmdlIGluIHRoaXMucmFuZ2VzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnJhbmdlc1tyYW5nZV1bMF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gbW9tZW50KHRoaXMucmFuZ2VzW3JhbmdlXVswXSwgdGhpcy5sb2NhbGUuZm9ybWF0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdGFydCA9IG1vbWVudCh0aGlzLnJhbmdlc1tyYW5nZV1bMF0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5yYW5nZXNbcmFuZ2VdWzFdID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICBlbmQgPSBtb21lbnQodGhpcy5yYW5nZXNbcmFuZ2VdWzFdLCB0aGlzLmxvY2FsZS5mb3JtYXQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IG1vbWVudCh0aGlzLnJhbmdlc1tyYW5nZV1bMV0pO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBzdGFydCBvciBlbmQgZGF0ZSBleGNlZWQgdGhvc2UgYWxsb3dlZCBieSB0aGUgbWluRGF0ZSBvciBtYXhTcGFuXG4gICAgICAgICAgICAgICAgLy8gb3B0aW9ucywgc2hvcnRlbiB0aGUgcmFuZ2UgdG8gdGhlIGFsbG93YWJsZSBwZXJpb2QuXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWluRGF0ZSAmJiBzdGFydC5pc0JlZm9yZSh0aGlzLm1pbkRhdGUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5taW5EYXRlLmNsb25lKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIG1heERhdGUgPSB0aGlzLm1heERhdGU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubWF4U3BhbiAmJiBtYXhEYXRlICYmIHN0YXJ0LmNsb25lKCkuYWRkKHRoaXMubWF4U3BhbikuaXNBZnRlcihtYXhEYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICBtYXhEYXRlID0gc3RhcnQuY2xvbmUoKS5hZGQodGhpcy5tYXhTcGFuKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKG1heERhdGUgJiYgZW5kLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZW5kID0gbWF4RGF0ZS5jbG9uZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIElmIHRoZSBlbmQgb2YgdGhlIHJhbmdlIGlzIGJlZm9yZSB0aGUgbWluaW11bSBvciB0aGUgc3RhcnQgb2YgdGhlIHJhbmdlIGlzXG4gICAgICAgICAgICAgICAgLy8gYWZ0ZXIgdGhlIG1heGltdW0sIGRvbid0IGRpc3BsYXkgdGhpcyByYW5nZSBvcHRpb24gYXQgYWxsLlxuICAgICAgICAgICAgICAgIGlmICgodGhpcy5taW5EYXRlICYmIGVuZC5pc0JlZm9yZSh0aGlzLm1pbkRhdGUsIHRoaXMudGltZVBpY2tlciA/ICdtaW51dGUnIDogJ2RheScpKVxuICAgICAgICAgICAgICAgIHx8IChtYXhEYXRlICYmIHN0YXJ0LmlzQWZ0ZXIobWF4RGF0ZSwgdGhpcy50aW1lUGlja2VyID8gJ21pbnV0ZScgOiAnZGF5JykpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vU3VwcG9ydCB1bmljb2RlIGNoYXJzIGluIHRoZSByYW5nZSBuYW1lcy5cbiAgICAgICAgICAgICAgICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgICAgICAgICAgICAgZWxlbS5pbm5lckhUTUwgPSByYW5nZTtcbiAgICAgICAgICAgICAgICB2YXIgcmFuZ2VIdG1sID0gZWxlbS52YWx1ZTtcblxuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VzW3JhbmdlSHRtbF0gPSBbc3RhcnQsIGVuZF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5zaG93Q3VzdG9tUmFuZ2VMYWJlbCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmFuZ2VzQXJyYXkucHVzaCh0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgcmFuZ2UgaW4gdGhpcy5yYW5nZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhbmdlc0FycmF5LnB1c2gocmFuZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zaG93Q2FsSW5SYW5nZXMgPSAoIXRoaXMucmFuZ2VzQXJyYXkubGVuZ3RoKSB8fCB0aGlzLmFsd2F5c1Nob3dDYWxlbmRhcnM7XG4gICAgICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5zdGFydERhdGUuc3RhcnRPZignZGF5Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5lbmREYXRlLmVuZE9mKCdkYXknKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNhbid0IGJlIHVzZWQgdG9nZXRoZXIgZm9yIG5vd1xuICAgICAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLmF1dG9BcHBseSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYXV0b0FwcGx5ID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH1cbiAgICByZW5kZXJUaW1lUGlja2VyKHNpZGU6IFNpZGVFbnVtKSB7XG4gICAgICAgIGlmIChzaWRlID09IFNpZGVFbnVtLnJpZ2h0ICYmICF0aGlzLmVuZERhdGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc2VsZWN0ZWQsIG1pbkRhdGU7XG4gICAgICAgIGxldCBtYXhEYXRlID0gdGhpcy5tYXhEYXRlXG4gICAgICAgIGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG4gICAgICAgICAgICBzZWxlY3RlZCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCksXG4gICAgICAgICAgICBtaW5EYXRlID0gdGhpcy5taW5EYXRlXG4gICAgICAgIH0gZWxzZSBpZiAoc2lkZSA9PT0gU2lkZUVudW0ucmlnaHQpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkID0gdGhpcy5lbmREYXRlLmNsb25lKCksXG4gICAgICAgICAgICBtaW5EYXRlID0gdGhpcy5zdGFydERhdGVcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdGFydCA9IHRoaXMudGltZVBpY2tlcjI0SG91ciA/IDAgOiAxO1xuICAgICAgICBjb25zdCBlbmQgPSB0aGlzLnRpbWVQaWNrZXIyNEhvdXIgPyAyMyA6IDEyO1xuICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0gPSB7XG4gICAgICAgICAgICBob3VyczogW10sXG4gICAgICAgICAgICBtaW51dGVzOiBbXSxcbiAgICAgICAgICAgIG1pbnV0ZXNMYWJlbDogW10sXG4gICAgICAgICAgICBzZWNvbmRzOiBbXSxcbiAgICAgICAgICAgIHNlY29uZHNMYWJlbDogW10sXG4gICAgICAgICAgICBkaXNhYmxlZEhvdXJzOiBbXSxcbiAgICAgICAgICAgIGRpc2FibGVkTWludXRlczogW10sXG4gICAgICAgICAgICBkaXNhYmxlZFNlY29uZHM6IFtdLFxuICAgICAgICAgICAgc2VsZWN0ZWRIb3VyOiAwLFxuICAgICAgICAgICAgc2VsZWN0ZWRNaW51dGU6IDAsXG4gICAgICAgICAgICBzZWxlY3RlZFNlY29uZDogMCxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gZ2VuZXJhdGUgaG91cnNcbiAgICAgICAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDw9IGVuZDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgaV9pbl8yNCA9IGk7XG4gICAgICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xuICAgICAgICAgICAgICAgIGlfaW5fMjQgPSBzZWxlY3RlZC5ob3VyKCkgPj0gMTIgPyAoaSA9PSAxMiA/IDEyIDogaSArIDEyKSA6IChpID09IDEyID8gMCA6IGkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkuaG91cihpX2luXzI0KTtcbiAgICAgICAgICAgIGxldCBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgaWYgKG1pbkRhdGUgJiYgdGltZS5taW51dGUoNTkpLmlzQmVmb3JlKG1pbkRhdGUpKSB7XG4gICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1heERhdGUgJiYgdGltZS5taW51dGUoMCkuaXNBZnRlcihtYXhEYXRlKSkge1xuICAgICAgICAgICAgICAgIGRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmhvdXJzLnB1c2goaSk7XG4gICAgICAgICAgICBpZiAoaV9pbl8yNCA9PSBzZWxlY3RlZC5ob3VyKCkgJiYgIWRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciA9IGk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmRpc2FibGVkSG91cnMucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBnZW5lcmF0ZSBtaW51dGVzXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgNjA7IGkgKz0gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XG4gICAgICAgICAgICB2YXIgcGFkZGVkID0gaSA8IDEwID8gJzAnICsgaSA6IGk7XG4gICAgICAgICAgICB2YXIgdGltZSA9IHNlbGVjdGVkLmNsb25lKCkubWludXRlKGkpO1xuXG4gICAgICAgICAgICB2YXIgZGlzYWJsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGlmIChtaW5EYXRlICYmIHRpbWUuc2Vjb25kKDU5KS5pc0JlZm9yZShtaW5EYXRlKSkge1xuICAgICAgICAgICAgICAgIGRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtYXhEYXRlICYmIHRpbWUuc2Vjb25kKDApLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBkaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0ubWludXRlcy5wdXNoKGkpO1xuICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLm1pbnV0ZXNMYWJlbC5wdXNoKHBhZGRlZCk7XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQubWludXRlKCkgPT0gaSAmJiAhZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uc2VsZWN0ZWRNaW51dGUgPSBpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5kaXNhYmxlZE1pbnV0ZXMucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBnZW5lcmF0ZSBzZWNvbmRzXG4gICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXJTZWNvbmRzKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDYwOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFkZGVkID0gaSA8IDEwID8gJzAnICsgaSA6IGk7XG4gICAgICAgICAgICAgICAgdmFyIHRpbWUgPSBzZWxlY3RlZC5jbG9uZSgpLnNlY29uZChpKTtcblxuICAgICAgICAgICAgICAgIHZhciBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlmIChtaW5EYXRlICYmIHRpbWUuaXNCZWZvcmUobWluRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobWF4RGF0ZSAmJiB0aW1lLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWNvbmRzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlY29uZHNMYWJlbC5wdXNoKHBhZGRlZCk7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGVkLnNlY29uZCgpID09IGkgJiYgIWRpc2FibGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZFNlY29uZCA9IGk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXNhYmxlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uZGlzYWJsZWRTZWNvbmRzLnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGdlbmVyYXRlIEFNL1BNXG4gICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XG5cbiAgICAgICAgICAgIHZhciBhbV9odG1sID0gJyc7XG4gICAgICAgICAgICB2YXIgcG1faHRtbCA9ICcnO1xuXG4gICAgICAgICAgICBpZiAobWluRGF0ZSAmJiBzZWxlY3RlZC5jbG9uZSgpLmhvdXIoMTIpLm1pbnV0ZSgwKS5zZWNvbmQoMCkuaXNCZWZvcmUobWluRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1EaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChtYXhEYXRlICYmIHNlbGVjdGVkLmNsb25lKCkuaG91cigwKS5taW51dGUoMCkuc2Vjb25kKDApLmlzQWZ0ZXIobWF4RGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0ucG1EaXNhYmxlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2VsZWN0ZWQuaG91cigpID49IDEyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLmFtcG1Nb2RlbCA9ICdQTSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWwgPSAnQU0nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5zZWxlY3RlZCA9IHNlbGVjdGVkO1xuICAgIH1cbiAgICByZW5kZXJDYWxlbmRhcihzaWRlOiBTaWRlRW51bSkgeyAvLyBzaWRlIGVudW1cbiAgICAgICAgbGV0IG1haW5DYWxlbmRhcjogYW55ID0gKCBzaWRlID09PSBTaWRlRW51bS5sZWZ0ICkgPyB0aGlzLmxlZnRDYWxlbmRhciA6IHRoaXMucmlnaHRDYWxlbmRhcjtcbiAgICAgICAgY29uc3QgbW9udGggPSBtYWluQ2FsZW5kYXIubW9udGgubW9udGgoKTtcbiAgICAgICAgY29uc3QgeWVhciA9IG1haW5DYWxlbmRhci5tb250aC55ZWFyKCk7XG4gICAgICAgIGNvbnN0IGhvdXIgPSBtYWluQ2FsZW5kYXIubW9udGguaG91cigpO1xuICAgICAgICBjb25zdCBtaW51dGUgPSBtYWluQ2FsZW5kYXIubW9udGgubWludXRlKCk7XG4gICAgICAgIGNvbnN0IHNlY29uZCA9IG1haW5DYWxlbmRhci5tb250aC5zZWNvbmQoKTtcbiAgICAgICAgY29uc3QgZGF5c0luTW9udGggPSBtb21lbnQoW3llYXIsIG1vbnRoXSkuZGF5c0luTW9udGgoKTtcbiAgICAgICAgY29uc3QgZmlyc3REYXkgPSBtb21lbnQoW3llYXIsIG1vbnRoLCAxXSk7XG4gICAgICAgIGNvbnN0IGxhc3REYXkgPSBtb21lbnQoW3llYXIsIG1vbnRoLCBkYXlzSW5Nb250aF0pO1xuICAgICAgICBjb25zdCBsYXN0TW9udGggPSBtb21lbnQoZmlyc3REYXkpLnN1YnRyYWN0KDEsICdtb250aCcpLm1vbnRoKCk7XG4gICAgICAgIGNvbnN0IGxhc3RZZWFyID0gbW9tZW50KGZpcnN0RGF5KS5zdWJ0cmFjdCgxLCAnbW9udGgnKS55ZWFyKCk7XG4gICAgICAgIGNvbnN0IGRheXNJbkxhc3RNb250aCA9IG1vbWVudChbbGFzdFllYXIsIGxhc3RNb250aF0pLmRheXNJbk1vbnRoKCk7XG4gICAgICAgIGNvbnN0IGRheU9mV2VlayA9IGZpcnN0RGF5LmRheSgpO1xuICAgICAgICAvLyBpbml0aWFsaXplIGEgNiByb3dzIHggNyBjb2x1bW5zIGFycmF5IGZvciB0aGUgY2FsZW5kYXJcbiAgICAgICAgbGV0IGNhbGVuZGFyOiBhbnkgPSBbXTtcbiAgICAgICAgY2FsZW5kYXIuZmlyc3REYXkgPSBmaXJzdERheTtcbiAgICAgICAgY2FsZW5kYXIubGFzdERheSA9IGxhc3REYXk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA2OyBpKyspIHtcbiAgICAgICAgICAgIGNhbGVuZGFyW2ldID0gW107XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwb3B1bGF0ZSB0aGUgY2FsZW5kYXIgd2l0aCBkYXRlIG9iamVjdHNcbiAgICAgICAgbGV0IHN0YXJ0RGF5ID0gZGF5c0luTGFzdE1vbnRoIC0gZGF5T2ZXZWVrICsgdGhpcy5sb2NhbGUuZmlyc3REYXkgKyAxO1xuICAgICAgICBpZiAoc3RhcnREYXkgPiBkYXlzSW5MYXN0TW9udGgpIHtcbiAgICAgICAgICAgIHN0YXJ0RGF5IC09IDc7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRheU9mV2VlayA9PT0gdGhpcy5sb2NhbGUuZmlyc3REYXkpIHtcbiAgICAgICAgICAgIHN0YXJ0RGF5ID0gZGF5c0luTGFzdE1vbnRoIC0gNjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjdXJEYXRlID0gbW9tZW50KFtsYXN0WWVhciwgbGFzdE1vbnRoLCBzdGFydERheSwgMTIsIG1pbnV0ZSwgc2Vjb25kXSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDAsIGNvbCA9IDAsIHJvdyA9IDA7IGkgPCA0MjsgaSsrLCBjb2wrKywgY3VyRGF0ZSA9IG1vbWVudChjdXJEYXRlKS5hZGQoMjQsICdob3VyJykpIHtcbiAgICAgICAgICAgIGlmIChpID4gMCAmJiBjb2wgJSA3ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgY29sID0gMDtcbiAgICAgICAgICAgICAgICByb3crKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXSA9IGN1ckRhdGUuY2xvbmUoKS5ob3VyKGhvdXIpLm1pbnV0ZShtaW51dGUpLnNlY29uZChzZWNvbmQpO1xuICAgICAgICAgICAgY3VyRGF0ZS5ob3VyKDEyKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMubWluRGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMubWluRGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSAmJlxuICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdLmlzQmVmb3JlKHRoaXMubWluRGF0ZSkgJiYgc2lkZSA9PT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICAgICAgY2FsZW5kYXJbcm93XVtjb2xdID0gdGhpcy5taW5EYXRlLmNsb25lKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLm1heERhdGUgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLm1heERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykgJiZcbiAgICAgICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkgJiYgc2lkZSA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgICAgIGNhbGVuZGFyW3Jvd11bY29sXSA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWFrZSB0aGUgY2FsZW5kYXIgb2JqZWN0IGF2YWlsYWJsZSB0byBob3ZlckRhdGUvY2xpY2tEYXRlXG4gICAgICAgIGlmIChzaWRlID09PSBTaWRlRW51bS5sZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5jYWxlbmRhciA9IGNhbGVuZGFyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLmNhbGVuZGFyID0gY2FsZW5kYXI7XG4gICAgICAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gRGlzcGxheSB0aGUgY2FsZW5kYXJcbiAgICAgICAgLy9cbiAgICAgICAgY29uc3QgbWluRGF0ZSA9IHNpZGUgPT09ICdsZWZ0JyA/IHRoaXMubWluRGF0ZSA6IHRoaXMuc3RhcnREYXRlO1xuICAgICAgICBsZXQgbWF4RGF0ZSA9IHRoaXMubWF4RGF0ZTtcbiAgICAgICAgLy8gYWRqdXN0IG1heERhdGUgdG8gcmVmbGVjdCB0aGUgZGF0ZUxpbWl0IHNldHRpbmcgaW4gb3JkZXIgdG9cbiAgICAgICAgLy8gZ3JleSBvdXQgZW5kIGRhdGVzIGJleW9uZCB0aGUgZGF0ZUxpbWl0XG4gICAgICAgIGlmICh0aGlzLmVuZERhdGUgPT09IG51bGwgJiYgdGhpcy5kYXRlTGltaXQpIHtcbiAgICAgICAgICAgIGNvbnN0IG1heExpbWl0ID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5hZGQodGhpcy5kYXRlTGltaXQpLmVuZE9mKCdkYXknKTtcbiAgICAgICAgICAgIGlmICghbWF4RGF0ZSB8fCBtYXhMaW1pdC5pc0JlZm9yZShtYXhEYXRlKSkge1xuICAgICAgICAgICAgICAgIG1heERhdGUgPSBtYXhMaW1pdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdID0ge1xuICAgICAgICAgICAgbW9udGg6IG1vbnRoLFxuICAgICAgICAgICAgeWVhcjogeWVhcixcbiAgICAgICAgICAgIGhvdXI6IGhvdXIsXG4gICAgICAgICAgICBtaW51dGU6IG1pbnV0ZSxcbiAgICAgICAgICAgIHNlY29uZDogc2Vjb25kLFxuICAgICAgICAgICAgZGF5c0luTW9udGg6IGRheXNJbk1vbnRoLFxuICAgICAgICAgICAgZmlyc3REYXk6IGZpcnN0RGF5LFxuICAgICAgICAgICAgbGFzdERheTogbGFzdERheSxcbiAgICAgICAgICAgIGxhc3RNb250aDogbGFzdE1vbnRoLFxuICAgICAgICAgICAgbGFzdFllYXI6IGxhc3RZZWFyLFxuICAgICAgICAgICAgZGF5c0luTGFzdE1vbnRoOiBkYXlzSW5MYXN0TW9udGgsXG4gICAgICAgICAgICBkYXlPZldlZWs6IGRheU9mV2VlayxcbiAgICAgICAgICAgIC8vIG90aGVyIHZhcnNcbiAgICAgICAgICAgIGNhbFJvd3M6IEFycmF5LmZyb20oQXJyYXkoNikua2V5cygpKSxcbiAgICAgICAgICAgIGNhbENvbHM6IEFycmF5LmZyb20oQXJyYXkoNykua2V5cygpKSxcbiAgICAgICAgICAgIGNsYXNzZXM6IHt9LFxuICAgICAgICAgICAgbWluRGF0ZTogbWluRGF0ZSxcbiAgICAgICAgICAgIG1heERhdGU6IG1heERhdGUsXG4gICAgICAgICAgICBjYWxlbmRhcjogY2FsZW5kYXJcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHRoaXMuc2hvd0Ryb3Bkb3ducykge1xuICAgICAgICAgICAgY29uc3QgY3VycmVudE1vbnRoID0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKTtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRZZWFyID0gY2FsZW5kYXJbMV1bMV0ueWVhcigpO1xuICAgICAgICAgICAgY29uc3QgbWF4WWVhciA9IChtYXhEYXRlICYmIG1heERhdGUueWVhcigpKSB8fCAoY3VycmVudFllYXIgKyA1KTtcbiAgICAgICAgICAgIGNvbnN0IG1pblllYXIgPSAobWluRGF0ZSAmJiBtaW5EYXRlLnllYXIoKSkgfHwgKGN1cnJlbnRZZWFyIC0gNTApO1xuICAgICAgICAgICAgY29uc3QgaW5NaW5ZZWFyID0gY3VycmVudFllYXIgPT09IG1pblllYXI7XG4gICAgICAgICAgICBjb25zdCBpbk1heFllYXIgPSBjdXJyZW50WWVhciA9PT0gbWF4WWVhcjtcbiAgICAgICAgICAgIGNvbnN0IHllYXJzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciB5ID0gbWluWWVhcjsgeSA8PSBtYXhZZWFyOyB5KyspIHtcbiAgICAgICAgICAgICAgICB5ZWFycy5wdXNoKHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMgPSB7XG4gICAgICAgICAgICAgICAgY3VycmVudE1vbnRoOiBjdXJyZW50TW9udGgsXG4gICAgICAgICAgICAgICAgY3VycmVudFllYXI6IGN1cnJlbnRZZWFyLFxuICAgICAgICAgICAgICAgIG1heFllYXI6IG1heFllYXIsXG4gICAgICAgICAgICAgICAgbWluWWVhcjogbWluWWVhcixcbiAgICAgICAgICAgICAgICBpbk1pblllYXI6IGluTWluWWVhcixcbiAgICAgICAgICAgICAgICBpbk1heFllYXI6IGluTWF4WWVhcixcbiAgICAgICAgICAgICAgICBtb250aEFycmF5czogQXJyYXkuZnJvbShBcnJheSgxMikua2V5cygpKSxcbiAgICAgICAgICAgICAgICB5ZWFyQXJyYXlzOiB5ZWFyc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5fYnVpbGRDZWxscyhjYWxlbmRhciwgc2lkZSlcbiAgICB9XG4gICAgc2V0U3RhcnREYXRlKHN0YXJ0RGF0ZSkge1xuICAgICAgICBpZiAodHlwZW9mIHN0YXJ0RGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlID0gbW9tZW50KHN0YXJ0RGF0ZSwgdGhpcy5sb2NhbGUuZm9ybWF0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygc3RhcnREYXRlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSBtb21lbnQoc3RhcnREYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcikge1xuICAgICAgICAgICAgdGhpcy5zdGFydERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIgJiYgdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5taW51dGUoTWF0aC5yb3VuZCh0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpO1xuICAgICAgICB9XG5cblxuICAgICAgICBpZiAodGhpcy5taW5EYXRlICYmIHRoaXMuc3RhcnREYXRlLmlzQmVmb3JlKHRoaXMubWluRGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlID0gdGhpcy5taW5EYXRlLmNsb25lKCk7XG4gICAgICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyICYmIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RhcnREYXRlLm1pbnV0ZShNYXRoLnJvdW5kKHRoaXMuc3RhcnREYXRlLm1pbnV0ZSgpIC8gdGhpcy50aW1lUGlja2VySW5jcmVtZW50KSAqIHRoaXMudGltZVBpY2tlckluY3JlbWVudCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1heERhdGUgJiYgdGhpcy5zdGFydERhdGUuaXNBZnRlcih0aGlzLm1heERhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5taW51dGUoTWF0aC5mbG9vcih0aGlzLnN0YXJ0RGF0ZS5taW51dGUoKSAvIHRoaXMudGltZVBpY2tlckluY3JlbWVudCkgKiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcbiAgICB9XG5cbiAgICBzZXRFbmREYXRlKGVuZERhdGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBlbmREYXRlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5lbmREYXRlID0gbW9tZW50KGVuZERhdGUsIHRoaXMubG9jYWxlLmZvcm1hdCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIGVuZERhdGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQoZW5kRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuZW5kRGF0ZS5hZGQoMSwnZCcpLnN0YXJ0T2YoJ2RheScpLnN1YnRyYWN0KDEsJ3NlY29uZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMudGltZVBpY2tlciAmJiB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZS5taW51dGUoTWF0aC5yb3VuZCh0aGlzLmVuZERhdGUubWludXRlKCkgLyB0aGlzLnRpbWVQaWNrZXJJbmNyZW1lbnQpICogdGhpcy50aW1lUGlja2VySW5jcmVtZW50KTtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKHRoaXMuZW5kRGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tYXhEYXRlICYmIHRoaXMuZW5kRGF0ZS5pc0FmdGVyKHRoaXMubWF4RGF0ZSkpIHtcbiAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IHRoaXMubWF4RGF0ZS5jbG9uZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZGF0ZUxpbWl0ICYmIHRoaXMuc3RhcnREYXRlLmNsb25lKCkuYWRkKHRoaXMuZGF0ZUxpbWl0KS5pc0JlZm9yZSh0aGlzLmVuZERhdGUpKSB7XG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmFkZCh0aGlzLmRhdGVMaW1pdCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmICghdGhpcy5pc1Nob3duKSB7XG4gICAgICAgICAgICAvLyB0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZU1vbnRoc0luVmlldygpO1xuICAgIH1cbiAgICBASW5wdXQoKVxuICAgIGlzSW52YWxpZERhdGUoZGF0ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIEBJbnB1dCgpXG4gICAgaXNDdXN0b21EYXRlKGRhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHVwZGF0ZVZpZXcoKSB7XG4gICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5sZWZ0KTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVNb250aHNJblZpZXcoKTtcbiAgICAgICAgdGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVNb250aHNJblZpZXcoKSB7XG4gICAgICAgIGlmICh0aGlzLmVuZERhdGUpIHtcbiAgICAgICAgICAgIC8vIGlmIGJvdGggZGF0ZXMgYXJlIHZpc2libGUgYWxyZWFkeSwgZG8gbm90aGluZ1xuICAgICAgICAgICAgaWYgKCF0aGlzLnNpbmdsZURhdGVQaWNrZXIgJiYgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggJiYgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoICYmXG4gICAgICAgICAgICAgICAgKCh0aGlzLnN0YXJ0RGF0ZSAmJiB0aGlzLmxlZnRDYWxlbmRhciAmJiB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMuc3RhcnREYXRlICYmIHRoaXMucmlnaHRDYWxlbmRhciAmJiB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSA9PT0gdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpKSlcbiAgICAgICAgICAgICAgICAmJlxuICAgICAgICAgICAgICAgICh0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NJykgPT09IHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpIHx8XG4gICAgICAgICAgICAgICAgdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTScpID09PSB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguZm9ybWF0KCdZWVlZLU1NJykpXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnREYXRlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmRhdGUoMik7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmxpbmtlZENhbGVuZGFycyAmJiAodGhpcy5lbmREYXRlLm1vbnRoKCkgIT09IHRoaXMuc3RhcnREYXRlLm1vbnRoKCkgfHxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lbmREYXRlLnllYXIoKSAhPT0gdGhpcy5zdGFydERhdGUueWVhcigpKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPSB0aGlzLmVuZERhdGUuY2xvbmUoKS5kYXRlKDIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpLmRhdGUoMikuYWRkKDEsICdtb250aCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpICE9PSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSAmJlxuICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLmZvcm1hdCgnWVlZWS1NTScpICE9PSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0nKSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoID0gdGhpcy5zdGFydERhdGUuY2xvbmUoKS5kYXRlKDIpO1xuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCkuZGF0ZSgyKS5hZGQoMSwgJ21vbnRoJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMubWF4RGF0ZSAmJiB0aGlzLmxpbmtlZENhbGVuZGFycyAmJiAhdGhpcy5zaW5nbGVEYXRlUGlja2VyICYmIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA+IHRoaXMubWF4RGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoID0gdGhpcy5tYXhEYXRlLmNsb25lKCkuZGF0ZSgyKTtcbiAgICAgICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoID0gdGhpcy5tYXhEYXRlLmNsb25lKCkuZGF0ZSgyKS5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiAgVGhpcyBpcyByZXNwb25zaWJsZSBmb3IgdXBkYXRpbmcgdGhlIGNhbGVuZGFyc1xuICAgICAqL1xuICAgIHVwZGF0ZUNhbGVuZGFycygpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5sZWZ0KTtcbiAgICAgICAgdGhpcy5yZW5kZXJDYWxlbmRhcihTaWRlRW51bS5yaWdodCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZW5kRGF0ZSA9PT0gbnVsbCkgeyByZXR1cm47IH1cbiAgICAgICAgdGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuICAgIH1cbiAgICB1cGRhdGVFbGVtZW50KCkge1xuICAgICAgICBpZiAoIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJiB0aGlzLmF1dG9VcGRhdGVJbnB1dCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RhcnREYXRlICYmIHRoaXMuZW5kRGF0ZSkge1xuICAgICAgICAgICAgICAgIC8vIGlmIHdlIHVzZSByYW5nZXMgYW5kIHNob3VsZCBzaG93IHJhbmdlIGxhYmVsIG9uIGlucHVcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5yYW5nZXNBcnJheS5sZW5ndGggJiYgdGhpcy5zaG93UmFuZ2VMYWJlbE9uSW5wdXQgPT09IHRydWUgJiYgdGhpcy5jaG9zZW5SYW5nZSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsICE9PSB0aGlzLmNob3NlblJhbmdlKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuTGFiZWwgPSB0aGlzLmNob3NlblJhbmdlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuTGFiZWwgPSB0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQodGhpcy5sb2NhbGUuZm9ybWF0KSArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9jYWxlLnNlcGFyYXRvciArIHRoaXMuZW5kRGF0ZS5mb3JtYXQodGhpcy5sb2NhbGUuZm9ybWF0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoIHRoaXMuYXV0b1VwZGF0ZUlucHV0KSB7XG4gICAgICAgICAgICB0aGlzLmNob3NlbkxhYmVsID0gdGhpcy5zdGFydERhdGUuZm9ybWF0KHRoaXMubG9jYWxlLmZvcm1hdCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmUoKSB7XG4gICAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB0aGlzIHNob3VsZCBjYWxjdWxhdGUgdGhlIGxhYmVsXG4gICAgICovXG4gICAgY2FsY3VsYXRlQ2hvc2VuTGFiZWwgKCkge1xuICAgICAgICBsZXQgY3VzdG9tUmFuZ2UgPSB0cnVlO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIGlmICh0aGlzLnJhbmdlc0FycmF5Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZvciAoY29uc3QgcmFuZ2UgaW4gdGhpcy5yYW5nZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmb3JtYXQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gXCJZWVlZLU1NLUREIEhIOm1tOnNzXCIgOiBcIllZWVktTU0tREQgSEg6bW1cIjtcbiAgICAgICAgICAgICAgICAgICAgLy9pZ25vcmUgdGltZXMgd2hlbiBjb21wYXJpbmcgZGF0ZXMgaWYgdGltZSBwaWNrZXIgc2Vjb25kcyBpcyBub3QgZW5hYmxlZFxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zdGFydERhdGUuZm9ybWF0KGZvcm1hdCkgPT0gdGhpcy5yYW5nZXNbcmFuZ2VdWzBdLmZvcm1hdChmb3JtYXQpICYmIHRoaXMuZW5kRGF0ZS5mb3JtYXQoZm9ybWF0KSA9PSB0aGlzLnJhbmdlc1tyYW5nZV1bMV0uZm9ybWF0KGZvcm1hdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1c3RvbVJhbmdlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gdGhpcy5yYW5nZXNBcnJheVtpICsgMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vaWdub3JlIHRpbWVzIHdoZW4gY29tcGFyaW5nIGRhdGVzIGlmIHRpbWUgcGlja2VyIGlzIG5vdCBlbmFibGVkXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZS5mb3JtYXQoJ1lZWVktTU0tREQnKSA9PSB0aGlzLnJhbmdlc1tyYW5nZV1bMF0uZm9ybWF0KCdZWVlZLU1NLUREJykgJiYgdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09IHRoaXMucmFuZ2VzW3JhbmdlXVsxXS5mb3JtYXQoJ1lZWVktTU0tREQnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VzdG9tUmFuZ2UgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hvc2VuUmFuZ2UgPSB0aGlzLnJhbmdlc0FycmF5W2kgKyAxXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGN1c3RvbVJhbmdlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2hvd0N1c3RvbVJhbmdlTGFiZWwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaG9zZW5SYW5nZSA9IHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWw7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaG9zZW5SYW5nZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGlmIGN1c3RvbSBsYWJlbDogc2hvdyBjYWxlbmFyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93Q2FsSW5SYW5nZXMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KCk7XG4gICAgfVxuXG4gICAgY2xpY2tBcHBseShlPykge1xuICAgICAgICBpZiAoIXRoaXMuc2luZ2xlRGF0ZVBpY2tlciAmJiB0aGlzLnN0YXJ0RGF0ZSAmJiAhdGhpcy5lbmREYXRlKSB7XG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzSW52YWxpZERhdGUgJiYgdGhpcy5zdGFydERhdGUgJiYgdGhpcy5lbmREYXRlKSB7XG4gICAgICAgICAgICAvLyBnZXQgaWYgdGhlcmUgYXJlIGludmFsaWQgZGF0ZSBiZXR3ZWVuIHJhbmdlXG4gICAgICAgICAgICBsZXQgZCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG4gICAgICAgICAgICB3aGlsZShkLmlzQmVmb3JlKHRoaXMuZW5kRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0ludmFsaWREYXRlKGQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZW5kRGF0ZSA9IGQuc3VidHJhY3QoMSwgJ2RheXMnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZC5hZGQoMSwgJ2RheXMnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5jaG9zZW5MYWJlbCkge1xuICAgICAgICAgICAgdGhpcy5jaG9vc2VkRGF0ZS5lbWl0KHtjaG9zZW5MYWJlbDogdGhpcy5jaG9zZW5MYWJlbCwgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZSwgZW5kRGF0ZTogdGhpcy5lbmREYXRlfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRhdGVzVXBkYXRlZC5lbWl0KHtzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLCBlbmREYXRlOiB0aGlzLmVuZERhdGV9KTtcbiAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuXG4gICAgY2xpY2tDYW5jZWwoZSkge1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuX29sZC5zdGFydDtcbiAgICAgICAgdGhpcy5lbmREYXRlID0gdGhpcy5fb2xkLmVuZDtcbiAgICAgICAgaWYodGhpcy5pbmxpbmUpIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjYWxsZWQgd2hlbiBtb250aCBpcyBjaGFuZ2VkXG4gICAgICogQHBhcmFtIG1vbnRoRXZlbnQgZ2V0IHZhbHVlIGluIGV2ZW50LnRhcmdldC52YWx1ZVxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcbiAgICAgKi9cbiAgICBtb250aENoYW5nZWQobW9udGhFdmVudDogYW55LCBzaWRlOiBTaWRlRW51bSkge1xuICAgICAgICBjb25zdCB5ZWFyID0gdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudFllYXI7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gcGFyc2VJbnQobW9udGhFdmVudC50YXJnZXQudmFsdWUsIDEwKTtcbiAgICAgICAgdGhpcy5tb250aE9yWWVhckNoYW5nZWQobW9udGgsIHllYXIsIHNpZGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjYWxsZWQgd2hlbiB5ZWFyIGlzIGNoYW5nZWRcbiAgICAgKiBAcGFyYW0geWVhckV2ZW50IGdldCB2YWx1ZSBpbiBldmVudC50YXJnZXQudmFsdWVcbiAgICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XG4gICAgICovXG4gICAgeWVhckNoYW5nZWQoeWVhckV2ZW50OiBhbnksIHNpZGU6IFNpZGVFbnVtKSB7XG4gICAgICAgIGNvbnN0IG1vbnRoID0gdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kcm9wZG93bnMuY3VycmVudE1vbnRoO1xuICAgICAgICBjb25zdCB5ZWFyID0gcGFyc2VJbnQoeWVhckV2ZW50LnRhcmdldC52YWx1ZSwgMTApO1xuICAgICAgICB0aGlzLm1vbnRoT3JZZWFyQ2hhbmdlZChtb250aCwgeWVhciwgc2lkZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNhbGxlZCB3aGVuIHRpbWUgaXMgY2hhbmdlZFxuICAgICAqIEBwYXJhbSB0aW1lRXZlbnQgIGFuIGV2ZW50XG4gICAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodFxuICAgICAqL1xuICAgIHRpbWVDaGFuZ2VkKHRpbWVFdmVudDogYW55LCBzaWRlOiBTaWRlRW51bSkge1xuXG4gICAgICAgIHZhciBob3VyID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciwgMTApO1xuICAgICAgICB2YXIgbWludXRlID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlLCAxMCk7XG4gICAgICAgIHZhciBzZWNvbmQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kLCAxMCkgOiAwO1xuXG4gICAgICAgIGlmICghdGhpcy50aW1lUGlja2VyMjRIb3VyKSB7XG4gICAgICAgICAgICB2YXIgYW1wbSA9IHRoaXMudGltZXBpY2tlclZhcmlhYmxlc1tzaWRlXS5hbXBtTW9kZWw7XG4gICAgICAgICAgICBpZiAoYW1wbSA9PT0gJ1BNJyAmJiBob3VyIDwgMTIpXG4gICAgICAgICAgICAgICAgaG91ciArPSAxMjtcbiAgICAgICAgICAgIGlmIChhbXBtID09PSAnQU0nICYmIGhvdXIgPT09IDEyKVxuICAgICAgICAgICAgICAgIGhvdXIgPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcbiAgICAgICAgICAgIHZhciBzdGFydCA9IHRoaXMuc3RhcnREYXRlLmNsb25lKCk7XG4gICAgICAgICAgICBzdGFydC5ob3VyKGhvdXIpO1xuICAgICAgICAgICAgc3RhcnQubWludXRlKG1pbnV0ZSk7XG4gICAgICAgICAgICBzdGFydC5zZWNvbmQoc2Vjb25kKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhcnREYXRlKHN0YXJ0KTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNpbmdsZURhdGVQaWNrZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmVuZERhdGUgJiYgdGhpcy5lbmREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09IHN0YXJ0LmZvcm1hdCgnWVlZWS1NTS1ERCcpICYmIHRoaXMuZW5kRGF0ZS5pc0JlZm9yZShzdGFydCkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEVuZERhdGUoc3RhcnQuY2xvbmUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5lbmREYXRlKSB7XG4gICAgICAgICAgICB2YXIgZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XG4gICAgICAgICAgICBlbmQuaG91cihob3VyKTtcbiAgICAgICAgICAgIGVuZC5taW51dGUobWludXRlKTtcbiAgICAgICAgICAgIGVuZC5zZWNvbmQoc2Vjb25kKTtcbiAgICAgICAgICAgIHRoaXMuc2V0RW5kRGF0ZShlbmQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy91cGRhdGUgdGhlIGNhbGVuZGFycyBzbyBhbGwgY2xpY2thYmxlIGRhdGVzIHJlZmxlY3QgdGhlIG5ldyB0aW1lIGNvbXBvbmVudFxuICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuXG4gICAgICAgIC8vcmUtcmVuZGVyIHRoZSB0aW1lIHBpY2tlcnMgYmVjYXVzZSBjaGFuZ2luZyBvbmUgc2VsZWN0aW9uIGNhbiBhZmZlY3Qgd2hhdCdzIGVuYWJsZWQgaW4gYW5vdGhlclxuICAgICAgICB0aGlzLnJlbmRlclRpbWVQaWNrZXIoU2lkZUVudW0ubGVmdCk7XG4gICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqICBjYWxsIHdoZW4gbW9udGggb3IgeWVhciBjaGFuZ2VkXG4gICAgICogQHBhcmFtIG1vbnRoIG1vbnRoIG51bWJlciAwIC0xMVxuICAgICAqIEBwYXJhbSB5ZWFyIHllYXIgZWc6IDE5OTVcbiAgICAgKiBAcGFyYW0gc2lkZSBsZWZ0IG9yIHJpZ2h0XG4gICAgICovXG4gICAgbW9udGhPclllYXJDaGFuZ2VkKG1vbnRoOiBudW1iZXIsIHllYXI6IG51bWJlciwgc2lkZTogU2lkZUVudW0pIHtcbiAgICAgICAgY29uc3QgaXNMZWZ0ID0gc2lkZSA9PT0gU2lkZUVudW0ubGVmdDtcblxuICAgICAgICBpZiAoIWlzTGVmdCkge1xuICAgICAgICAgICAgaWYgKHllYXIgPCB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCkgfHwgKHllYXIgPT09IHRoaXMuc3RhcnREYXRlLnllYXIoKSAmJiBtb250aCA8IHRoaXMuc3RhcnREYXRlLm1vbnRoKCkpKSB7XG4gICAgICAgICAgICAgICAgbW9udGggPSB0aGlzLnN0YXJ0RGF0ZS5tb250aCgpO1xuICAgICAgICAgICAgICAgIHllYXIgPSB0aGlzLnN0YXJ0RGF0ZS55ZWFyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5taW5EYXRlKSB7XG4gICAgICAgICAgICBpZiAoeWVhciA8IHRoaXMubWluRGF0ZS55ZWFyKCkgfHwgKHllYXIgPT09IHRoaXMubWluRGF0ZS55ZWFyKCkgJiYgbW9udGggPCB0aGlzLm1pbkRhdGUubW9udGgoKSkpIHtcbiAgICAgICAgICAgICAgICBtb250aCA9IHRoaXMubWluRGF0ZS5tb250aCgpO1xuICAgICAgICAgICAgICAgIHllYXIgPSB0aGlzLm1pbkRhdGUueWVhcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubWF4RGF0ZSkge1xuICAgICAgICAgICAgaWYgKHllYXIgPiB0aGlzLm1heERhdGUueWVhcigpIHx8ICh5ZWFyID09PSB0aGlzLm1heERhdGUueWVhcigpICYmIG1vbnRoID4gdGhpcy5tYXhEYXRlLm1vbnRoKCkpKSB7XG4gICAgICAgICAgICAgICAgbW9udGggPSB0aGlzLm1heERhdGUubW9udGgoKTtcbiAgICAgICAgICAgICAgICB5ZWFyID0gdGhpcy5tYXhEYXRlLnllYXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmRyb3Bkb3ducy5jdXJyZW50WWVhciA9IHllYXI7XG4gICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uZHJvcGRvd25zLmN1cnJlbnRNb250aCA9IG1vbnRoO1xuICAgICAgICBpZiAoaXNMZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5tb250aChtb250aCkueWVhcih5ZWFyKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmxpbmtlZENhbGVuZGFycykge1xuICAgICAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aCA9IHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmNsb25lKCkuYWRkKDEsICdtb250aCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yaWdodENhbGVuZGFyLm1vbnRoLm1vbnRoKG1vbnRoKS55ZWFyKHllYXIpO1xuICAgICAgICAgICAgaWYgKHRoaXMubGlua2VkQ2FsZW5kYXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGggPSB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguY2xvbmUoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZUNhbGVuZGFycygpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENsaWNrIG9uIHByZXZpb3VzIG1vbnRoXG4gICAgICogQHBhcmFtIHNpZGUgbGVmdCBvciByaWdodCBjYWxlbmRhclxuICAgICAqL1xuICAgIGNsaWNrUHJldihzaWRlOiBTaWRlRW51bSkge1xuICAgICAgICBpZiAoc2lkZSA9PT0gU2lkZUVudW0ubGVmdCkge1xuICAgICAgICAgICAgdGhpcy5sZWZ0Q2FsZW5kYXIubW9udGguc3VidHJhY3QoMSwgJ21vbnRoJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguc3VidHJhY3QoMSwgJ21vbnRoJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJpZ2h0Q2FsZW5kYXIubW9udGguc3VidHJhY3QoMSwgJ21vbnRoJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xpY2sgb24gbmV4dCBtb250aFxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHQgY2FsZW5kYXJcbiAgICAgKi9cbiAgICBjbGlja05leHQoc2lkZTogU2lkZUVudW0pIHtcbiAgICAgICAgaWYgKHNpZGUgPT09IFNpZGVFbnVtLmxlZnQpIHtcbiAgICAgICAgICAgIHRoaXMubGVmdENhbGVuZGFyLm1vbnRoLmFkZCgxLCAnbW9udGgnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmlnaHRDYWxlbmRhci5tb250aC5hZGQoMSwgJ21vbnRoJyk7XG4gICAgICAgICAgICBpZiAodGhpcy5saW5rZWRDYWxlbmRhcnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRDYWxlbmRhci5tb250aC5hZGQoMSwgJ21vbnRoJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVDYWxlbmRhcnMoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogV2hlbiBzZWxlY3RpbmcgYSBkYXRlXG4gICAgICogQHBhcmFtIGUgZXZlbnQ6IGdldCB2YWx1ZSBieSBlLnRhcmdldC52YWx1ZVxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcbiAgICAgKiBAcGFyYW0gcm93IHJvdyBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCBkYXRlIGNsaWNrZWRcbiAgICAgKiBAcGFyYW0gY29sIGNvbCBwb3NpdGlvbiBvZiB0aGUgY3VycmVudCBkYXRlIGNsaWNrZWRcbiAgICAgKi9cbiAgICBjbGlja0RhdGUoZSwgc2lkZTogU2lkZUVudW0sIHJvdzogbnVtYmVyLCBjb2w6IG51bWJlcikge1xuICAgICAgICBpZiAoZS50YXJnZXQudGFnTmFtZSA9PT0gJ1REJykge1xuICAgICAgICAgICAgaWYgKCFlLnRhcmdldC5jbGFzc0xpc3QuY29udGFpbnMoJ2F2YWlsYWJsZScpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0LnRhZ05hbWUgPT09ICdTUEFOJykge1xuICAgICAgICAgICAgaWYgKCFlLnRhcmdldC5wYXJlbnRFbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnYXZhaWxhYmxlJykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmFuZ2VzQXJyYXkubGVuZ3RoKSB7XG4gICAgICAgICAgICB0aGlzLmNob3NlblJhbmdlID0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBkYXRlID0gc2lkZSA9PT0gIFNpZGVFbnVtLmxlZnQgPyB0aGlzLmxlZnRDYWxlbmRhci5jYWxlbmRhcltyb3ddW2NvbF0gOiB0aGlzLnJpZ2h0Q2FsZW5kYXIuY2FsZW5kYXJbcm93XVtjb2xdO1xuXG4gICAgICAgIGlmICh0aGlzLmVuZERhdGUgfHwgZGF0ZS5pc0JlZm9yZSh0aGlzLnN0YXJ0RGF0ZSwgJ2RheScpKSB7IC8vIHBpY2tpbmcgc3RhcnRcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcbiAgICAgICAgICAgICAgICBkYXRlID0gdGhpcy5fZ2V0RGF0ZVdpdGhUaW1lKGRhdGUsIFNpZGVFbnVtLmxlZnQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5zZXRTdGFydERhdGUoZGF0ZS5jbG9uZSgpKTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5lbmREYXRlICYmIGRhdGUuaXNCZWZvcmUodGhpcy5zdGFydERhdGUpKSB7XG4gICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IGNsaWNraW5nIHRoZSBzYW1lIGRhdGUgZm9yIHN0YXJ0L2VuZCxcbiAgICAgICAgICAgIC8vIGJ1dCB0aGUgdGltZSBvZiB0aGUgZW5kIGRhdGUgaXMgYmVmb3JlIHRoZSBzdGFydCBkYXRlXG4gICAgICAgICAgICB0aGlzLnNldEVuZERhdGUodGhpcy5zdGFydERhdGUuY2xvbmUoKSk7XG4gICAgICAgIH0gZWxzZSB7IC8vIHBpY2tpbmcgZW5kXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lUGlja2VyKSB7XG4gICAgICAgICAgICAgICAgZGF0ZSA9IHRoaXMuX2dldERhdGVXaXRoVGltZShkYXRlLCBTaWRlRW51bS5yaWdodClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc2V0RW5kRGF0ZShkYXRlLmNsb25lKCkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b0FwcGx5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVDaG9zZW5MYWJlbCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2tBcHBseSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuc2luZ2xlRGF0ZVBpY2tlcikge1xuICAgICAgICAgICAgdGhpcy5zZXRFbmREYXRlKHRoaXMuc3RhcnREYXRlKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b0FwcGx5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbGlja0FwcGx5KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVZpZXcoKTtcblxuICAgICAgICAvLyBUaGlzIGlzIHRvIGNhbmNlbCB0aGUgYmx1ciBldmVudCBoYW5kbGVyIGlmIHRoZSBtb3VzZSB3YXMgaW4gb25lIG9mIHRoZSBpbnB1dHNcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiAgQ2xpY2sgb24gdGhlIGN1c3RvbSByYW5nZVxuICAgICAqIEBwYXJhbSBlOiBFdmVudFxuICAgICAqIEBwYXJhbSBsYWJlbFxuICAgICAqL1xuICAgIGNsaWNrUmFuZ2UoZSwgbGFiZWwpIHtcbiAgICAgICAgdGhpcy5jaG9zZW5SYW5nZSA9IGxhYmVsO1xuICAgICAgICBpZiAobGFiZWwgPT0gdGhpcy5sb2NhbGUuY3VzdG9tUmFuZ2VMYWJlbCkge1xuICAgICAgICAgICAgdGhpcy5pc1Nob3duICA9IHRydWU7IC8vIHNob3cgY2FsZW5kYXJzXG4gICAgICAgICAgICB0aGlzLnNob3dDYWxJblJhbmdlcyA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZGF0ZXMgPSB0aGlzLnJhbmdlc1tsYWJlbF07XG4gICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IGRhdGVzWzBdLmNsb25lKCk7XG4gICAgICAgICAgICB0aGlzLmVuZERhdGUgPSBkYXRlc1sxXS5jbG9uZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1JhbmdlTGFiZWxPbklucHV0ICYmIGxhYmVsICE9PSB0aGlzLmxvY2FsZS5jdXN0b21SYW5nZUxhYmVsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jaG9zZW5MYWJlbCA9IGxhYmVsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGN1bGF0ZUNob3NlbkxhYmVsKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnNob3dDYWxJblJhbmdlcyA9ICghdGhpcy5yYW5nZXNBcnJheS5sZW5ndGgpIHx8IHRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCF0aGlzLnRpbWVQaWNrZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZS5zdGFydE9mKCdkYXknKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZERhdGUuZW5kT2YoJ2RheScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMuYWx3YXlzU2hvd0NhbGVuZGFycykge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTaG93biAgPSBmYWxzZTsgLy8gaGlkZSBjYWxlbmRhcnNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmFuZ2VDbGlja2VkLmVtaXQoe2xhYmVsOiBsYWJlbCwgZGF0ZXM6IGRhdGVzfSk7XG4gICAgICAgICAgICBpZiAoIXRoaXMua2VlcENhbGVuZGFyT3BlbmluZ1dpdGhSYW5nZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2tBcHBseSgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlckNhbGVuZGFyKFNpZGVFbnVtLmxlZnQpO1xuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoU2lkZUVudW0ucmlnaHQpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRpbWVQaWNrZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJUaW1lUGlja2VyKFNpZGVFbnVtLmxlZnQpXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyVGltZVBpY2tlcihTaWRlRW51bS5yaWdodClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH07XG5cblxuXG4gICAgc2hvdyhlPykge1xuICAgICAgICBpZiAodGhpcy5pc1Nob3duKSB7IHJldHVybjsgfVxuICAgICAgICB0aGlzLl9vbGQuc3RhcnQgPSB0aGlzLnN0YXJ0RGF0ZS5jbG9uZSgpO1xuICAgICAgICB0aGlzLl9vbGQuZW5kID0gdGhpcy5lbmREYXRlLmNsb25lKCk7XG4gICAgICAgIHRoaXMuaXNTaG93biA9IHRydWU7XG4gICAgICAgIHRoaXMudXBkYXRlVmlldygpO1xuICAgIH1cblxuICAgIGhpZGUoZT8pIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzU2hvd24pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBpbmNvbXBsZXRlIGRhdGUgc2VsZWN0aW9uLCByZXZlcnQgdG8gbGFzdCB2YWx1ZXNcbiAgICAgICAgaWYgKCF0aGlzLmVuZERhdGUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9vbGQuc3RhcnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IHRoaXMuX29sZC5zdGFydC5jbG9uZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX29sZC5lbmQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZERhdGUgPSB0aGlzLl9vbGQuZW5kLmNsb25lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBhIG5ldyBkYXRlIHJhbmdlIHdhcyBzZWxlY3RlZCwgaW52b2tlIHRoZSB1c2VyIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgICAgIGlmICghdGhpcy5zdGFydERhdGUuaXNTYW1lKHRoaXMuX29sZC5zdGFydCkgfHwgIXRoaXMuZW5kRGF0ZS5pc1NhbWUodGhpcy5fb2xkLmVuZCkpIHtcbiAgICAgICAgICAgLy8gdGhpcy5jYWxsYmFjayh0aGlzLnN0YXJ0RGF0ZSwgdGhpcy5lbmREYXRlLCB0aGlzLmNob3NlbkxhYmVsKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHBpY2tlciBpcyBhdHRhY2hlZCB0byBhIHRleHQgaW5wdXQsIHVwZGF0ZSBpdFxuICAgICAgICB0aGlzLnVwZGF0ZUVsZW1lbnQoKTtcbiAgICAgICAgdGhpcy5pc1Nob3duID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3JlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGhhbmRsZSBjbGljayBvbiBhbGwgZWxlbWVudCBpbiB0aGUgY29tcG9uZW50LCB1c2VmdWxsIGZvciBvdXRzaWRlIG9mIGNsaWNrXG4gICAgICogQHBhcmFtIGUgZXZlbnRcbiAgICAgKi9cbiAgICBoYW5kbGVJbnRlcm5hbENsaWNrKGUpIHtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIH1cbiAgICAvKipcbiAgICAgKiB1cGRhdGUgdGhlIGxvY2FsZSBvcHRpb25zXG4gICAgICogQHBhcmFtIGxvY2FsZVxuICAgICAqL1xuICAgIHVwZGF0ZUxvY2FsZShsb2NhbGUpIHtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbG9jYWxlKSB7XG4gICAgICAgICAgaWYgKGxvY2FsZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB0aGlzLmxvY2FsZVtrZXldID0gbG9jYWxlW2tleV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqICBjbGVhciB0aGUgZGF0ZXJhbmdlIHBpY2tlclxuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IG1vbWVudCgpLnN0YXJ0T2YoJ2RheScpO1xuICAgICAgICB0aGlzLmVuZERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XG4gICAgICAgIHRoaXMuY2hvb3NlZERhdGUuZW1pdCh7Y2hvc2VuTGFiZWw6ICcnLCBzdGFydERhdGU6IG51bGwsIGVuZERhdGU6IG51bGx9KTtcbiAgICAgICAgdGhpcy5kYXRlc1VwZGF0ZWQuZW1pdCh7c3RhcnREYXRlOiBudWxsLCBlbmREYXRlOiBudWxsfSk7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgb3V0IGlmIHRoZSBzZWxlY3RlZCByYW5nZSBzaG91bGQgYmUgZGlzYWJsZWQgaWYgaXQgZG9lc24ndFxuICAgICAqIGZpdCBpbnRvIG1pbkRhdGUgYW5kIG1heERhdGUgbGltaXRhdGlvbnMuXG4gICAgICovXG4gICAgZGlzYWJsZVJhbmdlKHJhbmdlKSB7XG4gICAgICBpZiAocmFuZ2UgPT09IHRoaXMubG9jYWxlLmN1c3RvbVJhbmdlTGFiZWwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgY29uc3QgcmFuZ2VNYXJrZXJzID0gdGhpcy5yYW5nZXNbcmFuZ2VdO1xuICAgICAgY29uc3QgYXJlQm90aEJlZm9yZSA9IHJhbmdlTWFya2Vycy5ldmVyeSggZGF0ZSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5taW5EYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGUuaXNCZWZvcmUodGhpcy5taW5EYXRlKVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGFyZUJvdGhBZnRlciA9IHJhbmdlTWFya2Vycy5ldmVyeSggZGF0ZSA9PiB7XG4gICAgICAgIGlmICghdGhpcy5tYXhEYXRlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGRhdGUuaXNBZnRlcih0aGlzLm1heERhdGUpXG4gICAgICB9KTtcbiAgICAgIHJldHVybiAoYXJlQm90aEJlZm9yZSB8fCBhcmVCb3RoQWZ0ZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZGF0ZSB0aGUgZGF0ZSB0byBhZGQgdGltZVxuICAgICAqIEBwYXJhbSBzaWRlIGxlZnQgb3IgcmlnaHRcbiAgICAgKi9cbiAgICBwcml2YXRlIF9nZXREYXRlV2l0aFRpbWUoZGF0ZSwgc2lkZTogU2lkZUVudW0pOiBfbW9tZW50Lk1vbWVudCB7XG4gICAgICAgIGxldCBob3VyID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkSG91ciwgMTApO1xuICAgICAgICBpZiAoIXRoaXMudGltZVBpY2tlcjI0SG91cikge1xuICAgICAgICAgICAgdmFyIGFtcG0gPSB0aGlzLnRpbWVwaWNrZXJWYXJpYWJsZXNbc2lkZV0uYW1wbU1vZGVsO1xuICAgICAgICAgICAgaWYgKGFtcG0gPT09ICdQTScgJiYgaG91ciA8IDEyKVxuICAgICAgICAgICAgICAgIGhvdXIgKz0gMTI7XG4gICAgICAgICAgICBpZiAoYW1wbSA9PT0gJ0FNJyAmJiBob3VyID09PSAxMilcbiAgICAgICAgICAgICAgICBob3VyID0gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbWludXRlID0gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkTWludXRlLCAxMCk7XG4gICAgICAgIHZhciBzZWNvbmQgPSB0aGlzLnRpbWVQaWNrZXJTZWNvbmRzID8gcGFyc2VJbnQodGhpcy50aW1lcGlja2VyVmFyaWFibGVzW3NpZGVdLnNlbGVjdGVkU2Vjb25kLCAxMCkgOiAwO1xuICAgICAgICByZXR1cm4gZGF0ZS5jbG9uZSgpLmhvdXIoaG91cikubWludXRlKG1pbnV0ZSkuc2Vjb25kKHNlY29uZCk7XG4gICAgfVxuICAgIHByaXZhdGUgX2J1aWxkQ2VsbHMoY2FsZW5kYXIsIHNpZGU6IFNpZGVFbnVtKSB7XG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IDY7IHJvdysrKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmNsYXNzZXNbcm93XSA9IHt9O1xuICAgICAgICAgICAgY29uc3Qgcm93Q2xhc3NlcyA9IFtdO1xuICAgICAgICAgICAgaWYodGhpcy5lbXB0eVdlZWtSb3dDbGFzcyAmJiAhdGhpcy5oYXNDdXJyZW50TW9udGhEYXlzKHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0ubW9udGgsIGNhbGVuZGFyW3Jvd10pKSB7XG4gICAgICAgICAgICAgICAgcm93Q2xhc3Nlcy5wdXNoKHRoaXMuZW1wdHlXZWVrUm93Q2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgNzsgY29sKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjbGFzc2VzID0gW107XG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHRvZGF5J3MgZGF0ZVxuICAgICAgICAgICAgICAgIGlmIChjYWxlbmRhcltyb3ddW2NvbF0uaXNTYW1lKG5ldyBEYXRlKCksICdkYXknKSkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ3RvZGF5Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGhpZ2hsaWdodCB3ZWVrZW5kc1xuICAgICAgICAgICAgICAgIGlmIChjYWxlbmRhcltyb3ddW2NvbF0uaXNvV2Vla2RheSgpID4gNSkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ3dlZWtlbmQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZ3JleSBvdXQgdGhlIGRhdGVzIGluIG90aGVyIG1vbnRocyBkaXNwbGF5ZWQgYXQgYmVnaW5uaW5nIGFuZCBlbmQgb2YgdGhpcyBjYWxlbmRhclxuICAgICAgICAgICAgICAgIGlmIChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSAhPT0gY2FsZW5kYXJbMV1bMV0ubW9udGgoKSkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ29mZicpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hcmsgdGhlIGxhc3QgZGF5IG9mIHRoZSBwcmV2aW91cyBtb250aCBpbiB0aGlzIGNhbGVuZGFyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMubGFzdERheU9mUHJldmlvdXNNb250aENsYXNzICYmIChjYWxlbmRhcltyb3ddW2NvbF0ubW9udGgoKSA8IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgfHwgY2FsZW5kYXJbMV1bMV0ubW9udGgoKSA9PT0gMCkgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmRhdGUoKSA9PT0gdGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5kYXlzSW5MYXN0TW9udGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCh0aGlzLmxhc3REYXlPZlByZXZpb3VzTW9udGhDbGFzcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBtYXJrIHRoZSBmaXJzdCBkYXkgb2YgdGhlIG5leHQgbW9udGggaW4gdGhpcyBjYWxlbmRhclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLmZpcnN0RGF5T2ZOZXh0TW9udGhDbGFzcyAmJiAoY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPiBjYWxlbmRhclsxXVsxXS5tb250aCgpIHx8IGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpID09PSAwKSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZGF0ZSgpID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2godGhpcy5maXJzdERheU9mTmV4dE1vbnRoQ2xhc3MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIG1hcmsgdGhlIGZpcnN0IGRheSBvZiB0aGUgY3VycmVudCBtb250aCB3aXRoIGEgY3VzdG9tIGNsYXNzXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZmlyc3RNb250aERheUNsYXNzICYmIGNhbGVuZGFyW3Jvd11bY29sXS5tb250aCgpID09PSBjYWxlbmRhclsxXVsxXS5tb250aCgpICYmIGNhbGVuZGFyW3Jvd11bY29sXS5kYXRlKCkgPT09IGNhbGVuZGFyLmZpcnN0RGF5LmRhdGUoKSkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2godGhpcy5maXJzdE1vbnRoRGF5Q2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBtYXJrIHRoZSBsYXN0IGRheSBvZiB0aGUgY3VycmVudCBtb250aCB3aXRoIGEgY3VzdG9tIGNsYXNzXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMubGFzdE1vbnRoRGF5Q2xhc3MgJiYgY2FsZW5kYXJbcm93XVtjb2xdLm1vbnRoKCkgPT09IGNhbGVuZGFyWzFdWzFdLm1vbnRoKCkgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmRhdGUoKSA9PT0gY2FsZW5kYXIubGFzdERheS5kYXRlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKHRoaXMubGFzdE1vbnRoRGF5Q2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBkb24ndCBhbGxvdyBzZWxlY3Rpb24gb2YgZGF0ZXMgYmVmb3JlIHRoZSBtaW5pbXVtIGRhdGVcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5taW5EYXRlICYmIGNhbGVuZGFyW3Jvd11bY29sXS5pc0JlZm9yZSh0aGlzLm1pbkRhdGUsICdkYXknKSkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ29mZicsICdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBkb24ndCBhbGxvdyBzZWxlY3Rpb24gb2YgZGF0ZXMgYWZ0ZXIgdGhlIG1heGltdW0gZGF0ZVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLm1heERhdGUgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmlzQWZ0ZXIodGhpcy5jYWxlbmRhclZhcmlhYmxlc1tzaWRlXS5tYXhEYXRlLCAnZGF5JykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgYWxsb3cgc2VsZWN0aW9uIG9mIGRhdGUgaWYgYSBjdXN0b20gZnVuY3Rpb24gZGVjaWRlcyBpdCdzIGludmFsaWRcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0ludmFsaWREYXRlKGNhbGVuZGFyW3Jvd11bY29sXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKCdvZmYnLCAnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgc3RhcnQgZGF0ZVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZSAmJiBjYWxlbmRhcltyb3ddW2NvbF0uZm9ybWF0KCdZWVlZLU1NLUREJykgPT09IHRoaXMuc3RhcnREYXRlLmZvcm1hdCgnWVlZWS1NTS1ERCcpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnYWN0aXZlJywgJ3N0YXJ0LWRhdGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgZW5kIGRhdGVcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5lbmREYXRlICE9IG51bGwgJiYgY2FsZW5kYXJbcm93XVtjb2xdLmZvcm1hdCgnWVlZWS1NTS1ERCcpID09PSB0aGlzLmVuZERhdGUuZm9ybWF0KCdZWVlZLU1NLUREJykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKCdhY3RpdmUnLCAnZW5kLWRhdGUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaGlnaGxpZ2h0IGRhdGVzIGluLWJldHdlZW4gdGhlIHNlbGVjdGVkIGRhdGVzXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZW5kRGF0ZSAhPSBudWxsICYmIGNhbGVuZGFyW3Jvd11bY29sXSA+IHRoaXMuc3RhcnREYXRlICYmIGNhbGVuZGFyW3Jvd11bY29sXSA8IHRoaXMuZW5kRGF0ZSkge1xuICAgICAgICAgICAgICAgICAgICBjbGFzc2VzLnB1c2goJ2luLXJhbmdlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGFwcGx5IGN1c3RvbSBjbGFzc2VzIGZvciB0aGlzIGRhdGVcbiAgICAgICAgICAgICAgICBjb25zdCBpc0N1c3RvbSA9IHRoaXMuaXNDdXN0b21EYXRlKGNhbGVuZGFyW3Jvd11bY29sXSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ3VzdG9tICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlzQ3VzdG9tID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3Nlcy5wdXNoKGlzQ3VzdG9tKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGNsYXNzZXMsIGlzQ3VzdG9tKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBzdG9yZSBjbGFzc2VzIHZhclxuICAgICAgICAgICAgICAgIGxldCBjbmFtZSA9ICcnLCBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjbmFtZSArPSBjbGFzc2VzW2ldICsgJyAnO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY2xhc3Nlc1tpXSA9PT0gJ2Rpc2FibGVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZGlzYWJsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgY25hbWUgKz0gJ2F2YWlsYWJsZSc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJWYXJpYWJsZXNbc2lkZV0uY2xhc3Nlc1tyb3ddW2NvbF0gPSBjbmFtZS5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyVmFyaWFibGVzW3NpZGVdLmNsYXNzZXNbcm93XS5jbGFzc0xpc3QgPSByb3dDbGFzc2VzLmpvaW4oJyAnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmQgb3V0IGlmIHRoZSBjdXJyZW50IGNhbGVuZGFyIHJvdyBoYXMgY3VycmVudCBtb250aCBkYXlzXG4gICAgICogKGFzIG9wcG9zZWQgdG8gY29uc2lzdGluZyBvZiBvbmx5IHByZXZpb3VzL25leHQgbW9udGggZGF5cylcbiAgICAgKi9cbiAgICBoYXNDdXJyZW50TW9udGhEYXlzKGN1cnJlbnRNb250aCwgcm93KSB7XG4gICAgICAgIGZvciAobGV0IGRheSA9IDA7IGRheSA8IDc7IGRheSsrKSB7XG4gICAgICAgICAgICBpZihyb3dbZGF5XS5tb250aCgpID09PSBjdXJyZW50TW9udGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufVxuIl19