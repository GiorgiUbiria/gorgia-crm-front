const yearData = [
    {
        name: "Series A",
        data: [44, 55, 41, 67, 22, 43, 36, 52, 24, 18, 36, 48]
    },
    {
        name: "Series B",
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22]
    },
    {
        name: "Series C",
        data: [11, 17, 15, 15, 21, 14, 11, 18, 17, 12, 20, 18]
    },
];

const monthData = [
    {
        name: "Series A",
        data: [34, 55, 21, 77, 32, 63, 86, 42, 34, 18, 16, 41],
    },
    {
        name: "Series B",
        data: [10, 63, 40, 80, 52, 41, 11, 32, 30, 86, 44, 33],
    },
    {
        name: "Series C",
        data: [11, 17, 15, 85, 21, 14, 80, 58, 17, 12, 20, 18],
    },
];

const weekData = [
    {
        name: "Series A",
        data: [14, 52, 11, 57, 22, 33, 31, 22, 64, 14, 32, 68],
    },
    {
        name: "Series B",
        data: [13, 23, 20, 8, 13, 27, 18, 22, 10, 16, 24, 22],
    },
    {
        name: "Series C",
        data: [11, 17, 15, 15, 34, 55, 21, 18, 17, 12, 20, 18],
    },
];

const latestTransaction = [
    {
        orderId: "#SK2545",
        billingName: "Jacob Hunter",
        orderDate: "04 Oct, 2019",
        total: "$392",
        paymentStatus: "Paid",
        methodIcon: "fab fa-cc-paypal",
        paymentMethod: "Paypal",
    },
    {
        orderId: "#SK2544",
        billingName: "Ronald Taylor",
        orderDate: "04 Oct, 2019",
        total: "$404",
        paymentStatus: "Refund",
        methodIcon: "fab fa-cc-visa",
        paymentMethod: "Visa",
    },
    {
        orderId: "#SK2543",
        billingName: "Barry Dick",
        orderDate: "05 Oct, 2019",
        total: "$412",
        paymentStatus: "Paid",
        methodIcon: "fab fa-cc-mastercard",
        paymentMethod: "Mastercard",
    },
    {
        orderId: "#SK2542",
        billingName: "Juan Mitchell",
        orderDate: "06 Oct, 2019",
        total: "$384",
        paymentStatus: "Paid",
        methodIcon: "fab fa-cc-paypal",
        paymentMethod: "Paypal",
    },
    {
        orderId: "#SK2541",
        billingName: "Jamal Burnett",
        orderDate: "07 Oct, 2019",
        total: "$380",
        paymentStatus: "Chargeback",
        methodIcon: "fab fa-cc-visa",
        paymentMethod: "Visa",
    },
    {
        orderId: "#SK2540",
        billingName: "Neal Matthews",
        orderDate: "07 Oct, 2019",
        total: "$400",
        paymentStatus: "Paid",
        methodIcon: "fab fa-cc-mastercard",
        paymentMethod: "Mastercard",
    },
];

const activityDataDashboard = [
    {
        id: 1,
        active: false,
        date: "22 Nov",
        activity: "Responded to need “Volunteer Activities”"
    },
    {
        id: 2,
        active: false,
        date: "17 Nov",
        activity: "Everyone realizes why a new common language would be desirable... Read More"
    },
    {
        id: 3,
        active: true,
        date: "15 Nov",
        activity: "Joined the group “Boardsmanship Forum”"
    },
    {
        id: 4,
        active: false,
        date: "22 Nov",
        activity: "Responded to need “In-Kind Opportunity”"
    }
]

const TopCitiesSelling = [
    {
        id: 1,
        location: "San Francisco",
        value: "1,456",
        progress: {
            value: "94",
            color: "primary"
        }
    },
    {
        id: 2,
        location: "Los Angeles",
        value: "1,123",
        progress: {
            value: "82",
            color: "success"
        }
    },
    {
        id: 3,
        location: "San Diego",
        value: "1,026",
        progress: {
            value: "70",
            color: "warning"
        }
    }
]

export { yearData, monthData, weekData, latestTransaction, activityDataDashboard, TopCitiesSelling };