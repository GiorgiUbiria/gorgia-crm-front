//Import Images
import avatar1 from "../../assets/images/users/avatar-1.jpg"
import avatar2 from "../../assets/images/users/avatar-2.jpg"
import avatar3 from "../../assets/images/users/avatar-3.jpg"
import avatar4 from "../../assets/images/users/avatar-4.jpg"
import avatar5 from "../../assets/images/users/avatar-5.jpg"
import avatar6 from "../../assets/images/users/avatar-6.jpg"
import avatar7 from "../../assets/images/users/avatar-7.jpg"
import avatar8 from "../../assets/images/users/avatar-8.jpg"

import img1 from "../../assets/images/companies/img-1.png";
import img2 from "../../assets/images/companies/img-2.png";
import img3 from "../../assets/images/companies/img-3.png";

import img4 from "../../assets/images/small/img-4.jpg";
import img5 from "../../assets/images/small/img-5.jpg";
import img6 from "../../assets/images/small/img-6.jpg";


const tasks = [
  {
    id: "1",
    name: "Upcoming",
    cards: [
      {
        id: "1",
        title: "Topnav layout design",
        date: "14 Oct, 2019",
        badgeText: "Waiting",
        badgeColor: "secondary",
        budget: "145",
        kanbanImgtextColor: "bg-info",
        kanbanImgtext: [{ id: 1, imageText: "3+" }],
        userImages: [{ id: 4, img: avatar4 }, { id: 5, img: avatar5 }, { id: 2, img: avatar2 }],
        taskdesc: "create banbun board"
      },
      {
        id: "2",
        title: "Create a New landing UI",
        date: "15 Oct, 2021",
        badgeText: "Approved",
        badgeColor: "primary",
        taskdesc: "Separate existence is a myth.",
        taskdesc1: "For music, sport, etc",
        budget: "112",
        imageTextColor: "bg-success",
        userImages: [{ id: 1, img: avatar1 }, { id: 2, img: avatar2 }, { id: 0, imageText: "A" }, { id: 5, img: avatar5 }],
        taskdesc: "learning react"
      },
      {
        id: "3",
        title: "Create a Gorgia LLC Logo",
        date: "15 Oct, 2019",
        badgeText: "Waiting",
        badgeColor: "secondary",
        budget: "86",
        imageTextColor: "bg-warning",
        kanbanImgtextColor: "bg-danger",
        kanbanImgtext: [{ id: 1, imageText: "9+" }],
        userImages: [{ id: 4, img: avatar4 }, { id: 0, imageText: "R" }, { id: 5, img: avatar5 }],
        taskdesc: "solved issue"
      },
    ],
  },
  {
    id: "4",
    name: "In Progress",
    cards: [
      {
        id: "5",
        title: "Brand logo design",
        date: "12 Oct, 2019",
        badgeText: "Complete",
        badgeColor: "success",
        budget: "132",
        userImages: [{ id: 7, img: avatar7 }, { id: 8, img: avatar8 }],
        brandLogo: [{ id: 1, img: img1 }, { id: 2, img: img2 }, { id: 3, img: img3 }],
        taskdesc: "design logo"
      },
      {
        id: "6",
        title: "Create a Blog Template UI",
        date: "13 Oct, 2019",
        badgeText: "Pending",
        badgeColor: "warning",
        budget: "103",
        imageTextColor: "bg-success",
        kanbanImgtextColor: "bg-info",
        kanbanImgtext: [{ id: 1, imageText: "3+" }],
        userImages: [{ id: 0, imageText: "A" }, { id: 6, img: avatar6 }, { id: 4, img: avatar4 }, { id: 7, img: avatar7 }],
        taskdesc: "Create a Blog "
      },
      {
        id: "7",
        title: "Create a Blog Template UI",
        date: "13 Oct, 2019",
        badgeText: "Pending",
        badgeColor: "warning",
        budget: "103",
        imageTextColor: "bg-success",
        kanbanImgtextColor: "bg-primary",
        kanbanImgtext: [{ id: 1, imageText: "7+" }],
        userImages: [{ id: 0, imageText: "A" }, { id: 4, img: avatar4 }, { id: 5, img: avatar5 }],
        taskdesc: "Create a Blog "
      },
    ],
  },
  {
    id: "8",
    name: "Completed",
    cards: [
      {
        id: "9",
        title: "Redesign - Landing page",
        date: "10 Oct, 2019",
        badgeText: "Complete",
        badgeColor: "success",
        imageTextColor: "",
        budget: "145",
        imageTextColor: "bg-danger",
        userImages: [{ id: 1, img: avatar1 }, { id: 2, img: avatar2 }, { id: 0, imageText: "K" }, { id: 3, img: avatar3 }],
        taskdesc: "Redesign - Landing"
      },
      {
        id: "10",
        title: "Multipurpose Landing",
        date: "09 Oct, 2019",
        badgeText: "Complete",
        badgeColor: "success",
        budget: "92",
        kanbanImgtextColor: "bg-pink",
        kanbanImgtext: [{ id: 1, imageText: "5+" }],
        userImages: [{ id: 4, img: avatar4 }, { id: 5, img: avatar5 }, { id: 6, img: avatar6 }],
        brandLogo: [{ id: 1, imges: img4 }, { id: 2, imges: img5 }, { id: 3, imges: img6 }],
        taskdesc: "create a Multipurpose Landing"
      },
      {
        id: "11",
        title: "Gorgia LLC landing Psd",
        date: "15 Oct, 2019",
        badgeText: "Waiting",
        badgeColor: "secondary",
        budget: "86",
        imageTextColor: "bg-danger",
        kanbanImgtextColor: "bg-info",
        kanbanImgtext: [{ id: 1, imageText: "2+" }],
        userImages: [{ id: 7, img: avatar7 }, { id: 8, img: avatar8 }, { id: 0, imageText: "D" },],
        taskdesc: "testing Gorgia LLC landing"
      },
    ],
  },
]

const AddTeamMember = [
  { id: 1, img: avatar1, name: 'Albert Rodarte' },
  { id: 2, img: avatar2, name: 'Hannah Glover' },
  { id: 3, img: avatar3, name: 'Adrian Rodarte' },
  { id: 4, img: avatar4, name: 'Frank Hamilton' },
  { id: 5, img: avatar5, name: 'Justin Howard' },
  { id: 6, img: avatar6, name: 'Michael Lawrence' },
  { id: 7, img: avatar7, name: 'Oliver Sharp' },
  { id: 8, img: avatar8, name: 'Richard Simpson' }
]

const series = [
  {
    name: "Complete Tasks",
    type: "column",
    data: [23, 11, 22, 27, 13, 22, 52, 21, 44, 22, 30],
  },
  {
    name: "All Tasks",
    type: "line",
    data: [23, 11, 34, 27, 17, 22, 62, 32, 44, 22, 39],
  },
]

const options = {
  chart: { height: 280, type: "line", stacked: !1, toolbar: { show: !1 } },
  stroke: { width: [0, 2, 5], curve: "smooth" },
  plotOptions: { bar: { columnWidth: "20%", endingShape: "rounded" } },
  colors: ["#556ee6", "#34c38f"],
  fill: {
    gradient: {
      inverseColors: !1,
      shade: "light",
      type: "vertical",
      opacityFrom: 0.85,
      opacityTo: 0.55,
      stops: [0, 100, 100, 100],
    },
  },
  labels: [
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
  ],
  markers: { size: 0 },
  yaxis: { min: 0 },
}

const recentTasksData = [
  {
    id: 1, taskName: "Brand logo design",
    avatars: [
      { id: 1, src: avatar4 },
      { id: 2, src: avatar5 }
    ]
  },
  {
    id: 2, taskName: "Create a Blog Template UI",
    avatars: [
      { id: 1, src: avatar1 },
      { id: 2, src: avatar2 },
      { id: 3, src: avatar3 },
      { id: 4, avatarTitle: "D", bgColor: "bg-info", text: "D" }
    ]
  },
  {
    id: 1, taskName: "Redesign - Landing page",
    avatars: [
      { id: 1, src: avatar8 },
      { id: 2, src: avatar7 },
      { id: 3, avatarTitle: "P", bgColor: "bg-danger", text: "P" }
    ]
  }
]

const statusClasses = {
  waiting: "badge-soft-secondary",
  approved: "badge-soft-primary",
  complete: "badge-soft-success",
  pending: "badge-soft-warning",
}

export { tasks, series, options, statusClasses, AddTeamMember, recentTasksData }
