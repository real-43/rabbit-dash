import React, { useState } from "react";
import "react-dates/initialize";
import { DateRangePicker, isInclusivelyBeforeDay } from "react-dates";
import "react-dates/lib/css/_datepicker.css";
import moment from 'moment';

function DatePicker(props) {
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());
    const [focusedInput, setFocusedInput] = useState();
    
    const handleDatesChange = async ({ startDate, endDate }) => {
        console.log('date',startDate.format('YYYY-MM-DD'),' == to == ',endDate.format('YYYY-MM-DD'))
        await props.func_setSelect(startDate.format('YYYY-MM-DD'), props.setformdate);
        await props.func_setSelect(endDate.format('YYYY-MM-DD'), props.settodate);
        setStartDate(startDate);
        setEndDate(endDate);
        // console.log(moment())
    };
    return (
        <DateRangePicker
            startDate={startDate}
            startDateId="tata-start-date"
            endDate={endDate}
            endDateId="tata-end-date"
            onDatesChange={handleDatesChange}
            focusedInput={focusedInput}
            onFocusChange={focusedInput => setFocusedInput(focusedInput)}
            showDefaultInputIcon
            inputIconPosition="after"
            showClearDates={true}
            isOutsideRange={(day) => isInclusivelyBeforeDay(moment().add(1, 'day'), day) }
            minimumNights={0}
        />
    );
}

export default DatePicker;
