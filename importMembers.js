// importMembers.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://injmaqyfvkbslrfjvvje.supabase.co';
// const supabaseUrl = 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imluam1hcXlmdmtic2xyZmp2dmplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDIyNDEsImV4cCI6MjA2MTkxODI0MX0.o7mbW-iJP7t9_dfOgEy4J9XGsu7z83imNY5S1tnO2LY';

// const supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imluam1hcXlmdmtic2xyZmp2dmplIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjM0MjI0MSwiZXhwIjoyMDYxOTE4MjQxfQ.3Xr9Z4uTP7C1Bq53--Rp06mfPObXhNH48ucvTmtaNrE'; // gunakan service_role (bukan anon key)
const supabase = createClient(supabaseUrl, supabaseKey);

const members = [
  "Komang Triskayana",
  "I Kadek Manu Widiarta",
  "I Gst. Ngurah Juniarta",
  "I Wayan Riskia",
  "I Gd dodi Pratama Yoga",
  "Wyn Pande Widiaadnyana",
  "Kadek Pande Widiyasa",
  "Dw Made Dwi Purnama",
  "Sang Ketut Angga Putra",
  "Kd. Diana Putra",
  "Komang Wisnu Adnyana",
  "I Wayan Adi Sudarsana",
  "Gd Adi Suryantara",
  "Komang Arya Wardana",
  "Kd Gita Wirama",
  "I Wayan Agus Raditya",
  "Wyn Parandika",
  "I Wayan Adi Pradita",
  "I Wayan Giri Nahendra",
  "Dewa Nyoman Angga Putra",
  "Dw Md Krisna D.P.Yoga",
  "Gst. Ngr. Adi Kusuma",
  "Putu Arya Wiguna",
  "Dw Ngk Putu Putra Yasa",
  "Dw Gd Hari Sikesaputra",
  "Km Agus Antara",
  "I Komang Agus Setiawan",
  "I Wayan Megantara",
  "Wyn Aditya",
  "Putu Bayu Adnyana",
  "Komang Parnata",
  "I Wayan Angga Wijaya",
  "Dewa Gede Sulistia",
  "Md Dwi payana Adi Putra",
  "Gst Ngr Piki Prastya",
  "Kadek Artawan",
  "Dw.Ngk.Pt.Dananta Putra W.",
  "Nyoman Mertayasa",
  "Dw Ngk. Putu Gani",
  "Ngk Galang Manacika",
  "Pt Agus Prana Diva Satvika",
  "Ngkan Nym. Wahyu Raditya",
  "Komang Rio Hermawan",
  "Ngk Nyoman Triguna Adi",
  "Gst Ngr Dwitya Mahardika",
  "Pt Arya Pariana Kuamara",
  "Dw Ngk Md Prema Satya Dharma",
  "I Komang Nitia Nanda",
  "Gede Galang Satya",
  "I Wayan Agus Trisnawan",
  "I Komang Sho Putra",
  "Md Agus Yoga Paramerta",
  "I Kadek Ardiana Putra",
  "I Made Putra Wiguna",
  "Nym Arya Sukmawardana",
  "I Made Justin Dhananjaya",
  "Made Dwi Punia Karma",
  "Gst Made A Bimantara",
  "Ngk Pt Nara Kusuma",
  "Dw. Md. Wahyu Widana",
  "Dw Gd Kana Karisma",
  "Wyn Agus Purnadi",
  "Km Yudiarta",
  "I Wayan Pasek Suteja Putra",
  "A. A. Gede Ari Aditya",
  "I Made Kariana",
  "I Made Krisna Dwipayana",
  "Dw Md Wahyu Suputa",
  "Dewa Gede Adi Wiguna",
  "Dw Gd Krisna Putra",
  "Dw Gd Putra Juliawan",
  "Dewa Gede Wahyu Adinata",
  "Dw Gd Adinata",
  "I Gede Genta Arya Sudana",
  "I Ketut Amerta",
  "Dewa Gede Satria Kesuma",
  "Kd Raga Guna Wismaya",
  "Ketut Wiguna",
  "Komang Sukadana",
  "Gusti Ngurah Trisna Udayana",
  "A.A Gd Adi Dalem",
  "Dw Gd Yoga Okayana",
  "Dw Ngk. Md. Puja Dewantara",
];

async function importMembers() {
  const payload = members.map((name) => ({ name }));

  const { data, error } = await supabase.from('members').insert(payload);

  if (error) {
    console.error('❌ Gagal mengimpor data:', error.message);
  } else {
    console.log(`✅ Berhasil mengimpor ${data?.length || 0} anggota`);
  }
  
}

importMembers();
