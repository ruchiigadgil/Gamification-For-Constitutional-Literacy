let historical_figures = [
  {
    "name": "Mahatma Gandhi",
    "image_url": "https://th.bing.com/th/id/R.ba14794f4c05e693fe016f4275e2fc12?rik=MuAFJ2K1q7A8Zg&riu=http%3a%2f%2f2.bp.blogspot.com%2f-pyy5lnRW3GQ%2fUS0rZNi97_I%2fAAAAAAAABHw%2fZBDCCQBn0QQ%2fs1600%2fMahatma%2bGandhi%2bBiography.jpg&ehk=ZcU3RhqHik%2fOeED0QG%2fDWFRIRznkpp1fjZAiQl8xdi0%3d&risl=&pid=ImgRaw&r=0"
  },
  {
    "name": "Bal Gangadhar Tilak",
    "image_url": "https://th.bing.com/th/id/OIP._0aqnC0vMmO6c0XWRui2HQHaG0?rs=1&pid=ImgDetMain"
  },
  {
    "name": "Shah Jahan",
    "image_url": "https://www.thefamouspeople.com/profiles/images/shah-jahan-5.jpg"
  },
  {
    "name": "Rani of Jhansi",
    "image_url": "https://os.me/wp-content/uploads/2022/07/20220712_195417.jpg.optimal.jpg"
  },
  {
    "name": "Shivaji",
    "image_url": "https://w0.peakpx.com/wallpaper/264/418/HD-wallpaper-shivaji-maharaj-painting-shivaji-maharaj-chhatrapati-shivaji-maharaj-painting.jpg"
  },
  {
    "name": "Dadabhai Naoroji",
    "image_url": "https://media.gettyimages.com/photos/circa-1890-indian-statesman-dadabhai-naoroji-picture-id3334108?k=6&m=3334108&s=612x612&w=0&h=yKGuWR-lrAWn18DuizuR8tpfCZrsZxxxEQYq50F3p-M="
  },
  {
    "name": "Rajendra Prasad",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/d/dd/Rajendra_Prasad_%28Indian_President%29%2C_signed_image_for_Walter_Nash_%28NZ_Prime_Minister%29%2C_1958_%2816017609534%29.jpg"
  },
  {
    "name": "Indira Gandhi",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/IndiraGandhi.png/800px-IndiraGandhi.png"
  },
  {
    "name": "Bhagat Singh",
    "image_url": "https://tse1.mm.bing.net/th?id=OIP.4OgJvX2N2zV9MoRHAS1fAwHaLG&pid=Api&P=0&h=220"
  },
  {
    "name": "Jyotiba Phule",
    "image_url": "http://www.thefamouspeople.com/profiles/images/jyotiba-phule-2.jpg"
  },
  {
    "name": "Savitribai Phule",
    "image_url": "https://images.squarespace-cdn.com/content/v1/5f245072d665567d9e1d4326/63972d70-b5a8-4526-883b-07b667182cc2/Savitribai+Phule.jpg"
  },
  {
    "name": "Lal Bal Pal",
    "image_url": "https://d18x2uyjeekruj.cloudfront.net/wp-content/uploads/2020/06/lbp.jpg"
  },
  {
    "name": "Swami Vivekananda",
    "image_url": "https://ramakrishna.org/img/vivekananda/medium/sv3.jpg"
  },
  {
    "name": "Swami Dayananda Saraswati",
    "image_url": "https://blogmedia.testbook.com/blog/wp-content/uploads/2023/11/arya-samaj-6ea2bf7a.png"
  },
  {
    "name": "Magal Pandey",
    "image_url": "https://i.pinimg.com/originals/75/7b/9b/757b9bce66fe881cc20be6ce6e319571.jpg"
  },
  {
    "name": "Annie Besant",
    "image_url": "https://idsb.tmgrup.com.tr/ly/uploads/images/2022/02/23/185061.jpg"
  },
  {
    "name": "Dr B. R. Ambedkar",
    "image_url": "https://infinitylearn.com/surge/wp-content/uploads/2023/09/BR-Ambedkar.jpeg"
  },
  {
    "name": "Sarojini Naidu",
    "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk9bRvyuzGlvUwCXAf86RZ9d-fIrWEITyGlg&s"
  },
  {
    "name": "Rabindranath Tagore",
    "image_url": "https://currentaffairs.adda247.com/wp-content/uploads/multisite/sites/5/2023/08/09101248/National-Anthem-of-India-Jana-Gana-Mana-Adhinayak.png"
  },
  {
    "name": "Subhas Chandra Bose",
    "image_url": "https://cdn.britannica.com/37/171337-004-0B980E9D/Subhas-Chandra-Bose-Indian-National-Army.jpg"
  },
  {
    "name": "Indian National Congress",
    "image_url": "https://www.pbs.org/thestoryofindia/images/gallery/indian_national_congress.jpg"
  },
  {
    "name": "Droupadi Murmu",
    "image_url": "https://th-i.thgim.com/public/incoming/s9t8lm/article65680653.ece/alternates/FREE_1200/PTI07_25_2022_000060A.jpg"
  },
  {
    "name": "Taj Mahal",
    "image_url": "https://www.worldatlas.com/upload/a7/26/e9/taj-mahal.jpg"
  },
  {
    "name": "Humayun’s Tomb",
    "image_url": "https://theurgetowander.files.wordpress.com/2013/11/dsc_5242-copy.jpg"
  },
  {
    "name": "Ashoka Pillar",
    "image_url": "https://travelsetu.com/apps/uploads/new_destinations_photos/destination/2024/01/05/1bcf5bd215ee827c8fab70ed812b8d51_1000x1000.jpg"
  },
  {
    "name": "Parliament House",
    "image_url": "https://www.indiaeasytrip.com/states-of-india/parliament-house.jpg"
  },
  {
    "name": "Jallianwala Bagh",
    "image_url": "https://upload.wikimedia.org/wikipedia/mr/e/e3/Jaaliyanwalabaag_hatyakaand.jpg"
  },
  {
    "name": "Iron Man of India",
    "image_url": "https://visitsou.com/wp-content/uploads/7-Sardar-Vallabhbhai-Patel-The-Iron-Man-of-India-and-His-Monument-of-Unity.jpg"
  },
  {
    "name": "Statue Of Unity",
    "image_url": "https://images.news18.com/ibnlive/uploads/2021/10/statue-of-unity.jpg"
  },
  {
    "name": "Quit India",
    "image_url": "https://static.toiimg.com/thumb/msid-59987915,width-1280,height-720,resizemode-4/59987915.jpg"
  },
  {
    "name": "Mumbai To Thane Railway",
    "image_url": "https://c8.alamy.com/comp/KJFCDK/the-first-train-in-india-leaves-bombay-for-thane-on-16-april-1853-KJFCDK.jpg"
  },
  {
    "name": "Salt March",
    "image_url": "http://www.citeco.fr/10000-years-history-economics/media/images/resize/w1000_1930_1_marche%20du%20sel.jpg"
  },
  {
    "name": "Swadeshi Movement",
    "image_url": "https://images.saatchiart.com/saatchi/1122046/art/5099645/4169467-HSC00001-7.jpg"
  },
  {
    "name": "Satyagraha",
    "image_url": "https://assets.thehansindia.com/hansindia-bucket/6328_Satyagraha.jpg"
  },
  {
    "name": "Ghadar Party",
    "image_url": "http://www.foundsf.org/images/d/d0/Ghadar_party.jpg"
  },
  {
    "name": "Indian National Army",
    "image_url": "https://learn.culturalindia.net/wp-content/uploads/2018/06/indian-national-army-1.jpg"
  },

  {
    "name": "Jai Jawan Jai Kisan",
    "image_url": "https://static.mygov.in/indiancc/2021/12/mygov-9999999992135726445-1024x576.jpg"
  },
  {
    "name": "Chipko Movement",
    "image_url": "https://cdn.sanity.io/images/oyzyxja8/v2/f2f81277b1163bd01d770392d87e44b6d349b6c7-1700x2000.jpg?rect=0,554,1700,893&w=1200&h=630&q=85&auto=format"
  },
  {
    "name": "Election Voting Machine",
    "image_url": "https://www.livelaw.in/h-upload/images/1500x900_voting-machines.jpg"
  },
  {
    "name": "Supreme Court of India",
    "image_url": "https://blog.ipleaders.in/wp-content/uploads/2021/10/supreme-court-4.jpg"
  },
  {
    "name": "Right to Education",
    "image_url": "https://www.cry.org/wp-content/uploads/teachers-teaching-students.jpg"
  },
{
    "name": "Red Fort",
    "image_url": "https://cdn.britannica.com/20/189820-050-D650A54D/Red-Fort-Old-Delhi-India.jpg"
  },
  {
    "name": "Iron Pillar",
    "image_url": "https://www.gosahin.com/go/p/h/1564838479_iron-pillar-of-mehrauli-delhi1.jpg"
  },
{
    "name": "India Gate",
    "image_url": "https://www.cry.org/wp-content/uploads/teachers-teaching-students.jpg"
  },
  {
    "name": "Qutub Minar",
    "image_url": "http://upload.wikimedia.org/wikipedia/commons/1/14/Qutub_Minar_at_Delhi.jpg"
  },
  {
    "name": "Char Minar",
    "image_url": "https://images.freeimages.com/images/large-previews/0c8/hyderabad-charminar-1225121.jpg"
  },

{
    "name": "Gateway Of India",
    "image_url": "https://upload.wikimedia.org/wikipedia/commons/3/3a/Mumbai_03-2016_30_Gateway_of_India.jpg"
  },
  {
    "name": "Kaala Pani",
    "image_url": "https://as1.ftcdn.net/v2/jpg/02/08/17/28/1000_F_208172832_Cs9BvjsYWmyLknyXfnjGzv4dNvQNAvLC.jpg"
  },
  {
    "name": "Rajya Sabha",
    "image_url": "https://c.ndtvimg.com/2022-02/oa80d25g_rajya-sabha-pti_625x300_10_February_22.jpg"
  },
  {
    "name": "Sati Act",
    "image_url": "https://df0b18phdhzpx.cloudfront.net/ckeditor_assets/pictures/1352817/original_Sati_(1).jpg"
  },



] 
export default historical_figures



