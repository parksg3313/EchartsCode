import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import { ICommonStore} from '../../Stores/commonStore';
import { observer, inject} from 'mobx-react';

interface SnackBarProps {
    history?: any
    title?: string
    commonStore?: ICommonStore
}
@inject('commonStore')
@observer
class SnackBar extends React.Component<SnackBarProps, {}> {
    componentDidMount () {
    }
    render() {
        const store = this.props.commonStore as ICommonStore;
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                open={store.snackbar_show}
                autoHideDuration={10000}
                onClose={() => store.setSnackbarHide(false, "")}
                message={store.snackbar_message}
                className="position-center"
            />
        );
    }
}
export default SnackBar;

