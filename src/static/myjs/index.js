const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
]

// Date and Month
let date = new Date();
date.setDate(1)
const month = date.getMonth();
const year = date.getFullYear();
const date1 = new Date(date.setMonth(date.getMonth() - 1));
const month1 = date1.getMonth();
const year1 = date1.getFullYear();
const date2 = new Date(date.setMonth(date.getMonth() - 1));
const month2 = date2.getMonth();
const year2 = date2.getFullYear();
const date3 = new Date(date.setMonth(date.getMonth() - 1));
const month3 = date3.getMonth();
const year3 = date3.getFullYear();
const date4 = new Date(date.setMonth(date.getMonth() - 1));
const month4 = date4.getMonth();
const year4 = date4.getFullYear();
const date5 = new Date(date.setMonth(date.getMonth() - 1));
const month5 = date5.getMonth();
const year5 = date5.getFullYear();
const date6 = new Date(date.setMonth(date.getMonth() - 1));
const month6 = date6.getMonth();
const year6 = date6.getFullYear();
const date7 = new Date(date.setMonth(date.getMonth() - 1));
const month7 = date7.getMonth();
const year7 = date7.getFullYear();
const date8 = new Date(date.setMonth(date.getMonth() - 1));
const month8 = date8.getMonth();
const year8 = date8.getFullYear();
const date9 = new Date(date.setMonth(date.getMonth() - 1));
const month9 = date9.getMonth();
const year9 = date9.getFullYear();
const date10 = new Date(date.setMonth(date.getMonth() - 1));
const month10 = date10.getMonth();
const year10 = date10.getFullYear();
const date11 = new Date(date.setMonth(date.getMonth() - 1));
const month11 = date11.getMonth();
const year11 = date11.getFullYear();

jobs = JSON.parse(jobs);
data = JSON.parse(data);

const jobdata = {
    ets2: data.ets2,
    ats: data.ats
}

const primaryColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--bs-primary')
    .trim();

distChart();
etsats();

function distChart() {
    new Chart(document.querySelector("#distChart").getContext("2d"), {
        type: "line",
        data: {
            labels: [
                months[month11],
                months[month10],
                months[month9],
                months[month8],
                months[month7],
                months[month6],
                months[month5],
                months[month4],
                months[month3],
                months[month2],
                months[month1],
                months[month]
            ],
            datasets: [
                {
                    label: "Jobs",
                    tension: 0.4,
                    borderWidth: 0,
                    pointRadius: 2,
                    pointBackgroundColor: primaryColor,
                    borderColor: primaryColor,
                    borderWidth: 3,
                    data: data.data,
                    maxBarThickness: 6
                }
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: false,
                        borderDash: [5, 5]
                    },
                    ticks: {
                        display: true,
                        padding: 10,
                        color: '#9ca2b7'
                    }
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: true,
                        drawOnChartArea: true,
                        drawTicks: true,
                        borderDash: [5, 5]
                    },
                    ticks: {
                        display: true,
                        color: '#9ca2b7',
                        padding: 10
                    }
                },
            },
        },
    });
}

function etsats() {
    var options = {
        chart: {
            width: 360,
            type: "pie",
        },
        labels: [
            "ETS2",
            "ATS"
        ],
        series: [
            jobdata.ets2 || 0,
            jobdata.ats || 0
        ],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: "bottom",
                    },
                },
            },
        ],
    };

    new Chart(document.querySelector("#etsats").getContext("2d"), {
        type: "doughnut",
        data: {
            labels: [
                "ETS2",
                "ATS"
            ],
            datasets: [{
                label: "",
                weight: 9,
                cutout: 60,
                tension: 0.9,
                pointRadius: 2,
                borderWidth: 2,
                backgroundColor: ['#2152ff', '#3A416F', '#f53939', '#a8b8d8', 'var(--bs-primary)'],
                data: [
                    jobdata.ets2 || 0,
                    jobdata.ats || 0
                ],
                fill: false
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                }
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            scales: {
                y: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                    },
                    ticks: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        drawBorder: false,
                        display: false,
                        drawOnChartArea: false,
                        drawTicks: false,
                    },
                    ticks: {
                        display: false,
                    }
                },
            },
        },
    });
}