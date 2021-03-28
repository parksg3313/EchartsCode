import { observable, action} from 'mobx';
import axios from 'axios';

interface MeasuresType {
	value: number;
	name: string;
}
interface FreqType {
    value: string;
	name: string;
}
interface StyleType {
    height: string;
    width: string;
}
interface ParamsType {
    start_date_id: string
    end_date_id: string
    freq: string
    measures: string
}
export type ICommonStore = {
    snackbar_show: boolean
    setSnackbarHide: (state: boolean, text:string) => void
    snackbar_message: string | null
    start_date_id: string
    end_date_id: string
    freq: string
    setDateChange: (type: string, value: any) => void
    measures_list: MeasuresType[]
    option: any,
    style: StyleType
    dimensions: string,
    measures: number,
    freq_list: FreqType[]
    data_len: number
    getHeatmapData: () => void
    setHeatmapData: (option:any, data_len: number) => void
    measures_text_list: [string, string, string, string, string, string]
}

class CommonStore {
    @observable loading_state: boolean = false;
    @observable snackbar_show: boolean = false;
    @observable snackbar_message: string | null = "";
    @observable start_date_id: string = '2020-01-01';
    @observable end_date_id: string = '2021-02-28';
    @observable freq: string = 'quarters';
    @observable measures_list: MeasuresType[] = [
        {value:0, name:'ltv'},
        {value:1, name:'ltv_diff'},
        {value:2, name:'cohort_user_cnt'},
        {value:3, name:'user_cnt'},
        {value:4, name:'acc_sales'},
        {value:5, name:'sales'}
    ];
    @observable option: any = {};
    @observable style: StyleType = { height: "40vw", width: "90%"};
    @observable dimensions: string = "m";
    @observable measures: number = 0;
    @observable freq_list: FreqType[] = [
        {value:'weeks', name:'weeks'},
        {value:'months', name:'months'},
        {value:'quarters', name:'quarters'},
    ];
    @observable data_len: number = 0;
    @observable measures_text_list: [string, string, string, string, string, string] = ['Itv', 'Itv Diff', 'Cohort User Count', 'User Count', 'Acc Sales', 'Sales'];
    @action
    public setSnackbarHide = (state: boolean, text:string) => {
        this.snackbar_show = state;
        this.snackbar_message = text;
    }
    @action
    public setDateChange = (type: string, value: any) => {
        let change_value = type === 'measures' ? value.target.value : value;
        if(type === 'start_date_id') {
            this.start_date_id = change_value;
        } else if (type === 'end_date_id') {
            this.end_date_id = change_value;
        } else if (type === 'freq') {
            this.freq = change_value;
        } else if (type === 'measures') {
            this.measures = parseInt(change_value)
        }
        this.getHeatmapData();        
    }
    @action
    public setHeatmapData = (option:any, data_len: number) => {
        this.option = option;
        this.data_len = data_len;
    }
    @action
    public getHeatmapData = () => {
        this.setSnackbarHide(true, '데이터를 불러오는 중입니다...');
        const max_show_len:number = 16;
        let params:ParamsType = {
            start_date_id: this.start_date_id,
            end_date_id: this.end_date_id,
            freq: this.freq,
            measures: "ltv,ltv_diff,cohort_user_cnt,user_cnt,acc_sales"
        }
        axios.get(`https://2b4ei4ozo0.execute-api.ap-northeast-2.amazonaws.com/beta/dashboard/cohort?uuid=4aac3083-2642-4e59-a124-9d7169fea2cd`, {params})
            .then(res => {
                let data:any = [];
                for(let i=0; i<res.data.data.measures[this.measures].length; i++) {
                    for(let j=0; j<res.data.data.measures[this.measures][i].length; j++) {
                        data.push([
                                j,
                                res.data.data.measures[this.measures][i].length-1-i,
                                res.data.data.measures[this.measures][i][j]
                            ]
                        )
                        for(let k=0; k<res.data.data.measures.length; k ++) {
                            data[data.length-1][k+3] = res.data.data.measures[k][i][j]
                        }
                    }
                }
                let measures_text_list:[string, string, string, string, string, string] = this.measures_text_list;
                let data_max:number = Math.max.apply(Math, res.data.data.measures[this.measures].flat());
                let selt_measures:number = this.measures;
                let measures_data_list_len:number = res.data.data.measures[selt_measures].length;
                let option:any = {
                    tooltip: {
                        position: 'top',
                        formatter: function (param:any) {
                            let tootip_str:string = "";
                            for(let i=3; i<param.data.length; i++) {
                                tootip_str+= measures_text_list[i-3] + ': ' + (param.data[i] === null ? 0 :param.data[i].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))+ '<br/>'
                            }
                            return [
                                tootip_str
                            ].join('');
                        }
                    },
                    grid: {
                        height: '80%',
                        top: '10%',
                        width: '86%'
                    },
                    xAxis: {
                        type: 'category',
                        data: res.data.data.dimensions,
                        splitArea: {
                            show: true
                        },
                        position: 'top'
                    },
                    yAxis: {
                        type: 'category',
                        data: res.data.index.reverse(),
                        splitArea: {
                            show: true
                        }
                    },
                    visualMap: {
                        min: 0,
                        max: data_max,
                        calculable: true,
                        orient: 'horizontal',
                        right: '0%',
                        top: '0%',
                        color: ['rgb(60,129,185)', 'rgb(255,255,255)'],
                        dimension: selt_measures+3,
                    },
                    series: [{
                        name: 'Punch Card',
                        type: 'heatmap',
                        data: data,
                        label: {
                            show: measures_data_list_len < max_show_len ? true : false,
                            formatter: function (param:any) {
                                if(measures_data_list_len < max_show_len) {
                                    let new_data = param.data[selt_measures+3] > 1000 ? Math.round(param.data[selt_measures+3]/1000) + 'K': param.data[selt_measures+3]
                                    return new_data;
                                } else {
                                    return "";
                                }
                                
                            }
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        show: measures_data_list_len < max_show_len ? true :  false
                    }]
                }
                this.setHeatmapData(option, measures_data_list_len)
                this.setSnackbarHide(false, "");

            })
            .catch(error => {
                console.log(error);
                this.setSnackbarHide(false, "");
            });
    }
}

export default new CommonStore();