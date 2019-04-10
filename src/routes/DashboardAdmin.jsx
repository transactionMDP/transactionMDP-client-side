// core components/views
/*import Dashboard from "views/Dashboard.jsx";*/
//import Icons from "views/Icons.jsx";
import TransferIntraAgency from "views/User/Transfer/TransferForm.jsxport TableList from "views/TransfersTable.jsx";

const dashboardRoutesUser = [/*
  {
    path: "/dash/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin"
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "tim-icons icon-atom",
    component: Icons,
    layout: "/admin"
  },*/
    {
        path: "/addtransfer",
        name: "Virement",
        icon: "fa fa-retweet",
        component: TransferIntraAgency,
        layout: "/user"
    }
    ,
    { redirect: true, path: "/", to: "/", navbarName: "Redirect" }
];

export default dashboardRoutesUser;

