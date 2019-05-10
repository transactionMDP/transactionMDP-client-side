import React from "react";
import {Link} from "react-router-dom";
import {signup} from '../../../util/APIs';

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
    BreadcrumbItem,
    InputGroupAddon,
    InputGroupText,
    InputGroup,
    Input
} from "reactstrap";
import NotFound from "../../NotFound";
import LoadingIndicator from "../../../components/LoadingIndicator/LoadingIndicator";

import {connect} from "react-redux";
import {getCurrentUser} from "../../../redux/actions";

// Sweet alert
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import classnames from "classnames";

const MySwal = withReactContent(Swal);

/* Cette page présente un formulaire qui contient l'ensemble des informations demandées pour effectuer un virement */

class RegisterForm extends React.Component {
    // Constructeur
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            name: "",
            registrationNumber: "",// matricule
            email: "",
            password: "",
            role: "ROLE_AGENT"
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        //this.props.getCurrentUser();
       // const id = this.props.match.params.id;
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

    // Cette fonction se déclenche lorsque l'utilisateur clique sur "virer"
    // Elle permet d'envoyer les données de l'opération au serveur
    handleSubmit(event) {
        event.preventDefault();

        // Récupérer les données du virement
        const registerData = {
            /*transactionType: this.props.currenUser.role==="ROLE_AGENT" ? "agent"
                             : this.props.currentUser.role==="ROLE_CTN" ? "ctn"
                             : this.props.currentUser.role==="ROLE_CTRL"? "ctrl":"",*/
            name: this.state.name,
            registrationNumber: this.state.registrationNumber,
            email: this.state.email,
            password: this.state.password,
            role: this.state.role
        };

        // Envoyer les données de l'opération au serveur
        signup(registerData)
            .then(response => {
                //console.log(response);
                // affichee un message de succès
                /*return */
                MySwal.fire({
                    type: 'success',
                    title: 'Inscription effectuée avec succès',
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


    render() {
        const {isLoading} = this.state;
        /*if (isLoading) {
            return <LoadingIndicator/>;
        }

        if (this.state.notFound || !this.props.currentUser) {
            return <NotFound/>;
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
                                    <h4 className="title">Inscription</h4>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md="2"/>
                                        <Col md="8">
                                            {/* Inscription */}
                                            <form onSubmit={this.handleSubmit} className="form-horizontal">
                                                <div className="form-row">
                                                    <Label className={"col-md-2 col-form-label"} for="registrationNumber">Nom</Label>
                                                    <FormGroup className="col-md-10">
                                                        <InputGroup>
                                                            <Input
                                                                type="text"
                                                                id="name"
                                                                placeholder="Nom"
                                                                value={this.state.name}
                                                                onChange={this.handleChange}
                                                            />
                                                            <InputGroupAddon addonType="append">
                                                                <InputGroupText><i className="tim-icons icon-single-02" ></i></InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </div>

                                                <div className="form-row">
                                                    <Label className={"col-md-2 col-form-label"} for="registrationNumber">Matricule</Label>
                                                    <FormGroup className="col-md-10">
                                                        <InputGroup>
                                                            <Input
                                                                type="text"
                                                                id="registrationNumber"
                                                                placeholder="Matricule"
                                                                value={this.state.registrationNumber}
                                                                onChange={this.handleChange}
                                                            />
                                                            <InputGroupAddon addonType="append">
                                                                <InputGroupText><i className="tim-icons icon-single-02" ></i></InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </div>

                                                <div className="form-row">
                                                    <Label className={"col-md-2 col-form-label"} for="email">Email</Label>
                                                    <FormGroup className="col-md-10">
                                                        <InputGroup>
                                                            <Input
                                                                type="text"
                                                                id="email"
                                                                placeholder="Email"
                                                                value={this.state.email}
                                                                onChange={this.handleChange}
                                                            />
                                                            <InputGroupAddon addonType="append">
                                                                <InputGroupText><i className="tim-icons icon-email-85"/></InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>
                                                    </FormGroup>
                                                </div>

                                                <div className="form-row">
                                                    <Label className={"col-md-2 col-form-label"} for="password">Mot de passe</Label>
                                                    <FormGroup className="col-md-10">
                                                        <InputGroup>
                                                            <Input
                                                                type="password"
                                                                id="password"
                                                                placeholder="Mot de passe"
                                                                value={this.state.password}
                                                                onChange={this.handleChange}
                                                            />
                                                            <InputGroupAddon addonType="append">
                                                                <InputGroupText><i className="tim-icons icon-lock-circle"/></InputGroupText>
                                                            </InputGroupAddon>
                                                        </InputGroup>

                                                        {/*<InputGroup
                                                            className={classnames({
                                                                "input-group-focus": this.state.passwordFocus
                                                            })}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="tim-icons icon-lock-circle"/>
                                                                </InputGroupText>
                                                            </InputGroupAddon>
                                                            <Input
                                                                id="password"
                                                                placeholder="Password"
                                                                type="password"
                                                                value={this.state.password}
                                                                onChange={this.handleChange}
                                                                onFocus={e => this.setState({passwordFocus: true})}
                                                                onBlur={e => this.setState({passwordFocus: false})}
                                                            />
                                                        </InputGroup>*/}
                                                    </FormGroup>
                                                </div>

                                                <div className="form-row">
                                                    <Label className={"col-md-2 col-form-label"} for="role">Role</Label>
                                                    <FormGroup className="checkbox-radios col-sm-5">
                                                        <div className="form-check-radio form-check">
                                                            <Label className="form-check-label">
                                                                <Input type="radio" name="role" id="role" onChange={this.handleChange} value="ROLE_AGENT" className="form-check-input" defaultChecked/>
                                                                Agent
                                                                <span className="form-check-sign"></span>
                                                            </Label>
                                                        </div>
                                                        <div className="form-check-radio form-check">
                                                            <Label className="form-check-label">
                                                                <Input type="radio" name="role" id="role" onChange={this.handleChange} value="ROLE_CTRL" className="form-check-input" />
                                                                Agent controleur
                                                                <span className="form-check-sign"></span>
                                                            </Label>
                                                        </div>
                                                        <div className="form-check-radio form-check">
                                                            <Label className="form-check-label">
                                                                <Input type="radio" name="role" id="role" onChange={this.handleChange} value="ROLE_CTN" className="form-check-input" />
                                                                Personnel du CTN
                                                                <span className="form-check-sign"></span>
                                                            </Label>
                                                        </div>
                                                    </FormGroup>
                                                </div>


                                                <div className="form-row">
                                                    <Label className={"col-md-2 col-form-label"} />
                                                    <FormGroup className="col-md-10">
                                                        <Button color="primary" type="submit">
                                                            Enregistrer
                                                        </Button>
                                                    </FormGroup>
                                                </div>

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

const mapStateToProps = (state) => {
    return {
        currentUser: state.currentUser
    };
};

export default connect(mapStateToProps, {getCurrentUser})(RegisterForm);
