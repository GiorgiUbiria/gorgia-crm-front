// import images
import img1 from "../../assets/images/small/img-7.jpg";
import img2 from "../../assets/images/small/img-4.jpg";
import img3 from "../../assets/images/small/img-6.jpg";

const categoriesData = [
    {
        id: 1,
        text: "Design",
        icon: "mdi mdi-chevron-right"
    },
    {
        id: 2,
        text: "Development",
        icon: "mdi mdi-chevron-right",
        badge: {
            text: "04",
            color: "badge-soft-success"
        }
    },
    {
        id: 3,
        text: "Business",
        icon: "mdi mdi-chevron-right"
    },
    {
        id: 4,
        text: "Project",
        icon: "mdi mdi-chevron-right"
    },
    {
        id: 5,
        text: "Travel",
        icon: "mdi mdi-chevron-right",
        badge: {
            text: "12",
            color: "badge-soft-success"
        }
    }
]

const archiveData = [
    {
        id: 1,
        year: "2020",
        badgeCount: "03"
    },
    {
        id: 2,
        year: "2019",
        badgeCount: "06"
    },
    {
        id: 3,
        year: "2018",
        badgeCount: "05"
    }
]
const popularPosts = [
    {
        id: 1,
        imageSrc: img1,
        title: "Beautiful Day with Friends",
        date: "10 Apr, 2020"
    },
    {
        id: 2,
        imageSrc: img2,
        title: "Drawing a sketch",
        date: "24 Mar, 2020"
    },
    {
        id: 3,
        imageSrc: img3,
        title: "Project discussion with team",
        date: "11 Mar, 2020"
    }
]

const tagsData = [
    { id: 1, name: "Design" },
    { id: 2, name: "Development" },
    { id: 3, name: "Business" },
    { id: 4, name: "Project" },
    { id: 5, name: "Travel" },
    { id: 6, name: "Lifestyle" },
    { id: 7, name: "Photography" },
]


export { categoriesData, archiveData, popularPosts,tagsData }
