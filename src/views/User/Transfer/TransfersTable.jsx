import React from "react";
import { Link } from "react-router-dom";

import _ from "lodash";

// Import React Table
import ReactTable from "react-table";

// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button
} from "reactstrap";

// Redux components
import { connect } from "react-redux";
import { getCurrentUser } from "../../../redux/actions";

//import {TRANSFER_LIST_SIZE} from "../../../variables/constants";
import { getAllTransfers, cancelTransfer, acceptTransfer, sendTransfer} from "../../../util/APIUtils";
import NotFound from "../../NotFound";
import {formatDateTime} from "../../../util/Helpers";
import LoadingIndicator from "../../../components/LoadingIndicator/LoadingIndicator";

// Sweet alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);


/** La page de liste des virements
 * Cette page présente une liste des virements effectués selon le role de l'utilisateur
 * */
class TransfersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allTransfers: [],                 // La liste des virements
      page: 0,                       // La page actuelle: initialisée par 0 (la 1ère page)
      size: 10,                      // La taille de la page: initialisée par 10 (10 virements/page)
      totalElements: 0,              //
      totalPages: 0,                 // Le nombre total des pages
      last: true,                    //
      isLoadingTransfers: true,      //


      pageTransfers: [],
      pages: null,
      loading: true
    };
    this.loadTransfersList = this.loadTransfersList.bind(this);
    //this.handleLoadMore = this.handleLoadMore.bind(this);
    this.handleCancelTransfer = this.handleCancelTransfer.bind(this);
    this.handleAcceptTransfer = this.handleAcceptTransfer.bind(this);
    this.handleSendTransfer = this.handleSendTransfer.bind(this);

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentUser();
    /*************************************************/
    //const username = this.props.match.params.username;
    this.loadTransfersList();
  }

  componentDidUpdate(nextProps) {
    /*if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
      // Reset State
      this.setState({
        transfers: [],
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        last: true,
        isLoadingTransfers: false
      });
      this.loadTransfersList();
    }*/
  }

  /*handleLoadMore() {
    this.loadTransfersList(this.state.page + 1);
  }*/

  loadTransfersList(/*page = 0, size = TRANSFER_LIST_SIZE*/) {
    let promise;

    promise = getAllTransfers();//getUserCreatedTransfers(this.props.currentUser.username, page, size);

    if(!promise) {
      return;
    }

    this.setState({
      isLoadingTransfers: true
    });

    promise
        .then(response => {
          this.setState({
            allTransfers: response,/*response.content
            page: response.page,
            size: response.size,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            last: response.last,*/
            isLoadingTransfers: false
          })
        }).catch(error => {
      this.setState({
        isLoadingTransfers: false
      })
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
              // affichee un message de succès
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
        this.props.history.push('/login');
      } else {
        MySwal.fire({
          type: 'warning',
          title: error.message || 'Pardon! Quelque chose s\'est mal passé. Veuillez réessayer!',
          showConfirmButton: false,
          timer: 1500
        });
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
          title: error.message || 'Pardon! Quelque chose s\'est mal passé. Veuillez réessayer!',
          showConfirmButton: false,
          timer: 1500
        });
      }
    });
  }

  renderSwitch(state, link) {
    switch(state) {
      case 'accepted':
        return <><Link to={link}><Button className="btn-link" color="success">Validée</Button></Link>
          {` `}<Button className="btn-icon btn-simple" onClick={this.handleCancelTransfer} style={{border:0}} color="primary" size="sm">
            <i className="fa fa-times" />
          </Button>
        </>;
      case 'in_progress':
        return <><Link to={link}><Button className="btn-link" color="warning">Encours</Button></Link>
              {` `}<Button className="btn-icon btn-simple" onClick={this.handleCancelTransfer} style={{border:0}} color="primary" size="sm">
                <i className="fa fa-times" />
              </Button>
            </>;
      case 'cancelled':
        return <><Link to={link}><Button className="btn-link" color="danger">Rejetée</Button></Link>
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
          <Link to={link}><Button className="btn-icon btn-simple" style={{border:0}} color="primary" size="sm">
            <i className="fa fa-eye"></i>
          </Button></Link>
        </>
    );
  }

  renderBtnCTRL(link) {
    return(
        <>
          {this.renderBtnCTN(link)}
          {` `}
          <Button className="btn-icon btn-simple" onClick={this.handleSendTransfer} style={{border:0}} color="primary" size="sm">
            <i className="fa fa-paper-plane"></i>
          </Button>
        </>
    );
  }

  makeData(transfers) {
    return transfers.map((transfer, key) => {
      return {
        reference: transfer.reference,
        operationDate: formatDateTime(transfer.operationDate),
        principalAccount: transfer.creditAccount.accountNumber,
        beneficiaryAccount: transfer.debitAccount.accountNumber,
        transactionAmount: transfer.amount,
        stateAction:
            this.props.currentUser.role==="ROLE_AGENT"
                ? this.renderSwitch(transfer.state,"/user/transfers/"+transfer.id)
                : this.props.currentUser.role==="ROLE_CTN"? this.renderBtnCTN("/user/transfers/"+transfer.id)
                : this.props.currentUser.role==="ROLE_CTRL"?this.renderBtnCTRL("/user/transfers/"+transfer.id):null
      };
    });
  }

  requestData = (pageSize, page, sorted, filtered) => {
    return new Promise((resolve, reject) => {
      // You can retrieve your data however you want, in this case, we will just use some local data.

      let filteredData = this.makeData(this.state.allTransfers);
      console.log(filteredData);
      // You can use the filters in your request, but you are responsible for applying them.
      if (filtered.length) {
        filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
          return filteredSoFar.filter(row => {
            return (row[nextFilter.id] + "").includes(nextFilter.value);
          });
        }, filteredData);
      }
      // You can also use the sorting in your request, but again, you are responsible for applying it.
      const sortedData = _.orderBy(
          filteredData,
          sorted.map(sort => {
            return row => {
              if (row[sort.id] === null || row[sort.id] === undefined) {
                return -Infinity;
              }
              return typeof row[sort.id] === "string"
                  ? row[sort.id].toLowerCase()
                  : row[sort.id];
            };
          }),
          sorted.map(d => (d.desc ? "desc" : "asc"))
      );

      // You must return an object containing the rows of the current page, and optionally the total pages number.
      const res = {
        rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
        pages: Math.ceil(filteredData.length / pageSize)
      };

      // Here we'll simulate a server response with 500ms of delay.
      setTimeout(() => resolve(res), 500);
    });
  };

  fetchData(state, instance) {
    // Whenever the table model changes, or the user sorts or changes pages, this method gets called and passed the current table model.
    // You can set the `loading` prop of the table to true to use the built-in one or show you're own loading bar if you want.
    //this.setState({ loading: true });
    // Request the data however you want.  Here, we'll use our mocked service we created earlier
    this.requestData(
        state.pageSize,
        state.page,
        state.sorted,
        state.filtered
    ).then(res => {
      // Now just get the rows of data to your React Table (and update anything else like total pages or loading)
      this.setState({
        pageTransfers: res.rows,
        pages: res.pages,
        loading: false
      });
    });
  }

  render() {
    const { isLoadingTransfers, pageTransfers, pages, loading } = this.state;

    if(isLoadingTransfers) {
      return <LoadingIndicator />;
    }

    /*if(this.state.notFound || !this.props.currentUser) {
      return <NotFound />;
    }*/

    /*if(this.state.serverError) {
      return <ServerError />;
    }*/
    return (
        <>
          <div className="content">
            <Row>
              <Col md="12">
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Mes virements</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div>
                      <ReactTable
                          columns={[
                            {
                              Header: "Référence",
                              id: "reference",
                              accessor: d => d.reference
                            },
                            {
                              Header: "Date d'opération",
                              accessor: "operationDate"
                            },
                            {
                              Header: "Donneur d’ordre",
                              accessor: "principalAccount"
                            },
                            {
                              Header: "Bénéficiaire",
                              accessor: "beneficiaryAccount"
                            },
                            {
                              Header: "Montant",
                              accessor: "transactionAmount"
                            },
                            {
                              Header: "Etat/Action",
                              accessor: "stateAction",
                              filterable: false,
                              className: "actions-right"
                            }
                          ]}
                          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
                          data={pageTransfers}
                          pages={pages} // Display the total number of pages
                          loading={loading} // Display the loading overlay when we need it
                          onFetchData={this.fetchData} // Request new data when things change
                          filterable
                          sortable
                          defaultPageSize={10}
                          className="-striped -highlight"
                      />
                    </div>
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

export default connect(mapStateToProps, { getCurrentUser })(TransfersTable);
