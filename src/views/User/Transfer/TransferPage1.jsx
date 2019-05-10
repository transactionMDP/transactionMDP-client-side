import React from "react";
import { Link } from "react-router-dom";
import {acceptTransfer, cancelTransfer, getTransfer, sendTransfer} from '../../../util/APIs';
// react plugin used to create datetime
import { formatDateTime } from "../../../util/Helpers";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  FormGroup,
  Label,
  Button,
  Breadcrumb,
  BreadcrumbItem
} from "reactstrap";
import NotFound from "../../NotFound";
import LoadingIndicator from "../../../components/LoadingIndicator/LoadingIndicator";

import { connect } from "react-redux";
import { getCurrentUser } from "../../../redux/actions";

// Sweet alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

/* Cette page présente un formulaire qui contient l'ensemble des informations demandées pour effectuer un virement */

class TransferPage extends React.Component {
    // Constructeur
    constructor(props) {
        super(props);
        this.state = {
            transfer: null,
            isLoading: true,
        };
        this.loadTransferDetails = this.loadTransferDetails.bind(this);
    }

    componentDidMount() {
        this.props.getCurrentUser();
        const id = this.props.match.params.id;
        this.loadTransferDetails(id);
    }

    loadTransferDetails(id) {
        this.setState({
            isLoading: true
        });

        getTransfer(id)
            .then(response => {
                console.log(response);
                this.setState({
                    transfer: response,
                    isLoading: false
                });
            }).catch(error => {
            if(error.status === 404) {
                this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    handleCancelTransfer(id) {
        MySwal.fire({
            buttonsStyling:false,
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger',
            },
            title: 'Entrer votre motif',
            input: 'textarea',
            inputPlaceholder: 'Votre motif ...',
            showCancelButton: true,
            confirmButtonText: 'Confirmer',
            cancelButtonText: 'Annuler'
        }).then((result) => {
            if (result.value) {
                let reason = result.value;
                cancelTransfer(id, reason)
                    .then(response => {

                        /*return */MySwal.fire({
                            type: 'success',
                            title: 'Votre operation a été enregistrée',
                            showConfirmButton: false,
                            timer: 1500
                        });
                        this.loadTransfersList();
                    }).catch(error => {
                    if(error.status === 401) {
                        MySwal.fire({
                          type: 'error',
                          title: 'Vous avez été déconnecté. Veuillez vous connecter pour effectuer cette opération.',
                          showConfirmButton: false,
                          timer: 1500
                        })
                    } else {
                         MySwal.fire({
                          type: 'warning',
                          title: error.message || 'Pardon! Quelque chose s\'est mal passé. Veuillez réessayer!',
                          showConfirmButton: false,
                          timer: 1500
                        })
                    }
                });
            }
        })
    }

    handleAcceptTransfer(id) {
        acceptTransfer(id)
            .then(response => {

                /*return */MySwal.fire({
                    type: 'success',
                    title: 'Votre operation a été enregistrée',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.loadTransfersList();
            }).catch(error => {
            if(error.status === 401) {
                MySwal.fire({
                    type: 'error',
                    title: 'Vous avez été déconnecté. Veuillez vous connecter pour effectuer cette opération.',
                    showConfirmButton: false,
                    timer: 1500
                });
                //this.props.history.push('/login');
            } else {
                MySwal.fire({
                    type: 'warning',
                    title: error.message || 'Pardon! Quelque chose s\'est mal passé. Veuillez réessayer!',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.props.history.push('/login');
            }
        });
    }

    handleSendTransfer(id) {
        sendTransfer(id)
            .then(response => {

                /*return */MySwal.fire({
                    type: 'success',
                    title: 'Votre operation a été enregistrée',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.loadTransfersList();
            }).catch(error => {
            if(error.status === 401) {
                MySwal.fire({
                    type: 'error',
                    title: 'Vous avez été déconnecté. Veuillez vous connecter pour effectuer cette opération.',
                    showConfirmButton: false,
                    timer: 1500
                });
                this.props.history.push('/login');
            } else {
                MySwal.fire({
                    type: 'warning',
                    title: error.message ||'Pardon! Quelque chose s\'est mal passé. Veuillez réessayer!',
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    }

    renderSwitch(state) {
        switch(state) {
            case 'accepted':
                return <><Button className="btn-link" color="success" style={{pointerEvents: 'none'}}>Validée</Button>
                    {` `}<Button className="btn-icon btn-simple" onClick={this.handleCancelTransfer} style={{border:0}} color="primary" size="sm">
                        <i className="fa fa-times" />
                    </Button>
                </>;
            case 'in_progress':
                return <><Button className="btn-link" color="warning" style={{pointerEvents: 'none'}}>Encours</Button>
                    {` `}<Button className="btn-icon btn-simple" onClick={this.handleCancelTransfer} style={{border:0}} color="primary" size="sm">
                        <i className="fa fa-times" />
                    </Button>
                </>;
            case 'cancelled':
                return <><Button className="btn-link" color="danger" style={{pointerEvents: 'none'}}>Rejetée</Button>
                    {` `}<Button className="btn-icon btn-simple" onClick={this.handleCancelTransfer} style={{border:0}} color="primary" size="sm">
                        <i className="fa fa-times" />
                    </Button>
                </>;
            default:
                return null;
        }
    }

    renderBtnCTN(link) {
        return(
            <>
                <Button className="btn-icon btn-simple" onClick={this.handleAcceptTransfer} style={{border:0}} color="primary" size="sm">
                    <i className="fa fa-check"></i>
                </Button>{` `}
                <Button className="btn-icon btn-simple" onClick={this.handleCancelTransfer} style={{border:0}} color="primary" size="sm">
                    <i className="fa fa-times" />
                </Button>{` `}
                <Button className="btn-icon btn-simple" href={link} style={{border:0}} color="primary" size="sm">
                    <i className="fa fa-eye"></i>
                </Button>
            </>
        );
    }

    renderBtnCTRL(link) {
        return(
            <>
                {this.renderBtnCTN(link)}
                {` `}
                <Button className="btn-icon btn-simple" onClick={this.handleSendTransfer} style={{border:0}} color="warning" size="sm">
                    <i className="fa fa-paper-plane"></i>
                </Button>
            </>
        );
    }

  render() {
      const { isLoading, transfer } = this.state;
      if(isLoading) {
          return <LoadingIndicator />;
      }

      if(this.state.notFound || !this.props.currentUser || !transfer) {
          return <NotFound />;
      }

      if(this.state.serverError) {
        return  <NotFound />;//<ServerError />;
      }
    return (
        <>
          <div className="content">
              <Breadcrumb>
                  <BreadcrumbItem><Link to="/user/lsttransfers">Mes virements</Link></BreadcrumbItem>
                  <BreadcrumbItem active>Virement</BreadcrumbItem>
              </Breadcrumb>
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <h4 className="title">Virement</h4>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col md="2"/>
                      <Col md="8">
                        {/* Virement INTRA en agence */}
                              <form onSubmit={this.handleSubmit} className="form-horizontal">
                                  <div className="form-row">
                                      <Label className={"col-md-4 col-form-label"} for="principalAccount">N° compte débiteur</Label>
                                      <FormGroup className="col-md-8">
                                          <p className="form-control-static">
                                              {/*transfer.creditAccount.accountNumber+" "*/}<span>{/*transfer.principalCurrency*/}</span>
                                          </p>
                                      </FormGroup>
                                  </div>

                                  <div className="form-row">
                                      <Label className={"col-md-4 col-form-label"} for="beneficiaryAccount">N° compte bénéficiaire</Label>
                                      <FormGroup className="col-md-8">
                                          <p className="form-control-static">
                                              {/*transfer.debitAccount.accountNumber+" "*/}<span>{/*transfer.beneficiaryCurrency*/}</span>
                                          </p>
                                      </FormGroup>
                                  </div>

                                  <div className="form-row">
                                      <Label className={"col-md-4 col-form-label"}  for="transactionAmount">Montant</Label>
                                      <FormGroup  className="col-md-8">
                                          <p className="form-control-static">
                                              {transfer.amount+" "}<span>{/*transfer.transactionCurrency*/}</span>
                                          </p>
                                      </FormGroup>
                                  </div>
                                  <div className="form-row">
                                      <Label className={"col-md-4 col-form-label"} for="transferReason">Motif</Label>
                                      <FormGroup className="col-md-8">
                                          <p className="form-control-static">{transfer.transferReason}</p>
                                      </FormGroup>
                                  </div>

                                  <div className="form-row">
                                      <Label className={"col-md-4 col-form-label"} for="executionDate">Date d'execution</Label>
                                      <FormGroup className="col-md-8">
                                          <p className="form-control-static">{formatDateTime(transfer.executionDate)}</p>
                                      </FormGroup>
                                  </div>

                          {/********************* Echange **************/
                          (transfer.principalCurrency==="MAD" && transfer.beneficiaryCurrency!=="MAD") ?(
                          <>
                            {
                              (transfer.transactionAmount>transfer.largeAmount)?(
                                  <div className="form-row">
                                      <Label className={"col-md-4 col-form-label"} for="tradingTicket">Ticket de négociation</Label>
                                      <FormGroup className="col-md-8">
                                        <p className="form-control-static">{transfer.tradingTicket}</p>
                                      </FormGroup>
                                  </div>
                              ):null
                            }
                                <div className="form-row">
                                    <Label className={"col-md-4 col-form-label"} for="transferNature">Nature de transfert</Label>
                                    <FormGroup className="col-md-8">
                                      <p className="form-control-static">{transfer.transferNature}</p>
                                    </FormGroup>
                                </div>

                                <div className="form-row">
                                     <Label className={"col-md-4 col-form-label"} for="authorizationNumber">N° d'autorisation</Label>
                                    <FormGroup className="col-md-8">
                                      <p className="form-control-static">{transfer.authorizationNumber}</p>
                                    </FormGroup>
                                </div>

                                <div className="form-row">
                                  <Label className={"col-md-4 col-form-label"} for="authorizationValidity">Validité de l'autorisation</Label>
                                    <FormGroup className="col-md-8">
                                      <p className="form-control-static">{transfer.authorizationValidity}</p>
                                    </FormGroup>
                                </div>

                                <div className="form-row">
                                    <Label className={"col-md-4 col-form-label"} for="exchangeRate">Cours de change</Label>
                                    <FormGroup className="col-md-8">
                                      <p className="form-control-static">{transfer.exchangeRate}</p>
                                    </FormGroup>
                                </div>
                              </>):null
                              /********************* Commission ****************/}

                                <div className="form-row">
                                    <Label className={"col-md-4 col-form-label"} for="chargeType">Type de charge</Label>
                                    <FormGroup className="col-md-8">
                                      <p className="form-control-static">{transfer.chargeType}</p>
                                    </FormGroup>
                                </div>

                                <div className="form-row">
                                    <Label className={"col-md-4 col-form-label"} for="commissionCode">Taux applique</Label>
                                    <FormGroup className="col-md-8">
                                      <p className="form-control-static">{transfer.applyedRate+" "}<span></span></p>
                                    </FormGroup>
                                </div>

                                <div className="form-row">
                                    <Label className={"col-md-4 col-form-label"} for="commissionAmount">Montant commission</Label>
                                    <FormGroup className="col-md-8">
                                      <p className="form-control-static">{transfer.commissionAmount+" "}<span></span></p>
                                    </FormGroup>
                                </div>

                                <div className="form-row">
                                    <Label className={"col-md-4 col-form-label"} for="commissionTVA">TVA sur commission</Label>
                                    <FormGroup className="col-md-8">
                                      <p className="form-control-static"> {transfer.commissionTVA+" "}<span></span></p>
                                    </FormGroup>
                                </div>

                                <div className="form-row">
                                    <Label className={"col-md-4 col-form-label"} for="totalAmount">Montant total</Label>
                                    <FormGroup className="col-md-8">
                                      <p className="form-control-static">{transfer.totalAmount+" "}<span>{transfer.transactionCurrency}</span></p>
                                    </FormGroup>
                                </div>

                                <div className="form-row">
                                    <Label className={"col-md-4 col-form-label"} for="applyCommission">Appliquer commission</Label>
                                    <FormGroup className="col-md-8">
                                        <p className="form-control-static">{transfer.applyCommission?"Oui":"Non"}</p>
                                    </FormGroup>
                                </div>

                                <div className="form-row">
                                    <Label className={"col-md-4 col-form-label"} for="applyCommission">Etat/Action</Label>
                                    <FormGroup className="col-md-8">
                                        {this.props.currentUser.role==="ROLE_AGENT"?this.renderSwitch(transfer.state):null}
                                        {this.props.currentUser.role==="ROLE_CTN"?this.renderBtnCTN("/user/transfers/"+transfer.id):null}
                                        {this.props.currentUser.role==="ROLE_CTRL"?this.renderBtnCTRL("/user/transfers/"+transfer.id):null}
                                    </FormGroup>
                                </div>
                                  {transfer.state==='cancelled' && this.props.currentUser.role==="ROLE_AGENT"?(
                                      <div className="form-row">
                                          <Label className={"col-md-4 col-form-label"} for="applyCommissio">Motif de l'annulation</Label>
                                          <FormGroup className="col-md-8">
                                              <p className="form-control-static">{transfer.cancelledMotif}</p>
                                          </FormGroup>
                                      </div>
                                  ):null}
                              </form>
                      </Col>
                      <Col md="2"/>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </>
    );
  }
}

const mapStateToProps = (state) =>{
    return {
        currentUser: state.currentUser
    };
};

export default connect(mapStateToProps, { getCurrentUser })(TransferPage);
