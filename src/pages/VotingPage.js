import React, {Component} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import {grey400} from 'material-ui/styles/colors';
import PageBase from '../pages/PageBase2';
import globalStyles from '../styles';
import {loadLoc} from '../redux/ducks/locs/loc';
import {showLOCModal} from '../redux/ducks/ui/modal';
import {dateFormatOptions} from '../config';

const styles = {
    locName: {
        fontSize: 19,
    },
    lightGrey: {
        color: grey400,
        fontSize: 12,
        padding: '10px 0px',
    },
    ongoing: {
        color: 'orange'
    },
    declined: {
        color: 'red'
    },
    statusBlock: {
        textAlign: 'right',
        width: 130,
        float: 'right',
    },
    filterBlock: {
        textAlign: 'right'
    },
    filterMenu: {
        margin: "-15px -25px"
    },
};

const OngoingStatusBlock = <div style={styles.statusBlock}>
        <div style={styles.ongoing}>
            ONGOING<br/>
        </div>
    </div>;

const closedStatusBlock = <div style={styles.statusBlock}>
    <div style={styles.declined}>
        DECLINED<br/>
    </div>
</div>;

const mapStateToProps = (state) => ({
    locs: state.get('locs'),
});

const mapDispatchToProps = (dispatch) => ({
    showLOCModal: locKey => dispatch(showLOCModal(locKey)),
    loadLoc: loc => dispatch(loadLoc(loc)),
});

@connect(mapStateToProps, mapDispatchToProps)
class VotingPage extends Component {

    constructor(props) {
        super(props);
        this.state = {value: 1};
    }

    handleShowLOCModal = (locKey) => {
        this.props.loadLoc(locKey);
        this.props.showLOCModal({locKey});
    };

    render() {
        const {locs} = this.props;
        return (
            <PageBase title={<div><span style={{verticalAlign: 'sub'}}>LOCs </span> <RaisedButton
                label="NEW LOC"
                primary={true}
                style={{verticalAlign: 'text-bottom', fontSize: 15}}
                onTouchTap={this.handleShowLOCModal.bind(null, null)}
                buttonStyle={{...globalStyles.raisedButton, }}
                labelStyle={globalStyles.raisedButtonLabel}
            />
            </div>}>

                <TextField
                    floatingLabelText="Search by title"
                    style={{width: 'calc(100% - 98px)'}}
                    //fullWidth={true}
                />
                <RaisedButton
                    label="SEARCH"
                    primary={true}
                    buttonStyle={globalStyles.raisedButton}
                    style={{marginTop: 33, width: 88, float: 'right'}}
                    labelStyle={globalStyles.raisedButtonLabel}
                    //onTouchTap={this.handleSubmitClick.bind(this)}
                />

                <div style={{ minWidth: 300}}>
                    <span>
                        {locs.size} entries
                    </span>
                </div>

                {locs.map( (item, key) => {
                    let issueLimit = item.issueLimit();
                    let expDate = item.expDate();
                    return (
                        <Paper key={key} style={globalStyles.itemsPaper}>
                            <div>
                                {expDate > new Date().getTime() ? OngoingStatusBlock : closedStatusBlock}
                                <div style={styles.locName}>{item.get('locName')}</div>
                                <div style={globalStyles.itemGreyText}>
                                    Total issued amount: {issueLimit} LHUS<br />
                                    Total redeemed amount: {issueLimit} LHUS<br />
                                    Amount in circulation: {issueLimit} LHUS<br />
                                    Exp date: {new Date(expDate).toLocaleDateString("en-us", dateFormatOptions)}<br />
                                    {item.get('address')}
                                </div>
                                <div style={styles.lightGrey}>
                                    Added on {new Date(expDate).toLocaleDateString("en-us", dateFormatOptions)}
                                </div>
                            </div>
                            <div>
                                <FlatButton label="MORE INFO" style={{color: 'grey'}}/>
                                <FlatButton label="VIEW CONTRACT" style={{color: 'grey'}}
                                            onTouchTap={()=>{this.handleShowLOCModal(key);}}
                                />
                            </div>
                        </Paper>
                    )
                }).toArray()}
            </PageBase>
        );
    }
}

export default VotingPage;
