import React from "react";
import classnames from "classnames";

// reactstrap components
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardImg,
    CardTitle,
    Col,
    Container,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row
} from "reactstrap";

// core components
import Footer from "components/Footer/Footer.jsx";

// API
import {login} from "../util/APIs";

// Redux components
import {connect} from "react-redux";
import {setAuthState} from "../redux/actions/index";
import {ACCESS_TOKEN} from "../variables/constants";

// Sweet alert components
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);


/** La page d'authentification
 * Cette interface est dédiée à tous les utilisateurs du système.
 * Ainsi, une fois l’utilisateur est connecté, il se redirige vers un tableau de bord selon son rôle dans le système.
 * @params : usernameOrEmail, password
 * */

class Login extends React.Component {
    // constructeur
    constructor(props) {
        super(props);
        this.state = {
            squares1to6: "",
            squares7and8: "",
            registrationNumberOrEmail: "",       // le matricule ou email d'utilisateur
            password: ""         // mot de passe
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }

    // componentDidMount() se déclenche Juste après que le composant fasse son premier render() pour
    // aller chercher des références directes à certains éléments du DOM que l’on peut alors manipuler
    componentDidMount() {
        document.body.classList.toggle("register-page"); //
        document.documentElement.addEventListener("mousemove", this.followCursor);
    }

    // À l'inverse, componentWillUnmount() se déclenche juste avant que le composant ne quitte complètement le DOM
    componentWillUnmount() {
        document.body.classList.toggle("register-page");
        document.documentElement.removeEventListener(
            "mousemove",
            this.followCursor
        );
    }

    // Définir la position des carrés
    followCursor = event => {
        let posX = event.clientX - window.innerWidth / 2;
        let posY = event.clientY - window.innerWidth / 6;
        this.setState({
            squares1to6:
                "perspective(500px) rotateY(" +
                posX * 0.05 +
                "deg) rotateX(" +
                posY * -0.05 +
                "deg)",
            squares7and8:
                "perspective(500px) rotateY(" +
                posX * 0.02 +
                "deg) rotateX(" +
                posY * -0.02 +
                "deg)"
        });
    };

    // Cette fonction se déclenche lorsque l'utilisateur saisit son identifiant et son mot de passe
    // Elle permet d'affecter la valeur saisie à la variable convenable
    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }

    // Se déclenche lorsque l'utilisateur clique sur se connecter
    // Elle permet de vérifie l’identité de l’utilisateur et ensuite l’autorise à accéder au tableau de bord
    handleLogin(event) {
        event.preventDefault();

        // Récupérer l’identité de l’utilisateur
        const loginRequest = {
            registrationNumberOrEmail: this.state.registrationNumberOrEmail,
            password: this.state.password
        };

        // Initialisation de l'alert
        const Toast = MySwal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
        });

        // Envoyer l’identité de l’utilisateur au serveur puis récupérer la réponse
        let resp;
        login(loginRequest)
            // Si l'authentification est réussie
            .then(response => {
                // enregistrer le token
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                // afficher un message de succès
                Toast.fire({
                    type: 'success',
                    title: 'Vous êtes connecté avec succès.'
                });
                // modifier l'état de la variable d'authentification
                this.props.setAuthState(true);
                // redirection vers un tableau de bord selon le rôle d'utilisateur dans le système.
                this.props.history.push("/user/addtransfer");
            }).catch(error => {
            // Sinon
            if (error.status === 401) {
                // affichee un message d’erreur
                Toast.fire({
                    type: 'error',
                    title: 'Votre nom d\'utilisateur ou votre mot de passe est incorrect. Veuillez réessayer!'
                });
            } else {
                // affichee un message d’erreur
                Toast.fire({
                    type: 'warning',
                    title: 'Pardon! Quelque chose s\'est mal passé. Veuillez réessayer!'
                });
            }
        });
    };

    render() {
        return (
            <>
                <div className="wrapper wrapper-full-page">
                    <div className="page-header">
                        <div className="page-header-image"/>
                        <div className="content">
                            <Container>
                                <Row className="justify-content-center">
                                    <Col lg="4" md="6">
                                        <div
                                            className="square square-7"
                                            id="square7"
                                            style={{transform: this.state.squares7and8}}
                                        />
                                        <div
                                            className="square square-8"
                                            id="square8"
                                            style={{transform: this.state.squares7and8}}
                                        />
                                        <Card className="card-register">
                                            <CardHeader>
                                                <CardImg
                                                    alt="..."
                                                    src={require("assets/img/square-purple-1.png")}
                                                />
                                                <CardTitle tag="h4">Login</CardTitle>
                                            </CardHeader>
                                            <CardBody>
                                                <Form className="form">
                                                    <InputGroup
                                                        className={classnames({
                                                            "input-group-focus": this.state.emailFocus
                                                        })}
                                                    >
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="tim-icons icon-single-02"/>
                                                            </InputGroupText>
                                                        </InputGroupAddon>
                                                        <Input
                                                            id="registrationNumberOrEmail"
                                                            placeholder="Email ou Matricule"
                                                            type="text"
                                                            value={this.state.registrationNumberOrEmail}
                                                            onChange={this.handleChange}
                                                            onFocus={e => this.setState({emailFocus: true})}
                                                            onBlur={e => this.setState({emailFocus: false})}
                                                        />
                                                    </InputGroup>
                                                    <InputGroup
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
                                                    </InputGroup>
                                                </Form>
                                            </CardBody>
                                            <CardFooter>
                                                <Button color="primary" size="lg" block onClick={this.handleLogin}>
                                                    Se Connecter
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    </Col>
                                </Row>
                                <div
                                    className="square square-1"
                                    id="square1"
                                    style={{transform: this.state.squares1to6}}
                                />
                                <div
                                    className="square square-2"
                                    id="square2"
                                    style={{transform: this.state.squares1to6}}
                                />
                                <div
                                    className="square square-3"
                                    id="square3"
                                    style={{transform: this.state.squares1to6}}
                                />
                            </Container>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setAuthState: isAuthenticated => dispatch(setAuthState(isAuthenticated))
    };
}

export default connect(null, mapDispatchToProps)(Login);
