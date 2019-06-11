// core components/views
import TransferForm from "views/User/Transfer/TransferForm.jsx"
import RegisterForm from "../views/User/Transfer/RegisterForm"
import Transfer from "views/User/Transfer/TransferPage.jsx";
import TransfersTable from "views/User/Transfer/TransfersTable.jsx";

const dashboardRoutesUser = [
    {
        path: "/addtransfer",
        name: "Virement",
        icon: "fa fa-retweet",
        component: TransferForm,
        layout: "/user"
    }/*,
    {
        path: "/addUser",
        name: "Inscription",
        icon: "fa fa-retweet",
        component: RegisterForm,
        layout: "/user"
    }*/,
    {
        path: "/transfers/:id",
        name: "Virement",
        icon: "fa fa-retweet",
        component: Transfer,
        layout: "/user",
        sub: true
    },
    {
        path: "/lsttransfers",
        name: "Tableau des virements",
        icon: "tim-icons icon-bell-55",
        component: TransfersTable,
        layout: "/user"
    },
    {redirect: true, path: "/", to: "/", navbarName: "Redirect"}
];

export default dashboardRoutesUser;

