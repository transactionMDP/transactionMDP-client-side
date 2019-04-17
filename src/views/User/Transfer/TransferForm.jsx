import React from "react";

// API
import {
    getAccountCurrency, doTransfer, getCommissionData
} from '../../../util/APIUtils';
// react plugin used to create datetimepicker
import ReactDatetime from "react-datetime";

// reactstrap components
import {
    Card,
    CardHeader,
    CardBody,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Row,
    Col,
    FormGroup,
    Input,
    Label,
    Button
} from "reactstrap";

// Redux components
import { connect } from "react-redux";
import { getCurrentUser } from "../../../redux/actions";

// Sweet alert components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

/** La page du virement
 * Cette page présente un formulaire qui contient l'ensemble des informations demandées pour effectuer un virement
 * */

class TransferForm extends React.Component {
    // Constructeur
    constructor(props) {
        super(props);
        this.state = {
            focused: "",
            transactionType: "",              // Type de transaction
            principalAccount: "",             // Compte donneur d’ordre
            principalCurrency: "NAN",         // Devise Compte donneur ordre
            beneficiaryAccount: "",           // Compte bénéficiaire
            beneficiaryCurrency: "NaN",      // Devise Compte bénéficiaire
            transactionAmount: 0,             // Montant de l’opération
            transactionCurrency: "NaN",       // Devise de l’opération: doit être égale à la devise du compte à débiter ou celle du compte à créditer
            transferReason: "",               // Motif de virement
            executionDate: new Date(),        // Date exécution : par défaut c'est la date courante
            /*DBValueDate: "",                // Date valeur DB: Par défaut = J-1 (paramétrable par catégorie de cpt)
            CRValueDate: "",*/                // Date valeur CR: Par défaut = J+1 (paramétrable par catégorie de cpt)
            //commissionCode: 0,              // Code Commission appliquée: Non modifiable
            applyedRate: 0,                    // taux appliqué: Non modifiable
            commissionAmount: 0,              // Montant commission: Non modifiable
            applyCommission: true,            // Appliquer commission: OUI/NON
            commissionTVA: 0,                 // TVA sur commission: Calculé automatiquement par un taux paramétrable
            chargeType: "",                   // Type de charge : = ‘OUR’ par défaut La charge est à appliquer sur le compte à débiter
            totalAmount: 0,                   // Le montant total à débiter
            /* Saisie uniquement pour les  transferts en devise */
            transferNature: "",               // Nature de transfert : Saisie uniquement pour MAD to MAC ou MAD to Autre devise
            authorizationNumber: "",          // Numéro d’autorisation: Saisie uniquement pour MAD to MAC ou MAD to Autre devise
            authorizationValidity: "",        // Validité de l’autorisation: Saisie uniquement pour MAD to MAC ou MAD to Autre devise
            exchangeRate: "",                 // Cours de change: Non modifiable
            tradingTicket: "",                // La référence du ticket de négociation: Saisie uniquement pour les  clients de la salle de marché ou pour les transactions de très grand montant
            largeAmount: 4000,                // *****************************************

            account: [],
            isLoadingCurrency: true
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeCheckbox = this.handleChangeCheckbox.bind(this);
        this.loadCommissionData = this.loadCommissionData.bind(this);
        this.loadAccountCurrency = this.loadAccountCurrency.bind(this);
        this.getTotalAmount = this.getTotalAmount.bind(this);
    }

    componentDidMount() {
        this.props.getCurrentUser();
    }

    // Cette fonction permet d'affecter les infos saisies à la variable convenable
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const id = target.id;

        this.setState({
            [id]: value
        });
    }

    // Cette fonction se déclenche lorsque l'utilisateur clique sur le checkbox "appliquer commission"
    // Elle permet d'affecter une valeur à la variable "applyCommission" avec la mise à jour du montant total
    // - true : pour appliquer la commission
    // - false: sinon
    handleChangeCheckbox(event) {
        const target = event.target;
        const value = target.checked;
        const id = target.id;

        this.setState({
            [id]: value
        });

        // Appler a la fonction getTotalAmount pour la mise à jour du montant total
        this.getTotalAmount(target.checked);
    }

    // Cette fonction se déclenche lorsque l'utilisateur clique sur "virer"
    // Elle permet d'envoyer les données de l'opération au serveur
    handleSubmit(event) {
        event.preventDefault();

        // Récupérer les données du virement
        const transferData = {
            // affecter la valeur de type de transaction selon le role d'utilisateur
            /*transactionType: this.props.currenUser.role==="ROLE_AGENT" ? "agent"
                             : this.props.currentUser.role==="ROLE_CTN" ? "ctn"
                             : this.props.currentUser.role==="ROLE_CTRL"? "ctrl":"",*/
            principalAccount: this.state.principalAccount,
            //principalCurrency: this.state.principalCurrency,*************************************
            beneficiaryAccount: this.state.beneficiaryAccount,
            //beneficiaryCurrency: this.state.beneficiaryCurrency,*************************************
            transactionAmount: this.state.transactionAmount,
            transactionCurrency: this.state.transactionCurrency,
            transferReason: this.state.transferReason,
            executionDate: this.state.executionDate,
            //transferNature: this.state.transferNature,
            //authorizationNumber: this.state.authorizationNumber,
            //authorizationValidity: this.state.authorizationValidity,
            //commissionCode: this.state.commissionCode,
            commissionRate: this.state.applyedRate,
            commissionAmount: this.state.commissionAmount,
            //applyCommission: this.state.applyCommission,
            commissionTVA: this.state.commissionTVA,
            chargeType: this.state.chargeType,
            //exchangeRate: this.state.exchangeRate,
            //tradingTicket: this.state.tradingTicket,
            //totalAmount: this.state.totalAmount
        };

        // Envoyer les données de l'opération au serveur
        doTransfer(transferData)
            .then(response => {
                //console.log(response);
                // affichee un message de succès
                /*return */
                MySwal.fire({
                    type: 'success',
                    title: 'Virement effectué avec succès',
                    showConfirmButton: false,
                    timer: 1500
                });
                // redirection vers un tableau de transactions.
                //this.props.history.push("/user/lsttransfers");
            }).catch(error => {
            if (error.status === 401) {
                // affichee un message d’erreur
                MySwal.fire({
                    type: 'error',
                    title: 'Vous avez été déconnecté. Veuillez vous connecter pour éffectuer cette opération.',
                    showConfirmButton: false,
                    timer: 1500
                });
                // redirection vers la page d'authentification.
                this.props.history.push('/login');
            } else {
                // affichee un message d’erreur
                MySwal.fire({
                    type: 'warning',
                    title: error.message || 'Pardon! Quelque chose s\'est mal passé. Veuillez réessayer!',
                    showConfirmButton: false,
                    timer: 1500
                })
            }
        });
    }

    // Cette fonction se déclenche lorsque l'utilisateur saisit le numero d'un compte
    // Elle permet de récupérer le devise du compte sinon elle retourne un message d'erreur
    loadAccountCurrency = (event) => {
        const number = event.target.value;
        const id = event.target.id;

        if (number.length >= 4) {
            let idCurrency = (id === "principalAccount") ? ("principalCurrency") : ("beneficiaryCurrency");
            let promise;

            promise = getAccountCurrency(number);

            if (!promise) {
                return;
            }

            this.setState({
                isLoadingCurrency: true
            });

            // Initialisation de l'alert
            const Toast = MySwal.mixin({
                toast: true,
                position: 'center',
                showConfirmButton: false,
                timer: 2000
            });
            promise
                .then(response => {
                    // récupérer la devise
                    if (response.code === "200") {
                        this.setState({
                            [idCurrency]: response.libelle,
                            isLoadingCurrency: false
                        })
                    } else {
                        // afficher un message d’erreur
                        Toast.fire({
                            type: 'error',
                            title: response.libelle+'. Vous pouvez pas  effectuer cette opération!'
                        });
                    }
                }).catch(error => {
                alert(error);
                this.setState({
                    isLoadingCurrency: false
                })
            });
        }
    };


    // Cette fonction permet d'affecter les infos saisies à la variable convenable
    handleChangeAmount(event) {
        const target = event.target;
        const value = target.value;
        const id = target.id;

        this.setState({
            [id]: value
        });
        this.loadCommissionData(value,);
    }

    // Cette fonction se déclenche lorsque l'utilisateur saisit le montant du virement
    // Elle permet de récupérer la commission du virement.
    loadCommissionData = (value) => {
        //event.preventDefault();

        if (value==="" || value===0) {
            return;
        }

        let commissionData = {
            accountN1: this.state.principalAccount,
            accountN2: this.state.beneficiaryAccount,
            amount: value
        };

        let promise;

        promise = getCommissionData(commissionData);

        if (!promise) {
            return;
        }

        this.setState({
            isLoadingCurrency: true
        });

        promise
            .then(response => {
                // récupérer la commission
                this.setState({
                    applyedRate: response.commissionRate,
                    commissionAmount: response.commissionAmount,
                    commissionTVA: response.tvaAmount,
                    isLoadingCurrency: false
                });
                this.getTotalAmount(this.state.applyCommission);
            }).catch(error => {
            this.setState({
                isLoadingCurrency: false
            })
        });
    };

    // Cette fonction permet de calculer et d'affecter le montant total selon la valeur de "applyCommission
    // - Si applyCommission = true : Montant Total = montant du virement + montant de la commission + TVA sur commission
    // - Sinon : Montant Total = montant du virement
    getTotalAmount = (applyCommission) => {
        if (applyCommission) {
            this.setState({
                totalAmount: parseFloat(this.state.transactionAmount)+this.state.commissionAmount + this.state.commissionTVA
            });
        } else {
            this.setState({
                totalAmount: this.state.transactionAmount
            });
        }
    };

    // Cette fonction permet d'affecter la devise du compte à débiter à la variable "transactionCurrency" lorsque
    // la devise du compte à débiter est la meme que du compte à créditer
    getTransactionCurrency() {
        if (this.state.principalCurrency === this.state.beneficiaryCurrency) {
            this.setState({
                transactionCurrency: this.state.principalCurrency
            })
        }
    }

    render() {
        return (
            <>
                <div className="content">
                    <Row>
                        <Col md="12">
                            <Card>
                                <CardHeader>
                                    <h4 className="title">Saisie du virement</h4>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md="2"></Col>
                                        <Col md="8">
                                            {/* Virement INTRA en agence*/}
                                            <form onSubmit={this.handleSubmit}>
                                                <div className="form-row">
                                                    <FormGroup className="col-md-6">
                                                        <Label for="principalAccount">N° compte débiteur</Label>
                                                        <InputGroup>
                                                            <Input
                                                                type="number"
                                                                id="principalAccount"
                                                                placeholder="Débiteur"
                                                                value={this.state.principalAccount}
                                                                onChange={(event) => {
                                                                    this.handleChange(event);
                                                                    this.loadAccountCurrency(event)
                                                                }}
                                                            />
                                                            <InputGroupAddon addonType="append">
                                                                <InputGroupText>
                                                                    <p>{this.state.principalCurrency}</p>
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </FormGroup>
                                                    <FormGroup className="col-md-6">
                                                        <Label for="beneficiaryAccount">N° compte bénéficiaire</Label>
                                                        <InputGroup>
                                                            <Input
                                                                type="number"
                                                                id="beneficiaryAccount"
                                                                placeholder="Bénéficiaire"
                                                                value={this.state.beneficiaryAccount}
                                                                onChange={(event) => {
                                                                    this.handleChange(event);
                                                                    this.loadAccountCurrency(event)
                                                                }}
                                                            />
                                                            <InputGroupAddon addonType="append">
                                                                <InputGroupText>
                                                                    <p>{this.state.beneficiaryCurrency}</p>
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </div>

                                                <div className="form-row">
                                                    <FormGroup className="col-md-4">
                                                        <Label for="transactionAmount">Montant</Label>
                                                        <InputGroup>
                                                            <Input
                                                                type="number"
                                                                id="transactionAmount"
                                                                placeholder="Montant ..."
                                                                value={this.state.transactionAmount}
                                                                onChange={(event) => {
                                                                    this.handleChangeAmount(event);
                                                                    this.getTransactionCurrency();
                                                                }}
                                                            />
                                                            <InputGroupAddon addonType="append">
                                                                <InputGroupText>
                                                                    {this.state.principalCurrency === this.state.beneficiaryCurrency ?
                                                                        (<p>{this.state.transactionCurrency}</p>) :
                                                                        (<select
                                                                            name="select"
                                                                            className="form-control1"
                                                                            id="transactionCurrency"
                                                                            value={this.state.transactionCurrency}
                                                                            onChange={this.handleChange}
                                                                        >
                                                                            <option>{this.state.principalCurrency}</option>
                                                                            <option>{this.state.beneficiaryCurrency}</option>
                                                                        </select>)
                                                                    }
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </FormGroup>
                                                    <FormGroup className="col-md-4">
                                                        <Label for="transferReason">Motif</Label>
                                                        <Input
                                                            type="text"
                                                            placeholder="Motif ..."
                                                            id="transferReason"
                                                            value={this.state.transferReason}
                                                            onChange={this.handleChange}
                                                        />
                                                    </FormGroup>
                                                    <FormGroup className="col-md-4">
                                                        <Label for="executionDate">Date d'execution</Label>
                                                        <ReactDatetime
                                                            id="executionDate"
                                                            inputProps={{
                                                                className: "form-control",
                                                                placeholder: "Date Picker Here"
                                                            }}
                                                            value={this.state.executionDate}
                                                            defaultValue={new Date()}
                                                        />
                                                    </FormGroup>
                                                </div>
                                                {/********************* Echange **************/
                                                    (this.state.principalCurrency === "MAD" && this.state.beneficiaryCurrency !== "MAD") ? (
                                                        <>
                                                            {
                                                                (this.state.transactionAmount > this.state.largeAmount) ? (
                                                                    <FormGroup>
                                                                        <Label for="tradingTicket">Ticket de
                                                                            négociation</Label>
                                                                        <Input
                                                                            type="number"
                                                                            id="tradingTicket"
                                                                            placeholder="ticket ..."
                                                                            className="tim-icons"
                                                                            value={this.state.tradingTicket}
                                                                            onChange={this.handleChange}
                                                                        />
                                                                    </FormGroup>
                                                                ) : null
                                                            }
                                                            <FormGroup>
                                                                <Label for="transferNature">Nature de transfert</Label>
                                                                <Input
                                                                    type="select"
                                                                    name="select"
                                                                    id="transferNature"
                                                                    value={this.state.transferNature}
                                                                    onChange={this.handleChange}
                                                                >
                                                                    <option>1</option>
                                                                    <option>2</option>
                                                                </Input>
                                                            </FormGroup>

                                                            <div className="form-row">
                                                                <FormGroup className="col-md-3">
                                                                    <Label for="authorizationNumber">N°
                                                                        d'autorisation</Label>
                                                                    <Input
                                                                        type="number"
                                                                        id="authorizationNumber"
                                                                        placeholder="Code ..."
                                                                        value={this.state.authorizationNumber}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup className="col-md-6">
                                                                    <Label for="authorizationValidity">Validité de
                                                                        l'autorisation</Label>
                                                                    <Input
                                                                        type="number"
                                                                        id="authorizationValidity"
                                                                        placeholder="???"
                                                                        value={this.state.authorizationValidity}
                                                                        onChange={this.handleChange}
                                                                    />
                                                                </FormGroup>
                                                                <FormGroup className="col-md-3">
                                                                    <Label for="exchangeRate">Cours de change</Label>
                                                                    <Input
                                                                        type="number"
                                                                        id="exchangeRate"
                                                                        placeholder="..."
                                                                        value={this.state.exchangeRate}
                                                                        disabled
                                                                    />
                                                                </FormGroup>
                                                            </div>
                                                        </>) : null
                                                    /********************* Commission **************/}
                                                <FormGroup>
                                                    <Label for="chargeType">Type de charge</Label>
                                                    <Input
                                                        type="select"
                                                        id="chargeType"
                                                        name="select"
                                                        value={this.state.chargeType}
                                                        onChange={this.handleChange}
                                                    >
                                                        <option>OUR</option>
                                                        <option>2</option>
                                                    </Input>
                                                </FormGroup>

                                                <div className="form-row">
                                                    <FormGroup className="col-md-4">
                                                        <Label for="commissionCode">{/*Code Commission/*/}Taux
                                                            applique</Label>
                                                        <h3 className="card-title">
                                                            {this.state.applyedRate + " "}<span></span>
                                                        </h3>
                                                    </FormGroup>

                                                    <FormGroup className="col-md-4">
                                                        <Label for="commissionAmount">Montant commission</Label>
                                                        <h3 className="card-title">
                                                            {this.state.commissionAmount + " "}<span></span>
                                                        </h3>
                                                    </FormGroup>

                                                    <FormGroup className="col-md-4">
                                                        <Label for="commissionTVA">TVA sur commission</Label>
                                                        <h3 className="card-title">
                                                            {this.state.commissionTVA + " "}<span></span>
                                                        </h3>
                                                    </FormGroup>
                                                </div>

                                                <FormGroup check>
                                                    <Label for="totalAmount">Montant total</Label>
                                                    <h3 className="card-title">
                                                        {this.state.totalAmount + " "}<span>{this.state.transactionCurrency}</span>
                                                    </h3>
                                                </FormGroup>
                                                <FormGroup check>
                                                    <Label className="form-check-label">
                                                        <Input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="applyCommission"
                                                            onChange={this.handleChangeCheckbox}
                                                            checked={this.state.applyCommission}
                                                        />
                                                        Appliquer commission
                                                        <span className="form-check-sign">
                                                          <span className="check"/>
                                                        </span>
                                                    </Label>
                                                </FormGroup>

                                                <br/>
                                                <Button type="reset" color="primary">Annuler</Button>
                                                <Button type="submit" color="primary">Virer</Button>
                                            </form>
                                        </Col>
                                        <Col md="2"></Col>
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

export default connect(mapStateToProps, { getCurrentUser })(TransferForm);
