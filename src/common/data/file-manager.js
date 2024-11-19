const myfiles = [
  {
    id: 1,
    name: "Design",
    file: "12",
    Gb: 6,
  },
  {
    id: 2,
    name: "Development",
    file: "20",
    Gb: 8,
  },
  {
    id: 3,
    name: "Project A",
    file: "06 ",
    Gb: 2,
  },
  {
    id: 4,
    name: "Admin",
    file: "08",
    Gb: 4,
  },
  {
    id: 5,
    name: "Sketch Design",
    file: "12",
    Gb: 6,
  },
  {
    id: 6,
    name: "Applications",
    file: "20",
    Gb: 8,
  },
];

const recentfile = [
  {
    id: 1,
    icon: "mdi mdi-file-document font-size-16 align-middle text-primary me-2",
    file: "index.html",
    date: "12-10-2020, 09:45",
    size: "09",
  },
  {
    id: 2,
    icon: "mdi mdi-folder-zip font-size-16 align-middle text-warning me-2",
    file: "Project-A.zip",
    date: "11-10-2020, 17:05",
    size: "115",
  },
  {
    id: 3,
    icon: "mdi mdi-image font-size-16 align-middle text-muted me-2",
    file: "Img-1.jpeg",
    date: "11-10-2020, 13:26",
    size: "86",
  },
  {
    id: 4,
    icon: "mdi mdi-text-box font-size-16 align-middle text-muted me-2",
    file: "update list.txt",
    date: "10-10-2020, 11:32",
    size: "08",
  },
  {
    id: 5,
    icon: "mdi mdi-folder font-size-16 align-middle text-warning me-2",
    file: "Project B",
    date: "10-10-2020, 10:51",
    size: "72",
  },
  {
    id: 6,
    icon: "mdi mdi-text-box font-size-16 align-middle text-muted me-2",
    file: "Changes list.txt",
    date: "09-10-2020, 17:05",
    size: "07",
  },
  {
    id: 7,
    icon: "mdi mdi-image font-size-16 align-middle text-success me-2",
    file: "Img-2.png",
    date: "09-10-2020, 15:12",
    size: "31",
  },
  {
    id: 8,
    icon: "mdi mdi-folder font-size-16 align-middle text-warning me-2",
    file: "Project C",
    date: "09-10-2020, 10:11",
    size: "20",
  },
  {
    id: 9,
    icon: "bx bxs-file font-size-16 align-middle text-primary me-2",
    file: "starter-page.html",
    date: "08-10-2020, 03:22",
    size: "11",
  },
];

const filesData = [
  {
    text: "Design",
    icon: false
  },
  {
    text: "Development",
    icon: true
  },
  {
    text: "Project A",
    icon: false
  },
  {
    text: "Admin",
    icon: true
  }
];

const filemanagerData = [
  {
    icon: "mdi mdi-google-drive font-size-16 text-muted me-2",
    text: "Google Drive",
  },
  {
    icon: "mdi mdi-dropbox font-size-16 me-2 text-primary",
    text: "Dropbox",
  },
  {
    icon: "mdi mdi-share-variant font-size-16 me-2",
    text: "Shared",
    icons: true
  },
  {
    icon: "mdi mdi-star-outline text-muted font-size-16 me-2",
    text: "Starred",
  },
  {
    icon: "mdi mdi-trash-can text-danger font-size-16 me-2",
    text: "Trash",
  },
  {
    icon: "mdi mdi-cog text-muted font-size-16 me-2",
    text: "Setting",
    badge: true
  }
]

const storageData = [
  {
    id: 1,
    title: "Images",
    color: "success",
    icon: "mdi mdi-image",
    files: "176 Files",
    size: "6 GB"
  },
  {
    id: 2,
    title: "Video",
    color: "danger",
    icon: "mdi mdi-play-circle-outline",
    files: "45 Files",
    size: "4.1 GB"
  },
  {
    id: 3,
    title: "Music",
    color: "info",
    icon: "mdi mdi-music",
    files: "21 Files",
    size: "3.2 GB"
  },
  {
    id: 4,
    title: "Document",
    color: "primary",
    icon: "mdi mdi-file-document",
    files: "21 Files",
    size: "2 GB"
  },
  {
    id: 5,
    title: "Others",
    color: "warning",
    icon: "mdi mdi-folder",
    files: "20 Files",
    size: "1.4 GB"
  }
]


export { myfiles, recentfile, filesData, filemanagerData, storageData };