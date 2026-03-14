/**
 * Builds src/data/geo/india-states-cities.json
 * Punjab + all states/UTs with major cities (expand as needed).
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '../src/data/geo')

const states = [
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    cities: [
      'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry',
      'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur', 'Eluru', 'Ongole', 'Chittoor',
      'Machilipatnam', 'Adoni', 'Tenali', 'Proddatur', 'Chilakaluripet', 'Hindupur',
      'Bhimavaram', 'Nandyal', 'Madanapalle', 'Gudivada', 'Narasaraopet',
    ],
  },
  {
    code: 'AR',
    name: 'Arunachal Pradesh',
    cities: [
      'Itanagar', 'Naharlagun', 'Pasighat', 'Tezpur', 'Ziro', 'Along', 'Daporijo',
      'Bomdila', 'Aalo', 'Roing', 'Khonsa',
    ],
  },
  {
    code: 'AS',
    name: 'Assam',
    cities: [
      'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur',
      'Bongaigaon', 'Dhubri', 'Diphu', 'North Lakhimpur', 'Karimganj', 'Sivasagar',
      'Goalpara', 'Barpeta', 'Lanka', 'Lumding', 'Mangaldoi', 'Margherita',
    ],
  },
  {
    code: 'BR',
    name: 'Bihar',
    cities: [
      'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Arrah',
      'Begusarai', 'Katihar', 'Munger', 'Chapra', 'Sasaram', 'Hajipur', 'Siwan',
      'Sitamarhi', 'Motihari', 'Bettiah', 'Jamalpur', 'Jehanabad', 'Aurangabad',
    ],
  },
  {
    code: 'CT',
    name: 'Chhattisgarh',
    cities: [
      'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Rajnandgaon', 'Raigarh', 'Jagdalpur',
      'Ambikapur', 'Dhamtari', 'Mahasamund', 'Chirmiri', 'Durg', 'Bhatapara',
    ],
  },
  {
    code: 'GA',
    name: 'Goa',
    cities: [
      'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Mormugao', 'Bicholim',
      'Curchorem', 'Valpoi', 'Sanquelim',
    ],
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    cities: [
      'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh',
      'Gandhinagar', 'Anand', 'Nadiad', 'Morbi', 'Mehsana', 'Bharuch', 'Navsari',
      'Veraval', 'Bhuj', 'Surendranagar', 'Palanpur', 'Valsad', 'Porbandar',
    ],
  },
  {
    code: 'HR',
    name: 'Haryana',
    cities: [
      'Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar',
      'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind',
      'Thanesar', 'Kaithal', 'Rewari', 'Palwal', 'Hansi',
    ],
  },
  {
    code: 'HP',
    name: 'Himachal Pradesh',
    cities: [
      'Shimla', 'Mandi', 'Solan', 'Dharamshala', 'Baddi', 'Nahan', 'Una', 'Kullu',
      'Hamirpur', 'Chamba', 'Bilaspur', 'Palampur', 'Nurpur', 'Kangra',
    ],
  },
  {
    code: 'JH',
    name: 'Jharkhand',
    cities: [
      'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Phusro', 'Hazaribagh',
      'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda', 'Jhumri Telaiya', 'Sahibganj',
    ],
  },
  {
    code: 'KA',
    name: 'Karnataka',
    cities: [
      'Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru', 'Belagavi', 'Kalaburagi',
      'Davangere', 'Ballari', 'Tumakuru', 'Raichur', 'Bidar', 'Hospet', 'Hassan',
      'Mandya', 'Udupi', 'Chitradurga', 'Gadag', 'Kolar', 'Robertson Pet',
    ],
  },
  {
    code: 'KL',
    name: 'Kerala',
    cities: [
      'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Alappuzha',
      'Kannur', 'Palakkad', 'Kottayam', 'Malappuram', 'Manjeri', 'Thalassery',
      'Vatakara', 'Kanhangad', 'Neyyattinkara', 'Kayamkulam', 'Ponnani',
    ],
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    cities: [
      'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Ratlam',
      'Satna', 'Burhanpur', 'Murwara', 'Singrauli', 'Dewas', 'Rewa', 'Katni',
      'Morena', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri',
    ],
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    cities: [
      'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur',
      'Amravati', 'Kolhapur', 'Sangli', 'Malegaon', 'Jalgaon', 'Akola', 'Latur',
      'Dhule', 'Ahmednagar', 'Ichalkaranji', 'Parbhani', 'Panvel', 'Yavatmal',
    ],
  },
  {
    code: 'MN',
    name: 'Manipur',
    cities: [
      'Imphal', 'Thoubal', 'Kakching', 'Lilong', 'Mayang Imphal', 'Bishnupur',
      'Ukhrul', 'Churachandpur', 'Tamenglong',
    ],
  },
  {
    code: 'ML',
    name: 'Meghalaya',
    cities: [
      'Shillong', 'Tura', 'Nongstoin', 'Jowai', 'Nongpoh', 'Baghmara', 'Williamnagar',
    ],
  },
  {
    code: 'MZ',
    name: 'Mizoram',
    cities: [
      'Aizawl', 'Lunglei', 'Saiha', 'Champhai', 'Kolasib', 'Serchhip', 'Lawngtlai',
    ],
  },
  {
    code: 'NL',
    name: 'Nagaland',
    cities: [
      'Kohima', 'Dimapur', 'Tuensang', 'Wokha', 'Zunheboto', 'Mokokchung', 'Mon',
      'Phek', 'Longleng',
    ],
  },
  {
    code: 'OR',
    name: 'Odisha',
    cities: [
      'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri',
      'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Bargarh', 'Rayagada',
      'Paradip', 'Jeypore', 'Bhawanipatna',
    ],
  },
  {
    code: 'PB',
    name: 'Punjab',
    cities: [
      'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Pathankot',
      'Hoshiarpur', 'Mohali', 'SAS Nagar', 'Batala', 'Moga', 'Abohar', 'Malerkotla',
      'Khanna', 'Phagwara', 'Muktsar', 'Barnala', 'Rajpura', 'Firozpur', 'Firozepur',
      'Kapurthala', 'Mandi Gobindgarh', 'Sunam', 'Sangrur', 'Faridkot', 'Fazilka',
      'Gurdaspur', 'Nabha', 'Zira', 'Mansa', 'Nangal', 'Rupnagar', 'Roopnagar',
      'Anandpur Sahib', 'Dasuya', 'Nawanshahr', 'Shaheed Bhagat Singh Nagar',
      'Tarn Taran', 'Moga District', 'Samana', 'Patiala District', 'Jalandhar Cantt',
      'Amritsar Cantt', 'Dhuri', 'Rampura Phul', 'Budhlada', 'Longowal', 'Lehra',
      'Moonak', 'Talwandi Sabo', 'Maur', 'Bhikhi', 'Bareta', 'Goniana', 'Bhucho Mandi',
      'Kotkapura', 'Jaitu', 'Bagha Purana', 'Dharamkot', 'Zira', 'Hariana',
    ],
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    cities: [
      'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara',
      'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Tonk', 'Sriganganagar', 'Beawar',
      'Kishangarh', 'Churu', 'Jhunjhunu', 'Barmer', 'Nagaur', 'Sawai Madhopur',
    ],
  },
  {
    code: 'SK',
    name: 'Sikkim',
    cities: [
      'Gangtok', 'Namchi', 'Mangan', 'Gyalshing', 'Rangpo', 'Singtam', 'Jorethang',
    ],
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    cities: [
      'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli',
      'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur',
      'Ranipet', 'Nagercoil', 'Kanchipuram', 'Karaikudi', 'Hosur', 'Ooty',
    ],
  },
  {
    code: 'TG',
    name: 'Telangana',
    cities: [
      'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Ramagundam',
      'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Miryalaguda', 'Siddipet',
    ],
  },
  {
    code: 'TR',
    name: 'Tripura',
    cities: [
      'Agartala', 'Udaipur', 'Dharmanagar', 'Pratapgarh', 'Kailashahar', 'Belonia',
      'Kumarghat', 'Ambassa',
    ],
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    cities: [
      'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj',
      'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida',
      'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Shahjahanpur', 'Rampur',
    ],
  },
  {
    code: 'UT',
    name: 'Uttarakhand',
    cities: [
      'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh',
      'Pithoragarh', 'Ramnagar', 'Almora', 'Mussoorie', 'Kotdwar', 'Srinagar UK',
    ],
  },
  {
    code: 'WB',
    name: 'West Bengal',
    cities: [
      'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda',
      'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Ranaghat', 'Haldia',
      'Jalpaiguri', 'Raiganj', 'Krishnanagar', 'Bangaon',
    ],
  },
  { code: 'AN', name: 'Andaman and Nicobar Islands', cities: ['Port Blair', 'Car Nicobar', 'Mayabunder'] },
  { code: 'CH', name: 'Chandigarh', cities: ['Chandigarh'] },
  {
    code: 'DN',
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    cities: ['Daman', 'Diu', 'Silvassa'],
  },
  { code: 'DL', name: 'Delhi', cities: ['New Delhi', 'Delhi', 'North Delhi', 'South Delhi'] },
  { code: 'JK', name: 'Jammu and Kashmir', cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Udhampur', 'Kathua'] },
  { code: 'LA', name: 'Ladakh', cities: ['Leh', 'Kargil'] },
  { code: 'LD', name: 'Lakshadweep', cities: ['Kavaratti', 'Agatti'] },
  { code: 'PY', name: 'Puducherry', cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam'] },
]

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(
  path.join(outDir, 'india-states-cities.json'),
  JSON.stringify({ countryCode: 'IN', states })
)
console.log('Wrote india-states-cities.json', states.length, 'states')
