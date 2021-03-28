import 'date-fns';
import React from 'react';
import { inject, observer } from "mobx-react";
import { ICommonStore} from '../../Stores/commonStore';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} 
from '@material-ui/pickers';
import moment from 'moment';
import koLocale from "date-fns/locale/ko";

interface DatePickerProps {
    history?: any
    commonStore?: ICommonStore
    date_type: string
}

@inject("commonStore")
@observer
class DatePicker extends React.Component<DatePickerProps, {}> {
    render() {
        const common = this.props.commonStore as ICommonStore;
        return (
            <div id="echarts-datepicker">
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={koLocale}>
                    <Grid container justify="space-around">
                        <KeyboardDatePicker
                            margin="normal"
                            id="date-picker-dialog"
                            format="yyyy/MM/dd"
                            value={new Date(this.props.date_type === 'start_date_id' ? common.start_date_id : common.end_date_id)}
                            onChange={(e:any) => common.setDateChange(this.props.date_type, moment(e).format('YYYY-MM-DD'))}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            InputProps={{
                                'disabled': true,
                            }}
                            maxDate = {this.props.date_type === 'start_date_id' ? new Date(moment(common.end_date_id).add( -1 , 'months').format('YYYY-MM-DD')): new Date('2021-02-28')}
                            minDate = {this.props.date_type === 'end_date_id' ? new Date(moment(common.start_date_id).add( +1 , 'months').format('YYYY-MM-DD')): new Date('2019-03-01')}
                        />
                    </Grid>
                </MuiPickersUtilsProvider>
            </div>
        );
    }
}
export default DatePicker;