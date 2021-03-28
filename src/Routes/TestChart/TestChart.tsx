import React from "react";
import { inject, observer } from "mobx-react";
import { ICommonStore} from '../../Stores/commonStore';
import { toJS } from 'mobx';
import ReactEcharts from 'echarts-for-react';
import { NativeSelect } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import DatePicker from '../../Components/DatePicker';

interface EchartsProps {
    history?: any
    match?: any
    commonStore?: ICommonStore
}
@inject("commonStore")
@observer
class Echarts extends React.Component<EchartsProps, {}> {
    componentDidMount () {
        const common = this.props.commonStore as ICommonStore;
        common.getHeatmapData();
    }
    render() {
        const common = this.props.commonStore as ICommonStore;
        return (
            <div id="echarts-content">
                <div className="full-period-content">
                    <div className="full-period-content-fix">
                        <DatePicker history={this.props.history} date_type='start_date_id'/>
                        <span className="date-dash"> ~ </span>
                        <DatePicker history={this.props.history} date_type='end_date_id'/>
                    </div>
                </div>
                <div className="echarts-btn-content">
                    <div className="echarts-btn-content-fix">
                        <NativeSelect className="native-select" onChange={(e:any) => common.setDateChange('measures',e)}>
                            {toJS(common.measures_list).map((item: any, i: number) => (
                                <option key={i} value={item.value} >{item.name}</option>
                            ))}
                        </NativeSelect>
                        <ButtonGroup color="primary" aria-label="outlined primary button group">
                            {toJS(common.freq_list).map((item: any, i: number) => (
                                <Button className={common.freq === item.value ? "btn-on" : ""} key={i} value={item.value} onClick={(e:any) => common.setDateChange('freq', item.value)}>{item.name}</Button>
                            ))}
                        </ButtonGroup>
                    </div>
                </div>
                <ReactEcharts option={toJS(common.option)} style={toJS(common.style)}/>
            </div>
        );
    }
}
export default Echarts;