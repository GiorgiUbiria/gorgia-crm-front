//Import images
import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";

const allmail = [
  {
    id: 1,
    name: "Peter, me (3)",
    description: "<a class='subject' href='#'>Hello – <span class='teaser'>Trip home from Colombo has been arranged, then Jenna will come get me from Stockholm. :)</span></a>",
    read: true,
    fav: false,
    date: 'Mar 6',
    folder: 0
  },
  {
    id: 2,
    name: "me, Susanna (7)",
    description: "<a href='#' class='subject'> <span class='bg-warning badge me-2'> Freelance </span> Since you asked... and i'm inconceivably bored at the train station – <span class='teaser'> Alright thanks. I'll have to re-book that somehow, i'll get back to you. </span></a>",
    read: true,
    fav: false,
    date: 'Mar 6',
    folder: 0
  },
  {
    id: 3,
    name: "Web Support Dennis",
    description: "<a href='#' class='subject'> Re: New mail settings – <span class='teaser'> Will you answer him asap? </span></a>",
    read: true,
    fav: false,
    date: 'Mar 7',
    folder: 1
  },
  {
    id: 4,
    name: "me, Peter (2)",
    description: "<a href='#' class='subject'> <span class='bg-info badge me-2'> Support </span> Off on Thursday - <span class='teaser'> Eff that place, you might as well stay here with us instead! Sent from my iPhone 4 4 mar 2014 at 5:55 pm </span></a>",
    read: true,
    fav: false,
    date: 'Mar 4',
    folder: 0
  },
  {
    id: 5,
    name: "Medium",
    description: "<a href='#' class='subject'> <span class='bg-primary badge me-2'> Social </span> This Week's Top Stories – <span class='teaser'> Our top pick for you on Medium this week The Man Who Destroyed America’s Ego </span></a>",
    read: true,
    fav: false,
    date: 'Feb 28',
    folder: 1
  },
  {
    id: 6,
    name: "Death to Stock",
    description: "<a href='#' class='subject'> Montly High-Res Photos – <span class='teaser'> To create this month's pack, we hosted a party with local musician Jared Mahone here in Columbus, Ohio. </span></a>",
    read: true,
    fav: false,
    date: 'Feb 28',
    folder: 2
  },
  {
    id: 7,
    name: "Randy, me (5)",
    description: "<a href='#' class='subject'> <span class='bg-success badge me-2'> Family </span> Last pic over my village – <span class='teaser'> Yeah i'd like that! Do you remember the video you showed me of your train ride between Colombo and Kandy? The one with the mountain view? I would love to see that one again! </span></a>",
    read: false,
    fav: false,
    date: '5:01 am',
    folder: 3
  },
  {
    id: 8,
    name: "Andrew Zimmer",
    description: "<a href='#' class='subject'> Mochila Beta: Subscription Confirmed – <span class='teaser'> You've been confirmed! Welcome to the ruling className of the inbox. For your records, here is a copy of the information you submitted to us... </span></a>",
    read: true,
    fav: false,
    date: 'Mar 8',
    folder: 0
  },
  {
    id: 9,
    name: "Infinity HR",
    description: "<a href='#' class='subject'> Sveriges Hetaste sommarjobb – <span class='teaser'> Hej Nicklas Sandell! Vi vill bjuda in dig till 'First tour 2014', ett rekryteringsevent som erbjuder jobb på 16 semesterorter iSverige. </span></a>",
    read: true,
    fav: false,
    date: 'Mar 8',
    folder: 2
  },
  {
    id: 10,
    name: "Revibe",
    description: "<a href='#' class='subject'> <span class='bg-danger badge me-2'> Friends </span> Weekend on Revibe – <span class='teaser'> Today's Friday and we thought maybe you want some music inspiration for the weekend. Here are some trending tracks and playlists we think you should give a listen! </span></a>",
    read: true,
    fav: false,
    date: 'Feb 27',
    folder: 3
  },
  {
    id: 11,
    name: "Erik, me (5)",
    description: "<a href='#' class='subject'> Regarding our meeting – <span class='teaser'> That's great, see you on Thursday! </span></a>",
    read: true,
    fav: false,
    date: 'Feb 24',
    folder: 5
  },
  {
    id: 12,
    name: "KanbanFlow",
    description: "<a href='#' class='subject'> <span class='bg-primary badge me-2'> Social </span> Task assigned: Clone ARP's website – <span class='teaser'> You have been assigned a task by Alex@Work on the board Web. </span></a>",
    read: true,
    fav: false,
    date: 'Feb 24',
    folder: 1
  },
  {
    id: 13,
    name: "Tobias Berggren",
    description: "<a href='#' class='subject'> Let's go fishing! – <span class='teaser'> Hey, You wanna join me and Fred at the lake tomorrow? It'll be awesome. </span></a>",
    read: true,
    fav: false,
    date: 'Feb 23',
    folder: 3
  },
  {
    id: 14,
    name: "Charukaw, me (7)",
    description: "<a href='#' class='subject'> Hey man – <span class='teaser'> Nah man sorry i don't. Should i get it? </span></a>",
    read: true,
    fav: false,
    date: 'Feb 23',
    folder: 4
  },
  {
    id: 15,
    name: "me, Peter (5)",
    description: "<a href='#' class='subject'> <span class='bg-info badge me-2'> Support </span> Home again! – <span class='teaser'> That's just perfect! See you tomorrow. </span></a>",
    read: false,
    fav: false,
    date: 'Feb 21',
    folder: 5
  },
  {
    id: 16,
    name: "Stack Exchange",
    description: "<a href='#' class='subject'> 1 new items in your Stackexchange inbox – <span class='teaser'> The following items were added to your Stack Exchange global inbox since you last checked it. </span></a>",
    read: true,
    fav: false,
    date: 'Feb 21',
    folder: 1
  },
  {
    id: 17,
    name: "Google Drive Team",
    description: "<a href='#' class='subject'> You can now use your storage in Google Drive – <span class='teaser'> Hey Nicklas Sandell! Thank you for purchasing extra storage space in Google Drive. </span></a>",
    read: true,
    fav: false,
    date: 'Feb 20',
    folder: 2
  },
  {
    id: 18,
    name: "me, Susanna (11)",
    description: "<a href='#' class='subject'> Train/Bus – <span class='teaser'> Yes ok, great! I'm not stuck in Stockholm anymore, we're making progress. </span></a>",
    read: true,
    fav: false,
    date: 'Feb 19',
    folder: 3
  },
];

const mailDB = {
  allmail: [
    {
      id: 1,
      name: "Peter, me (3)",
      description: "<a class='subject' href='#'>Hello – <span class='teaser'>Trip home from Colombo has been arranged, then Jenna will come get me from Stockholm. :)</span></a>",
      read: true,
      starred: true,
      date: 'Mar 6',
      category: "starred"
    },
    {
      id: 2,
      name: "me, Susanna (7)",
      description: "<a href='#' class='subject'> <span class='bg-warning badge me-2'> Freelance </span> Since you asked... and i'm inconceivably bored at the train station – <span class='teaser'> Alright thanks. I'll have to re-book that somehow, i'll get back to you. </span></a>",
      read: true,
      starred: false,
      date: 'Mar 6',
      category: "sent"
    },
    {
      id: 3,
      name: "Web Support Dennis",
      description: "<a href='#' class='subject'> Re: New mail settings – <span class='teaser'> Will you answer him asap? </span></a>",
      read: true,
      starred: false,
      date: 'Mar 7',
      category: "important"
    },
    {
      id: 4,
      name: "me, Peter (2)",
      description: "<a href='#' class='subject'> <span class='bg-info badge me-2'> Support </span> Off on Thursday - <span class='teaser'> Eff that place, you might as well stay here with us instead! Sent from my iPhone 4 4 mar 2014 at 5:55 pm </span></a>",
      read: true,
      starred: false,
      date: 'Mar 4',
      category: "inbox"
    },
    {
      id: 5,
      name: "Medium",
      description: "<a href='#' class='subject'> <span class='bg-primary badge me-2'> Social </span> This Week's Top Stories – <span class='teaser'> Our top pick for you on Medium this week The Man Who Destroyed America’s Ego </span></a>",
      read: true,
      starred: true,
      date: 'Feb 28',
      category: "starred"
    },
    {
      id: 6,
      name: "Death to Stock",
      description: "<a href='#' class='subject'> Montly High-Res Photos – <span class='teaser'> To create this month's pack, we hosted a party with local musician Jared Mahone here in Columbus, Ohio. </span></a>",
      read: true,
      starred: false,
      date: 'Feb 28',
      category: 2
    },
    {
      id: 7,
      name: "Randy, me (5)",
      description: "<a href='#' class='subject'> <span class='bg-success badge me-2'> Family </span> Last pic over my village – <span class='teaser'> Yeah i'd like that! Do you remember the video you showed me of your train ride between Colombo and Kandy? The one with the mountain view? I would love to see that one again! </span></a>",
      read: false,
      starred: false,
      date: '5:01 am',
      category: "inbox"
    },
    {
      id: 8,
      name: "Andrew Zimmer",
      description: "<a href='#' class='subject'> Mochila Beta: Subscription Confirmed – <span class='teaser'> You've been confirmed! Welcome to the ruling className of the inbox. For your records, here is a copy of the information you submitted to us... </span></a>",
      read: true,
      starred: false,
      date: 'Mar 8',
      category: "inbox"
    },
    {
      id: 9,
      name: "Infinity HR",
      description: "<a href='#' class='subject'> Sveriges Hetaste sommarjobb – <span class='teaser'> Hej Nicklas Sandell! Vi vill bjuda in dig till 'First tour 2014', ett rekryteringsevent som erbjuder jobb på 16 semesterorter iSverige. </span></a>",
      read: true,
      starred: false,
      date: 'Mar 8',
      category: "inbox"
    },
    {
      id: 10,
      name: "Revibe",
      description: "<a href='#' class='subject'> <span class='bg-danger badge me-2'> Friends </span> Weekend on Revibe – <span class='teaser'> Today's Friday and we thought maybe you want some music inspiration for the weekend. Here are some trending tracks and playlists we think you should give a listen! </span></a>",
      read: true,
      starred: false,
      date: 'Feb 27',
      category: "inbox"
    },
    {
      id: 11,
      name: "Erik, me (5)",
      description: "<a href='#' class='subject'> Regarding our meeting – <span class='teaser'> That's great, see you on Thursday! </span></a>",
      read: true,
      starred: true,
      date: 'Feb 24',
      category: "starred"
    },
    {
      id: 12,
      name: "KanbanFlow",
      description: "<a href='#' class='subject'> <span class='bg-primary badge me-2'> Social </span> Task assigned: Clone ARP's website – <span class='teaser'> You have been assigned a task by Alex@Work on the board Web. </span></a>",
      read: true,
      starred: false,
      date: 'Feb 24',
      category: "important"
    },
    {
      id: 13,
      name: "Tobias Berggren",
      description: "<a href='#' class='subject'> Let's go fishing! – <span class='teaser'> Hey, You wanna join me and Fred at the lake tomorrow? It'll be awesome. </span></a>",
      read: true,
      starred: false,
      date: 'Feb 23',
      category: "trash"
    },
    {
      id: 14,
      name: "Charukaw, me (7)",
      description: "<a href='#' class='subject'> Hey man – <span class='teaser'> Nah man sorry i don't. Should i get it? </span></a>",
      read: true,
      starred: true,
      date: 'Feb 23',
      category: "starred"
    },
    {
      id: 15,
      name: "me, Peter (5)",
      description: "<a href='#' class='subject'> <span class='bg-info badge me-2'> Support </span> Home again! – <span class='teaser'> That's just perfect! See you tomorrow. </span></a>",
      read: false,
      starred: false,
      date: 'Feb 21',
      category: "draft"
    },
    {
      id: 16,
      name: "Stack Exchange",
      description: "<a href='#' class='subject'> 1 new items in your Stackexchange inbox – <span class='teaser'> The following items were added to your Stack Exchange global inbox since you last checked it. </span></a>",
      read: true,
      starred: false,
      date: 'Feb 21',
      category: "important"
    },
    {
      id: 17,
      name: "Google Drive Team",
      description: "<a href='#' class='subject'> You can now use your storage in Google Drive – <span class='teaser'> Hey Nicklas Sandell! Thank you for purchasing extra storage space in Google Drive. </span></a>",
      read: true,
      starred: true,
      date: 'Feb 20',
      category: "starred"
    },
    {
      id: 18,
      name: "me, Susanna (11)",
      description: "<a href='#' class='subject'> Train/Bus – <span class='teaser'> Yes ok, great! I'm not stuck in Stockholm anymore, we're making progress. </span></a>",
      read: true,
      starred: false,
      date: 'Feb 19',
      category: "inbox"
    },
  ],
  folders: [
    { id: 0, handle: 'inbox', title: 'Inbox' },
    { id: 1, handle: 'important', title: 'Important' },
    { id: 2, handle: 'drafts', title: 'Drafts' },
    { id: 3, handle: 'sent', title: 'Sent' },
    { id: 4, handle: 'trash', title: 'Trash' }
  ]
};

const labelsData = [
  { id: 1, icon: "mdi mdi-arrow-right-drop-circle text-info float-end", text: "Theme Support", },
  { id: 2, icon: "mdi mdi-arrow-right-drop-circle text-warning float-end", text: "Freelance", },
  { id: 3, icon: "mdi mdi-arrow-right-drop-circle text-primary float-end", text: "Social", },
  { id: 4, icon: "mdi mdi-arrow-right-drop-circle text-danger float-end", text: "Friends", },
  { id: 5, icon: "mdi mdi-arrow-right-drop-circle text-success float-end", text: "Family" }
]

const mailChatData = [
  { id: 1, imageSrc: avatar2, userTitle: "Scott Median", textMessage: "Hello" },
  { id: 1, imageSrc: avatar3, userTitle: "Julian Rosa", textMessage: "What about our next..." },
  { id: 1, imageSrc: avatar4, userTitle: "David Medina", textMessage: "Yeah everything is fine" },
  { id: 1, imageSrc: avatar6, userTitle: "Jay Baker", textMessage: "Wow that's great" }
]

export { allmail, mailDB, labelsData, mailChatData };