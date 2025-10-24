let historical_figures = [
  {
    "name": "Mahatma Gandhi",
    "image_url": "https://th.bing.com/th/id/R.ba14794f4c05e693fe016f4275e2fc12?rik=MuAFJ2K1q7A8Zg&riu=http%3a%2f%2f2.bp.blogspot.com%2f-pyy5lnRW3GQ%2fUS0rZNi97_I%2fAAAAAAAABHw%2fZBDCCQBn0QQ%2fs1600%2fMahatma%2bGandhi%2bBiography.jpg&ehk=ZcU3RhqHik%2fOeED0QG%2fDWFRIRznkpp1fjZAiQl8xdi0%3d&risl=&pid=ImgRaw&r=0",
    "hint": "Father of the Nation who led India to independence through non-violence and truth"
  },
  {
    "name": "Bal Gangadhar Tilak",
    "image_url": "https://th.bing.com/th/id/OIP._0aqnC0vMmO6c0XWRui2HQHaG0?rs=1&pid=ImgDetMain",
    "hint": "Declared 'Swaraj is my birthright' and started Ganesh Chaturthi as a public festival"
  },
  {
    "name": "Shah Jahan",
    "image_url": "https://www.thefamouspeople.com/profiles/images/shah-jahan-5.jpg",
    "hint": "Mughal emperor who built the Taj Mahal in memory of his beloved wife Mumtaz Mahal"
  },
  {
    "name": "Rani of Jhansi",
    "image_url": "https://os.me/wp-content/uploads/2022/07/20220712_195417.jpg.optimal.jpg",
    "hint": "Brave queen who fought against the British in 1857 with her baby tied to her back"
  },
  {
    "name": "Shivaji",
    "image_url": "https://w0.peakpx.com/wallpaper/264/418/HD-wallpaper-shivaji-maharaj-painting-shivaji-maharaj-chhatrapati-shivaji-maharaj-painting.jpg",
    "hint": "Great Maratha warrior king who established the Maratha Empire and fought the Mughals"
  },
  {
    "name": "Dadabhai Naoroji",
    "image_url": "https://media.gettyimages.com/photos/circa-1890-indian-statesman-dadabhai-naoroji-picture-id3334108?k=6&m=3334108&s=612x612&w=0&h=yKGuWR-lrAWn18DuizuR8tpfCZrsZxxxEQYq50F3p-M=",
    "hint": "Grand Old Man of India and first Indian to be elected to British Parliament"
  },
  {
    "name": "Rajendra Prasad",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/d/dd/Rajendra_Prasad_%28Indian_President%29%2C_signed_image_for_Walter_Nash_%28NZ_Prime_Minister%29%2C_1958_%2816017609534%29.jpg",
    "hint": "First President of independent India who served from 1950 to 1962"
  },
  {
    "name": "Indira Gandhi",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/IndiraGandhi.png/800px-IndiraGandhi.png",
    "hint": "First and only female Prime Minister of India, daughter of Nehru"
  },
  {
    "name": "Bhagat Singh",
    "image_url": "https://tse1.mm.bing.net/th?id=OIP.4OgJvX2N2zV9MoRHAS1fAwHaLG&pid=Api&P=0&h=220",
    "hint": "Revolutionary martyr who was hanged at age 23 for fighting against British rule"
  },
  {
    "name": "Jyotiba Phule",
    "image_url": "http://www.thefamouspeople.com/profiles/images/jyotiba-phule-2.jpg",
    "hint": "Social reformer who opened the first school for girls in India in 1848"
  },
  {
    "name": "Savitribai Phule",
    "image_url": "https://images.squarespace-cdn.com/content/v1/5f245072d665567d9e1d4326/63972d70-b5a8-4526-883b-07b667182cc2/Savitribai+Phule.jpg",
    "hint": "First female teacher of India who fought against caste discrimination and educated women"
  },
  {
    "name": "Lal Bal Pal",
    "image_url": "https://d18x2uyjeekruj.cloudfront.net/wp-content/uploads/2020/06/lbp.jpg",
    "hint": "Famous trio of extremist leaders: Lala Lajpat Rai, Bal Gangadhar Tilak, and Bipin Chandra Pal"
  },
  {
    "name": "Swami Vivekananda",
    "image_url": "https://ramakrishna.org/img/vivekananda/medium/sv3.jpg",
    "hint": "Spiritual leader who represented Hinduism at World Parliament of Religions in Chicago in 1893"
  },
  {
    "name": "Swami Dayananda Saraswati",
    "image_url": "https://blogmedia.testbook.com/blog/wp-content/uploads/2023/11/arya-samaj-6ea2bf7a.png",
    "hint": "Founder of Arya Samaj who promoted Vedic teachings and social reform"
  },
  {
    "name": "Magal Pandey",
    "image_url": "https://i.pinimg.com/originals/75/7b/9b/757b9bce66fe881cc20be6ce6e319571.jpg",
    "hint": "Indian soldier whose rebellion sparked the 1857 Revolt against the British East India Company"
  },
  {
    "name": "Annie Besant",
    "image_url": "https://idsb.tmgrup.com.tr/ly/uploads/images/2022/02/23/185061.jpg",
    "hint": "British woman who became President of Indian National Congress and started Home Rule League"
  },
  {
    "name": "Dr B. R. Ambedkar",
    "image_url": "https://infinitylearn.com/surge/wp-content/uploads/2023/09/BR-Ambedkar.jpeg",
    "hint": "Architect of Indian Constitution who fought for rights of Dalits and social equality"
  },
  {
    "name": "Sarojini Naidu",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk9bRvyuzGlvUwCXAf86RZ9d-fIrWEITyGlg&s",
    "hint": "Nightingale of India, famous poet and first woman Governor of an Indian state"
  },
  {
    "name": "Rabindranath Tagore",
    "image_url": "https://currentaffairs.adda247.com/wp-content/uploads/multisite/sites/5/2023/08/09101248/National-Anthem-of-India-Jana-Gana-Mana-Adhinayak.png",
    "hint": "Nobel Prize winning poet who wrote India's national anthem Jana Gana Mana"
  },
  {
    "name": "Subhas Chandra Bose",
    "image_url": "https://cdn.britannica.com/37/171337-004-0B980E9D/Subhas-Chandra-Bose-Indian-National-Army.jpg",
    "hint": "Netaji who formed Azad Hind Fauj and said 'Give me blood, I will give you freedom'"
  },
  {
    "name": "Indian National Congress",
    "image_url": "https://www.pbs.org/thestoryofindia/images/gallery/indian_national_congress.jpg",
    "hint": "First modern nationalist political party of India founded in 1885"
  },
  {
    "name": "Droupadi Murmu",
    "image_url": "https://th-i.thgim.com/public/incoming/s9t8lm/article65680653.ece/alternates/FREE_1200/PTI07_25_2022_000060A.jpg",
    "hint": "Current President of India and first tribal woman to hold this position"
  },
  {
    "name": "Taj Mahal",
    "image_url": "https://www.worldatlas.com/upload/a7/26/e9/taj-mahal.jpg",
    "hint": "White marble monument of love in Agra, one of the Seven Wonders of the World"
  },
  {
    "name": "Humayun's Tomb",
    "image_url": "https://theurgetowander.files.wordpress.com/2013/11/dsc_5242-copy.jpg",
    "hint": "First garden tomb in India, inspired the design of the Taj Mahal"
  },
  {
    "name": "Ashoka Pillar",
    "image_url": "https://travelsetu.com/apps/uploads/new_destinations_photos/destination/2024/01/05/1bcf5bd215ee827c8fab70ed812b8d51_1000x1000.jpg",
    "hint": "Ancient pillar with four lions on top, which became India's national emblem"
  },
  {
    "name": "Parliament House",
    "image_url": "https://www.indiaeasytrip.com/states-of-india/parliament-house.jpg",
    "hint": "Circular building in New Delhi where Indian laws are made and debates happen"
  },
  {
    "name": "Jallianwala Bagh",
    "image_url": "https://upload.wikimedia.org/wikipedia/mr/e/e3/Jaaliyanwalabaag_hatyakaand.jpg",
    "hint": "Site of 1919 massacre in Amritsar where General Dyer ordered firing on peaceful crowd"
  },
  {
    "name": "Iron Man of India",
    "image_url": "https://visitsou.com/wp-content/uploads/7-Sardar-Vallabhbhai-Patel-The-Iron-Man-of-India-and-His-Monument-of-Unity.jpg",
    "hint": "Sardar Vallabhbhai Patel who united 562 princely states into independent India"
  },
  {
    "name": "Statue Of Unity",
    "image_url": "https://images.news18.com/ibnlive/uploads/2021/10/statue-of-unity.jpg",
    "hint": "World's tallest statue in Gujarat dedicated to Sardar Vallabhbhai Patel"
  },
  {
    "name": "Quit India",
    "image_url": "https://static.toiimg.com/thumb/msid-59987915,width-1280,height-720,resizemode-4/59987915.jpg",
    "hint": "1942 movement launched by Gandhi demanding immediate British withdrawal from India"
  },
  {
    "name": "Mumbai To Thane Railway",
    "image_url": "https://c8.alamy.com/comp/KJFCDK/the-first-train-in-india-leaves-bombay-for-thane-on-16-april-1853-KJFCDK.jpg",
    "hint": "First passenger train in India that ran in 1853 covering 34 kilometers"
  },
  {
    "name": "Salt March",
    "image_url": "http://www.citeco.fr/10000-years-history-economics/media/images/resize/w1000_1930_1_marche%20du%20sel.jpg",
    "hint": "1930 protest led by Gandhi walking 240 miles to make salt and break British law"
  },
  {
    "name": "Swadeshi Movement",
    "image_url": "https://images.saatchiart.com/saatchi/1122046/art/5099645/4169467-HSC00001-7.jpg",
    "hint": "Movement to boycott foreign goods and promote Indian-made products"
  },
  {
    "name": "Satyagraha",
    "image_url": "https://assets.thehansindia.com/hansindia-bucket/6328_Satyagraha.jpg",
    "hint": "Gandhi's philosophy of non-violent resistance meaning 'truth force'"
  },
  {
    "name": "Ghadar Party",
    "image_url": "http://www.foundsf.org/images/d/d0/Ghadar_party.jpg",
    "hint": "Revolutionary organization formed by Indians abroad to overthrow British rule"
  },
  {
    "name": "Indian National Army",
    "image_url": "https://learn.culturalindia.net/wp-content/uploads/2018/06/indian-national-army-1.jpg",
    "hint": "Armed force formed by Subhas Chandra Bose to fight British during World War II"
  },
  {
    "name": "Jai Jawan Jai Kisan",
    "image_url": "https://static.mygov.in/indiancc/2021/12/mygov-9999999992135726445-1024x576.jpg",
    "hint": "Slogan given by Lal Bahadur Shastri meaning 'Hail the soldier, Hail the farmer'"
  },
  {
    "name": "Chipko Movement",
    "image_url": "https://cdn.sanity.io/images/oyzyxja8/v2/f2f81277b1163bd01d770392d87e44b6d349b6c7-1700x2000.jpg?rect=0,554,1700,893&w=1200&h=630&q=85&auto=format",
    "hint": "Environmental movement where people hugged trees to prevent them from being cut"
  },
  {
    "name": "Election Voting Machine",
    "image_url": "https://www.livelaw.in/h-upload/images/1500x900_voting-machines.jpg",
    "hint": "Electronic device used in India to cast votes during elections"
  },
  {
    "name": "Supreme Court of India",
    "image_url": "https://blog.ipleaders.in/wp-content/uploads/2021/10/supreme-court-4.jpg",
    "hint": "Highest judicial court in India that protects the Constitution"
  },
  {
    "name": "Right to Education",
    "image_url": "https://www.cry.org/wp-content/uploads/teachers-teaching-students.jpg",
    "hint": "Fundamental right that guarantees free education to all children aged 6-14 years"
  },
  {
    "name": "Red Fort",
    "image_url": "https://cdn.britannica.com/20/189820-050-D650A54D/Red-Fort-Old-Delhi-India.jpg",
    "hint": "Historic red sandstone fort in Delhi where Prime Minister hoists flag on Independence Day"
  },
  {
    "name": "Iron Pillar",
    "image_url": "https://www.gosahin.com/go/p/h/1564838479_iron-pillar-of-mehrauli-delhi1.jpg",
    "hint": "1600-year-old rust-free pillar in Delhi showcasing ancient Indian metallurgy"
  },
  {
    "name": "India Gate",
    "image_url": "https://www.cry.org/wp-content/uploads/teachers-teaching-students.jpg",
    "hint": "War memorial in New Delhi dedicated to Indian soldiers who died in World War I"
  },
  {
    "name": "Qutub Minar",
    "image_url": "http://upload.wikimedia.org/wikipedia/commons/1/14/Qutub_Minar_at_Delhi.jpg",
    "hint": "Tallest brick minaret in the world located in Delhi, built in 1193"
  },
  {
    "name": "Char Minar",
    "image_url": "https://images.freeimages.com/images/large-previews/0c8/hyderabad-charminar-1225121.jpg",
    "hint": "Monument with four towers in Hyderabad built in 1591"
  },
  {
    "name": "Gateway Of India",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg",
    "hint": "Iconic arch monument in Mumbai built to commemorate visit of King George V"
  },
  {
    "name": "Kaala Pani",
    "image_url": "https://as1.ftcdn.net/v2/jpg/02/08/17/28/1000_F_208172832_Cs9BvjsYWmyLknyXfnjGzv4dNvQNAvLC.jpg",
    "hint": "Cellular Jail in Andaman where British imprisoned Indian freedom fighters"
  },
  {
    "name": "Rajya Sabha",
    "image_url": "https://c.ndtvimg.com/2022-02/oa80d25g_rajya-sabha-pti_625x300_10_February_22.jpg",
    "hint": "Upper house of Indian Parliament representing states and union territories"
  },
  {
    "name": "Sati Act",
    "image_url": "https://df0b18phdhzpx.cloudfront.net/ckeditor_assets/pictures/1352817/original_Sati_(1).jpg",
    "hint": "1829 law passed by Lord William Bentinck that banned the practice of widow burning"
  }
]

export default historical_figures